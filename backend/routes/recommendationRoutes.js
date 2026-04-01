const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getRecommendation } = require('../controllers/recommendationController');

const router = express.Router();

// @route   GET /api/recommendation
// @desc    Calculate and fetch career recommendations
// @access  Private
router.get('/', protect, getRecommendation);

module.exports = router;
