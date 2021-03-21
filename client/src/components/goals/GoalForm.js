import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createGoal, getCurrentGoals } from '../../actions/goal'
import { getCurrentDietProfile } from '../../actions/dietprofile';

const initialState = {
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    proteinPercent: '',
    carbsPercent: '',
    fatPercent: '',
    dietprofile: ''
  };

const GoalForm = ({
  goal: { goal, loading },
  createGoal,
  history,
  getCurrentGoals,
  getCurrentDietProfile,
  dietprofile: { dietprofile: _dietprofile }
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!goal) getCurrentGoals();
    if (!loading && goal) {
      const goalData = { ...initialState };
      for (const key in goal) {
        if (key in goalData) goalData[key] = goal[key];
      }
      setFormData(goalData);
    }
  }, [loading, getCurrentGoals, goal, getCurrentDietProfile]);

  let { calories, protein, carbs, fat, proteinPercent, carbsPercent, fatPercent, dietprofile } = formData;


  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    formData.dietprofile = goal.dietprofile._id
    createGoal(formData, history, goal ? true : false);
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
            placeholder="* Current calories"
            name="calories"
            value={calories}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
        <select
            name="proteinPercent"
            value={proteinPercent}
            onChange={onChange}
          >
            <option value="0.15">15%</option>
            <option value="0.2">20%</option>
            <option value="0.25">25%</option>
            <option value="0.3">30%</option>
            <option value="0.35">35%</option>
          </select>
          {/* <input
            type="text"
            placeholder="* protein"
            name="protein"
            value={protein}
            onChange={onChange}
            required
          /> */}
        </div>
        <div className="form-group">
          {/* <input
            type="text"
            placeholder="carbs"
            name="carbs"
            value={carbs}
            onChange={onChange}
          /> */}
                  <select
            name="carbsPercent"
            value={carbsPercent}
            onChange={onChange}
          >
            <option value="0.4">40%</option>
            <option value="0.45">45%</option>
            <option value="0.5">50%</option>
            <option value="0.55">55%</option>
            <option value="0.6">60%</option>
          </select>
        </div>
        <div className="form-group">
        <select
            name="fatPercent"
            value={fatPercent}
            onChange={onChange}
          >
            <option value="0.15">15%</option>
            <option value="0.2">20%</option>
            <option value="0.25">25%</option>
            <option value="0.3">30%</option>
            <option value="0.35">35%</option>
          </select>
          {/* <input
            type="text"
            placeholder="fat"
            name="fat"
            value={fat}
            onChange={onChange}
          /> */}
        </div>

        <input type="submit" className="btn btn-primary my-1" />

        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
            </Link>
      </form>
    </Fragment>
  );
}

GoalForm.propTypes = {
  createGoal: PropTypes.func.isRequired,
  getCurrentGoals: PropTypes.func.isRequired,
  goal: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  goal: state.goal,
  dietprofile: state.dietprofile
});

export default connect(mapStateToProps, { createGoal, getCurrentGoals, getCurrentDietProfile })(
  GoalForm
);