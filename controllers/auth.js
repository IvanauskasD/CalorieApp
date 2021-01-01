const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const { validationResult } = require('express-validator')

const User = require('../models/User')


exports.getUserByToken = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
    if (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }

}


exports.getAuthToken = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: error.array() })
    }

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400)
                .json({ errors: [{ msg: 'Invalid Credentails' }] })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtSecret'),
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err
                res.json({ token })
            })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
}