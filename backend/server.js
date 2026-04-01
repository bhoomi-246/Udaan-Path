require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to MongoDB
// Only connect if MONGO_URI is set properly. For initial setup, we handle errors gracefully.
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'your_mongodb_connection') {
    connectDB();
} else {
    console.log("Skipping MongoDB connection: Please configure MONGO_URI in .env");
}

const session = require('express-session');
const passport = require('passport');

// Setup Passport config
require('./config/passport');

// Middleware
app.use(cors());
app.use(express.json());

// Session middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        // In production securely configured cookies are required
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));
app.use('/api/recommendation', require('./routes/recommendationRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Health checking route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'Server running successfully'
    });
});

// Basic Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
