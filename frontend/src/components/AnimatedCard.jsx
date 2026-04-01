import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = "", delay = 0, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={onClick ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 ${className} ${onClick ? 'cursor-pointer' : ''}`}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;
