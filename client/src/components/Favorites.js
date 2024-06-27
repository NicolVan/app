import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/users/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data);
    };
    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>Your Favorite Recipes</h1>
      {favorites.map(recipe => (
        <div key={recipe._id}>
          <h2>{recipe.title}</h2>
          <p>{recipe.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Favorites;