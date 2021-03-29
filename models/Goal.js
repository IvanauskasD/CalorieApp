const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    proteinPercent: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    carbsPercent: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    fatPercent: {
        type: Number,
        required: true
    },
    dietprofile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dietprofile'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Goal', GoalSchema);