const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://knihomolka2:NicolVan@databadse.mprrui4.mongodb.net/RecipeDB?', {
});


const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');

app.use('/users', userRoutes);
app.use('/recipes', recipeRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
