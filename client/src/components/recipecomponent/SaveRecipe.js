import React from 'react';
import axios from 'axios';

const SaveRecipeButton = ({ recipeId, user }) => {
  const saveRecipe = async () => {
    if (!user || !user._id) {
      alert('User not logged in or invalid user ID');
      return;
    }

    const payload = { userId: user._id, recipeId };
    console.log('Saving recipe with payload:', payload);

    try {
      const response = await axios.post('http://localhost:5000/api/savedrecipes/saveRecipe', payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        console.log('Save response:', response);
        alert('Recipe saved successfully!');
        saveRecipeLocally(recipeId);
      }
    } catch (error) {
      handleSaveError(error);
    }
  };

  const saveRecipeLocally = (recipeId) => {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    if (!savedRecipes.includes(recipeId)) {
      savedRecipes.push(recipeId);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
  };

  const handleSaveError = (error) => {
    if (error.response) {
      console.error('Error saving recipe:', error.response.data);
      alert(`Failed to save recipe: ${error.response.data.message || 'Unknown error'}`);
    } else if (error.request) {
      console.error('Error saving recipe: No response received', error.request);
      alert('Failed to save recipe: No response received from the server.');
    } else {
      console.error('Error saving recipe:', error.message);
      alert(`Failed to save recipe: ${error.message}`);
    }
  };

  return <button onClick={saveRecipe}>Save Recipe</button>;
};

export default SaveRecipeButton;
