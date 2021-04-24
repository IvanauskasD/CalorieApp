const mongoose = require('mongoose');

const SportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    caloriesBurned: {
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
});

module.exports = mongoose.model('Sport', SportSchema);