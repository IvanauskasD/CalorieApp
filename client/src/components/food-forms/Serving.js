import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getFoodById } from '../../actions/food';
import Spinner from '../layout/Spinner';

const Serving = ({ getFoodById, food: { food }, auth, match }) => {
  useEffect(() => {
    getFoodById(match.params.id);
  }, [getFoodById, match.params.id]);

  return (
    <Fragment>
      {food === null ? (
        <Spinner />
      ) : (
        <Fragment>
            <h1>{food.name}</h1>
        </Fragment>
      )}
    </Fragment>
  );
};

Serving.propTypes = {
  getFoodById: PropTypes.func.isRequired,
  food: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  food: state.food,
  auth: state.auth
});

export default connect(mapStateToProps, { getFoodById })(Serving);