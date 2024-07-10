const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const { search, category } = req.query;
  
      const filter = {};
  
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }
  
      if (category) {
        const categories = category.split(',');
        filter.categories = { $in: categories };
      }
  
      const recipes = await Recipe.find(filter);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/recipes', async (req, res) => {
    try {
        const { name, description, categories, ingredients, instructions, prepTime, cookTime, servings, author, imageUrl } = req.body;
        const newRecipe = new Recipe({ name, description, categories, ingredients, instructions, prepTime, cookTime, servings, author, imageUrl });
        await newRecipe.save();
        res.json(newRecipe);
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(400).json({ message: 'Bad request' });
    }
});

module.exports = router;