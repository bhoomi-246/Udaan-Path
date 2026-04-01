import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, Shield, Zap } from 'lucide-react';

const LoginPage = () => {
    const { user } = useAuth();

    if (user) return <Navigate to="/dashboard" replace />;

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden px-4"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 50%, #1c1c1c 100%)' }}>



            {/* Floating dots */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-cyan-400/25 pointer-events-none"
                    style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 4) * 20}%` }}
                    animate={{ y: [0, -12, 0], opacity: [0.25, 0.6, 0.25] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Card */}
                <div className="rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    style={{ background: 'rgba(13,27,42,0.85)', backdropFilter: 'blur(24px)' }}>

                    {/* Top accent bar */}
                    <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #22d3ee, #10b981)' }} />

                    <div className="px-8 pt-10 pb-8 flex flex-col items-center">
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <img src="/logo.png" alt="Udaan Path" className="h-24 w-auto object-contain" />
                        </motion.div>

                        <p className="text-white/40 text-sm text-center mb-8">
                            Sign in to discover your ideal career path
                        </p>

                        {/* Feature pills */}
                        <div className="flex flex-wrap gap-2 justify-center mb-8">
                            {[
                                { icon: Sparkles, text: 'AI-Powered', color: '#06b6d4' },
                                { icon: Shield, text: 'Secure Login', color: '#10b981' },
                                { icon: Zap, text: 'Instant Results', color: '#f97316' },
                            ].map(({ icon: Icon, text, color }) => (
                                <div key={text}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 text-xs font-medium text-white/55"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    <Icon className="w-3 h-3" style={{ color }} />
                                    {text}
                                </div>
                            ))}
                        </div>

                        {/* Google Login Button */}
                        <motion.button
                            onClick={handleGoogleLogin}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl font-semibold text-white border border-white/15 shadow-lg transition-all"
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            {/* Google SVG */}
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                <path d="M1 1h22v22H1z" fill="none" />
                            </svg>
                            Continue with Google
                        </motion.button>

                        <p className="mt-4 text-white/25 text-xs text-center">
                            By signing in, you agree to our terms of service.
                        </p>

                        <div className="mt-6 pt-6 border-t border-white/8 w-full text-center">
                            <Link to="/"
                                className="text-white/35 hover:text-white/60 text-sm font-medium transition-colors">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
