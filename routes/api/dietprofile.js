const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const Profile = require('../../models/Profile');
const DietProfile = require('../../models/DietProfile');


// @route    GET api/dietprofile/me
// @desc     Get current users diet profile
// @access   Private
router.get('/me', async (req, res) => {
    try {
        const dietprofile = await DietProfile.findOne({
            profile: req.profile
        }).populate('profile');
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
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // destructure the request
        const {
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body;

        // build a profile
        const dietProfileFields = {
            profile: req.profile,
            ...rest
        };

        try {
            // Using upsert option (it creates new doc if no match is found)
            let dietprofile = await DietProfile.findOneAndUpdate(
                { profile: req.profile },
                { $set: dietProfileFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            return res.json(dietprofile)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);


// @route    GET api/dietprofile/profile/:profile_id
// @desc     Get  diet profile by user profile ID
// @access   Public
router.get(
    '/profile/:profile_id',
    checkObjectId('profile_id'),
    async ({ params: { profile_id } }, res) => {
        try {
            const dietprofile = await DietProfile.findOne({
                profile: profile_id
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