import { useState, useEffect, useRef, useCallback } from 'react';
import { sageAPI } from '../api';
import { Send, Bot, User, ThumbsUp, ThumbsDown, Trash2, Sparkles, StopCircle, Mic, MicOff, AudioLines, X, Globe } from 'lucide-react';
import useVoiceInput from '../hooks/useVoiceInput';

// ── Typewriter Hook ───────────────────────────────────────────
function useTypewriter(text, speed = 18, enabled = true) {
    const [displayed, setDisplayed] = useState(() => (!enabled || !text ? (text || '') : ''));
    const [done, setDone] = useState(() => (!enabled || !text));
    const indexRef = useRef(0);
    const timerRef = useRef(null);
    const textRef = useRef(text); // always holds latest text — fixes stale closure in skip

    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        if (!enabled || !text) {
            Promise.resolve().then(() => {
                setDisplayed(text || '');
                setDone(true);
            });
            return;
        }
        
        Promise.resolve().then(() => {
            setDisplayed('');
            setDone(false);
        });
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
        setDisplayed(textRef.current); // use ref — never stale
        setDone(true);
    }, []); // no deps needed — ref always has latest value

    return { displayed, done, skip };
}

const STARTERS = [
    "How do I start budgeting my salary?",
    "What's the 50/30/20 rule?",
    "How to build an emergency fund?",
    "Should I invest or pay off debt first?",
];

// ── Single SAGE message bubble with typewriter ────────────────
function SageMessage({ msg, isLatest, onFeedback, onTranslate, language = 'ENGLISH' }) {
    const displayText = msg.showTranslation ? (msg.translations?.[language] || msg.text) : msg.text;
    const { displayed, done, skip } = useTypewriter(displayText, 14, isLatest);

    return (
        <div className="sage-msg-wrapper">
            <div className="sage-avatar-col">
                <div className="sage-avatar">
                    <Sparkles size={16} />
                </div>
            </div>
            <div className="sage-msg-col">
                <span className="sage-sender-label">SAGE</span>
                <div className="sage-msg-text">
                    {displayed}
                    {!done && <span className="cursor-blink">▌</span>}
                </div>
                {!done && isLatest && (
                    <button className="skip-btn" onClick={skip} title="Skip animation">
                        <StopCircle size={12} /> Skip
                    </button>
                )}
                {done && msg.id && !msg.id.toString().includes('-err') && (
                    <div className="feedback-row">
                        {msg.helpful === null && (
                            <>
                                <button className="feedback-btn" onClick={() => onFeedback(msg.id, true)} title="Helpful">
                                    <ThumbsUp size={13} /> Helpful
                                </button>
                                <button className="feedback-btn" onClick={() => onFeedback(msg.id, false)} title="Not helpful">
                                    <ThumbsDown size={13} />
                                </button>
                            </>
                        )}
                        {msg.helpful === true && (
                            <span className="feedback-done">✅ Marked helpful</span>
                        )}

                        {/* Inline Translate action */}
                        {language !== 'ENGLISH' && (
                            <button
                                className={`feedback-btn translate-btn ${msg.translating ? 'loading' : ''}`}
                                onClick={() => onTranslate(msg.id)}
                                title="Translate this message"
                                disabled={msg.translating}
                            >
                                <Globe size={13} />
                                {msg.translating ? (
                                    <span>Translating...</span>
                                ) : msg.showTranslation ? (
                                    <span>Show Original</span>
                                ) : (
                                    <span>Translate to {language === 'HINDI' ? 'हिन्दी' : 'English'}</span>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── User message bubble ───────────────────────────────────────
function UserMessage({ msg }) {
    return (
        <div className="user-msg-wrapper">
            <div className="user-msg-col">
                <span className="user-sender-label">You</span>
                <div className="user-msg-text">
                    {msg.text}
                    {msg.viaVoice && (
                        <span className="voice-badge" title="Sent via voice">
                            <Mic size={10} />
                        </span>
                    )}
                </div>
            </div>
            <div className="user-avatar-col">
                <div className="user-avatar-icon">
                    <User size={16} />
                </div>
            </div>
        </div>
    );
}

// ── Typing indicator ─────────────────────────────────────────
function TypingIndicator() {
    return (
        <div className="sage-msg-wrapper">
            <div className="sage-avatar-col">
                <div className="sage-avatar">
                    <Sparkles size={16} />
                </div>
            </div>
            <div className="sage-msg-col">
                <span className="sage-sender-label">SAGE</span>
                <div className="typing-dots">
                    <span /><span /><span />
                </div>
            </div>
        </div>
    );
}

// ── Voice Error Toast ─────────────────────────────────────────
function VoiceErrorToast({ message, onDismiss }) {
    if (!message) return null;
    return (
        <div className="voice-error-toast">
            <MicOff size={14} />
            <span>{message}</span>
            <button className="voice-toast-close" onClick={onDismiss} aria-label="Dismiss">
                <X size={12} />
            </button>
        </div>
    );
}

// ── Translation Error Toast ───────────────────────────────────
function TranslationErrorToast({ message, onDismiss }) {
    if (!message) return null;
    return (
        <div className="voice-error-toast" style={{ borderColor: 'rgba(239, 68, 68, 0.25)', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <Globe size={14} style={{ color: '#ef4444' }} />
            <span>{message}</span>
            <button className="voice-toast-close" onClick={onDismiss} aria-label="Dismiss" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                <X size={12} />
            </button>
        </div>
    );
}

// ── Main SagePage ─────────────────────────────────────────────
export default function SagePage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [topic, setTopic] = useState('GENERAL');
    const [loading, setLoading] = useState(false);
    const [latestId, setLatestId] = useState(null);
    const [lastSentViaVoice, setLastSentViaVoice] = useState(false);
    const [language, setLanguage] = useState('ENGLISH');
    const [translationError, setTranslationError] = useState(null);
    
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);
    const prevFinalRef = useRef('');

    // Auto-dismiss translation errors after 5 seconds
    useEffect(() => {
        if (translationError) {
            const timer = setTimeout(() => {
                setTranslationError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [translationError]);

    // ── Voice Input Hook (Permanently in English) ─────────────────────
    const {
        isSupported: voiceSupported,
        isListening,
        interimTranscript,
        finalTranscript,
        error: voiceError,
        startListening,
        stopListening,
        resetTranscript,
        dismissError,
    } = useVoiceInput({ lang: 'en-US', silenceTimeout: 4000 });

    // ── Sync final transcript → input field ──────────────────
    useEffect(() => {
        if (finalTranscript && finalTranscript !== prevFinalRef.current) {
            setInput(finalTranscript);
            setLastSentViaVoice(true);
            prevFinalRef.current = finalTranscript;
        }
    }, [finalTranscript]);

    // ── When user types manually, clear voice flag ───────────
    const handleInputChange = (e) => {
        setInput(e.target.value);
        if (!isListening) {
            setLastSentViaVoice(false);
        }
    };

    // ── Toggle microphone ────────────────────────────────────
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

    useEffect(() => {
        async function loadHistory() {
            try {
                const res = await sageAPI.getHistory({ limit: 30 });
                const history = res.data.data.reverse().flatMap((conv) => [
                    { id: conv.id + '-u', type: 'user', text: conv.userMessage, topic: conv.topic, translations: {} },
                    { id: conv.id, type: 'sage', text: conv.sageResponse, helpful: conv.helpful, translations: {} },
                ]);
                setMessages(history);
            } catch (e) { console.error(e); }
        }
        loadHistory();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const handleLanguageChange = (newLang) => {
        if (newLang === language) return;
        setLanguage(newLang);
        
        // Reset showTranslation state on all messages so they don't look awkwardly translated
        // if the target language changed
        setMessages(prev => prev.map(m => ({ ...m, showTranslation: false })));
    };

    const handleTranslateMessage = async (msgId) => {
        const msgIndex = messages.findIndex(m => m.id === msgId);
        if (msgIndex === -1) return;

        const msg = messages[msgIndex];

        // If we are currently showing translation, toggle back to original
        if (msg.showTranslation) {
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, showTranslation: false } : m));
            return;
        }

        const targetLang = language;
        if (targetLang === 'ENGLISH') return;

        // If already translated, just toggle showTranslation
        if (msg.translations?.[targetLang]) {
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, showTranslation: true } : m));
            return;
        }

        // Set translating spinner state for this message bubble
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translating: true } : m));

        try {
            const res = await sageAPI.translate({ text: msg.text, targetLanguage: targetLang });
            const translatedText = res.data.data.translatedText;

            setMessages(prev => prev.map(m => m.id === msgId ? {
                ...m,
                showTranslation: true,
                translating: false,
                translations: {
                    ...m.translations,
                    [targetLang]: translatedText
                }
            } : m));
        } catch (err) {
            console.error('Failed to translate message inline:', err);
            setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translating: false } : m));
            const backendErrorMsg = err.response?.data?.message || err.message;
            setTranslationError(backendErrorMsg || 'Translation service is temporarily unavailable. Please try again.');
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        if (isListening) stopListening();

        const userMsg = input.trim();
        const wasVoice = lastSentViaVoice;
        setInput('');
        setLastSentViaVoice(false);
        resetTranscript();
        prevFinalRef.current = '';
        inputRef.current?.focus();

        const userId = Date.now() + '-u';
        setMessages((prev) => [...prev, { id: userId, type: 'user', text: userMsg, topic, viaVoice: wasVoice, translations: {} }]);
        setLoading(true);

        try {
            // SAGE Chat always generates the base response in English
            const res = await sageAPI.chat({ message: userMsg, topic, language: 'ENGLISH' });
            const conv = res.data.data.conversation;
            const newMsg = { id: conv.id, type: 'sage', text: conv.sageResponse, helpful: conv.helpful, translations: {} };
            setMessages((prev) => [...prev, newMsg]);
            setLatestId(conv.id);
        } catch (e) {
            console.error('SAGE chat error:', e);
            const errId = Date.now() + '-err';
            const errorText = '⚠️ Something went wrong. Please try again.';
            setMessages((prev) => [...prev, { id: errId, type: 'sage', text: errorText, helpful: null, translations: {} }]);
            setLatestId(errId);
        } finally {
            setLoading(false);
        }
    };

    const rateFeedback = async (convId, helpful) => {
        try {
            await sageAPI.feedback(convId, { helpful });
            setMessages((prev) => prev.map((m) => m.id === convId ? { ...m, helpful } : m));
        } catch (e) { console.error(e); }
    };

    const clearChat = async () => {
        if (!window.confirm('Clear all chat history? This cannot be undone.')) return;
        try {
            await sageAPI.clearHistory();
            setMessages([]);
            setLatestId(null);
        } catch (e) { console.error(e); }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(e);
        }
    };

    const topics = [
        { key: 'GENERAL', label: '✨ General' },
        { key: 'BUDGETING', label: '📊 Budgeting' },
        { key: 'SAVING', label: '💰 Saving' },
        { key: 'DEBT', label: '💳 Debt' },
        { key: 'INVESTING', label: '📈 Investing' },
    ];

    return (
        <div className="sage-page fade-in">
            {/* Header */}
            <div className="sage-header">
                <div className="sage-header-left">
                    <div className="sage-logo-icon"><Sparkles size={22} /></div>
                    <div>
                        <h2>SAGE</h2>
                        <p>Your AI Financial Companion · Powered by AWS Bedrock</p>
                    </div>
                </div>
                <div className="sage-header-actions">
                    <div className="lang-selector-wrapper">
                        <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="lang-select"
                            disabled={loading}
                            title="Select translation language"
                        >
                            <option value="ENGLISH">🇬🇧 English</option>
                            <option value="HINDI">🇮🇳 हिन्दी (Hindi)</option>
                        </select>
                    </div>
                    {messages.length > 0 && (
                        <button className="btn btn-sm btn-secondary clear-btn" onClick={clearChat}>
                            <Trash2 size={14} /> Clear Chat
                        </button>
                    )}
                </div>
            </div>

            {/* Topic Pills */}
            <div className="sage-topic-bar">
                {topics.map((t) => (
                    <button
                        key={t.key}
                        className={`topic-pill ${topic === t.key ? 'active' : ''}`}
                        onClick={() => setTopic(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Chat Window */}
            <div className="sage-chat-window">
                <div className="sage-messages-area" style={{ position: 'relative' }}>
                    
                    {messages.length === 0 && !loading && (
                        <div className="sage-empty">
                            <div className="sage-empty-icon"><Sparkles size={40} /></div>
                            <h3>How can I help you today?</h3>
                            <p>Ask me anything about your finances — budgeting, saving, debt, or investing.</p>
                            <div className="starter-grid">
                                {STARTERS.map((s) => (
                                    <button
                                        key={s}
                                        className="starter-card"
                                        onClick={() => { setInput(s); inputRef.current?.focus(); }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) =>
                        msg.type === 'user'
                            ? <UserMessage key={msg.id} msg={msg} />
                            : <SageMessage
                                key={msg.id}
                                msg={msg}
                                isLatest={msg.id === latestId}
                                onFeedback={rateFeedback}
                                onTranslate={handleTranslateMessage}
                                language={language}
                            />
                    )}

                    {loading && <TypingIndicator />}
                    <div ref={chatEndRef} />
                </div>

                {/* Voice Error Toast */}
                <VoiceErrorToast message={voiceError} onDismiss={dismissError} />

                {/* Translation Error Toast */}
                <TranslationErrorToast message={translationError} onDismiss={() => setTranslationError(null)} />

                {/* Interim Transcript Overlay */}
                {isListening && interimTranscript && (
                    <div className="voice-interim-overlay">
                        <AudioLines size={14} className="voice-interim-icon" />
                        <span className="voice-interim-text">{interimTranscript}</span>
                    </div>
                )}

                {/* Input Area */}
                <div className="sage-input-wrapper">
                    {/* Voice Status Bar */}
                    {isListening && (
                        <div className="voice-status-bar">
                            <span className="voice-status-dot" />
                            <span>Listening… speak naturally, or tap stop when done.</span>
                            <span className="voice-privacy-note">🔒 Processed by your browser</span>
                        </div>
                    )}

                    <form className="sage-input-form" onSubmit={sendMessage}>
                        <textarea
                            ref={inputRef}
                            className="sage-textarea"
                            placeholder={isListening ? 'Listening…' : 'Message SAGE…'}
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            rows={1}
                        />

                        {/* Microphone Button */}
                        {voiceSupported && (
                            <button
                                type="button"
                                className={`voice-mic-btn ${isListening ? 'listening' : ''} ${loading ? 'disabled' : ''}`}
                                onClick={toggleVoice}
                                disabled={loading}
                                title={isListening ? 'Stop listening' : 'Start voice input'}
                                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>
                        )}

                        <button
                            type="submit"
                            className={`sage-send-btn ${(!input.trim() || loading) ? 'disabled' : ''}`}
                            disabled={!input.trim() || loading}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <p className="sage-disclaimer">SAGE may make mistakes. Consult a certified financial advisor for major decisions.</p>
                </div>
            </div>
        </div>
    );
}


