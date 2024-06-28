import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const navigateToAddRecipe = () => {
    navigate('/add-recipe');
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={navigateToAddRecipe}>Add Recipe</button>
    </div>
  );
};

export default Home;
