const mongoose = require('mongoose');

const SportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    caloriesBurned: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Sport', SportSchema);