import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Chatbot from '../components/Chatbot';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase, Award, Lightbulb, MessageSquare, AlertCircle, ArrowLeft, ExternalLink, Sparkles, Star } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const TABS = [
    { key: 'stream',       label: 'My Stream',    icon: GraduationCap },
    { key: 'degrees',      label: 'Degrees',      icon: Sparkles       },
    { key: 'careers',      label: 'Careers',      icon: Briefcase      },
    { key: 'exams',        label: 'Exams',        icon: Lightbulb      },
    { key: 'scholarships', label: 'Scholarships', icon: Award          },
    { key: 'chat',         label: 'AI Chat',      icon: MessageSquare  },
];

const RecommendationPage = () => {
    const [activeTab, setActiveTab] = useState('stream');
    const [recommendation, setRecommendation] = useState(null);
    const [exams, setExams] = useState([]);
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recRes, examRes, scholarRes] = await Promise.all([
                    api.get('/recommendation'),
                    api.get('/exams/recommended'),
                    api.get('/scholarships/recommended')
                ]);
                setRecommendation(recRes.data);
                setExams(examRes.data.exams || []);
                setScholarships(scholarRes.data.scholarships || []);
            } catch (err) {
                const backendMsg = err.response?.data?.message || 'Failed to generate recommendations.';
                setError(backendMsg);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── Loading ──
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="w-14 h-14 border-4 border-white/15 border-t-cyan-400 rounded-full mb-6" />
                <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-white/50 text-lg font-semibold">Analysing your profile...</motion.p>
            </div>
        );
    }

    // ── Error ──
    if (error) {
        return (
            <AnimatedPage className="min-h-screen flex flex-col justify-center items-center p-6"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)' }}>
                <div className="rounded-3xl p-10 text-center max-w-md w-full border border-white/10 shadow-2xl"
                    style={{ background: 'rgba(13,27,42,0.9)', backdropFilter: 'blur(20px)' }}>
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-400/25 flex items-center justify-center mx-auto mb-5">
                        <AlertCircle className="w-8 h-8 text-rose-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Heads up!</h2>
                    <p className="text-white/50 mb-7 text-sm leading-relaxed">{error}</p>
                    <div className="flex flex-col gap-3">
                        {error.includes('Career Assessment') && (
                            <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate('/quiz')}
                                className="px-6 py-3 rounded-2xl font-bold text-white text-sm shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}>
                                Take Career Quiz
                            </motion.button>
                        )}
                        {error.includes('Profile') && (
                            <motion.button whileHover={{ scale: 1.03 }} onClick={() => navigate('/profile')}
                                className="px-6 py-3 rounded-2xl font-bold text-white text-sm shadow-lg"
                                style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)' }}>
                                Complete Profile
                            </motion.button>
                        )}
                        <button onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 rounded-2xl font-semibold text-white/50 text-sm border border-white/10 hover:border-white/25 hover:text-white transition-all"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    return (
        <AnimatedPage className="min-h-screen font-sans"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 40%, #1c1c1c 100%)' }}>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">

                {/* ── Page Header ── */}
                <div className="flex justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <div className="text-white/35 text-xs font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" /> AI Career Analysis
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your Recommendations</h1>
                    </div>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/10 text-white/50 hover:text-white text-sm font-semibold transition-all flex-shrink-0"
                        style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(10px)' }}>
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </motion.button>
                </div>

                {/* ── Tab Nav ── */}
                <div className="flex gap-1.5 flex-wrap mb-8 p-1.5 rounded-2xl border border-white/8"
                    style={{ background: 'rgba(13,27,42,0.7)', backdropFilter: 'blur(10px)' }}>
                    {TABS.map(({ key, label, icon: Icon }) => {
                        const isActive = activeTab === key;
                        return (
                            <motion.button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                whileTap={{ scale: 0.96 }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-1 justify-center min-w-[100px] ${
                                    isActive
                                        ? 'text-white shadow-lg'
                                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                }`}
                                style={isActive ? {
                                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                    boxShadow: '0 4px 16px rgba(6,182,212,0.3)'
                                } : {}}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="hidden sm:block">{label}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* ── Tab Content ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >

                        {/* ══ STREAM ══ */}
                        {activeTab === 'stream' && (
                            <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-white/10 shadow-2xl"
                                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.22), rgba(8,145,178,0.14), rgba(16,185,129,0.08))' }}>
                                <span className="text-cyan-300 text-xs font-bold uppercase tracking-widest mb-4 block">
                                    ✦ Optimal Academic Stream
                                </span>
                                <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight">
                                    {recommendation.recommendedStream}
                                </h2>
                                <p className="text-white/50 max-w-2xl text-base leading-relaxed mb-8">
                                    Our engine mapped your cognitive pattern and subject performance to determine this stream gives you the highest probability of professional success.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {['Career Aligned', 'Personality Matched', 'Score Optimised'].map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 border border-cyan-400/25"
                                            style={{ background: 'rgba(6,182,212,0.10)' }}>
                                            ✓ {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ══ DEGREES ══ */}
                        {activeTab === 'degrees' && (
                            <div className="rounded-3xl border border-white/8 overflow-hidden shadow-xl"
                                style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(14px)' }}>
                                <div className="px-8 py-6 border-b border-white/8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}>
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Suggested Degrees</h3>
                                        <p className="text-white/35 text-xs">Degrees aligned to your personality & stream</p>
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recommendation.degrees.map((degree, idx) => (
                                        <motion.div key={idx} whileHover={{ scale: 1.02, y: -2 }}
                                            className="flex items-center gap-4 p-5 rounded-2xl border border-white/8 group"
                                            style={{ background: 'rgba(8,14,26,0.6)' }}>
                                            <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                                style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}>
                                                {idx + 1}
                                            </span>
                                            <span className="text-white/75 font-semibold text-sm">{degree}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ══ CAREERS ══ */}
                        {activeTab === 'careers' && (
                            <div className="rounded-3xl border border-white/8 overflow-hidden shadow-xl"
                                style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(14px)' }}>
                                <div className="px-8 py-6 border-b border-white/8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)' }}>
                                        <Briefcase className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Career Opportunities</h3>
                                        <p className="text-white/35 text-xs">Roles matched to your RIASEC personality type</p>
                                    </div>
                                </div>
                                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recommendation.careers.map((career, idx) => (
                                        <motion.div key={idx} whileHover={{ scale: 1.02, y: -2 }}
                                            className="p-5 rounded-2xl border border-white/8 group"
                                            style={{ background: 'rgba(8,14,26,0.6)' }}>
                                            <div className="font-semibold text-white/80 text-sm mb-1.5">{career}</div>
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-3 h-3 text-emerald-400" />
                                                <span className="text-xs font-medium text-emerald-400">High Match</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ══ EXAMS ══ */}
                        {activeTab === 'exams' && (
                            <div className="rounded-3xl border border-white/8 overflow-hidden shadow-xl"
                                style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(14px)' }}>
                                <div className="px-8 py-6 border-b border-white/8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                                        <Lightbulb className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Recommended Competitive Exams</h3>
                                        <p className="text-white/35 text-xs">Curated entrance exams matched to your stream</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    {exams && exams.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {exams.map((exam) => (
                                                <div key={exam._id}
                                                    className="rounded-2xl p-5 border border-white/8 flex flex-col hover:border-cyan-400/25 transition-all"
                                                    style={{ background: 'rgba(8,14,26,0.6)' }}>
                                                    <div className="flex items-start justify-between mb-3 gap-2">
                                                        <h4 className="text-sm font-bold text-white leading-tight">{exam.name}</h4>
                                                        <span className="flex-shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold text-cyan-300 border border-cyan-400/25"
                                                            style={{ background: 'rgba(6,182,212,0.10)' }}>
                                                            {exam.degree === 'Multiple' ? 'Various' : exam.degree}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/40 text-xs leading-relaxed flex-1 mb-4">{exam.description}</p>
                                                    <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-cyan-300 border border-cyan-400/20 hover:bg-cyan-500/12 transition-all"
                                                        style={{ background: 'rgba(6,182,212,0.07)' }}>
                                                        Visit Website <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-white/30">
                                            <Lightbulb className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p>No exams found for your profile.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ══ SCHOLARSHIPS ══ */}
                        {activeTab === 'scholarships' && (
                            <div className="rounded-3xl border border-white/8 overflow-hidden shadow-xl"
                                style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(14px)' }}>
                                <div className="px-8 py-6 border-b border-white/8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Recommended Scholarships</h3>
                                        <p className="text-white/35 text-xs">Financial aid matched to your profile</p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    {scholarships && scholarships.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {scholarships.map((scholarship) => (
                                                <div key={scholarship._id}
                                                    className="rounded-2xl p-6 border border-white/8 flex flex-col hover:border-amber-400/25 transition-all"
                                                    style={{ background: 'rgba(8,14,26,0.6)' }}>
                                                    <h4 className="text-sm font-bold text-white mb-2">{scholarship.name}</h4>
                                                    <p className="text-white/40 text-xs leading-relaxed mb-4 flex-1">{scholarship.description}</p>
                                                    <div className="rounded-xl p-3 mb-4 border border-amber-400/15"
                                                        style={{ background: 'rgba(251,191,36,0.06)' }}>
                                                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Eligibility</div>
                                                        <div className="text-xs text-amber-200/70">{scholarship.eligibility}</div>
                                                    </div>
                                                    <a href={scholarship.officialWebsite} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-lg"
                                                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                                        Apply / Visit Website <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-white/30">
                                            <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                            <p>No scholarships found for your profile.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ══ AI CHAT ══ */}
                        {activeTab === 'chat' && (
                            <div className="rounded-3xl border border-white/8 overflow-hidden shadow-xl"
                                style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(14px)' }}>
                                <div className="px-8 py-6 border-b border-white/8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #06b6d4, #0d9488)' }}>
                                        <MessageSquare className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Ask our AI Career Assistant</h3>
                                        <p className="text-white/35 text-xs">Get instant answers about your career path</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <Chatbot />
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </AnimatedPage>
    );
};

export default RecommendationPage;
