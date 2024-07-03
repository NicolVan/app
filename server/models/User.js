const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    savedRecipe: [{ type: Schema.Types.ObjectId, ref: 'SavedRecipe' }]
});

module.exports = mongoose.model('User', UserSchema);
