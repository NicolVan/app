const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth'); 

const router = express.Router();


router.post('/favorite', auth, async (req, res) => {
  console.log('Request to add favorite received', req.body); 
  try {
    const user = await User.findById(req.user.id);
    const { recipeId } = req.body;

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!recipeId) {
      console.log('Recipe ID is required');
      return res.status(400).json({ msg: 'Recipe ID is required' });
    }

    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
      console.log('Favorite added:', user.favorites); 
      res.json(user.favorites);
    } else {
      console.log('Recipe already favorited');
      res.status(400).json({ msg: 'Recipe already favorited' });
    }
  } catch (err) {
    console.error('Error adding favorite:', err.message); 
    res.status(500).send('Server error');
  }
});

module.exports = router;

