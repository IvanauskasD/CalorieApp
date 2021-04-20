const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const Food = require('../../models/Food');
const { db } = require('../../models/Food');

// @route    POST api/food
// @desc     Create food
// @access   Private
// router.post(
//     '/',
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const {
//             name,
//             servingSize,
//             calories,
//             totalFat,
//             saturatedFat,
//             cholesterol,
//             sodium,
//             totalCarbs,
//             sugars,
//             dietaryFiber,
//             protein,
//             salt,
//             vitaminA,
//             vitaminB,
//             calcium
//         } = req.body;

//         try {
//             let food = await Food.findOne({ name });

//             if (food) {
//                 return res
//                     .status(400)
//                     .json({ errors: [{ msg: 'Food already exists' }] });
//             }

//             food = new Food({
//                 name,
//                 servingSize,
//                 calories,
//                 totalFat,
//                 saturatedFat,
//                 cholesterol,
//                 sodium,
//                 totalCarbs,
//                 sugars,
//                 dietaryFiber,
//                 protein,
//                 salt,
//                 vitaminA,
//                 vitaminB,
//                 calcium
//             });

//             await food.save();

//         } catch (err) {
//             console.error(err.message);
//             res.status(500).send('Server error');
//         }
//     }
// );

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
router.get(
  '/food/:food_id',
  auth,
  checkObjectId('food_id'),
  async ({ params: { food_id } }, res) => {
    try {
      const profile = await Food.findOne({
        _id: food_id
      })

      if (!profile) return res.status(400).json({ msg: 'food not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);


router.post(
  '/',
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // destructure the request
    const {
      name,
      ...rest
    } = req.body;

    // build a profile
    const foodFields = {
      name,
      ...rest
    };

    try {
      // Using upsert option (it creates new doc if no match is found)
      let food = await Food.findOneAndUpdate(
        { name },
        { $set: foodFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      return res.json(food)

    } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server Error')
    }
  }
);


router.post(
  '/test',
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    Food.getFoodByName(req.body.food.name, (err, food) => {
      if(err) {
        return res.status(500).json({
          message: 'An error addin food'
        })
      }

      if(!food){
        food = new Food({
          name: req.body.food.name,
          calories: req.body.food.calories,
          protein: req.body.food.protein,
          carbs: req.body.food.carbs,
          fat: req.body.food.fat
        })
        Food.createFood(food, (err) => {
          return res.status(500).json({
            message: 'An error adin food'
          })
        })
      }

      


    })

    // destructure the request
    const {
      name,
      ...rest
    } = req.body;

    // build a profile
    const foodFields = {
      name,
      ...rest
    };

    try {
      // Using upsert option (it creates new doc if no match is found)
      let food = await Food.findOneAndUpdate(
        { name },
        { $set: foodFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      return res.json(food)

    } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server Error')
    }
  }
);


// router.post('/search-food', (req, res) => {

//   const { founded } = req.body
  
//   Food.find(req.body, function(err, result){

//     return res.status(200).json({result: result})
// })});

router.post(
  '/search-food',
  async (req, res) => {

    const test = await Food.find({ name: { $regex: new RegExp('.*' + req.body.name.toLowerCase() + '.*', 'i') }, name: { $regex: new RegExp('.*' + req.body.name.toUpperCase() + '.*', 'i') } })
    // const searchedField = req.body.name
    // Food.find({name: {$regex: searchedField, $options: '$i'}})
    // .then(data=>{
    //   res.send(data)
    // })
    return res.json(test)
  }
)

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;