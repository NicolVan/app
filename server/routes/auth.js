const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post('/register', async (req, res) => {
  const {username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const payload = { userId: newUser.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ user: newUser, token });
  } catch (err) {
    console.error('Server error:', err.message); 
    res.status(500).send('Server error');
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.tokens.push({ token });
    await user.save();

    const response = {
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      }
    };

    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/verify', auth, (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const verifyGoogleToken = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  return ticket.getPayload();
};

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const googleUser = await verifyGoogleToken(token);
    const { email, name, sub: googleId } = googleUser;

    let user = await User.findOne({ email });

    if (!user) {
      const dummyPassword = await bcrypt.hash(new Date().toISOString(), 10);
      user = new User({
        email,
        googleId,
        username: name,
        password: dummyPassword,
      });
      await user.save();
    }

    const payload = { user: { id: user._id } };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    if (!user.tokens.some((t) => t.token === jwtToken)) {
      user.tokens.push({ token: jwtToken });
      await user.save();
    }

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        tokens: user.tokens,
      },
    });
  } catch (error) {
    console.error('Error with Google Sign-In:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/complete-registration', auth, async (req, res) => {
  const { userId, username } = req.body;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    await user.save();

    const payload = { user: { id: user._id } };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    if (!user.tokens.some((t) => t.token === jwtToken)) {
      user.tokens.push({ token: jwtToken });
      await user.save();
    }

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        tokens: user.tokens,
      },
    });
  } catch (error) {
    console.error('Error completing registration:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;