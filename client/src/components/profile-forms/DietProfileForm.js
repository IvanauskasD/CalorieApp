import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createDietProfile, getCurrentDietProfile } from '../../actions/dietprofile';
import { getCurrentProfile } from '../../actions/profile'

import { createDiary } from '../../actions/fDiary'
const initialState = {
  currentWeight: '',
  height: '',
  age: '',
  goalWeight: '',
  gender: '',
  dateOfBirth: '',
  workoutWeek: '',
  workoutDay: '',
  // goal: '',
  workoutIntensity: '',
  expectations: '',
};

const initial = {
  date: '',
  user: ''
}

let zqa = new Date()
let test = new Date(zqa.getTime() + (3*60*60*1000)).toISOString().replace(/T.+/, '')

const DietProfileForm = ({
  dietprofile: { dietprofile, loading },
  createDietProfile,
  getCurrentDietProfile,
  getCurrentProfile,
  history,
  profile: { profile },
  createDiary
}) => {
  const [formData, setFormData] = useState(initialState);
  const [formData1, setFormData1] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  const [loaded1, setLoaded1] = useState(false);

  useEffect(() => {
    if(!profile){ getCurrentProfile()
    } else {
      setLoaded1(true)
    }
    if (!dietprofile) getCurrentDietProfile();
    if (!loading && dietprofile) {
      const profileData = { ...initialState };
      for (const key in dietprofile) {
        if (key in profileData) profileData[key] = dietprofile[key];
      }
      setFormData(profileData);
    }
    if(formData.expectations !== '') {
      setLoaded(true)
    }
    else{
      setLoaded(false)
    }
  }, [loaded1, loaded, loading, getCurrentDietProfile, dietprofile, getCurrentProfile]);

  const { age, workoutIntensity, currentWeight, height, goalWeight, gender, dateOfBirth, workoutWeek, workoutDay, expectations } = formData;
  
  
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createDietProfile(formData, history, dietprofile ? true : false);
    if(loaded1){
      formData1.user = profile.user._id
    }
    formData1.date = test
  //  createDiary(formData1)
  createDietProfile(formData, history, dietprofile ? true : false).then(() => {
    createDiary(formData1)
  });
  //  setTimeout(createDiary(formData1), 2000);
    console.log(formData)
  };
  
  // const onChangeLose = e => {
  //   formData.expectations = e.target.value
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // }

  return (
    <Fragment>
      <h1 className="large text-primary">Edit your Diet Profile</h1>
      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
          <label>Current Weight:</label>
          <input
            type="text"
            placeholder="* Current Weight"
            name="currentWeight"
            value={currentWeight}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Height:</label>
          <input
            type="text"
            placeholder="* Height"
            name="height"
            value={height}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="text"
            placeholder="* Height"
            name="age"
            value={age}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Weight Goal:</label>
          <input
            type="text"
            placeholder="Weight Goal"
            name="goalWeight"
            value={goalWeight}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={gender}
            onChange={onChange}
          >
            <option>* Select Your Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        {/* <div className="form-group">
          <input
            type="text"
            placeholder="Workouts/Week"
            name="workoutWeek"
            value={workoutWeek}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Workouts/day"
            name="workoutDay"
            value={workoutDay}
            onChange={onChange}
          />
        </div> */}
        <label>Activity Level:</label>
          <div className="form-group">
          <select
            name="workoutIntensity"
            value={workoutIntensity}
            onChange={onChange}
          >
            <option>* How would you describe your normal daily activities?</option>
            <option value="1.2">Sedentary</option>
            <option value="1.375">Lightly Active</option>
            <option value="1.55">Moderately Active</option>
            <option value="1.725">Very Active</option>
            <option value="1.9">Extremely Active</option>
          </select>
        </div>

        <label>Your Goal:</label>
          <div className="form-group">
          <select
            name="expectations"
            value={expectations}
            onChange={onChange}
          >
            <option>* How much weight do you want to gain/lose per week?</option>
            <option value="1">Lose 1kg per week</option>
            <option value="0.75">Lose 0,75kg per week</option>
            <option value="0.5">Lose 0,5kg per week</option>
            <option value="0.25">Lose 0,25kg per week</option>
            <option value="0">Maintain current weight</option>
            <option value="-0.25">Gain 0,25kg per week</option>
            <option value="-0.5">Gain 0,5kg per week</option>
            <option value="-0.75">Gain 0,75kg per week</option>
            <option value="-1">Gain 1kg per week</option>
          </select>
        </div>

        {/* <div className="form-group">
          <select
            name="goal"
            value={goal}
            onChange={onChange}
          >
            <option>* What is your goal?</option>
            <option value="1">Lose 1 kilogram per week</option>
            <option value="2">Lose .75 kilograms per week</option>
            <option value="3">Lose .5 kilograms per week</option>
            <option value="4">Maintain my current weight</option>
            <option value="5">Gain .25 kilograms per week</option>
            <option value="6">Gain .5 kilograms per week</option>
          </select>
        </div> */}

        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
            </Link>
      </form>
    </Fragment>
  );
}

DietProfileForm.propTypes = {
  createDietProfile: PropTypes.func.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired,
  dietprofile: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  createDiary: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dietprofile: state.dietprofile,
  profile: state.profile,
});

export default connect(mapStateToProps, { createDiary, createDietProfile, getCurrentDietProfile, getCurrentProfile })(
  DietProfileForm
);