import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createDietProfile, getDietProfileById } from '../../actions/dietprofile';
import { getCurrentProfile } from '../../actions/profile'

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
  workoutIntensity: ''
};

const DietProfileForm = ({
  dietprofile: { dietprofile, loading },
  createDietProfile,
  getDietProfileById,
  getCurrentProfile,
  history,
  profile: { profile }
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!dietprofile) getDietProfileById();
    if (!loading && dietprofile) {
      const profileData = { ...initialState };
      for (const key in dietprofile) {
        if (key in profileData) profileData[key] = dietprofile[key];
      }
      setFormData(profileData);
    }
  }, [loading, getDietProfileById, dietprofile, getCurrentProfile]);

  const { age, workoutIntensity, currentWeight, height, goalWeight, gender, dateOfBirth, workoutWeek, workoutDay } = formData;
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createDietProfile(formData, history, dietprofile ? true : false);
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Add A Diet Profile</h1>
      <p className="lead">
        <i className="fas fa-code-branch" /> Add your diet profile
          </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
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
          <input
            type="text"
            placeholder="Weight Goal"
            name="goalWeight"
            value={goalWeight}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
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
        <div className="form-group">
          <input
            type="date"
            placeholder="Date Of Birth"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={onChange}
          />
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
  getDietProfileById: PropTypes.func.isRequired,
  dietprofile: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  dietprofile: state.dietprofile,
  profile: state.profile
});

export default connect(mapStateToProps, { createDietProfile, getDietProfileById, getCurrentProfile })(
  DietProfileForm
);