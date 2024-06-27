
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


export const login = (userData) => async (dispatch) => {
  try {
    const res = await axios.post(`${API_URL}/login`, userData);
    dispatch({ type: LOGIN_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({ type: LOGIN_FAIL, payload: err.response.data });
  }
};