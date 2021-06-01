const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const Goal = require('../../models/Goal');
const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const Food = require('../../models/Food');
const Meal = require('../../models/Meal')
const ExerciseDiary = require('../../models/ExerciseDiary');
const Sport = require('../../models/Sport');
const FoodDiary = require('../../models/FoodDiary');

// @route    POST api/sDiary
// @desc     Create or update exercise diary
// @access   Private
router.post(
  '/',
  auth,
  async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() })
      }


      try {
          const dietprofile = await DietProfile.findOne({ user: req.body.user }).
              populate({ path: 'exercises.sports._id', model: Sport })

          const goal = await Goal.findOne({ dietprofile: dietprofile._id })

          let startOfDay = new Date(req.body.date);
          let goalz
          let diary
          let calories = 0


         
          var start = new Date(req.body.date);
          start.setHours(3, 0, 0, 0);
  
          var end = new Date(req.body.date);
          end.setHours(26, 59, 59, 999);
         
           goalz = goal;
           let vz = 0
          for (let i = dietprofile.exercises.length - 1; i >= 0; i--) {
              let exercise = dietprofile.exercises[i]
              
                
             
        
              if (exercise.date >= start && exercise.date <= end) {
                
                  for (let k = 0; k < exercise.sports.length; k++) {
                      let sport = exercise.sports[k]
                   
                      calories += sport.calories
                     console.log(sport)
                  }
              }
          }
         
          let calLeft
          
          calLeft = goalz.calories + calories
        
          let fDiary = await FoodDiary.findOne(
            { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id })
            
            let qwerty = 0
            if(fDiary !== null)
            {
                qwerty = fDiary.consumedCalories
            }
            
            let additionalCalories = qwerty + calories
         
            let win
          diary = await ExerciseDiary.findOneAndUpdate(
              { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
              {
                  $set: {
                      name: {
                          calories: calories,
                      },
                  }, date: req.body.date,
                  wastedCalories: calLeft.toFixed(1),
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
          )

          if(fDiary === null) {
        await FoodDiary.findOneAndUpdate(
              { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
              {
                  $set: {
                      name: {
                          calories: 0,
                          protein: 0,
                          carbs: 0,
                          fat: 0
                      },
                  }, date: req.body.date,
                  consumedCalories: calLeft,
                  consumedProtein: goalz.protein,
                  consumedCarbs: goalz.carbs,
                  consumedFat: goalz.fat
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
          )
          } else {
          await FoodDiary.findOneAndUpdate(
            { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
            {
                $set: {
                    consumedCalories: additionalCalories
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          )
        }

        

      res.json([diary]);

  } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server Error')
  }
  }
);

// @route    GET api/fDiary/sDiariez:date?
// @desc     Gets exercise diary for specific date
// @access   Private
router.get(
    '/sDiariez',
    auth,
    async (req, res) => {
        let query = {}
        if (req.query.date)
            query.date = req.query.date

        const dp = await DietProfile.findOne({user: req.user.id})

        let lol = 86400000
        let lol1 = 86399999

        lol = new Date(new Date(query.date).getTime())

        lol1 = new Date(new Date(query.date).getTime() + lol1)

        let exercise = {}
        if(dp)
        exercise = await ExerciseDiary.find({ date: { $gte: lol, $lte: lol1 }, dietprofile: dp._id })
       

         return res.json(exercise);
    }
)


module.exports = router;