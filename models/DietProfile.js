const mongoose = require('mongoose');

const DietProfileSchema = new mongoose.Schema({
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    currentWeight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    goalWeight: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    workoutWeek: {
        type: Number
    },
    workoutDay: {
        type: Number
    },
    goal: {
        type: String
    }
})

module.exports = mongoose.model('dietprofile', DietProfileSchema);