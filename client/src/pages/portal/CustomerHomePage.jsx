import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Wallet,
  Landmark,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  AlertTriangle,
  Bell,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  Sparkles,
  MessageCircle,
  ShoppingCart,
  Zap,
  Building2,
  Send,
  CreditCard,
  IndianRupee,
  BadgeCheck,
  ShieldCheck,
  Activity,
  HelpCircle,
  PiggyBank,
  BarChart3,
  Heart,
  Phone,
  X,
  CheckCircle2,
  Gift,
  HandHeart,
  BookOpen,
  Target,
  Settings,
  Shield,
} from 'lucide-react';
import './customer-portal.css';

// ═══════════════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════════════

/** Format number in Indian ₹ style: ₹2,84,320 */
function formatINR(n) {
  const abs = Math.abs(n);
  const s = abs.toString();
  let formatted;
  if (s.length <= 3) {
    formatted = s;
  } else {
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ═══════════════════════════════════════════════════════════
// Mock Data — Realistic Indian banking context
// ═══════════════════════════════════════════════════════════

const CUSTOMER = {
  name: 'Priya',
  fullName: 'Priya Sharma',
  monthlyIncome: 85000,
  totalSavings: 284320,
  savingsChange: 4200,
  fdEarnings: 12840,
  fdRate: 6.8,
  activeSIPs: 3,
  sipMonthlyTotal: 15000,
  nextSIPDebit: '5th June',
  stressLevel: 'LOW', // LOW | MODERATE | HIGH
  isFirstLogin: false,
  lastLoginDaysAgo: 0, // Set to >7 for post-inactivity state
};

const PRIORITY_ACTIONS = [
  {
    id: 1,
    type: 'urgent',
    iconColor: 'yellow',
    icon: Landmark,
    title: 'FD Maturing on 12 June — ₹3,50,000',
    description:
      'Your 1-year Fixed Deposit at 6.8% p.a. matures in 16 days. Choose how to reinvest or withdraw your corpus.',
    actions: [
      { label: 'Renew FD', variant: 'btn-primary' },
      { label: 'Start SIP Instead', variant: 'btn-secondary' },
      { label: 'Transfer to Savings', variant: 'btn-ghost' },
    ],
  },
  {
    id: 2,
    type: 'info',
    iconColor: 'green',
    icon: IndianRupee,
    title: 'Salary Credited — ₹85,000',
    description:
      'Your salary from TCS Ltd was credited today. Based on your spending pattern, SAGE recommends saving ₹22,000 this month.',
    actions: [
      { label: 'View Breakdown', variant: 'btn-primary' },
      { label: 'Ask SAGE', variant: 'btn-secondary' },
    ],
  },
  {
    id: 3,
    type: 'warning',
    iconColor: 'blue',
    icon: Calendar,
    title: 'Tax Saving Reminder — ₹42,000 remaining under 80C',
    description:
      "You've claimed ₹1,08,000 of ₹1,50,000 under Section 80C. Invest ₹42,000 in ELSS SIP before 31 March to maximize your deduction.",
    actions: [
      { label: 'Explore ELSS Funds', variant: 'btn-primary' },
      { label: 'Ask SAGE', variant: 'btn-secondary' },
      { label: 'Dismiss', variant: 'btn-ghost' },
    ],
  },
];

const SAGE_SUGGESTIONS = [
  { text: 'How can I save more this month?', icon: PiggyBank },
  { text: 'What happens when my FD matures?', icon: HelpCircle },
  { text: 'How do I start an SIP?', icon: BarChart3 },
  { text: "I'm having trouble paying my EMI", icon: AlertTriangle },
];

const RECENT_TRANSACTIONS = [
  {
    id: 1,
    name: 'Salary — TCS Ltd',
    category: 'Salary Credit',
    amount: 85000,
    type: 'credit',
    iconType: 'credit',
    date: '27 May',
    icon: Building2,
  },
  {
    id: 2,
    name: 'DMart Groceries',
    category: 'Grocery',
    amount: 3480,
    type: 'debit',
    iconType: 'debit',
    date: '26 May',
    icon: ShoppingCart,
  },
  {
    id: 3,
    name: 'Electricity Bill — MSEDCL',
    category: 'Utilities',
    amount: 2150,
    type: 'debit',
    iconType: 'utility',
    date: '25 May',
    icon: Zap,
  },
  {
    id: 4,
    name: 'Home Loan EMI — SBI',
    category: 'EMI Payment',
    amount: 24500,
    type: 'debit',
    iconType: 'emi',
    date: '24 May',
    icon: CreditCard,
  },
  {
    id: 5,
    name: 'UPI to Rahul Verma',
    category: 'UPI Transfer',
    amount: 12000,
    type: 'debit',
    iconType: 'upi',
    date: '23 May',
    icon: Send,
    anomaly: true,
    anomalyLabel: 'Unusual',
  },
];

const ONBOARDING_STEPS = [
  {
    icon: Target,
    title: 'Set Your Financial Goals',
    desc: 'Emergency fund, education, home — track them all in one place.',
    link: '/portal/goals',
    linkLabel: 'Set Goals',
  },
  {
    icon: Sparkles,
    title: 'Meet SAGE, Your AI Assistant',
    desc: 'Ask anything about budgeting, saving, or investing — in English or Hindi.',
    link: '/portal/sage',
    linkLabel: 'Open SAGE',
  },
  {
    icon: Shield,
    title: 'Review Privacy & Security',
    desc: 'Control what data is shared and set up biometric login.',
    link: '/portal/settings',
    linkLabel: 'Settings',
  },
  {
    icon: BookOpen,
    title: 'Explore Financial Literacy',
    desc: 'Learn key concepts with our jargon-free guides.',
    link: '/portal/trust',
    linkLabel: 'Start Learning',
  },
];


const LABELS = {
  EN: {
    totalSavings: 'Total Savings',
    upThisMonth: 'this month',
    upPrefix: 'Up ',
    fdEarnings: 'FD Earnings',
    earningRate: 'Earning',
    pa: 'p.a.',
    activeSips: 'Active SIPs',
    active: 'Active',
    nextDebit: 'Next debit',
    mo: 'mo',
    priorityActions: 'Priority Actions',
    items: 'items',
    askSage: 'Ask SAGE Anything',
    aiAssistant: 'Your AI financial assistant — always available',
    wellbeingStatus: 'Financial Wellbeing',
    fullBreakdown: 'Full breakdown',
    recentActivity: 'Recent Activity',
    viewAll: 'View all',
    whyWeHelp: "We're here to help",
    stressDesc: "We noticed some financial pressure. This is completely normal and there are options available to you. Whether it's restructuring an EMI, extending a deadline, or just talking through your finances — you're not alone.",
    talkSage: 'Talk to SAGE',
    callSupport: 'Call Support',
    viewOptions: 'View Options',
    welcomeBack: 'Welcome back',
    missed: "here's what you missed.",
    days: 'days',
    todaySnapshot: "Here's your financial snapshot for today.",
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    welcomeTrustEdge: "Welcome to TrustEdge! Let's get started",
    allSet: 'All set — go to dashboard',
    whileAway: 'While You Were Away',
    unusual: 'Unusual',
    // Onboarding steps titles and descriptions
    onboardTitle1: 'Set Your Financial Goals',
    onboardDesc1: 'Emergency fund, education, home — track them all in one place.',
    onboardLink1: 'Set Goals',
    onboardTitle2: 'Meet SAGE, Your AI Assistant',
    onboardDesc2: 'Ask anything about budgeting, saving, or investing — in English or Hindi.',
    onboardLink2: 'Open SAGE',
    onboardTitle3: 'Review Privacy & Security',
    onboardDesc3: 'Control what data is shared and set up biometric login.',
    onboardLink3: 'Settings',
    onboardTitle4: 'Explore Financial Literacy',
    onboardDesc4: 'Learn key concepts with our jargon-free guides.',
    onboardLink4: 'Start Learning',
    // Wellbeing status labels
    wellbeingGood: 'Good',
    wellbeingWatch: 'Watch',
    wellbeingAttention: 'Needs Attention',
    wellbeingGoodDesc: 'Spending is within budget. Savings are on track. No missed payments.',
    wellbeingWatchDesc: 'Spending is slightly above budget this month. Consider reviewing discretionary expenses.',
    wellbeingAttentionDesc: 'Missed payment detected. Savings dipping below recommended threshold.',
    // Priority actions titles and descriptions
    actionTitle1: 'FD Maturing on 12 June — ₹3,50,000',
    actionDesc1: 'Your 1-year Fixed Deposit at 6.8% p.a. matures in 16 days. Choose how to reinvest or withdraw your corpus.',
    actionLabel1_1: 'Renew FD',
    actionLabel1_2: 'Start SIP Instead',
    actionLabel1_3: 'Transfer to Savings',
    actionTitle2: 'Salary Credited — ₹85,000',
    actionDesc2: 'Your salary from TCS Ltd was credited today. Based on your spending pattern, SAGE recommends saving ₹22,000 this month.',
    actionLabel2_1: 'View Breakdown',
    actionLabel2_2: 'Ask SAGE',
    actionTitle3: 'Tax Saving Reminder — ₹42,000 remaining under 80C',
    actionDesc3: "You've claimed ₹1,08,000 of ₹1,50,000 under Section 80C. Invest ₹42,000 in ELSS SIP before 31 March to maximize your deduction.",
    actionLabel3_1: 'Explore ELSS Funds',
    actionLabel3_2: 'Ask SAGE',
    actionLabel3_3: 'Dismiss',
    // Inactivity summaries
    inactivity1: 'FD Interest Earned',
    inactivity2: 'SIP Investments (auto)',
    inactivity3: 'Bills Auto-Paid',
    inactivity4: 'New Offer Available',
    inactivityVal4: '7.2% FD',
    // Sage suggestions
    suggest1: 'How can I save more this month?',
    suggest2: 'What happens when my FD matures?',
    suggest3: 'How do I start an SIP?',
    suggest4: "I'm having trouble paying my EMI",
  },
  HI: {
    totalSavings: 'कुल बचत',
    upThisMonth: 'इस महीने',
    upPrefix: 'बढ़े ',
    fdEarnings: 'सावधि जमा (FD) कमाई',
    earningRate: 'कमाई जारी',
    pa: 'प्रति वर्ष',
    activeSips: 'सक्रिय एसआईपी (SIP)',
    active: 'सक्रिय',
    nextDebit: 'अगला डेबिट',
    mo: 'माह',
    priorityActions: 'प्राथमिकता कार्रवाई',
    items: 'आइटम',
    askSage: 'सेज (SAGE) से कुछ भी पूछें',
    aiAssistant: 'आपका एआई वित्तीय सहायक — हमेशा उपलब्ध',
    wellbeingStatus: 'वित्तीय सेहत',
    fullBreakdown: 'पूर्ण विश्लेषण',
    recentActivity: 'हाल की गतिविधि',
    viewAll: 'सभी देखें',
    whyWeHelp: 'हम यहाँ आपकी मदद के लिए हैं',
    stressDesc: 'हमने कुछ वित्तीय दबाव देखा है। यह पूरी तरह से सामान्य है और आपके लिए विकल्प उपलब्ध हैं। चाहे वह EMI का पुनर्गठन करना हो, समय सीमा बढ़ाना हो, या केवल आपके वित्त के बारे में बात करना हो - आप अकेले नहीं हैं।',
    talkSage: 'सेज (SAGE) से बात करें',
    callSupport: 'सहायता के लिए कॉल करें',
    viewOptions: 'विकल्प देखें',
    welcomeBack: 'स्वागत है',
    missed: 'यहाँ वह सब है जो आप चूक गए।',
    days: 'दिन',
    todaySnapshot: 'यहाँ आज की आपकी वित्तीय स्थिति है।',
    goodMorning: 'शुभ प्रभात',
    goodAfternoon: 'शुभ दोपहर',
    goodEvening: 'शुभ संध्या',
    welcomeTrustEdge: 'ट्रस्टएज में आपका स्वागत है! आइए शुरू करें',
    allSet: 'सब तैयार है — डैशबोर्ड पर जाएं',
    whileAway: 'जब आप अनुपस्थित थे',
    unusual: 'असामान्य',
    onboardTitle1: 'अपने वित्तीय लक्ष्य निर्धारित करें',
    onboardDesc1: 'आपातकालीन निधि, शिक्षा, घर — सभी को एक ही स्थान पर ट्रैक करें।',
    onboardLink1: 'लक्ष्य निर्धारित करें',
    onboardTitle2: 'सेज से मिलें, आपका एआई सहायक',
    onboardDesc2: 'बजट, बचत या निवेश के बारे में कुछ भी पूछें — अंग्रेजी या हिंदी में।',
    onboardLink2: 'सेज खोलें',
    onboardTitle3: 'गोपनीयता और सुरक्षा की समीक्षा करें',
    onboardDesc3: 'नियंत्रित करें कि कौन सा डेटा साझा किया जाता है और बायोमेट्रिक लॉगिन सेट करें।',
    onboardLink3: 'सेटिंग्स',
    onboardTitle4: 'वित्तीय साक्षरता का पता लगाएं',
    onboardDesc4: 'हमारी आसान गाइड के साथ प्रमुख अवधारणाओं को समझें।',
    onboardLink4: 'सीखना शुरू करें',
    wellbeingGood: 'अच्छा',
    wellbeingWatch: 'निगरानी रखें',
    wellbeingAttention: 'ध्यान देने की आवश्यकता है',
    wellbeingGoodDesc: 'खर्च बजट के भीतर है। बचत सही रास्ते पर है। कोई भुगतान छूटा नहीं है।',
    wellbeingWatchDesc: 'इस महीने खर्च बजट से थोड़ा अधिक है। गैर-जरूरी खर्चों की समीक्षा करने पर विचार करें।',
    wellbeingAttentionDesc: 'भुगतान छूटने का पता चला। बचत अनुशंसित सीमा से नीचे जा रही है।',
    actionTitle1: '12 जून को परिपक्व होने वाली FD — ₹3,50,000',
    actionDesc1: '6.8% प्रति वर्ष की दर से आपकी 1-वर्षीय सावधि जमा 16 दिनों में परिपक्व हो रही है। पुनर्निवेश या निकासी का विकल्प चुनें।',
    actionLabel1_1: 'FD नवीनीकृत करें',
    actionLabel1_2: 'इसके बजाय SIP शुरू करें',
    actionLabel1_3: 'बचत खाते में स्थानांतरित करें',
    actionTitle2: 'वेतन जमा — ₹85,000',
    actionDesc2: 'TCS लिमिटेड से आपका वेतन आज जमा किया गया। आपके खर्च के पैटर्न के आधार पर, सेज इस महीने ₹22,000 की बचत की सिफारिश करता है।',
    actionLabel2_1: 'विश्लेषण देखें',
    actionLabel2_2: 'सेज से पूछें',
    actionTitle3: 'टैक्स बचत अनुस्मारक — 80C के तहत ₹42,000 शेष',
    actionDesc3: 'आपने धारा 80C के तहत ₹1,50,000 में से ₹1,08,000 का दावा किया है। अपनी टैक्स कटौती को अधिकतम करने के लिए 31 मार्च से पहले ELSS SIP में ₹42,000 निवेश करें।',
    actionLabel3_1: 'ELSS फंड खोजें',
    actionLabel3_2: 'सेज से पूछें',
    actionLabel3_3: 'खारिज करें',
    inactivity1: 'अर्जित FD ब्याज',
    inactivity2: 'SIP निवेश (ऑटो)',
    inactivity3: 'बिलों का ऑटो-भुगतान',
    inactivity4: 'नया ऑफ़र उपलब्ध',
    inactivityVal4: '7.2% FD दर',
    suggest1: 'मैं इस महीने अधिक बचत कैसे कर सकता हूँ?',
    suggest2: 'मेरी FD परिपक्व होने पर क्या होता है?',
    suggest3: 'मैं एसआईपी (SIP) कैसे शुरू करूँ?',
    suggest4: 'मुझे अपनी ईएमआई (EMI) चुकाने में परेशानी हो रही है',
  }
};

// ═══════════════════════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════════════════════

/* ── Greeting ───────────────────────────────────────────── */
function Greeting({ isReturnState, daysSince, customerLang, customer = CUSTOMER }) {
  const label = LABELS[customerLang] || LABELS.EN;
  const greetingKey = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'goodMorning';
    if (h < 17) return 'goodAfternoon';
    return 'goodEvening';
  }, []);
  const greetingText = label[greetingKey];
  
  const dateStr = useMemo(() => {
    return new Date().toLocaleDateString(customerLang === 'HI' ? 'hi-IN' : 'en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [customerLang]);

  return (
    <div className="cp-greeting cp-section">
      <div className="cp-greeting-text">
        <h2>
          {isReturnState
            ? `${label.welcomeBack}, ${customer.name}! 🎉`
            : `${greetingText}, ${customer.name} 👋`}
        </h2>
        <p>
          {isReturnState
            ? `${label.welcomeBack} ${daysSince} ${label.days} — ${label.missed}`
            : label.todaySnapshot}
        </p>
      </div>
      <div className="cp-greeting-date">
        <Calendar size={15} />
        {dateStr}
      </div>
    </div>
  );
}

/* ── Financial Snapshot ─────────────────────────────────── */
function FinancialSnapshot({ customerLang, customer = CUSTOMER }) {
  const label = LABELS[customerLang] || LABELS.EN;
  return (
    <div className="cp-financial-snapshot cp-section">
      {/* Savings */}
      <div className="cp-snapshot-card savings">
        <div className="cp-snapshot-header">
          <div className="cp-snapshot-icon blue">
            <Wallet size={20} />
          </div>
          <span className="cp-trend-indicator up">
            <ArrowUpRight size={13} />
            {formatINR(customer.savingsChange)}
          </span>
        </div>
        <div className="cp-snapshot-label">{label.totalSavings}</div>
        <div className="cp-snapshot-value">{formatINR(customer.totalSavings)}</div>
        <div className="cp-snapshot-meta">
          <TrendingUp size={13} />
          {customerLang === 'HI'
            ? `${label.upPrefix}${formatINR(customer.savingsChange)} ${label.upThisMonth}`
            : `${label.upPrefix}${formatINR(customer.savingsChange)} ${label.upThisMonth}`}
        </div>
      </div>

      {/* FD Earnings */}
      <div className="cp-snapshot-card fd">
        <div className="cp-snapshot-header">
          <div className="cp-snapshot-icon green">
            <Landmark size={20} />
          </div>
          <span className="badge badge-green">{label.earningRate}</span>
        </div>
        <div className="cp-snapshot-label">{label.fdEarnings}</div>
        <div className="cp-snapshot-value">{formatINR(customer.fdEarnings)}</div>
        <div className="cp-snapshot-meta">
          <Activity size={13} />
          {customerLang === 'HI'
            ? `${label.earningRate} ${customer.fdRate}% ${label.pa}`
            : `${label.earningRate} ${customer.fdRate}% ${label.pa}`}
        </div>
      </div>

      {/* Active SIPs */}
      <div className="cp-snapshot-card sip">
        <div className="cp-snapshot-header">
          <div className="cp-snapshot-icon purple">
            <BarChart3 size={20} />
          </div>
          <span className="badge badge-purple">{label.active}</span>
        </div>
        <div className="cp-snapshot-label">{label.activeSips}</div>
        <div className="cp-snapshot-value">{customer.activeSIPs}</div>
        <div className="cp-snapshot-meta">
          <Clock size={13} />
          {customerLang === 'HI'
            ? `${label.nextDebit}: ${customer.nextSIPDebit === '5th June' ? '5 जून' : customer.nextSIPDebit} · ${formatINR(customer.sipMonthlyTotal)}/${label.mo}`
            : `Next debit: ${customer.nextSIPDebit} · ${formatINR(customer.sipMonthlyTotal)}/mo`}
        </div>
      </div>
    </div>
  );
}

/* ── Priority Actions ───────────────────────────────────── */
function PriorityActions({ isStressMode, customerLang, actions = PRIORITY_ACTIONS }) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState([]);
  const label = LABELS[customerLang] || LABELS.EN;

  // In stress mode, hide promotional actions — only show urgent/essential
  const visibleActions = actions.filter((a) => {
    if (dismissed.includes(a.id)) return false;
    if (isStressMode && a.type === 'warning') return false; // hide promotional in stress
    return true;
  });

  if (visibleActions.length === 0) return null;

  return (
    <div className="cp-section">
      <div className="cp-section-header">
        <Bell size={18} style={{ color: 'var(--accent-yellow)' }} />
        <h3>{label.priorityActions}</h3>
        <span className="badge badge-yellow">{visibleActions.length} {label.items}</span>
      </div>
      <div className="cp-priority-grid">
        {visibleActions.map((action) => {
          const Icon = action.icon;

          // Translate fields dynamically
          let title = action.title;
          let description = action.description;
          let buttons = action.actions;

          if (customerLang === 'HI') {
            if (action.id === 1) {
              title = label.actionTitle1;
              description = label.actionDesc1;
              buttons = [
                { label: label.actionLabel1_1, variant: 'btn-primary' },
                { label: label.actionLabel1_2, variant: 'btn-secondary' },
                { label: label.actionLabel1_3, variant: 'btn-ghost' },
              ];
            } else if (action.id === 2) {
              title = label.actionTitle2;
              description = label.actionDesc2;
              buttons = [
                { label: label.actionLabel2_1, variant: 'btn-primary' },
                { label: label.actionLabel2_2, variant: 'btn-secondary' },
              ];
            } else if (action.id === 3) {
              title = label.actionTitle3;
              description = label.actionDesc3;
              buttons = [
                { label: label.actionLabel3_1, variant: 'btn-primary' },
                { label: label.actionLabel3_2, variant: 'btn-secondary' },
                { label: label.actionLabel3_3, variant: 'btn-ghost' },
              ];
            }
          }

          return (
            <div key={action.id} className={`cp-priority-card ${action.type}`}>
              <div className={`cp-priority-icon ${action.iconColor}`}>
                <Icon size={22} />
              </div>
              <div className="cp-priority-body">
                <div className="cp-priority-title">{title}</div>
                <div className="cp-priority-desc">{description}</div>
                <div className="cp-priority-actions">
                  {buttons.map((btn, i) => (
                    <button
                      key={i}
                      className={`btn ${btn.variant}`}
                      onClick={() => {
                        if (action.actions[i].label === 'Dismiss' || btn.label === 'Dismiss' || btn.label === 'खारिज करें') {
                            setDismissed((p) => [...p, action.id]);
                        } else if (btn.label.includes('Ask SAGE') || btn.label.includes('सेज से पूछें')) {
                            navigate('/portal/sage');
                        }
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── SAGE Quick-Start ───────────────────────────────────── */
function SageQuickStart({ customerLang }) {
  const navigate = useNavigate();
  const label = LABELS[customerLang] || LABELS.EN;

  const handleChipClick = (text) => {
    navigate('/portal/sage', { state: { initialMessage: text } });
  };

  const suggestions = customerLang === 'HI' ? [
    { text: label.suggest1, icon: PiggyBank },
    { text: label.suggest2, icon: HelpCircle },
    { text: label.suggest3, icon: BarChart3 },
    { text: label.suggest4, icon: AlertTriangle },
  ] : SAGE_SUGGESTIONS;

  return (
    <div className="cp-sage-quickstart cp-section">
      <div className="cp-sage-header">
        <div className="cp-sage-icon">
          <Sparkles size={20} />
        </div>
        <div className="cp-sage-header-text">
          <h3>{label.askSage}</h3>
          <p>{label.aiAssistant}</p>
        </div>
      </div>
      <div className="cp-sage-chips">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              className="cp-sage-chip"
              onClick={() => handleChipClick(s.text)}
            >
              <Icon size={16} />
              {s.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Financial Wellbeing Pulse ──────────────────────────── */
function WellbeingPulse({ customerLang, customer = CUSTOMER }) {
  const label = LABELS[customerLang] || LABELS.EN;
  const level = customer.stressLevel;

  const statusMap = {
    LOW: { class: 'good', emoji: '🟢', label: customerLang === 'HI' ? label.wellbeingGood : 'Good', color: 'good' },
    MODERATE: { class: 'watch', emoji: '🟡', label: customerLang === 'HI' ? label.wellbeingWatch : 'Watch', color: 'watch' },
    HIGH: { class: 'attention', emoji: '🔴', label: customerLang === 'HI' ? label.wellbeingAttention : 'Needs Attention', color: 'attention' },
    CRITICAL: { class: 'attention', emoji: '🔴', label: customerLang === 'HI' ? label.wellbeingAttention : 'Needs Attention', color: 'attention' },
  };
  const status = statusMap[level] || statusMap.LOW;

  const descMap = {
    LOW: label.wellbeingGoodDesc,
    MODERATE: label.wellbeingWatchDesc,
    HIGH: label.wellbeingAttentionDesc,
    CRITICAL: label.wellbeingAttentionDesc,
  };

  return (
    <div className={`cp-wellbeing-pulse ${status.class} cp-section`}>
      <div className={`cp-wellbeing-dot ${status.class}`}>
        <span>{status.emoji}</span>
      </div>
      <div className="cp-wellbeing-body">
        <div className="cp-wellbeing-status">
          <h4 className={status.color}>{label.wellbeingStatus} — {status.label}</h4>
        </div>
        <div className="cp-wellbeing-desc">{descMap[level]}</div>
      </div>
      <Link to="/portal/finances" className="cp-wellbeing-link">
        {label.fullBreakdown}
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}

/* ── Recent Activity ────────────────────────────────────── */
function RecentActivity({ customerLang, transactions = RECENT_TRANSACTIONS }) {
  const label = LABELS[customerLang] || LABELS.EN;

  const txns = transactions.map(txn => {
    if (customerLang === 'HI') {
      let name = txn.name;
      let category = txn.category;
      if (txn.name.startsWith('Salary')) {
        name = 'वेतन — टीसीएस लिमिटेड';
        category = 'वेतन क्रेडिट';
      } else if (txn.name.includes('Groceries') || txn.name.includes('DMart')) {
        name = 'डीमार्ट किराना';
        category = 'किराना';
      } else if (txn.name.includes('Electricity')) {
        name = 'बिजली बिल — MSEDCL';
        category = 'उपयोगिताएँ';
      } else if (txn.name.includes('Home Loan')) {
        name = 'गृह ऋण ईएमआई — एसबीआई';
        category = 'ईएमआई भुगतान';
      } else if (txn.name.includes('UPI') || txn.name.includes('Transfer')) {
        name = 'राहुल वर्मा को यूपीआई';
        category = 'यूपीआई ट्रांसफर';
      }
      return { ...txn, name, category };
    }
    return txn;
  });

  return (
    <div className="cp-recent-activity cp-section">
      <div className="cp-recent-header">
        <h3>
          <Activity size={18} />
          {label.recentActivity}
        </h3>
        <Link to="/portal/finances" className="cp-recent-link">
          {label.viewAll}
          <ArrowRight size={14} />
        </Link>
      </div>
      <ul className="cp-txn-list">
        {txns.map((txn) => {
          const Icon = txn.icon;
          return (
            <li key={txn.id} className="cp-txn-item">
              <div className={`cp-txn-icon ${txn.iconType}`}>
                <Icon size={18} />
              </div>
              <div className="cp-txn-details">
                <div className="cp-txn-name">
                  {txn.name}
                  {txn.anomaly && (
                    <span className="cp-txn-anomaly">
                      <AlertTriangle size={11} />
                      {label.unusual}
                    </span>
                  )}
                </div>
                <div className="cp-txn-category">{txn.category}</div>
              </div>
              <div className={`cp-txn-amount ${txn.type}`}>
                {txn.type === 'credit' ? '+' : '−'}
                {formatINR(txn.amount)}
              </div>
              <div className="cp-txn-date">{customerLang === 'HI' ? txn.date.replace('May', 'मई').replace('Jun', 'जून') : txn.date}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Stress Support Card ────────────────────────────────── */
function StressSupportCard({ onDismiss, customerLang }) {
  const navigate = useNavigate();
  const label = LABELS[customerLang] || LABELS.EN;

  return (
    <div className="cp-stress-support-card cp-section">
      <button className="cp-stress-dismiss" onClick={onDismiss} title="Dismiss">
        <X size={14} />
      </button>
      <div className="cp-stress-header">
        <div className="cp-stress-icon">
          <HandHeart size={20} />
        </div>
        <div>
          <div className="cp-stress-title">{label.whyWeHelp}</div>
        </div>
      </div>
      <div className="cp-stress-desc">
        {label.stressDesc}
      </div>
      <div className="cp-stress-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigate('/portal/sage', { state: { initialMessage: customerLang === 'HI' ? "मुझे अपने वित्त के साथ संघर्ष करना पड़ रहा है और मदद की ज़रूरत है" : "I'm struggling with my finances and need help" } })}
        >
          <MessageCircle size={15} />
          {label.talkSage}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/portal/support')}
        >
          <Phone size={15} />
          {label.callSupport}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => navigate('/portal/stress-support')}
        >
          <Heart size={15} />
          {label.viewOptions}
        </button>
      </div>
    </div>
  );
}

/* ── First Login Onboarding ─────────────────────────────── */
function OnboardingFlow({ onComplete, customerLang }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const navigate = useNavigate();
  const label = LABELS[customerLang] || LABELS.EN;

  const handleStep = (step, index) => {
    setCompletedSteps((prev) => [...new Set([...prev, index])]);
    navigate(step.link);
  };

  const steps = customerLang === 'HI' ? [
    { icon: Target, title: label.onboardTitle1, desc: label.onboardDesc1, link: '/portal/goals', linkLabel: label.onboardLink1 },
    { icon: Sparkles, title: label.onboardTitle2, desc: label.onboardDesc2, link: '/portal/sage', linkLabel: label.onboardLink2 },
    { icon: Shield, title: label.onboardTitle3, desc: label.onboardDesc3, link: '/portal/settings', linkLabel: label.onboardLink3 },
    { icon: BookOpen, title: label.onboardTitle4, desc: label.onboardDesc4, link: '/portal/trust', linkLabel: label.onboardLink4 },
  ] : ONBOARDING_STEPS;

  const allDone = completedSteps.length >= steps.length;

  return (
    <div className="cp-section" style={{ animation: 'cpFadeInUp 0.6s ease' }}>
      <div className="cp-section-header">
        <Gift size={18} style={{ color: 'var(--accent-purple)' }} />
        <h3>{label.welcomeTrustEdge}</h3>
        <span className="badge badge-purple">{completedSteps.length}/{steps.length}</span>
      </div>

      {/* Progress bar */}
      <div className="cp-progress-bar" style={{ marginBottom: 20 }}>
        <div
          className="cp-progress-fill purple"
          style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
        />
      </div>

      <div className="cp-grid-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const done = completedSteps.includes(i);
          return (
            <div
              key={i}
              className="cp-goal-template"
              onClick={() => handleStep(step, i)}
              style={{
                opacity: done ? 0.6 : 1,
                pointerEvents: done ? 'none' : 'auto',
              }}
            >
              <div
                className="cp-goal-template-icon"
                style={{
                  backgroundColor: done
                    ? 'var(--accent-green-soft)'
                    : 'rgba(139, 92, 246, 0.15)',
                  color: done ? 'var(--accent-green)' : 'var(--accent-purple)',
                }}
              >
                {done ? <CheckCircle2 size={22} /> : <Icon size={22} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {step.desc}
                </div>
              </div>
              {!done && <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button className="btn btn-primary" onClick={onComplete}>
            <CheckCircle2 size={16} />
            {label.allSet}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Post-Inactivity Summary ────────────────────────────── */
function InactivitySummary({ daysSince, customerLang, customer = CUSTOMER }) {
  const label = LABELS[customerLang] || LABELS.EN;
  const changes = customerLang === 'HI' ? [
    { label: label.inactivity1, value: formatINR(1840), positive: true },
    { label: label.inactivity2, value: formatINR(customer.sipMonthlyTotal), positive: true },
    { label: label.inactivity3, value: formatINR(6320), positive: false },
    { label: label.inactivity4, value: label.inactivityVal4, positive: true },
  ] : [
    { label: 'FD Interest Earned', value: formatINR(1840), positive: true },
    { label: 'SIP Investments (auto)', value: formatINR(customer.sipMonthlyTotal), positive: true },
    { label: 'Bills Auto-Paid', value: formatINR(6320), positive: false },
    { label: 'New Offer Available', value: '7.2% FD', positive: true },
  ];

  return (
    <div className="cp-section" style={{ animation: 'cpFadeInUp 0.5s ease' }}>
      <div className="cp-section-header">
        <RefreshCw size={18} style={{ color: 'var(--accent-cyan)' }} />
        <h3>{label.whileAway} ({daysSince} {customerLang === 'HI' ? label.days : 'days'})</h3>
      </div>
      <div className="cp-grid-2">
        {changes.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {item.label}
            </span>
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: item.positive ? 'var(--accent-green)' : 'var(--text-primary)',
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Main Page Export
// ═══════════════════════════════════════════════════════════

import { portalAPI } from '../../api';

export default function CustomerHomePage() {
  const context = useOutletContext();
  const customerLang = context?.customerLang || 'EN';

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await portalAPI.getDashboard();
        if (res.data?.data) {
          setDashboardData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch portal dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Determine page state from API if available, else mock
  const currentStressLevel = dashboardData?.financialSnapshot?.stressLevel || CUSTOMER.stressLevel;
  const currentIsFirstLogin = CUSTOMER.isFirstLogin;
  const currentLastLoginDaysAgo = CUSTOMER.lastLoginDaysAgo;

  const [showStressCard, setShowStressCard] = useState(
    currentStressLevel === 'HIGH' || currentStressLevel === 'MODERATE'
  );
  const [isFirstLogin, setIsFirstLogin] = useState(currentIsFirstLogin);
  const isReturnState = currentLastLoginDaysAgo > 7;
  const isStressMode = currentStressLevel === 'HIGH';

  // Map API Recent Transactions to UI format
  const mappedTransactions = dashboardData?.recentTransactions?.map((t, idx) => {
    let icon = CreditCard;
    let iconType = 'debit';
    if (t.type === 'CREDIT') {
      icon = Building2; iconType = 'credit';
    } else if (t.category === 'Food' || t.category === 'Dining') {
      icon = ShoppingCart;
    } else if (t.category === 'Shopping') {
      icon = ShoppingCart;
    } else if (t.category === 'Transfer') {
      icon = Send; iconType = 'upi';
    } else if (t.category === 'Bills') {
      icon = Zap; iconType = 'utility';
    }
    
    return {
      id: t.id || idx,
      name: t.description || t.category || 'Transaction',
      category: t.category || 'Other',
      amount: t.amount,
      type: t.type === 'CREDIT' ? 'credit' : 'debit',
      iconType,
      date: new Date(t.transactionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      icon,
      anomaly: t.amount > 10000 && t.type === 'DEBIT' // simple mock anomaly detection
    };
  }) || RECENT_TRANSACTIONS;

  // Map API Priority Actions to UI format
  const mappedPriorityActions = dashboardData?.priorityActions?.map((a, idx) => {
    return {
      id: idx + 100,
      type: a.type === 'ALERT' ? 'urgent' : a.type === 'WARNING' ? 'warning' : 'info',
      iconColor: a.type === 'ALERT' ? 'red' : a.type === 'WARNING' ? 'yellow' : 'green',
      icon: a.type === 'ALERT' ? AlertTriangle : a.type === 'WARNING' ? Landmark : Bell,
      title: a.title,
      description: a.description,
      actions: [
        { label: 'View Details', variant: 'btn-primary' }
      ]
    };
  }) || PRIORITY_ACTIONS;

  const finalPriorityActions = dashboardData?.priorityActions?.length > 0 ? mappedPriorityActions : PRIORITY_ACTIONS;

  const dynamicCustomer = dashboardData ? {
    ...CUSTOMER,
    name: dashboardData.account?.name?.split(' ')[0] || CUSTOMER.name,
    fullName: dashboardData.account?.name || CUSTOMER.fullName,
    totalSavings: dashboardData.financialSnapshot?.currentBalance || CUSTOMER.totalSavings,
    stressLevel: currentStressLevel,
  } : CUSTOMER;

  if (loading) {
    return <div className="cp-page" style={{ padding: 40, textAlign: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div className="cp-page">
      {/* 1. Greeting */}
      <Greeting isReturnState={isReturnState} daysSince={currentLastLoginDaysAgo} customerLang={customerLang} customer={dynamicCustomer} />

      {/* Post-Inactivity Summary (when returning after >7 days) */}
      {isReturnState && <InactivitySummary daysSince={currentLastLoginDaysAgo} customerLang={customerLang} customer={dynamicCustomer} />}

      {/* First Login Onboarding */}
      {isFirstLogin && (
        <OnboardingFlow onComplete={() => setIsFirstLogin(false)} customerLang={customerLang} />
      )}

      {/* 2. Financial Snapshot */}
      <FinancialSnapshot customerLang={customerLang} customer={dynamicCustomer} />

      {/* 7. Stress Support Card (shown when stress detected, before priority actions) */}
      {showStressCard && (
        <StressSupportCard onDismiss={() => setShowStressCard(false)} customerLang={customerLang} />
      )}

      {/* 3. Priority Actions */}
      <PriorityActions isStressMode={isStressMode} customerLang={customerLang} actions={finalPriorityActions} />


      {/* 5. Financial Wellbeing Pulse */}
      <WellbeingPulse customerLang={customerLang} customer={dynamicCustomer} />

      {/* 6. Recent Activity */}
      <RecentActivity customerLang={customerLang} transactions={mappedTransactions} />
    </div>
  );
}
