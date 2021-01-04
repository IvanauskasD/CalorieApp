import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addDietProfile } from '../../actions/profile';

const AddDietProfile = ({ addDietProfile, history }) => {
  const [formData, setFormData] = useState({
    currentWeight: '',
    height: '',
    goalWeight: '',
    gender: '',
    dateOfBirth: '',
    workoutWeek: '',
    workoutDay: '',
    goal: ''
  });

  const { currentWeight, height, goalWeight, gender, dateOfBirth, workoutWeek, workoutDay, goal } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add A Diet Profile</h1>
      <p className="lead">
        <i className="fas fa-code-branch" /> Add your diet profile
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={e => {
          e.preventDefault();
          addDietProfile(formData, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* currentWeight"
            name="currentWeight"
            value={currentWeight}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Job height"
            name="height"
            value={height}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="goalWeight"
            value={goalWeight}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <textarea
            name="gender"
            cols="30"
            rows="5"
            placeholder="Job Description"
            value={gender}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="workoutWeek"
            value={workoutWeek}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="workoutDay"
            value={workoutDay}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="goal"
            value={goal}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddDietProfile.propTypes = {
  addDietProfile: PropTypes.func.isRequired
};

export default connect(null, { addDietProfile })(AddDietProfile);