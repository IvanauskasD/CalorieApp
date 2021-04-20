const mongoose = require('mongoose');

const MealSuggestionSchema = new mongoose.Schema({
    suggestion: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Food'
        },
        quantity: {
            type: Number
        },
        type: {
            type: String,
            required: true
        },
    }],
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('MealSuggestion', MealSuggestionSchema);