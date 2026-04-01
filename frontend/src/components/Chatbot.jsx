import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hi! I am your AI Career Assistant. I can see your recommended stream and career matches. What would you like to know?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'ai', content: response.data.reply }]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg = error.response?.data?.message?.includes('API Key')
                ? 'System Notice: The Platform Administrator has not provided an OpenAI API Key inside the .env file.'
                : 'Sorry, I am having trouble connecting right now.';

            setMessages(prev => [...prev, { role: 'ai', content: errorMsg, isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-2xl overflow-hidden flex flex-col h-[560px] border border-white/8"
            style={{ background: 'rgba(8,14,26,0.9)' }}>

            {/* Header */}
            <div className="p-4 shrink-0 flex items-center justify-between border-b border-white/8"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(13,148,136,0.15))' }}>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #06b6d4, #0d9488)' }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#1a1a1a] rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">AI Career Assistant</h3>
                        <p className="text-cyan-300/60 text-xs">Online and ready to help</p>
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4"
                style={{ background: 'rgba(8,14,26,0.7)' }}>
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${msg.role === 'user'
                            ? 'text-white rounded-br-none'
                            : msg.isError
                                ? 'border border-rose-400/25 text-rose-300 rounded-bl-none'
                                : 'border border-white/8 text-white/80 rounded-bl-none'
                            }`}
                            style={msg.role === 'user'
                                ? { background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }
                                : msg.isError
                                    ? { background: 'rgba(239,68,68,0.10)' }
                                    : { background: 'rgba(13,27,42,0.9)' }
                            }>
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="border border-white/8 rounded-2xl rounded-bl-none p-4 text-sm shadow-sm flex items-center gap-2"
                            style={{ background: 'rgba(13,27,42,0.9)' }}>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <div className="p-4 shrink-0 border-t border-white/8"
                style={{ background: 'rgba(8,14,26,0.9)' }}>
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about degrees, skills, or exams..."
                        className="w-full text-white text-sm rounded-xl py-3 pl-4 pr-12 transition-colors outline-none border border-white/10 focus:border-cyan-400/40 placeholder-white/25"
                        style={{ background: 'rgba(13,27,42,0.8)' }}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 rounded-lg disabled:opacity-30 transition-colors text-cyan-400 hover:bg-cyan-400/10"
                    >
                        <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
