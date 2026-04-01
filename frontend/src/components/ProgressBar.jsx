import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, label = "" }) => {
    const percentage = Math.round((current / total) * 100);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">{label}</span>
                <span className="text-sm font-bold text-primary-600">{current} / {total}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200 shadow-inner">
                <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
