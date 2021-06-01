const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const checkObjectId = require('../../middleware/checkObjectId')
const auth = require('../../middleware/auth');
const normalize = require('normalize-url');

const Profile = require('../../models/Profile');
const DietProfile = require('../../models/DietProfile');
const User = require('../../models/User');
const Goal = require('../../models/Goal');

// @route    GET api/dietprofile/me
// @desc     Get current users diet profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        const dietprofile = await DietProfile.findOne({
            user: req.user.id
        }).populate('user');
        if (!dietprofile) {
            return res.status(400).json({ msg: 'There is no diet profile for this user' });
        }

        res.json(dietprofile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/dietprofile
// @desc     Create or update diet profile
// @access   Private
router.post(
    '/',
    auth,
    check('currentWeight', 'Current Weight field is required').notEmpty(),
    check('height', 'Height field is required').notEmpty(),
    check('age', 'Age field is required').notEmpty(),
    check('goalWeight', 'Goal Weight field is required').notEmpty(),
    check('workoutIntensity', 'Activity Level field is required').notEmpty(),
    check('expectations', 'Your Goal field is required').notEmpty(),
    check('gender', 'Gender field is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // destructure the request
        const {
            // currentWeight,
            // height,
            // age,
            // gender,
            // bmr,
            // workoutIntensity,
            // spread the rest of the fields we don't need to check
            ...rest
        } = req.body



        let goalCalculated = {}


        // build a profile
        const dietProfileFields = {
            user: req.user.id,
            ...rest
        };

        let calcCalories;
        let calcCarbs;
        let calcProtein;
        let calcFat;
        let carbsP = 0.5;
        let proteinP = 0.2;
        let fatP = 0.3;

        let temp = 0
        let reachGoalTime = 0
        let reachGoalToFix = 0

        let nowDate = new Date()

        if (dietProfileFields.gender === 'Male') {
            dietProfileFields.bmr = (10 * dietProfileFields.currentWeight) + (6.25 *
                dietProfileFields.height) - (5 * dietProfileFields.age) + 5


            dietProfileFields.calculatedGoal = dietProfileFields.bmr * dietProfileFields.workoutIntensity

            switch (parseFloat(dietProfileFields.expectations)) {
                case 0:
                    temp = dietProfileFields.calculatedGoal
                    reachGoalToFix = 1
                    break
                case 0.25:
                    temp = dietProfileFields.calculatedGoal - 300
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 0.25
                    break
                case 0.5:
                    temp = dietProfileFields.calculatedGoal - 500
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 0.5

                    break
                case 0.75:
                    temp = dietProfileFields.calculatedGoal - 825
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 0.75
                    break
                case 1:
                    temp = dietProfileFields.calculatedGoal - 1100
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 1
                    break
                case -0.25:
                    temp = dietProfileFields.calculatedGoal + 300
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 0.25
                    break
                case -0.5:
                    temp = dietProfileFields.calculatedGoal + 500
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 0.5
                    break
                case -0.75:
                    temp = dietProfileFields.calculatedGoal + 825
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 0.75
                    break
                case -1:
                    temp = dietProfileFields.calculatedGoal + 1100
                    reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                    reachGoalToFix = reachGoalTime / 1
                    break

                default:
                    temp = dietProfileFields.calculatedGoal
                    reachGoalToFix = 1
                break
            }
            

            calcCarbs = temp / 2
            calcCarbs = calcCarbs / 4

            calcProtein = temp * proteinP
            calcProtein = calcProtein / 4

            calcFat = temp * fatP
            calcFat = calcFat / 9

            nowDate.setDate(nowDate.getDate() + reachGoalToFix.toFixed(0) * 7)
            dietProfileFields.expectationTime = nowDate
            calcCalories = temp
        }
        else {
            dietProfileFields.bmr = (10 * dietProfileFields.currentWeight) + (6.25 *
                dietProfileFields.height) - (5 * dietProfileFields.age) - 161

            dietProfileFields.calculatedGoal = dietProfileFields.bmr * dietProfileFields.workoutIntensity
           switch (dietProfileFields.expectations) {
            case 0:
                temp = dietProfileFields.calculatedGoal
                reachGoalToFix = 1
                break
            case 0.25:
                temp = dietProfileFields.calculatedGoal - 300
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 0.25
                break
            case 0.5:
                temp = dietProfileFields.calculatedGoal - 500
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 0.5
                break
            case 0.75:
                temp = dietProfileFields.calculatedGoal - 825
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 0.75
                break
            case 0.1:
                temp = dietProfileFields.calculatedGoal - 1100
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 1
                break
            case -0.25:
                temp = dietProfileFields.calculatedGoal + 300
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 0.25
                break
            case -0.5:
                temp = dietProfileFields.calculatedGoal + 500
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 0.5
                break
            case -0.75:
                temp = dietProfileFields.calculatedGoal + 825
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 0.75
                break
            case -1:
                temp = dietProfileFields.calculatedGoal + 1100
                reachGoalTime = dietProfileFields.currentWeight - dietProfileFields.goalWeight
                reachGoalToFix = reachGoalTime / 1
                break
            default:
                console.log('Something went wrong!')
        }

        dietProfileFields.calculatedGoal = temp



            calcCarbs = temp / 2
            calcCarbs = calcCarbs / 4

            calcProtein = temp * proteinP
            calcProtein = calcProtein / 4

            calcFat = temp * fatP
            calcFat = calcFat / 9
            
            nowDate.setDate(nowDate.getDate() + reachGoalToFix.toFixed(0) * 7)

            dietProfileFields.expectationTime = nowDate

            calcCalories = temp

        }




        try {
            // Using upsert option (it creates new doc if no match is found)
            let dietprofile = await DietProfile.findOneAndUpdate(
                { user: req.user.id },
                { $set: dietProfileFields },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )

            const test = {
                dietprofile: dietprofile.id,
                calories: calcCalories.toFixed(1),
                carbs: calcCarbs.toFixed(1),
                protein: calcProtein.toFixed(1),
                fat: calcFat.toFixed(1),
                carbsPercent: carbsP,
                proteinPercent: proteinP,
                fatPercent: fatP,
                ...rest
            }

            let goal = await Goal.findOneAndUpdate(
                { dietprofile: dietprofile.id },
                { $set: test },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
            return res.json(dietprofile)

        } catch (err) {
            console.error(err.message)
            return res.status(500).send('Server Error')
        }



    }
);


// @route    GET api/dietprofile/profile/:user_id
// @desc     Get  diet profile by user ID
// @access   Public
router.get(
    '/profile/:user_id',
    checkObjectId('user_id'),
    async ({ params: { user_id } }, res) => {
        try {
            const dietprofile = await DietProfile.findOne({
                user: user_id
            }).populate('profile');
            if (!dietprofile) return res.status(400).json({ msg: 'Diet Profile not found' });

            return res.json(dietprofile);
        } catch (err) {
            console.error(err.message);
            return res.status(500).json({ msg: 'Server error' });
        }
    }
);



module.exports = router;