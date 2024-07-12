import React, { useState, useEffect } from 'react';
import Recipes from './Recipes';
import axios from 'axios';
import { API_URL } from '../constants'

const SaveRecipe = () => {
  const [user, setUser] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    const storedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || {};
    setSavedRecipes(storedRecipes);
  }, []);

  const handleSaveRecipe = async (recipeId) => {
    console.log('User in handleSaveRecipe:', user);
    if (!user || !user._id) {
      alert('User not logged in or invalid user ID');
      return;
    }
    try {
      const payload = { userId: user._id, recipeId };
      console.log('Saving recipe with payload:', payload);
      const response = await axios.post(`${ API_URL }/savedrecipes/saveRecipe`, payload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Save response:', response);
      if (response.status === 200) {
        saveRecipeLocally(recipeId);
        setSavedRecipes(prevState => ({
          ...prevState,
          [recipeId]: true
        }));
        alert('Recipe saved successfully!');
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

  const saveRecipeLocally = (recipeId) => {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    if (!savedRecipes.includes(recipeId)) {
      savedRecipes.push(recipeId);
      localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
  };
  
  const handleUnsaveRecipe = async (recipeId) => {
    if (!user || !user._id) {
      alert('User not logged in or invalid user ID');
      return;
    }

    try {
      const payload = { recipeId };
      console.log('Unsaving recipe with payload:', payload);
      const response = await axios.delete(`${ API_URL }/savedrecipes/unsaveRecipe`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        data: payload,
      });

      console.log('Unsave response:', response);
      if (response.status === 200) {
        setSavedRecipes(prevState => {
          const newState = { ...prevState };
          delete newState[recipeId];
          return newState;
        });
        unsaveRecipeLocally(recipeId);
        alert('Recipe unsaved successfully!');
      }
    } catch (error) {
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
    }
  };
  
  const unsaveRecipeLocally = (recipeId) => {
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || {};
    delete savedRecipes[recipeId];
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
  };
  return (
    <div>
      <Recipes
        user={user}
        savedRecipes={savedRecipes}
        handleSaveRecipe={handleSaveRecipe}
        handleUnsaveRecipe={handleUnsaveRecipe}
      />
    </div>
  );
};

export default SaveRecipe;