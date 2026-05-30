import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PORTAL_TRANSLATIONS } from '../../translations';
import {
  Settings, User, Bell, Shield, Eye, DollarSign, Globe, Monitor, Smartphone,
  Mail, MessageCircle, Lock, Fingerprint, Key, CreditCard, AlertTriangle,
  Download, Trash2, ChevronDown, ChevronUp, Clock, ExternalLink, CheckCircle2,
  Info, X, Volume2, VolumeX, Ban, MessageSquare, FileText, Edit3, Phone,
  MapPin, Building2, Award, ToggleLeft, ToggleRight, Wifi, WifiOff, Search,
  IndianRupee, LogOut, History, Sliders, Languages, BellRing, BellOff,
  ShieldCheck, ShieldAlert, Database, Bot, UserCheck, CircleDot, Hash
} from 'lucide-react';
import './customer-portal.css';

/* ─── Indian Rupee Formatter ─────────────────────────────── */
function formatINR(n) {
  const abs = Math.abs(n);
  const s = abs.toString();
  let formatted;
  if (s.length <= 3) { formatted = s; }
  else {
    const last3 = s.slice(-3);
    const remaining = s.slice(0, -3);
    const groups = [];
    for (let i = remaining.length; i > 0; i -= 2) {
      groups.unshift(remaining.slice(Math.max(0, i - 2), i));
    }
    formatted = groups.join(',') + ',' + last3;
  }
  return (n < 0 ? '-' : '') + '₹' + formatted;
}

/* ─── Inline Toggle Component ────────────────────────────── */
function Toggle({ enabled, onChange, disabled = false }) {
  return (
    <button onClick={onChange} disabled={disabled} className="cp-toggle-btn" style={{
      width: 46, height: 24, borderRadius: 12, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? 'var(--border-strong)' : enabled ? 'linear-gradient(135deg, #10b981, #34d399)' : 'var(--border-strong)',
      position: 'relative', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', opacity: disabled ? 0.5 : 1,
      boxShadow: enabled && !disabled ? '0 0 12px rgba(16,185,129,0.3)' : 'none',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3,
        left: enabled ? 25 : 3, transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ─── Channel Chip Component ─────────────────────────────── */
function ChannelChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} className="cp-channel-chip" style={{
      padding: '5px 12px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 600,
      border: '1px solid', cursor: 'pointer', fontFamily: 'inherit',
      background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
      borderColor: active ? 'var(--accent-blue)' : 'var(--border-color)',
      color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
      transition: 'all 0.2s ease',
    }}>{label}</button>
  );
}

/* ─── Constants ──────────────────────────────────────────── */
const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'comms', label: 'Communication', icon: Bell },
  { id: 'privacy', label: 'Privacy & Data', icon: Eye },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'fees', label: 'Fees & Charges', icon: IndianRupee },
];

const LOGIN_HISTORY = [
  { device: 'Chrome 125 / Windows 11', location: 'Mumbai, MH', browser: 'Chrome', time: 'Today, 11:24 AM', ip: '103.21.xx.xx', current: true },
  { device: 'Chrome 125 / Android 14', location: 'Mumbai, MH', browser: 'Chrome Mobile', time: 'Yesterday, 8:15 PM', ip: '49.36.xx.xx', current: false },
  { device: 'Safari 17 / iPhone 15', location: 'Mumbai, MH', browser: 'Safari', time: 'May 28, 3:42 PM', ip: '103.21.xx.xx', current: false },
  { device: 'Chrome 124 / Windows 11', location: 'Mumbai, MH', browser: 'Chrome', time: 'May 27, 10:00 AM', ip: '103.21.xx.xx', current: false },
  { device: 'Chrome 124 / Android 14', location: 'Pune, MH', browser: 'Chrome Mobile', time: 'May 24, 6:30 PM', ip: '157.49.xx.xx', current: false },
  { device: 'Firefox 126 / macOS', location: 'Bengaluru, KA', browser: 'Firefox', time: 'May 22, 2:12 PM', ip: '106.51.xx.xx', current: false },
  { device: 'Edge 124 / Windows 11', location: 'Mumbai, MH', browser: 'Edge', time: 'May 20, 9:45 AM', ip: '103.21.xx.xx', current: false },
  { device: 'Chrome 124 / Android 14', location: 'Hyderabad, TS', browser: 'Chrome Mobile', time: 'May 18, 7:30 PM', ip: '183.83.xx.xx', current: false },
  { device: 'Safari 17 / iPhone 15', location: 'Mumbai, MH', browser: 'Safari', time: 'May 16, 11:05 AM', ip: '103.21.xx.xx', current: false },
  { device: 'Chrome 124 / Windows 11', location: 'Mumbai, MH', browser: 'Chrome', time: 'May 14, 8:22 AM', ip: '103.21.xx.xx', current: false },
];

const FEE_TABLE = [
  { category: 'Savings Account', icon: '🏦', fees: [
    { name: 'Minimum Balance Charge', value: '₹500/quarter (if avg. balance below ₹10,000)', free: false },
    { name: 'ATM Withdrawal — Own Bank', value: 'Free (up to 5/month)', free: true },
    { name: 'ATM Withdrawal — Other Bank', value: '₹20/txn after 3 free/month', free: false },
    { name: 'NEFT / RTGS Transfer', value: 'Free ✅', free: true },
    { name: 'IMPS Transfer', value: 'Free ✅', free: true },
    { name: 'Debit Card Annual Fee', value: '₹199/year (Classic), ₹499/year (Platinum)', free: false },
  ]},
  { category: 'Fixed Deposit', icon: '🔒', fees: [
    { name: 'Premature Withdrawal Penalty', value: '1% of applicable interest rate', free: false },
    { name: 'FD Opening / Closing', value: 'Free ✅', free: true },
    { name: 'FD Certificate Reissue', value: '₹50 per certificate', free: false },
  ]},
  { category: 'Loans', icon: '📋', fees: [
    { name: 'Processing Fee (Home Loan)', value: '0.5% of loan amount (max ₹10,000)', free: false },
    { name: 'Processing Fee (Personal Loan)', value: '₹999 flat', free: false },
    { name: 'Part-Prepayment Charges', value: 'Nil after 6 months ✅', free: true },
    { name: 'Full Prepayment (Floating Rate)', value: 'Nil ✅ (as per RBI guidelines)', free: true },
    { name: 'Full Prepayment (Fixed Rate)', value: '2% of outstanding principal', free: false },
    { name: 'Late EMI Payment Penalty', value: '2% p.a. on overdue amount', free: false },
    { name: 'Loan Foreclosure Statement', value: 'Free ✅', free: true },
  ]},
];

/* ─── Main Component ─────────────────────────────────────── */
export default function SettingsPage() {
  const navigate = useNavigate();
  const { customerLang } = useOutletContext();
  const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    email: 'priya.sharma@gmail.com',
    phone: '+91 98765 43210',
    address: '14-B, Patel Nagar, Andheri West, Mumbai - 400058',
  });

  // Communication prefs
  const [commPrefs, setCommPrefs] = useState({
    balanceThreshold: { enabled: true, amount: 5000, channels: { SMS: true, WhatsApp: true, Email: false, 'In-App': true } },
    fdMaturity: { enabled: true, channels: { SMS: true, WhatsApp: true, Email: true, 'In-App': true } },
    sipConfirm: { enabled: true, channels: { SMS: false, WhatsApp: false, Email: true, 'In-App': true } },
    sageNudges: { enabled: true, channels: { SMS: false, WhatsApp: false, Email: false, 'In-App': true, Off: false } },
  });
  const [offerPref, setOfferPref] = useState('max2');
  const [offerChannel, setOfferChannel] = useState('In-App');
  const [offerLanguage, setOfferLanguage] = useState('EN');
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietStart, setQuietStart] = useState('21:00');
  const [quietEnd, setQuietEnd] = useState('08:00');

  // DND
  const [pauseMarketing, setPauseMarketing] = useState(false);
  const [permanentOptOut, setPermanentOptOut] = useState(false);
  const [blockSMS, setBlockSMS] = useState(false);
  const [blockWhatsApp, setBlockWhatsApp] = useState(false);
  const [blockEmail, setBlockEmail] = useState(false);

  // Privacy consents
  const [consents, setConsents] = useState({
    personalizedOffers: { enabled: true, lastChanged: '2026-03-15', desc: 'Uses your financial profile to show relevant offers instead of generic ones.', impact: 'If disabled, you\'ll see generic offers that may not be relevant to you.' },
    sageAnalysis: { enabled: true, lastChanged: '2026-01-10', desc: 'Allows SAGE to remember your past conversations for better advice.', impact: 'If disabled, SAGE will not remember previous conversations.' },
    crossProduct: { enabled: false, lastChanged: '2026-04-20', desc: 'Connects data across your accounts, FDs, loans, and SIPs for holistic insights.', impact: 'If disabled, your Net Worth view and financial health score may be less accurate.' },
    accountAggregator: { enabled: false, lastChanged: '2026-02-28', desc: 'Allows regulated sharing of your financial data with other institutions you authorize via Account Aggregator framework.', impact: 'If disabled, you won\'t be able to use Account Aggregator services.' },
  });

  // Security
  const [alertThreshold, setAlertThreshold] = useState('every');
  const [customAlertAmount, setCustomAlertAmount] = useState(5000);
  const [alertUPI, setAlertUPI] = useState(true);
  const [alertInternational, setAlertInternational] = useState(true);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);
  const [showLoginHistory, setShowLoginHistory] = useState(false);

  const toggleConsent = (key) => {
    setConsents(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled, lastChanged: new Date().toISOString().split('T')[0] },
    }));
  };

  const toggleChannel = (prefKey, channel) => {
    setCommPrefs(p => ({
      ...p,
      [prefKey]: { ...p[prefKey], channels: { ...p[prefKey].channels, [channel]: !p[prefKey].channels[channel] } },
    }));
  };

  /* ─── Translation Helpers ────────────────────────────── */
  const getTabLabel = (id, defaultLabel) => {
    switch (id) {
      case 'profile': return t.tabProfile;
      case 'comms': return t.tabCommunications;
      case 'privacy': return t.tabPrivacy;
      case 'security': return t.tabSecurity;
      case 'fees': return t.tabFees;
      default: return defaultLabel;
    }
  };

  const getProfileFieldLabel = (label) => {
    if (label === 'Account Number') return t.maskedAccount;
    if (customerLang === 'HI') {
      switch (label) {
        case 'Full Name': return 'पूरा नाम';
        case 'Email': return 'ईमेल';
        case 'Phone': return 'फ़ोन';
        case 'Branch': return 'शाखा';
        case 'PAN': return 'पैन (PAN)';
        default: return label;
      }
    }
    return label;
  };

  const getNomineeFieldLabel = (label) => {
    if (label === 'Nominee Name') return t.nomineeLabel;
    if (label === 'Relationship') return t.nomineeRelationLabel;
    if (customerLang === 'HI') {
      if (label === 'Date of Birth') return 'जन्म तिथि';
      if (label === 'Share (%)') return 'हिस्सेदारी (%)';
    }
    return label;
  };

  const getNomineeValue = (value) => {
    if (value === 'Spouse' && customerLang === 'HI') return 'पति/पत्नी';
    return value;
  };

  const getCommPrefLabel = (key) => {
    switch (key) {
      case 'balanceThreshold': return t.balanceDropAlerts;
      case 'fdMaturity': return t.fdMaturityAlerts;
      case 'sipConfirm': return t.sipExecutionAlerts;
      case 'sageNudges': return t.sageNudgesAlerts;
      default: return '';
    }
  };

  const getPrivacyUseTitle = (title) => {
    if (customerLang === 'HI') {
      switch (title) {
        case 'Transaction Data': return 'लेन-देन डेटा';
        case 'Product Holdings': return 'उत्पाद होल्डिंग्स';
        case 'App Usage': return 'ऐप उपयोग';
        case 'SAGE Conversations': return 'सेज बातचीत';
        default: return title;
      }
    }
    return title;
  };

  const getPrivacyUseDesc = (desc) => {
    if (customerLang === 'HI') {
      switch (desc) {
        case 'Spending patterns and payment behavior for SAGE suggestions': return 'सेज सुझावों के लिए खर्च करने के पैटर्न और भुगतान व्यवहार';
        case 'Accounts, FDs, loans, SIPs — to personalize your dashboard': return 'खाते, एफडी, ऋण, एसआईपी — आपके डैशबोर्ड को व्यक्तिगत बनाने के लिए';
        case 'Navigation patterns to improve our interface and features': return 'हमारे इंटरफ़ेस और सुविधाओं को बेहतर बनाने के लिए नेविगेशन पैटर्न';
        case 'Cross-session context for better advice (encrypted end-to-end)': return 'बेहतर सलाह के लिए क्रॉस-सत्र संदर्भ (शुरू से अंत तक एन्क्रिप्टेड)';
        default: return desc;
      }
    }
    return desc;
  };

  const getConsentLabel = (key) => {
    switch (key) {
      case 'personalizedOffers': return customerLang === 'HI' ? 'व्यक्तिगत ऑफ़र लक्ष्यीकरण' : 'Personalized offer targeting';
      case 'sageAnalysis': return customerLang === 'HI' ? 'सेज बातचीत विश्लेषण' : 'SAGE conversation analysis';
      case 'crossProduct': return customerLang === 'HI' ? 'क्रॉस-उत्पाद प्रोफ़ाइल निर्माण' : 'Cross-product profile building';
      case 'accountAggregator': return customerLang === 'HI' ? 'बाहरी एपीआई डेटा साझाकरण (खाता एग्रीगेटर)' : 'External API data sharing (Account Aggregator)';
      default: return '';
    }
  };

  const getConsentDesc = (key) => {
    if (customerLang === 'HI') {
      switch (key) {
        case 'personalizedOffers': return 'जेनेरिक ऑफ़र के बजाय प्रासंगिक ऑफ़र दिखाने के लिए आपकी वित्तीय प्रोफ़ाइल का उपयोग करता है।';
        case 'sageAnalysis': return 'बेहतर सलाह के लिए सेज को आपकी पिछली बातचीत को याद रखने की अनुमति देता है।';
        case 'crossProduct': return 'समग्र अंतर्दृष्टि के लिए आपके खातों, एफडी, ऋण और एसआईपी में डेटा को जोड़ता है।';
        case 'accountAggregator': return 'खाता एग्रीगेटर ढांचे के माध्यम से आपके द्वारा अधिकृत अन्य संस्थानों के साथ आपके वित्तीय डेटा को विनियमित साझा करने की अनुमति देता है।';
        default: return '';
      }
    }
    return consents[key].desc;
  };

  const getConsentImpact = (key) => {
    if (customerLang === 'HI') {
      switch (key) {
        case 'personalizedOffers': return 'यदि अक्षम किया गया है, तो आपको सामान्य ऑफ़र दिखाई देंगे जो आपके लिए प्रासंगिक नहीं हो सकते हैं।';
        case 'sageAnalysis': return 'यदि अक्षम किया गया है, तो सेज पिछली बातचीत को याद नहीं रखेगा।';
        case 'crossProduct': return 'यदि अक्षम किया गया है, तो आपकी कुल संपत्ति दृश्य और वित्तीय स्वास्थ्य स्कोर कम सटीक हो सकते हैं।';
        case 'accountAggregator': return 'यदि अक्षम किया गया है, तो आप खाता एग्रीगेटर सेवाओं का उपयोग नहीं कर पाएंगे।';
        default: return '';
      }
    }
    return consents[key].impact;
  };

  const getSecuritySettingLabel = (label) => {
    if (customerLang === 'HI') {
      switch (label) {
        case '2FA (Two-Factor Authentication)': return '2FA (द्वि-कारक प्रमाणीकरण)';
        case 'Biometric Login': return 'बायोमेट्रिक लॉगिन';
        case 'Transaction PIN': return 'लेन-देन पिन (PIN)';
        default: return label;
      }
    }
    return label;
  };

  const getSecuritySettingValue = (label, value) => {
    if (customerLang === 'HI') {
      switch (label) {
        case '2FA (Two-Factor Authentication)': return 'सक्रिय — पंजीकृत मोबाइल पर ओटीपी';
        case 'Biometric Login': return 'सक्रिय — फिंगरप्रिंट';
        case 'Transaction PIN': return 'सेट — अंतिम परिवर्तन 45 दिन पहले';
        default: return value;
      }
    }
    return value;
  };

  const getFeeName = (name) => {
    if (customerLang === 'HI') {
      switch (name) {
        case 'Minimum Balance Charge': return 'न्यूनतम शेष राशि शुल्क';
        case 'ATM Withdrawal — Own Bank': return 'एटीएम निकासी — खुद का बैंक';
        case 'ATM Withdrawal — Other Bank': return 'एटीएम निकासी — अन्य बैंक';
        case 'NEFT / RTGS Transfer': return 'एनईएफटी / आरटीजीएस ट्रांसफर';
        case 'IMPS Transfer': return 'आईएमपीएस ट्रांसफर';
        case 'Debit Card Annual Fee': return 'डेबिट कार्ड वार्षिक शुल्क';
        case 'Premature Withdrawal Penalty': return 'समय से पहले निकासी जुर्माना';
        case 'FD Opening / Closing': return 'एफडी खोलना / बंद करना';
        case 'FD Certificate Reissue': return 'एफडी प्रमाणपत्र पुनर्जीवन';
        case 'Processing Fee (Home Loan)': return 'प्रसंस्करण शुल्क (गृह ऋण)';
        case 'Processing Fee (Personal Loan)': return 'प्रसंस्करण शुल्क (व्यक्तिगत ऋण)';
        case 'Part-Prepayment Charges': return 'आंशिक पूर्व-भुगतान शुल्क';
        case 'Full Prepayment (Floating Rate)': return 'पूर्ण पूर्व-भुगतान (फ्लोटिंग दर)';
        case 'Full Prepayment (Fixed Rate)': return 'पूर्ण पूर्व-भुगतान (निश्चित दर)';
        case 'Late EMI Payment Penalty': return 'देर से ईएमआई भुगतान जुर्माना';
        case 'Loan Foreclosure Statement': return 'ऋण फोरक्लोज़र विवरण';
        default: return name;
      }
    }
    return name;
  };

  const getFeeValue = (value) => {
    if (customerLang === 'HI') {
      let val = value;
      val = val.replace('Free (up to 5/month)', 'निःशुल्क (5/माह तक)');
      val = val.replace('Free ✅', 'निःशुल्क ✅');
      val = val.replace('₹20/txn after 3 free/month', '3 निःशुल्क/माह के बाद ₹20/लेनदेन');
      val = val.replace('₹199/year (Classic), ₹499/year (Platinum)', '₹199/वर्ष (क्लासिक), ₹499/वर्ष (प्लेटिनम)');
      val = val.replace('1% of applicable interest rate', 'लागू ब्याज दर का 1%');
      val = val.replace('₹50 per certificate', '₹50 प्रति प्रमाणपत्र');
      val = val.replace('0.5% of loan amount (max ₹10,000)', 'ऋण राशि का 0.5% (अधिकतम ₹10,000)');
      val = val.replace('₹999 flat', '₹999 फ्लैट');
      val = val.replace('Nil after 6 months ✅', '6 महीने के बाद शून्य ✅');
      val = val.replace('Nil ✅ (as per RBI guidelines)', 'शून्य ✅ (आरबीआई दिशानिर्देशों के अनुसार)');
      val = val.replace('2% of outstanding principal', 'बकाया मूलधन का 2%');
      val = val.replace('2% p.a. on overdue amount', 'अतिदेय राशि पर 2% प्रति वर्ष');
      val = val.replace('₹500/quarter (if avg. balance below ₹10,000)', '₹500/तिमाही (यदि औसत शेष ₹10,000 से कम हो)');
      return val;
    }
    return value;
  };

  return (
    <div className="cp-page fade-in">
      {/* Page Header */}
      <div className="cp-section">
        <div className="cp-greeting">
          <div className="cp-greeting-text">
            <h2>{t.settingsTitle} ⚙️</h2>
            <p>{t.settingsSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="cp-section" style={{ animationDelay: '0.05s' }}>
        <div style={{
          display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: 5, borderRadius: 14,
          overflowX: 'auto', border: '1px solid var(--border-color)',
        }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '11px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '0.84rem', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.25s ease', whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(59,130,246,0.1)' : 'none',
            }}>
              <tab.icon size={16} /> {getTabLabel(tab.id, tab.label)}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PROFILE TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'profile' && (
        <>
          {/* Personal Information */}
          <div className="cp-section" style={{ animationDelay: '0.1s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, width: '100%' }}>
                <div className="cp-section-header" style={{ margin: 0 }}>
                  <div className="cp-priority-icon blue"><User size={22} /></div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t.profileDetailsTitle}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      {customerLang === 'HI' ? 'आपके केवाईसी सत्यापित विवरण' : 'Your KYC-verified details'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowEditModal(true)} className="cp-sage-chip" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                  <Edit3 size={14} /> {t.editProfileBtn}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, width: '100%' }}>
                {[
                  { label: 'Full Name', value: 'Priya Sharma', icon: User, locked: true },
                  { label: 'Email', value: 'priya.sharma@gmail.com', icon: Mail, locked: false },
                  { label: 'Phone', value: '+91 98765 43210', icon: Phone, locked: false },
                  { label: 'Account Number', value: 'XXXX XXXX 4532', icon: Hash, locked: true },
                  { label: 'Branch', value: 'Andheri West, Mumbai', icon: Building2, locked: true },
                  { label: 'PAN', value: 'ABCPS1234K', icon: FileText, locked: true },
                ].map(field => (
                  <div key={field.label} style={{
                    padding: '14px 16px', background: 'rgba(15,23,42,0.4)', borderRadius: 10,
                    border: '1px solid var(--border-color)',
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <field.icon size={12} /> {getProfileFieldLabel(field.label)}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{field.value}</span>
                      {field.locked && <Lock size={12} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KYC Status */}
          <div className="cp-section" style={{ animationDelay: '0.15s' }}>
            <div className="cp-priority-card success" style={{ alignItems: 'center' }}>
              <div className="cp-priority-icon green"><ShieldCheck size={22} /></div>
              <div className="cp-priority-body">
                <div className="cp-priority-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {customerLang === 'HI' ? 'केवाईसी (KYC) स्थिति' : 'KYC Status'}
                  <span style={{
                    padding: '3px 12px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 700,
                    background: 'var(--accent-green-soft)', color: 'var(--accent-green)',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{t.kycVerifiedBadge} ✓</span>
                </div>
                <div className="cp-priority-desc" style={{ marginBottom: 0 }}>
                  {customerLang === 'HI'
                    ? '15 जनवरी 2024 को आधार eKYC के माध्यम से पूर्ण केवाईसी पूरा हुआ। अगला पुन: सत्यापन: जनवरी 2034।'
                    : 'Full KYC completed on 15 Jan 2024 via Aadhaar eKYC. Next re-verification due: Jan 2034.'}
                </div>
              </div>
            </div>
          </div>

          {/* Nominee Information */}
          <div className="cp-section" style={{ animationDelay: '0.2s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 14 }}>
              <div className="cp-section-header" style={{ margin: 0 }}>
                <div className="cp-priority-icon blue"><UserCheck size={22} /></div>
                <h3>{customerLang === 'HI' ? 'नामांकित व्यक्ति (Nominee) की जानकारी' : 'Nominee Information'}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, width: '100%' }}>
                {[
                  { label: 'Nominee Name', value: 'Rajesh Sharma' },
                  { label: 'Relationship', value: 'Spouse' },
                  { label: 'Date of Birth', value: '14 Aug 1988' },
                  { label: 'Share (%)', value: '100%' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '12px 14px', background: 'rgba(15,23,42,0.4)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{getNomineeFieldLabel(item.label)}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{getNomineeValue(item.value)}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                {customerLang === 'HI'
                  ? 'नामांकित विवरण सभी बचत खातों और एफडी पर लागू होते हैं। नामांकित व्यक्ति को अपडेट करने के लिए अपनी शाखा में जाएँ।'
                  : 'Nominee details apply to all savings accounts and FDs. Visit your branch to update nominee.'}
              </p>
            </div>
          </div>

          {/* Edit Profile Modal */}
          {showEditModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div style={{
                maxWidth: 500, width: '100%', background: 'var(--bg-card)', borderRadius: 16,
                border: '1px solid var(--border-color)', padding: 32, position: 'relative',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              }}>
                <button onClick={() => setShowEditModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{t.editProfileBtn}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 20 }}>
                  {customerLang === 'HI'
                    ? 'अपने संपर्क विवरण अपडेट करें। परिवर्तनों के लिए ओटीपी सत्यापन की आवश्यकता है।'
                    : 'Update your contact details. Changes require OTP verification.'}
                </p>
                {[
                  { label: customerLang === 'HI' ? 'ईमेल पता' : 'Email Address', key: 'email', type: 'email' },
                  { label: customerLang === 'HI' ? 'मोबाइल नंबर' : 'Mobile Number', key: 'phone', type: 'tel' },
                  { label: customerLang === 'HI' ? 'पता' : 'Address', key: 'address', type: 'text' },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6, fontWeight: 600 }}>{field.label}</label>
                    <input
                      type={field.type}
                      value={editForm[field.key]}
                      onChange={e => setEditForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px 14px', background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)',
                        fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none',
                      }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => setShowEditModal(false)} style={{
                    flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border-color)',
                    background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600,
                  }}>{t.cancel}</button>
                  <button onClick={() => setShowEditModal(false)} style={{
                    flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600,
                  }}>
                    {customerLang === 'HI' ? 'सहेजें और ओटीपी द्वारा सत्यापित करें' : 'Save & Verify via OTP'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          COMMUNICATION TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'comms' && (
        <>
          {/* Always-On Mandatory Alerts */}
          <div className="cp-section" style={{ animationDelay: '0.1s' }}>
            <div className="cp-priority-card urgent" style={{ flexDirection: 'column', gap: 0 }}>
              <div className="cp-section-header" style={{ marginBottom: 14 }}>
                <div className="cp-priority-icon red"><ShieldAlert size={22} /></div>
                <div>
                  <h3>{t.alwaysOnAlerts}</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{t.alwaysOnAlertsDesc}</p>
                </div>
              </div>
              {[
                customerLang === 'HI' ? '₹10,000 से अधिक का लेनदेन' : 'Transaction above ₹10,000',
                customerLang === 'HI' ? 'नए उपकरण या स्थान से लॉगिन' : 'Login from new device or location',
                customerLang === 'HI' ? 'ईएमआई भुगतान की पुष्टि और रसीद' : 'EMI payment confirmation & receipt'
              ].map(alert => (
                <div key={alert} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--accent-green)' }} />
                    <span style={{ fontSize: '0.88rem' }}>{alert}</span>
                  </div>
                  <Toggle enabled={true} onChange={() => {}} disabled={true} />
                </div>
              ))}
            </div>
          </div>

          {/* Configurable Alerts */}
          <div className="cp-section" style={{ animationDelay: '0.15s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div className="cp-section-header" style={{ marginBottom: 14 }}>
                <div className="cp-priority-icon blue"><BellRing size={22} /></div>
                <h3>{t.configurableAlerts}</h3>
              </div>
              {[
                { key: 'balanceThreshold', label: 'Balance drops below threshold', hasAmount: true },
                { key: 'fdMaturity', label: 'FD maturity reminders' },
                { key: 'sipConfirm', label: 'SIP execution confirmation' },
                { key: 'sageNudges', label: 'SAGE proactive nudges', hasOff: true },
              ].map(item => (
                <div key={item.key} style={{ padding: '14px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{getCommPrefLabel(item.key)}</span>
                    <Toggle enabled={commPrefs[item.key].enabled} onChange={() => setCommPrefs(p => ({ ...p, [item.key]: { ...p[item.key], enabled: !p[item.key].enabled } }))} />
                  </div>
                  {commPrefs[item.key].enabled && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginLeft: 4 }}>
                      {Object.entries(commPrefs[item.key].channels).map(([ch, active]) => (
                        <ChannelChip key={ch} label={ch} active={active} onClick={() => toggleChannel(item.key, ch)} />
                      ))}
                    </div>
                  )}
                  {item.hasAmount && commPrefs[item.key].enabled && (
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {customerLang === 'HI' ? 'शेष राशि इससे कम होने पर सचेत करें:' : 'Alert when balance drops below:'}
                      </span>
                      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                        <span style={{ position: 'absolute', left: 10, fontSize: '0.82rem', color: 'var(--text-muted)', pointerEvents: 'none' }}>₹</span>
                        <input
                          type="number"
                          value={commPrefs[item.key].amount}
                          onChange={e => setCommPrefs(p => ({ ...p, [item.key]: { ...p[item.key], amount: parseInt(e.target.value) || 0 } }))}
                          style={{
                            width: 130, padding: '7px 12px 7px 24px', background: 'rgba(15,23,42,0.5)',
                            border: '1px solid var(--border-color)', borderRadius: 8, color: 'var(--text-primary)',
                            fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Offers & Promotions */}
          <div className="cp-section" style={{ animationDelay: '0.2s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div className="cp-section-header" style={{ marginBottom: 14 }}>
                <div className="cp-priority-icon blue"><MessageCircle size={22} /></div>
                <h3>{t.optInHeader}</h3>
              </div>
              {/* Opt-in toggle */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                  {customerLang === 'HI' ? 'ऑफ़र प्राप्त करें?' : 'Receive offers?'}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { id: 'max2', label: customerLang === 'HI' ? '✅ हाँ, प्रति माह अधिकतम 2' : '✅ Yes, max 2 per month' },
                    { id: 'pause', label: customerLang === 'HI' ? '🚫 नहीं, 90 दिनों के लिए रोकें' : '🚫 No, pause for 90 days' },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setOfferPref(opt.id)} className="cp-sage-chip" style={{
                      padding: '8px 16px', fontSize: '0.82rem',
                      background: offerPref === opt.id ? 'rgba(59,130,246,0.12)' : 'transparent',
                      borderColor: offerPref === opt.id ? 'var(--accent-blue)' : 'var(--border-color)',
                      color: offerPref === opt.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    }}>{opt.label}</button>
                  ))}
                </div>
              </div>
              {/* Preferred channel for offers */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                  {customerLang === 'HI' ? 'ऑफ़र के लिए पसंदीदा चैनल' : 'Preferred channel for offers'}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['SMS', 'WhatsApp', 'Email', 'In-App'].map(ch => (
                    <ChannelChip key={ch} label={ch} active={offerChannel === ch} onClick={() => setOfferChannel(ch)} />
                  ))}
                </div>
              </div>
              {/* Language preference */}
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                  {customerLang === 'HI' ? 'ऑफ़र के लिए भाषा प्राथमिकता' : 'Language preference for offers'}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[{ id: 'EN', label: 'English' }, { id: 'HI', label: 'हिन्दी' }].map(lang => (
                    <button key={lang.id} onClick={() => setOfferLanguage(lang.id)} style={{
                      padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: offerLanguage === lang.id ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--bg-secondary)',
                      color: offerLanguage === lang.id ? 'white' : 'var(--text-secondary)',
                      fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit', transition: 'all 0.2s',
                    }}>{lang.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="cp-section" style={{ animationDelay: '0.25s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 12 }}>
                <div className="cp-section-header" style={{ margin: 0 }}>
                  <div className="cp-priority-icon blue"><Clock size={22} /></div>
                  <h3>{customerLang === 'HI' ? 'शांत घंटे (Quiet Hours)' : 'Quiet Hours'}</h3>
                </div>
                <Toggle enabled={quietHoursEnabled} onChange={() => setQuietHoursEnabled(!quietHoursEnabled)} />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                {customerLang === 'HI'
                  ? 'शांत घंटों के दौरान कोई एसएमएस या व्हाट्सएप नोटिफिकेशन नहीं। सुरक्षा अलर्ट हमेशा भेजे जाते हैं।'
                  : 'No SMS or WhatsApp notifications during quiet hours. Security alerts are always delivered.'}
              </p>
              {quietHoursEnabled && (
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      {customerLang === 'HI' ? 'प्रारंभ समय' : 'Start Time'}
                    </label>
                    <input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} style={{
                      padding: '8px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border-color)',
                      borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none',
                    }} />
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 18 }}>
                    {customerLang === 'HI' ? 'से' : 'to'}
                  </span>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      {customerLang === 'HI' ? 'समाप्ति समय' : 'End Time'}
                    </label>
                    <input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} style={{
                      padding: '8px 12px', background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border-color)',
                      borderRadius: 8, color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none',
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Do Not Disturb & Opt-Out */}
          <div className="cp-section" style={{ animationDelay: '0.3s' }}>
            <div className="cp-priority-card warning" style={{ flexDirection: 'column', gap: 0 }}>
              <div className="cp-section-header" style={{ marginBottom: 14 }}>
                <div className="cp-priority-icon yellow"><BellOff size={22} /></div>
                <h3>{t.optOutDndTitle}</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {customerLang === 'HI' ? '90 दिनों के लिए सभी मार्केटिंग रोकें' : 'Pause all marketing for 90 days'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {customerLang === 'HI' ? 'कोई प्रचार संदेश नहीं। सेवा अलर्ट जारी रहेंगे।' : 'No promotional messages. Service alerts continue.'}
                  </div>
                </div>
                <Toggle enabled={pauseMarketing} onChange={() => setPauseMarketing(!pauseMarketing)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-red)' }}>
                    {customerLang === 'HI' ? 'स्थायी विपणन ऑप्ट-आउट' : 'Permanent marketing opt-out'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {customerLang === 'HI' ? 'सभी प्रचार संचार स्थायी रूप से रोकें। अपरिवर्तनीय।' : 'Permanently stop all promotional communication. Irreversible.'}
                  </div>
                </div>
                <Toggle enabled={permanentOptOut} onChange={() => setPermanentOptOut(!permanentOptOut)} />
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{t.blockChannelLabel}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { label: customerLang === 'HI' ? 'एसएमएस ब्लॉक करें' : 'Block SMS', state: blockSMS, setter: setBlockSMS },
                    { label: customerLang === 'HI' ? 'व्हाट्सएप ब्लॉक करें' : 'Block WhatsApp', state: blockWhatsApp, setter: setBlockWhatsApp },
                    { label: customerLang === 'HI' ? 'ईमेल ब्लॉक करें' : 'Block Email', state: blockEmail, setter: setBlockEmail },
                  ].map(ch => (
                    <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Toggle enabled={ch.state} onChange={() => ch.setter(!ch.state)} />
                      <span style={{ fontSize: '0.82rem', color: ch.state ? 'var(--accent-red)' : 'var(--text-secondary)' }}>{ch.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          PRIVACY & DATA TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'privacy' && (
        <>
          {/* Data We Use */}
          <div className="cp-section" style={{ animationDelay: '0.1s' }}>
            <div className="cp-priority-card success" style={{ flexDirection: 'column', gap: 14 }}>
              <div className="cp-section-header" style={{ margin: 0 }}>
                <div className="cp-priority-icon green"><Database size={22} /></div>
                <h3>{t.dataPrivacyTitle}</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, width: '100%' }}>
                {[
                  { icon: '💳', title: 'Transaction Data', desc: 'Spending patterns and payment behavior for SAGE suggestions' },
                  { icon: '📊', title: 'Product Holdings', desc: 'Accounts, FDs, loans, SIPs — to personalize your dashboard' },
                  { icon: '📱', title: 'App Usage', desc: 'Navigation patterns to improve our interface and features' },
                  { icon: '🤖', title: 'SAGE Conversations', desc: 'Cross-session context for better advice (encrypted end-to-end)' },
                ].map(item => (
                  <div key={item.title} style={{
                    padding: '14px', background: 'rgba(15,23,42,0.4)', borderRadius: 10,
                    border: '1px solid rgba(16,185,129,0.1)',
                  }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{item.icon}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>{getPrivacyUseTitle(item.title)}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{getPrivacyUseDesc(item.desc)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data We Do NOT Share */}
          <div className="cp-section" style={{ animationDelay: '0.15s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 14 }}>
              <div className="cp-section-header" style={{ margin: 0 }}>
                <div className="cp-priority-icon blue"><Lock size={22} /></div>
                <h3>{customerLang === 'HI' ? 'डेटा जो हम साझा नहीं करते हैं' : 'Data We Do NOT Share'}</h3>
              </div>
              <div style={{ width: '100%' }}>
                {[
                  customerLang === 'HI' ? 'हम कभी भी आपका डेटा तीसरे पक्ष को नहीं बेचते हैं — आपका डेटा ट्रस्टएज के पास सुरक्षित रहता है' : 'We never sell your data to third parties — your data stays with TrustEdge',
                  customerLang === 'HI' ? 'हम विज्ञापनदाताओं या मार्केटिंग कंपनियों के साथ डेटा साझा नहीं करते हैं' : 'We do not share data with advertisers or marketing companies',
                  customerLang === 'HI' ? 'हमारा AI पूरी तरह से आंतरिक रूप से चलता है — कोई बाहरी AI सेवाएं आपके डेटा को संसाधित नहीं करती हैं' : 'Our AI runs entirely internal — no external AI services process your data',
                  customerLang === 'HI' ? 'सेज बातचीत शुरू से अंत तक एन्क्रिप्टेड है और कभी भी हमारे सर्वर से बाहर नहीं जाती है' : 'SAGE conversations are end-to-end encrypted and never leave our servers',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(148,163,184,0.06)' : 'none' }}>
                    <Shield size={14} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What AI Does & Does NOT */}
          <div className="cp-section" style={{ animationDelay: '0.2s' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="cp-priority-card success" style={{ flexDirection: 'column', gap: 12 }}>
                <div className="cp-section-header" style={{ margin: 0 }}>
                  <div className="cp-priority-icon green"><Bot size={20} /></div>
                  <h3 style={{ fontSize: '0.95rem' }}>{customerLang === 'HI' ? 'एआई क्या करता है' : 'What AI Does'}</h3>
                </div>
                {[
                  customerLang === 'HI' ? 'लेन-देन वर्गीकरण और अंतर्दृष्टि' : 'Transaction categorization & insights',
                  customerLang === 'HI' ? 'प्रोफ़ाइल के आधार पर ऑफ़र सुझाव' : 'Offer suggestions based on profile',
                  customerLang === 'HI' ? 'सेज — आपका एआई वित्तीय सहायक' : 'SAGE — your AI financial assistant',
                  customerLang === 'HI' ? 'विसंगति और सुरक्षा खतरे का पता लगाना' : 'Anomaly & security threat detection',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--accent-green)', flexShrink: 0 }} /> {item}
                  </div>
                ))}
              </div>
              <div className="cp-priority-card urgent" style={{ flexDirection: 'column', gap: 12 }}>
                <div className="cp-section-header" style={{ margin: 0 }}>
                  <div className="cp-priority-icon red"><Ban size={20} /></div>
                  <h3 style={{ fontSize: '0.95rem' }}>{customerLang === 'HI' ? 'एआई क्या नहीं करता है' : 'What AI Does NOT'}</h3>
                </div>
                {[
                  customerLang === 'HI' ? 'मानव समीक्षा के बिना कोई ऋण निर्णय नहीं' : 'No loan decisions without human review',
                  customerLang === 'HI' ? 'ग्राहकों के बीच कोई डेटा साझा नहीं करना' : 'No sharing data between customers',
                  customerLang === 'HI' ? 'तीसरे पक्ष को कोई अंतर्दृष्टि नहीं बेचना' : 'No selling insights to third parties',
                  customerLang === 'HI' ? 'कोई स्वायत्त खाता कार्रवाई नहीं' : 'No autonomous account actions',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <X size={14} style={{ color: 'var(--accent-red)', flexShrink: 0 }} /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consent Management */}
          <div className="cp-section" style={{ animationDelay: '0.25s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div className="cp-section-header" style={{ marginBottom: 14 }}>
                <div className="cp-priority-icon blue"><Sliders size={22} /></div>
                <h3>{t.consentSettingsTitle}</h3>
              </div>
              {[
                { key: 'personalizedOffers', label: 'Personalized offer targeting' },
                { key: 'sageAnalysis', label: 'SAGE conversation analysis' },
                { key: 'crossProduct', label: 'Cross-product profile building' },
                { key: 'accountAggregator', label: 'External API data sharing (Account Aggregator)' },
              ].map((item, idx) => (
                <div key={item.key} style={{
                  padding: '16px 0',
                  borderBottom: idx < 3 ? '1px solid rgba(148,163,184,0.08)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>{getConsentLabel(item.key)}</span>
                    <Toggle enabled={consents[item.key].enabled} onChange={() => toggleConsent(item.key)} />
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0', lineHeight: 1.5 }}>
                    {getConsentDesc(item.key)}
                  </p>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.72rem', marginTop: 6 }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} /> {customerLang === 'HI' ? 'अंतिम परिवर्तन:' : 'Last changed:'} {consents[item.key].lastChanged}
                    </span>
                    <span style={{ color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlertTriangle size={10} /> {getConsentImpact(item.key)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="cp-section" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="cp-sage-chip" style={{ padding: '10px 18px' }}>
                <Download size={16} /> {t.downloadDataBtn}
              </button>
              <button className="cp-sage-chip" style={{ padding: '10px 18px', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--accent-red)' }}>
                <Trash2 size={16} /> {t.deleteSageHistoryBtn}
              </button>
              <button className="cp-sage-chip" style={{ padding: '10px 18px' }}>
                <Sliders size={16} /> {customerLang === 'HI' ? 'सभी सहमतियां प्रबंधित करें' : 'Manage all consents'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECURITY TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'security' && (
        <>
          {/* Last Login */}
          <div className="cp-section" style={{ animationDelay: '0.1s' }}>
            <div className="cp-priority-card success" style={{ alignItems: 'center' }}>
              <div className="cp-priority-icon green"><CheckCircle2 size={22} /></div>
              <div className="cp-priority-body">
                <div className="cp-priority-title">{customerLang === 'HI' ? 'अंतिम लॉगिन' : 'Last Login'}</div>
                <div className="cp-priority-desc" style={{ marginBottom: 0 }}>
                  {customerLang === 'HI'
                    ? 'आज, 11:24 AM - मुंबई, MH से · Chrome 125 / Windows 11 · IP: 103.21.xx.xx'
                    : 'Today, 11:24 AM from Mumbai, MH · Chrome 125 / Windows 11 · IP: 103.21.xx.xx'}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Login History */}
          <div className="cp-section" style={{ animationDelay: '0.15s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 14 }}>
                <div className="cp-section-header" style={{ margin: 0 }}>
                  <div className="cp-priority-icon blue"><History size={22} /></div>
                  <h3>{t.recentLogins}</h3>
                  <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, background: 'rgba(59,130,246,0.12)', color: 'var(--accent-blue)' }}>
                    {customerLang === 'HI' ? 'अंतिम 10' : 'Last 10'}
                  </span>
                </div>
                <button onClick={() => setShowLoginHistory(!showLoginHistory)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)',
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {showLoginHistory
                    ? (customerLang === 'HI' ? 'संक्षिप्त करें' : 'Collapse')
                    : (customerLang === 'HI' ? 'विस्तार करें' : 'Expand')}{' '}
                  {showLoginHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Show only current session if not expanded, or all 10 if expanded */}
              {(showLoginHistory ? LOGIN_HISTORY : LOGIN_HISTORY.slice(0, 1)).map((login, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: login.current ? 'var(--accent-green-soft)' : 'var(--bg-secondary)',
                      color: login.current ? 'var(--accent-green)' : 'var(--text-muted)',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      {login.browser.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                        {login.device}
                        {login.current && <span style={{
                          marginLeft: 8, padding: '2px 8px', borderRadius: 100, fontSize: '0.62rem',
                          fontWeight: 700, background: 'var(--accent-green-soft)', color: 'var(--accent-green)',
                        }}>{customerLang === 'HI' ? 'वर्तमान' : 'CURRENT'}</span>}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                        <span>{login.location}</span> · <span>IP: {login.ip}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{login.time}</span>
                    {!login.current && (
                      <button style={{
                        background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 6, padding: '4px 10px', cursor: 'pointer', color: 'var(--accent-red)',
                        fontSize: '0.7rem', fontWeight: 600, fontFamily: 'inherit',
                      }}>{t.endSessionBtn}</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="cp-section" style={{ animationDelay: '0.2s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div className="cp-section-header" style={{ marginBottom: 14 }}>
                <div className="cp-priority-icon blue"><Lock size={22} /></div>
                <h3>{t.securityCenterTitle}</h3>
              </div>
              {[
                { label: '2FA (Two-Factor Authentication)', value: 'Enabled — OTP on registered mobile', icon: Key, color: 'var(--accent-green)' },
                { label: 'Biometric Login', value: 'Enabled — Fingerprint', icon: Fingerprint, color: 'var(--accent-green)' },
                { label: 'Transaction PIN', value: 'Set — Last changed 45 days ago', icon: Lock, color: 'var(--accent-green)' },
              ].map(setting => (
                <div key={setting.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <setting.icon size={18} style={{ color: 'var(--accent-blue)' }} />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{getSecuritySettingLabel(setting.label)}</div>
                      <div style={{ fontSize: '0.75rem', color: setting.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={11} /> {getSecuritySettingValue(setting.label, setting.value)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {[
                  { label: t.changePasswordBtn, icon: Key },
                  { label: t.changePinBtn, icon: Lock },
                  { label: customerLang === 'HI' ? 'मोबाइल अपडेट करें' : 'Update Mobile', icon: Smartphone },
                  { label: t.blockCardBtn, icon: CreditCard },
                ].map(action => (
                  <button key={action.label} className="cp-sage-chip" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                    <action.icon size={14} /> {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction Alert Threshold */}
          <div className="cp-section" style={{ animationDelay: '0.25s' }}>
            <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
              <div className="cp-section-header" style={{ marginBottom: 14 }}>
                <div className="cp-priority-icon blue"><BellRing size={22} /></div>
                <h3>{customerLang === 'HI' ? 'लेन-देन अलर्ट सीमा' : 'Transaction Alert Threshold'}</h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                {customerLang === 'HI'
                  ? 'चुनें कि आप अपने खाते पर लेनदेन के बारे में कब सचेत होना चाहते हैं।'
                  : 'Choose when you want to be alerted about transactions on your account.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {[
                  { id: 'every', label: customerLang === 'HI' ? 'प्रत्येक लेनदेन के लिए अलर्ट' : 'Alert for every transaction', desc: customerLang === 'HI' ? 'सभी डेबिट और क्रेडिट लेनदेन के लिए सूचित किया जाए' : 'Get notified for all debit & credit transactions' },
                  { id: 'above', label: customerLang === 'HI' ? `इससे अधिक के लेनदेन के लिए अलर्ट: ${formatINR(customAlertAmount)}` : `Alert for transactions above ${formatINR(customAlertAmount)}`, desc: customerLang === 'HI' ? 'अपनी खुद की सीमा राशि सेट करें' : 'Set your own threshold amount' },
                ].map(opt => (
                  <div key={opt.id} onClick={() => setAlertThreshold(opt.id)} style={{
                    padding: '12px 16px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                    border: `1px solid ${alertThreshold === opt.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                    background: alertThreshold === opt.id ? 'rgba(59,130,246,0.08)' : 'transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CircleDot size={16} style={{ color: alertThreshold === opt.id ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: alertThreshold === opt.id ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                      </div>
                    </div>
                    {opt.id === 'above' && alertThreshold === 'above' && (
                      <div style={{ marginTop: 10, marginLeft: 26, display: 'flex', alignItems: 'center', gap: 8 }} onClick={e => e.stopPropagation()}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {customerLang === 'HI' ? 'राशि:' : 'Amount:'}
                        </span>
                        <input type="number" value={customAlertAmount} onChange={e => setCustomAlertAmount(parseInt(e.target.value) || 0)} style={{
                          width: 120, padding: '6px 12px', background: 'rgba(15,23,42,0.5)',
                          border: '1px solid var(--border-color)', borderRadius: 6, color: 'var(--text-primary)',
                          fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none',
                        }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Toggle enabled={alertUPI} onChange={() => setAlertUPI(!alertUPI)} />
                  <span style={{ fontSize: '0.82rem' }}>
                    {customerLang === 'HI' ? 'सभी यूपीआई (UPI) लेनदेन के लिए अलर्ट' : 'Alert for all UPI transactions'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Toggle enabled={alertInternational} onChange={() => setAlertInternational(!alertInternational)} />
                  <span style={{ fontSize: '0.82rem' }}>
                    {customerLang === 'HI' ? 'अंतरराष्ट्रीय लेनदेन के लिए अलर्ट' : 'Alert for international transactions'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Actions */}
          <div className="cp-section" style={{ animationDelay: '0.3s' }}>
            <div className="cp-priority-card urgent" style={{ flexDirection: 'column', gap: 14 }}>
              <div className="cp-section-header" style={{ margin: 0 }}>
                <div className="cp-priority-icon red"><AlertTriangle size={22} /></div>
                <h3 style={{ color: 'var(--accent-red)' }}>🚨 {t.securityActionsTitle}</h3>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="cp-sage-chip" style={{
                  padding: '10px 18px', borderColor: 'rgba(239,68,68,0.3)', color: 'var(--accent-red)',
                }}>
                  <AlertTriangle size={16} /> {t.reportUnauthorizedBtn}
                </button>
                <button onClick={() => setShowEmergencyConfirm(true)} style={{
                  padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white',
                  fontFamily: 'inherit', fontSize: '0.84rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                }}>
                  <Ban size={16} /> {customerLang === 'HI' ? 'सभी लेनदेन तुरंत रोकें' : 'Block All Transactions'}
                </button>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                {customerLang === 'HI'
                  ? 'आपातकालीन रोक तुरंत सभी डेबिट लेनदेन को ब्लॉक कर देती है। वेतन जमा और अनुसूचित ईएमआई भुगतान अप्रभावित रहते हैं।'
                  : 'Emergency freeze immediately blocks all debit transactions. Salary credits and scheduled EMI payments continue unaffected.'}
              </p>
            </div>
          </div>

          {/* Emergency Confirm Modal */}
          {showEmergencyConfirm && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
              <div style={{
                maxWidth: 460, width: '100%', background: 'var(--bg-card)', borderRadius: 16,
                border: '1px solid rgba(239,68,68,0.2)', padding: 36, textAlign: 'center',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.1)',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-red-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                }}>
                  <AlertTriangle size={32} style={{ color: 'var(--accent-red)' }} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                  {customerLang === 'HI' ? 'सभी लेनदेन ब्लॉक करें?' : 'Block All Transactions?'}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                  {customerLang === 'HI'
                    ? 'यह आपके खाते पर तुरंत सभी डेबिट लेनदेन को ब्लॉक कर देगा। वेतन जमा और अनुसूचित ईएमआई भुगतान जारी रहेंगे।'
                    : 'This will immediately block ALL debit transactions on your account. Salary credits and scheduled EMI payments will continue.'}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={() => setShowEmergencyConfirm(false)} style={{
                    padding: '11px 24px', borderRadius: 10, border: '1px solid var(--border-color)',
                    background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 600,
                  }}>{t.cancel}</button>
                  <button onClick={() => setShowEmergencyConfirm(false)} style={{
                    padding: '11px 24px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: 700,
                    boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                  }}>
                    {customerLang === 'HI' ? 'पुष्टि करें — सब कुछ ब्लॉक करें' : 'Confirm — Block Everything'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          FEES & CHARGES TAB
          ═══════════════════════════════════════════════════════ */}
      {activeTab === 'fees' && (
        <>
          <div className="cp-section" style={{ animationDelay: '0.1s' }}>
            <div className="cp-priority-card info" style={{ alignItems: 'center' }}>
              <div className="cp-priority-icon blue"><Info size={22} /></div>
              <div className="cp-priority-body">
                <div className="cp-priority-desc" style={{ marginBottom: 0, fontSize: '0.85rem' }}>
                  {customerLang === 'HI'
                    ? 'सभी शुल्कों पर पूर्ण पारदर्शिता। कोई छिपा हुआ खर्च नहीं — कभी भी। आरबीआई के दिशानिर्देशों के अनुसार, सभी शुल्कों का खुलासा पहले ही कर दिया जाता.'
                    : 'Full transparency on all fees and charges. No hidden costs — ever. As per RBI guidelines, all charges are disclosed upfront.'}
                </div>
              </div>
            </div>
          </div>

          {FEE_TABLE.map((section, i) => (
            <div key={i} className="cp-section" style={{ animationDelay: `${0.15 + i * 0.05}s` }}>
              <div className="cp-priority-card info" style={{ flexDirection: 'column', gap: 0 }}>
                <div className="cp-section-header" style={{ marginBottom: 14 }}>
                  <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
                  <h3>
                    {section.category === 'Savings Account' ? t.savingsAccountFees :
                     section.category === 'Fixed Deposit' ? t.fdFees :
                     section.category === 'Loans' ? t.loanFees : section.category}
                  </h3>
                </div>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{
                          textAlign: 'left', padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)',
                          borderBottom: '1px solid rgba(148,163,184,0.1)',
                        }}>{customerLang === 'HI' ? 'शुल्क / प्रभार' : 'Fee / Charge'}</th>
                        <th style={{
                          textAlign: 'right', padding: '10px 14px', fontSize: '0.75rem', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)',
                          borderBottom: '1px solid rgba(148,163,184,0.1)',
                        }}>{customerLang === 'HI' ? 'राशि' : 'Amount'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.fees.map((fee, j) => (
                        <tr key={j} style={{ borderBottom: j < section.fees.length - 1 ? '1px solid rgba(148,163,184,0.06)' : 'none' }}>
                          <td style={{ padding: '12px 14px', fontSize: '0.88rem', fontWeight: 500 }}>{getFeeName(fee.name)}</td>
                          <td style={{
                            padding: '12px 14px', fontSize: '0.85rem', textAlign: 'right', fontWeight: 600,
                            color: fee.free ? 'var(--accent-green)' : 'var(--text-primary)',
                          }}>{getFeeValue(fee.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

          <div className="cp-section" style={{ animationDelay: '0.35s' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="cp-sage-chip" style={{ padding: '10px 18px' }}>
                <Download size={16} /> {customerLang === 'HI' ? 'पूर्ण शुल्क विवरण पीडीएफ डाउनलोड करें' : 'Download full fee schedule PDF'}
              </button>
              <button onClick={() => navigate('/portal/sage')} className="cp-sage-chip" style={{ padding: '10px 18px' }}>
                <MessageSquare size={16} /> {customerLang === 'HI' ? 'किसी भी शुल्क के बारे में सेज से पूछें' : 'Ask SAGE about any fee'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
