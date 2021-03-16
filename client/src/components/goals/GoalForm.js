import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createGoal, getGoalById } from '../../actions/goal'
import { getCurrentDietProfile } from '../../actions/dietprofile';

const initialState = {
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    dietprofile: ''
  };

const GoalForm = ({
  goal: { goal, loading },
  createGoal,
  history,
  getGoalById,
  getCurrentDietProfile,
  dietprofile: { dietprofile: _dietprofile}
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!goal) getGoalById();
    if (!loading && goal) {
      const goalData = { ...initialState };
      for (const key in goal) {
        if (key in goalData) goalData[key] = goal[key];
      }
      setFormData(goalData);
    }
  }, [loading, getGoalById, goal, getCurrentDietProfile]);

  const { calories, protein, carbs, fat, dietprofile } = formData;
  formData.dietprofile = _dietprofile._id
  // console.log(formData.dietprofile)
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
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
          <input
            type="text"
            placeholder="* protein"
            name="protein"
            value={protein}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="carbs"
            name="carbs"
            value={carbs}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="fat"
            name="fat"
            value={fat}
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

GoalForm.propTypes = {
  createGoal: PropTypes.func.isRequired,
  getGoalById: PropTypes.func.isRequired,
  goal: PropTypes.object.isRequired,
  dietprofile: PropTypes.object.isRequired,
  getCurrentDietProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  goal: state.goal,
  dietprofile: state.dietprofile
});

export default connect(mapStateToProps, { createGoal, getGoalById, getCurrentDietProfile })(
  GoalForm
);