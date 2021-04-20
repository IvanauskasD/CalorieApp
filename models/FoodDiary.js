const mongoose = require('mongoose');

const FoodDiarySchema = new mongoose.Schema({
    dietprofile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dietprofile'
    },
    name: {
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
    },
    consumedCalories: {
        type: Number,
        required: true
    },
    consumedProtein: {
        type: Number,
        required: true
    },
    consumedCarbs: {
        type: Number,
        required: true
    },
    consumedFat: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model('foodDiary', FoodDiarySchema);