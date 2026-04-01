const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { chatWithAI } = require('../controllers/aiController');

const router = express.Router();

// @route   POST /api/ai/chat
// @desc    Forward requests safely onto standard OpenAI pipelines parsing dynamic UI chat instances
// @access  Private
router.post('/chat', protect, chatWithAI);

module.exports = router;
