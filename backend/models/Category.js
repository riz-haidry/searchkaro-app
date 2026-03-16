const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  role: String,
  categoryName: String, // 'Categories' column ke liye
  product: String      // 'Product' column ke liye
});
module.exports = mongoose.model('Category', CategorySchema);