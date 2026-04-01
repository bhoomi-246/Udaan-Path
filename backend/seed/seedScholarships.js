const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scholarship = require('../models/Scholarship');
const scholarshipData = require('../data/scholarshipData');

dotenv.config();

const seedScholarships = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Scholarship Seeding...');

        await Scholarship.deleteMany();
        console.log('Old scholarships cleared.');

        await Scholarship.insertMany(scholarshipData);
        console.log('Scholarship data inserted successfully.');

        process.exit();
    } catch (error) {
        console.error(`Error Seeding Scholarships: ${error.message}`);
        process.exit(1);
    }
};

seedScholarships();
