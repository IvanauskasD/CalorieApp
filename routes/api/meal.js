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
const FoodDiary = require('../../models/FoodDiary');

const moment = require('moment')

// @route    POST api/goal
// @desc     Calculate goal
// @access   Private
router.post(
    '/',
    auth,
    async (req, res) => {


        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }


        try {
            const food = await Food.findOne({ name: req.body.food.name })
            const dietprofile = await DietProfile.findOne({ user: req.body.user })



            let meal = new Meal({
                type: req.body.type,
                foods: [{
                    _id: food,
                    quantity: req.body.quantity,
                    servings: req.body.servings
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
            start.setHours(0, 0, 0, 0);

            var end = new Date(req.body.date);
            end.setHours(23, 59, 59, 999);
            // let mealz = await Meal.create(meal)
            let mealz = await Meal.findOneAndUpdate(
                { date: { $gte: start, $lt: end }, type: req.body.type, user: req.body.user },
                {
                    $push: {
                        foods: [{
                            _id: food,
                            quantity: req.body.quantity,
                            servings: req.body.servings,
                            $position: 0
                        }],
                        // date: req.body.date,
                        // type: req.body.type
                    }, date: req.body.date, type: req.body.type, user: req.body.user
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )

            let dP = {
                _id: '',
                quantity: '',
                servings: ''
            }

            dP._id = meal.foods[0]._id._id
            dP.quantity = meal.foods[0].quantity
            dP.servings = meal.foods[0].servings
            let dW = {}

            if (dietprofile.meals.length === 0) {
                dietprofile.meals.addToSet(mealz)

                dietprofile.save()
            }
            else {
                for (let i = dietprofile.meals.length - 1; i >= 0; i--) {
                    if ((dietprofile.meals[i]._id).toString() === (mealz._id.toString())){
                        dW = await DietProfile.findOneAndUpdate({ user: req.body.user, 'meals._id': mealz._id },
                            {
                                $push: {
                                    'meals.$.foods': dP
                                }
                            })
                            break
                    }
                    else {
                        dietprofile.meals.addToSet(mealz)

                        dietprofile.save()
                        break;
                    }
                }
            }
            
        
            //     for (let i = dietprofile.meals.length - 1; i >= 0; i--) {
            //         if ((dietprofile.meals[i]._id).toString() === (mealz._id.toString())){
            //             console.log(dietprofile.meals[i])
            //         }}

                    // dW = await DietProfile.findOne({ user: req.body.user, 'meals._id': mealz._id })
                    // console.log(dW)

            // if(dietprofile.meals.length === 0 && dietprofile.meals.)
            // {

            // }
            // else {
            //                 let dW = await DietProfile.findOneAndUpdate({ user: req.body.user, 'meals.foods': dP },
            // {$push: {
            //     'meals.$.foods': dP
            // }})
            // }





            // for (let i = dietprofile.meals.length - 1; i >= 0; i--) {
            //     let qw = (dietprofile.meals[i]._id).toString()
            //     let wq = (mealz._id).toString()
            //     if(qw  === wq)
            //     {
            //         dietprofile.meals[i].foods.unshift(dP)
            //         dietprofile.markModified('meals.foods._id')
            //         await dietprofile.save()
            //         console.log(dietprofile.meals[i])

            //     }
            //     else {
            //         dietprofile.meals.addToSet(mealz)

            //         await dietprofile.save()
            //     }
            // }

            //   dietprofile.meals.addToSet(mealz)

            //   dietprofile.save()

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



            const dietprofile = await DietProfile.findOne({ user: user._id })

            const goal = await Goal.findOne({ dietprofile: dietprofile._id })

            let summary = [];
            let meals = [];
            let startOfDay = new Date(req.body.date);
            let goalz
            let diary
            let endOfDay = new Date(new Date(startOfDay).getTime() + 60 * 60 * 24 * 1000 - 1);
            if (goal.date < endOfDay) {
                goalz = user.goal;

                diary = await FoodDiary.findOneAndUpdate(
                    { dietprofile: dietprofile._id },
                    {
                        $set: {
                            name: {
                                calories: goal.calories,
                                protein: goal.protein, carbs: goal.carbs, fat: goal.fat
                            }
                        }
                    },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                )


            }



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
            const dietprofile = await DietProfile.findOne({ user: req.body.user }).
                populate({ path: 'meals.foods._id', model: Food })

            //const dietprofile = await DietProfile.findOne({ user: user._id })

            const goal = await Goal.findOne({ dietprofile: dietprofile._id })

            let goalz
            let diary
            let calories = 0, protein = 0, carbs = 0, fat = 0;

       
            var start = new Date(req.body.date);
            start.setHours(3, 0, 0, 0);
    
            var end = new Date(req.body.date);
            end.setHours(26, 59, 59, 999);

            // const meall = await Meal.findOne()


            goalz = goal;
            for (let i = dietprofile.meals.length - 1; i >= 0; i--) {
                let meal = dietprofile.meals[i]

                let mealq = await Meal.findById(meal)
                if (mealq.date >= start && mealq.date <= end) {
                    for (let k = 0; k < mealq.foods.length; k++) {
                        let food = mealq.foods[k]
                        let tt = mealq.foods[k].quantity

                        let foodz = await Food.findById(food)

                        //console.log(foodz.calories + ' ' + tt)
                        calories += (foodz.calories * tt)
                        protein += (foodz.protein * tt)
                        carbs += (foodz.carbs * tt)
                        fat += (foodz.fat * tt)
                    }
                }
            }


            let calConsumed
            let proteinConsumed
            let carbsConsumed
            let fatConsumed

            calConsumed = goalz.calories - calories
            proteinConsumed = goalz.protein - protein
            carbsConsumed = goalz.carbs - carbs
            fatConsumed = goalz.fat - fat




            diary = await FoodDiary.findOneAndUpdate(
                { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
                {
                    $set: {
                        name: {
                            calories: calories,
                            protein: protein,
                            carbs: carbs,
                            fat: fat
                        },
                    }, date: req.body.date,
                    consumedCalories: calConsumed,
                    consumedProtein: proteinConsumed,
                    consumedCarbs: carbsConsumed,
                    consumedFat: fatConsumed
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )



            res.json({
                diary
            });

            /*
            pagrindiniai skaiciavimai kaip ir veikia.
            problema gali buti su datom, tad pushinant fDiary filtruoti
            pagal siandienine data. galbut is viso tiksliau butu
            meal pries skaiciavimus atsifiltruoti i siandienos diena, 
            tad pushinant fDiary nekiltu problemu.
            */

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);


router.get(
    '/meals',
    auth,
    async (req, res) => {
        let query = {}
        if (req.query.date)
            query.date = req.query.date


        let dd = new Date(query.date)

        var start = new Date(2021, 2, 30);
        var end = new Date(2021, 3, 0);

        let lol = 86400000
        let lol1 = 86400000
        // if(query.date === null)
        // {
        //     lol = new Date(new Date().getTime())

        //     lol1 = new Date(new Date().getTime() + lol1)

        // }
        // else{
        lol = new Date(new Date(query.date).getTime())

        lol1 = new Date(new Date(query.date).getTime() + lol1)

        // }


        console.log(lol)
        console.log(lol1)
        const meal = await Meal.find({ date: { $gte: lol, $lte: lol1 } })

        return res.json(meal);
    }
)

router.get(
    '/mealz',
    auth,
    async (req, res) => {
        let query = {}
        if (req.query.date)
            query.date = req.query.date


        let dd = new Date(query.date)

        var start = new Date(2021, 2, 30);
        var end = new Date(2021, 3, 0);

        let lol = 86400000
        let lol1 = 86400000
        // if(query.date === null)
        // {
        //     lol = new Date(new Date().getTime())

        //     lol1 = new Date(new Date().getTime() + lol1)

        // }
        // else{
        lol = new Date(new Date(query.date).getTime())

        lol1 = new Date(new Date(query.date).getTime() + lol1)

        // }

        let fodz
        //  console.log(lol)
        //  console.log(lol1)
        const meal = await Meal.find({ date: { $gte: lol, $lte: lol1 }, user: req.user.id }).populate('foods._id')

        //  console.log(meal.foods)
        // for (let i = meal.foods.length - 1; i >= 0; i--) {
        //     let mealq = meal.foods[i]

        //     fodz = await Food.findById(mealq)

        // }

        return res.json(meal);
    }
)

router.get(
    '/meal/:id',
    auth,
    async (req, res) => {

        const match = await Meal.findById(req.params.id).populate("foods");

        return res.json(match);
    }
)

router.post('/:meal_id&:number', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.user }).
            populate({ path: 'meals.foods._id', model: Food })

        const found = await Meal.findById({ _id: req.params.meal_id })
        const dietprofile = await DietProfile.findOne({ user: user._id })
        const goal = await Goal.findOne({ dietprofile: dietprofile._id })

       
        var start = new Date(req.body.date);
        start.setHours(3, 0, 0, 0);

        var end = new Date(req.body.date);
        end.setHours(26, 59, 59, 999);
        
        let subt = found.foods[req.params.number]
        
        let deletedFood = await Food.findById({ _id: subt._id })
        let goalz = goal
        let calories = 0, protein = 0, carbs = 0, fat = 0
        let daugyba = subt.quantity * subt.servings

        calories = deletedFood.calories * daugyba
        protein = deletedFood.protein * daugyba
        carbs = deletedFood.carbs * daugyba
        fat = deletedFood.fat * daugyba
        

        let diaris = await FoodDiary.find({ date: { $gte: start, $lt: end }, dietprofile: dietprofile._id })
        console.log(end)
        let calories1 = 0, protein1 = 0, carbs1 = 0, fat1 = 0

        calories1 = diaris[0].name.calories
        protein1 = diaris[0].name.protein
        carbs1 = diaris[0].name.carbs
        fat1 = diaris[0].name.fat

        let calories0 = calories1.toFixed(1) - calories
        let protein0 = protein1.toFixed(1) - protein
        let carbs0 = carbs1.toFixed(1) - carbs
        let fat0 = fat1.toFixed(1) - fat

        let calories2 = 0, protein2 = 0, carbs2 = 0, fat2 = 0

        calories2 = diaris[0].consumedCalories
        protein2 = diaris[0].consumedProtein
        carbs2 = diaris[0].consumedCarbs
        fat2 = diaris[0].consumedFat
        

        let calories00 = calories2 + calories
        let protein00 = protein2 + protein
        let carbs00 = carbs2 + carbs
        let fat00 = fat2 + fat

      console.log(diaris)
        
        let diarisFinal = await FoodDiary.findOneAndUpdate({ date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
            {
                $set: 
                {
                    name: {
                    calories: calories0.toFixed(1),
                    protein: protein0.toFixed(1),
                    carbs: carbs0.toFixed(1),
                    fat: fat0.toFixed(1)
                }}, date: req.body.date,
                consumedCalories: calories00.toFixed(1),
                consumedProtein: protein00.toFixed(1),
                consumedCarbs: carbs00.toFixed(1),
                consumedFat: fat00.toFixed(1)
            }, { new: true, upsert: true, setDefaultsOnInsert: true })

 

            let dP = {
                _id: '',
                quantity: '',
                servings: ''
            }

            dP._id = found.foods[0]._id._id
            dP.quantity = found.foods[0].quantity
            dP.servings = found.foods[0].servings
            let test = []
            let dW = {}

         for (let i = 0; i < dietprofile.meals.length; i++) {
              if ((req.params.meal_id).toString() === (dietprofile.meals[i]._id.toString())) {
                  dietprofile.meals[i].foods.splice(req.params.number, 1)
                  dietprofile.markModified('meals')
                  dietprofile.save()
                }
        }
            
        found.foods.splice(req.params.number, 1)
        found.save()
        // /\

                //   if(dietprofile.meals[i].foods.length === 0){
                //     dietprofile.meals.splice(i, 1)
                //     dietprofile.save()
                //   }

                // dW = await DietProfile.findOneAndUpdate({ user: req.body.user },
                // {
                //     $pull: {
                //         'meals.$[dd].foods.$[req]' : found.foods[req.params.number]
                //     }
                // }, {arrayFilters: [{dd: i}, {req: req.params.number}]})
                // console.log(dW.meals[i])
           

        //         dW = await DietProfile.findOneAndUpdate({ user: req.body.user, 'meals._id': found._id },
        //         {
        //             $unset: {
        //                 ww : dP
        //             }
        //         })
        //         dW = await DietProfile.findOneAndUpdate({ user: req.body.user, 'meals._id': found._id },
        //         {
        //             $pull: {
        //                 ww: null
        //             }
        //         })

        //     else
        //         console.log('no')

        // }

        // if(found.foods.length === 0) {
        //     found.remove({ _id: req.params.meal_id })
        // }


        // let tQ = await DietProfile.findOne({ user: req.body.user })
        // if (tQ.meals)
        //     console.log(tQ)

        //   db.test.find({}, {_id: 0, s: {$elemMatch: {sec: '52b9830cadaa9d2732000005'}}})



        //  dietprofile.meals.splice(req.params.number, 1)
        //  dietprofile.save()



        //  if(found.foods.length === 0) {
        //      found.remove({ _id: req.params.meal_id })
        //  }






        res.json({ msg: 'Meal removed' });
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});


module.exports = router;