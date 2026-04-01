const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getRecommendedScholarships } = require('../controllers/scholarshipController');

const router = express.Router();

// @route   GET /api/scholarships/recommended
// @desc    Calculate and fetch relevant scholarship opportunities
// @access  Private
router.get('/recommended', protect, getRecommendedScholarships);

module.exports = router;
