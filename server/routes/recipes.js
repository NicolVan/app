const express = require('express');
const Recipe = require('../models/Recipe');

const router = express.Router();

router.get('/recipe', async (req, res) => {
    try {
        const { search, categories } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (categories) {
            const categoryArray = categories.split(',').map(cat => cat.trim());
            query.category = { $in: categoryArray };
        }
        console.log('Query:', query); 
        const searchRecipes = await Recipe.find(query);
        res.json(searchRecipes);
        console.log('Fetched recipes:', searchRecipes); 
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(400).json({ message: 'Bad request' });
    }
});

router.post('/recipe', async (req, res) => {
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
