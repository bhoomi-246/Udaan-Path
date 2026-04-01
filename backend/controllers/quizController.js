const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');

const MAX_ATTEMPTS = 3;

// @desc    Check if current user has already taken the quiz
// @route   GET /api/quiz/status
// @access  Private
const getQuizStatus = async (req, res) => {
    try {
        const attemptCount = await QuizResult.countDocuments({ userId: req.user._id });
        res.status(200).json({
            attemptCount,
            attemptsLeft: Math.max(0, MAX_ATTEMPTS - attemptCount),
            hasTaken: attemptCount >= MAX_ATTEMPTS
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error checking quiz status' });
    }
};

// @desc    Get all quiz questions
// @route   GET /api/quiz/questions
// @access  Private
const getQuestions = async (req, res) => {
    try {
        // We only need question text, option ID or text, ensuring we strip riasecTag
        const questions = await Question.find({});

        // Transform to remove riasecTag before sending to client
        const safeQuestions = questions.map(q => ({
            _id: q._id,
            questionText: q.questionText,
            options: q.options.map((opt, index) => ({
                text: opt.text,
                index // Provide index to track which option was chosen
            }))
        }));

        res.status(200).json(safeQuestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching questions' });
    }
};

// @desc    Submit quiz answers and calculate profile
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body;

        if (!answers || answers.length === 0) {
            return res.status(400).json({ message: 'No answers provided.' });
        }

        // ── Three-attempt lock ──
        const attemptCount = await QuizResult.countDocuments({ userId: req.user._id });
        if (attemptCount >= MAX_ATTEMPTS) {
            return res.status(403).json({
                message: `You have used all ${MAX_ATTEMPTS} attempts for the career assessment.`,
                hasTaken: true
            });
        }

        // Initialize scores
        const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

        // Fetch all original questions to cross-reference the riasecTags securely
        const questions = await Question.find({});
        const questionMap = {};
        questions.forEach(q => questionMap[q._id.toString()] = q);

        answers.forEach(ans => {
            const question = questionMap[ans.questionId];
            if (question && question.options[ans.selectedOptionIndex]) {
                const tag = question.options[ans.selectedOptionIndex].riasecTag;
                if (scores[tag] !== undefined) {
                    scores[tag] += 1;
                }
            }
        });

        // Map labels for better readability
        const riasecLabels = {
            'R': 'Realistic',
            'I': 'Investigative',
            'A': 'Artistic',
            'S': 'Social',
            'E': 'Enterprising',
            'C': 'Conventional'
        };

        // Sort scores to find primary and secondary
        // Object.entries(scores) => [['R', 7], ['I', 10], ...]
        const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

        const primaryCode = sortedScores[0][0];
        const secondaryCode = sortedScores[1][0];

        // Create result record
        const result = await QuizResult.create({
            userId: req.user._id,
            scores,
            primaryInterest: riasecLabels[primaryCode],
            secondaryInterest: riasecLabels[secondaryCode],
        });

        res.status(201).json({
            message: 'Quiz calculated successfully.',
            result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error processing quiz' });
    }
};

module.exports = {
    getQuizStatus,
    getQuestions,
    submitQuiz
};
