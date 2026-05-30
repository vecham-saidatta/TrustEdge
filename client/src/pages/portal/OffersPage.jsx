import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PORTAL_TRANSLATIONS } from '../../translations';
import {
  Gift, Clock, CheckCircle2, XCircle, MessageSquare, ChevronDown, ChevronUp,
  Percent, Info, Shield, Sparkles, TrendingUp, CreditCard, PiggyBank,
  ArrowRight, RotateCcw, Eye, Bookmark, Star, BadgeCheck, Timer, X,
  IndianRupee, BarChart3, FileText, AlertCircle, ThumbsDown
} from 'lucide-react';
import './customer-portal.css';

/* ── Utility ─────────────────────────────────────────────── */
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

/* ── Mock Offers ─────────────────────────────────────────── */
const INITIAL_OFFERS = [
  {
    id: 'off-1',
    tab: 'New',
    type: 'Fixed Deposit',
    headline: 'Special FD Rate — 7.25% p.a.',
    icon: PiggyBank,
    color: '#3b82f6',
    gradientFrom: 'rgba(59,130,246,0.12)',
    gradientTo: 'rgba(6,182,212,0.06)',
    thisRate: 7.25,
    standardRate: 6.80,
    benchmark: 6.75,
    benchmarkName: 'SBI FD Rate',
    principalExample: 100000,
    tenureExample: '2 years',
    maturityAmount: 115456,
    calculationText: `${formatINR(100000)} for 2 years → ${formatINR(115456)} (vs ${formatINR(114109)} at standard rate)`,
    conditions: [
      'Minimum deposit of ₹25,000',
      'Available for new FD bookings only — not on renewal',
      'Interest rate locked for full tenure — no mid-term revision',
      'Auto-renewal at prevailing standard rate unless you opt out',
      'Premature withdrawal allowed with 1% penalty on applicable rate',
    ],
    feesStatement: 'Zero hidden fees. No processing charges. No account maintenance charges.',
    targetingReason: 'Your FD of ₹3,50,000 matures on June 18, 2026. You also have ₹2,84,320 idle in savings earning only 3.5%. This special rate is 0.45% higher than our standard and 0.50% above SBI\'s current rate.',
    expiryDate: '2026-06-03',
    expiresIn: '4 days',
    seen: false,
  },
  {
    id: 'off-2',
    tab: 'New',
    type: 'Personal Loan',
    headline: 'Pre-Approved Personal Loan at 11.5% p.a.',
    icon: IndianRupee,
    color: '#10b981',
    gradientFrom: 'rgba(16,185,129,0.12)',
    gradientTo: 'rgba(52,211,153,0.06)',
    thisRate: 11.5,
    standardRate: 14.0,
    benchmark: 12.0,
    benchmarkName: 'Market Average',
    principalExample: 300000,
    tenureExample: '24 months',
    maturityAmount: null,
    calculationText: `${formatINR(300000)} at 11.5% for 24 months → EMI ${formatINR(14038)} (saves ${formatINR(2376)} vs market avg 12%)`,
    conditions: [
      'Pre-approved based on your salary and credit profile (CIBIL 782)',
      'No collateral or guarantor required',
      'Disbursal within 4 hours of acceptance to your savings account',
      'Part-prepayment allowed after 6 EMIs with zero penalty',
      'Loan tenure: 12 to 60 months, your choice',
    ],
    feesStatement: 'Processing fee: ₹999 (one-time, non-refundable). Zero prepayment penalty after 6 months. No hidden charges.',
    targetingReason: 'Your salary account shows consistent credits of ₹85,000/month for 14 consecutive months. Your CIBIL score (782) qualifies you for a preferential rate — 2.5% below our standard unsecured lending rate.',
    expiryDate: '2026-06-28',
    expiresIn: '29 days',
    seen: false,
  },
  {
    id: 'off-3',
    tab: 'Expiring Soon',
    type: 'Tax Saving',
    headline: 'ELSS Tax Saving SIP — Save up to ₹46,800',
    icon: BarChart3,
    color: '#8b5cf6',
    gradientFrom: 'rgba(139,92,246,0.12)',
    gradientTo: 'rgba(167,139,250,0.06)',
    thisRate: null,
    standardRate: null,
    benchmark: null,
    benchmarkName: null,
    principalExample: 150000,
    tenureExample: '3 year lock-in',
    maturityAmount: null,
    calculationText: '₹1,50,000 invested under Sec 80C → Saves ₹46,800 in taxes (at 30% slab + 4% cess). Average ELSS category return: 14.2% CAGR over 5 years.',
    conditions: [
      'Minimum SIP amount: ₹500/month (recommended: ₹12,500/month to max 80C)',
      'Mandatory lock-in period: 3 years from each SIP instalment',
      'Tax benefit under Section 80C — up to ₹1,50,000 per financial year',
      'Returns are market-linked and NOT guaranteed',
      'Dividends (if any) are taxable at your slab rate',
    ],
    feesStatement: 'No entry load. Exit load: Nil (after 3-year lock-in). Fund management fee (expense ratio) ~1.2% p.a. already deducted from NAV.',
    targetingReason: 'You\'ve utilized only ₹50,000 of your ₹1,50,000 Section 80C limit this FY (PF contributions). Starting ₹12,500/month ELSS SIP now could save you up to ₹31,200 in additional tax this year. Only 2 days remain before the March-end tax-saving window.',
    expiryDate: '2026-06-01',
    expiresIn: '2 days',
    seen: true,
  },
  {
    id: 'off-4',
    tab: 'Exploring',
    type: 'Credit Card',
    headline: 'Platinum Rewards Credit Card — 5X Points',
    icon: CreditCard,
    color: '#f59e0b',
    gradientFrom: 'rgba(245,158,11,0.12)',
    gradientTo: 'rgba(251,191,36,0.06)',
    thisRate: null,
    standardRate: null,
    benchmark: null,
    benchmarkName: null,
    principalExample: null,
    tenureExample: 'Annual',
    maturityAmount: null,
    calculationText: 'Your average monthly spend of ₹32,000 would earn 19,200 reward points/month → worth ~₹4,800/quarter in vouchers. 1% instant cashback on utility bills.',
    conditions: [
      'Annual fee: ₹1,499 (waived if you spend ₹2,00,000 or more in a year)',
      '5X reward points on online shopping, dining, and entertainment',
      '1% cashback on utility bill payments and grocery purchases',
      'Fuel surcharge waiver up to ₹200/month at all petrol pumps',
      'Complimentary domestic airport lounge access: 4 per quarter',
    ],
    feesStatement: 'Joining fee: ₹499 (adjusted against first month\'s reward points). No foreign currency markup below 2%. No charges for supplementary cards.',
    targetingReason: 'Your spending patterns show ₹18,000/month in online shopping and ₹8,000/month in dining — categories where this card offers 5X points. Your current card earns only 1X. Estimated additional benefit: ₹14,400/year.',
    expiryDate: '2026-06-15',
    expiresIn: '16 days',
    seen: true,
  },
  {
    id: 'off-5',
    tab: 'Accepted',
    type: 'Account Upgrade',
    headline: 'Savings Account Upgrade — Zero Balance Premium',
    icon: Star,
    color: '#06b6d4',
    gradientFrom: 'rgba(6,182,212,0.12)',
    gradientTo: 'rgba(34,211,238,0.06)',
    thisRate: null,
    standardRate: null,
    benchmark: null,
    benchmarkName: null,
    principalExample: null,
    tenureExample: 'Permanent',
    maturityAmount: null,
    calculationText: 'No minimum balance requirement (saves ₹500/quarter in non-maintenance charges) + free unlimited NEFT/RTGS/IMPS.',
    conditions: [
      'Salary account with 3+ months continuous credit history',
      'Free international Visa Signature debit card (ATM limit: ₹1,00,000/day)',
      'Airport lounge access: 2 complimentary visits per quarter',
      'Personal accident insurance cover: ₹10,00,000',
    ],
    feesStatement: 'Zero annual charges for first year. Year 2 onwards: ₹599/year (waivable on maintaining ₹25,000 AMB).',
    targetingReason: 'Your salary account qualifies for automatic premium upgrade at no cost based on 14 months of continuous salary credits.',
    expiryDate: null,
    expiresIn: null,
    seen: true,
    acceptedDate: '2026-05-15',
  },
  {
    id: 'off-6',
    tab: 'Declined',
    type: 'Home Loan',
    headline: 'Home Loan Balance Transfer — 8.65% p.a.',
    icon: FileText,
    color: '#64748b',
    gradientFrom: 'rgba(100,116,139,0.08)',
    gradientTo: 'rgba(148,163,184,0.04)',
    thisRate: 8.65,
    standardRate: 9.25,
    benchmark: 8.75,
    benchmarkName: 'HDFC Rate',
    principalExample: 2500000,
    tenureExample: '15 years remaining',
    maturityAmount: null,
    calculationText: 'Transfer ₹25,00,000 outstanding → Save ~₹1,800/month (₹3,24,000 over remaining tenure) compared to your current 9.1%.',
    conditions: [
      'Applicable for outstanding home loans above ₹10,00,000',
      'No prepayment charges on floating rate',
      'Property re-valuation required (bank bears cost)',
      'All existing insurance policies transferable',
    ],
    feesStatement: 'Processing fee: ₹5,000 + GST. No hidden charges. Legal & technical evaluation: Free.',
    targetingReason: 'Your current home loan at another bank is at 9.1%. Our rate of 8.65% could save you ₹1,800/month on your remaining balance.',
    expiryDate: null,
    expiresIn: null,
    seen: true,
    declinedDate: '2026-05-10',
    declineReason: 'Already have a better offer',
  },
];

const TAB_CONFIG = [
  { id: 'New', label: 'New', icon: Sparkles },
  { id: 'Expiring Soon', label: 'Expiring Soon', icon: Timer },
  { id: 'Exploring', label: 'Exploring', icon: Eye },
  { id: 'Accepted', label: 'Accepted', icon: CheckCircle2 },
  { id: 'Declined', label: 'Declined', icon: ThumbsDown },
];

const DECLINE_REASONS = [
  { id: 'rate', label: 'Rate not attractive enough' },
  { id: 'already', label: 'Already have a similar product' },
  { id: 'timing', label: 'Not the right time for me' },
  { id: 'conditions', label: 'Too many conditions / restrictions' },
  { id: 'other', label: 'Other reason' },
];

/* ── Acceptance Flow Steps ───────────────────────────────── */
const ACCEPTANCE_STEPS = [
  { step: 1, label: 'Review Terms', desc: 'Confirm you\'ve read all terms and conditions' },
  { step: 2, label: 'Verify Details', desc: 'We\'ll use your registered mobile and email' },
  { step: 3, label: 'eSign / OTP', desc: 'Authenticate with OTP sent to +91 98XXX XX210' },
  { step: 4, label: 'Confirmation', desc: 'You\'re all set! Offer activated instantly.' },
];

/* ══════════════════════════════════════════════════════════ */
export default function OffersPage() {
  const navigate = useNavigate();
  const { customerLang } = useOutletContext();
  const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

  const tabLabelKeyMap = {
    'New': 'tabNewOffers',
    'Expiring Soon': 'tabExpiringOffers',
    'Exploring': 'tabExploringOffers',
    'Accepted': 'tabAcceptedOffers',
    'Declined': 'tabDeclinedOffers'
  };

  const declineReasonKeyMap = {
    'rate': 'declineReasonRate',
    'already': 'declineReasonAlready',
    'timing': 'declineReasonTiming',
    'conditions': 'declineReasonConditions',
    'other': 'declineReasonOther'
  };

  const stepLabelKeyMap = {
    1: { label: 'acceptanceStep1Label', desc: 'acceptanceStep1Desc' },
    2: { label: 'acceptanceStep2Label', desc: 'acceptanceStep2Desc' },
    3: { label: 'acceptanceStep3Label', desc: 'acceptanceStep3Desc' },
    4: { label: 'acceptanceStep4Label', desc: 'acceptanceStep4Desc' },
  };

  const [offers, setOffers] = useState(INITIAL_OFFERS);
  const [activeTab, setActiveTab] = useState('New');
  const [expandedWhyId, setExpandedWhyId] = useState(null);
  const [expandedConditionsId, setExpandedConditionsId] = useState(null);
  const [decliningId, setDecliningId] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [acceptStep, setAcceptStep] = useState(1);

  useEffect(() => {
    import('../../api').then(({ portalAPI }) => {
        portalAPI.getOffers().then(res => {
            if (res.data?.data?.offers) {
                const apiOffers = res.data.data.offers.map(o => {
                    const typeMap = {
                        'FD': INITIAL_OFFERS[0],
                        'LOAN': INITIAL_OFFERS[1],
                        'SIP': INITIAL_OFFERS[2],
                        'CREDIT_CARD': INITIAL_OFFERS[3]
                    };
                    const template = typeMap[o.offerType] || INITIAL_OFFERS[0];
                    
                    return {
                        ...template, // Use rich visual fields (icon, colors, conditions, etc.)
                        id: o.id,    // Use real backend ID for actions
                        tab: o.action === 'ACCEPTED' ? 'Accepted' : 
                             o.action === 'DECLINED' ? 'Declined' : 
                             o.action === 'EXPLORING' ? 'Exploring' : 'New',
                        type: o.offerType || template.type,
                        headline: o.offerTitle || template.headline,
                        expiryDate: o.expiresAt ? new Date(o.expiresAt).toISOString().split('T')[0] : template.expiryDate,
                        expiresIn: o.expiresAt ? Math.max(0, Math.ceil((new Date(o.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))) + ' days' : template.expiresIn,
                        seen: !!o.viewedAt || o.action !== null,
                    };
                });
                if (apiOffers.length > 0) setOffers(apiOffers);
            }
        }).catch(err => console.error('Failed to fetch offers:', err));
    }).catch(() => {});
  }, []);

  /* ── Derived ─────────────────────────────────────────── */
  const tabCounts = TAB_CONFIG.reduce((acc, t) => {
    acc[t.id] = offers.filter(o => o.tab === t.id).length;
    return acc;
  }, {});

  const filtered = offers.filter(o => o.tab === activeTab);
  const totalUnread = offers.filter(o => !o.seen && o.tab === 'New').length;

  /* ── Handlers ────────────────────────────────────────── */
  const handleDecline = (offerId, reason) => {
    setOffers(prev => prev.map(o =>
      o.id === offerId ? { ...o, tab: 'Declined', declineReason: reason, declinedDate: new Date().toISOString().split('T')[0] } : o
    ));
    setDecliningId(null);
  };

  const handleReconsider = (offerId) => {
    setOffers(prev => prev.map(o =>
      o.id === offerId ? { ...o, tab: 'Exploring', declineReason: undefined, declinedDate: undefined } : o
    ));
  };

  const handleAcceptStart = (offerId) => {
    setAcceptingId(offerId);
    setAcceptStep(1);
  };

  const handleAcceptComplete = () => {
    setOffers(prev => prev.map(o =>
      o.id === acceptingId ? { ...o, tab: 'Accepted', acceptedDate: new Date().toISOString().split('T')[0] } : o
    ));
    setAcceptingId(null);
    setAcceptStep(1);
  };

  const markSeen = (offerId) => {
    setOffers(prev => prev.map(o =>
      o.id === offerId ? { ...o, seen: true } : o
    ));
  };

  /* ── Acceptance Flow Modal ───────────────────────────── */
  function AcceptanceFlow() {
    if (!acceptingId) return null;
    const offer = offers.find(o => o.id === acceptingId);
    if (!offer) return null;

    return (
      <div className="cp-offers-modal-overlay" onClick={() => setAcceptingId(null)}>
        <div className="cp-offers-modal" onClick={e => e.stopPropagation()}>
          <div className="cp-offers-modal-header">
            <h3>{t.acceptOffer}</h3>
            <button className="cp-offers-modal-close" onClick={() => setAcceptingId(null)}>
              <X size={18} />
            </button>
          </div>

          <div style={{ padding: '6px 0 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {offer.headline}
          </div>

          {/* Stepper */}
          <div className="cp-offers-stepper">
            {ACCEPTANCE_STEPS.map((s, i) => {
              const keys = stepLabelKeyMap[s.step];
              return (
                <div key={s.step} className={`cp-offers-step ${acceptStep >= s.step ? 'active' : ''} ${acceptStep === s.step ? 'current' : ''}`}>
                  <div className="cp-offers-step-dot">
                    {acceptStep > s.step ? <CheckCircle2 size={16} /> : <span>{s.step}</span>}
                  </div>
                  <div className="cp-offers-step-info">
                    <div className="cp-offers-step-label">{t[keys.label] || s.label}</div>
                    <div className="cp-offers-step-desc">{t[keys.desc] || s.desc}</div>
                  </div>
                  {i < ACCEPTANCE_STEPS.length - 1 && <div className="cp-offers-step-line" />}
                </div>
              );
            })}
          </div>

          <div className="cp-offers-modal-actions">
            {acceptStep < 4 ? (
              <>
                <button className="cp-btn cp-btn-secondary" onClick={() => acceptStep > 1 ? setAcceptStep(acceptStep - 1) : setAcceptingId(null)}>
                  {acceptStep === 1 ? t.cancel : `← ${t.back}`}
                </button>
                <button className="cp-btn cp-btn-primary" onClick={() => setAcceptStep(acceptStep + 1)}>
                  {acceptStep === 3 ? t.verifyConfirmBtn : t.continueBtn}
                </button>
              </>
            ) : (
              <button className="cp-btn cp-btn-primary" onClick={handleAcceptComplete} style={{ width: '100%' }}>
                <CheckCircle2 size={16} /> {t.doneViewProductsBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Offer Card ──────────────────────────────────────── */
  function OfferCard({ offer, index }) {
    const OfferIcon = offer.icon;
    const isExpired = offer.tab === 'Declined' || offer.tab === 'Accepted';

    return (
      <div
        className={`cp-offers-card ${isExpired ? 'cp-offers-card--muted' : ''}`}
        style={{
          '--offer-color': offer.color,
          '--offer-gradient-from': offer.gradientFrom,
          '--offer-gradient-to': offer.gradientTo,
          animationDelay: `${index * 0.08}s`,
        }}
        onMouseEnter={() => { if (!offer.seen) markSeen(offer.id); }}
      >
        {/* Unseen indicator */}
        {!offer.seen && <div className="cp-offers-unseen-dot" />}

        {/* Header row */}
        <div className="cp-offers-card-header">
          <div className="cp-offers-card-icon">
            <OfferIcon size={22} />
          </div>
          <div className="cp-offers-card-title-block">
            <div className="cp-offers-card-type">{offer.type}</div>
            <h3 className="cp-offers-card-headline">{offer.headline}</h3>
          </div>
          {offer.expiresIn && offer.tab !== 'Accepted' && offer.tab !== 'Declined' && (
            <div className={`cp-offers-expiry ${offer.expiresIn.includes('2 ') ? 'urgent' : ''}`}>
              <Clock size={13} />
              <span>{offer.expiresIn}</span>
            </div>
          )}
          {offer.tab === 'Accepted' && (
            <div className="cp-offers-status-badge accepted">
              <BadgeCheck size={14} /> {t.tabAcceptedOffers}
            </div>
          )}
          {offer.tab === 'Declined' && (
            <div className="cp-offers-status-badge declined">
              <XCircle size={14} /> {t.tabDeclinedOffers}
            </div>
          )}
        </div>

        {/* Rate comparison — only for rate-based offers */}
        {offer.thisRate && (
          <div className="cp-offers-rate-grid">
            <div className="cp-offers-rate-box cp-offers-rate-box--highlight">
              <div className="cp-offers-rate-label">{t.thisOfferLabel}</div>
              <div className="cp-offers-rate-value">{offer.thisRate}%</div>
              <div className="cp-offers-rate-tag">{t.bestTag}</div>
            </div>
            <div className="cp-offers-rate-box">
              <div className="cp-offers-rate-label">{t.ourStandardLabel}</div>
              <div className="cp-offers-rate-value">{offer.standardRate}%</div>
            </div>
            <div className="cp-offers-rate-box">
              <div className="cp-offers-rate-label">
                {offer.benchmarkName === 'SBI FD Rate' ? (customerLang === 'HI' ? 'एसबीआई एफडी दर' : 'SBI FD Rate') : offer.benchmarkName === 'Market Average' ? (customerLang === 'HI' ? 'बाजार औसत' : 'Market Average') : offer.benchmarkName}
              </div>
              <div className="cp-offers-rate-value">{offer.benchmark}%</div>
            </div>
          </div>
        )}

        {/* Real-money calculation */}
        <div className="cp-offers-calc">
          <TrendingUp size={16} />
          <span>{offer.calculationText}</span>
        </div>

        {/* Conditions toggle */}
        <button
          className="cp-offers-toggle-btn"
          onClick={() => setExpandedConditionsId(expandedConditionsId === offer.id ? null : offer.id)}
        >
          <FileText size={14} />
          {t.conditionsLabel}
          {expandedConditionsId === offer.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expandedConditionsId === offer.id && (
          <div className="cp-offers-conditions-panel">
            <ul className="cp-offers-conditions-list">
              {offer.conditions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Zero hidden fees */}
        <div className="cp-offers-fees">
          <CheckCircle2 size={14} />
          <span>{offer.feesStatement}</span>
        </div>

        {/* Why am I seeing this? */}
        <button
          className="cp-offers-toggle-btn cp-offers-toggle-btn--info"
          onClick={() => setExpandedWhyId(expandedWhyId === offer.id ? null : offer.id)}
        >
          <Info size={14} />
          {t.whySeeingThis}
          {expandedWhyId === offer.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expandedWhyId === offer.id && (
          <div className="cp-offers-why-panel">
            {offer.targetingReason}
          </div>
        )}

        {/* Action buttons — for active offers */}
        {offer.tab !== 'Accepted' && offer.tab !== 'Declined' && (
          <div className="cp-offers-actions">
            <button className="cp-btn cp-btn-primary cp-btn-sm" onClick={() => handleAcceptStart(offer.id)}>
              <CheckCircle2 size={14} /> {t.acceptOffer}
            </button>
            <button className="cp-btn cp-btn-secondary cp-btn-sm" onClick={() => navigate('/portal/sage')}>
              <MessageSquare size={14} /> {t.askSage}
            </button>
            <button
              className="cp-btn cp-btn-ghost cp-btn-sm"
              onClick={() => setDecliningId(decliningId === offer.id ? null : offer.id)}
            >
              <XCircle size={14} /> {t.notInterested}
            </button>
          </div>
        )}

        {/* Accepted info */}
        {offer.tab === 'Accepted' && offer.acceptedDate && (
          <div className="cp-offers-accepted-info">
            <CheckCircle2 size={14} />
            {t.acceptedOnLabel} {offer.acceptedDate}. {t.checkEmailConf}
          </div>
        )}

        {/* Declined info + reconsider */}
        {offer.tab === 'Declined' && (
          <div className="cp-offers-declined-info">
            <div className="cp-offers-declined-reason">
              <ThumbsDown size={13} />
              <span>
                {t.declinedLabel}
                {offer.declineReason ? `: ${
                  offer.declineReason === 'Rate not attractive enough' ? t.declineReasonRate :
                  offer.declineReason === 'Already have a similar product' ? t.declineReasonAlready :
                  offer.declineReason === 'Not the right time for me' ? t.declineReasonTiming :
                  offer.declineReason === 'Too many conditions / restrictions' ? t.declineReasonConditions :
                  offer.declineReason === 'Other reason' ? t.declineReasonOther :
                  offer.declineReason
                }` : ''}
              </span>
            </div>
            <button className="cp-btn cp-btn-secondary cp-btn-sm" onClick={() => handleReconsider(offer.id)}>
              <RotateCcw size={13} /> {t.reconsiderBtn}
            </button>
          </div>
        )}

        {/* Decline reason selector */}
        {decliningId === offer.id && (
          <div className="cp-offers-decline-panel">
            <div className="cp-offers-decline-title">
              {t.tellUsWhyDecline}
            </div>
            <div className="cp-offers-decline-options">
              {DECLINE_REASONS.map(r => (
                <button
                  key={r.id}
                  className="cp-offers-decline-option"
                  onClick={() => handleDecline(offer.id, r.label)}
                >
                  {t[declineReasonKeyMap[r.id]] || r.label}
                </button>
              ))}
            </div>
            <button
              className="cp-btn cp-btn-ghost cp-btn-sm"
              onClick={() => handleDecline(offer.id, null)}
              style={{ marginTop: 8 }}
            >
              {t.skipJustDecline}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="cp-page">
      <AcceptanceFlow />

      {/* Page header */}
      <div className="cp-section">
        <div className="cp-greeting">
          <div className="cp-greeting-text">
            <h2>{t.offersTitle}</h2>
            <p>{t.offersSubtitle}</p>
          </div>
          {totalUnread > 0 && (
            <div className="cp-offers-unread-badge">
              <Gift size={15} />
              <span>
                {totalUnread} {totalUnread > 1 ? t.newOffersBadgePlural : t.newOffersBadgeSingular}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Frequency guarantee */}
      <div className="cp-section">
        <div className="cp-offers-guarantee">
          <Shield size={18} />
          <div>
            <strong>{customerLang === 'HI' ? 'हमारा वादा: ' : 'Our promise: '}</strong>{t.frequencyGuarantee}
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="cp-section">
        <div className="cp-offers-tabs">
          {TAB_CONFIG.map(tab => {
            const TabIcon = tab.icon;
            const count = tabCounts[tab.id] || 0;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`cp-offers-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon size={15} />
                <span>{t[tabLabelKeyMap[tab.id]] || tab.label}</span>
                {count > 0 && (
                  <span className="cp-tab-count">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Offers list */}
      <div className="cp-section">
        {filtered.length === 0 ? (
          <div className="cp-offers-empty">
            <Gift size={48} />
            <h3>{t.emptyOffersTitle}</h3>
            <p>
              {activeTab === 'New' && t.emptyNewDesc}
              {activeTab === 'Expiring Soon' && t.emptyExpiringDesc}
              {activeTab === 'Exploring' && t.emptyExploringDesc}
              {activeTab === 'Accepted' && t.emptyAcceptedDesc}
              {activeTab === 'Declined' && t.emptyDeclinedDesc}
            </p>
          </div>
        ) : (
          <div className="cp-offers-list">
            {filtered.map((offer, i) => (
              <OfferCard key={offer.id} offer={offer} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
