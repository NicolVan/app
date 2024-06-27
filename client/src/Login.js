import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../slices/authSlice';

const Login = ({ history }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const dispatch = useDispatch();

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/users/login', form);
      dispatch(loginSuccess(res.data.token));
      history.push('/recipes');
    } catch (error) {
      console.error('Invalid credentials');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="username" value={form.username} onChange={onChange} placeholder="Username" required />
      <input type="password" name="password" value={form.password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
