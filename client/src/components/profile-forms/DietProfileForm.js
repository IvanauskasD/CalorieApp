import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createDietProfile, getDietProfileById } from '../../actions/dietprofile';


const initialState = {
    currentWeight: '',
    height: '',
    goalWeight: '',
    gender: '',
    dateOfBirth: '',
    workoutWeek: '',
    workoutDay: '',
    goal: ''
};

const DietProfileForm = ({
    dietprofile: { dietprofile, loading },
    createDietProfile,
    getDietProfileById,
    history
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
      }, [loading, getDietProfileById, dietprofile]);

      const { currentWeight, height, goalWeight, gender, dateOfBirth, workoutWeek, workoutDay, goal } = formData;

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
              <textarea
                name="gender"
                cols="30"
                rows="5"
                placeholder="Gender"
                value={gender}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Date Of Birth"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
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
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Goal"
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
}

DietProfileForm.propTypes = {
    createDietProfile: PropTypes.func.isRequired,
    getDietProfileById: PropTypes.func.isRequired,
    dietprofile: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    dietprofile: state.dietprofile
  });
  
  export default connect(mapStateToProps, { createDietProfile, getDietProfileById })(
    DietProfileForm
  );