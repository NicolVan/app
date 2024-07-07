import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import _ from 'lodash';

const SaveRecipeButton = ({ recipeId, user }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user || !user._id) return;

      try {
        const response = await axios.post('http://localhost:5000/api/savedrecipes/checkSaved', {
          userId: user._id,
          recipeId,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.data.isSaved) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error checking if recipe is saved:', error);
      }
    };

    checkIfSaved();
  }, [user, recipeId]);

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
        saveRecipeLocally(recipeId);
        setIsSaved(true);
      }
    } catch (error) {
      handleSaveError(error);
    }
  };

  const debouncedSaveRecipe = useCallback(_.debounce(saveRecipe, 500), [user, recipeId, isSaved]);

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

  return <button onClick={debouncedSaveRecipe} disabled={isSaved}>{isSaved ? 'Saved' : 'Save Recipe'}</button>;
};

export default SaveRecipeButton;
