import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ history }) => {
  const [form, setForm] = useState({ username: '', password: '' });

  const onChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/users/register', form);
      history.push('/login');
    } catch (error) {
      console.error('Error registering user');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="username" value={form.username} onChange={onChange} placeholder="Username" required />
      <input type="password" name="password" value={form.password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
