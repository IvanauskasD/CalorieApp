const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const Food = require('../../models/Food');

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

module.exports = router;