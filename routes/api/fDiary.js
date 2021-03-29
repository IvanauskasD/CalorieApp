const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const Food = require('../../models/Food');
const foodDiary = require('../../models/FoodDiary');
const { db } = require('../../models/DietProfile');




router.post(
  '/me',
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // const test = await Food.find({name : {$regex: new RegExp('.*' + "duona", 'i')},name : {$regex: new RegExp('^' + "duona", 'i')},is_active:true})
    const test = await Food.find({ name: { $regex: new RegExp('.*' + req.body.name.toLowerCase() + '.*', 'i') }, name: { $regex: new RegExp('.*' + req.body.name.toUpperCase() + '.*', 'i') } })

    // const test = await Food.find({name : {$regex: new RegExp('.*' + "duona" +'.*')},name : {$regex: new RegExp('.*' + "DUONA" + '.*')}})
    // const test = db.getCollection('Food').find({ searchkey: {$regex: "test", $options: "$i"}})
    return res.json(test)

  }
);

// @route    GET api/fDiary/food/:food_id
// @desc     Get food by ID
// @access   Public
router.get(
  '/food/:food_id',
  checkObjectId('food_id'),
  async ({ params: { food_id } }, res) => {
    try {
      const food = await Food.findOne({
        _id: food_id
      });

      if (!food) return res.status(400).json({ msg: 'Food not found' });

      return res.json(food);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
);

module.exports = router;