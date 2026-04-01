import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';

const FloatingChatbot = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Only show if logged in AND NOT on the dedicated assistant page
    if (!user || location.pathname === '/assistant') {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 w-[350px] shadow-2xl rounded-2xl overflow-hidden origin-bottom-right border border-gray-100"
                    >
                        {/* Add a specific close header specifically for the floating widget */}
                        <div className="bg-primary-700 text-white px-5 py-3 flex justify-between items-center text-sm border-b border-primary-600">
                            <span className="font-semibold tracking-wide">Udaan AI Mentor</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors focus:ring-2 focus:ring-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Wrap the existing Chatbot component inside */}
                        <div className="h-[450px]">
                            <Chatbot />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-300 ${isOpen ? 'bg-gray-800' : 'bg-primary-600 shadow-primary-500/50'}`}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageSquare className="w-6 h-6" />
                )}
            </motion.button>
        </div>
    );
};

export default FloatingChatbot;
