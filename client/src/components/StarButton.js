import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarButton = ({ recipeId }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/favorite', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Fetched favorites:', response.data);
        setIsFavorited(response.data.some(favorite => favorite._id === recipeId));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [recipeId]);

  useEffect(() => {
    console.log('Component re-rendered with isFavorited:', isFavorited);
  }, [isFavorited]);

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      if (isFavorited) {
        const response = await axios.post('http://localhost:5000/api/unfavorite', { recipeId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Unfavorited:', response.data);
      } else {
        const response = await axios.post('http://localhost:5000/api/favorite', { recipeId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Favorited:', response.data);
      }

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  return (
    <button onClick={handleFavorite} className='focus:outline-none'>
      {isFavorited ? <FaStar color='gold' /> : <FaRegStar />}
    </button>
  );
};

export default StarButton;
