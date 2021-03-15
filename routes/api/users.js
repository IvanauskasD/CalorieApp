const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      user = new User({
        name,
        email,
        avatar,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);




router.post(
  '/add-food',
  async (req, res) => {
    Food.getFoodByName(req.body.food.name, (err, food) => {
      if (err) {
          return res.status(500).json({
              message: 'An error occured while adding food.'
          });
      }

      if (!food) {
          food = new Food({
              name: req.body.food.name,
              calories: req.body.food.calories,
              protein: req.body.food.protein,
              carbs: req.body.food.carbs,
              fat: req.body.food.fat
          });
          Food.createFood(food, (err) => {
              if (err) {
                  return res.status(500).json({
                      message: 'An error occured while adding food.'
                  });
              }
          });
      }

      User.getUserByUsername(req.session.username, (err, user) => {
          if (user.meals.length) {
              let startOfDay = new Date(req.body.date).setHours(0, 0, 0, 0);
              // startOfDay + 1 day - 1 ms
              let endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

              for (let i = user.meals.length - 1; i >= 0; i--) {
                  const meal = user.meals[i];

                  // if meal date is after desired day => go to next meal
                  if (meal.date > endOfDay) continue;
                  // if meal date is before desired day => no meal => go to create meal
                  if (meal.date < startOfDay) break;

                  if (meal.type === req.body.type) {
                      User.addFood(food, req.body.quantity, i, user, (err) => {
                          if (err) {
                              return res.status(500).json({
                                  message: 'An error occured while adding food.'
                              });
                          } else {
                              return res.json({
                                  message: 'Food added.'
                              });
                          }
                      });
                      return;
                  }
              }
          }

          let meal = new Meal({
              type: req.body.type,
              foods: [{
                  _id: food,
                  quantity: req.body.quantity
              }],
              date: new Date(req.body.date)
          });

          User.addMeal(meal, user, (err) => {
              if (err) {
                  return res.status(500).json({
                      message: 'An error occured while adding meal.'
                  });
              } else {
                  return res.json({
                      message: 'Meal added.'
                  });
              }
          });
      });
  });
});


    module.exports = router