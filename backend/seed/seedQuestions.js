const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

// Load env vars
dotenv.config();

const questionsData = require('./questionbank.json');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Clear existing
        await Question.deleteMany();
        console.log('Old questions cleared.');

        // Insert new
        await Question.insertMany(questionsData);
        console.log('30 Quiz Questions Seeded Successfully.');

        process.exit();
    } catch (error) {
        console.error(`Error Seeding: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
