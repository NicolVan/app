import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthProvider';

const CompleteRegistration = () => {
  const { state } = useLocation();
  const { userId } = state || {}; 
  const [username, setUsername] = useState('');
  const { setUser } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleCompleteRegistration = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/auth/complete-registration', { userId, username }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Complete Registration Response:', res.data);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user); 
      navigate('/login');
    } catch (error) {
      console.error('Complete registration failed:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h3>Complete Registration</h3>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleCompleteRegistration}>Complete Registration</button>
    </div>
  );
};

export default CompleteRegistration;
