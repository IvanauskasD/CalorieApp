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

          //const dietprofile = await DietProfile.findOne({ user: user._id })

          const goal = await Goal.findOne({ dietprofile: dietprofile._id })

          let startOfDay = new Date(req.body.date);
          let goalz
          let diary
          let endOfDay = new Date(new Date(startOfDay).getTime() + 60 * 60 * 24 * 1000 - 1);
          let calories = 0, protein = 0, carbs = 0, fat = 0;


         
          var start = new Date(req.body.date);
          start.setHours(3, 0, 0, 0);
  
          var end = new Date(req.body.date);
          end.setHours(26, 59, 59, 999);
  
          let fDiary = await FoodDiary.findOne(
            { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id })

            
           goalz = goal;
           let vz = 0
          for (let i = dietprofile.meals.length - 1; i >= 0; i--) {
              let meal = dietprofile.meals[i]
              
                
             
        
              if (meal.date >= start && meal.date <= end) {
                
                  for (let k = 0; k < meal.foods.length; k++) {
                      let food = meal.foods[k]
                      
                      let tt = meal.foods[k].quantity
                      let ww = meal.foods[k].servings
                      let multi = tt * ww
                      let foodz = await Food.findById(food._id)
                      
                      vz += multi
                     
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
            
            let temp = 0
        
            if(sDiary !== null)
              temp = sDiary.name.calories
            
             

              let temp2 = 0
              temp2 = temp + calLeft

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
                  consumedCalories: temp2.toFixed(1),
                  consumedProtein: proteinLeft.toFixed(1),
                  consumedCarbs: carbsLeft.toFixed(1),
                  consumedFat: fatLeft.toFixed(1)
              },
              { new: true, upsert: true, setDefaultsOnInsert: true }
          )

      /*
      pagrindiniai skaiciavimai kaip ir veikia.
      problema gali buti su datom, tad pushinant fDiary filtruoti
      pagal siandienine data. galbut is viso tiksliau butu
      meal pries skaiciavimus atsifiltruoti i siandienos diena, 
      tad pushinant fDiary nekiltu problemu.
      */




      //     diary = await FoodDiary.findOneAndUpdate(
      //         {date: {$gte: start, $lt: end}},
      //         { $set: {
      //             name: {
      //          calories: goal.calories - calories,
      //          protein: goal.protein - protein, 
      //          carbs: goal.carbs - carbs, 
      //          fat: goal.fat - fat
      // }, date: req.body.date
      //         },
      //     },
      //         { new: true, upsert: true, setDefaultsOnInsert: true }
      //     )
      // }
      res.json([diary]);

  } catch (err) {
      console.error(err.message)
      return res.status(500).send('Server Error')
  }
  }
);

// @route    GET api/goal/me
// @desc     Get current goals
// @access   Private
// router.get('/me', auth, async (req, res) => {
//   try {
//     const dp = await DietProfile.findOne({user: req.user.id})
//     const goal = {};
//     if(!dp){
//     goal = await FoodDiary.findOne({dietprofile: dp._id}).populate('dietprofile');
//     }
//     if (!goal) {
//           return res.status(400).json({ msg: 'There is no fDiary for this user' });
//       }

//       res.json(goal);

//   } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//   }
// });

router.get(
    '/fDiariez',
    auth,
    async (req, res) => {
        let query = {}
        if (req.query.date)
            query.date = req.query.date

        const dp = await DietProfile.findOne({user: req.user.id})
        let lol = 86400000
        let lol1 = 86400000
        // if(query.date === null)
        // {
        //     lol = new Date(new Date().getTime())

        //     lol1 = new Date(new Date().getTime() + lol1)

        // }
        // else{
        lol = new Date(new Date(query.date).getTime())

        lol1 = new Date(new Date(query.date).getTime() + lol1)

        // }
        
        let fodz
       // console.log(lol)
       // console.log(lol1)
       let meal = {}
       if(dp){
        meal = await FoodDiary.find({ date: { $gte: lol, $lte: lol1 }, dietprofile: dp._id })
        
    }
    
        // console.log(meal)
        // for (let i = meal.foods.length - 1; i >= 0; i--) {
        //     let mealq = meal.foods[i]

        //     fodz = await Food.findById(mealq)

        // }

         return res.json(meal);
    }
)


module.exports = router;