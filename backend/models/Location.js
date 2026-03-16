const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema({
  role: String,
  city: String,   // 'Location' column ke liye
  region: String  // 'Region' column ke liye
});
module.exports = mongoose.model('Location', LocationSchema);