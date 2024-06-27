
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
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      dispatch({ type: LOGIN_SUCCESS, payload: response.data });
      return { type: LOGIN_SUCCESS, payload: response.data };
    } else {
      dispatch({ type: LOGIN_FAIL, error: response.data.msg });
      return { type: LOGIN_FAIL, error: response.data.msg };
    }
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, error: error.message });
    return { type: LOGIN_FAIL, error: error.message };
  }
};