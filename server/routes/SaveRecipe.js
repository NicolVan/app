const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/User');
const Recipe = require('../models/Recipe');
const SavedRecipe = require('../models/SaveRecipe');

const router = express.Router();

router.post('/saveRecipe', async (req, res) => {
  const { userId, recipeId } = req.body;
  console.log('Received saveRecipe request:', req.body);
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

    await User.findByIdAndUpdate(userId, { $push: { savedRecipes: savedRecipe._id } });
    await Recipe.findByIdAndUpdate(recipeId, { $push: { savedByUsers: userId } });

    res.status(200).send('Recipe saved successfully');
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).send('Failed to save recipe');
  }
});



module.exports = router;

