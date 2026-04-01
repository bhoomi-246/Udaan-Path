const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Redirect after successful Google Login
// @route   GET /api/auth/google/callback
const googleAuthCallback = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate Token
    const token = generateToken(req.user._id);

    // Redirect to frontend dashboard with token in URL (simple approach)
    // In a stricter system, you could send a secure cookie instead.
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
    }

    res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        isProfileComplete: req.user.isProfileComplete,
        classLevel: req.user.classLevel,
        district: req.user.district,
        currentStream: req.user.currentStream,
    });
};

// @desc    Logout user
// @route   GET /api/auth/logout
const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

module.exports = {
    googleAuthCallback,
    getCurrentUser,
    logoutUser,
    generateToken, // Exporting for potential future use
};
