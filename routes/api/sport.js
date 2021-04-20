const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const { db } = require('../../models/Food');
const Sport = require('../../models/Sport');


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
    const sportFields = {
      name,
      ...rest
    };

    try {
      // Using upsert option (it creates new doc if no match is found)
      let sport = await Sport.findOneAndUpdate(
        { name },
        { $set: sportFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
      return res.json(sport)

    } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server Error')
    }
  }
);

router.post(
  '/search-sport',
  async (req, res) => {

    const test = await Sport.find({ name: { $regex: new RegExp('.*' + req.body.name.toLowerCase() + '.*', 'i') }, name: { $regex: new RegExp('.*' + req.body.name.toUpperCase() + '.*', 'i') } })
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
    const sports = await Sport.find();
    res.json(sports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;