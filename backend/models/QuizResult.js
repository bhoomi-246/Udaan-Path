const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scores: {
        R: { type: Number, default: 0 },
        I: { type: Number, default: 0 },
        A: { type: Number, default: 0 },
        S: { type: Number, default: 0 },
        E: { type: Number, default: 0 },
        C: { type: Number, default: 0 },
    },
    primaryInterest: {
        type: String, // E.g., 'I', 'Investigative'
        required: true,
    },
    secondaryInterest: {
        type: String, // E.g., 'R', 'Realistic'
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('QuizResult', quizResultSchema);
