import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Target, Lightbulb, BookOpen, ArrowRight, Users, Star, Zap, GraduationCap, TrendingUp, Award } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

// Animated counter
const Counter = ({ end, suffix = '', duration = 2 }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = end / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [end, duration]);
    return <>{count.toLocaleString()}{suffix}</>;
};

const LandingPage = () => {
    const { user } = useAuth();

    const stats = [
        { icon: Users, value: 50000, suffix: '+', label: 'Students Guided', color: 'from-cyan-500 to-blue-600' },
        { icon: Star, value: 98, suffix: '%', label: 'Satisfaction Rate', color: 'from-amber-500 to-orange-500' },
        { icon: TrendingUp, value: 200, suffix: '+', label: 'Career Paths', color: 'from-emerald-500 to-teal-500' },
        { icon: Award, value: 15, suffix: '+', label: 'Expert Partners', color: 'from-rose-500 to-pink-500' },
    ];

    return (
        <AnimatedPage className="min-h-screen flex flex-col font-sans overflow-x-hidden">
            <main className="flex-grow">
                {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
                <section className="relative min-h-screen flex items-center overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 50%, #1c1c1c 100%)' }}>
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: "url('/images/student_hero_banner.png')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center top',
                                opacity: 0.12
                            }} />


                        {/* Floating dots */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-20"
                                style={{ left: `${10 + i * 8}%`, top: `${15 + (i % 4) * 20}%` }}
                                animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
                        {/* Left: Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 mb-8"
                                style={{ background: 'rgba(6,182,212,0.08)', backdropFilter: 'blur(10px)' }}
                            >
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <span className="text-cyan-300/90 text-sm font-semibold">AI-Powered Career Guidance</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
                                Discover Your{' '}
                                <span className="relative inline-block">
                                    <span className="bg-clip-text text-transparent"
                                        style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #22d3ee, #67e8f9)' }}>
                                        Dream Career
                                    </span>
                                    <motion.div
                                        className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }}
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.8, duration: 0.8 }}
                                    />
                                </span>
                            </h1>

                            <p className="text-xl text-white/60 leading-relaxed mb-10 max-w-lg">
                                Take our scientifically-designed RIASEC quiz and unlock personalized guidance across exams, scholarships, and career paths — built just for you.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                {user ? (
                                    <>
                                        <Link to="/quiz">
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -3 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-2xl cursor-pointer"
                                                style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', boxShadow: '0 8px 32px rgba(6,182,212,0.4)' }}
                                            >
                                                <GraduationCap className="w-5 h-5" />
                                                Start Career Quiz
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        </Link>
                                        <Link to="/dashboard">
                                            <motion.div
                                                whileHover={{ scale: 1.03, y: -2 }}
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white/80 border border-white/15 text-lg backdrop-blur-sm cursor-pointer"
                                                style={{ background: 'rgba(255,255,255,0.06)' }}
                                            >
                                                Go to Dashboard
                                            </motion.div>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login">
                                            <motion.div
                                                whileHover={{ scale: 1.05, y: -3 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-2xl cursor-pointer"
                                                style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', boxShadow: '0 8px 32px rgba(6,182,212,0.4)' }}
                                            >
                                                <GraduationCap className="w-5 h-5" />
                                                Get Started — Free
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.div>
                                        </Link>
                                        <a href="#how-it-works">
                                            <motion.div
                                                whileHover={{ scale: 1.03, y: -2 }}
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white/80 border border-white/15 text-lg backdrop-blur-sm cursor-pointer"
                                                style={{ background: 'rgba(255,255,255,0.06)' }}
                                            >
                                                Learn More
                                            </motion.div>
                                        </a>
                                    </>
                                )}
                            </div>

                            {/* Social proof */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex items-center gap-3 mt-8"
                            >
                                <div className="flex -space-x-2">
                                    {['🎓', '👩‍💻', '👨‍🔬', '👩‍🎨', '👨‍⚕️'].map((emoji, i) => (
                                        <div key={i}
                                            className="w-9 h-9 rounded-full border-2 border-cyan-400/20 flex items-center justify-center text-base"
                                            style={{ background: 'rgba(6,182,212,0.10)', backdropFilter: 'blur(8px)' }}>
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-white/60 text-sm">
                                    <span className="text-white font-semibold">50,000+</span> students already guided
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Right: Animated Orb Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
                            className="hidden lg:flex justify-center items-center relative"
                        >
                            <div className="relative w-[420px] h-[420px] flex items-center justify-center">

                                {/* Outer orbit ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="absolute w-[380px] h-[380px] rounded-full border border-cyan-400/10"
                                    style={{ borderStyle: 'dashed' }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-400 shadow-lg"
                                        style={{ boxShadow: '0 0 12px #06b6d4' }} />
                                </motion.div>

                                {/* Middle orbit ring */}
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                                    className="absolute w-[270px] h-[270px] rounded-full border border-cyan-400/10"
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-teal-400"
                                        style={{ boxShadow: '0 0 10px #0d9488' }} />
                                </motion.div>

                                {/* Inner orbit ring */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                                    className="absolute w-[165px] h-[165px] rounded-full border border-cyan-400/10"
                                >
                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400"
                                        style={{ boxShadow: '0 0 10px #10b981' }} />
                                </motion.div>

                                {/* Central glowing orb */}
                                <motion.div
                                    animate={{ scale: [1, 1.08, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                        boxShadow: '0 0 60px rgba(6,182,212,0.6), 0 0 120px rgba(6,182,212,0.15)'
                                    }}
                                >
                                    <GraduationCap className="w-10 h-10 text-white" />
                                </motion.div>

                                {/* Floating card: Quiz */}
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                    className="absolute -left-6 top-8 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl z-20"
                                    style={{ background: 'rgba(8,14,30,0.8)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                                            <Target className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">Career Match</p>
                                            <p className="text-white/50 text-xs">RIASEC Profiling</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating card: Result */}
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                                    className="absolute -right-6 bottom-10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl z-20"
                                    style={{ background: 'rgba(8,14,30,0.8)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)' }}>
                                            <TrendingUp className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-bold">95% Match!</p>
                                            <p className="text-white/50 text-xs">Software Engineer</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating card: Lightbulb */}
                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                                    className="absolute right-0 top-4 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-xl z-20"
                                    style={{ background: 'rgba(8,14,30,0.8)' }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}>
                                            <Lightbulb className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-white text-xs font-bold">AI Insights</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 z-10"
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <p className="text-xs tracking-widest uppercase">Scroll Down</p>
                        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
                            <div className="w-1 h-2 rounded-full bg-cyan-400/50" />
                        </div>
                    </motion.div>
                </section>

                {/* ═══════════════════════ STATS BAR ═══════════════════════ */}
                <section className="py-16 border-y border-white/8"
                    style={{ background: 'rgba(8,14,26,0.97)' }}>
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map(({ icon: Icon, value, suffix, label, color }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-3xl font-extrabold text-white mb-1">
                                    <Counter end={value} suffix={suffix} />
                                </span>
                                <span className="text-sm text-white/40 font-medium">{label}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
                <section id="how-it-works" className="py-24"
                    style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #222222 100%)' }}>
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 mb-6"
                                style={{ background: 'rgba(6,182,212,0.08)' }}>
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <span className="text-cyan-400 text-sm font-semibold">How It Works</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                                Your Path to{' '}
                                <span className="bg-clip-text text-transparent"
                                    style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #10b981)' }}>
                                    Success
                                </span>
                            </h2>
                            <p className="text-white/40 text-lg max-w-xl mx-auto">
                                Three simple steps to unlock your full potential and find your ideal career.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    step: '01',
                                    icon: Target,
                                    title: 'Take the Quiz',
                                    desc: 'Complete our 42-question RIASEC personality assessment — fully scientifically validated.',
                                    color: 'from-cyan-500 to-blue-600',
                                    glow: 'rgba(6,182,212,0.3)',
                                },
                                {
                                    step: '02',
                                    icon: Lightbulb,
                                    title: 'Get Smart Insights',
                                    desc: 'Our AI analyses your results and maps them to career paths suited perfectly for your personality.',
                                    color: 'from-amber-500 to-orange-500',
                                    glow: 'rgba(251,146,60,0.3)',
                                },
                                {
                                    step: '03',
                                    icon: BookOpen,
                                    title: 'Unlock Your Path',
                                    desc: 'Get a personalized roadmap of degrees, entrance exams, scholarships, and next steps.',
                                    color: 'from-emerald-500 to-teal-500',
                                    glow: 'rgba(16,185,129,0.3)',
                                },
                            ].map(({ step, icon: Icon, title, desc, color, glow }, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="relative rounded-3xl p-8 border border-white/8 overflow-hidden group"
                                    style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(10px)' }}
                                >
                                    {/* Background glow on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                                        style={{ background: `radial-gradient(circle at 30% 30%, ${glow}, transparent 70%)` }} />

                                    <div className="relative z-10">
                                        <span className="text-6xl font-black text-white/4 absolute top-4 right-6">{step}</span>

                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg`}>
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                                        <p className="text-white/45 leading-relaxed">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════ CAREER PATHS SECTION ═══════════════════════ */}
                <section className="py-24 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #222222 0%, #1a1a1a 100%)' }}>
                    <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/25 mb-6"
                                style={{ background: 'rgba(16,185,129,0.08)' }}>
                                <GraduationCap className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 text-sm font-semibold">200+ Career Paths</span>
                            </div>
                            <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                From dreams to a{' '}
                                <span className="bg-clip-text text-transparent"
                                    style={{ backgroundImage: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
                                    concrete plan
                                </span>
                            </h2>
                            <p className="text-white/45 text-lg leading-relaxed mb-8">
                                Whether you're drawn to medicine, engineering, arts, or entrepreneurship — Udaan Path maps out every step of your journey with clear, actionable guidance.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {['🏥 Healthcare', '💻 Technology', '🎨 Creative Arts', '⚖️ Law', '🔬 Research', '🏗️ Engineering', '🎓 Education', '💼 Business'].map((career, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="px-4 py-2 rounded-full text-sm font-semibold text-white/70 border border-white/8"
                                        style={{ background: 'rgba(13,27,42,0.8)' }}
                                    >
                                        {career}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-3xl blur-2xl opacity-25"
                                    style={{ background: 'radial-gradient(circle, #06b6d4, #10b981)' }} />
                                <motion.img
                                    src="/images/career_paths.png"
                                    alt="Career paths illustration"
                                    className="relative z-10 rounded-3xl w-full max-w-md shadow-2xl"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════ CTA SECTION ═══════════════════════ */}
                <section className="py-24 relative overflow-hidden border-t border-white/8"
                    style={{ background: 'linear-gradient(135deg, #222222 0%, #1a1a1a 100%)' }}>


                    {/* Particles */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-cyan-400/20"
                            style={{ left: `${i * 12 + 5}%`, top: `${20 + (i % 3) * 25}%` }}
                            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
                        />
                    ))}

                    <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-6xl mb-6">🚀</div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Your Future Starts <br />Today
                            </h2>
                            <p className="text-white/55 text-xl mb-10">
                                Join 50,000+ students who found their dream career with Udaan Path. It's free to start.
                            </p>
                            <Link to={user ? "/quiz" : "/login"}>
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-xl text-white cursor-pointer shadow-2xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                                        boxShadow: '0 8px 40px rgba(6,182,212,0.4)'
                                    }}
                                >
                                    <GraduationCap className="w-6 h-6" />
                                    {user ? 'Take Career Quiz' : 'Start for Free →'}
                                </motion.div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer style={{ background: '#050b14', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                className="py-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg">Udaan Path</span>
                    </div>
                    <p className="text-white/25 text-sm text-center">
                        © {new Date().getFullYear()} Udaan Path. Empowering students to reach for the stars. ✨
                    </p>
                </div>
            </footer>
        </AnimatedPage>
    );
};

export default LandingPage;
