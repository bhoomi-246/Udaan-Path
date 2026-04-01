import React from 'react';
import { Link } from 'react-router-dom';

const ResultPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex justify-center items-center mb-6">
                <span className="text-4xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Assessment Complete</h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
                Your career interest profile has been accurately analyzed and saved to our systems. Detailed recommendations spanning career paths and college degrees will be automatically populated in the next stage.
            </p>
            <Link to="/recommendation" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors">
                View Recommendations
            </Link>
        </div>
    );
};

export default ResultPage;
