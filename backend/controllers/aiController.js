const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const { generateRecommendation } = require('../services/recommendationService');
const { generateAICareerResponse } = require('../services/aiService');

// @desc    Process a user message and return an AI career guidance reply
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user._id;

        if (!message) {
            return res.status(400).json({ message: 'Missing message content.' });
        }

        // 1. Fetch User
        const user = await User.findById(userId);
        if (!user || !user.isProfileComplete) {
            return res.status(400).json({ message: 'Profile incomplete.' });
        }

        // 2. Fetch Quiz Result
        const quizResult = await QuizResult.findOne({ userId }).sort({ createdAt: -1 });
        if (!quizResult) {
            return res.status(400).json({ message: 'Career Assessment not completed.' });
        }

        // 3. Re-calculate core context locally
        // Instead of saving the recommendation object to DB which risks desyncing if algorithms alter, 
        // we dynamically re-run the pure function map against user data for guaranteed accuracy
        const recommendation = generateRecommendation(user, quizResult);

        // 4. Send the payload securely into the OpenAI service integration
        const aiReply = await generateAICareerResponse(recommendation, message);

        // 5. Respond
        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error(error);

        // Handle common OpenAI configuration misses cleanly
        if (error.message.includes('API key')) {
            return res.status(500).json({ message: 'OpenAI API Error: Missing API Key Configuration.' });
        }

        res.status(500).json({ message: 'Server error parsing AI response.' });
    }
};

module.exports = {
    chatWithAI
};
