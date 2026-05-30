import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import { PORTAL_TRANSLATIONS } from '../../translations';
import {
    MessageSquare, Search, Plus, Pin, PinOff, Send, Mic, MicOff,
    ThumbsUp, ThumbsDown, Star, Download, Mail, Share2, ChevronDown,
    Sparkles, Clock, BookOpen, Wallet, TrendingUp, PiggyBank, HelpCircle,
    Phone, MoreVertical, Volume2, X, ChevronRight, AlertCircle, Globe,
    StopCircle, AudioLines
} from 'lucide-react';
import { sageAPI } from '../../api';
import useVoiceInput from '../../hooks/useVoiceInput';
import './customer-portal.css';

// ── Typewriter Hook ───────────────────────────────────────────
function useTypewriter(text, speed = 16, enabled = true) {
    const [displayed, setDisplayed] = useState(() => (!enabled || !text ? (text || '') : ''));
    const [done, setDone] = useState(() => (!enabled || !text));
    const indexRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!enabled || !text) {
            setDisplayed(text || '');
            setDone(true);
            return;
        }

        setDisplayed('');
        setDone(false);
        indexRef.current = 0;

        timerRef.current = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayed(text.slice(0, indexRef.current + 1));
                indexRef.current += 1;
            } else {
                clearInterval(timerRef.current);
                setDone(true);
            }
        }, speed);

        return () => clearInterval(timerRef.current);
    }, [text, speed, enabled]);

    const skip = useCallback(() => {
        clearInterval(timerRef.current);
        setDisplayed(text);
        setDone(true);
    }, [text]);

    return { displayed, done, skip };
}

// ── Single SAGE message with typewriter ────────────────────────
function SageMessageBubble({
    msg,
    isLatest,
    onFeedback,
    onTranslate,
    language,
    selectedFeedback,
    feedbackOpen,
    onThumbsFeedback,
    onFeedbackReason,
    feedbackReasons,
    customerLang,
    t
}) {
    const displayText = msg.showTranslation ? (msg.translations?.[language] || msg.text) : msg.text;
    const shouldAnimate = isLatest && !msg.showTranslation;
    const { displayed, done, skip } = useTypewriter(displayText, 14, shouldAnimate);
    const finalText = shouldAnimate ? displayed : displayText;

    const langLabel = language === 'HINDI' ? 'हिन्दी' : language;

    const getFeedbackReasonLabel = (reason) => {
        if (customerLang === 'HI') {
            if (reason === 'The answer was confusing / hard to understand') return 'उत्तर भ्रमित करने वाला / समझने में कठिन था';
            if (reason === "This didn't answer my actual question") return 'इसने मेरे वास्तविक प्रश्न का उत्तर नहीं दिया';
            if (reason === "The advice doesn't apply to my situation") return 'सलाह मेरी स्थिति पर लागू नहीं होती';
            if (reason === 'I got better information elsewhere') return 'मुझे कहीं और बेहतर जानकारी मिली';
            if (reason === 'Other (please describe)') return 'अन्य (कृपया वर्णन करें)';
        }
        return reason;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
                maxWidth: '70%', padding: '14px 18px', borderRadius: 16,
                background: 'var(--bg-card-hover)',
                color: 'var(--text-primary)',
                borderBottomLeftRadius: 4,
                border: '1px solid var(--border-color)',
                fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-line',
                position: 'relative',
            }}>
                {finalText}
                {!done && shouldAnimate && <span style={{ display: 'inline-block', color: '#a78bfa', animation: 'blink 0.7s step-end infinite', marginLeft: 1, fontWeight: 300 }}>▌</span>}
            </div>

            {/* Skip button */}
            {!done && shouldAnimate && isLatest && (
                <button onClick={skip} className="cp-sage-skip-btn">
                    <StopCircle size={12} />
                    <span>{customerLang === 'HI' ? 'छोड़ें' : 'Skip'}</span>
                </button>
            )}

            {/* Actions row: feedback + translate */}
            {done && msg.id && !msg.id.toString().includes('-err') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    {/* Thumbs feedback */}
                    <button
                        onClick={() => onThumbsFeedback(msg.id, 'up')}
                        style={{
                            background: selectedFeedback[msg.id] === 'up' ? 'rgba(16,185,129,0.15)' : 'none',
                            border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                            color: selectedFeedback[msg.id] === 'up' ? 'var(--accent-green)' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <ThumbsUp size={14} />
                    </button>
                    <button
                        onClick={() => onThumbsFeedback(msg.id, 'down')}
                        style={{
                            background: selectedFeedback[msg.id] === 'down' ? 'rgba(239,68,68,0.15)' : 'none',
                            border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
                            color: selectedFeedback[msg.id] === 'down' ? '#ef4444' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <ThumbsDown size={14} />
                    </button>

                    {/* Translate button — only shows when a non-English language is selected */}
                    {language !== 'ENGLISH' && (
                        <button
                            onClick={() => onTranslate(msg.id)}
                            disabled={msg.translating}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                padding: '4px 12px', borderRadius: 100,
                                fontSize: '0.75rem', fontWeight: 500,
                                background: msg.showTranslation ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)',
                                border: `1px solid ${msg.showTranslation ? 'rgba(59,130,246,0.3)' : 'var(--border-color)'}`,
                                color: msg.showTranslation ? '#60a5fa' : 'var(--text-secondary)',
                                cursor: msg.translating ? 'wait' : 'pointer',
                                fontFamily: 'inherit', transition: 'all 0.2s',
                                opacity: msg.translating ? 0.7 : 1,
                            }}
                        >
                            <Globe size={12} />
                            {msg.translating ? (
                                <span>{customerLang === 'HI' ? 'अनुवाद किया जा रहा है…' : 'Translating…'}</span>
                            ) : msg.showTranslation ? (
                                <span>{customerLang === 'HI' ? 'मूल संदेश दिखाएं' : 'Show Original'}</span>
                            ) : (
                                <span>{customerLang === 'HI' ? 'हिन्दी में अनुवाद करें' : `Translate to ${langLabel}`}</span>
                            )}
                        </button>
                    )}

                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{msg.time || ''}</span>
                </div>
            )}

            {/* Feedback reasons dropdown */}
            {feedbackOpen === msg.id && (
                <div style={{
                    marginTop: 8, padding: 12, background: 'var(--bg-secondary)', borderRadius: 10,
                    border: '1px solid var(--border-color)', maxWidth: '70%',
                }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
                        {customerLang === 'HI' ? 'यह मददगार क्यों नहीं था?' : "Why wasn't this helpful?"}
                    </div>
                    {feedbackReasons.map(reason => (
                        <button key={reason} onClick={() => onFeedbackReason(msg.id, reason)} style={{
                            display: 'block', width: '100%', textAlign: 'left', padding: '6px 10px',
                            background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem',
                            color: 'var(--text-secondary)', borderRadius: 6, fontFamily: 'inherit',
                            marginBottom: 2,
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            {getFeedbackReasonLabel(reason)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── User message bubble ───────────────────────────────────────
function UserMessageBubble({ msg, customerLang }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', animation: 'fadeIn 0.3s ease' }}>
            <div style={{
                maxWidth: '70%', padding: '14px 18px', borderRadius: 16,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                borderBottomRightRadius: 4,
                fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-line',
                position: 'relative',
            }}>
                {msg.text}
                {msg.viaVoice && (
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', marginLeft: 6,
                        padding: '1px 5px', borderRadius: 6, background: 'rgba(255,255,255,0.2)',
                        fontSize: '0.6rem', verticalAlign: 'middle',
                    }}>
                        <Mic size={9} style={{ marginRight: 2 }} /> {customerLang === 'HI' ? 'आवाज' : 'voice'}
                    </span>
                )}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>{msg.time || ''}</span>
        </div>
    );
}


const TOPIC_QUICKSTARTS = [
    { icon: Wallet, label: 'Budgeting', prompt: 'Help me create a monthly budget', color: '#3b82f6', topic: 'BUDGETING' },
    { icon: PiggyBank, label: 'Saving', prompt: 'How much should I save each month?', color: '#10b981', topic: 'SAVING' },
    { icon: TrendingUp, label: 'Investing', prompt: 'Should I start an SIP?', color: '#8b5cf6', topic: 'INVESTING' },
    { icon: AlertCircle, label: 'Debt', prompt: 'Help me manage my EMIs', color: '#f59e0b', topic: 'DEBT' },
    { icon: BookOpen, label: 'Learn', prompt: 'Explain compound interest to me', color: '#06b6d4', topic: 'GENERAL' },
];

const FEEDBACK_REASONS = [
    'The answer was confusing / hard to understand',
    'This didn\'t answer my actual question',
    'The advice doesn\'t apply to my situation',
    'I got better information elsewhere',
    'Other (please describe)',
];

export default function SageAssistantPage() {
    const location = useLocation();
    const { customerLang } = useOutletContext();
    const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState(location.state?.message || '');
    const [topic, setTopic] = useState('GENERAL');
    const [loading, setLoading] = useState(false);
    const [latestId, setLatestId] = useState(null);
    const [lastSentViaVoice, setLastSentViaVoice] = useState(false);
    const [language, setLanguage] = useState('ENGLISH');
    const [translationError, setTranslationError] = useState(null);
    const isSending = useRef(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [feedbackOpen, setFeedbackOpen] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState({});
    const [sessionRating, setSessionRating] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [historyCollapsed, setHistoryCollapsed] = useState(false);
    const [conversations, setConversations] = useState([]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const prevFinalRef = useRef('');

    // ── Synchronize Local Language state with Context Language ──
    useEffect(() => {
        setLanguage(customerLang === 'HI' ? 'HINDI' : 'ENGLISH');
    }, [customerLang]);

    // ── Auto-dismiss translation errors ──────────────────────────
    useEffect(() => {
        if (translationError) {
            const timer = setTimeout(() => setTranslationError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [translationError]);

    // ── Voice Input Hook ─────────────────────────────────────────
    const {
        isSupported: voiceSupported,
        isListening,
        interimTranscript,
        finalTranscript,
        error: voiceError,
        startListening,
        stopListening,
        resetTranscript,
        dismissError: dismissVoiceError,
    } = useVoiceInput({ lang: 'en-US', silenceTimeout: 4000 });

    // ── Sync final transcript → input ────────────────────────────
    useEffect(() => {
        if (finalTranscript && finalTranscript !== prevFinalRef.current) {
            setInput(finalTranscript);
            setLastSentViaVoice(true);
            prevFinalRef.current = finalTranscript;
        }
    }, [finalTranscript]);

    // ── When user types, clear voice flag ────────────────────────
    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (!isListening) setLastSentViaVoice(false);
    };

    // ── Toggle microphone ────────────────────────────────────────
    const toggleVoice = () => {
        if (isListening) {
            stopListening();
        } else {
            prevFinalRef.current = '';
            resetTranscript();
            startListening();
            setLastSentViaVoice(true);
        }
    };

    // ── Load chat history from API ───────────────────────────────
    useEffect(() => {
        async function loadHistory() {
            try {
                const res = await sageAPI.getHistory({ limit: 30 });
                const history = res.data.data.reverse().flatMap((conv) => [
                    {
                        id: conv.id + '-u', type: 'user', text: conv.userMessage, topic: conv.topic,
                        translations: {},
                        time: new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                    {
                        id: conv.id, type: 'sage', text: conv.sageResponse, helpful: conv.helpful,
                        translations: {},
                        time: new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                ]);
                setMessages(history);
            } catch (e) { console.error('Failed to load SAGE history:', e); }
        }
        loadHistory();
    }, []);

    // ── Auto-scroll ──────────────────────────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // ── Language change ──────────────────────────────────────────
    const handleLanguageChange = (newLang) => {
        if (newLang === language) return;
        setLanguage(newLang);
        setMessages(prev => prev.map(m => ({ ...m, showTranslation: false })));
    };

    // ── Translate a specific message ─────────────────────────────
    const handleTranslateMessage = async (msgId) => {
        const msgIndex = messages.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return;
        const msg = messages[msgIndex];

        if (msg.showTranslation) {
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, showTranslation: false } : m));
            return;
        }

        if (language === 'ENGLISH') return;

        if (msg.translations?.[language]) {
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, showTranslation: true } : m));
            return;
        }

        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translating: true } : m));

        try {
            const res = await sageAPI.translate({ text: msg.text, targetLanguage: language });
            const translatedText = res.data.data.translatedText;
            setMessages(prev => prev.map(m => m.id === msgId ? {
                ...m, showTranslation: true, translating: false,
                translations: { ...m.translations, [language]: translatedText }
            } : m));
        } catch (err) {
            console.error('Translation failed:', err);
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translating: false } : m));
            const backendMsg = err.response?.data?.message || err.message;
            setTranslationError(backendMsg || 'Translation service is temporarily unavailable.');
        }
    };

    // ── Send message ─────────────────────────────────────────────
    const handleSend = async () => {
        if (!input.trim() || loading || isSending.current) return;
        if (isListening) stopListening();

        isSending.current = true;
        const userMsg = input.trim();
        const wasVoice = lastSentViaVoice;
        setInput('');
        setLastSentViaVoice(false);
        resetTranscript();
        prevFinalRef.current = '';
        inputRef.current?.focus();

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userId = Date.now() + '-u';
        setMessages(prev => [...prev, {
            id: userId, type: 'user', text: userMsg, topic, viaVoice: wasVoice,
            translations: {}, time: now,
        }]);
        setLoading(true);

        try {
            const res = await sageAPI.chat({ message: userMsg, topic, language: 'ENGLISH' });
            const conv = res.data.data.conversation;
            const newMsg = {
                id: conv.id, type: 'sage', text: conv.sageResponse, helpful: conv.helpful,
                translations: {},
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, newMsg]);
            setLatestId(conv.id);
        } catch (e) {
            console.error('SAGE chat error:', e);
            const errId = Date.now() + '-err';
            setMessages(prev => [...prev, {
                id: errId, type: 'sage', text: customerLang === 'HI' ? '⚠️ कुछ गलत हो गया। कृपया पुनः प्रयास करें।' : '⚠️ Something went wrong. Please try again.',
                helpful: null, translations: {},
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }]);
            setLatestId(errId);
        } finally {
            setLoading(false);
            isSending.current = false;
        }
    };

    // ── Feedback ─────────────────────────────────────────────────
    const handleThumbsFeedback = async (msgId, type) => {
        setSelectedFeedback(prev => ({ ...prev, [msgId]: type }));
        if (type === 'down') {
            setFeedbackOpen(msgId);
        } else {
            setFeedbackOpen(null);
            // Send positive feedback to API
            try {
                const realId = msgId.toString().replace('-u', '');
                if (!realId.includes('-err') && !realId.includes('-u')) {
                    await sageAPI.feedback(realId, { helpful: true });
                    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, helpful: true } : m));
                }
            } catch (e) { console.error('Feedback error:', e); }
        }
    };

    const handleFeedbackReason = async (msgId, reason) => {
        setFeedbackOpen(null);
        try {
            const realId = msgId.toString().replace('-u', '');
            if (!realId.includes('-err') && !realId.includes('-u')) {
                await sageAPI.feedback(realId, { helpful: false });
                setMessages(prev => prev.map(m => m.id === msgId ? { ...m, helpful: false } : m));
            }
        } catch (e) { console.error('Feedback error:', e); }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = async () => {
        if (!window.confirm(customerLang === 'HI' ? 'सभी चैट इतिहास साफ़ करें? इसे वापस नहीं लिया जा सकता।' : 'Clear all chat history? This cannot be undone.')) return;
        try {
            await sageAPI.clearHistory();
            setMessages([]);
            setLatestId(null);
        } catch (e) { console.error(e); }
    };

    const langMap = { 'EN': 'ENGLISH', 'हिंदी': 'HINDI' };
    const reverseLangMap = { 'ENGLISH': 'EN', 'HINDI': 'हिंदी' };

    const getQuickstartLabel = (label) => {
        if (customerLang === 'HI') {
            if (label === 'Budgeting') return 'बजट बनाना';
            if (label === 'Saving') return 'बचत करना';
            if (label === 'Investing') return 'निवेश करना';
            if (label === 'Debt') return 'ऋण / कर्ज';
            if (label === 'Learn') return 'सीखें';
        }
        return label;
    };

    const getQuickstartPrompt = (prompt) => {
        if (customerLang === 'HI') {
            if (prompt === 'Help me create a monthly budget') return 'मासिक बजट बनाने में मेरी मदद करें';
            if (prompt === 'How much should I save each month?') return 'मुझे हर महीने कितना बचाना चाहिए?';
            if (prompt === 'Should I start an SIP?') return 'क्या मुझे एसआईपी (SIP) शुरू करनी चाहिए?';
            if (prompt === 'Help me manage my EMIs') return 'मेरी ईएमआई (EMI) प्रबंधित करने में मेरी मदद करें';
            if (prompt === 'Explain compound interest to me') return 'मुझे चक्रवृद्धि ब्याज समझाएं';
        }
        return prompt;
    };

    return (
        <div className="fade-in" style={{ height: 'calc(100vh - 100px)', display: 'flex', gap: 0 }}>
            {/* LEFT PANEL — Conversation History */}
            <div style={{
                width: historyCollapsed ? 60 : 320,
                minWidth: historyCollapsed ? 60 : 320,
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column',
                borderRadius: '16px 0 0 16px',
                transition: 'all 0.3s ease', overflow: 'hidden',
            }}>
                {!historyCollapsed && (
                    <>
                        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifySpace: 'between', justifyContent: 'space-between', marginBottom: 12 }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <MessageSquare size={18} style={{ color: 'var(--accent-blue)' }} />
                                    {t.sageAssistantTitle}
                                </h3>
                                <button onClick={clearChat} className="btn btn-sm" style={{
                                    padding: '6px 10px', fontSize: '0.72rem',
                                    background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                    border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                }}>
                                    {customerLang === 'HI' ? 'साफ़ करें' : 'Clear'}
                                </button>
                            </div>

                            {/* Topic selector */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                                {TOPIC_QUICKSTARTS.map(t => (
                                    <button key={t.topic} onClick={() => setTopic(t.topic)} style={{
                                        flex: '1 1 auto', textAlign: 'center', whiteSpace: 'nowrap',
                                        padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                                        fontSize: '0.75rem', fontWeight: 600, fontFamily: 'inherit',
                                        background: topic === t.topic ? t.color : 'var(--bg-card)',
                                        color: topic === t.topic ? 'white' : 'var(--text-muted)',
                                        transition: 'all 0.2s',
                                    }}>
                                        {getQuickstartLabel(t.label)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick starters when chat is empty */}
                        {messages.length === 0 && (
                            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                                <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 8 }}>
                                    {customerLang === 'HI' ? 'त्वरित शुरुआत' : 'Quick Start'}
                                </div>
                                {TOPIC_QUICKSTARTS.map(t => (
                                    <button key={t.label} onClick={() => { setInput(t.prompt); setTopic(t.topic); inputRef.current?.focus(); }} style={{
                                        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                                        padding: '10px 12px', background: 'none', border: '1px solid var(--border-color)',
                                        borderRadius: 10, cursor: 'pointer', marginBottom: 6,
                                        color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'inherit',
                                        textAlign: 'left', transition: 'all 0.2s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.background = 'var(--bg-card)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'none'; }}
                                    >
                                        <t.icon size={16} style={{ color: t.color, flexShrink: 0 }} />
                                        <span>{getQuickstartPrompt(t.prompt)}</span>
                                    </button>
                                ))}
                            </div>
                        )}


                    </>
                )}
            </div>

            {/* RIGHT PANEL — Active Chat */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: '0 16px 16px 0', border: '1px solid var(--border-color)', borderLeft: 'none' }}>
                {/* Chat Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sparkles size={20} color="white" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>SAGE</h3>
                            <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)' }}>● {t.sageCompanionSubtitle}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Language Toggle */}
                        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 8, padding: 2 }}>
                            {['EN', 'हिंदी'].map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => handleLanguageChange(langMap[lang])}
                                    style={{
                                        padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                                        fontSize: '0.72rem', fontWeight: 600, fontFamily: 'inherit',
                                        background: language === langMap[lang] ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                                        color: language === langMap[lang] ? 'white' : 'var(--text-muted)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                        {/* Actions dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => setShowActions(!showActions)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                                <MoreVertical size={20} />
                            </button>
                            {showActions && (
                                <div style={{
                                    position: 'absolute', right: 0, top: '100%', marginTop: 4, background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)', borderRadius: 10, padding: 6, minWidth: 180, zIndex: 10,
                                    boxShadow: 'var(--shadow-lg)',
                                }}>
                                    {[
                                        { icon: Download, label: customerLang === 'HI' ? 'पीडीएफ सारांश डाउनलोड करें' : 'Download PDF Summary', action: () => { setShowActions(false); window.print(); } },
                                        { icon: Mail, label: customerLang === 'HI' ? 'ईमेल सारांश' : 'Email Summary', action: () => { setShowActions(false); window.alert('Summary sent to your registered email address.'); } },
                                    ].map(action => (
                                        <button key={action.label} onClick={action.action} style={{
                                            display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px',
                                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                                            fontSize: '0.82rem', borderRadius: 6, fontFamily: 'inherit', textAlign: 'left',
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                        >
                                            <action.icon size={15} /> {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                    {messages.length === 0 && !loading ? (
                        /* Empty state */
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 24 }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: 20,
                                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Sparkles size={36} style={{ color: 'var(--accent-blue)' }} />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>{t.sageWelcomeTitle}</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.sageWelcomeDesc}</p>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, maxWidth: 700, width: '100%' }}>
                                {TOPIC_QUICKSTARTS.map(t => (
                                    <button key={t.label} onClick={() => { setInput(t.prompt); setTopic(t.topic); inputRef.current?.focus(); }} style={{
                                        padding: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                        borderRadius: 12, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                                        display: 'flex', flexDirection: 'column', gap: 8,
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}
                                    >
                                        <t.icon size={22} style={{ color: t.color }} />
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{getQuickstartLabel(t.label)}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getQuickstartPrompt(t.prompt)}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(msg =>
                                msg.type === 'user'
                                    ? <UserMessageBubble key={msg.id} msg={msg} customerLang={customerLang} />
                                    : <SageMessageBubble
                                        key={msg.id}
                                        msg={msg}
                                        isLatest={msg.id === latestId}
                                        onFeedback={() => {}}
                                        onTranslate={handleTranslateMessage}
                                        language={language}
                                        selectedFeedback={selectedFeedback}
                                        feedbackOpen={feedbackOpen}
                                        onThumbsFeedback={handleThumbsFeedback}
                                        onFeedbackReason={handleFeedbackReason}
                                        feedbackReasons={FEEDBACK_REASONS}
                                        customerLang={customerLang}
                                        t={t}
                                    />
                            )}

                            {/* Typing indicator */}
                            {loading && (
                                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <div style={{
                                        padding: '14px 18px', borderRadius: 16, borderBottomLeftRadius: 4,
                                        background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)',
                                        display: 'flex', gap: 5, alignItems: 'center',
                                    }}>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} style={{
                                                width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)',
                                                animation: `typingBounce 1.2s infinite ${i * 0.2}s`,
                                                opacity: 0.6,
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Voice Error Toast */}
                {voiceError && (
                    <div style={{
                        position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(239,68,68,0.12)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12,
                        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                        color: '#ef4444', fontSize: '0.82rem', zIndex: 20,
                        animation: 'fadeIn 0.3s ease',
                    }}>
                        <MicOff size={14} />
                        <span>{voiceError}</span>
                        <button onClick={dismissVoiceError} style={{ background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: 6, padding: '2px 6px', cursor: 'pointer', color: '#ef4444' }}>
                            <X size={12} />
                        </button>
                    </div>
                )}

                {/* Translation Error Toast */}
                {translationError && (
                    <div style={{
                        position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(245,158,11,0.12)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12,
                        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                        color: '#f59e0b', fontSize: '0.82rem', zIndex: 20,
                        animation: 'fadeIn 0.3s ease', maxWidth: '80%',
                    }}>
                        <Globe size={14} />
                        <span>{translationError}</span>
                        <button onClick={() => setTranslationError(null)} style={{ background: 'rgba(245,158,11,0.15)', border: 'none', borderRadius: 6, padding: '2px 6px', cursor: 'pointer', color: '#f59e0b' }}>
                            <X size={12} />
                        </button>
                    </div>
                )}

                {/* Interim Voice Overlay */}
                {isListening && interimTranscript && (
                    <div style={{
                        position: 'absolute', bottom: 120, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(59,130,246,0.1)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12,
                        padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8,
                        color: '#60a5fa', fontSize: '0.85rem', zIndex: 20,
                        animation: 'fadeIn 0.3s ease', maxWidth: '70%',
                    }}>
                        <AudioLines size={14} style={{ animation: 'pulse 1.5s infinite' }} />
                        <span style={{ fontStyle: 'italic' }}>{interimTranscript}</span>
                    </div>
                )}

                {/* Voice status bar */}
                {isListening && (
                    <div style={{
                        padding: '8px 20px', borderTop: '1px solid rgba(59,130,246,0.2)',
                        background: 'rgba(59,130,246,0.05)', display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: '0.78rem', color: '#60a5fa',
                    }}>
                        <span style={{
                            width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
                            animation: 'pulse 1.5s infinite', display: 'inline-block',
                        }} />
                        <span>
                            {customerLang === 'HI'
                                ? 'सुन रहा हूँ... स्वाभाविक रूप से बोलें, या पूरा होने पर रोकें टैप करें।'
                                : 'Listening… speak naturally, or tap stop when done.'}
                        </span>
                        <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {customerLang === 'HI' ? '🔒 आपके ब्राउज़र द्वारा संसाधित' : '🔒 Processed by your browser'}
                        </span>
                    </div>
                )}

                {/* Chat Input Area */}
                <div style={{
                    padding: '16px 20px', borderTop: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    {/* Microphone button */}
                    {voiceSupported && (
                        <button
                            onClick={toggleVoice}
                            disabled={loading}
                            style={{
                                width: 42, height: 42, borderRadius: '50%', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                background: isListening ? '#ef4444' : 'var(--bg-secondary)',
                                color: isListening ? 'white' : 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                                animation: isListening ? 'pulse 1.5s infinite' : 'none',
                                opacity: loading ? 0.5 : 1,
                            }}
                            title={isListening ? 'Stop listening' : 'Start voice input'}
                        >
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                    )}

                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? (customerLang === 'HI' ? '🔴 सुन रहा हूँ…' : '🔴 Listening…') : t.sageInputPlaceholder}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '12px 16px', background: 'var(--bg-input)',
                                border: '1px solid var(--border-color)', borderRadius: 24,
                                color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none',
                                fontFamily: 'inherit', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-blue)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        style={{
                            width: 42, height: 42, borderRadius: '50%', border: 'none',
                            cursor: (input.trim() && !loading) ? 'pointer' : 'not-allowed',
                            background: (input.trim() && !loading) ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--bg-secondary)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s', opacity: (input.trim() && !loading) ? 1 : 0.5,
                        }}
                    >
                        <Send size={18} />
                    </button>
                </div>

                {/* Disclaimer */}
                <div style={{ padding: '0 20px 10px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {customerLang === 'HI'
                            ? 'सेज बजट, बचत, ऋण प्रबंधन, निवेश की मूल बातें और वित्तीय साक्षरता पर ध्यान केंद्रित करता है। · हमेशा एक योग्य सलाहकार के साथ महत्वपूर्ण निर्णयों को सत्यापित करें।'
                            : 'SAGE focuses on budgeting, saving, debt management, investing basics, and financial literacy. · Always verify important decisions with a qualified advisor.'}
                    </span>
                </div>
            </div>

            <style>{`
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
                    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
