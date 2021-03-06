const mongoose = require('mongoose');

const DietProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    meals: [
        {
            type: mongoose.Schema.Types.Object,
            ref: 'Meal'
        }
    ],
    exercises: [
        {
            type: mongoose.Schema.Types.Object,
            ref: 'Exercise'
        }
    ],
    currentWeight: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        //      required: true
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
    workoutWeek: {
        type: Number
    },
    workoutDay: {
        type: Number
    },
    bmr: {
        type: Number,
    },
    workoutIntensity: {
        type: Number,
        required: true
    },
    calculatedGoal: {
        type: Number
    },
    expectations: {
        type: Number
    },
    expectationTime: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('dietprofile', DietProfileSchema);