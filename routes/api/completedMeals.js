const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const DietProfile = require('../../models/DietProfile');
const CompleteMeals = require('../../models/CompleteMeals');
const Food = require('../../models/Food');


router.post(
    '/',
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const foodz = await Food.findOne({ name: req.body.foods.fName })
            const {
                ...rest
            } = req.body

            const test = {
                ...rest
            }
            // Using upsert option (it creates new doc if no match is found)
            let food = await CompleteMeals.findOneAndUpdate(
                { name: req.body.name },
                {
                    $set: {
                        foods: {
                            _id: foodz,
                            quantity: req.body.foods.quantity,

                        }, name: req.body.name, date: req.body.date
                    }
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            return res.json(food)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);

module.exports = router;