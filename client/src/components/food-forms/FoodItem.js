import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createFood } from '../../actions/food';
import Spinner from '../layout/Spinner';



const FoodItem = ({food, match, createFood }) => {
 
  const initialState = {
    name: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    approved: '',
    votedOnBy: ''
  };
  const [formData, setFormData] = useState(initialState);


  const onSubmit = e => {
    e.preventDefault();
    formData.votedOnBy = localStorage.getItem('dietprofile')
    createFood(formData, food ? true : false);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  let { name, calories, carbs, protein, fat, approved, votedOnBy } = formData;


  return (
    <Fragment>
      
                <form
        className="form"
        onSubmit={onSubmit}
      >
        
<div className="form-group">
  <label>Food Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
<br/>
<label>Food Calories:</label>         
<input
            type="text"
            name="calories"
            value={calories}
            onChange={onChange}
            required
          />
          <br/>
<label>Food Carbs:</label>         
<input
            type="text"
            name="carbs"
            value={carbs}
            onChange={onChange}
            required
          />
          <br/>
<label>Food Protein:</label>         
<input
            type="text"
            name="protein"
            value={protein}
            onChange={onChange}
            required
          />
          <br/>
<label>Food Fat:</label>         
<input
            type="text"
            name="fat"
            value={fat}
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
  );
};

FoodItem.propTypes = {
  createFood: PropTypes.func.isRequired,
  food: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  food: state.food,
  auth: state.auth
});

export default connect(mapStateToProps, { createFood })(FoodItem);