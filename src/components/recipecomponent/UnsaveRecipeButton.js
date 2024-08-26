import React from 'react';
import axios from 'axios';
import { API_URL } from '../constants'

const UnsaveRecipeButton = ({ recipeId, user, handleUnsaveRecipe }) => {
  const unsaveRecipe = async () => {
    if (!user || !user._id) {
      console.error('User not logged in or invalid user ID');
      return;
    }

    const payload = { userId: user._id, recipeId };
    console.log('Unsaving recipe with payload:', payload);

    try {
      const response = await axios.request({
        url: `${ API_URL }/savedrecipes/unsaveRecipe`,
        method: 'DELETE',
        data: payload,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        console.log('Unsave response:', response);
        unsaveRecipeLocally(recipeId);
        handleUnsaveRecipe(recipeId);
      }
    } catch (error) {
      handleUnsaveError(error);
    }
  };

  const unsaveRecipeLocally = (recipeId) => {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    if (!Array.isArray(savedRecipes)) {
      savedRecipes = []; 
    }
  
    if (savedRecipes.includes(recipeId)) {
      savedRecipes = savedRecipes.filter(id => id !== recipeId);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
  };

  const handleUnsaveError = (error) => {
    if (error.response) {
      console.error('Error unsaving recipe:', error.response.data);
      alert(`Failed to unsave recipe: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Error unsaving recipe: No response received', error.request);
      alert('Failed to unsave recipe: No response received from the server.');
    } else {
      console.error('Error unsaving recipe:', error.message);
      alert(`Failed to unsave recipe: ${error.message}`);
    }
  };

  return <button onClick={unsaveRecipe}>★</button>;
};

export default UnsaveRecipeButton;
