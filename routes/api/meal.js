const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const Goal = require('../../models/Goal');
const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const Food = require('../../models/Food');
const Meal = require('../../models/Meal')
const foodDiary = require('../../models/FoodDiary');
const FoodDiary = require('../../models/FoodDiary');

// // @route    POST api/goal
// // @desc     Create or update diet profile
// // @access   Private
// router.post(
//     '/',
//     auth,
//     async (req, res) => {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() })
//         }

//         // destructure the request
//         const {
//             calories,
//             protein,
//             carbs,
//             fat,
//             ...rest
//         } = req.body

//         // build a profile
//         const goalFields = {
//             dietprofile: req.body.dietprofile,
//             ...rest
//         };
//         try {
//             // Using upsert option (it creates new doc if no match is found)
//             let setGoal = await Goal.findOneAndUpdate(
//                 { dietprofile: req.body.dietprofile },
//                 { $set: goalFields },
//                 { new: true, upsert: true, setDefaultsOnInsert: true }
//             )
//             return res.json(setGoal)

//         } catch (err) {
//             console.error(err.message)
//             return res.status(500).send('Server Error')
//         }
//     }
// );

// @route    POST api/goal
// @desc     Calculate goal
// @access   Private
router.post(
    '/',
    auth,
    async (req, res) => {

        // Food.findOne({name: req.body.food.name}, (err, food) => {
        //     if (err) {
        //         return res.status(500).json({
        //             msg: 'An error while adding food'
        //         })
        //     }

        //     User.findOne({_id: req.body.user}, (err, user) => {
        //         if (user.meals.length) {
        //             let startOfDay = new Date(req.body.date).setHours(0, 0, 0, 0);
        //             // startOfDay + 1 day - 1 ms
        //             let endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

        //             for (let i = user.meals.length - 1; i >= 0; i--) {
        //                 const meal = user.meals[i];

        //                 // if meal date is after desired day => go to next meal
        //                 if (meal.date > endOfDay) continue;
        //                 // if meal date is before desired day => no meal => go to create meal
        //                 if (meal.date < startOfDay) break;

        //                 if (meal.type === req.body.type) {

        //                     user.meals[i].foods.push({
        //                         _id: food._id,
        //                         quantity: req.body.quantity
        //                     })
        //                     user.save((err) =>{
        //                         if(err) {
        //                             return res.status(500).json({
        //                                 message: 'gg nepaejo'
        //                             })
        //                         } else{
        //                             return res.json({message: 'food added'})
        //                         }
        //                     })
                    
        //                     return;
        //                 }
        //             }
        //         }
        //         let meal = new Meal({
        //             type: req.body.type,
        //             foods: [{
        //                 _id: food._id,
        //                 quantity: req.body.quantity
        //             }],
        //             date: new Date(req.body.date)
        //         });
        //         console.log(meal)

        //         user.meals.push(meal)
        //         user.meals.sort((a,b) => {return a.date - b.date})

        //         user.save((err) => {
        //             if(err) {
        //                 return res.status(500).json({
        //                     message: 'gg ir vel'
        //                 })
        //             } else {
        //                 return res.json({
        //                     message: 'meal added'
        //                 })
        //             }
        //         })

        //     });
        // });



        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        try {
            const food = await Food.findOne({ name: req.body.food.name })
            const user = await User.findOne({ _id: req.body.user }).
                populate({ path: 'meals.foods._id', model: Food })


            
            let meal = new Meal({
                type: req.body.type,
                foods: [{
                    _id: food,
                    quantity: req.body.quantity
                }],
                date: new Date(req.body.date)
            })


            const {
                ...rest
            } = req.body

            const test = {
                ...rest
            }

            var start = new Date(req.body.date);
            start.setHours(0,0,0,0);
            
            var end = new Date(req.body.date);
            end.setHours(23,59,59,999);
            // let mealz = await Meal.create(meal)
            let mealz = await Meal.findOneAndUpdate(
                {date: {$gte: start, $lt: end}, type: req.body.type},
                { $push: {
                    foods: [{
                        _id: food,
                        quantity: req.body.quantity,
                        $position: 0
                    }],
                    // date: req.body.date,
                    // type: req.body.type
                },date: req.body.date, type: req.body.type },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )



            user.meals.addToSet(mealz)

            user.save()

            return res.json(mealz)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);


router.post(
    '/test',
    auth,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        try {
            const user = await User.findOne({ _id: req.body.user }).
                populate({ path: 'meals.foods._id', model: Food })

            const dietprofile = await DietProfile.findOne({user: user._id}) 
            
            const goal = await Goal.findOne({dietprofile: dietprofile._id})
                
                let summary = [];
                let meals = [];
                let startOfDay = new Date(req.body.date);
                let goalz
                let diary
                let endOfDay = new Date(new Date(startOfDay).getTime() + 60 * 60 * 24 * 1000 - 1);
                    if (goal.date < endOfDay) {
                        goalz = user.goal;

                        diary = await FoodDiary.findOneAndUpdate(
                            {dietprofile: dietprofile._id},
                            { $set: {
                                name: {
                                    calories: goal.calories,
                            protein: goal.protein, carbs: goal.carbs, fat: goal.fat
                                }
                            }},
                            { new: true, upsert: true, setDefaultsOnInsert: true }
                        )

                        // summary.push({
                        //     name: 'Daily Goal', calories: goal.calories,
                        //     protein: goal.protein, carbs: goal.carbs, fat: goal.fat
                        // });
                    }

                // let calories = 10, protein = 10, carbs = 10, fat = 10;
                // if (goal) {
                //     diary = await FoodDiary.findOneAndUpdate(
                //         {dietprofile: dietprofile._id},
                //         { $set: {
                //             name: {
                //                 calories: goal.calories - calories,
                //                 protein: goal.protein - protein, carbs: goal.carbs - carbs, fat: goal.fat - fat                            }
                //         }},
                //         { new: true, upsert: true, setDefaultsOnInsert: true }
                //     )                   
                // }
              
                
                res.json({
                    diary
                });

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);

router.post(
    '/test1',
    auth,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        try {
            const user = await User.findOne({ _id: req.body.user }).
                populate({ path: 'meals.foods._id', model: Food })

            const dietprofile = await DietProfile.findOne({user: user._id}) 
            
            const goal = await Goal.findOne({dietprofile: dietprofile._id})
                
                let startOfDay = new Date(req.body.date);
                let goalz
                let diary
                let endOfDay = new Date(new Date(startOfDay).getTime() + 60 * 60 * 24 * 1000 - 1);
                let calories = 0, protein = 10, carbs = 10, fat = 10;
                
                var start = new Date(req.body.date);
                start.setHours(0,0,0,0);
                
                var end = new Date(req.body.date);
                end.setHours(23,59,59,999);

                
                    goalz = user.goal;
                    for(let i=user.meals.length - 1; i>= 0; i--)
                    {
                        let meal = user.meals[i]

                        let mealq = await Meal.findById(meal)
                        if(mealq.date >= start && mealq.date <= end){
                        for(let k=0;k< mealq.foods.length;k++ )
                        {
                            let food = mealq.foods[k]
                            let tt = mealq.foods[k].quantity
                            
                            let foodz = await Food.findById(food)
                            //console.log(foodz.calories + ' ' + tt)
                            calories += (foodz.calories * tt)
                        }}
                    }
                

                console.log(calories)


/*
pagrindiniai skaiciavimai kaip ir veikia.
problema gali buti su datom, tad pushinant fDiary filtruoti
pagal siandienine data. galbut is viso tiksliau butu
meal pries skaiciavimus atsifiltruoti i siandienos diena, 
tad pushinant fDiary nekiltu problemu.
*/




                    //     diary = await FoodDiary.findOneAndUpdate(
                    //         {date: {$gte: start, $lt: end}},
                    //         { $set: {
                    //             name: {
                    //          calories: goal.calories - calories,
                    //          protein: goal.protein - protein, 
                    //          carbs: goal.carbs - carbs, 
                    //          fat: goal.fat - fat
                    // }, date: req.body.date
                    //         },
                    //     },
                    //         { new: true, upsert: true, setDefaultsOnInsert: true }
                    //     )
                    // }
                
                // res.json({
                //     diary
                // });

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);


module.exports = router;