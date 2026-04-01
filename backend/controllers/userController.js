const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Update personal info
            user.name = req.body.name || user.name;
            user.mobileNumber = req.body.mobileNumber !== undefined ? req.body.mobileNumber : user.mobileNumber;
            user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
            user.classLevel = req.body.classLevel || user.classLevel;
            user.district = req.body.district || user.district;
            user.currentStream = req.body.currentStream || user.currentStream;

            // Update academic marks
            if (req.body.subjects) {
                user.subjects = {
                    class10: { ...user.subjects?.class10, ...req.body.subjects.class10 },
                    class12: { ...user.subjects?.class12, ...req.body.subjects.class12 }
                };
            }

            // Mark profile as complete if key fields exist
            if (user.mobileNumber && user.dateOfBirth && user.classLevel && user.district) {
                user.isProfileComplete = true;
            }

            const updatedUser = await user.save();

            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
};
