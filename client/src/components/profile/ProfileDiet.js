import React from 'react';
import PropTypes from 'prop-types';
import formatDate from '../../utils/formatDate';

const ProfileDiet = ({
  dietProfile: { currentWeight, height, goalWeight, gender, dateOfBirth, workoutWeek, workoutDay, goal }
}) => (
  <div>
    <h3 className="text-dark">{currentWeight}</h3>
    <p>
      <strong>Height: </strong> {height}
    </p>
    <p>
      <strong>Goal Weight: </strong> {goalWeight}
    </p>
    <p>
      <strong>Gender: </strong> {gender}
    </p>
    <p>
      <strong>Date Of Birth: </strong> {dateOfBirth}
    </p>
    <p>
      <strong>Workouts/week: </strong> {workoutWeek}
    </p>
    <p>
      <strong>Workouts/day: </strong> {workoutDay}
    </p>
    <p>
      <strong>Goal: </strong> {goal}
    </p>
  </div>
);

ProfileDiet.propTypes = {
    dietProfile: PropTypes.object.isRequired
};

export default ProfileDiet;