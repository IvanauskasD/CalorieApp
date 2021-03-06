const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    approved: {
        type: Number,
    },
    votedOnBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    votedAgainstBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
    // date: {
    //     type: Date,
    //     default: new Date()
    // }
});

const Food = module.exports = mongoose.model('Food', FoodSchema);