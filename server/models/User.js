const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'SavedRecipe' }],
    tokens: [{token: {type: String, required: true}
  }],
  });
  
  const User = mongoose.model('User', UserSchema);
  module.exports = User;