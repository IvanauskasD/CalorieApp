const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    type: {
        type: Number,
        required: true
    },
    foods: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Food'
        },
        quantity: {
            type: Number
        },
        servings: {
            type: Number
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }

});

module.exports = mongoose.model('Meal', MealSchema);