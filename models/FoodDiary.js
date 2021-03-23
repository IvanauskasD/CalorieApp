const mongoose = require('mongoose');

const FoodDiarySchema = new mongoose.Schema({
    mealTypes: {
        type: Array,
        default: ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
    },
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
    foods: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'food'
        },
        quantity: {
            type: Number
        }
    }],
    dietprofile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dietprofile'
    },
});

module.exports = mongoose.model('foodDiary', FoodDiarySchema);