import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';


const GoogleOAuthProvider = () => {
  const { googleLogin } = useContext(AuthContext); 

  const handleGoogleSignIn = async () => {
    try {
     
      const response = { credential: 'google_token_here' };
      await googleLogin(response.credential);
     
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default GoogleOAuthProvider;
