const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const savedRecipeRoutes = require('./routes/SaveRecipe')

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/saverecipes', savedRecipeRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/recipes'));
app.use('/api/saverecipes', require('./routes/SaveRecipe'));

app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
