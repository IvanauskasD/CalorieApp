const mongoose = require('mongoose');

const CompletedMeals = new mongoose.Schema({
    name: {
        type: String
    },
    foods: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Food'
        },
        quantity: {
            type: Number
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CompletedMeals', CompletedMeals);