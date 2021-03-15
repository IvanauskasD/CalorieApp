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
    carbs: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
    dietprofile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dietprofile'
    },
});

module.exports = mongoose.model('Goal', GoalSchema);