const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Exam = require('../models/Exam');
const { generateRecommendation } = require('../services/recommendationService');

// @desc    Get recommended competitive exams based on user stream
// @route   GET /api/exams/recommended
// @access  Private
const getRecommendedExams = async (req, res) => {
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

        // Retrieve Recommendation to extract designated Stream natively
        const recommendation = generateRecommendation(user, quizResult);
        const userStreamString = recommendation.recommendedStream.toLowerCase();

        // Interpret the broad string back into mapping tags
        // userStreamString might be "science or vocational" etc
        let queryStream = "All"; // Fallback target

        if (userStreamString.includes('science')) {
            queryStream = 'Science';
        } else if (userStreamString.includes('commerce')) {
            queryStream = 'Commerce';
        } else if (userStreamString.includes('arts')) {
            queryStream = 'Arts';
        }

        // Query the DB
        // Fetch specific stream OR universally applicable exams ('All')
        const exams = await Exam.find({
            $or: [
                { stream: queryStream },
                { stream: 'All' }
            ]
        });

        // Strip internal Object IDs / raw tokens if necessary, though Mongo payload is safe
        const safeExams = exams.map(e => ({
            _id: e._id,
            name: e.name,
            description: e.description,
            degree: e.degree,
            officialWebsite: e.officialWebsite
        }));

        res.status(200).json({ exams: safeExams });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching exams.' });
    }
};

module.exports = {
    getRecommendedExams
};
