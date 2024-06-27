// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    try {
      const res = await axios.post('/api/auth/login', user);
      dispatch(setUser({ user: res.data.user, token: res.data.token }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
