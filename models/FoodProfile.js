const mongoose = require('mongoose');

const FoodProfileSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'food'
    },
    dietprofile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dietprofile'
    },
    category: {
        type: Number,
        required: true
    },
    quantityOfFood: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('foodprofile', FoodProfileSchema);