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
const MealSuggestion = require('../../models/MealSuggestion')


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
            const food = await Food.findOne({ name: req.body.suggestion.name })

            const {
                ...rest
            } = req.body

            const test = {
                ...rest
            }

            let meal = new MealSuggestion({
                suggestion: [{
                    _id: food,
                    quantity: req.body.quantity,
                    type: req.body.type,
                }],
                date: new Date(req.body.date),
            })

            var start = new Date(req.body.date);
            start.setHours(0, 0, 0, 0);

            var end = new Date(req.body.date);
            end.setHours(23, 59, 59, 999);
            // let mealz = await Meal.create(meal)
            let mealz = await MealSuggestion.create(meal)


            return res.json(mealz)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);


module.exports = router;