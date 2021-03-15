const mongoose = require('mongoose');

const DietProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    currentWeight: {
        type: Number,
        required: true
    },
    age: {
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
    bmr :{
        type: Number,
    },
    workoutIntensity: {
        type: Number,
        required: true
    },
    calculatedGoal: {
        type: Number
    },
})

module.exports = mongoose.model('dietprofile', DietProfileSchema);