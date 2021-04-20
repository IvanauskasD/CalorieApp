import api from './api';

const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
    localStorage.removeItem('dietprofile');
    localStorage.removeItem('leftFood');
    localStorage.removeItem('netFood1');
    localStorage.removeItem('LeftFood1');
    localStorage.removeItem('leftExercise');
    localStorage.removeItem('netFood');
    localStorage.removeItem('leftFood1');
  }
};

export default setAuthToken;