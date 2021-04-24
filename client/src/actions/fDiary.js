import api from '../utils/api';
import { setAlert } from './alert';
import {
    GET_FDIARY,
    ERROR_FDIARY,
} from './types';

// Create or update diary
export const createDiary = (formData) => async (
  dispatch
) => {
  try {
      const res = await api.post('/fDiary', formData);

      dispatch({
          type: GET_FDIARY,
          payload: res.data
      });
      dispatch(setAlert('Diary Created', 'success'));

  } catch (err) {
      if (err.response) {
          const errors = err.response.data.errors;

          if (errors) {
              errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
          }
          dispatch({
              type: ERROR_FDIARY,
              payload: { msg: err.response.statusText, status: err.response.status }
          });
      }


  }
};


// Get food diary by date
export const getDiary = date => async (dispatch) => {
    try {
      
        const res = await api.get(`/fDiary/fDiariez?date=${date}`);
        
        dispatch({
            type: GET_FDIARY,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ERROR_FDIARY,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

