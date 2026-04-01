import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Compass, Bookmark, Brain, Sparkles, GraduationCap, TrendingUp, ArrowRight, Zap, Star } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="rounded-2xl p-5 border border-white/8 relative overflow-hidden group"
        style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(10px)' }}
    >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 30% 30%, ${color}20, transparent 70%)` }} />
        <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div>
                <p className="text-white/45 text-xs font-medium mb-0.5">{label}</p>
                <p className="text-white font-bold text-lg">{value}</p>
            </div>
        </div>
    </motion.div>
);

const ActionCard = ({ icon: Icon, title, desc, to, btnLabel, gradient, glow, delay, disabled }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -6 }}
        className="rounded-3xl p-7 border border-white/8 relative overflow-hidden group flex flex-col"
        style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(12px)' }}
    >
        {/* Hover glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 20% 20%, ${glow}12, transparent 70%)` }} />

        {/* Icon */}
        <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
            style={{ background: gradient }}>
            <Icon className="w-7 h-7 text-white" />
        </div>

        <h3 className="relative z-10 text-white font-bold text-lg mb-2">{title}</h3>
        <p className="relative z-10 text-white/45 text-sm leading-relaxed flex-1 mb-6">{desc}</p>

        {disabled ? (
            <div className="relative z-10 flex items-center gap-2 px-5 py-3 rounded-xl text-white/25 text-sm font-semibold border border-white/8 bg-white/4 cursor-not-allowed">
                <span>{btnLabel}</span>
            </div>
        ) : (
            <Link to={to} className="relative z-10">
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-xl text-white text-sm font-bold shadow-lg"
                    style={{ background: gradient, boxShadow: `0 4px 20px ${glow}25` }}
                >
                    <span>{btnLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                </motion.div>
            </Link>
        )}
    </motion.div>
);

const Dashboard = () => {
    const [healthStatus, setHealthStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedStream, setRecommendedStream] = useState(null);
    const [quizTaken, setQuizTaken] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Health check + quiz status in parallel
                const [healthRes, statusRes] = await Promise.all([
                    api.get('/health'),
                    api.get('/quiz/status').catch(() => ({ data: { hasTaken: false } }))
                ]);
                setHealthStatus(healthRes.data);

                if (statusRes.data.hasTaken || statusRes.data.attemptCount > 0) {
                    setQuizTaken(true);
                    // Fetch the recommended stream
                    try {
                        const recRes = await api.get('/recommendation');
                        setRecommendedStream(recRes.data?.recommendedStream || null);
                    } catch {
                        // Recommendation not ready yet
                    }
                }

                setError(null);
            } catch (err) {
                console.error('Dashboard fetch failed:', err);
                setError('Could not connect to the backend server.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (user && !user.isProfileComplete) {
        return <Navigate to="/profile" replace />;
    }

    const userFirstName = user?.name ? user.name.split(' ')[0] : 'Student';

    const greetingTime = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <AnimatedPage className="min-h-screen flex flex-col font-sans relative overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 -z-10"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 50%, #1c1c1c 100%)' }}>

            </div>

            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="p-6 sm:p-8 max-w-6xl mx-auto">

                    {/* ─── Hero Header ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 rounded-3xl p-8 relative overflow-hidden border border-white/8 shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(14,165,233,0.12), rgba(16,185,129,0.08))' }}
                    >
                        {/* bg image hint */}
                        <div className="absolute inset-0 rounded-3xl"
                            style={{
                                backgroundImage: "url('/images/student_hero_banner.png')",
                                backgroundSize: 'cover', backgroundPosition: 'center',
                                opacity: 0.06
                            }} />

                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                            <div>
                                <div className="flex items-center gap-2 text-white/50 text-sm font-medium mb-1">
                                    <Sparkles className="w-4 h-4 text-yellow-400" />
                                    {greetingTime()}, {userFirstName}!
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                                    Student Dashboard
                                </h1>
                                <p className="text-white/40 text-sm font-medium">
                                    Class {user?.classLevel} · {user?.district} · {user?.currentStream}
                                </p>
                            </div>

                            {/* Server status badge */}
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 backdrop-blur-sm"
                                style={{ background: 'rgba(255,255,255,0.06)' }}>
                                {loading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-white/20 border-t-cyan-400 rounded-full"
                                    />
                                ) : (
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </div>
                                )}
                                <span className="text-white/60 text-sm font-semibold">
                                    {loading ? 'Connecting...' : healthStatus?.status || 'Online'}
                                </span>
                            </div>
                        </div>

                        {/* Motivational ticker */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative z-10 mt-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-400/20 w-fit"
                            style={{ background: 'rgba(251,191,36,0.07)' }}
                        >
                            <Star className="w-4 h-4 text-amber-400" />
                            <p className="text-amber-200/70 text-sm font-medium">
                                "The secret to getting ahead is getting started." — Mark Twain
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* ─── Quick Stats ─── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <StatCard icon={Brain} label="Assessment" value={quizTaken ? 'Completed ✓' : 'Not Taken'} color="#06b6d4" delay={0.1} />
                        <StatCard icon={GraduationCap} label="Recommended Stream" value={recommendedStream || (quizTaken ? 'Loading…' : 'Take Quiz')} color="#34d399" delay={0.15} />
                        <StatCard icon={TrendingUp} label="Career Paths" value="200+ Options" color="#10b981" delay={0.2} />
                        <StatCard icon={Zap} label="AI Insights" value="Personalized" color="#f97316" delay={0.25} />
                    </div>

                    {/* ─── Action Cards ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <ActionCard
                            icon={Brain}
                            title="Career Assessment"
                            desc="Take the scientifically validated RIASEC quiz to discover your personality type and ideal careers."
                            to="/quiz"
                            btnLabel="Start Quiz Now"
                            gradient="linear-gradient(135deg, #06b6d4, #0891b2)"
                            glow="#06b6d4"
                            delay={0.1}
                        />
                        <ActionCard
                            icon={Compass}
                            title="AI Recommendations"
                            desc="Review your tailored career tracks powered by AI — based on your quiz results and academics."
                            to="/recommendation"
                            btnLabel="View My Path"
                            gradient="linear-gradient(135deg, #10b981, #0d9488)"
                            glow="#10b981"
                            delay={0.2}
                        />
                        <ActionCard
                            icon={Bookmark}
                            title="Saved Resources"
                            desc="Quick access to your bookmarked entrance exams, scholarships, and study materials."
                            to="#"
                            btnLabel="Coming Soon"
                            gradient="linear-gradient(135deg, #f59e0b, #d97706)"
                            glow="#f59e0b"
                            delay={0.3}
                            disabled
                        />
                    </div>

                    {/* ─── Profile Row ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 items-stretch"
                    >
                        <Link to="/profile" className="flex-1">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -3 }}
                                className="h-full flex items-center gap-4 px-6 py-4 rounded-2xl border border-cyan-500/25 cursor-pointer group"
                                style={{ background: 'rgba(6,182,212,0.07)' }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center group-hover:bg-cyan-500/25 transition-colors">
                                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold text-sm">Your Profile</p>
                                    <p className="text-white/35 text-xs">Update your academic details</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-cyan-400/50 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </Link>
                        <Link to="/assistant" className="flex-1">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -3 }}
                                className="h-full flex items-center gap-4 px-6 py-4 rounded-2xl border border-teal-500/25 cursor-pointer group"
                                style={{ background: 'rgba(13,148,136,0.07)' }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-400/25 flex items-center justify-center group-hover:bg-teal-500/25 transition-colors">
                                    <Sparkles className="w-5 h-5 text-teal-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-semibold text-sm">AI Assistant</p>
                                    <p className="text-white/35 text-xs">Ask any career question</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-teal-400/50 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </Link>
                    </motion.div>

                </div>
            </main>
        </AnimatedPage>
    );
};

export default Dashboard;
