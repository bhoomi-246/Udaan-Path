const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    riasecTag: {
        type: String,
        enum: ['R', 'I', 'A', 'S', 'E', 'C'],
        required: true,
    }
}, { _id: false });

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: {
        type: [optionSchema],
        validate: [v => v.length === 6, 'A question must have exactly 6 options.'],
    }
});

module.exports = mongoose.model('Question', questionSchema);
