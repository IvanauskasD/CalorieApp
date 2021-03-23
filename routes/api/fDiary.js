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
    console.log(test)

    // const test = await Food.find({name : {$regex: new RegExp('.*' + "duona" +'.*')},name : {$regex: new RegExp('.*' + "DUONA" + '.*')}})
    // const test = db.getCollection('Food').find({ searchkey: {$regex: "test", $options: "$i"}})
    return res.json(test)

  }
);

module.exports = router;