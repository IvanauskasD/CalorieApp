const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String
  },
  servingSize: {
    type: Number
  },
  calories: {
    type: Number
  },
//   totalFat: {
//     type: Number
//   },
//   saturatedFat: {
//     type: Number
//   },
//   cholesterol: {
//     type: Number
//   },
//   sodium: {
//     type: Number
//   },
//   totalCarbs: {
//     type: Number
//   },
//   sugars: {
//     type: Number
//   },
//   dietaryFiber: {
//     type: Number
//   },
//   protein: {
//     type: Number
//   },
//   salt: {
//     type: Number
//   },
//   vitaminA: {
//     type: Number
//   },
//   vitaminC: {
//     type: Number
//   },
//   calcium: {
//     type: Number
//   },
//   iron: {
//     type: Number
//   },
});

module.exports = mongoose.model('food', FoodSchema);
