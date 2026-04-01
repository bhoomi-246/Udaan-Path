const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Scholarship = require('../models/Scholarship');
const { generateRecommendation } = require('../services/recommendationService');

// @desc    Get recommended scholarships based on user stream
// @route   GET /api/scholarships/recommended
// @access  Private
const getRecommendedScholarships = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch User
        const user = await User.findById(userId);
        if (!user || !user.isProfileComplete) {
            return res.status(400).json({ message: 'Profile incomplete.' });
        }

        // Fetch latest Quiz Result
        const quizResult = await QuizResult.findOne({ userId }).sort({ createdAt: -1 });
        if (!quizResult) {
            return res.status(400).json({ message: 'Career Assessment not completed.' });
        }

        // Output specific target Stream mapping
        const recommendation = generateRecommendation(user, quizResult);
        const userStreamString = recommendation.recommendedStream.toLowerCase();

        // Interpret the broad string back into DB tags
        let queryStream = "All";

        if (userStreamString.includes('science')) {
            queryStream = 'Science';
        } else if (userStreamString.includes('commerce')) {
            queryStream = 'Commerce';
        } else if (userStreamString.includes('arts')) {
            queryStream = 'Arts';
        }

        // Query available options globally filtering target sectors
        const scholarships = await Scholarship.find({
            $or: [
                { stream: queryStream },
                { stream: 'All' }
            ]
        });

        // Strip payload arrays cleanly
        const safePayload = scholarships.map(s => ({
            _id: s._id,
            name: s.name,
            description: s.description,
            eligibility: s.eligibility,
            officialWebsite: s.officialWebsite
        }));

        res.status(200).json({ scholarships: safePayload });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching scholarships.' });
    }
};

module.exports = {
    getRecommendedScholarships
};
