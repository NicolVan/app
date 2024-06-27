const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth'); 

const router = express.Router();


router.post('/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { recipeId } = req.body;

    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
      res.json(user.favorites);
    } else {
      res.status(400).json({ msg: 'Recipe already favorited' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


router.post('/unfavorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { recipeId } = req.body;

    if (user.favorites.includes(recipeId)) {
      user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
      await user.save();
      res.json(user.favorites);
    } else {
      res.status(400).json({ msg: 'Recipe not in favorites' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorite');
    res.json(user.favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
