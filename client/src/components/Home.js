import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navigateToAddRecipe = () => {
    navigate('/add-recipe');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={navigateToAddRecipe}>Add Recipe</button>
    </div>
  );
};

export default Home;
