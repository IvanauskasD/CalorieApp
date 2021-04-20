const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    typeExercise: {
        type: String,
        required: true
    },
    sports: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Sport'
        },
        quantity: {
            type: Number
        },
        calories: {
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
    // noOfSets: {
    //     type: Number,
    // },
    // repetitionsPerSet: {
    //     type: Number,
    // },
    // weightPerSet: {
    //     type: Number,
    // },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);