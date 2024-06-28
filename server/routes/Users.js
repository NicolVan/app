const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: 'User registered' });
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

router.post('/favorites/:recipeId', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  const recipe = await Recipe.findById(req.params.recipeId);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found' });
  }
  user.favorites.push(recipe._id);
  await user.save();
  res.json(user.favorites);
});


router.get('/favorites', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate('favorites');
  res.json(user.favorites);
});

module.exports = router;
