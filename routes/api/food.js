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


// @route    GET api/food/:food_id
// @desc     Gets food by ID
// @access   Private
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

// @route    POST api/food
// @desc     Creates or updates food
// @access   Private
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

    foodFields.approved = 1

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

// @route    POST api/food/search-food
// @desc     Search method for foods
// @access   Private
router.post(
  '/search-food',
  async (req, res) => {

    const test = await Food.find({ approved: { $gt: 1 }, name: { $regex: new RegExp('.*' + req.body.name.toLowerCase() + '.*', 'i') }, name: { $regex: new RegExp('.*' + req.body.name.toUpperCase() + '.*', 'i') } })
    return res.json(test)
  }
)

// @route    GET api/food/not-approved-foods
// @desc     Gets foods that are not approved
// @access   Private
router.get(
  '/not-approved-foods',
  async (req, res) => {

    const test = await Food.find({ approved: { $lt: 2 } })

    return res.json(test)
  }
)

// @route    POST api/food/approve/:food_id
// @desc     Vote For specific food to be approved
// @access   Private
router.post(
  '/approve/:food_id',
  async (req, res) => {
    let incr = 0
    const test = await Food.find({ _id: req.params.food_id })
    let less = 0
    let checked = false
    //less = test[0].approved - 1
    if(test[0].votedOnBy.length !== 0 && test[0].votedAgainstBy.length !== 0) {
    for (let i = 0; i < test[0].votedOnBy.length; i++) {
      for (let j = 0;j < test[0].votedAgainstBy.length; j++) {
      if (((test[0].votedOnBy[i]).toString() === (req.body.user.toString())) && ((test[0].votedAgainstBy[j]).toString() !== (req.body.user.toString()))) {
        test[0].approved = test[0].approved -1
        test[0].votedOnBy.splice(i, 1)
        test[0].save()
        console.log('old')
        checked = true
        break
      } else if (((test[0].votedOnBy[i]).toString() !== (req.body.user.toString())) && ((test[0].votedAgainstBy[j]).toString() === (req.body.user.toString()))) {
        test[0].approved = test[0].approved +2
        test[0].votedAgainstBy.splice(j, 1)
        test[0].votedOnBy.push(req.body.user)
        test[0].save()
        console.log('both')
        checked = true
        break
      }
    }
    if(checked) {
      break
    }
  }
  if(!checked) {
    incr = test[0].approved +1
    await Food.findOneAndUpdate(
      { _id: req.params.food_id },
      { $push: { votedOnBy: req.body.user }, approved: incr }
    )
  }
} else if(test[0].votedOnBy.length !== 0 && test[0].votedAgainstBy.length === 0){
  for (let i = 0; i < test[0].votedOnBy.length; i++) {
    if (((test[0].votedOnBy[i]).toString() === (req.body.user.toString())) ){
      test[0].approved = test[0].approved -1
      test[0].votedOnBy.splice(i, 1)
      test[0].save()
      console.log('old, no approve')
  }  else {
    incr = test[0].approved +1
    await Food.findOneAndUpdate(
      { _id: req.params.food_id },
      { $push: { votedOnBy: req.body.user }, approved: incr }
    )
  }}
  } else if(test[0].votedAgainstBy.length === 0 && test[0].votedOnBy.length === 0){
    incr = test[0].approved + 1

    await Food.findOneAndUpdate(
      { _id: req.params.food_id },
      { $push: { votedOnBy: req.body.user }, approved: incr }
    )
    console.log('no users')
  }
  else if(test[0].votedOnBy.length === 0 && test[0].votedAgainstBy.length !== 0) {
    for (let j = 0;j < test[0].votedAgainstBy.length; j++) {
      if((req.body.user).toString() === (test[0].votedAgainstBy[j]).toString()){
        test[0].votedAgainstBy.splice(j, 1)
        test[0].approved = test[0].approved +2
        test[0].votedOnBy.push(req.body.user)
        test[0].save()

        console.log('ttttt')
      } else {
        incr = test[0].approved +1
        await Food.findOneAndUpdate(
          { _id: req.params.food_id },
          { $push: { votedOnBy: req.body.user }, approved: incr }
        )
      console.log('onlq')

      }
    }
  }
  else{
    for (let i = 0; i < test[0].votedOnBy.length; i++) {
      if (((test[0].votedOnBy[i]).toString() === (req.body.user.toString()))) {
        test[0].approved = test[0].approved +1
        test[0].votedOnBy.splice(i, 1)
        test[0].save()
        console.log('old')
      } else {
        incr = test[0].approved + 1
        await Food.findOneAndUpdate(
          { _id: req.params.food_id },
          { $push: { votedOnBy: req.body.user }, approved: incr }
        )
        console.log('new')
      }
    }
  }
    let updated = {}

    return res.json(updated)
  }
)


// @route    POST api/food/disapprove/:food_id
// @desc     Vote For specific food to be approved
// @access   Private
router.post(
  '/disapprove/:food_id',
  async (req, res) => {
    let incr = 0
    const test = await Food.find({ _id: req.params.food_id })
    let less = 0
    let checked = false
    //less = test[0].approved - 1
    if(test[0].votedAgainstBy.length !== 0 && test[0].votedOnBy.length !== 0) {
    for (let i = 0; i < test[0].votedAgainstBy.length; i++) {
      for (let j = 0;j < test[0].votedOnBy.length; j++) {
        console.log(test[0].votedOnBy[j] + '<votedBy ' + test[0].votedAgainstBy[i] + '<votedAgainst ' + req.body.user)
        if (((test[0].votedAgainstBy[i]).toString() === (req.body.user.toString())) && ((test[0].votedOnBy[j]).toString() !== (req.body.user.toString()))) {
        test[0].approved = test[0].approved +1
        test[0].votedAgainstBy.splice(i, 1)
        test[0].save()
        console.log('main2')
        checked = true
        break
      } else if (((test[0].votedAgainstBy[i]).toString() !== (req.body.user.toString())) && ((test[0].votedOnBy[j]).toString() === (req.body.user.toString()))) {
        test[0].approved = test[0].approved - 2
        test[0].votedOnBy.splice(j, 1)
        test[0].votedAgainstBy.push(req.body.user)
        test[0].save()
        console.log('main')
        checked = true
        break
      }
      }
    if(checked) {
      break
    }
  }
  if(!checked) {
    incr = test[0].approved -1
    await Food.findOneAndUpdate(
      { _id: req.params.food_id },
      { $push: { votedAgainstBy: req.body.user }, approved: incr }
    )
  }
} else if(test[0].votedAgainstBy.length !== 0 && test[0].votedOnBy.length === 0){
  for (let i = 0; i < test[0].votedAgainstBy.length; i++) {
    if (((test[0].votedAgainstBy[i]).toString() === (req.body.user.toString())) ){
      test[0].approved = test[0].approved +1
      test[0].votedAgainstBy.splice(i, 1)
      test[0].save()
      console.log('old, no approve')
  } else {
    incr = test[0].approved -1
    await Food.findOneAndUpdate(
      { _id: req.params.food_id },
      { $push: { votedAgainstBy: req.body.user }, approved: incr }
    )
  }}
  } else if(test[0].votedOnBy.length === 0 && test[0].votedAgainstBy.length === 0){
    incr = test[0].approved - 1
    console.log(incr)
    await Food.findOneAndUpdate(
      { _id: req.params.food_id },
      { $push: { votedAgainstBy: req.body.user }, approved: incr }
    )
    console.log('no users')
  }
  else if(test[0].votedAgainstBy.length === 0 && test[0].votedOnBy.length !== 0) {
    for (let j = 0;j < test[0].votedOnBy.length; j++) {
      if((req.body.user).toString() === (test[0].votedOnBy[j]).toString()){
        test[0].votedOnBy.splice(j, 1)
        test[0].approved = test[0].approved -2
        test[0].votedAgainstBy.push(req.body.user)
        test[0].save()

        console.log('one is for and none against')

      } else {
        incr = test[0].approved -1
        await Food.findOneAndUpdate(
          { _id: req.params.food_id },
          { $push: { votedAgainstBy: req.body.user }, approved: incr }
        )
      console.log('onlq')

      }
    }
  }
  else{
    for (let i = 0; i < test[0].votedAgainstBy.length; i++) {
      if (((test[0].votedAgainstBy[i]).toString() === (req.body.user.toString()))) {
        test[0].approved = test[0].approved +1
        test[0].votedAgainstBy.splice(i, 1)
        test[0].save()
        console.log('old')
      } else {
        await Food.findOneAndUpdate(
          { _id: req.params.food_id },
          { $push: { votedAgainstBy: req.body.user }, approved: incr }
        )
        console.log('new')
      }
    }
  }
    let updated = {}

    return res.json(updated)
  }
)

// @route    GET api/food
// @desc     Gets all foods
// @access   Private
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