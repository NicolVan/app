import React from 'react';
import axios from 'axios';
import _ from 'lodash';

const SaveRecipeButton = ({ recipeId, user, handleSaveRecipe }) => {

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
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        console.log('Save response:', response);
        alert('Recipe saved successfully!');
        handleSaveRecipe(recipeId);  
      }
    } catch (error) {
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
    }
  };

  const debouncedSaveRecipe = _.debounce(saveRecipe, 500);

  return <button onClick={debouncedSaveRecipe}>Save Recipe</button>;
};

export default SaveRecipeButton;
