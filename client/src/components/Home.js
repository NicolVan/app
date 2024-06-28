import React, { useContext }  from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const Home = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const navigateToAddRecipe = () => {
        navigate('/add-recipe');
    };

  return (
    <div>
      <h1>Home</h1>
      {isAuthenticated && user && <h2>Welcome, {user.username}!</h2>}
      <button onClick={navigateToAddRecipe}>Add Recipe</button>
    </div>
  );
};

export default Home;
