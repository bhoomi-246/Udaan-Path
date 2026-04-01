const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getQuizStatus, getQuestions, submitQuiz } = require('../controllers/quizController');

const router = express.Router();

// @route   GET /api/quiz/status
// @desc    Check if the logged-in user has already taken the quiz
// @access  Private
router.get('/status', protect, getQuizStatus);

// @route   GET /api/quiz/questions
// @desc    Get all 30 RIASEC quiz questions (stripped of tags)
// @access  Private
router.get('/questions', protect, getQuestions);

// @route   POST /api/quiz/submit
// @desc    Submit answers and calculate the RIASEC Interest Profile
// @access  Private
router.post('/submit', protect, submitQuiz);

module.exports = router;
