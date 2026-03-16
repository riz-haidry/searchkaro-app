const mongoose = require('mongoose');
const RatingSchema = new mongoose.Schema({
    categories: String,
    shop: String,
    rating: Number,
    review: { type: Boolean, default: true }
});
module.exports = mongoose.model('Rating', RatingSchema);