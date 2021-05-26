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
const FoodDiary = require('../../models/FoodDiary');
const ExerciseDiary = require('../../models/ExerciseDiary');


// @route    POST api/fDiary
// @desc     Create or update food diary
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
              populate({ path: 'meals.foods._id', model: Food })


          const goal = await Goal.findOne({ dietprofile: dietprofile._id })

          let startOfDay = new Date(req.body.date);
          let goalz
          let diary
          let calories = 0, protein = 0, carbs = 0, fat = 0;


         
          var start = new Date(req.body.date);
          start.setHours(3, 0, 0, 0);
  
          var end = new Date(req.body.date);
          end.setHours(26, 59, 59, 999);
  
         
           goalz = goal;

           let addAll = 0
          for (let i = dietprofile.meals.length - 1; i >= 0; i--) {
              let meal = dietprofile.meals[i]
             
        
              if (meal.date >= start && meal.date <= end) {
                
                  for (let k = 0; k < meal.foods.length; k++) {
                      let food = meal.foods[k]
                      
                      let foodQuantity = meal.foods[k].quantity
                      let foodServings = meal.foods[k].servings
                      let multi = foodQuantity * foodServings
                      let foodz = await Food.findById(food._id)
                      
                      addAll += multi
                      
                      calories += (foodz.calories * multi)
                      protein += (foodz.protein * multi)
                      carbs += (foodz.carbs * multi)
                      fat += (foodz.fat * multi)
                      

                  }
              }
          }
          
        
        

          let calLeft
          let proteinLeft
          let carbsLeft
          let fatLeft
          calLeft = goalz.calories - calories
          proteinLeft = goalz.protein - protein
          carbsLeft = goalz.carbs - carbs
          fatLeft = goalz.fat - fat
          

          let sDiary = await ExerciseDiary.findOne(
            { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id })
            
            let calculatedCalories = 0
        
            if(sDiary !== null)
              calculatedCalories = sDiary.name.calories
            
             

              let recalcultedCalories = 0
              recalcultedCalories = calculatedCalories + calLeft

          diary = await FoodDiary.findOneAndUpdate(
              { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
              {
                  $set: {
                      name: {
                          calories: calories,
                          protein: protein,
                          carbs: carbs,
                          fat: fat
                      },
                  }, date: req.body.date,
                  consumedCalories: recalcultedCalories.toFixed(1),
                  consumedProtein: proteinLeft.toFixed(1),
                  consumedCarbs: carbsLeft.toFixed(1),
                  consumedFat: fatLeft.toFixed(1)
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
          )
      res.json([diary]);

  } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server Error')
  }
  }
);

// @route    GET api/fDiary/fDiariez:date?
// @desc     Gets food diary for specific date
// @access   Private
router.get(
    '/fDiariez',
    auth,
    async (req, res) => {
        let query = {}
        if (req.query.date)
            query.date = req.query.date

        const dp = await DietProfile.findOne({user: req.user.id})
        let lessDate = 86400000
        let moreDate = 86400000

        lessDate = new Date(new Date(query.date).getTime())

        moreDate = new Date(new Date(query.date).getTime() + moreDate)

       let meal = {}
       if(dp){
        meal = await FoodDiary.find({ date: { $gte: lessDate, $lte: moreDate }, dietprofile: dp._id })
        
    }
    

         return res.json(meal);
    }
)


module.exports = router;