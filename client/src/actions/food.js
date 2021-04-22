import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_FOOD,
  FOOD_ERROR,
  CLEAR_FOOD,
  ADD_FOOD
} from './types';

export const addFood = formData => async dispatch => {
  try {
    const res = await api.post('/add-food', formData);

    dispatch({
      type: ADD_FOOD,
      payload: res.data
    });
    dispatch(setAlert('Food Added', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: FOOD_ERROR
    });
  }
};

// Create or update food card
export const createFood = (formData, history) => async (
  dispatch
) => {
  try {
    const res = await api.post('/food', formData);

    dispatch({
      type: GET_FOOD,
      payload: res.data
    });

    dispatch(setAlert('Food Card Created', 'success'));

    history.push('/dashboard');

  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: FOOD_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};


// Get food by ID
export const getNotApprovedFoods = () => async (dispatch) => {
  try {
    const res = await api.get('/food/not-approved-foods');
    dispatch({
      type: GET_FOOD,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete experience
export const approveFood = (id, form) => async (dispatch) => {
  try {

    const res = await api.post(`/food/approve/${id}`, form);
   
    dispatch({
      type: GET_FOOD,
      payload: res.data
    });

    dispatch(setAlert('Meal Approved', 'success'));
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};



export const searchFood = (formData) => async (
  dispatch
) => {
  try {
    const res = await api.post('/food/search-food', formData);

    dispatch({
      type: GET_FOOD,
      payload: res.data
    });

    dispatch(setAlert('Food Card Searched', 'success'));


  } catch (err) {
    if (err.response) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

      dispatch({
        type: FOOD_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
}


// Get food by ID
export const getFoodById = (foodId) => async (dispatch) => {
  try {
    const res = await api.get(`/food/food/${foodId}`);

    dispatch({
      type: GET_FOOD,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};


// Get all profiles
export const getFoods = () => async (dispatch) => {
  dispatch({ type: CLEAR_FOOD });

  try {
    const res = await api.get('/food');

    dispatch({
      type: GET_FOOD,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: FOOD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

