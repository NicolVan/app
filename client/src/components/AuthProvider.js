import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
          setUser(response.data.user);
        } catch (error) {
          console.error('Error verifying token:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    console.log('Logging in with:', { email, password });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data;
      const userId = user._id;
      console.log('Login response:', response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId); 
      setIsAuthenticated(true);
      setUser(user);
    } catch (error) {
      console.error('Error logging in:', error.response.data); 
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUser(null)
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
