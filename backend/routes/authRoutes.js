const express = require('express');
const passport = require('passport');
const { googleAuthCallback, getCurrentUser, logoutUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/auth/google
// @desc    Auth with Google
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
// @desc    Google auth callback
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
    googleAuthCallback
);

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   GET /api/auth/logout
// @desc    Logout user
router.get('/logout', logoutUser);

module.exports = router;
