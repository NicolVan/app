import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './components/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

const clientId='299159331127-a0c2fph79ln76nno6hfnejm3b014mtgg.apps.googleusercontent.com'

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}> 
      <AuthProvider>
        <App />
      </AuthProvider>
      </GoogleOAuthProvider>
  </React.StrictMode>
);
document.getElementById('root')

