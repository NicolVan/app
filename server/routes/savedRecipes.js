const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const SavedRecipe = require('../models/SaveRecipe');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/saveRecipe', auth, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user._id;

  if (!recipeId) {
    return res.status(400).send('Missing recipeId');
  }
  try {
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

router.post('/checkSaved', async (req, res) => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    return res.status(400).json({ error: 'Missing userId or recipeId' });
  }

  try {
    const savedRecipe = await SavedRecipe.findOne({ userId, recipeId });
    const isSaved = !!savedRecipe;
    res.status(200).json({ isSaved });
  } catch (error) {
    console.error('Error checking if recipe is saved:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;