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

// @route    POST api/meal
// @desc     Add meal
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

            if(food === null) {
                return res.status(500).send('No such food exists!')

            }

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


            var start = new Date(req.body.date);
            start.setHours(0, 0, 0, 0);

            var end = new Date(req.body.date);
            end.setHours(23, 59, 59, 999);
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

            return res.json(mealz)

    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
    }
);

// @route    GET api/mealz:date?
// @desc     Get meals for specific date
// @access   Private
router.get(
    '/mealz',
    auth,
    async (req, res) => {
        let query = {}
        if (req.query.date)
            query.date = req.query.date


        let dd = new Date(query.date)

        let moreDate = 86400000
        let lessDate = 86400000

        moreDate = new Date(new Date(query.date).getTime())

        lessDate = new Date(new Date(query.date).getTime() + lessDate)


        const meal = await Meal.find({ date: { $gte: moreDate, $lte: lessDate }, user: req.user.id }).populate('foods._id')

        return res.json(meal);
    }
)

// @route    GET api/meal/:id
// @desc     Get meal by ID
// @access   Private
router.get(
    '/meal/:id',
    auth,
    async (req, res) => {

        const match = await Meal.findById(req.params.id).populate("foods");

        return res.json(match);
    }
)

// @route    POST api/:meal_id&:number
// @desc     Add meal to current date and diary, recalculates food diary
// @access   Private
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
        let calories = 0, protein = 0, carbs = 0, fat = 0
        let quantityAndServings = subt.quantity * subt.servings

        calories = deletedFood.calories * quantityAndServings
        protein = deletedFood.protein * quantityAndServings
        carbs = deletedFood.carbs * quantityAndServings
        fat = deletedFood.fat * quantityAndServings
        

        let diaris = await FoodDiary.find({ date: { $gte: start, $lt: end }, dietprofile: dietprofile._id })
       
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
     
        res.json({ msg: 'Meal removed' });
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});


module.exports = router;