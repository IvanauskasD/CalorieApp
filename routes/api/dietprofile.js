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

// @route    GET api/dietprofile/me
// @desc     Get current users diet profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const dietprofile = await DietProfile.findOne({
            user: req.user.id
        }).populate('user');
        if (!dietprofile) {
            return res.status(400).json({ msg: 'There is no diet profile for this user' });
        }

        res.json(dietprofile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/dietprofile
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

        // destructure the request
        const {
            // currentWeight,
            // height,
            // age,
            // gender,
            // bmr,
            // workoutIntensity,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body



        let goalCalculated = {}
        

        // build a profile
        const dietProfileFields = {
            user: req.user.id,
            ...rest
        };

        if (dietProfileFields.gender === 'Male') {
            dietProfileFields.bmr = (10 * dietProfileFields.currentWeight) + (6.25 *
                dietProfileFields.height) - (5 * 23) + 5

            dietProfileFields.calculatedGoal = dietProfileFields.bmr * dietProfileFields.workoutIntensity
            goalCalculated = { calories: dietProfileFields.calculatedGoal}
        }


        try {
            // Using upsert option (it creates new doc if no match is found)
            let dietprofile = await DietProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: dietProfileFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )

            let goal = await Goal.findOneAndUpdate(
                { dietprofile: dietprofile.id },
                { $set: goalCalculated },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            return res.json(dietprofile)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }



    }
);


// @route    GET api/dietprofile/profile/:user_id
// @desc     Get  diet profile by user ID
// @access   Public
router.get(
    '/profile/:user_id',
    checkObjectId('user_id'),
    async ({ params: { user_id } }, res) => {
        try {
            const dietprofile = await DietProfile.findOne({
                user: user_id
            }).populate('profile');
            console.log(dietprofile)
            if (!dietprofile) return res.status(400).json({ msg: 'Diet Profile not found' });

            return res.json(dietprofile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: 'Server error' });
        }
    }
);



module.exports = router;