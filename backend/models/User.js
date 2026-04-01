const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        sparse: true, // Only some users might have google ID, others maybe email/pass in future
    },
    profilePicture: {
        type: String,
        default: '',
    },
    // Profile Information
    mobileNumber: {
        type: String,
        default: '',
    },
    dateOfBirth: {
        type: Date,
    },
    classLevel: {
        type: Number, // 10, 11, 12, etc.
    },
    district: {
        type: String,
        default: '',
    },
    currentStream: {
        type: String, // 'Science', 'Commerce', 'Arts', etc.
        default: '',
    },
    // Academic Marks Structure
    subjects: {
        class10: {
            mathematics: { type: Number, min: 0, max: 100 },
            science: { type: Number, min: 0, max: 100 },
            english: { type: Number, min: 0, max: 100 },
            socialScience: { type: Number, min: 0, max: 100 },
            optional: { type: Number, min: 0, max: 100 }
        },
        class12: {
            physics: { type: Number, min: 0, max: 100 },
            chemistry: { type: Number, min: 0, max: 100 },
            mathOrBiology: { type: Number, min: 0, max: 100 },
            english: { type: Number, min: 0, max: 100 },
            optional: { type: Number, min: 0, max: 100 }
        }
    },
    isProfileComplete: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
