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
// @desc     Create or update diet profile
// @access   Private
router.post(
    '/',
    auth,
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // // build a profile
        // const newGoal = {
        //     dietprofile: req.dietprofile.id,
        //     ...rest
        // };
        try {
            console.log(req.body)
            // Using upsert option (it creates new doc if no match is found)
            let setGoal = await Goal.findOneAndUpdate(
                { dietprofile: req.body.dietprofile },
                { $set: req.body },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            return res.json(setGoal)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);

// @route    GET api/goal/profile/:dietprofile_id
// @desc     Get  diet profile by user ID
// @access   Public
router.get(
    '/profile/:dietprofile_id',
    checkObjectId('dietprofile_id'),
    async ({ params: { dietprofile_id } }, res) => {
        try {
            const goal = await Goal.findOne({
                dietprofile: dietprofile_id
            }).populate('profile');
            console.log(goal)
            if (!goal) return res.status(400).json({ msg: 'Goal not found' });

            return res.json(goal);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route    GET api/goal/me
// @desc     Get current goals
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const goal = await Goal.findOne({
            dietprofile: req.dietprofile
        }).populate('dietprofile');
        if (!goal) {
            return res.status(400).json({ msg: 'There is no diet profile for this user' });
        }

        res.json(goal);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;