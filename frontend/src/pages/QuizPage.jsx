import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Zap, Brain, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

// ──────────────────────────────────────────────
//  Warning Modal — shown before quiz starts
// ──────────────────────────────────────────────
const WarningModal = ({ onConfirm, onCancel, attemptCount }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
        <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-md rounded-3xl border border-amber-400/25 shadow-2xl overflow-hidden"
            style={{ background: 'rgba(13,27,42,0.98)' }}
        >
            <div className="h-1 w-full"
                style={{ background: 'linear-gradient(90deg,#f97316,#f59e0b)' }} />

            <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                    style={{ background: 'rgba(249,115,22,0.15)', border: '1.5px solid rgba(249,115,22,0.35)' }}>
                    <ShieldAlert className="w-8 h-8 text-amber-400" />
                </div>

                <h2 className="text-xl font-extrabold text-white mb-2 tracking-tight">
                    Attempt {attemptCount + 1} of 3
                </h2>
                <p className="text-white/55 text-sm leading-relaxed mb-2">
                    You have <span className="text-amber-300 font-bold">{3 - attemptCount} attempt{3 - attemptCount > 1 ? 's' : ''} remaining</span> (including this one). Each attempt overwrites your previous result.
                </p>
                <div className="flex items-start gap-2 px-4 py-3 rounded-2xl border border-amber-400/20 mb-7 w-full"
                    style={{ background: 'rgba(249,115,22,0.08)' }}>
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-300/80 text-xs text-left leading-relaxed">
                        Answer every question honestly and carefully. Take your time —
                        {3 - attemptCount === 1
                            ? <strong> this is your final attempt!</strong>
                            : ` you have ${3 - attemptCount} attempts left.`}
                    </p>
                </div>

                <div className="flex gap-3 w-full">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white/50 border border-white/10 hover:border-white/20 hover:text-white transition-all"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        Go Back
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-lg"
                        style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)', boxShadow: '0 4px 18px rgba(249,115,22,0.4)' }}>
                        I Understand — Start Quiz
                    </motion.button>
                </div>
            </div>
        </motion.div>
    </div>
);


// ──────────────────────────────────────────────
//  Already Taken Screen
// ──────────────────────────────────────────────
const AlreadyTakenScreen = ({ onViewResults }) => (
    <div className="h-screen flex flex-col items-center justify-center p-6" style={{ background: '#1a1a1a' }}>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl text-center overflow-hidden"
            style={{ background: 'rgba(13,27,42,0.95)' }}
        >
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#06b6d4,#10b981)' }} />
            <div className="p-8">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1.5px solid rgba(16,185,129,0.35)' }}>
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-extrabold text-white mb-2">All 3 Attempts Used</h2>
                <p className="text-white/45 text-sm leading-relaxed mb-7">
                    You've used all 3 attempts for the career assessment. View your most recent personalised results below.
                </p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={onViewResults}
                    className="w-full py-3 rounded-2xl font-bold text-white text-sm shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', boxShadow: '0 4px 18px rgba(6,182,212,0.35)' }}>
                    View My Results →
                </motion.button>
            </div>
        </motion.div>
    </div>
);

// ──────────────────────────────────────────────
//  Main Quiz Page
// ──────────────────────────────────────────────
const QuizPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [direction, setDirection] = useState(1);

    const [statusData, setStatusData] = useState({ attemptCount: 0, attemptsLeft: 3 });
    const [hasTaken, setHasTaken] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Check if already taken
                const { data: status } = await api.get('/quiz/status');
                setStatusData(status);
                if (status.hasTaken) {
                    setHasTaken(true);
                    setLoading(false);
                    return;
                }

                // 2. Load questions
                const { data: qs } = await api.get('/quiz/questions');
                setQuestions(qs);
            } catch (err) {
                setError('Failed to load assessment. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const getAnswer = (qId) => answers.find(a => a.questionId === qId);

    const handleOptionSelect = (optionIndex) => {
        const qId = questions[currentIndex]._id;
        setAnswers(prev => {
            const filtered = prev.filter(a => a.questionId !== qId);
            return [...filtered, { questionId: qId, selectedOptionIndex: optionIndex }];
        });
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setDirection(1);
                setCurrentIndex(i => i + 1);
            }
        }, 400);
    };

    const goTo = (idx) => {
        setDirection(idx > currentIndex ? 1 : -1);
        setCurrentIndex(idx);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            await api.post('/quiz/submit', { answers });
            navigate('/result', { replace: true });
        } catch (err) {
            if (err.response?.status === 403) {
                setHasTaken(true);
            } else {
                setError('Submit failed. Please try again.');
            }
            setSubmitting(false);
        }
    };

    /* ─── Loading ─── */
    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center" style={{ background: '#1a1a1a' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white/10 border-t-cyan-400 rounded-full mb-4" />
            <p className="text-white/50 font-medium">Loading assessment…</p>
        </div>
    );

    /* ─── Already taken ─── */
    if (hasTaken) return <AlreadyTakenScreen onViewResults={() => navigate('/recommendation')} />;

    /* ─── Error ─── */
    if (error) return (
        <div className="h-screen flex flex-col items-center justify-center p-6" style={{ background: '#1a1a1a' }}>
            <div className="rounded-3xl p-8 text-center max-w-sm w-full border border-white/8"
                style={{ background: 'rgba(13,27,42,0.9)' }}>
                <div className="text-5xl mb-4">😕</div>
                <p className="text-white font-bold mb-2">{error}</p>
                <button onClick={() => navigate('/dashboard')}
                    className="mt-4 px-6 py-2.5 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)' }}>
                    Back to Dashboard
                </button>
            </div>
        </div>
    );

    /* ─── Warning screen (before quiz starts) ─── */
    if (!quizStarted) return (
        <>
            <div className="h-screen flex flex-col items-center justify-center p-6" style={{ background: '#1a1a1a' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md rounded-3xl border border-white/8 overflow-hidden shadow-2xl text-center"
                    style={{ background: 'rgba(13,27,42,0.9)' }}>
                    <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#06b6d4,#10b981)' }} />
                    <div className="p-8">
                        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)', boxShadow: '0 0 30px rgba(6,182,212,0.35)' }}>
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Career Assessment</h1>
                        <p className="text-white/45 text-sm leading-relaxed mb-6">
                            {questions.length} questions · RIASEC Personality Profiling · ~10 minutes<br />
                            <span className="text-cyan-300 font-semibold">{statusData.attemptsLeft} of 3 attempts remaining</span>
                        </p>
                        <div className="flex flex-col gap-2 text-left mb-7">
                            {[
                                'Answer every question honestly',
                                'There are no right or wrong answers',
                                'Results are permanent — one attempt only',
                            ].map((tip, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-sm text-white/55">
                                    <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(6,182,212,0.15)' }}>
                                        <span className="text-cyan-400 text-[10px] font-bold">{i + 1}</span>
                                    </div>
                                    {tip}
                                </div>
                            ))}
                        </div>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setShowWarning(true)}
                            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm shadow-lg"
                            style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', boxShadow: '0 4px 18px rgba(6,182,212,0.35)' }}>
                            Begin Assessment →
                        </motion.button>
                        <button onClick={() => navigate('/dashboard')}
                            className="mt-3 w-full py-2 text-sm text-white/30 hover:text-white/60 transition-colors">
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Warning modal */}
            <AnimatePresence>
                {showWarning && (
                    <WarningModal
                        attemptCount={statusData.attemptCount}
                        onConfirm={() => { setShowWarning(false); setQuizStarted(true); }}
                        onCancel={() => setShowWarning(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );

    /* ─── Active quiz ─── */
    if (!questions.length) return null;

    const q = questions[currentIndex];
    const currentAnswer = getAnswer(q._id);
    const answeredCount = answers.length;
    const isLast = currentIndex === questions.length - 1;

    const optionAccents = [
        { active: '#06b6d4', shadow: 'rgba(6,182,212,0.35)',  label: 'A' },
        { active: '#10b981', shadow: 'rgba(16,185,129,0.35)', label: 'B' },
        { active: '#f97316', shadow: 'rgba(249,115,22,0.35)', label: 'C' },
        { active: '#e11d48', shadow: 'rgba(225,29,72,0.35)',  label: 'D' },
        { active: '#0ea5e9', shadow: 'rgba(14,165,233,0.35)', label: 'E' },
    ];

    return (
        <div className="h-screen flex flex-col overflow-hidden font-sans" style={{ background: '#1a1a1a' }}>

            {/* ── HEADER ── */}
            <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/8"
                style={{ background: 'rgba(8,14,26,0.95)' }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}>
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="leading-tight">
                        <p className="text-white font-bold text-sm">Career Assessment</p>
                        <p className="text-white/35 text-xs">{answeredCount}/{questions.length} answered</p>
                    </div>
                </div>
                <div className="flex-1 mx-6 hidden sm:block">
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg,#06b6d4,#10b981)' }}
                            animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
                            transition={{ duration: 0.4 }} />
                    </div>
                </div>
                <button onClick={() => navigate('/dashboard')}
                    className="text-white/35 hover:text-white/70 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/6 transition-colors">
                    Exit
                </button>
            </header>

            {/* ── QUESTION STATUS NAV ── */}
            <div className="flex-shrink-0 px-4 py-2.5 border-b border-white/6 overflow-x-auto"
                style={{ background: 'rgba(8,14,26,0.85)' }}>
                <div className="flex gap-1.5 min-w-max">
                    {questions.map((qu, idx) => {
                        const answered = !!getAnswer(qu._id);
                        const isCurrent = idx === currentIndex;
                        return (
                            <motion.button key={idx} onClick={() => goTo(idx)} whileTap={{ scale: 0.9 }}
                                title={`Q${idx + 1}`}
                                className="flex-shrink-0 w-7 h-7 rounded-lg text-[11px] font-bold transition-all duration-150"
                                style={{
                                    background: isCurrent
                                        ? 'linear-gradient(135deg,#06b6d4,#0891b2)'
                                        : answered ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)',
                                    color: isCurrent ? '#fff' : answered ? '#34d399' : 'rgba(255,255,255,0.35)',
                                    boxShadow: isCurrent ? '0 0 12px rgba(6,182,212,0.5)' : 'none',
                                    border: isCurrent ? '1.5px solid rgba(6,182,212,0.6)'
                                        : answered ? '1.5px solid rgba(16,185,129,0.4)'
                                        : '1.5px solid rgba(255,255,255,0.08)',
                                }}>
                                {idx + 1}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 flex flex-col min-h-0 px-4 py-4 sm:px-6 sm:py-5 max-w-3xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div key={q._id}
                        initial={{ opacity: 0, x: direction * 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -direction * 40 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="flex flex-col flex-1 min-h-0">
                        <div className="mb-3 flex-shrink-0">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                                Question {currentIndex + 1} of {questions.length}
                            </span>
                            <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                                {q.questionText}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-h-0 content-start">
                            {q.options.map((option, idx) => {
                                const accent = optionAccents[idx % optionAccents.length];
                                const isSelected = currentAnswer?.selectedOptionIndex === option.index;
                                return (
                                    <motion.button key={idx} onClick={() => handleOptionSelect(option.index)}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        className="text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200"
                                        style={isSelected ? {
                                            background: `${accent.active}20`,
                                            border: `1.5px solid ${accent.active}`,
                                            boxShadow: `0 4px 20px ${accent.shadow}`,
                                        } : {
                                            background: 'rgba(13,27,42,0.75)',
                                            border: '1.5px solid rgba(255,255,255,0.08)',
                                        }}>
                                        <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                                            style={isSelected
                                                ? { background: accent.active, color: '#fff' }
                                                : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                                            {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : accent.label}
                                        </span>
                                        <span className={`text-sm font-semibold leading-snug ${isSelected ? 'text-white' : 'text-white/65'}`}>
                                            {option.text}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── FOOTER NAV ── */}
            <footer className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-white/8 flex items-center justify-between gap-3"
                style={{ background: 'rgba(8,14,26,0.95)' }}>
                <motion.button onClick={() => { setDirection(-1); setCurrentIndex(i => i - 1); }}
                    disabled={currentIndex === 0} whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white disabled:opacity-20 hover:bg-white/6 transition-all">
                    <ArrowLeft className="w-4 h-4" /> Prev
                </motion.button>
                <div className="text-xs font-semibold text-white/30 text-center hidden sm:block">
                    {answers.length < questions.length
                        ? `${questions.length - answers.length} remaining`
                        : <span className="text-emerald-400">All answered ✓</span>}
                </div>
                {isLast ? (
                    <motion.button onClick={handleSubmit}
                        disabled={submitting || answers.length !== questions.length}
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 shadow-lg"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#0ea5e9)', boxShadow: '0 4px 18px rgba(6,182,212,0.35)' }}>
                        {submitting
                            ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full" /> Calculating…</>
                            : <><Zap className="w-4 h-4" /> Get Results</>}
                    </motion.button>
                ) : (
                    <motion.button onClick={() => { setDirection(1); setCurrentIndex(i => i + 1); }}
                        disabled={currentIndex === questions.length - 1}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-20 shadow-md"
                        style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}>
                        Next <ArrowRight className="w-4 h-4" />
                    </motion.button>
                )}
            </footer>
        </div>
    );
};

export default QuizPage;
