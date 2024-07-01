const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const SavedRecipe = require('../models/SaveRecipe');

const router = express.Router();

router.post('/saveRecipe', async (req, res) => {
  const { userId, recipeId } = req.body;
  if (!userId || !recipeId) {
    console.log('Missing userId or recipeId:', { userId, recipeId });
    return res.status(400).send('Missing userId or recipeId');
  }
  try {
    console.log('Received payload:', { userId, recipeId });
    const savedRecipe = new SavedRecipe({ 
      userId: new mongoose.Types.ObjectId(userId), 
      recipeId: new mongoose.Types.ObjectId(recipeId) 
    });

    await savedRecipe.save();

    await User.findByIdAndUpdate(userId, { $push: { savedRecipes: saveRecipes._id } });
    await Recipe.findByIdAndUpdate(recipeId, { $push: { savedByUsers: userId } });

    res.status(200).send('Recipe saved successfully');
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).send('Failed to save recipe');
  }
});

router.delete('/unsaveRecipe', async (req, res) => {
  const { userId, recipeId } = req.body;
  if (!userId || !recipeId) {
    return res.status(400).send('Missing userId or recipeId');
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.savedRecipes = user.savedRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    await SavedRecipe.findOneAndDelete({ 
      userId: mongoose.Types.ObjectId(userId), 
      recipeId: mongoose.Types.ObjectId(recipeId) 
    });

    await Recipe.findByIdAndUpdate(recipeId, { $pull: { savedByUsers: userId } });

    await User.findByIdAndUpdate(userId, { $pull: { savedRecipes: recipeId } });

    return res.status(200).send('Recipe removed from favorites');
  } catch (error) {
    console.error('Error unsaving recipe:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

