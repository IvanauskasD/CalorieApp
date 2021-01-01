const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../middleware/checkObjectId');

const Profile = require('../models/Profile');
const User = require('../models/User');

exports.getCurrentProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
}

exports.createUpdateProfile = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // destructuring the request
    const {
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        // spreading the rest of the fields which don't need to be checked
        ...rest
    } = req.body

    // building the profile
    const profileFields = {
        user: req.user.id,
        ...rest
    }

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

exports.getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
}

exports.getProfileByUserId = async ({ params: { user_id } }, res) => {
    try {
        const profile = await Profile.findOne({
            user: user_id
        }).populate('user', ['name', 'avatar'])

        if (!profile) return res.status(400).json({ msg: 'Profile not found' })

        return res.json(profile)

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ msg: 'Server error' })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        // Remove user posts
        // Remove profile
        // Remove user
        await Promise.all([
            Profile.findOneAndRemove({ user: req.user.id }),
            User.findOneAndRemove({ _id: req.user.id })
        ])

        res.json({ msg: 'User deleted' })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
}

exports.addDietProfile = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.dietProfile.unshift(req.body)
        await profile.save()
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
}

exports.deleteDietProfile = async(req, res) => {
    try{
        const foundProfile = await Profile.findOne({user: req.user.id})

        foundProfile.dietProfile = foundProfile.dietProfile.filter(
            (diet) => diet._id.toString() !== req.params.diet_id 
        )

        await foundProfile.save()
        return res.status(200).json(foundProfile)
        
    } catch(err){
        console.error(error)
        return res.status(500).json({ msg: 'Server error' })
    }
}