const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  meals: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal'
    }
  ],
  mealTypes: {
      type: Array,
      default: [0, 1, 2, 3]
  }
});

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  const query = { username: username };
  User.findOne(query, callback)
      .populate({ path: 'meals.foods._id', model: 'Food' });
};

module.exports.addGoal = (newGoal, user, callback) => {
  let currentGoalDate = user.goals.length ? user.goals[user.goals.length - 1].date.setHours(0, 0, 0, 0) : null;
  if (currentGoalDate === new Date().setHours(0, 0, 0, 0)) {
      user.goals.pull(user.goals[user.goals.length - 1]);
  }
  user.goals.push(newGoal);
  user.save(callback);
};

module.exports.addMeal = (newMeal, user, callback) => {
  user.meals.push(newMeal);
  user.meals.sort((a, b) => { return a.date - b.date; });

  user.save(callback);
};

module.exports.addFood = (food, quantity, mealIndex, user, callback) => {
  user.meals[mealIndex].foods.push({
      _id: food._id,
      quantity: quantity
  });
  user.save(callback);
};

module.exports = mongoose.model('user', UserSchema);