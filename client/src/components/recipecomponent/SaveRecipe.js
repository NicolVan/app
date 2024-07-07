import React, { useState, useEffect } from 'react';
import Recipes from './Recipes';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:5000/api/savedrecipes/saveRecipe', payload, {
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

  return (
    <div>
      <Recipes
        user={user}
        savedRecipes={savedRecipes}
        handleSaveRecipe={handleSaveRecipe}
      />
    </div>
  );
};

export default SaveRecipe;