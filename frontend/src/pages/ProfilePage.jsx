import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, BookOpen, GraduationCap, ArrowLeft, Save } from 'lucide-react';

// Dark input style
const inputClass = "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all";
const labelClass = "block text-sm font-medium text-white/55 mb-1.5";

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        mobileNumber: '',
        dateOfBirth: '',
        classLevel: '',
        district: '',
        currentStream: '',
        subjects: {
            class10: { mathematics: '', science: '', english: '', socialScience: '', optional: '' },
            class12: { physics: '', chemistry: '', mathOrBiology: '', english: '', optional: '' }
        }
    });

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const { data } = await api.get('/user/profile');
            const formattedDate = data.dateOfBirth
                ? new Date(data.dateOfBirth).toISOString().split('T')[0]
                : '';

            setFormData({
                mobileNumber: data.mobileNumber || '',
                dateOfBirth: formattedDate,
                classLevel: data.classLevel || '',
                district: data.district || '',
                currentStream: data.currentStream || '',
                subjects: {
                    class10: {
                        mathematics: data.subjects?.class10?.mathematics ?? '',
                        science: data.subjects?.class10?.science ?? '',
                        english: data.subjects?.class10?.english ?? '',
                        socialScience: data.subjects?.class10?.socialScience ?? '',
                        optional: data.subjects?.class10?.optional ?? '',
                    },
                    class12: {
                        physics: data.subjects?.class12?.physics ?? '',
                        chemistry: data.subjects?.class12?.chemistry ?? '',
                        mathOrBiology: data.subjects?.class12?.mathOrBiology ?? '',
                        english: data.subjects?.class12?.english ?? '',
                        optional: data.subjects?.class12?.optional ?? '',
                    }
                }
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch profile data.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubjectChange = (level, subject, value) => {
        let val = parseInt(value);
        if (value !== '' && (isNaN(val) || val < 0 || val > 100)) return;
        setFormData(prev => ({
            ...prev,
            subjects: {
                ...prev.subjects,
                [level]: { ...prev.subjects[level], [subject]: value }
            }
        }));
    };

    const validateForm = () => {
        if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
            setError('Please enter a valid 10-digit mobile number.');
            return false;
        }
        if (!formData.dateOfBirth || !formData.classLevel || !formData.district) {
            setError('Please fill out all required personal information fields.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        if (!validateForm()) return;
        setSaving(true);
        try {
            const { data: updatedUser } = await api.put('/user/profile', formData);
            setUser(updatedUser);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            console.error(err);
            setError('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 60%, #1c1c1c 100%)' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 border-4 border-white/10 border-t-cyan-400 rounded-full"
            />
        </div>
    );

    const sectionStyle = {
        background: 'rgba(13,27,42,0.8)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.08)',
    };

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans pb-24 relative"
            style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 60%, #1c1c1c 100%)' }}>



            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4"
                >
                    <div>
                        <div className="flex items-center gap-2 text-white/35 text-xs font-semibold uppercase tracking-widest mb-2">
                            <User className="w-3.5 h-3.5" /> Student Profile
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Edit Your Profile</h1>
                        <p className="mt-1 text-sm text-white/40">Complete your profile to unlock personalized career recommendations.</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/10 text-white/50 hover:text-white text-sm font-semibold transition-all"
                        style={{ background: 'rgba(13,27,42,0.8)', backdropFilter: 'blur(10px)' }}
                    >
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </motion.button>
                </motion.div>

                {/* Alerts */}
                {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-2xl border border-rose-400/25 text-rose-300 text-sm font-medium"
                        style={{ background: 'rgba(239,68,68,0.10)' }}>
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-2xl border border-emerald-400/25 text-emerald-300 text-sm font-medium"
                        style={{ background: 'rgba(16,185,129,0.10)' }}>
                        ✓ Profile saved successfully! Redirecting...
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Personal Information */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-3xl overflow-hidden"
                        style={sectionStyle}
                    >
                        <div className="px-6 py-5 border-b border-white/8 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-white">Personal Information</h3>
                                <p className="text-xs text-white/35">Your basic details</p>
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Mobile Number *</label>
                                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required
                                    className={inputClass} placeholder="10-digit mobile number" />
                            </div>
                            <div>
                                <label className={labelClass}>Date of Birth *</label>
                                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required
                                    className={inputClass}
                                    style={{ colorScheme: 'dark' }} />
                            </div>
                            <div>
                                <label className={labelClass}>Class Level *</label>
                                <select name="classLevel" value={formData.classLevel} onChange={handleChange} required
                                    className={inputClass}>
                                    <option value="" className="bg-[#222222]">Select Class</option>
                                    <option value="10" className="bg-[#222222]">Class 10</option>
                                    <option value="11" className="bg-[#222222]">Class 11</option>
                                    <option value="12" className="bg-[#222222]">Class 12</option>
                                    <option value="13" className="bg-[#222222]">Undergraduate (Passed 12th)</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>District *</label>
                                <input type="text" name="district" value={formData.district} onChange={handleChange} required
                                    className={inputClass} placeholder="Enter your district" />
                            </div>
                            {parseInt(formData.classLevel) >= 11 && (
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Current Stream (Optional)</label>
                                    <select name="currentStream" value={formData.currentStream} onChange={handleChange}
                                        className={inputClass}>
                                        <option value="" className="bg-[#222222]">Select Stream</option>
                                        <option value="Science" className="bg-[#222222]">Science (PCM/PCB)</option>
                                        <option value="Commerce" className="bg-[#222222]">Commerce</option>
                                        <option value="Arts" className="bg-[#222222]">Arts/Humanities</option>
                                        <option value="Vocational" className="bg-[#222222]">Vocational</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </motion.section>

                    {/* Section 2: Class 10 Marks */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-3xl overflow-hidden"
                        style={sectionStyle}
                    >
                        <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                    style={{ background: 'linear-gradient(135deg, #10b981, #0d9488)' }}>
                                    <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white">Class 10 Academic Marks</h3>
                                    <p className="text-xs text-white/35">Enter marks out of 100</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto rounded-2xl border border-white/8">
                                <table className="min-w-full">
                                    <thead>
                                        <tr style={{ background: 'rgba(6,182,212,0.08)' }}>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider border-b border-white/8 w-1/2">Subject</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider border-b border-white/8">Marks Obtained</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['mathematics', 'science', 'english', 'socialScience', 'optional'].map((subj, i) => (
                                            <tr key={subj} className="border-b border-white/6 last:border-0 hover:bg-white/3 transition-colors">
                                                <td className="px-6 py-3.5 text-sm font-medium text-white/70 capitalize">
                                                    {subj.replace(/([A-Z])/g, ' $1').trim()}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <input type="number"
                                                        value={formData.subjects.class10[subj]}
                                                        onChange={(e) => handleSubjectChange('class10', subj, e.target.value)}
                                                        className="w-32 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-colors placeholder-white/25"
                                                        placeholder="-- / 100" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 3: Class 12 Marks */}
                    {parseInt(formData.classLevel) >= 12 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-3xl overflow-hidden"
                            style={sectionStyle}
                        >
                            <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                        <GraduationCap className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">Class 12 Academic Marks</h3>
                                        <p className="text-xs text-white/35">Enter marks out of 100</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto rounded-2xl border border-white/8">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr style={{ background: 'rgba(245,158,11,0.08)' }}>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider border-b border-white/8 w-1/2">Subject</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider border-b border-white/8">Marks Obtained</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {['physics', 'chemistry', 'mathOrBiology', 'english', 'optional'].map((subj) => (
                                                <tr key={subj} className="border-b border-white/6 last:border-0 hover:bg-white/3 transition-colors">
                                                    <td className="px-6 py-3.5 text-sm font-medium text-white/70 capitalize">
                                                        {subj === 'mathOrBiology' ? 'Math / Biology' : subj.replace(/([A-Z])/g, ' $1').trim()}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        <input type="number"
                                                            value={formData.subjects.class12[subj]}
                                                            onChange={(e) => handleSubjectChange('class12', subj, e.target.value)}
                                                            className="w-32 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-cyan-400/40 transition-colors placeholder-white/25"
                                                            placeholder="-- / 100" />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-end pt-2"
                    >
                        <motion.button
                            type="submit"
                            disabled={saving}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-bold text-white shadow-lg disabled:opacity-50 transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
                                boxShadow: '0 4px 20px rgba(6,182,212,0.3)'
                            }}
                        >
                            {saving ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                                    />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Profile
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
