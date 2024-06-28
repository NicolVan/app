
import axios from 'axios';
import { REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, LOGIN_FAIL } from './types';

const API_URL = 'http://localhost:5000/api/auth';

export const register = (userData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData);
    dispatch({ type: REGISTER_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: REGISTER_FAIL, payload: err.response.data });
  }
};

export const login = (credentials) => async (dispatch) => {
  console.log('Login request payload:', credentials); // 
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    console.log('Login response:', response.data); 
    localStorage.setItem('token', response.data.token); 
    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    return { type: LOGIN_SUCCESS, payload: response.data };
  } catch (error) {
    console.error('Error response:', error.response); 
    const errorMessage = error.response ? error.response.data.msg : error.message;
    dispatch({ type: LOGIN_FAIL, error: errorMessage });
    return { type: LOGIN_FAIL, error: errorMessage };
  }
};
