const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
    title: String,
    content: String
});
module.exports = mongoose.model('Report', ReportSchema);