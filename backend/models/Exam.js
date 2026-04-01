const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    name: String,
    stream: String,
    degree: String,
    description: String,
    officialWebsite: String
});

module.exports = mongoose.model('Exam', examSchema);
