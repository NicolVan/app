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

router.delete('/unsaveRecipe', auth, async (req, res) => {
  const { userId, recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).send('Missing recipeId');
  }
  try {
    const savedRecipe = await SavedRecipe.findOneAndDelete({ 
      userId: new mongoose.Types.ObjectId(userId), 
      recipeId: new mongoose.Types.ObjectId(recipeId) 
    });

    if (!savedRecipe) {
      return res.status(404).send('Recipe not found in saved recipes');
    }

    await User.findByIdAndUpdate(userId, { $pull: { savedRecipes: savedRecipe._id } });
    await Recipe.findByIdAndUpdate(recipeId, { $pull: { savedByUsers: userId } });

    res.status(200).send('Recipe unsaved successfully');
  } catch (error) {
    console.error('Error unsaving recipe:', error);
    res.status(500).send('Failed to unsave recipe');
  }
});

router.get('/getsaverecipes', auth, async (req, res) => {
    try {
        const userId = req.user._id;

        const savedRecipes = await SavedRecipe.find({ userId });

        const recipeIds = savedRecipes.map(savedRecipe => savedRecipe.recipeId);

        const filter = {};
        if (req.query.categories) {
            filter.categories = { $in: req.query.categories.split(',') };
        }
        if (req.query.name) {
            filter.name = { $regex: new RegExp(req.query.name, 'i') };
        }

        const recipes = await Recipe.find({ _id: { $in: recipeIds }, ...filter });

        res.json(recipes); 
    } catch (error) {
        console.error('Error fetching saved recipes:', error);
        res.status(500).json({ error: 'Error fetching saved recipes' });
    }
});


router.post('/checkSaved', auth, async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.user._id;

  if (!recipeId) {
    return res.status(400).json({ error: 'Missing recipeId' });
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