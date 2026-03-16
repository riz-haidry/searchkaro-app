const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    image: { type: String } //  img URL
});

module.exports = mongoose.model('Item', itemSchema);