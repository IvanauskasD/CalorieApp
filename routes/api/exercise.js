const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const User = require('../../models/User');
const DietProfile = require('../../models/DietProfile');
const Sport = require('../../models/Sport');
const Exercise = require('../../models/Exercise');
const FoodDiary = require('../../models/FoodDiary');
const ExerciseDiary = require('../../models/ExerciseDiary');
const Goal = require('../../models/Goal');

// @route    POST api/exercise
// @desc     Add exercise
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
            const sport = await Sport.findOne({ name: req.body.sport.name })
            const dietprofile = await DietProfile.findOne({ user: req.body.user })

            let exerc = new Exercise({
                typeExercise: req.body.typeExercise,
                sports: [{
                    _id: sport,
                    quantity: req.body.quantity,
                    calories: req.body.calories,
                }],
                date: new Date(req.body.date)
            })

            const {
                ...rest
            } = req.body

            const test = {
                ...rest
            }

            var start = new Date(req.body.date);
            start.setHours(3, 0, 0, 0);
    
            var end = new Date(req.body.date);
            end.setHours(26, 59, 59, 999);
            let exercisez = await Exercise.findOneAndUpdate(
                { date: { $gte: start, $lt: end }, typeExercise: req.body.typeExercise },
                {
                    $push: {
                        sports: [{
                            _id: sport,
                            quantity: req.body.quantity,
                            calories: req.body.calories,
                            $position: 0
                        }],

                    }, date: req.body.date, typeExercise: req.body.typeExercise, user: req.body.user
                },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )


            let dP = {
                _id: '',
                quantity: ''
            }

            dP._id = exerc.sports[0]._id._id
            dP.quantity = exerc.sports[0].quantity
            dP.calories = exerc.sports[0].calories

            let dW = {}

            if (dietprofile.exercises.length === 0) {
                dietprofile.exercises.addToSet(exercisez)

                dietprofile.save()
            }
            else {
                for (let i = dietprofile.exercises.length - 1; i >= 0; i--) {
                    if ((dietprofile.exercises[i]._id).toString() === (exercisez._id.toString())){
                        dW = await DietProfile.findOneAndUpdate({ user: req.body.user, 'exercises._id': exercisez._id },
                            {
                                $push: {
                                    'exercises.$.sports': dP
                                }
                            })
                            break
                    }
                    else {
                        dietprofile.exercises.addToSet(exercisez)

                        dietprofile.save()
                        break;
                    }
                }
            }

            return res.json(exercisez)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }
    }
);

// @route    GET api/exercises:date?
// @desc     Get exercises for specific date
// @access   Private
router.get(
    '/exercises',
    auth,
    async (req, res) => {
        let query = {}
        if (req.query.date)
            query.date = req.query.date


        let moreDate = 86400000
        let lessDate = 86400000

        moreDate = new Date(new Date(query.date).getTime())

        lessDate = new Date(new Date(query.date).getTime() + lessDate)


        const exercise = await Exercise.find({ date: { $gte: moreDate, $lte: lessDate }, user: req.user.id }).populate('sports._id')


        return res.json(exercise);
    }
)

// @route    GET api/exercise/:id
// @desc     Get exercise by ID
// @access   Private
router.get(
    '/exercise/:id',
    auth,
    async (req, res) => {

        const match = await Exercise.findById(req.params.id).populate("sports");

        return res.json(match);
    }
)

// @route    POST api/:exercise_id&:number
// @desc     Add exercise to current date and diary, recalculates food diary
// @access   Private
router.post('/:exercise_id&:number', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.user }).
            populate({ path: 'exercises.sports._id', model: Sport })

        const found = await Exercise.findById({ _id: req.params.exercise_id })
        const dietprofile = await DietProfile.findOne({ user: user._id })


        var start = new Date(req.body.date);
        start.setHours(3, 0, 0, 0);

        var end = new Date(req.body.date);
        end.setHours(26, 59, 59, 999);
        
        let subt = found.sports[req.params.number]
        
        
        let calories = 0

        calories = subt.calories
        

        let diaris = await ExerciseDiary.find({ date: { $gte: start, $lt: end }, dietprofile: dietprofile._id })
        
        let calories1 = 0

        calories1 = diaris[0].name.calories


        let calories0 = calories1.toFixed(1) - calories


        let calories2 = 0

        calories2 = diaris[0].wastedCalories
        

        let calories00 = calories2 - calories

        let fDiary = await FoodDiary.findOne(
            { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id })
        let minusEx = 0
        minusEx = fDiary.consumedCalories - calories1


      await FoodDiary.findOneAndUpdate(
        { date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
        {
            $set: {
                consumedCalories: minusEx
            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )
    

        let diarisFinal = await ExerciseDiary.findOneAndUpdate({ date: { $gte: start, $lt: end }, dietprofile: dietprofile._id },
            {
                $set: 
                {
                    name: {
                    calories: calories0.toFixed(1)
                }}, date: req.body.date,
                wastedCalories: calories00,
            }, { new: true, upsert: true, setDefaultsOnInsert: true })


            let dP = {
                _id: '',
                quantity: '',
                calories: ''
            }

            dP._id = found.sports[0]._id._id
            dP.quantity = found.sports[0].quantity
            dP.calories = found.sports[0].calories

            for (let i = 0; i < dietprofile.exercises.length; i++) {
              if ((req.params.exercise_id).toString() === (dietprofile.exercises[i]._id.toString())) {
                  dietprofile.exercises[i].sports.splice(req.params.number, 1)
                  dietprofile.markModified('exercises')
                  dietprofile.save()
                }
        }
            
        found.sports.splice(req.params.number, 1)
        found.save()

        res.json({ msg: 'Exercise removed' });
    } catch (err) {
        console.error(err.message);

        res.status(500).send('Server Error');
    }
});


module.exports = router;