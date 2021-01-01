const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');

const {
    getCurrentProfile,
    createUpdateProfile,
    getAllProfiles,
    getProfileByUserId,
    deleteUser,
    addDietProfile,
    deleteDietProfile
} = require('../../controllers/profiles')

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth, getCurrentProfile)

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post('/',
    auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(), createUpdateProfile)

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public
router.get('/', getAllProfiles)

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get('/user/:user_id', checkObjectId('user_id'), getProfileByUserId)

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, deleteUser)

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
    '/dietProfile',
    auth,
    check('currentWeight', 'Current Weight is required').notEmpty(),
    check('height', 'Height is required').notEmpty(),
    check('goalWeight', 'Goal Weight is required').notEmpty(),
    check('gender', 'Gender is required').notEmpty(),
    check('dateOfBirth', 'Date Of Birth is required').notEmpty(),
    check('goal', 'Goal is required').notEmpty(),
    addDietProfile)

module.exports = router
