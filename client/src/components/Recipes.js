import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/recipes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(res.data);
    };
    fetchRecipes();
  }, []);

  const addFavorite = async (recipeId) => {
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:5000/users/favorites/${recipeId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  return (
    <div>
      <h1>Your Recipes</h1>
      {recipes.map(recipe => (
        <div key={recipe._id}>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
          <button onClick={() => addFavorite(recipe._id)}>Favorite</button>
        </div>
      ))}
    </div>
  );
};

export default Recipes;

