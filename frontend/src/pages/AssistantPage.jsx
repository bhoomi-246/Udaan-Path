import React from 'react';
import Chatbot from '../components/Chatbot';
import AnimatedPage from '../components/AnimatedPage';
import { Sparkles } from 'lucide-react';

const AssistantPage = () => {
    return (
        <AnimatedPage className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 60%, #1c1c1c 100%)' }}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 mb-5"
                        style={{ background: 'rgba(6,182,212,0.08)' }}>
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-300/90 text-sm font-semibold">Powered by AI</span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                        AI Career Assistant
                    </h1>
                    <p className="mt-4 text-white/45 text-lg max-w-2xl mx-auto">
                        Your personalized mentor. Ask direct questions regarding your recommended streams, universities, competitive exams, and long-term career viability.
                    </p>
                </div>

                <div className="rounded-3xl overflow-hidden border border-white/8 shadow-2xl">
                    <Chatbot />
                </div>
            </div>
        </AnimatedPage>
    );
};

export default AssistantPage;
