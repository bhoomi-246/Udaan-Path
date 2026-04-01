const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getRecommendedExams } = require('../controllers/examController');

const router = express.Router();

// @route   GET /api/exams/recommended
// @desc    Fetch specific exams categorized by algorithmic user bounds natively
// @access  Private
router.get('/recommended', protect, getRecommendedExams);

module.exports = router;
