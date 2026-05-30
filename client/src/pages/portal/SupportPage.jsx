import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PORTAL_TRANSLATIONS } from '../../translations';
import {
  LifeBuoy, MessageSquare, AlertTriangle, CreditCard, Building2, Landmark, Ban, FileText,
  Package, HelpCircle, ChevronRight, Clock, CheckCircle2, Circle, ArrowRight,
  Phone, Mail, Calendar, MapPin, User, Star, ExternalLink, Search, AlertCircle,
  XCircle, Send, Upload, MessageCircle, Timer, Shield, Loader2, ArrowLeft,
  CalendarDays, ChevronDown, Headphones, UserCheck, Zap, BadgeCheck
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

/* ── Issue Categories ────────────────────────────────────── */
const ISSUE_CATEGORIES = [
  {
    id: 'wrong_amount', label: 'Wrong transaction amount', icon: CreditCard, color: '#ef4444', sla: '5 business days',
    autoCheck: 'Scanning your recent transactions for amount discrepancies...',
    guidance: 'We found 3 transactions above ₹10,000 in the last 7 days. Please select the specific transaction and we\'ll initiate an investigation with the merchant\'s bank.',
  },
  {
    id: 'not_received', label: 'Transaction not received', icon: AlertTriangle, color: '#f59e0b', sla: '5 business days',
    autoCheck: 'Verifying transaction status with beneficiary bank...',
    guidance: 'If you sent money via UPI/NEFT and the recipient hasn\'t received it, the amount is likely in transit. Most delays resolve within 2-4 hours. If it\'s been longer, we\'ll raise a trace request.',
  },
  {
    id: 'emi_wrong', label: 'EMI incorrectly charged', icon: CreditCard, color: '#ef4444', sla: '5 business days',
    autoCheck: 'Cross-checking your EMI schedule against actual debits...',
    guidance: 'We\'ll compare your agreed EMI amount with the deducted amount. If there\'s a mismatch, the excess will be reversed within the SLA period.',
  },
  {
    id: 'atm', label: 'ATM didn\'t dispense / debited without cash', icon: Landmark, color: '#f97316', sla: '5 business days',
    autoCheck: 'Checking ATM switch logs and reconciliation data...',
    guidance: 'For failed ATM transactions, the amount is auto-reversed within 5 business days as per RBI guidelines. If not reversed, we\'ll file a formal dispute with the ATM operator.',
  },
  {
    id: 'kyc', label: 'KYC update needed', icon: FileText, color: '#3b82f6', sla: '7 business days',
    autoCheck: null,
    guidance: 'You can update your KYC online using Aadhaar-based eKYC (instant) or visit any branch with your Aadhaar + PAN. Would you like SAGE to guide you through the online process?',
  },
  {
    id: 'blocked', label: 'Account temporarily blocked', icon: Ban, color: '#dc2626', sla: '24 hours',
    autoCheck: 'Checking your account freeze/block status...',
    guidance: 'If your account is blocked due to KYC expiry or suspicious activity, we need to verify your identity before unblocking. This is a priority SLA — resolution within 24 hours.',
  },
  {
    id: 'fd_sip', label: 'FD / SIP issue', icon: Package, color: '#8b5cf6', sla: '7 business days',
    autoCheck: null,
    guidance: 'For FD-related issues (premature withdrawal, rate dispute, maturity not credited) or SIP failures, please describe the issue and we\'ll investigate.',
  },
  {
    id: 'other', label: 'Other', icon: HelpCircle, color: '#64748b', sla: '7 business days',
    autoCheck: null,
    guidance: 'Please describe your issue in detail. Our team will categorize and route it to the right department.',
  },
];

/* ── Existing Tickets ────────────────────────────────────── */
const MOCK_TICKETS = [
  {
    id: 'TKT-2026-04821',
    subject: 'ATM cash not dispensed — ₹10,000 debited',
    category: 'ATM didn\'t dispense / debited without cash',
    status: 'Under Review',
    statusColor: '#f59e0b',
    created: '2026-05-20',
    sla: '5 business days',
    slaDeadline: '2026-05-27',
    description: 'Attempted to withdraw ₹10,000 from SBI ATM at Koramangala. Machine showed "Transaction Cancelled" but amount was debited. Receipt not printed.',
    timeline: [
      { step: 'Complaint Received', time: 'May 20, 2:14 PM', done: true, desc: 'Your complaint has been registered and assigned ticket ID.' },
      { step: 'Assigned to Branch', time: 'May 20, 3:00 PM', done: true, desc: 'Assigned to Koramangala Branch — Operations Team.' },
      { step: 'Under Review', time: 'May 22, 10:30 AM', done: true, current: true, desc: 'ATM switch logs requested from SBI. Reconciliation in progress.' },
      { step: 'Resolution', time: 'Expected by May 27', done: false, desc: 'If confirmed, ₹10,000 will be reversed to your account.' },
    ],
    escalationAvailable: false,
  },
  {
    id: 'TKT-2026-04756',
    subject: 'EMI deducted twice — Personal Loan May 2026',
    category: 'EMI incorrectly charged',
    status: 'Resolved',
    statusColor: '#10b981',
    created: '2026-05-12',
    sla: '5 business days',
    slaDeadline: '2026-05-19',
    resolvedDate: '2026-05-16',
    description: 'Personal Loan EMI of ₹5,400 was deducted twice on May 5 and May 6. Only one deduction should have occurred.',
    timeline: [
      { step: 'Complaint Received', time: 'May 12, 9:30 AM', done: true, desc: 'Ticket created.' },
      { step: 'Assigned to Loans Dept', time: 'May 12, 11:00 AM', done: true, desc: 'Routed to Loan Operations.' },
      { step: 'Under Review', time: 'May 14, 2:15 PM', done: true, desc: 'Duplicate debit confirmed. Reversal initiated.' },
      { step: 'Resolved — ₹5,400 Reversed', time: 'May 16, 10:45 AM', done: true, desc: '₹5,400 credited back to your savings account ****8801.' },
    ],
    escalationAvailable: false,
  },
  {
    id: 'TKT-2026-04892',
    subject: 'KYC update — Aadhaar address change',
    category: 'KYC update needed',
    status: 'Assigned',
    statusColor: '#3b82f6',
    created: '2026-05-28',
    sla: '7 business days',
    slaDeadline: '2026-06-06',
    description: 'Need to update residential address as per new Aadhaar. Current bank records show old Koramangala address.',
    timeline: [
      { step: 'Request Received', time: 'May 28, 4:00 PM', done: true, desc: 'Address change request registered.' },
      { step: 'Assigned to KYC Team', time: 'May 29, 9:15 AM', done: true, current: true, desc: 'Your request is being processed. You may be asked to upload documents.' },
      { step: 'Document Verification', time: 'Pending', done: false, desc: 'Aadhaar XML or DigiLocker verification.' },
      { step: 'Updated', time: 'Expected by June 6', done: false, desc: 'Address updated across all bank records.' },
    ],
    escalationAvailable: true,
  },
];

/* ── Branches ────────────────────────────────────────────── */
const BRANCHES = [
  {
    id: 'b1', name: 'Koramangala Branch', address: '80 Feet Road, Koramangala 4th Block, Bangalore — 560034',
    distance: '1.2 km', hours: '10:00 AM — 4:00 PM (Mon—Sat)', rm: 'Suresh Menon',
    slots: {
      '2026-06-02': ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'],
      '2026-06-03': ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
      '2026-06-04': ['10:00 AM', '12:00 PM', '2:00 PM'],
    },
    isNearest: true,
  },
  {
    id: 'b2', name: 'Indiranagar Branch', address: '100 Feet Road, HAL 2nd Stage, Indiranagar, Bangalore — 560038',
    distance: '3.8 km', hours: '10:00 AM — 4:00 PM (Mon—Sat)', rm: 'Priya Nair',
    slots: {
      '2026-06-02': ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'],
      '2026-06-03': ['11:00 AM', '2:00 PM', '3:00 PM'],
      '2026-06-04': ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'],
    },
    isNearest: false,
  },
  {
    id: 'b3', name: 'Whitefield Branch', address: 'ITPL Main Road, EPIP Zone, Whitefield, Bangalore — 560066',
    distance: '8.2 km', hours: '10:00 AM — 4:00 PM (Mon—Sat)', rm: 'Anand Kumar',
    slots: {
      '2026-06-02': ['10:00 AM', '12:00 PM', '3:00 PM'],
      '2026-06-03': ['10:00 AM', '11:00 AM', '12:00 PM'],
      '2026-06-04': ['11:00 AM', '2:00 PM', '3:00 PM'],
    },
    isNearest: false,
  },
];

const VISIT_REASONS = [
  'Account query / passbook update',
  'Document submission (KYC / address proof)',
  'Loan discussion / application',
  'Fixed Deposit / Investment',
  'Complaint follow-up',
  'Locker related',
  'Other',
];

/* ── RM Info ─────────────────────────────────────────────── */
const RM_INFO = {
  name: 'Suresh Menon',
  designation: 'Senior Relationship Manager',
  branch: 'Koramangala Branch',
  status: 'Available',
  phone: '+91 98765 43210',
  email: 'suresh.menon@trustedge.com',
  whatsapp: '+91 98765 43210',
  rating: 4.7,
  totalReviews: 128,
  specialization: 'Personal Banking, Loans & Investments',
  availability: 'Mon—Sat, 10:00 AM — 5:00 PM',
  nextAvailable: 'Today, 2:30 PM onwards',
  isPremium: true,
};

/* ── Tab Config ──────────────────────────────────────────── */
const TABS = [
  { id: 'help', label: 'Get Help', icon: HelpCircle },
  { id: 'tickets', label: 'My Tickets', icon: FileText, count: MOCK_TICKETS.length },
  { id: 'appointment', label: 'Book Appointment', icon: Calendar },
  { id: 'rm', label: 'Contact RM', icon: Headphones },
];

/* ══════════════════════════════════════════════════════════ */
export default function SupportPage() {
  const navigate = useNavigate();
  const { customerLang } = useOutletContext();
  const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

  const tabKeyMap = {
    'help': 'tabGetHelp',
    'tickets': 'tabMyTickets',
    'appointment': 'tabBookAppointment',
    'rm': 'tabContactRM',
  };

  const visitReasonKeyMap = {
    'Account query / passbook update': 'visitReasonPassbook',
    'Document submission (KYC / address proof)': 'visitReasonDoc',
    'Loan discussion / application': 'visitReasonLoan',
    'Fixed Deposit / Investment': 'visitReasonFd',
    'Complaint follow-up': 'visitReasonComplaint',
    'Locker related': 'visitReasonLocker',
    'Other': 'visitReasonOther',
  };

  const issueLabelKeyMap = {
    'wrong_amount': 'issueWrongAmountLabel',
    'not_received': 'issueNotReceivedLabel',
    'emi_wrong': 'issueEmiWrongLabel',
    'atm': 'issueAtmLabel',
    'kyc': 'issueKycLabel',
    'blocked': 'issueBlockedLabel',
    'fd_sip': 'issueFdSipLabel',
    'other': 'issueOtherLabel',
  };

  const issueAutoCheckKeyMap = {
    'wrong_amount': 'issueWrongAmountAutoCheck',
    'not_received': 'issueNotReceivedAutoCheck',
    'emi_wrong': 'issueEmiWrongAutoCheck',
    'atm': 'issueAtmAutoCheck',
    'blocked': 'issueBlockedAutoCheck',
  };

  const issueGuidanceKeyMap = {
    'wrong_amount': 'issueWrongAmountGuidance',
    'not_received': 'issueNotReceivedGuidance',
    'emi_wrong': 'issueEmiWrongGuidance',
    'atm': 'issueAtmGuidance',
    'kyc': 'issueKycGuidance',
    'blocked': 'issueBlockedGuidance',
    'fd_sip': 'issueFdSipGuidance',
    'other': 'issueOtherGuidance',
  };

  /* ── Tab state ───────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('help');

  /* ── Self-service state ──────────────────────────────── */
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [autoResolving, setAutoResolving] = useState(false);
  const [autoResolved, setAutoResolved] = useState(false);
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketDate, setTicketDate] = useState('');
  const [ticketAmount, setTicketAmount] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  /* ── Tickets state ───────────────────────────────────── */
  const [tickets] = useState(MOCK_TICKETS);
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [addInfoTicketId, setAddInfoTicketId] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  /* ── Appointment state ───────────────────────────────── */
  const [selectedBranch, setSelectedBranch] = useState('b1'); // auto-select nearest
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  /* ── RM state ────────────────────────────────────────── */
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [callbackTime, setCallbackTime] = useState('');

  /* ── Issue selection handler ─────────────────────────── */
  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setAutoResolved(false);
    setTicketSubmitted(false);
    if (issue.autoCheck) {
      setAutoResolving(true);
      setTimeout(() => {
        setAutoResolving(false);
        setAutoResolved(true);
      }, 2200);
    }
  };

  const resetSelfService = () => {
    setSelectedIssue(null);
    setAutoResolving(false);
    setAutoResolved(false);
    setTicketDesc('');
    setTicketDate('');
    setTicketAmount('');
    setTicketSubmitted(false);
  };

  const handleSubmitTicket = () => {
    const id = `TKT-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
    setGeneratedTicketId(id);
    setTicketSubmitted(true);
  };

  /* ── Available slots for selected branch + date ────── */
  const branch = BRANCHES.find(b => b.id === selectedBranch);
  const availableSlots = branch && selectedDate ? (branch.slots[selectedDate] || []) : [];
  const availableDates = branch ? Object.keys(branch.slots) : [];

  /* ══ Tab: Get Help ═══════════════════════════════════ */
  function GetHelpTab() {
    if (ticketSubmitted) {
      return (
        <div className="cp-support-success-card">
          <div className="cp-support-success-icon">
            <CheckCircle2 size={48} />
          </div>
          <h3>{t.complaintRegisteredSuccess}</h3>
          <div className="cp-support-ticket-id">
            <span>{t.ticketIdLabel}:</span>
            <strong>{generatedTicketId}</strong>
          </div>
          <p>
            {customerLang === 'HI' ? (
              <>हमें <strong>{t[issueLabelKeyMap[selectedIssue.id]] || selectedIssue.label}</strong> के संबंध में आपकी शिकायत प्राप्त हुई है। आपको एसएमएस और इन-ऐप नोटिफिकेशन के माध्यम से अपडेट प्राप्त होंगे।</>
            ) : (
              <>We've received your complaint about <strong>{t[issueLabelKeyMap[selectedIssue.id]] || selectedIssue.label}</strong>. You'll receive updates via SMS and In-App notifications.</>
            )}
          </p>
          <div className="cp-support-sla-box">
            <Timer size={16} />
            <span>
              {t.ticketSla}: <strong>{
                selectedIssue.sla.includes('5') ? (customerLang === 'HI' ? '5 कार्य दिवस' : '5 business days') :
                selectedIssue.sla.includes('7') ? (customerLang === 'HI' ? '7 कार्य दिवस' : '7 business days') :
                selectedIssue.sla.includes('24') ? (customerLang === 'HI' ? '24 घंटे' : '24 hours') :
                selectedIssue.sla
              }</strong> {customerLang === 'HI' ? 'दर्ज करने की तिथि से।' : 'from filing date.'}
            </span>
          </div>
          <div className="cp-support-success-actions">
            <button className="cp-btn cp-btn-primary" onClick={() => { setActiveTab('tickets'); resetSelfService(); }}>
              <FileText size={14} /> {t.viewMyTickets}
            </button>
            <button className="cp-btn cp-btn-secondary" onClick={resetSelfService}>
              {t.reportAnotherIssue}
            </button>
          </div>
        </div>
      );
    }

    if (!selectedIssue) {
      return (
        <div>
          <div className="cp-support-section-title">
            <AlertCircle size={18} />
            <h3>{t.problemCategoryTitle}</h3>
          </div>
          <div className="cp-support-issue-grid">
            {ISSUE_CATEGORIES.map((issue, i) => {
              const IssueIcon = issue.icon;
              return (
                <button
                  key={issue.id}
                  className="cp-support-issue-card"
                  onClick={() => handleIssueSelect(issue)}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="cp-support-issue-icon" style={{ background: `${issue.color}18`, color: issue.color }}>
                    <IssueIcon size={22} />
                  </div>
                  <div className="cp-support-issue-info">
                    <div className="cp-support-issue-label">{t[issueLabelKeyMap[issue.id]] || issue.label}</div>
                    <div className="cp-support-issue-sla">
                      <Clock size={11} /> {t.ticketSla}: {
                        issue.sla.includes('5') ? (customerLang === 'HI' ? '5 कार्य दिवस' : '5 business days') :
                        issue.sla.includes('7') ? (customerLang === 'HI' ? '7 कार्य दिवस' : '7 business days') :
                        issue.sla.includes('24') ? (customerLang === 'HI' ? '24 घंटे' : '24 hours') :
                        issue.sla
                      }
                    </div>
                  </div>
                  <ChevronRight size={16} className="cp-support-issue-arrow" />
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    /* ── Issue selected — auto-resolve + ticket form ── */
    const IssueIcon = selectedIssue.icon;
    return (
      <div>
        <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={resetSelfService} style={{ marginBottom: 16 }}>
          <ArrowLeft size={14} /> {t.backToCategories}
        </button>

        <div className="cp-support-selected-issue">
          <div className="cp-support-selected-issue-header">
            <div className="cp-support-issue-icon" style={{ background: `${selectedIssue.color}18`, color: selectedIssue.color }}>
              <IssueIcon size={22} />
            </div>
            <div>
              <h3>{t[issueLabelKeyMap[selectedIssue.id]] || selectedIssue.label}</h3>
              <span className="cp-support-sla-tag">
                <Clock size={12} /> {t.ticketSla}: {
                  selectedIssue.sla.includes('5') ? (customerLang === 'HI' ? '5 कार्य दिवस' : '5 business days') :
                  selectedIssue.sla.includes('7') ? (customerLang === 'HI' ? '7 कार्य दिवस' : '7 business days') :
                  selectedIssue.sla.includes('24') ? (customerLang === 'HI' ? '24 घंटे' : '24 hours') :
                  selectedIssue.sla
                }
              </span>
            </div>
          </div>

          {/* Auto-resolution check */}
          {autoResolving && (
            <div className="cp-support-auto-checking">
              <div className="cp-support-spinner" />
              <span>{t[issueAutoCheckKeyMap[selectedIssue.id]] || selectedIssue.autoCheck}</span>
            </div>
          )}

          {/* SAGE guidance */}
          {(autoResolved || !selectedIssue.autoCheck) && (
            <div className="cp-support-sage-guidance">
              <div className="cp-support-sage-guidance-header">
                <Zap size={15} />
                <span>{t.sageAnalysisLabel}</span>
              </div>
              <p>{t[issueGuidanceKeyMap[selectedIssue.id]] || selectedIssue.guidance}</p>
              <button className="cp-btn cp-btn-secondary cp-btn-sm" onClick={() => navigate('/portal/sage')}>
                <MessageSquare size={14} /> {t.continueWithSageBtn}
              </button>
            </div>
          )}

          {/* Ticket creation form */}
          {(autoResolved || !selectedIssue.autoCheck) && (
            <div className="cp-support-ticket-form">
              <h4>{t.stillNeedHelpTitle}</h4>

              <div className="cp-support-form-group">
                <label className="cp-support-form-label">{t.describeIssueDetail}</label>
                <textarea
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  className="cp-support-form-textarea"
                  rows={4}
                  placeholder={t.describeIssuePlaceholder}
                />
              </div>

              <div className="cp-support-form-row">
                <div className="cp-support-form-group">
                  <label className="cp-support-form-label">{t.txnDateLabel}</label>
                  <input
                    type="date"
                    value={ticketDate}
                    onChange={e => setTicketDate(e.target.value)}
                    className="cp-support-form-input"
                  />
                </div>
                <div className="cp-support-form-group">
                  <label className="cp-support-form-label">{t.txnAmountLabel}</label>
                  <input
                    type="number"
                    value={ticketAmount}
                    onChange={e => setTicketAmount(e.target.value)}
                    className="cp-support-form-input"
                    placeholder="₹"
                  />
                </div>
              </div>

              <div className="cp-support-sla-commitment">
                <Shield size={15} />
                <div>
                  <strong>{t.ticketSla}:</strong> {
                    selectedIssue.sla.includes('5') ? (customerLang === 'HI' ? '5 कार्य दिवस' : '5 business days') :
                    selectedIssue.sla.includes('7') ? (customerLang === 'HI' ? '7 कार्य दिवस' : '7 business days') :
                    selectedIssue.sla.includes('24') ? (customerLang === 'HI' ? '24 घंटे' : '24 hours') :
                    selectedIssue.sla
                  } {t.slaCommitmentFooterText}
                </div>
              </div>

              <div className="cp-support-form-actions">
                <button
                  className="cp-btn cp-btn-primary"
                  disabled={!ticketDesc.trim()}
                  onClick={handleSubmitTicket}
                >
                  <Send size={14} /> {t.submitComplaintBtn}
                </button>
                <button className="cp-btn cp-btn-secondary" onClick={() => navigate('/portal/sage')}>
                  <MessageSquare size={14} /> {t.chatWithSageFirstBtn}
                </button>
                <button className="cp-btn cp-btn-ghost" onClick={resetSelfService}>
                  {t.cancel}
                </button>
              </div>

              <div className="cp-support-ombudsman">
                <span>📌 {t.ombudsmanEscalationText}</span>
                {' '}
                <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer">
                  {t.ticketEscalationOmbudsman} <ExternalLink size={11} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ══ Tab: My Tickets ═════════════════════════════════ */
  function MyTicketsTab() {
    if (tickets.length === 0) {
      return (
        <div className="cp-support-empty">
          <FileText size={48} />
          <h3>{t.noTicketsYetTitle}</h3>
          <p>{t.noTicketsDesc}</p>
        </div>
      );
    }

    const stepLabelKeyMapTimeline = {
      'Complaint Received': 'stepComplaintReceived',
      'Assigned to Branch': 'stepAssignedToBranch',
      'Under Review': 'stepUnderReview',
      'Resolution': 'stepResolution',
      'Assigned to Loans Dept': 'stepAssignedToLoans',
      'Resolved — ₹5,400 Reversed': 'stepResolvedReversed',
      'Resolved — Reversed': 'stepResolvedReversed',
      'Request Received': 'stepRequestReceived',
      'Assigned to KYC Team': 'stepAssignedToKyc',
      'Document Verification': 'stepDocVerification',
      'Updated': 'stepUpdated',
    };

    return (
      <div className="cp-support-tickets-list">
        {tickets.map((ticket, i) => (
          <div
            key={ticket.id}
            className="cp-support-ticket-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {/* Ticket header */}
            <div className="cp-support-ticket-header">
              <div className="cp-support-ticket-header-left">
                <span className="cp-support-ticket-id">#{ticket.id}</span>
                <span
                  className="cp-support-ticket-status"
                  style={{ background: `${ticket.statusColor}18`, color: ticket.statusColor }}
                >
                  {ticket.status === 'Resolved' ? t.statusResolved :
                   ticket.status === 'Under Review' ? t.statusUnderReview :
                   ticket.status === 'Assigned' ? t.statusAssigned : ticket.status}
                </span>
              </div>
              <div className="cp-support-ticket-dates">
                <span>{t.filedLabel}: {ticket.created}</span>
                <span>{t.slaLabel}: {
                  ticket.sla.includes('5') ? (customerLang === 'HI' ? '5 कार्य दिवस' : '5 business days') :
                  ticket.sla.includes('7') ? (customerLang === 'HI' ? '7 कार्य दिवस' : '7 business days') :
                  ticket.sla.includes('24') ? (customerLang === 'HI' ? '24 घंटे' : '24 hours') :
                  ticket.sla
                }</span>
              </div>
            </div>

            <h3 className="cp-support-ticket-subject">{ticket.subject}</h3>
            <p className="cp-support-ticket-desc">{ticket.description}</p>

            {/* Status timeline */}
            <div className="cp-support-timeline">
              <div className="cp-support-timeline-line" />
              {ticket.timeline.map((step, j) => (
                <div key={j} className={`cp-support-timeline-step ${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}>
                  <div className="cp-support-timeline-dot">
                    {step.done && !step.current && <CheckCircle2 size={14} />}
                    {step.current && <Clock size={14} />}
                    {!step.done && !step.current && <Circle size={14} />}
                  </div>
                  <div className="cp-support-timeline-content">
                    <div className="cp-support-timeline-step-name">{t[stepLabelKeyMapTimeline[step.step]] || step.step}</div>
                    <div className="cp-support-timeline-step-time">{step.time}</div>
                    <div className="cp-support-timeline-step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* SLA info */}
            <div className="cp-support-ticket-sla">
              <Timer size={14} />
              <span>
                {t.slaDeadlineLabel}: <strong>{ticket.slaDeadline}</strong>
                {ticket.status === 'Resolved' && ticket.resolvedDate && (
                  <> · {t.resolvedOnLabel} <strong>{ticket.resolvedDate}</strong> ({t.withinSla} ✓)</>
                )}
              </span>
            </div>

            {/* Escalation */}
            {ticket.escalationAvailable && (
              <div className="cp-support-escalation-warning">
                <AlertTriangle size={14} />
                <span>{t.slaApproachingWarning}</span>
              </div>
            )}

            {/* Ticket actions */}
            {ticket.status !== 'Resolved' && (
              <div className="cp-support-ticket-actions">
                <button
                  className="cp-btn cp-btn-secondary cp-btn-sm"
                  onClick={() => setAddInfoTicketId(addInfoTicketId === ticket.id ? null : ticket.id)}
                >
                  <Upload size={14} /> {t.addMoreInfo}
                </button>
                <button className="cp-btn cp-btn-secondary cp-btn-sm" onClick={() => navigate('/portal/sage')}>
                  <MessageSquare size={14} /> {t.chatWithSageBtn || 'Chat with SAGE'}
                </button>
                <button className="cp-btn cp-btn-ghost cp-btn-sm" style={{ color: 'var(--accent-red)' }}>
                  <XCircle size={14} /> {t.cancelTicket}
                </button>
              </div>
            )}

            {/* Add info panel */}
            {addInfoTicketId === ticket.id && (
              <div className="cp-support-add-info-panel">
                <textarea
                  value={additionalInfo}
                  onChange={e => setAdditionalInfo(e.target.value)}
                  className="cp-support-form-textarea"
                  rows={3}
                  placeholder={t.addInfoPlaceholder}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="cp-btn cp-btn-primary cp-btn-sm" disabled={!additionalInfo.trim()}>
                    <Send size={13} /> {t.submit}
                  </button>
                  <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={() => { setAddInfoTicketId(null); setAdditionalInfo(''); }}>
                    {t.cancel}
                  </button>
                </div>
              </div>
            )}

            {/* RBI Ombudsman link */}
            <div className="cp-support-ombudsman" style={{ marginTop: 12 }}>
              <span>{t.notSatisfied}</span>
              {' '}
              <a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer">
                {t.escalateToOmbudsmanLink} <ExternalLink size={11} />
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ══ Tab: Book Appointment ═══════════════════════════ */
  function BookAppointmentTab() {
    if (bookingConfirmed) {
      const confirmedBranch = BRANCHES.find(b => b.id === selectedBranch);
      return (
        <div className="cp-support-success-card">
          <div className="cp-support-success-icon">
            <CalendarDays size={48} />
          </div>
          <h3>{t.appointmentConfirmedTitle}</h3>
          <div className="cp-support-appointment-details">
            <div className="cp-support-appointment-detail">
              <Building2 size={15} />
              <span>{confirmedBranch?.name}</span>
            </div>
            <div className="cp-support-appointment-detail">
              <Calendar size={15} />
              <span>{selectedDate}</span>
            </div>
            <div className="cp-support-appointment-detail">
              <Clock size={15} />
              <span>{selectedTime}</span>
            </div>
            <div className="cp-support-appointment-detail">
              <User size={15} />
              <span>{t.rmLabel}: {confirmedBranch?.rm === 'Suresh Menon' ? (customerLang === 'HI' ? 'सुरेश मेनन' : 'Suresh Menon') : confirmedBranch?.rm === 'Priya Nair' ? (customerLang === 'HI' ? 'प्रिया नायर' : 'Priya Nair') : confirmedBranch?.rm === 'Anand Kumar' ? (customerLang === 'HI' ? 'आनंद कुमार' : 'Anand Kumar') : confirmedBranch?.rm}</span>
            </div>
            <div className="cp-support-appointment-detail">
              <FileText size={15} />
              <span>{t.reasonLabel}: {t[visitReasonKeyMap[visitReason]] || visitReason}</span>
            </div>
          </div>
          <p className="cp-support-appointment-reminder">
            {t.appointmentReminderText}
          </p>
          <div className="cp-support-success-actions">
            <button className="cp-btn cp-btn-secondary" onClick={() => {
              setBookingConfirmed(false);
              setSelectedDate('');
              setSelectedTime('');
              setVisitReason('');
            }}>
              {t.bookAnotherAppointmentBtn}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="cp-support-section-title">
          <MapPin size={18} />
          <h3>{t.selectBranchLabel}</h3>
        </div>

        <div className="cp-support-branch-list">
          {BRANCHES.map((b, i) => (
            <button
              key={b.id}
              className={`cp-support-branch-card ${selectedBranch === b.id ? 'selected' : ''}`}
              onClick={() => { setSelectedBranch(b.id); setSelectedDate(''); setSelectedTime(''); }}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="cp-support-branch-icon">
                <Building2 size={22} />
              </div>
              <div className="cp-support-branch-info">
                <div className="cp-support-branch-name">
                  {b.name}
                  {b.isNearest && <span className="cp-support-nearest-badge">📍 {t.nearestLabel}</span>}
                </div>
                <div className="cp-support-branch-address">{b.address}</div>
                <div className="cp-support-branch-meta">
                  <span><Clock size={11} /> {customerLang === 'HI' ? b.hours.replace('Mon—Sat', 'सोम—शनि') : b.hours}</span>
                  <span><User size={11} /> {t.rmLabel}: {b.rm === 'Suresh Menon' ? (customerLang === 'HI' ? 'सुरेश मेनन' : 'Suresh Menon') : b.rm === 'Priya Nair' ? (customerLang === 'HI' ? 'प्रिया नायर' : 'Priya Nair') : b.rm === 'Anand Kumar' ? (customerLang === 'HI' ? 'आनंद कुमार' : 'Anand Kumar') : b.rm}</span>
                </div>
              </div>
              <div className="cp-support-branch-distance">{b.distance}</div>
            </button>
          ))}
        </div>

        {/* Date, Reason, Time selection */}
        {selectedBranch && (
          <div className="cp-support-booking-form">
            <h4>{t.scheduleYourVisitTitle}</h4>

            <div className="cp-support-form-row">
              <div className="cp-support-form-group">
                <label className="cp-support-form-label">{t.selectReasonLabel}</label>
                <select
                  value={visitReason}
                  onChange={e => setVisitReason(e.target.value)}
                  className="cp-support-form-select"
                >
                  <option value="">{t.selectReasonPlaceholder}</option>
                  {VISIT_REASONS.map(r => (
                    <option key={r} value={r}>{t[visitReasonKeyMap[r]] || r}</option>
                  ))}
                </select>
              </div>

              <div className="cp-support-form-group">
                <label className="cp-support-form-label">{t.selectDateLabel}</label>
                <select
                  value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setSelectedTime(''); }}
                  className="cp-support-form-select"
                >
                  <option value="">{t.chooseDatePlaceholder}</option>
                  {availableDates.map(d => (
                    <option key={d} value={d}>{d} ({BRANCHES.find(b => b.id === selectedBranch)?.slots[d]?.length || 0} {t.slotsLabel})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div className="cp-support-form-group">
                <label className="cp-support-form-label">{t.availableTimeSlots}</label>
                {availableSlots.length === 0 ? (
                  <p className="cp-support-no-slots">{t.noSlotsAvailable}</p>
                ) : (
                  <div className="cp-support-time-slots">
                    {availableSlots.map(slot => (
                      <button
                        key={slot}
                        className={`cp-support-time-slot ${selectedTime === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        <Clock size={13} />
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RM assignment info */}
            {selectedTime && (
              <div className="cp-support-rm-assignment">
                <UserCheck size={15} />
                <span>
                  {customerLang === 'HI' ? (
                    <>आपकी यात्रा के दौरान संबंध प्रबंधक <strong>{branch?.rm === 'Suresh Menon' ? 'सुरेश मेनन' : branch?.rm === 'Priya Nair' ? 'प्रिया नायर' : branch?.rm === 'Anand Kumar' ? 'आनंद कुमार' : branch?.rm}</strong> आपकी सहायता करेंगे। कृपया एक वैध फोटो आईडी साथ लाएं।</>
                  ) : (
                    <>Your visit will be attended by <strong>{branch?.rm}</strong> (Relationship Manager). Please carry a valid photo ID.</>
                  )}
                </span>
              </div>
            )}

            <button
              className="cp-btn cp-btn-primary"
              disabled={!selectedDate || !selectedTime || !visitReason}
              onClick={() => setBookingConfirmed(true)}
              style={{ marginTop: 16 }}
            >
              <Calendar size={16} /> {t.bookAppointmentBtn}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ══ Tab: Contact RM ═════════════════════════════════ */
  function ContactRMTab() {
    return (
      <div>
        {/* RM Card */}
        <div className="cp-support-rm-card">
          <div className="cp-support-rm-card-header">
            <div className="cp-support-rm-avatar">
              {RM_INFO.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="cp-support-rm-info">
              <h3>{RM_INFO.name === 'Suresh Menon' ? (customerLang === 'HI' ? 'सुरेश मेनन' : 'Suresh Menon') : RM_INFO.name}</h3>
              <div className="cp-support-rm-designation">{customerLang === 'HI' ? 'वरिष्ठ संबंध प्रबंधक' : RM_INFO.designation}</div>
              <div className="cp-support-rm-branch">
                <Building2 size={12} />
                {RM_INFO.branch}
              </div>
              <div className="cp-support-rm-meta">
                <span className="cp-support-rm-status">
                  <span className="cp-support-rm-status-dot" />
                  {RM_INFO.status === 'Available' ? (customerLang === 'HI' ? 'उपलब्ध' : 'Available') : (customerLang === 'HI' ? 'व्यस्त' : 'Busy')}
                </span>
                <span className="cp-support-rm-rating">
                  <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
                  {RM_INFO.rating}/5 ({RM_INFO.totalReviews} {t.reviewsLabel})
                </span>
              </div>
            </div>
          </div>

          <div className="cp-support-rm-details">
            <div className="cp-support-rm-detail-item">
              <span className="cp-support-rm-detail-label">{t.specializationLabel}</span>
              <span>{customerLang === 'HI' ? 'व्यक्तिगत बैंकिंग, ऋण और निवेश' : RM_INFO.specialization}</span>
            </div>
            <div className="cp-support-rm-detail-item">
              <span className="cp-support-rm-detail-label">{t.availabilityLabel}</span>
              <span>{customerLang === 'HI' ? 'सोम—शनि, 10:00 AM — 5:00 PM' : RM_INFO.availability}</span>
            </div>
            <div className="cp-support-rm-detail-item">
              <span className="cp-support-rm-detail-label">{t.nextAvailableLabel}</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{customerLang === 'HI' ? 'आज, दोपहर 2:30 बजे से' : RM_INFO.nextAvailable}</span>
            </div>
          </div>

          {/* Contact actions */}
          <div className="cp-support-rm-actions">
            <button
              className="cp-btn cp-btn-primary"
              onClick={() => setCallbackRequested(true)}
              style={{ flex: 1 }}
            >
              <Phone size={16} /> {t.scheduleCallback}
            </button>
            <button className="cp-btn cp-btn-secondary" style={{ flex: 1 }}>
              <Mail size={16} /> {t.sendEmailBtn}
            </button>
            {RM_INFO.isPremium && (
              <button
                className="cp-btn cp-btn-secondary cp-support-whatsapp-btn"
                style={{ flex: 1 }}
              >
                <MessageCircle size={16} /> {t.whatsappBtn}
              </button>
            )}
          </div>

          {/* Callback requested */}
          {callbackRequested && (
            <div className="cp-support-callback-panel">
              <div className="cp-support-callback-header">
                <CheckCircle2 size={18} style={{ color: 'var(--accent-green)' }} />
                <h4>{t.callbackScheduledTitle}</h4>
              </div>
              <p>
                {RM_INFO.name === 'Suresh Menon' && customerLang === 'HI' ? 'सुरेश मेनन' : RM_INFO.name} {t.callbackDetailsText} <strong>**210</strong>.
              </p>
              <div className="cp-support-callback-time">
                <Clock size={14} />
                <span>{t.callbackExpectedText}</span>
              </div>
              <button className="cp-btn cp-btn-ghost cp-btn-sm" onClick={() => setCallbackRequested(false)} style={{ marginTop: 8 }}>
                {t.cancelCallbackBtn}
              </button>
            </div>
          )}

          {/* Premium WhatsApp notice */}
          {RM_INFO.isPremium && (
            <div className="cp-support-premium-notice">
              <BadgeCheck size={15} />
              <span>
                {t.premiumWhatsappNotice}
              </span>
            </div>
          )}

          <div className="cp-support-callback-info">
            {t.callbackFooterText}
          </div>
        </div>
      </div>
    );
  }

  /* ── Render ────────────────────────────────────────── */
  return (
    <div className="cp-page">
      {/* Page header */}
      <div className="cp-section">
        <div className="cp-greeting">
          <div className="cp-greeting-text">
            <h2>{t.supportTitle}</h2>
            <p>{t.supportSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="cp-section">
        <div className="cp-tabs">
          {TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`cp-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <TabIcon size={16} />
                <span>{t[tabKeyMap[tab.id]] || tab.label}</span>
                {tab.count && (
                  <span className="cp-tab-count">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="cp-section">
        {activeTab === 'help' && <GetHelpTab />}
        {activeTab === 'tickets' && <MyTicketsTab />}
        {activeTab === 'appointment' && <BookAppointmentTab />}
        {activeTab === 'rm' && <ContactRMTab />}
      </div>
    </div>
  );
}
