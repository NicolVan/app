const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }
});

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: [String], required: true },
  ingredients: { type: [ingredientSchema], required: true },
  instructions: { type: String, required: true },
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String },
  savedByUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;