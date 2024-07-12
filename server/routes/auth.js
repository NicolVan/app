const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const CLIENT_ID ='383604934861-mjpm6vpkbla7bsj3d8t7oqu1v2u695ln.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

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

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload; 
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Failed to verify Google token');
  }
}

router.post('/google-login', async (req, res) => {
  const { token } = req.body;

  try {
    const googleUser = await verifyGoogleToken(token);
    const { email } = googleUser;

    let user = await User.findOne({ email });

    if (!user) {
      const newUser = new User({
        username: googleUser.name,
        email: googleUser.email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
      user = await newUser.save();
    }

    const payload = { user: { id: user._id } };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Error with Google Sign-In:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;