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
    date: {
        type: Date,
        default: new Date()
    }
});
FoodSchema.index({name: "text"})

const Food = module.exports = mongoose.model('food', FoodSchema);

module.exports.getFoodByName = (foodName, callback) => {
    const query = { name: foodName };
    Food.findOne(query, callback);
};

module.exports.createFood = (food, callback) => {
    food.save(callback);
};