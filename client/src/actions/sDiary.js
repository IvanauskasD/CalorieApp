import api from '../utils/api';
import { setAlert } from './alert';
import {
    GET_SDIARY,
    ERROR_SDIARY,
} from './types';

// Create or update exercise diary
export const createSportDiary = (formData) => async (
  dispatch
) => {
  try {
      const res = await api.post('/sDiary', formData);

      dispatch({
          type: GET_SDIARY,
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
              type: ERROR_SDIARY,
              payload: { msg: err.response.statusText, status: err.response.status }
          });
      }


  }
};


// Get exercise diary by date
export const getSportDiary = date => async (dispatch) => {
    try {
        const res = await api.get(`/sDiary/sDiariez?date=${date}`);

        dispatch({
            type: GET_SDIARY,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: ERROR_SDIARY,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

