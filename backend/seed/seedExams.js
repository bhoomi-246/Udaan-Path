const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('../models/Exam');
const examData = require('../data/examData');

// Load environment variables
dotenv.config();

const seedExams = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Exam Seeding...');

        await Exam.deleteMany();
        console.log('Old exams cleared.');

        await Exam.insertMany(examData);
        console.log('Exam data inserted successfully.');

        process.exit();
    } catch (error) {
        console.error(`Error Seeding Exams: ${error.message}`);
        process.exit(1);
    }
};

seedExams();
