const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const Profile = require('../../models/Profile');
const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const Goal = require('../../models/Goal');


// @route    POST api/goal
// @desc     Calculate and update goal
// @access   Private
router.post(
    '/',
    auth,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            ...rest
        } = req.body

        const test = {
            dieprofile: req.body.dietprofile,
            ...rest
        }

        

        test.carbs = test.calories / 2
        test.carbs = test.carbs / 4

        test.protein = test.calories * test.proteinPercent
        test.protein = test.protein / 4

        test.fat = test.calories * test.fatPercent
        test.fat = test.fat / 9
    

        try {
            // Using upsert option (it creates new doc if no match is found)
            let setGoal = await Goal.findOneAndUpdate(
                { dietprofile: req.body.dietprofile },
                { $set: test },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            return res.json(setGoal)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);


// @route    GET api/goal/me
// @desc     Get current goals
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const dp = await DietProfile.findOne({user: req.user.id})
        let goal = {};
        if(dp){
        goal = await Goal.findOne({dietprofile: dp._id}).populate('dietprofile');
        }
        if (!goal) {
            return res.status(400).json({ msg: 'There is no goals for this user' });
        }

        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;