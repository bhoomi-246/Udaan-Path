const careerMapping = require('../data/careerMapping');

// Calculate Academic Strength based on provided subject marks (assuming 10th or 12th)
const calculateAcademicStrength = (subjects) => {
    let scores = {};
    if (subjects.class12 && Object.keys(subjects.class12).some(k => subjects.class12[k])) {
        // Evaluate Class 12
        const s12 = subjects.class12;
        scores = {
            science: ((parseInt(s12.physics) || 0) + (parseInt(s12.chemistry) || 0) + (parseInt(s12.mathOrBiology) || 0)) / 3,
            commerce: (parseInt(s12.optional) || 0), // Simplifying assumption as specific commerce tags were omitted originally
            arts: (parseInt(s12.english) || 0)
        };
    } else if (subjects.class10 && Object.keys(subjects.class10).some(k => subjects.class10[k])) {
        // Evaluate Class 10
        const s10 = subjects.class10;
        scores = {
            science: ((parseInt(s10.mathematics) || 0) + (parseInt(s10.science) || 0)) / 2,
            arts: ((parseInt(s10.english) || 0) + (parseInt(s10.socialScience) || 0)) / 2,
            commerce: (parseInt(s10.optional) || 0)
        };
    } else {
        return 'Unknown';
    }

    // Identify highest academic strength
    let highest = 'arts';
    let maxScore = scores.arts || 0;

    if (scores.science > maxScore) {
        highest = 'science';
        maxScore = scores.science;
    }
    if (scores.commerce > maxScore) {
        highest = 'commerce';
        maxScore = scores.commerce;
    }

    return highest; // 'science', 'arts', or 'commerce'
};

const generateRecommendation = (user, quizResult) => {
    // 1. Determine base primary & secondary domains from Quiz Result
    const primaryCodeMatch = Object.entries({ 'Realistic': 'R', 'Investigative': 'I', 'Artistic': 'A', 'Social': 'S', 'Enterprising': 'E', 'Conventional': 'C' }).find(([key]) => key === quizResult.primaryInterest);
    const secondaryCodeMatch = Object.entries({ 'Realistic': 'R', 'Investigative': 'I', 'Artistic': 'A', 'Social': 'S', 'Enterprising': 'E', 'Conventional': 'C' }).find(([key]) => key === quizResult.secondaryInterest);

    // Default to a safe option if missing
    const primaryCode = primaryCodeMatch ? primaryCodeMatch[1] : 'I';
    const secondaryCode = secondaryCodeMatch ? secondaryCodeMatch[1] : 'R';

    const primaryData = careerMapping[primaryCode];
    const secondaryData = careerMapping[secondaryCode];

    // 2. Determine Academic Strength
    const academicStrength = calculateAcademicStrength(user.subjects || {});

    // 3. Hybrid Merge Logic
    // Start with strictly primary suggestions
    let recommendedStream = primaryData.stream;
    let degrees = [...primaryData.degrees];
    let careers = [...primaryData.careers];

    // Fuse secondary logic
    degrees = [...new Set([...degrees, ...secondaryData.degrees.slice(0, 2)])];
    careers = [...new Set([...careers, ...secondaryData.careers.slice(0, 2)])];

    // Validate feasibility with academic strength
    // If student has strong Science, boost technical fields to top. 
    // This is a naive heuristic weighting for standard display
    if (academicStrength === 'science' && !recommendedStream.toLowerCase().includes('science')) {
        recommendedStream += " or Science (based on exceptional math/science marks)";
    } else if (academicStrength === 'commerce' && !recommendedStream.toLowerCase().includes('commerce')) {
        recommendedStream += " or Commerce (viable with current academic skillset)";
    } else if (academicStrength === 'arts' && !recommendedStream.toLowerCase().includes('arts')) {
        recommendedStream += " or Arts (strong linguistic/social foundation)";
    }

    return {
        recommendedStream,
        degrees: degrees.slice(0, 5), // Keep it concise
        careers: careers.slice(0, 5)
    };
};

module.exports = {
    generateRecommendation
};
