const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const DietProfile = require('../../models/DietProfile');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post(
  '/',
  auth,
  check('inspirations', 'test is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // destructure the request
    const {
      inspirations,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;

    // build a profile
    const profileFields = {
      user: req.user.id,
      inspirations: Array.isArray(inspirations)
        ? inspirations
        : inspirations.split(',').map((inspiration) => ' ' + inspiration.trim()),
      ...rest
    };

    // Building socialFields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook }

    // normalizing social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true })
    }

    profileFields.social = socialFields

    try {
      // Using upsert option (it creates new doc if no match is found)
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      return res.json(profile)

    } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server Error')
    }
  }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
  '/user/:user_id',
  checkObjectId('user_id'),
  async ({ params: { user_id } }, res) => {
    try {
      const profile = await Profile.findOne({
        user: user_id
      }).populate('user', ['name', 'avatar']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

// @route    DELETE api/profile
// @desc     Delete profile, user
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      DietProfile.findOneAndRemove({ profile: req.profile }),
      Profile.findOneAndRemove({ user: req.user.id }),
      User.findOneAndRemove({ _id: req.user.id })
    ]);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/profile/dietProfile
// // @desc     Add diet profile
// // @access   Private
// router.put(
//   '/dietProfile',
//   auth,
//   async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() })
//     }
//     try {
//       const profile = await Profile.findOne({ user: req.user.id })
//       profile.dietProfile.unshift(req.body)
//       await profile.save()
//       res.json(profile);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error')
//     }
//   }
// );

// // @route    DELETE api/profile/dietProfile/:prf_id
// // @desc     Delete Diet Profile from profile
// // @access   Private

// router.delete('/dietProfile/:prf_id', auth, async (req, res) => {
//   try {
//     const foundProfile = await Profile.findOne({ user: req.user.id })

//     foundProfile.dietProfile = foundProfile.dietProfile.findOneAndRemove(
//       (prf) => prf._id.toString() === req.params.prf_id
//     )
//     // foundProfile.dietProfile = foundProfile.dietProfile.filter(
//     //   (prf) => prf._id.toString() !== req.params.prf_id
//     // )

//     await foundProfile.save()
//     return res.status(200).json(foundProfile)

//   } catch (err) {
//     console.error(error)
//     return res.status(500).json({ msg: 'Server error' })
//   }
// });

module.exports = router;