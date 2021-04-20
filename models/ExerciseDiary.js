const mongoose = require('mongoose');

const ExerciseDiarySchema = new mongoose.Schema({
    dietprofile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dietprofile'
    },
    name: {
        calories: {
            type: Number,
            required: true
        }
    },
    date: {
        type: Date,
        default: new Date()
    },
    wastedCalories: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('ExerciseDiary', ExerciseDiarySchema);