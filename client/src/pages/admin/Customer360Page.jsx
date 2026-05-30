import { useState, useEffect } from 'react';
import {
  Search, User, MapPin, Phone, Shield, TrendingUp, TrendingDown,
  AlertTriangle, CreditCard, PieChart, Activity, MessageSquare,
  ClipboardList, Gift, ExternalLink, ChevronRight, Calendar,
  DollarSign, Target, Eye, ArrowUpRight, ArrowDownRight, Clock,
  FileText, Send, Brain, X, CheckCircle, XCircle, Minus, Star,
  BarChart3, Briefcase, Building, Globe, Smartphone, Zap
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell
} from 'recharts';

// ═══════════════════════════════════════════════
// MOCK DATA — Rajesh Kumar comprehensive profile
// ═══════════════════════════════════════════════

const customerData = {
  id: 'CUST-00451',
  name: 'Rajesh Kumar',
  accountNumber: '****5678',
  phone: '+91-98765-XXXXX',
  email: 'r***@gmail.com',
  pan: 'ABCDE****F',
  branch: 'Koramangala, Bangalore',
  rm: 'Priya Sharma',
  rmId: 'RM-042',
  accountType: 'SAVINGS',
  kycStatus: 'VERIFIED',
  riskScore: 0.87,
  riskLevel: 'CRITICAL',
  healthLevel: 'AT_RISK',
  lifecycleStage: 'DORMANT',
  engagementTrend: 'DECLINING',
  digitalAdoption: 0.34,
  daysSinceLastContact: 18,
  customerSince: '2019-04-15',
  aum: 1247000,
  totalProducts: 5,
};

const overviewMetrics = [
  { label: 'Total AUM', value: '₹12.47L', trend: 'down', change: '-8.2%', icon: DollarSign, color: '#ef4444' },
  { label: 'Risk Score', value: '0.87', trend: 'up', change: '+0.14', icon: AlertTriangle, color: '#ef4444' },
  { label: 'Health Level', value: 'AT RISK', trend: 'down', change: 'Was STABLE', icon: Activity, color: '#f59e0b' },
  { label: 'Lifecycle Stage', value: 'DORMANT', trend: 'down', change: 'Was GROWTH', icon: Target, color: '#f97316' },
  { label: 'Engagement', value: 'DECLINING', trend: 'down', change: '-34%', icon: TrendingDown, color: '#ef4444' },
  { label: 'Digital Adoption', value: '34%', trend: 'down', change: '-18pts', icon: Smartphone, color: '#f59e0b' },
  { label: 'Days Since Contact', value: '18', trend: 'up', change: 'Overdue', icon: Clock, color: '#ef4444' },
  { label: 'Customer Since', value: '6.1 yrs', trend: 'neutral', change: 'Apr 2019', icon: Calendar, color: '#3b82f6' },
];

const riskScoreTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  score: Math.min(0.95, 0.52 + (i * 0.012) + (Math.random() * 0.04 - 0.02)),
}));

const transactions = [
  { id: 'TXN-001', date: '2026-05-25', type: 'DEBIT', category: 'TRANSFER', amount: 210000, desc: 'Transfer to Paytm Wallet', anomaly: true, anomalyReason: 'Large outflow to competitor' },
  { id: 'TXN-002', date: '2026-05-22', type: 'DEBIT', category: 'UTILITIES', amount: 4500, desc: 'Electricity Bill - BESCOM', anomaly: false },
  { id: 'TXN-003', date: '2026-05-20', type: 'DEBIT', category: 'EMI', amount: 18500, desc: 'Car Loan EMI', anomaly: false },
  { id: 'TXN-004', date: '2026-05-15', type: 'DEBIT', category: 'FOOD', amount: 3200, desc: 'Swiggy - Monthly', anomaly: false },
  { id: 'TXN-005', date: '2026-05-10', type: 'DEBIT', category: 'SIP_CANCEL', amount: 15000, desc: 'SIP Cancellation - HDFC MF', anomaly: true, anomalyReason: 'SIP cancelled (3rd in 21 days)' },
  { id: 'TXN-006', date: '2026-05-05', type: 'CREDIT', category: 'REFUND', amount: 2100, desc: 'Amazon Refund', anomaly: false },
  { id: 'TXN-007', date: '2026-05-01', type: 'DEBIT', category: 'RENT', amount: 25000, desc: 'House Rent', anomaly: false },
  { id: 'TXN-008', date: '2026-04-28', type: 'DEBIT', category: 'SIP_CANCEL', amount: 10000, desc: 'SIP Cancellation - Axis MF', anomaly: true, anomalyReason: 'SIP cancelled (2nd in series)' },
  { id: 'TXN-009', date: '2026-04-25', type: 'DEBIT', category: 'INSURANCE', amount: 8500, desc: 'Health Insurance Premium', anomaly: false },
  { id: 'TXN-010', date: '2026-04-20', type: 'DEBIT', category: 'SIP_CANCEL', amount: 5000, desc: 'SIP Cancellation - SBI MF', anomaly: true, anomalyReason: 'First SIP cancellation signal' },
  { id: 'TXN-011', date: '2026-04-15', type: 'DEBIT', category: 'SHOPPING', amount: 45000, desc: 'Flipkart Electronics', anomaly: false },
  { id: 'TXN-012', date: '2026-04-01', type: 'CREDIT', category: 'SALARY', amount: 85000, desc: 'Salary Credit - Infosys', anomaly: true, anomalyReason: 'Salary dropped from ₹1.2L to ₹85K' },
];

const products = [
  { name: 'Savings Account', type: 'SAVINGS', balance: 247000, trend: 'down', change: '-23%', maturity: null, status: 'Active', sparkline: [8,7,6,5,4,3.5,2.8,2.5] },
  { name: 'Fixed Deposit - 1Y', type: 'FD', balance: 500000, trend: 'neutral', change: '0%', maturity: '2026-06-15', status: 'Maturing Soon', sparkline: [5,5,5,5,5,5,5,5] },
  { name: 'Car Loan', type: 'LOAN', balance: -680000, trend: 'down', change: 'EMI Regular', maturity: '2028-03-01', status: 'Active', sparkline: [8,7.5,7,6.8,6.5,6.2,6,5.8] },
  { name: 'SIP - HDFC Mid Cap (Cancelled)', type: 'SIP', balance: 0, trend: 'down', change: 'Cancelled', maturity: null, status: 'Cancelled', sparkline: [15,15,15,15,0,0,0,0] },
  { name: 'Credit Card - Platinum', type: 'CARD', balance: -35000, trend: 'up', change: '+12%', maturity: null, status: 'Active', sparkline: [2,2.5,3,3.2,3,3.5,3.8,3.5] },
];

const riskSignals = [
  { signal: 'Primary salary credit dropped 60%', weight: 0.31, severity: 'critical' },
  { signal: '3 SIP cancellations in 21 days', weight: 0.22, severity: 'critical' },
  { signal: 'Mobile app login gap: 34 days', weight: 0.17, severity: 'high' },
  { signal: '₹2.1L transfer to Paytm wallet', weight: 0.12, severity: 'high' },
  { signal: 'FD maturing — no renewal inquiry', weight: 0.05, severity: 'moderate' },
];

const linkedAccounts = [
  { name: 'Sunita Kumar (Spouse)', risk: 0.61, relationship: 'Joint Account', status: 'AT_RISK' },
  { name: 'Amit Kumar (Son)', risk: 0.22, relationship: 'Referral', status: 'HEALTHY' },
];

const interactions = [
  { date: '2026-05-20', type: 'OUTREACH', channel: 'SMS', summary: 'Stage 1: Complaint Acknowledgment Sent', sentiment: null, status: 'Delivered' },
  { date: '2026-05-18', type: 'OUTREACH', channel: 'In-App', summary: 'Behavioral Trigger: Engagement Drop Warning', sentiment: null, status: 'Read' },
  { date: '2026-05-15', type: 'SAGE', channel: 'App', summary: 'Asked about closing FD early — SAGE flagged distress', sentiment: 'Negative', status: 'Low Confidence' },
  { date: '2026-05-09', type: 'CALL', channel: 'RM Call', summary: 'Priya called — no answer (2nd attempt)', sentiment: null, status: 'No Answer' },
  { date: '2026-05-02', type: 'COMPLAINT', channel: 'App', summary: 'Complaint: Fee charged on dormant account', sentiment: 'Negative', status: 'Resolved' },
  { date: '2026-05-02', type: 'OUTREACH', channel: 'App', summary: 'Stage 6: Satisfaction Follow-up (CSAT) Sent', sentiment: null, status: 'Opened' },
  { date: '2026-04-18', type: 'CALL', channel: 'RM Call', summary: 'Discussed SIP performance, customer unhappy with returns', sentiment: 'Negative', status: 'Completed' },
  { date: '2026-04-05', type: 'OUTREACH', channel: 'Email', summary: 'Milestone: 5 Year Anniversary Appreciation', sentiment: 'Positive', status: 'Opened' },
  { date: '2026-03-12', type: 'SAGE', channel: 'App', summary: 'Financial planning query — budgeting tools', sentiment: 'Positive', status: 'Helpful' },
  { date: '2026-02-28', type: 'BRANCH', channel: 'Walk-in', summary: 'Updated KYC, inquired about competitor FD rates', sentiment: 'Neutral', status: 'Completed' },
];

const cases = [
  { id: 'RC-2026-0451', type: 'CHURN_RISK', priority: 'CRITICAL', status: 'IN_PROGRESS', assignedTo: 'Priya Sharma', createdAt: '2026-05-18', sla: '2d 4h', aumAtRisk: 1247000 },
  { id: 'RC-2026-0312', type: 'COMPLAINT_ESCALATION', priority: 'HIGH', status: 'RESOLVED', assignedTo: 'Priya Sharma', createdAt: '2026-05-02', sla: 'Met', aumAtRisk: 0 },
];

const offers = [
  { id: 'OF-001', type: 'FEE_WAIVER', name: 'Annual maintenance fee waiver — 12 months', status: 'SENT', sentDate: '2026-05-19', response: 'IGNORED', channel: 'WhatsApp' },
  { id: 'OF-002', type: 'RATE_ADJUSTMENT', name: 'FD renewal at +0.25% premium rate', status: 'PENDING', sentDate: null, response: null, channel: 'RM Call' },
];

const riskColors = ['#ef4444', '#ef4444', '#f97316', '#f97316', '#f59e0b'];
const CHART_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981'];

export default function Customer360Page() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(customerData);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeReason, setChallengeReason] = useState('');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');
  const [txnFilter, setTxnFilter] = useState('ALL');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiRiskTrend, setApiRiskTrend] = useState(null);
  const [apiRiskSignals, setApiRiskSignals] = useState(null);
  const [apiOverallRisk, setApiOverallRisk] = useState(null);
  const [apiRiskLevel, setApiRiskLevel] = useState(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [apiCustomerProfile, setApiCustomerProfile] = useState(null);
  const [apiTransactions, setApiTransactions] = useState(null);
  const [apiInteractions, setApiInteractions] = useState(null);
  const [apiCases, setApiCases] = useState(null);
  const [apiOffers, setApiOffers] = useState(null);
  const [apiProducts, setApiProducts] = useState(null);

  // Fetch customer list on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/v1/signal/customers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setCustomers(Array.isArray(data) ? data : []))
      .catch(() => setCustomers([]));
  }, []);

  // Fetch reports when selectedCustomer changes
  useEffect(() => {
    if (!selectedCustomer || !selectedCustomer.id) return;
    const token = localStorage.getItem('token');
    setLoading(true);
    fetch(`/api/v1/signal/customers/${selectedCustomer.id}/reports`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(reports => {
        if (!Array.isArray(reports) || reports.length === 0) {
          setApiRiskTrend(null);
          setApiRiskSignals(null);
          setApiOverallRisk(null);
          setApiRiskLevel(null);
          return;
        }
        const latest = reports[0];

        // Map dailyRiskCurve → last 30 values → { day, score }
        if (Array.isArray(latest.dailyRiskCurve) && latest.dailyRiskCurve.length > 0) {
          const last30 = latest.dailyRiskCurve.slice(-30);
          setApiRiskTrend(last30.map((value, i) => ({ day: `Day ${i + 1}`, score: value })));
        } else {
          setApiRiskTrend(null);
        }

        // Map topRiskFactors → { signal, weight, severity }
        if (Array.isArray(latest.topRiskFactors) && latest.topRiskFactors.length > 0) {
          setApiRiskSignals(latest.topRiskFactors.map(f => ({
            signal: f.description || f.factor,
            weight: f.impact ?? f.weight ?? 0,
            severity: (f.impact ?? f.weight ?? 0) >= 0.2 ? 'critical' : (f.impact ?? f.weight ?? 0) >= 0.1 ? 'high' : 'moderate',
          })));
        } else {
          setApiRiskSignals(null);
        }

        if (typeof latest.overallRisk === 'number') setApiOverallRisk(latest.overallRisk);
        else setApiOverallRisk(null);
        if (latest.riskLevel) setApiRiskLevel(latest.riskLevel);
        else setApiRiskLevel(null);
      })
      .catch(() => {
        setApiRiskTrend(null);
        setApiRiskSignals(null);
        setApiOverallRisk(null);
        setApiRiskLevel(null);
      })
      .finally(() => setLoading(false));
  }, [selectedCustomer?.id]);

  // Fetch Customer 360 profile when selectedCustomer changes
  useEffect(() => {
    if (!selectedCustomer || !selectedCustomer.id) return;
    let cancelled = false;
    const token = localStorage.getItem('token');
    fetch(`/api/v1/admin/customer-360/${selectedCustomer.id}/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(json => {
        if (cancelled) return;
        const d = json.data || json;
        setApiCustomerProfile(d);
        // Enrich selectedCustomer with full profile data
        const cust = d.customer || {};
        const fp = cust.financialProfile || {};
        const hs = d.healthScore || {};
        const lr = d.latestReport || {};
        setSelectedCustomer(prev => ({
          ...prev,
          name: cust.name || prev.name,
          email: cust.email || prev.email,
          phone: cust.phone || prev.phone,
          accountNumber: cust.accountNumber || prev.accountNumber,
          branch: cust.branchName || prev.branch,
          accountType: cust.accountType || prev.accountType,
          kycStatus: cust.kycStatus || prev.kycStatus,
          riskScore: lr.overallRisk ?? fp.riskScore ?? prev.riskScore,
          riskLevel: lr.riskLevel || prev.riskLevel,
          healthLevel: hs.healthLevel || prev.healthLevel,
          lifecycleStage: hs.lifecycleStage || prev.lifecycleStage,
          engagementTrend: hs.engagementTrend || prev.engagementTrend,
          digitalAdoption: hs.digitalAdoption ?? prev.digitalAdoption,
          aum: fp.currentBalance ?? prev.aum,
          customerSince: cust.createdAt || prev.customerSince,
        }));
      })
      .catch(() => { if (!cancelled) setApiCustomerProfile(null); });
    return () => { cancelled = true; };
  }, [selectedCustomer?.id]);

  // Lazy-load tab-specific data when activeTab changes
  useEffect(() => {
    if (!selectedCustomer || !selectedCustomer.id) return;
    let cancelled = false;
    const token = localStorage.getItem('token');
    const userId = selectedCustomer.id;
    const base = `/api/v1/admin/customer-360/${userId}`;
    const hdrs = { 'Authorization': `Bearer ${token}` };

    if (activeTab === 'transactions' && apiTransactions === null) {
      fetch(`${base}/transactions?limit=20`, { headers: hdrs })
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(json => {
          if (cancelled) return;
          const txns = (json.data?.transactions || []).map(t => ({
            id: t.id,
            date: t.transactionDate ? t.transactionDate.slice(0, 10) : '',
            type: t.type,
            category: t.category || '',
            amount: t.amount,
            desc: t.description || '',
            anomaly: false,
            anomalyReason: null,
          }));
          setApiTransactions(txns);
        })
        .catch(() => { if (!cancelled) setApiTransactions(null); });
    }

    if (activeTab === 'interactions' && apiInteractions === null) {
      // Aggregate SAGE history + outreach + complaints into a single timeline
      const fetches = [
        fetch(`${base}/sage-history`, { headers: hdrs }).then(r => r.ok ? r.json() : { data: [] }),
        fetch(`${base}/outreach`, { headers: hdrs }).then(r => r.ok ? r.json() : { data: [] }),
        fetch(`${base}/complaints`, { headers: hdrs }).then(r => r.ok ? r.json() : { data: [] }),
      ];
      Promise.all(fetches)
        .then(([sageJson, outreachJson, complaintsJson]) => {
          if (cancelled) return;
          const sageItems = (Array.isArray(sageJson.data) ? sageJson.data : []).map(s => ({
            date: s.createdAt ? s.createdAt.slice(0, 10) : '',
            type: 'SAGE',
            channel: 'App',
            summary: s.topic || s.userMessage || 'SAGE interaction',
            sentiment: s.helpful === true ? 'Positive' : s.helpful === false ? 'Negative' : null,
            status: s.helpful === true ? 'Helpful' : s.helpful === false ? 'Not Helpful' : 'No Feedback',
          }));
          const outreachItems = (Array.isArray(outreachJson.data) ? outreachJson.data : []).map(o => ({
            date: o.createdAt ? o.createdAt.slice(0, 10) : '',
            type: 'OUTREACH',
            channel: o.channel || 'Unknown',
            summary: o.campaign?.name || 'Outreach',
            sentiment: null,
            status: o.status || 'Sent',
          }));
          const complaintItems = (Array.isArray(complaintsJson.data) ? complaintsJson.data : []).map(c => ({
            date: c.createdAt ? c.createdAt.slice(0, 10) : '',
            type: 'COMPLAINT',
            channel: 'App',
            summary: c.subject || c.category || 'Complaint',
            sentiment: 'Negative',
            status: c.status || 'Open',
          }));
          const merged = [...sageItems, ...outreachItems, ...complaintItems]
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
          setApiInteractions(merged);
        })
        .catch(() => { if (!cancelled) setApiInteractions(null); });
    }

    if (activeTab === 'cases' && apiCases === null && apiOffers === null) {
      fetch(`${base}/retention`, { headers: hdrs })
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(json => {
          if (cancelled) return;
          const d = json.data || {};
          const mappedCases = (d.journeys || []).map(j => ({
            id: j.id || `RC-${j.id}`,
            type: j.triggerType || 'CHURN_RISK',
            priority: j.rootCause ? 'HIGH' : 'MODERATE',
            status: j.outcome || j.stage || 'IN_PROGRESS',
            assignedTo: '—',
            createdAt: j.detectedAt ? j.detectedAt.slice(0, 10) : '',
            sla: j.resolvedAt ? 'Met' : 'Pending',
            aumAtRisk: 0,
          }));
          const mappedOffers = (d.offers || []).map(o => ({
            id: o.id || `OF-${o.id}`,
            type: o.offerLibrary?.category || 'RETENTION',
            name: o.offerLibrary?.name || o.explanationWhat || 'Retention Offer',
            status: o.status || 'PENDING',
            sentDate: o.createdAt ? o.createdAt.slice(0, 10) : null,
            response: o.customerResponse || null,
            channel: o.channel || '—',
          }));
          setApiCases(mappedCases);
          setApiOffers(mappedOffers);
        })
        .catch(() => {
          if (!cancelled) { setApiCases(null); setApiOffers(null); }
        });
    }

    if (activeTab === 'products' && apiProducts === null) {
      fetch(`${base}/products`, { headers: hdrs })
        .then(r => r.ok ? r.json() : Promise.reject(r))
        .then(json => {
          if (cancelled) return;
          const items = json.data?.products || [];
          setApiProducts(items);
        })
        .catch(() => { if (!cancelled) setApiProducts(null); });
    }

    return () => { cancelled = true; };
  }, [activeTab, selectedCustomer?.id]);

  // Filtered customer list for the search dropdown
  const filteredCustomers = searchQuery.trim().length > 0
    ? customers.filter(c => {
        const q = searchQuery.toLowerCase();
        return (c.name && c.name.toLowerCase().includes(q))
          || (c.accountNumber && c.accountNumber.toLowerCase().includes(q))
          || (c.email && c.email.toLowerCase().includes(q))
          || (String(c.id).toLowerCase().includes(q));
      })
    : [];

  const handleSelectCustomer = (customer) => {
    // Normalize API customer shape to match what the header card expects
    setSelectedCustomer({
      ...customerData, // keep mock as fallback for fields not in API
      id: customer.id,
      name: customer.name || customerData.name,
      email: customer.email || customerData.email,
      phone: customer.phone || customerData.phone,
      accountNumber: customer.accountNumber || customerData.accountNumber,
      riskScore: customer.financialProfile?.riskScore ?? customerData.riskScore,
      riskLevel: customer.lastReport?.riskLevel ?? customerData.riskLevel,
    });
    setSearchQuery('');
    setShowSearchDropdown(false);
    // Reset tab-specific data for new customer
    setApiTransactions(null);
    setApiInteractions(null);
    setApiCases(null);
    setApiOffers(null);
    setApiProducts(null);
    setApiCustomerProfile(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'products', label: 'Products', icon: Briefcase },
    { id: 'risk', label: 'Risk Profile', icon: AlertTriangle },
    { id: 'interactions', label: 'Interactions', icon: MessageSquare },
    { id: 'cases', label: 'Cases & Offers', icon: ClipboardList },
  ];

  const getRiskBadge = (level) => {
    const map = { CRITICAL: 'badge-red', HIGH: 'badge-yellow', MODERATE: 'badge-yellow', LOW: 'badge-green', AT_RISK: 'badge-red', HEALTHY: 'badge-green', THRIVING: 'badge-blue' };
    return map[level] || 'badge-blue';
  };

  const txnSource = apiTransactions || transactions;
  const filteredTxns = txnFilter === 'ALL' ? txnSource : txnFilter === 'ANOMALY' ? txnSource.filter(t => t.anomaly) : txnSource.filter(t => t.type === txnFilter);

  // Build overview metrics from API profile or fall back to mock
  const displayMetrics = (() => {
    if (!apiCustomerProfile) return overviewMetrics;
    const cp = apiCustomerProfile;
    const cust = cp.customer || {};
    const fp = cust.financialProfile || {};
    const hs = cp.healthScore || {};
    const lr = cp.latestReport || {};
    const bal = fp.currentBalance;
    const aumStr = bal != null ? `₹${(bal / 100000).toFixed(2)}L` : overviewMetrics[0].value;
    const riskVal = lr.overallRisk ?? fp.riskScore;
    const yearsSince = cust.createdAt ? ((Date.now() - new Date(cust.createdAt).getTime()) / (365.25 * 86400000)).toFixed(1) : null;
    return [
      { ...overviewMetrics[0], value: aumStr },
      { ...overviewMetrics[1], value: riskVal != null ? riskVal.toFixed(2) : overviewMetrics[1].value },
      { ...overviewMetrics[2], value: (hs.healthLevel || overviewMetrics[2].value).replace('_', ' ') },
      { ...overviewMetrics[3], value: (hs.lifecycleStage || overviewMetrics[3].value).replace('_', ' ') },
      { ...overviewMetrics[4], value: (hs.engagementTrend || overviewMetrics[4].value).replace('_', ' ') },
      { ...overviewMetrics[5], value: hs.digitalAdoption != null ? `${Math.round(hs.digitalAdoption * 100)}%` : overviewMetrics[5].value },
      { ...overviewMetrics[6], value: hs.complaintVelocity != null ? String(hs.complaintVelocity) : overviewMetrics[6].value },
      { ...overviewMetrics[7], value: yearsSince ? `${yearsSince} yrs` : overviewMetrics[7].value, change: cust.createdAt ? cust.createdAt.slice(0, 10) : overviewMetrics[7].change },
    ];
  })();

  const productRiskData = [
    { name: 'Critical', value: 1, color: '#ef4444' },
    { name: 'High', value: 2, color: '#f97316' },
    { name: 'Moderate', value: 1, color: '#f59e0b' },
    { name: 'Low', value: 1, color: '#10b981' },
  ];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Customer 360°</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Complete customer lifecycle view — risk, behavior, interactions, and retention actions</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="admin-filter-bar" style={{ marginBottom: 24, position: 'relative' }}>
        <Search size={18} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search by customer name, account number, or ID..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
          onFocus={() => setShowSearchDropdown(true)}
          style={{ flex: 1, minWidth: 300 }}
        />
        <button className="action-btn primary" onClick={() => setShowSearchDropdown(true)}>
          <Search size={14} /> Search
        </button>
        {showSearchDropdown && filteredCustomers.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
            background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)',
            borderRadius: 8, marginTop: 4, maxHeight: 280, overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            {filteredCustomers.slice(0, 10).map(c => (
              <div
                key={c.id}
                onClick={() => handleSelectCustomer(c)}
                style={{
                  padding: '10px 16px', cursor: 'pointer',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {c.accountNumber && `A/C: ${c.accountNumber}`}{c.email && ` • ${c.email}`}
                  </div>
                </div>
                {c.financialProfile?.riskScore != null && (
                  <span className={`badge ${c.financialProfile.riskScore >= 0.7 ? 'badge-red' : c.financialProfile.riskScore >= 0.4 ? 'badge-yellow' : 'badge-green'}`}>
                    {c.financialProfile.riskScore.toFixed(2)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Header Card */}
      {selectedCustomer && (
        <div className="admin-panel" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '1.4rem', fontWeight: 800,
                boxShadow: '0 0 20px rgba(239,68,68,0.3)'
              }}>RK</div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>{selectedCustomer.name}</h3>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <CreditCard size={12} style={{ marginRight: 4 }} />A/C: {selectedCustomer.accountNumber}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <Building size={12} style={{ marginRight: 4 }} />{selectedCustomer.branch}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <User size={12} style={{ marginRight: 4 }} />RM: {selectedCustomer.rm}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className={`badge ${getRiskBadge(selectedCustomer.riskLevel)}`} style={{ fontWeight: 700 }}>
                    Risk: {selectedCustomer.riskScore.toFixed(2)} — {selectedCustomer.riskLevel}
                  </span>
                  <span className={`badge ${getRiskBadge(selectedCustomer.healthLevel)}`}>
                    {selectedCustomer.healthLevel}
                  </span>
                  <span className="badge badge-purple">{selectedCustomer.lifecycleStage}</span>
                  <span className="badge badge-blue">{selectedCustomer.accountType}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="action-btn primary" onClick={() => { setComingSoonFeature('Create Case'); setShowComingSoonModal(true); }}><ClipboardList size={14} /> Create Case</button>
              <button className="action-btn" onClick={() => { setComingSoonFeature('Send Outreach'); setShowComingSoonModal(true); }}><Send size={14} /> Send Outreach</button>
              <button className="action-btn" onClick={() => { setComingSoonFeature('SAGE History'); setShowComingSoonModal(true); }}><MessageSquare size={14} /> SAGE History</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          {/* Metric Cards */}
          <div className="admin-grid admin-grid-4" style={{ marginBottom: 24 }}>
            {displayMetrics.map((m, i) => (
              <div key={i} className="metric-card-mini">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="metric-label">{m.label}</span>
                  <m.icon size={16} style={{ color: m.color }} />
                </div>
                <span className="metric-value" style={{ color: m.color }}>{m.value}</span>
                <span className={`metric-trend ${m.trend}`}>
                  {m.trend === 'up' ? <ArrowUpRight size={12} /> : m.trend === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                  {m.change}
                </span>
              </div>
            ))}
          </div>

          {/* Risk Score Trend */}
          <div className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="admin-panel-header">
              <span className="admin-panel-title"><TrendingUp size={16} /> 30-Day Risk Score Trend</span>
              <span className="live-indicator">Live</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={apiRiskTrend || riskScoreTrend}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} interval={4} />
                <YAxis domain={[0.4, 1]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid #2d3748', borderRadius: 8, color: '#f0f4ff' }} />
                <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} fill="url(#riskGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="fade-in">
          {/* Transaction Filters */}
          <div className="admin-filter-bar" style={{ marginBottom: 16 }}>
            <span className="filter-label">Filter:</span>
            {['ALL', 'ANOMALY', 'CREDIT', 'DEBIT'].map(f => (
              <button key={f} className={`action-btn ${txnFilter === f ? 'primary' : ''}`} onClick={() => setTxnFilter(f)} style={{ fontSize: '0.75rem' }}>
                {f === 'ANOMALY' ? '⚠️ Anomalies Only' : f}
              </button>
            ))}
          </div>

          <div className="admin-panel">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th>AI Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTxns.map(txn => (
                    <tr key={txn.id} style={txn.anomaly ? { background: 'rgba(239,68,68,0.06)', borderLeft: '3px solid var(--accent-red)' } : {}}>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{txn.date}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{txn.desc}</div>
                      </td>
                      <td><span className="inline-tag">{txn.category}</span></td>
                      <td>
                        <span className={`badge ${txn.type === 'CREDIT' ? 'badge-green' : 'badge-red'}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: txn.type === 'CREDIT' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td>
                        {txn.anomaly ? (
                          <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: 4, maxWidth: 240 }}>
                            <AlertTriangle size={12} /> {txn.anomalyReason}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="fade-in">
          <div className="admin-grid admin-grid-2" style={{ marginBottom: 24 }}>
            {(apiProducts || products).map((p, i) => (
              <div key={i} className="admin-panel" style={{
                borderLeft: `3px solid ${p.status === 'Cancelled' ? 'var(--accent-red)' : p.status === 'Maturing Soon' ? 'var(--accent-yellow)' : 'var(--accent-blue)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{p.name}</h4>
                    <span className="inline-tag" style={{ marginRight: 6 }}>{p.type}</span>
                    <span className={`badge ${p.status === 'Active' ? 'badge-green' : p.status === 'Cancelled' ? 'badge-red' : 'badge-yellow'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: p.balance < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                      {p.balance < 0 ? '-' : ''}₹{Math.abs(p.balance).toLocaleString('en-IN')}
                    </div>
                    <span className={`metric-trend ${p.trend}`} style={{ fontSize: '0.75rem' }}>
                      {p.trend === 'down' ? <ArrowDownRight size={12} /> : p.trend === 'up' ? <ArrowUpRight size={12} /> : <Minus size={12} />}
                      {p.change}
                    </span>
                  </div>
                </div>
                {/* Mini sparkline representation */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 30, marginTop: 8 }}>
                  {p.sparkline.map((v, j) => (
                    <div key={j} style={{
                      flex: 1, height: `${(v / 15) * 100}%`, minHeight: 2,
                      background: p.status === 'Cancelled' ? 'var(--accent-red)' : 'var(--accent-blue)',
                      opacity: 0.3 + (j / p.sparkline.length) * 0.7,
                      borderRadius: '2px 2px 0 0',
                    }} />
                  ))}
                </div>
                {p.maturity && (
                  <div style={{ marginTop: 10, fontSize: '0.78rem', color: p.status === 'Maturing Soon' ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>
                    <Calendar size={12} /> Maturity: {p.maturity}
                    {p.status === 'Maturing Soon' && <span style={{ marginLeft: 8, fontWeight: 700 }}>⚠️ 19 days away</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="fade-in">
          <div className="admin-grid admin-grid-2-1" style={{ marginBottom: 24 }}>
            {/* Risk Signals */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <span className="admin-panel-title"><Brain size={16} /> Churn DNA — Signal Attribution</span>
                <span className="admin-panel-subtitle">GNN Feature Importance</span>
              </div>
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-red)' }}>{apiOverallRisk != null ? apiOverallRisk.toFixed(2) : '0.87'}</div>
                <div>
                  <span className="badge badge-red" style={{ fontWeight: 700 }}>{apiRiskLevel || 'CRITICAL'}</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>AI Confidence: 91% • Similar Cases: 142</div>
                </div>
              </div>

              {(apiRiskSignals || riskSignals).map((s, i) => (
                <div key={i} className="attribution-bar">
                  <span className="signal-label">
                    <span style={{ marginRight: 8, color: riskColors[i], fontWeight: 700 }}>{i + 1}.</span>
                    {s.signal}
                  </span>
                  <div className="signal-bar">
                    <div className="signal-fill" style={{ width: `${s.weight * 100 * 3}%`, background: `linear-gradient(90deg, ${riskColors[i]}, ${riskColors[i]}88)` }} />
                  </div>
                  <span className="signal-weight" style={{ color: riskColors[i] }}>+{s.weight.toFixed(2)}</span>
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button className="action-btn" onClick={() => setShowChallengeModal(true)}>
                  <Shield size={14} /> Challenge This Score
                </button>
                <button className="action-btn" onClick={() => { setComingSoonFeature('View Full Signal History'); setShowComingSoonModal(true); }}><Eye size={14} /> View Full Signal History</button>
                <button className="action-btn" onClick={() => { setComingSoonFeature('Run What-If'); setShowComingSoonModal(true); }}><Zap size={14} /> Run What-If</button>
              </div>
            </div>

            {/* Network Contagion */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <span className="admin-panel-title"><Globe size={16} /> Network Contagion</span>
              </div>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                {/* Central node */}
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444, #f87171)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '0.75rem',
                  boxShadow: '0 0 20px rgba(239,68,68,0.4)', margin: '0 auto 24px',
                }}>RK<br />0.87</div>
              </div>

              {linkedAccounts.map((acc, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: 'var(--bg-secondary)', borderRadius: 8, marginBottom: 8,
                  borderLeft: `3px solid ${acc.risk > 0.5 ? 'var(--accent-yellow)' : 'var(--accent-green)'}`
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: acc.risk > 0.5 ? 'rgba(249,115,22,0.2)' : 'rgba(16,185,129,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: acc.risk > 0.5 ? '#f97316' : '#10b981', fontWeight: 700, fontSize: '0.7rem'
                  }}>{acc.risk.toFixed(2)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{acc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{acc.relationship}</div>
                  </div>
                  <span className={`badge ${getRiskBadge(acc.status)}`}>{acc.status}</span>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: 12, background: 'rgba(239,68,68,0.06)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--accent-red)' }}>
                <AlertTriangle size={14} style={{ marginRight: 6 }} />
                Spouse account shows similar disengagement — potential household churn risk
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interactions' && (
        <div className="fade-in">
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Activity size={16} /> Interaction Timeline</span>
              <span className="admin-panel-subtitle">{(apiInteractions || interactions).length} touchpoints</span>
            </div>
            <div className="timeline">
              {(apiInteractions || interactions).map((item, i) => {
                const typeColor = {
                  OUTREACH: 'var(--accent-blue)', SAGE: 'var(--accent-purple)', CALL: 'var(--accent-green)',
                  COMPLAINT: 'var(--accent-red)', BRANCH: 'var(--accent-yellow)'
                };
                const sentimentColor = {
                  Positive: 'var(--accent-green)', Negative: 'var(--accent-red)', Neutral: 'var(--text-muted)'
                };
                return (
                  <div key={i} className={`timeline-item ${item.sentiment === 'Negative' ? 'danger' : item.sentiment === 'Positive' ? 'success' : ''}`}>
                    <div className="timeline-time">{item.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className="badge" style={{ background: `${typeColor[item.type]}22`, color: typeColor[item.type], fontWeight: 700 }}>
                        {item.type}
                      </span>
                      <span className="inline-tag">{item.channel}</span>
                      <span className="timeline-content">{item.summary}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      {item.sentiment && (
                        <span style={{ fontSize: '0.72rem', color: sentimentColor[item.sentiment] }}>
                          Sentiment: {item.sentiment}
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status: {item.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cases' && (
        <div className="fade-in">
          {/* Active Cases */}
          <div className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="admin-panel-header">
              <span className="admin-panel-title"><ClipboardList size={16} /> Retention Cases</span>
              <button className="action-btn primary" onClick={() => { setComingSoonFeature('Create New Case'); setShowComingSoonModal(true); }}><ClipboardList size={14} /> Create New Case</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>SLA</th>
                    <th>AUM at Risk</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(apiCases || cases).map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem' }}>{c.id}</td>
                      <td><span className={`badge ${c.type === 'CHURN_RISK' ? 'badge-red' : 'badge-yellow'}`}>{c.type.replace('_', ' ')}</span></td>
                      <td><span className={`badge ${c.priority === 'CRITICAL' ? 'badge-red' : 'badge-yellow'}`}>{c.priority}</span></td>
                      <td><span className={`badge ${c.status === 'RESOLVED' ? 'badge-green' : 'badge-blue'}`}>{c.status}</span></td>
                      <td style={{ fontSize: '0.85rem' }}>{c.assignedTo}</td>
                      <td>
                        <span className={`sla-timer ${c.sla === 'Met' ? 'within-sla' : 'warning-sla'}`}>
                          <Clock size={12} /> {c.sla}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {c.aumAtRisk > 0 ? `₹${(c.aumAtRisk / 100000).toFixed(1)}L` : '—'}
                      </td>
                      <td>
                        <button className="action-btn" style={{ fontSize: '0.72rem' }} onClick={() => { setComingSoonFeature('View Case Details'); setShowComingSoonModal(true); }}><Eye size={12} /> View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Offers */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Gift size={16} /> Retention Offers</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Offer</th>
                    <th>Type</th>
                    <th>Channel</th>
                    <th>Status</th>
                    <th>Sent Date</th>
                    <th>Response</th>
                  </tr>
                </thead>
                <tbody>
                  {(apiOffers || offers).map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{o.name}</td>
                      <td><span className="inline-tag">{o.type}</span></td>
                      <td><span className="badge badge-blue">{o.channel}</span></td>
                      <td><span className={`badge ${o.status === 'SENT' ? 'badge-green' : 'badge-yellow'}`}>{o.status}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{o.sentDate || '—'}</td>
                      <td>
                        {o.response ? (
                          <span className={`badge ${o.response === 'IGNORED' ? 'badge-red' : 'badge-green'}`}>{o.response}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Score Modal */}
      {showChallengeModal && (
        <div className="admin-modal-overlay" onClick={() => setShowChallengeModal(false)}>
          <div className="admin-modal admin-modal-md" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Challenge Risk Score</h3>
              <button className="admin-modal-close" onClick={() => setShowChallengeModal(false)}><X size={16} /></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Customer</span>
                  <span style={{ fontWeight: 700 }}>{selectedCustomer.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Current Score</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-red)' }}>{selectedCustomer.riskScore}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Challenge Reason *</label>
                <select className="form-input" value={challengeReason} onChange={e => setChallengeReason(e.target.value)}>
                  <option value="">Select reason...</option>
                  <option value="KNOWN_CONTEXT">Known context not captured by model</option>
                  <option value="FALSE_SIGNAL">False signal — data quality issue</option>
                  <option value="LIFE_EVENT">Life event (job change, relocation)</option>
                  <option value="CUSTOMER_CONFIRMATION">Customer confirmed retention intent</option>
                  <option value="OTHER">Other (specify below)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Context</label>
                <textarea className="form-input" rows={4} placeholder="Provide specific context that the model may have missed..." style={{ resize: 'vertical' }} />
              </div>

              <div style={{ padding: 12, background: 'rgba(59,130,246,0.06)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--accent-blue)' }}>
                <FileText size={14} style={{ marginRight: 6 }} />
                This challenge will be logged in the AI Governance audit trail and reviewed by the model oversight team within 48 hours.
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowChallengeModal(false)}>Cancel</button>
              <button className="action-btn primary">Submit Challenge</button>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoonModal && (
        <div className="admin-modal-overlay" onClick={() => setShowComingSoonModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500, padding: 32 }}>
            <div style={{ position: 'relative' }}>
              <button className="admin-modal-close" onClick={() => setShowComingSoonModal(false)}><X size={16} /></button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <Layers size={24} color="#f59e0b" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{comingSoonFeature}</h2>
                <span style={{
                  marginTop: 6,
                  padding: '4px 10px', borderRadius: 100,
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  fontSize: '0.65rem', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#f59e0b',
                    boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)',
                    animation: 'pulseNotif 2s infinite',
                  }} />
                  Under Development
                </span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 24 }}>
              The <strong>{comingSoonFeature}</strong> module is currently under active development. Our engineering team is integrating the necessary backend APIs and ML models.
            </p>

            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
              padding: 20, marginBottom: 24, border: '1px solid var(--border-color)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
                Implementation Pipeline
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)' }}>
                    <Check size={12} color="white" />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'center' }}>UI Design</span>
                </div>
                <div style={{ flex: 1, height: 2, background: '#10b981', alignSelf: 'center', marginTop: '-20px' }} />
                
                {/* Step 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#3b82f6', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)' }}>
                    <Sparkles size={10} color="white" />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' }}>API Binding</span>
                </div>
                <div style={{ flex: 1, height: 2, background: 'var(--border-strong)', alignSelf: 'center', marginTop: '-20px' }} />
                
                {/* Step 3 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'transparent', border: '2px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', textAlign: 'center' }}>Production</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="action-btn primary" onClick={() => setShowComingSoonModal(false)}>Acknowledge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
