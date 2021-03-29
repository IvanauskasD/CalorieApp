import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getFoodById } from '../../actions/food';
import { createMeal } from '../../actions/meal';
import Spinner from '../layout/Spinner';



const FoodItem = ({ getFoodById, food: { food }, auth, meal, match }) => {
 
  const initialState = {
    type: '',
    date: '',
    user: auth.user._id,
    foods: [{
      _id: match.params.id,
      quantity: ''
    }]
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    getFoodById(match.params.id);

      const goalData = { ...initialState };
      for (const key in meal) {
        if (key in goalData) goalData[key] = meal[key];
      }
      setFormData(goalData);
    
  }, [getFoodById, meal, match.params.id]);


  const onSubmit = e => {
    e.preventDefault();
    createMeal(formData, food ? true : false);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  let { type, date, foods } = formData;


  return (
    <Fragment>
      {food === null ? (
        <Spinner />
      ) : (
        <Fragment>
                <form
        className="form"
        onSubmit={onSubmit}
      >

<div className="form-group">
          <input
            type="text"
            placeholder="* type"
            name="type"
            value={type}
            onChange={onChange}
            required
          />

<input
            type="date"
            placeholder="* date"
            name="date"
            value={date}
            onChange={onChange}
            required
          />

          
<input
            type="text"
            placeholder="* quantity"
            name="quantity"
            value={foods.quantity}
            onChange={onChange}
            required
          />
        </div>

        <input type="submit" className="btn btn-primary my-1" />

        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
            </Link>
      </form>
        </Fragment>
      )}
    </Fragment>
  );
};

FoodItem.propTypes = {
  getFoodById: PropTypes.func.isRequired,
  createMeal: PropTypes.func.isRequired,
  food: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  meal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  food: state.food,
  auth: state.auth,
  meal: state.meal,
});

export default connect(mapStateToProps, { createMeal, getFoodById })(FoodItem);