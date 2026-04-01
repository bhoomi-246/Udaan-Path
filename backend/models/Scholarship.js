const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    name: String,
    stream: String,
    description: String,
    eligibility: String,
    officialWebsite: String
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
