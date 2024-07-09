const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const suppliesSchema = new Schema({
    itemName : {type: String, required: true},
    quantity: {type: Number, required: true},
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

const Supplies = mongoose.model('Supplies', suppliesSchema);
module.exports = Supplies;