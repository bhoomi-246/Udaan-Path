import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, LayoutDashboard, Brain, Compass, Sparkles, LogOut, User, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
        navigate('/');
    };

    const navLinks = [
        { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { to: '/quiz', label: 'Quiz', icon: Brain },
        { to: '/recommendation', label: 'Recommendations', icon: Compass },
        { to: '/assistant', label: 'AI Assistant', icon: Sparkles },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className="sticky top-0 z-40"
            style={{ background: 'rgba(26, 26, 26, 0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Brand */}
                    <Link to="/" className="flex items-center group">
                        <img
                            src="/logo.png"
                            alt="Udaan Path"
                            className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {user ? (
                            <>
                                {navLinks.map(({ to, label, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                            isActive(to)
                                                ? 'text-white'
                                                : 'text-white/55 hover:text-white/90 hover:bg-white/8'
                                        }`}
                                        style={isActive(to) ? {
                                            background: 'rgba(6,182,212,0.15)',
                                            color: '#22d3ee',
                                            boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.3)'
                                        } : {}}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </Link>
                                ))}

                                {/* Profile dropdown */}
                                <div className="relative ml-3" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/8"
                                        style={{ background: 'rgba(255,255,255,0.06)' }}
                                    >
                                        {user?.profilePicture ? (
                                            <img src={user.profilePicture} alt="Profile" className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-400/30" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                                style={{ background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' }}>
                                                {user?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-white/80 hidden lg:block">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                                        </motion.div>
                                    </button>

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-52 rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                                                style={{ background: 'rgba(8,14,30,0.97)', backdropFilter: 'blur(20px)' }}
                                            >
                                                {/* User info */}
                                                <div className="px-4 py-3 border-b border-white/10 mb-1">
                                                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-white/40 truncate mt-0.5">{user.email}</p>
                                                </div>

                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 mx-2 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-xl transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="flex items-center gap-2.5 mx-2 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-xl transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-teal-400" />
                                                    Edit Profile
                                                </Link>

                                                <div className="border-t border-white/10 mt-1 mx-2 mb-2" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-2.5 w-full text-left mx-2 px-3 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors mb-1"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Log Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/"
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/') ? 'text-cyan-300' : 'text-white/55 hover:text-white/90'}`}>
                                    Home
                                </Link>
                                <Link to="/about"
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-white/55 hover:text-white/90 transition-all">
                                    About
                                </Link>
                                <Link to="/login">
                                    <motion.div
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="ml-2 px-5 py-2 rounded-xl text-sm font-bold text-white shadow-lg cursor-pointer"
                                        style={{
                                            background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                                            boxShadow: '0 4px 16px rgba(6,182,212,0.35)'
                                        }}
                                    >
                                        Login
                                    </motion.div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
