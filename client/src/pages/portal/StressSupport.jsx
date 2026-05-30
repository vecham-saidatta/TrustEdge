import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PORTAL_TRANSLATIONS } from '../../translations';
import {
    Heart, MessageSquare, Phone, ChevronRight, AlertTriangle, Calendar, ArrowRight,
    Clock, Shield, X, ChevronDown, ChevronUp, HelpCircle, Calculator
} from 'lucide-react';
import './customer-portal.css';

function formatINR(num) {
    if (!num && num !== 0) return '₹0';
    const str = Math.abs(num).toString();
    let res = '';
    const len = str.length;
    if (len <= 3) res = str;
    else { res = str.substring(len - 3); let rem = str.substring(0, len - 3); while (rem.length > 2) { res = rem.substring(rem.length - 2) + ',' + res; rem = rem.substring(0, rem.length - 2); } if (rem.length > 0) res = rem + ',' + res; }
    return (num < 0 ? '-₹' : '₹') + res;
}

const EMI_STAGES = [
    {
        id: 'early', label: 'Early Warning — 30 days before EMI',
        message: 'Your savings pattern suggests your upcoming Home Loan EMI of ₹16,200 might be tight this month.',
        severity: 'yellow',
        options: [
            { label: 'Move EMI date', desc: 'Request to shift your EMI debit date to after salary credit', icon: Calendar },
            { label: 'Explore EMI reduction', desc: 'See options to reduce your monthly payment temporarily', icon: Calculator },
            { label: 'Temporary EMI pause', desc: 'Request a 1-3 month moratorium', icon: Clock },
            { label: 'Talk to RM', desc: 'Connect with your Relationship Manager for guidance', icon: Phone },
        ]
    },
    {
        id: 'atrisk', label: 'At-Risk — 5 days before EMI',
        message: 'Your savings balance is ₹8,400 but your Home Loan EMI of ₹16,200 is due on June 5. You have a shortfall of ₹7,800.',
        severity: 'red',
        options: [
            { label: 'Transfer from another account', desc: 'Move ₹7,800 from Salary Account (Balance: ₹1,12,450)', icon: ArrowRight },
            { label: 'Request EMI postponement', desc: 'Shift by 5 business days (one-time)', icon: Calendar },
            { label: 'Talk to SAGE', desc: 'Explore all available options with your AI assistant', icon: MessageSquare },
        ]
    },
    {
        id: 'missed', label: 'Post-Missed EMI',
        message: 'Your Home Loan EMI was missed on June 5. This happens — let\'s look at your options to get back on track.',
        severity: 'red',
        options: [
            { label: 'Pay now', desc: 'Make the overdue payment immediately to avoid late charges', icon: ArrowRight },
            { label: 'Talk to RM', desc: 'Discuss restructuring or catch-up plan with your RM', icon: Phone },
            { label: 'Explore restructuring', desc: 'See loan restructuring options to reduce monthly burden', icon: Calculator },
        ]
    }
];

const RESTRUCTURING_OPTIONS = [
    { label: 'Tenure Extension', desc: 'Extend loan term by 2 years', currentEMI: 16200, newEMI: 13800, extraInterest: 184000, impact: 'Lower EMI, but you pay more total interest' },
    { label: '6-Month Moratorium', desc: 'Pause EMI for 6 months', currentEMI: 16200, newEMI: 0, extraInterest: 94200, impact: 'EMI = ₹0 for 6 months, but interest accrues and is added to principal' },
    { label: 'Rate Negotiation', desc: 'Request a lower interest rate', currentEMI: 16200, newEMI: 15400, extraInterest: 0, impact: 'Bank may reduce rate if you have a good payment history' },
    { label: 'Partial Prepayment', desc: 'Pay ₹50,000 lump sum to reduce outstanding', currentEMI: 16200, newEMI: 15800, extraInterest: -48000, impact: 'Reduces both outstanding principal and total interest payable' },
];

const CHALLENGES = [
    { id: 'income', label: 'Income reduced', icon: '📉' },
    { id: 'expense', label: 'Unexpected expense', icon: '💸' },
    { id: 'job', label: 'Job change / gap', icon: '💼' },
    { id: 'medical', label: 'Medical emergency', icon: '🏥' },
    { id: 'other', label: 'Other', icon: '📋' },
];

export default function StressSupport() {
    const navigate = useNavigate();
    const { customerLang } = useOutletContext();
    const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

    const [dismissed, setDismissed] = useState(false);
    const [selectedStage, setSelectedStage] = useState('early');
    const [showRestructuring, setShowRestructuring] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [requestSubmitted, setRequestSubmitted] = useState(false);

    const currentStage = EMI_STAGES.find(s => s.id === selectedStage);

    /* ─── Translation Helpers ────────────────────────────── */
    const getStageLabel = (id, defaultLabel) => {
        if (id === 'early') return t.warningEmiTitle;
        if (id === 'atrisk') return t.atRiskEmiTitle;
        if (id === 'missed') return t.postMissedEmiTitle;
        return defaultLabel;
    };

    const getStageMessage = (id, defaultMessage) => {
        if (id === 'early') return t.warningEmiDesc;
        if (id === 'atrisk') return `${t.atRiskEmiDesc} ₹16,200`;
        if (id === 'missed') return t.postMissedEmiDesc;
        return defaultMessage;
    };

    const getOptionLabel = (label) => {
        if (label === 'Move EMI date') return t.moveEmiDate;
        if (label === 'Explore EMI reduction') return t.exploreEmiReduction;
        if (label === 'Temporary EMI pause') return t.temporaryPauseEmi;
        if (label === 'Talk to RM') return t.requestCallRM;
        if (label === 'Transfer from another account') return t.transferFromSavings;
        if (label === 'Talk to SAGE') return t.askSage;
        if (customerLang === 'HI') {
            if (label === 'Request EMI postponement') return 'ईएमआई स्थगन का अनुरोध';
            if (label === 'Pay now') return 'अभी भुगतान करें';
            if (label === 'Explore restructuring') return 'ऋण पुनर्गठन विकल्प';
        }
        return label;
    };

    const getOptionDesc = (label, desc) => {
        if (customerLang === 'HI') {
            if (label === 'Move EMI date') return 'वेतन जमा होने के बाद अपनी ईएमआई डेबिट तिथि को स्थानांतरित करने का अनुरोध करें';
            if (label === 'Explore EMI reduction') return 'अस्थायी रूप से अपने मासिक भुगतान को कम करने के विकल्प देखें';
            if (label === 'Temporary EMI pause') return '1-3 महीने की मोहलत (moratorium) का अनुरोध करें';
            if (label === 'Talk to RM') return 'मार्गदर्शन के लिए अपने संबंध प्रबंधक से जुड़ें';
            if (label === 'Transfer from another account') return 'वेतन खाते से ₹7,800 स्थानांतरित करें (शेष राशि: ₹1,12,450)';
            if (label === 'Request EMI postponement') return '5 कार्य दिवसों द्वारा स्थानांतरित करें (एक बार)';
            if (label === 'Talk to SAGE') return 'अपने एआई सहायक के साथ सभी उपलब्ध विकल्पों का पता लगाएं';
            if (label === 'Pay now') return 'विलंब शुल्क से बचने के लिए तुरंत अतिदेय भुगतान करें';
            if (label === 'Explore restructuring') return 'मासिक बोझ को कम करने के लिए ऋण पुनर्गठन विकल्प देखें';
        }
        return desc;
    };

    const getChallengeLabel = (id, defaultLabel) => {
        if (id === 'income') return t.restructureIncomeReduced;
        if (id === 'expense') return t.restructureUnexpectedExpense;
        if (id === 'other') return t.restructureOther;
        if (customerLang === 'HI') {
            if (id === 'job') return 'नौकरी में बदलाव / अंतराल';
            if (id === 'medical') return 'चिकित्सा आपातकाल';
        }
        return defaultLabel;
    };

    const getRestructureOptionLabel = (label) => {
        if (customerLang === 'HI') {
            if (label === 'Tenure Extension') return 'अवधि विस्तार';
            if (label === '6-Month Moratorium') return '6-महीने की मोहलत (Moratorium)';
            if (label === 'Rate Negotiation') return 'दर पर बातचीत';
            if (label === 'Partial Prepayment') return 'आंशिक पूर्व-भुगतान';
        }
        return label;
    };

    const getRestructureOptionDesc = (label, desc) => {
        if (customerLang === 'HI') {
            if (label === 'Tenure Extension') return 'ऋण की अवधि को 2 वर्ष बढ़ाएं';
            if (label === '6-Month Moratorium') return '6 महीने के लिए ईएमआई रोकें';
            if (label === 'Rate Negotiation') return 'कम ब्याज दर का अनुरोध करें';
            if (label === 'Partial Prepayment') return 'बकाया कम करने के लिए ₹50,000 एकमुश्त भुगतान करें';
        }
        return desc;
    };

    const getImpactText = (label, impact) => {
        if (label === '6-Month Moratorium') {
            return `${t.moratoriumInterestMath} ₹94,200`;
        }
        if (customerLang === 'HI') {
            if (label === 'Tenure Extension') return 'कम ईएमआई, लेकिन आप अधिक कुल ब्याज का भुगतान करते हैं';
            if (label === 'Rate Negotiation') return 'यदि आपका भुगतान इतिहास अच्छा है तो बैंक दर कम कर सकता है';
            if (label === 'Partial Prepayment') return 'बकाया मूलधन और देय कुल ब्याज दोनों को कम करता है';
        }
        return impact;
    };

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>{t.stressTitle} 💙</h2>
                <p>{t.stressSubtitle}</p>
            </div>

            {/* Stress Support Card */}
            {!dismissed && (
                <div style={{
                    padding: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.05))',
                    borderRadius: 16, border: '1px solid rgba(59,130,246,0.15)', marginBottom: 24, position: 'relative',
                }}>
                    <button onClick={() => setDismissed(true)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                        <X size={18} />
                    </button>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Heart size={24} style={{ color: 'var(--accent-blue)' }} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>💙 {t.empatheticHeader}</h3>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                                {t.empatheticBody}
                            </p>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                <button onClick={() => navigate('/portal/sage')} className="btn btn-primary btn-sm"><MessageSquare size={14} /> {t.askSage}</button>
                                <button className="btn btn-secondary btn-sm"><Phone size={14} /> {t.requestCallRM}</button>
                                <button onClick={() => setShowRestructuring(true)} className="btn btn-secondary btn-sm"><HelpCircle size={14} /> {customerLang === 'HI' ? 'सहायता विकल्प देखें' : 'See support options'}</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 12, fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                        {customerLang === 'HI' ? 'यह कार्ड प्रति सप्ताह अधिकतम एक बार दिखाई देता है · ' : 'This card appears at most once per week · '}
                        <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', fontSize: '0.68rem', fontFamily: 'inherit' }}>
                            {customerLang === 'HI' ? 'स्थायी रूप से हटा दें' : 'Dismiss permanently'}
                        </button>
                    </div>
                </div>
            )}

            {/* EMI Distress Support Flow */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>📋 {t.emiDistressTitle}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    {customerLang === 'HI'
                        ? 'हमारी बहु-स्तरीय सहायता प्रणाली संभावित ईएमआई कठिनाइयों से पहले, दौरान और बाद में पता लगाती है और सहायता करती है।'
                        : 'Our multi-stage support system detects and assists before, during, and after potential EMI difficulties.'}
                </p>

                {/* Stage Selector */}
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: 4, borderRadius: 10, marginBottom: 20 }}>
                    {EMI_STAGES.map(stage => (
                        <button key={stage.id} onClick={() => setSelectedStage(stage.id)} style={{
                            flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            background: selectedStage === stage.id ? (stage.severity === 'red' ? 'var(--accent-red-soft)' : 'var(--accent-yellow-soft)') : 'transparent',
                            color: selectedStage === stage.id ? (stage.severity === 'red' ? 'var(--accent-red)' : 'var(--accent-yellow)') : 'var(--text-muted)',
                            fontWeight: selectedStage === stage.id ? 600 : 500, fontSize: '0.78rem', fontFamily: 'inherit', transition: 'all 0.2s',
                        }}>{getStageLabel(stage.id, stage.label)}</button>
                    ))}
                </div>

                {/* Stage Content */}
                <div style={{
                    padding: '16px 20px', borderRadius: 12,
                    background: currentStage.severity === 'red' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                    borderLeft: `4px solid ${currentStage.severity === 'red' ? 'var(--accent-red)' : 'var(--accent-yellow)'}`,
                    marginBottom: 16,
                }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                        {getStageMessage(currentStage.id, currentStage.message)}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    {currentStage.options.map(opt => (
                        <div key={opt.label} className="card" style={{ padding: 16, cursor: 'pointer', borderTop: '2px solid var(--accent-blue)' }}
                            onClick={() => { if (opt.label.includes('restructuring') || opt.label.includes('Explore')) setShowRestructuring(true); }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <opt.icon size={20} style={{ color: 'var(--accent-blue)', marginBottom: 8 }} />
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 4 }}>{getOptionLabel(opt.label)}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{getOptionDesc(opt.label, opt.desc)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Loan Restructuring Flow */}
            {showRestructuring && !requestSubmitted && (
                <div className="card" style={{ borderTop: '3px solid var(--accent-purple)' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>🔧 {t.restructureRequestTitle}</h3>

                    {/* Step 1: Challenge */}
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
                            {customerLang === 'HI' ? 'चरण 1: क्या समस्या है?' : "Step 1: What's the challenge?"}
                        </h4>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {CHALLENGES.map(ch => (
                                <button key={ch.id} onClick={() => setSelectedChallenge(ch.id)} style={{
                                    padding: '10px 16px', borderRadius: 10, border: '1px solid',
                                    borderColor: selectedChallenge === ch.id ? 'var(--accent-purple)' : 'var(--border-color)',
                                    background: selectedChallenge === ch.id ? 'var(--accent-purple-soft)' : 'transparent',
                                    color: selectedChallenge === ch.id ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                    cursor: 'pointer', fontWeight: 500, fontSize: '0.82rem', fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}>{ch.icon} {getChallengeLabel(ch.id, ch.label)}</button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Options */}
                    {selectedChallenge && (
                        <div style={{ marginBottom: 20 }}>
                            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 10, color: 'var(--text-secondary)' }}>
                                {customerLang === 'HI' ? 'चरण 2: उपलब्ध विकल्प' : 'Step 2: Available options'}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {RESTRUCTURING_OPTIONS.map(opt => (
                                    <div key={opt.label} style={{
                                        padding: '16px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-color)',
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <div>
                                                <div style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 2 }}>
                                                    {getRestructureOptionLabel(opt.label)}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                    {getRestructureOptionDesc(opt.label, opt.desc)}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 8 }}>
                                            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 8 }}>
                                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                                    {customerLang === 'HI' ? 'वर्तमान ईएमआई' : 'Current EMI'}
                                                </div>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{formatINR(opt.currentEMI)}</div>
                                            </div>
                                            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 8 }}>
                                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                                    {customerLang === 'HI' ? 'नई ईएमआई' : 'New EMI'}
                                                </div>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-green)' }}>{formatINR(opt.newEMI)}</div>
                                            </div>
                                            <div style={{ background: 'var(--bg-card)', padding: '8px 12px', borderRadius: 8 }}>
                                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                                    {customerLang === 'HI' ? 'अतिरिक्त ब्याज' : 'Extra Interest'}
                                                </div>
                                                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: opt.extraInterest > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                                                    {opt.extraInterest > 0 ? '+' : ''}{formatINR(opt.extraInterest)}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <AlertTriangle size={12} /> {getImpactText(opt.label, opt.impact)}
                                        </div>
                                        <button onClick={() => setRequestSubmitted(true)} className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
                                            {customerLang === 'HI' ? 'इस विकल्प को चुनें' : 'Select this option'} <ArrowRight size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Submitted Confirmation */}
            {requestSubmitted && (
                <div className="card" style={{ textAlign: 'center', padding: 40, borderTop: '3px solid var(--accent-green)' }}>
                    <Shield size={48} style={{ color: 'var(--accent-green)', marginBottom: 16 }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                        {customerLang === 'HI' ? 'अनुरोध सबमिट किया गया ✅' : 'Request Submitted ✅'}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                        {customerLang === 'HI'
                            ? `आपका पुनर्गठन अनुरोध आपके संबंध प्रबंधक को सबमिट कर दिया गया है (${selectedChallenge === 'medical' ? 'प्राथमिकता संचालन' : 'सामान्य प्रसंस्करण'}).`
                            : `Your restructuring request has been submitted to your Relationship Manager (${selectedChallenge === 'medical' ? 'Priority handling' : 'Standard processing'}).`}
                    </p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {customerLang === 'HI'
                            ? 'अपेक्षित प्रतिक्रिया: 2-3 कार्य दिवस। आपको एसएमएस और इन-ऐप के माध्यम से सूचित किया जाएगा।'
                            : "Expected response: 2-3 business days. You'll be notified via SMS and In-App."}
                    </p>
                </div>
            )}
        </div>
    );
}
