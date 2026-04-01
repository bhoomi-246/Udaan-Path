const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const { generateRecommendation } = require('../services/recommendationService');

// @desc    Get hybrid career recommendation
// @route   GET /api/recommendation
// @access  Private
const getRecommendation = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch user profile (to get academic marks)
        const user = await User.findById(userId);

        if (!user || !user.isProfileComplete) {
            return res.status(400).json({ message: 'Profile incomplete. Please complete your profile first.' });
        }

        // 2. Fetch latest quiz result
        const quizResult = await QuizResult.findOne({ userId }).sort({ createdAt: -1 });

        if (!quizResult) {
            return res.status(400).json({ message: 'Career Assessment not completed. Please take the quiz.' });
        }

        // 3. Optional: Verify if marks are present (assuming schema always has them if complete, but good failsafe)
        if (!user.subjects || (!user.subjects.class10 && !user.subjects.class12)) {
            return res.status(400).json({ message: 'Academic marks missing in profile.' });
        }

        // 4. Calculate recommendation using service logic
        const recommendation = generateRecommendation(user, quizResult);

        // 5. Send payload back to client
        res.status(200).json(recommendation);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating recommendation.' });
    }
};

module.exports = {
    getRecommendation
};
