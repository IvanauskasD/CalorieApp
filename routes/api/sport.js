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

// @route    POST api/sport
// @desc     Creates or updates sport
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
    const sportFields = {
      name,
      ...rest
    };

    sportFields.approved = 1

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

// @route    GET api/sport/not-approved-sports
// @desc     Gets sports that are not approved
// @access   Private
router.get(
  '/not-approved-sports',
  async (req, res) => {

    const sport = await Sport.find({ approved: { $lt: 4 } })

    return res.json(sport)
  }
)

// @route    POST api/sport/approve/:sport_id
// @desc     Vote For specific sport to be approved
// @access   Private
router.post(
  '/approve/:sport_id',
  async (req, res) => {
    let incr = 0
    const sport = await Sport.find({ _id: req.params.sport_id })
    let checked = false
    //less = sport[0].approved - 1
    if(sport[0].votedOnBy.length !== 0 && sport[0].votedAgainstBy.length !== 0) {
    for (let i = 0; i < sport[0].votedOnBy.length; i++) {
      for (let j = 0;j < sport[0].votedAgainstBy.length; j++) {
      if (((sport[0].votedOnBy[i]).toString() === (req.body.user.toString())) && ((sport[0].votedAgainstBy[j]).toString() !== (req.body.user.toString()))) {
        sport[0].approved = sport[0].approved -1
        sport[0].votedOnBy.splice(i, 1)
        sport[0].save()
        checked = true
        break
      } else if (((sport[0].votedOnBy[i]).toString() !== (req.body.user.toString())) && ((sport[0].votedAgainstBy[j]).toString() === (req.body.user.toString()))) {
        sport[0].approved = sport[0].approved +2
        sport[0].votedAgainstBy.splice(j, 1)
        sport[0].votedOnBy.push(req.body.user)
        sport[0].save()
        checked = true
        break
      }
    }
    if(checked) {
      break
    }
  }
  if(!checked) {
    incr = sport[0].approved +1
    await Sport.findOneAndUpdate(
      { _id: req.params.sport_id },
      { $push: { votedOnBy: req.body.user }, approved: incr }
    )
  }
} else if(sport[0].votedOnBy.length !== 0 && sport[0].votedAgainstBy.length === 0){
  for (let i = 0; i < sport[0].votedOnBy.length; i++) {
    if (((sport[0].votedOnBy[i]).toString() === (req.body.user.toString())) ){
      sport[0].approved = sport[0].approved -1
      sport[0].votedOnBy.splice(i, 1)
      sport[0].save()
  }  else {
    incr = sport[0].approved +1
    await Sport.findOneAndUpdate(
      { _id: req.params.sport_id },
      { $push: { votedOnBy: req.body.user }, approved: incr }
    )
  }}
  } else if(sport[0].votedAgainstBy.length === 0 && sport[0].votedOnBy.length === 0){
    incr = sport[0].approved + 1

    await Sport.findOneAndUpdate(
      { _id: req.params.sport_id },
      { $push: { votedOnBy: req.body.user }, approved: incr }
    )
  }
  else if(sport[0].votedOnBy.length === 0 && sport[0].votedAgainstBy.length !== 0) {
    for (let j = 0;j < sport[0].votedAgainstBy.length; j++) {
      if((req.body.user).toString() === (sport[0].votedAgainstBy[j]).toString()){
        sport[0].votedAgainstBy.splice(j, 1)
        sport[0].approved = sport[0].approved +2
        sport[0].votedOnBy.push(req.body.user)
        sport[0].save()

      } else {
        incr = sport[0].approved +1
        await Sport.findOneAndUpdate(
          { _id: req.params.sport_id },
          { $push: { votedOnBy: req.body.user }, approved: incr }
        )

      }
    }
  }
  else{
    for (let i = 0; i < sport[0].votedOnBy.length; i++) {
      if (((sport[0].votedOnBy[i]).toString() === (req.body.user.toString()))) {
        sport[0].approved = sport[0].approved +1
        sport[0].votedOnBy.splice(i, 1)
        sport[0].save()
      } else {
        incr = sport[0].approved + 1
        await Sport.findOneAndUpdate(
          { _id: req.params.sport_id },
          { $push: { votedOnBy: req.body.user }, approved: incr }
        )
      }
    }
  }
    let updated = {}

    return res.json(updated)
  }
)


// @route    POST api/sport/disapprove/:sport_id
// @desc     Vote For specific sport to be approved
// @access   Private
router.post(
  '/disapprove/:sport_id',
  async (req, res) => {
    let incr = 0
    const sport = await Sport.find({ _id: req.params.sport_id })
    let less = 0
    let checked = false
    //less = sport[0].approved - 1
    if(sport[0].votedAgainstBy.length !== 0 && sport[0].votedOnBy.length !== 0) {
    for (let i = 0; i < sport[0].votedAgainstBy.length; i++) {
      for (let j = 0;j < sport[0].votedOnBy.length; j++) {
        if (((sport[0].votedAgainstBy[i]).toString() === (req.body.user.toString())) && ((sport[0].votedOnBy[j]).toString() !== (req.body.user.toString()))) {
        sport[0].approved = sport[0].approved +1
        sport[0].votedAgainstBy.splice(i, 1)
        sport[0].save()
        checked = true
        break
      } else if (((sport[0].votedAgainstBy[i]).toString() !== (req.body.user.toString())) && ((sport[0].votedOnBy[j]).toString() === (req.body.user.toString()))) {
        sport[0].approved = sport[0].approved - 2
        sport[0].votedOnBy.splice(j, 1)
        sport[0].votedAgainstBy.push(req.body.user)
        sport[0].save()
        checked = true
        break
      }
      }
    if(checked) {
      break
    }
  }
  if(!checked) {
    incr = sport[0].approved -1
    await Sport.findOneAndUpdate(
      { _id: req.params.sport_id },
      { $push: { votedAgainstBy: req.body.user }, approved: incr }
    )
  }
} else if(sport[0].votedAgainstBy.length !== 0 && sport[0].votedOnBy.length === 0){
  for (let i = 0; i < sport[0].votedAgainstBy.length; i++) {
    if (((sport[0].votedAgainstBy[i]).toString() === (req.body.user.toString())) ){
      sport[0].approved = sport[0].approved +1
      sport[0].votedAgainstBy.splice(i, 1)
      sport[0].save()
  } else {
    incr = sport[0].approved -1
    await Sport.findOneAndUpdate(
      { _id: req.params.sport_id },
      { $push: { votedAgainstBy: req.body.user }, approved: incr }
    )
  }}
  } else if(sport[0].votedOnBy.length === 0 && sport[0].votedAgainstBy.length === 0){
    incr = sport[0].approved - 1
    await Sport.findOneAndUpdate(
      { _id: req.params.sport_id },
      { $push: { votedAgainstBy: req.body.user }, approved: incr }
    )
  }
  else if(sport[0].votedAgainstBy.length === 0 && sport[0].votedOnBy.length !== 0) {
    for (let j = 0;j < sport[0].votedOnBy.length; j++) {
      if((req.body.user).toString() === (sport[0].votedOnBy[j]).toString()){
        sport[0].votedOnBy.splice(j, 1)
        sport[0].approved = sport[0].approved -2
        sport[0].votedAgainstBy.push(req.body.user)
        sport[0].save()


      } else {
        incr = sport[0].approved -1
        await Sport.findOneAndUpdate(
          { _id: req.params.sport_id },
          { $push: { votedAgainstBy: req.body.user }, approved: incr }
        )

      }
    }
  }
  else{
    for (let i = 0; i < sport[0].votedAgainstBy.length; i++) {
      if (((sport[0].votedAgainstBy[i]).toString() === (req.body.user.toString()))) {
        sport[0].approved = sport[0].approved +1
        sport[0].votedAgainstBy.splice(i, 1)
        sport[0].save()
      } else {
        await Sport.findOneAndUpdate(
          { _id: req.params.sport_id },
          { $push: { votedAgainstBy: req.body.user }, approved: incr }
        )
      }
    }
  }
    let updated = {}

    return res.json(updated)
  }
)


// @route    POST api/sport/search-sport
// @desc     Search method for sports
// @access   Private
router.post(
  '/search-sport',
  async (req, res) => {

    const sport = await Sport.find({ approved: { $gte: 4 }, name: { $regex: new RegExp('.*' + req.body.name.toLowerCase() + '.*', 'i') }, name: { $regex: new RegExp('.*' + req.body.name.toUpperCase() + '.*', 'i') } })
    // const searchedField = req.body.name
    // Food.find({name: {$regex: searchedField, $options: '$i'}})
    // .then(data=>{
    //   res.send(data)
    // })
    return res.json(sport)
  }
)

// @route    GET api/sport
// @desc     Gets all sports
// @access   Private
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