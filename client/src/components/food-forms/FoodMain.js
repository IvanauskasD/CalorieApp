import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getFoodById } from '../../actions/food';
import Spinner from '../layout/Spinner';

const FoodMain = ({ getFoodById, food: { food }, auth, match }) => {
  useEffect(() => {
  }, []);

  return (
    <Fragment>
      <div>
          <h1>Breakfast</h1>
      </div>
      <div>
          <h1>Lunch</h1>
      </div>
      <div>
          <h1>Dinner</h1>
      </div>
      <div>
          <h1>Snacks</h1>
      </div>
    </Fragment>
  );
};

FoodMain.propTypes = {
  getFoodById: PropTypes.func.isRequired,
  food: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  food: state.food,
  auth: state.auth
});

export default connect(mapStateToProps, { getFoodById })(FoodMain);