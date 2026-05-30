import { useState, useEffect, useMemo } from 'react';
import {
  Brain, Shield, AlertTriangle, CheckCircle, XCircle, Eye, TrendingUp, TrendingDown,
  BarChart3, Users, Scale, FileText, Clock, Search, Filter, ChevronDown, ChevronUp,
  ThumbsUp, ThumbsDown, ArrowRight, RefreshCw, Lock, Unlock, GitBranch, Layers,
  Target, Zap, DollarSign, Award, MapPin, UserCheck, AlertCircle, Activity,
  ShieldCheck, Database, Link, Fingerprint, Settings, Calendar, Download, X
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// ═══════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════

const rollingAccuracyData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  critical: 87 + Math.random() * 8,
  high: 82 + Math.random() * 10,
  moderate: 78 + Math.random() * 12,
}));

const calibrationData = [
  { predicted: 10, actual: 8.5 }, { predicted: 20, actual: 18.2 }, { predicted: 30, actual: 27.6 },
  { predicted: 40, actual: 38.4 }, { predicted: 50, actual: 46.8 }, { predicted: 60, actual: 58.1 },
  { predicted: 70, actual: 67.5 }, { predicted: 80, actual: 76.9 }, { predicted: 85, actual: 83.2 },
  { predicted: 90, actual: 88.4 }, { predicted: 95, actual: 93.7 },
];

const predictionMetrics = [
  { label: 'Overall Accuracy', value: '91.3%', trend: '+1.8%', trendUp: true, color: 'var(--accent-green)', icon: Target },
  { label: 'False Positive Rate', value: '6.2%', trend: '-0.9%', trendUp: false, color: 'var(--accent-yellow)', icon: AlertTriangle },
  { label: 'False Negative Rate', value: '2.5%', trend: '-0.3%', trendUp: false, color: 'var(--accent-red)', icon: XCircle },
  { label: 'AUC-ROC Score', value: '0.947', trend: '+0.012', trendUp: true, color: 'var(--accent-blue)', icon: Activity },
  { label: 'Precision (Critical)', value: '93.8%', trend: '+2.1%', trendUp: true, color: 'var(--accent-purple)', icon: Zap },
  { label: 'Recall (Critical)', value: '89.4%', trend: '+1.4%', trendUp: true, color: 'var(--accent-cyan)', icon: Eye },
];

const challengeEntries = [
  { id: 'CH-001', customer: 'Rajesh Sharma', customerId: 'CIF-20045', challenger: 'Priya Mehta (RM)', originalScore: 87, challengeReason: 'Customer recently renewed FD of ₹12L — Score does not reflect fresh commitment', status: 'OVERRIDDEN', reviewer: 'Anil Kumar (AVP)', adjustedScore: 52, date: '2026-05-25' },
  { id: 'CH-002', customer: 'Sunita Devi', customerId: 'CIF-18923', challenger: 'Ravi Gupta (RM)', originalScore: 34, challengeReason: 'Customer has verbally expressed intent to close all accounts — model shows low risk', status: 'UPHELD', reviewer: 'Meera Joshi (VP)', adjustedScore: 78, date: '2026-05-24' },
  { id: 'CH-003', customer: 'Amit Patel', customerId: 'CIF-31056', challenger: 'Neha Singh (RM)', originalScore: 92, challengeReason: 'Salary account shift was employer-mandated, not voluntary — context missing', status: 'REVIEWED', reviewer: 'Vikram Rao (AVP)', adjustedScore: null, date: '2026-05-24' },
  { id: 'CH-004', customer: 'Kavitha Reddy', customerId: 'CIF-27891', challenger: 'Sanjay Deshmukh (BM)', originalScore: 71, challengeReason: 'Balance drop was due to property purchase — customer has new mortgage application', status: 'OVERRIDDEN', reviewer: 'Anil Kumar (AVP)', adjustedScore: 38, date: '2026-05-23' },
  { id: 'CH-005', customer: 'Mohammed Irfan', customerId: 'CIF-15432', challenger: 'Deepa Nair (RM)', originalScore: 45, challengeReason: 'Customer complained about service twice this week — not reflected in score yet', status: 'OPEN', reviewer: null, adjustedScore: null, date: '2026-05-23' },
  { id: 'CH-006', customer: 'Lakshmi Iyer', customerId: 'CIF-22871', challenger: 'Admin Override', originalScore: 88, challengeReason: 'False Positive — customer flagged Critical but has 15yr relationship, just travel abroad', status: 'OVERRIDDEN', reviewer: 'System Admin', adjustedScore: 25, date: '2026-05-22' },
  { id: 'CH-007', customer: 'Arjun Kapoor', customerId: 'CIF-34210', challenger: 'Pooja Sharma (RM)', originalScore: 28, challengeReason: 'False Negative — customer already moved primary salary to competitor', status: 'UPHELD', reviewer: 'Meera Joshi (VP)', adjustedScore: 91, date: '2026-05-21' },
  { id: 'CH-008', customer: 'Fatima Begum', customerId: 'CIF-19087', challenger: 'Rahul Verma (RM)', originalScore: 63, challengeReason: 'Customer expressed dissatisfaction during branch visit — RM believes score should be higher risk', status: 'OPEN', reviewer: null, adjustedScore: null, date: '2026-05-21' },
  { id: 'CH-009', customer: 'Vivek Menon', customerId: 'CIF-41029', challenger: 'Anjali Das (BM)', originalScore: 95, challengeReason: 'Digital engagement dropped but customer is 78yr old — digital not relevant metric', status: 'REVIEWED', reviewer: 'Vikram Rao (AVP)', adjustedScore: null, date: '2026-05-20' },
  { id: 'CH-010', customer: 'Geeta Bhandari', customerId: 'CIF-28745', challenger: 'Suresh Jain (RM)', originalScore: 55, challengeReason: 'Customer opened new PPF account last week — positive signal not yet captured', status: 'OVERRIDDEN', reviewer: 'Anil Kumar (AVP)', adjustedScore: 32, date: '2026-05-19' },
];

const overrideTrendData = [
  { month: 'Dec', overrides: 12, challenges: 18, total: 30 },
  { month: 'Jan', overrides: 15, challenges: 22, total: 37 },
  { month: 'Feb', overrides: 11, challenges: 19, total: 30 },
  { month: 'Mar', overrides: 18, challenges: 25, total: 43 },
  { month: 'Apr', overrides: 14, challenges: 28, total: 42 },
  { month: 'May', overrides: 16, challenges: 31, total: 47 },
];

const acceptanceByType = [
  { type: 'Rate Renegotiation', acceptance: 78, count: 245 },
  { type: 'Fee Waiver', acceptance: 92, count: 189 },
  { type: 'Product Upgrade', acceptance: 65, count: 312 },
  { type: 'Relationship Call', acceptance: 84, count: 567 },
  { type: 'Digital Onboarding', acceptance: 71, count: 134 },
  { type: 'Loyalty Reward', acceptance: 96, count: 98 },
  { type: 'Branch Visit Invite', acceptance: 43, count: 78 },
  { type: 'Financial Review', acceptance: 58, count: 201 },
];

const acceptanceTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i],
  rate: 68 + Math.random() * 20,
}));

const rmAcceptanceBreakdown = [
  { rm: 'Priya Mehta', branch: 'Andheri West', accepted: 45, total: 52, rate: 86.5 },
  { rm: 'Ravi Gupta', branch: 'Bandra East', accepted: 38, total: 61, rate: 62.3 },
  { rm: 'Neha Singh', branch: 'Powai', accepted: 51, total: 55, rate: 92.7 },
  { rm: 'Sanjay Deshmukh', branch: 'Thane', accepted: 29, total: 48, rate: 60.4 },
  { rm: 'Deepa Nair', branch: 'Dadar', accepted: 47, total: 49, rate: 95.9 },
  { rm: 'Rahul Verma', branch: 'Borivali', accepted: 33, total: 44, rate: 75.0 },
  { rm: 'Pooja Sharma', branch: 'Churchgate', accepted: 42, total: 50, rate: 84.0 },
  { rm: 'Suresh Jain', branch: 'Malad', accepted: 19, total: 42, rate: 45.2 },
];

const biasDistribution = [
  { category: 'Age 18-30', portfolioShare: 22, criticalShare: 28, ratio: 1.27 },
  { category: 'Age 31-45', portfolioShare: 35, criticalShare: 33, ratio: 0.94 },
  { category: 'Age 46-60', portfolioShare: 28, criticalShare: 24, ratio: 0.86 },
  { category: 'Age 60+', portfolioShare: 15, criticalShare: 15, ratio: 1.00 },
  { category: 'Male', portfolioShare: 58, criticalShare: 55, ratio: 0.95 },
  { category: 'Female', portfolioShare: 42, criticalShare: 45, ratio: 1.07 },
  { category: 'Metro', portfolioShare: 45, criticalShare: 42, ratio: 0.93 },
  { category: 'Tier-1', portfolioShare: 30, criticalShare: 31, ratio: 1.03 },
  { category: 'Tier-2', portfolioShare: 18, criticalShare: 19, ratio: 1.06 },
  { category: 'Rural', portfolioShare: 7, criticalShare: 8, ratio: 1.14 },
];

const dataLineage = [
  { feature: 'Transaction Velocity', source: 'CBS Core Banking', table: 'txn_master', refreshFreq: 'Real-time (CDC)', lastSync: '2 min ago', piiFlag: false },
  { feature: 'Login Frequency', source: 'Mobile App Analytics', table: 'app_events', refreshFreq: 'Every 5 min', lastSync: '4 min ago', piiFlag: false },
  { feature: 'Balance Trend', source: 'CBS Core Banking', table: 'account_balance_hist', refreshFreq: 'Daily batch', lastSync: '6 hrs ago', piiFlag: false },
  { feature: 'Complaint Score', source: 'CRM System', table: 'complaint_registry', refreshFreq: 'Real-time (Kafka)', lastSync: '1 min ago', piiFlag: true },
  { feature: 'Product Holding Count', source: 'Product Master', table: 'product_customer_map', refreshFreq: 'Daily batch', lastSync: '6 hrs ago', piiFlag: false },
  { feature: 'Salary Credit Pattern', source: 'CBS Core Banking', table: 'txn_master', refreshFreq: 'Real-time (CDC)', lastSync: '2 min ago', piiFlag: true },
  { feature: 'Digital Channel Usage', source: 'Channel Analytics', table: 'channel_usage_agg', refreshFreq: 'Hourly', lastSync: '45 min ago', piiFlag: false },
  { feature: 'Network Contagion', source: 'TGN Engine', table: 'graph_embeddings', refreshFreq: 'Every 6 hrs', lastSync: '3 hrs ago', piiFlag: false },
];

const consentTracking = [
  { category: 'Data Processing Consent', total: 48523, consented: 47891, rate: 98.7, status: 'compliant' },
  { category: 'AI Scoring Disclosure', total: 48523, consented: 46234, rate: 95.3, status: 'compliant' },
  { category: 'Marketing Communication', total: 48523, consented: 38219, rate: 78.8, status: 'compliant' },
  { category: 'Cross-sell Data Sharing', total: 48523, consented: 31456, rate: 64.8, status: 'review' },
  { category: 'Translation API PII Scrub', total: 2340, consented: 2340, rate: 100.0, status: 'compliant' },
];

const pendingApprovals = [
  { id: 'APR-001', requester: 'Priya Mehta (RM)', customer: 'Rajesh Sharma', incentiveType: 'Rate Reduction', value: 25000, authorityLevel: 'Branch Manager', status: 'PENDING', slaHrs: 4, elapsed: 2.5 },
  { id: 'APR-002', requester: 'Ravi Gupta (RM)', customer: 'Sunita Devi', incentiveType: 'Fee Waiver', value: 8500, authorityLevel: 'Branch Manager', status: 'PENDING', slaHrs: 4, elapsed: 1.0 },
  { id: 'APR-003', requester: 'Neha Singh (RM)', customer: 'Amit Patel', incentiveType: 'Loyalty Points', value: 50000, authorityLevel: 'Regional Head', status: 'PENDING', slaHrs: 8, elapsed: 6.5 },
  { id: 'APR-004', requester: 'Sanjay Deshmukh (BM)', customer: 'Kavitha Reddy', incentiveType: 'Cash Incentive', value: 75000, authorityLevel: 'VP Retail', status: 'ESCALATED', slaHrs: 24, elapsed: 18 },
  { id: 'APR-005', requester: 'Deepa Nair (RM)', customer: 'Mohammed Irfan', incentiveType: 'Product Upgrade', value: 15000, authorityLevel: 'Branch Manager', status: 'PENDING', slaHrs: 4, elapsed: 0.5 },
  { id: 'APR-006', requester: 'System (PULSE)', customer: 'Vivek Menon', incentiveType: 'Rate Reduction', value: 120000, authorityLevel: 'VP Retail + CRO', status: 'DUAL_APPROVAL', slaHrs: 48, elapsed: 12 },
];

const incentiveCatalogue = [
  { name: 'Fee Waiver', maxValue: 10000, authorityBM: '₹10,000', authorityRH: '₹25,000', authorityVP: '₹50,000', monthlyBudget: 500000, used: 385000 },
  { name: 'Rate Reduction', maxValue: 50000, authorityBM: '₹25,000', authorityRH: '₹50,000', authorityVP: '₹1,00,000', monthlyBudget: 2000000, used: 1650000 },
  { name: 'Loyalty Points', maxValue: 100000, authorityBM: '₹50,000', authorityRH: '₹1,00,000', authorityVP: '₹2,50,000', monthlyBudget: 1500000, used: 890000 },
  { name: 'Cash Incentive', maxValue: 200000, authorityBM: '—', authorityRH: '₹75,000', authorityVP: '₹2,00,000', monthlyBudget: 3000000, used: 2100000 },
  { name: 'Product Upgrade', maxValue: 25000, authorityBM: '₹15,000', authorityRH: '₹25,000', authorityVP: '₹50,000', monthlyBudget: 800000, used: 420000 },
];

const budgetByBranch = [
  { branch: 'Andheri West', budget: 500000, spent: 420000, pct: 84 },
  { branch: 'Bandra East', budget: 450000, spent: 380000, pct: 84.4 },
  { branch: 'Powai', budget: 600000, spent: 510000, pct: 85 },
  { branch: 'Thane', budget: 350000, spent: 245000, pct: 70 },
  { branch: 'Dadar', budget: 400000, spent: 360000, pct: 90 },
  { branch: 'Borivali', budget: 300000, spent: 195000, pct: 65 },
  { branch: 'Churchgate', budget: 550000, spent: 490000, pct: 89.1 },
  { branch: 'Malad', budget: 280000, spent: 140000, pct: 50 },
];

const escalationRules = [
  { trigger: 'Incentive > ₹50,000', route: 'Regional Head → VP Retail', sla: '8 hrs', active: true },
  { trigger: 'AI Model Override', route: 'BM → AVP Risk', sla: '4 hrs', active: true },
  { trigger: 'Campaign > 5000 recipients', route: 'Marketing Head → CRO', sla: '24 hrs', active: true },
  { trigger: 'Cross-sell to vulnerable', route: 'Compliance Officer', sla: '2 hrs', active: true },
  { trigger: 'Dual Approval (PULSE auto)', route: 'VP Retail + CRO', sla: '48 hrs', active: true },
  { trigger: 'Budget breach > 80%', route: 'Finance Controller', sla: '4 hrs', active: false },
];

const explainabilityLog = [
  { timestamp: '2026-05-27 00:45:12', user: 'Priya Mehta (RM)', role: 'RM', action: 'Viewed Score Breakdown', customer: 'Rajesh Sharma', featureCount: 12 },
  { timestamp: '2026-05-27 00:32:08', user: 'Ravi Gupta (RM)', role: 'RM', action: 'Accessed SHAP Explanation', customer: 'Sunita Devi', featureCount: 8 },
  { timestamp: '2026-05-26 23:58:45', user: 'Anil Kumar (AVP)', role: 'Admin', action: 'Viewed Full Model Report', customer: 'Amit Patel', featureCount: 24 },
  { timestamp: '2026-05-26 22:10:33', user: 'Neha Singh (RM)', role: 'RM', action: 'Viewed Score Breakdown', customer: 'Kavitha Reddy', featureCount: 12 },
  { timestamp: '2026-05-26 21:45:19', user: 'Meera Joshi (VP)', role: 'Admin', action: 'Accessed Bias Report', customer: '— (Portfolio level)', featureCount: 0 },
  { timestamp: '2026-05-26 20:12:55', user: 'Sanjay Deshmukh (BM)', role: 'BM', action: 'Viewed Score Breakdown', customer: 'Mohammed Irfan', featureCount: 12 },
  { timestamp: '2026-05-26 18:30:42', user: 'Deepa Nair (RM)', role: 'RM', action: 'Accessed SHAP Explanation', customer: 'Lakshmi Iyer', featureCount: 10 },
  { timestamp: '2026-05-26 17:05:11', user: 'Rahul Verma (RM)', role: 'RM', action: 'Viewed Score Breakdown', customer: 'Arjun Kapoor', featureCount: 12 },
];

const explainabilityTrend = [
  { week: 'W1', views: 45, shapAccess: 12, fullReports: 3 },
  { week: 'W2', views: 52, shapAccess: 18, fullReports: 5 },
  { week: 'W3', views: 48, shapAccess: 15, fullReports: 4 },
  { week: 'W4', views: 67, shapAccess: 24, fullReports: 8 },
  { week: 'W5', views: 73, shapAccess: 29, fullReports: 11 },
  { week: 'W6', views: 81, shapAccess: 35, fullReports: 14 },
];

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const STATUS_STYLES = {
  OPEN: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  REVIEWED: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  UPHELD: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  OVERRIDDEN: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
  PENDING: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  ESCALATED: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
  DUAL_APPROVAL: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
};

const TABS = [
  { key: 'accuracy', label: 'Prediction Accuracy', icon: Target },
  { key: 'overrides', label: 'Override & Challenge Log', icon: Scale },
  { key: 'acceptance', label: 'Model Acceptance Rate', icon: ThumbsUp },
  { key: 'responsible', label: 'Responsible AI', icon: Shield },
  { key: 'escalation', label: 'Escalation & Approvals', icon: GitBranch },
  { key: 'explainability', label: 'Explainability Audit', icon: Eye },
];

// ═══════════════════════════════════════════
// CUSTOM TOOLTIP
// ═══════════════════════════════════════════

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{ background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '10px 14px', fontSize: '0.78rem' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.color }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export default function AIGovernancePage() {
  const [activeTab, setActiveTab] = useState('accuracy');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [approvalModal, setApprovalModal] = useState(null);

  // Filtered challenge entries
  const filteredChallenges = useMemo(() => {
    return challengeEntries.filter(c => {
      const matchSearch = !searchQuery || c.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.challenger.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Brain size={28} color="var(--accent-purple)" /> AI Governance & Explainability
          </h2>
          <p>Complete oversight of AI model decisions, fairness monitoring, and regulatory compliance</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm">
            <Download size={14} /> Export Report
          </button>
          <button className="btn btn-primary btn-sm">
            <RefreshCw size={14} /> Refresh All
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-color)', marginBottom: 24, overflowX: 'auto', paddingBottom: 0 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'none', border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--accent-purple)' : 'transparent'}`,
                color: isActive ? 'var(--accent-purple)' : 'var(--text-muted)', fontFamily: 'inherit',
                fontSize: '0.8rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 1: PREDICTION ACCURACY */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'accuracy' && (
        <div className="fade-in">
          {/* Metrics Cards */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {predictionMetrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className={`stat-card ${['green', 'yellow', 'red', 'blue', 'purple', 'blue'][i]}`}>
                  <div className={`stat-icon ${['green', 'yellow', 'red', 'blue', 'purple', 'blue'][i]}`}>
                    <Icon size={20} />
                  </div>
                  <div className="stat-value" style={{ color: m.color }}>{m.value}</div>
                  <div className="stat-label">{m.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: '0.75rem', color: m.trendUp ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {m.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    <span>{m.trend} vs last month</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rolling Accuracy Chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><BarChart3 size={18} /> 30-Day Rolling Accuracy by Risk Tier</div>
              <span className="badge badge-blue">Last 30 days</span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={rollingAccuracyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} interval={4} />
                <YAxis domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2.5} name="Critical" dot={false} />
                <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={2} name="High" dot={false} />
                <Line type="monotone" dataKey="moderate" stroke="#3b82f6" strokeWidth={2} name="Moderate" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Calibration Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Activity size={18} /> Calibration Chart — Predicted vs Actual Churn Rate</div>
              <span className="badge badge-green">Well-calibrated</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="predicted" name="Predicted %" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Predicted Probability (%)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 11 }} />
                <YAxis dataKey="actual" name="Actual %" tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'Actual Rate (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter name="Calibration" data={calibrationData} fill="#8b5cf6" r={6} />
                <Line type="monotone" dataKey="predicted" stroke="rgba(148,163,184,0.3)" strokeDasharray="5 5" />
              </ScatterChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
              Perfect calibration = points on the diagonal. Current Brier Score: <strong style={{ color: 'var(--accent-green)' }}>0.042</strong> (excellent)
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 2: OVERRIDE & CHALLENGE LOG */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'overrides' && (
        <div className="fade-in">
          {/* Summary stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'Total Challenges', value: '47', color: 'blue', icon: Scale },
              { label: 'Open / Pending', value: '8', color: 'yellow', icon: Clock },
              { label: 'Overridden', value: '22', color: 'purple', icon: Unlock },
              { label: 'Upheld', value: '12', color: 'green', icon: CheckCircle },
              { label: 'False Positives', value: '6', color: 'red', icon: AlertTriangle },
              { label: 'Override Rate', value: '46.8%', color: 'blue', icon: TrendingUp },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}><Icon size={20} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" placeholder="Search by customer, challenger, ID..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 36 }} />
            </div>
            <select className="form-input" style={{ width: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="UPHELD">Upheld</option>
              <option value="OVERRIDDEN">Overridden</option>
            </select>
          </div>

          {/* Challenges Table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><FileText size={18} /> Score Challenge & Override Log</div>
              <span className="badge badge-purple">{filteredChallenges.length} entries</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Challenger</th>
                    <th>Original</th>
                    <th>Challenge Reason</th>
                    <th>Status</th>
                    <th>Reviewer</th>
                    <th>Adjusted</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChallenges.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{c.id}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{c.customer}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.customerId}</div>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{c.challenger}</td>
                      <td>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: c.originalScore >= 80 ? '#ef4444' : c.originalScore >= 60 ? '#f59e0b' : '#10b981' }}>
                          {c.originalScore}
                        </span>
                      </td>
                      <td style={{ maxWidth: 280, fontSize: '0.78rem', lineHeight: 1.4 }}>{c.challengeReason}</td>
                      <td>
                        <span className="badge" style={{ background: STATUS_STYLES[c.status]?.bg, color: STATUS_STYLES[c.status]?.color }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: c.reviewer ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {c.reviewer || '— Pending —'}
                      </td>
                      <td>
                        {c.adjustedScore !== null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ textDecoration: 'line-through', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.originalScore}</span>
                            <ArrowRight size={12} color="var(--text-muted)" />
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: c.adjustedScore >= 80 ? '#ef4444' : c.adjustedScore >= 60 ? '#f59e0b' : '#10b981' }}>
                              {c.adjustedScore}
                            </span>
                          </div>
                        ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{c.date}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => setSelectedChallenge(c)}>
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Override Trend Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><TrendingUp size={18} /> Override & Challenge Trend (6 months)</div>
              <span className="badge badge-yellow">Trending up ↗</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={overrideTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Bar dataKey="overrides" fill="#8b5cf6" name="Overrides" radius={[4, 4, 0, 0]} />
                <Bar dataKey="challenges" fill="#3b82f6" name="Challenges" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 3: MODEL ACCEPTANCE RATE */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'acceptance' && (
        <div className="fade-in">
          {/* Top Stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'Overall Acceptance', value: '74.6%', color: 'green', icon: ThumbsUp },
              { label: 'Total Recommendations', value: '1,824', color: 'blue', icon: BarChart3 },
              { label: 'Automation Bias Alerts', value: '2', color: 'red', icon: AlertTriangle },
              { label: 'Low Quality Alerts', value: '1', color: 'yellow', icon: AlertCircle },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}><Icon size={20} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Horizontal Bar Chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><BarChart3 size={18} /> Acceptance Rate by Recommendation Type</div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={acceptanceByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis type="category" dataKey="type" width={150} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="acceptance" name="Acceptance %" radius={[0, 6, 6, 0]} barSize={24}>
                  {acceptanceByType.map((entry, i) => (
                    <Cell key={i} fill={entry.acceptance < 50 ? '#ef4444' : entry.acceptance > 95 ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12, fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} /> &lt;50% — Review Quality
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} /> 50-95% — Healthy
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} /> &gt;95% — Automation Bias Risk
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Acceptance Trend */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><TrendingUp size={18} /> Acceptance Rate Over Time</div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={acceptanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={[50, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" fill="rgba(16,185,129,0.15)" name="Acceptance %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* RM Breakdown Table */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Users size={18} /> RM-Level Acceptance Breakdown</div>
              </div>
              <div className="table-container" style={{ maxHeight: 300, overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>RM Name</th>
                      <th>Branch</th>
                      <th>Accepted</th>
                      <th>Total</th>
                      <th>Rate</th>
                      <th>Flag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rmAcceptanceBreakdown.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.rm}</td>
                        <td>{r.branch}</td>
                        <td>{r.accepted}</td>
                        <td>{r.total}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: r.rate < 50 ? '#ef4444' : r.rate > 95 ? '#f59e0b' : '#10b981' }}>
                            {r.rate}%
                          </span>
                        </td>
                        <td>
                          {r.rate > 95 && <span className="badge badge-yellow">⚠️ Bias Risk</span>}
                          {r.rate < 50 && <span className="badge badge-red">⚠️ Review</span>}
                          {r.rate >= 50 && r.rate <= 95 && <span className="badge badge-green">✓ Normal</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 4: RESPONSIBLE AI */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'responsible' && (
        <div className="fade-in">
          {/* Bias Monitoring */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Scale size={18} /> Bias Monitoring — Disparate Impact Analysis</div>
              <span className="badge badge-green">No violations detected</span>
            </div>
            <div style={{ marginBottom: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Alert threshold: ratio &gt; 1.5x (marked <span style={{ color: '#ef4444' }}>red</span>). Caution: ratio &gt; 1.25x (marked <span style={{ color: '#f59e0b' }}>yellow</span>).
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Portfolio Share (%)</th>
                    <th>Critical Cohort (%)</th>
                    <th>Disparity Ratio</th>
                    <th>Status</th>
                    <th>Visual</th>
                  </tr>
                </thead>
                <tbody>
                  {biasDistribution.map((b, i) => {
                    const ratioColor = b.ratio > 1.5 ? '#ef4444' : b.ratio > 1.25 ? '#f59e0b' : '#10b981';
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.category}</td>
                        <td>{b.portfolioShare}%</td>
                        <td>{b.criticalShare}%</td>
                        <td style={{ fontWeight: 700, color: ratioColor }}>{b.ratio.toFixed(2)}x</td>
                        <td>
                          {b.ratio > 1.5 ? (
                            <span className="badge badge-red">⚠️ ALERT</span>
                          ) : b.ratio > 1.25 ? (
                            <span className="badge badge-yellow">⚡ CAUTION</span>
                          ) : (
                            <span className="badge badge-green">✓ FAIR</span>
                          )}
                        </td>
                        <td style={{ width: 150 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(100, (b.ratio / 2) * 100)}%`, height: '100%', background: ratioColor, borderRadius: 4, transition: 'var(--transition-slow)' }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Data Lineage & Consent — Side by Side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Data Lineage */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Database size={18} /> Data Lineage Viewer</div>
              </div>
              <div className="table-container" style={{ maxHeight: 360, overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Source</th>
                      <th>Refresh</th>
                      <th>Last Sync</th>
                      <th>PII</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataLineage.map((d, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{d.feature}</td>
                        <td>
                          <div style={{ fontSize: '0.78rem' }}>{d.source}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d.table}</div>
                        </td>
                        <td style={{ fontSize: '0.78rem' }}>{d.refreshFreq}</td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--accent-green)' }}>{d.lastSync}</td>
                        <td>
                          {d.piiFlag ? (
                            <span className="badge badge-red"><Fingerprint size={10} /> PII</span>
                          ) : (
                            <span className="badge badge-green">Clean</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consent & Compliance */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><ShieldCheck size={18} /> Consent & Data Usage Compliance</div>
              </div>
              {consentTracking.map((c, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < consentTracking.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{c.category}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: c.status === 'compliant' ? '#10b981' : '#f59e0b' }}>
                      {c.rate}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                      <div style={{
                        width: `${c.rate}%`, height: '100%',
                        background: c.rate >= 95 ? 'linear-gradient(90deg, #10b981, #34d399)' : c.rate >= 75 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                        borderRadius: 4
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {c.consented.toLocaleString()} / {c.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(16,185,129,0.08)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>
                  <CheckCircle size={14} /> PII Scrubbing Verification: PASSED
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  All 2,340 translation API calls in May verified PII-free. Last audit: 27 May 2026, 00:15 IST
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 5: ESCALATION & APPROVALS */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'escalation' && (
        <div className="fade-in">
          {/* Summary Cards */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'Pending Approvals', value: '6', color: 'yellow', icon: Clock },
              { label: 'Avg Approval Time', value: '3.2 hrs', color: 'blue', icon: Activity },
              { label: 'Budget Utilization', value: '72.4%', color: 'green', icon: DollarSign },
              { label: 'SLA Breach Risk', value: '1', color: 'red', icon: AlertTriangle },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}><Icon size={20} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Pending Approvals Table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Clock size={18} /> Incentive Approval Workflow</div>
              <span className="badge badge-yellow">{pendingApprovals.filter(a => a.status === 'PENDING').length} pending</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Requester</th>
                    <th>Customer</th>
                    <th>Incentive Type</th>
                    <th>Value</th>
                    <th>Authority</th>
                    <th>Status</th>
                    <th>SLA</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map(a => {
                    const slaPercent = (a.elapsed / a.slaHrs) * 100;
                    const slaColor = slaPercent > 80 ? '#ef4444' : slaPercent > 60 ? '#f59e0b' : '#10b981';
                    return (
                      <tr key={a.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem' }}>{a.id}</td>
                        <td style={{ fontSize: '0.82rem' }}>{a.requester}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.customer}</td>
                        <td>{a.incentiveType}</td>
                        <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>₹{a.value.toLocaleString()}</td>
                        <td style={{ fontSize: '0.78rem' }}>{a.authorityLevel}</td>
                        <td>
                          <span className="badge" style={{ background: STATUS_STYLES[a.status]?.bg, color: STATUS_STYLES[a.status]?.color }}>
                            {a.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 50, background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                              <div style={{ width: `${Math.min(100, slaPercent)}%`, height: '100%', background: slaColor, borderRadius: 4 }} />
                            </div>
                            <span style={{ fontSize: '0.72rem', color: slaColor, fontWeight: 600 }}>
                              {a.elapsed}h / {a.slaHrs}h
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-sm btn-primary" style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                              onClick={() => setApprovalModal(a)}>
                              <CheckCircle size={10} /> Approve
                            </button>
                            <button className="btn btn-sm btn-danger" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
                              <XCircle size={10} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incentive Catalogue + Budget — Side by Side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Incentive Catalogue */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Award size={18} /> Incentive Catalogue & Authority Limits</div>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Incentive</th>
                      <th>BM Limit</th>
                      <th>RH Limit</th>
                      <th>VP Limit</th>
                      <th>Budget Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incentiveCatalogue.map((inc, i) => {
                      const pct = (inc.used / inc.monthlyBudget) * 100;
                      return (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inc.name}</td>
                          <td style={{ fontSize: '0.8rem' }}>{inc.authorityBM}</td>
                          <td style={{ fontSize: '0.8rem' }}>{inc.authorityRH}</td>
                          <td style={{ fontSize: '0.8rem' }}>{inc.authorityVP}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 60, background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? '#ef4444' : '#10b981', borderRadius: 4 }} />
                              </div>
                              <span style={{ fontSize: '0.72rem', color: pct > 80 ? '#ef4444' : 'var(--text-muted)' }}>{pct.toFixed(0)}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Budget by Branch Chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><DollarSign size={18} /> Budget Consumption by Branch</div>
                <span className="badge badge-yellow">80% alert line</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={budgetByBranch}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 9 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="pct" name="Budget Used %" radius={[4, 4, 0, 0]} barSize={28}>
                    {budgetByBranch.map((entry, i) => (
                      <Cell key={i} fill={entry.pct > 80 ? '#ef4444' : entry.pct > 60 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                  {/* 80% alert line */}
                  <Line type="monotone" dataKey={() => 80} stroke="#ef4444" strokeDasharray="5 5" dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Escalation Rules */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Settings size={18} /> Escalation Routing Rules</div>
              <button className="btn btn-sm btn-secondary"><Settings size={12} /> Configure</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Trigger Condition</th>
                    <th>Escalation Route</th>
                    <th>SLA</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {escalationRules.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.trigger}</td>
                      <td style={{ fontSize: '0.82rem' }}>{r.route}</td>
                      <td><span className="badge badge-blue">{r.sla}</span></td>
                      <td>
                        {r.active ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: '0.82rem', fontWeight: 600 }}>
                            <CheckCircle size={14} /> Active
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                            <XCircle size={14} /> Disabled
                          </span>
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

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 6: EXPLAINABILITY AUDIT */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'explainability' && (
        <div className="fade-in">
          {/* Usage Stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'Total Explanation Views', value: '342', color: 'blue', icon: Eye },
              { label: 'SHAP Accesses', value: '98', color: 'purple', icon: Layers },
              { label: 'Full Model Reports', value: '34', color: 'green', icon: FileText },
              { label: 'Unique Users', value: '18', color: 'yellow', icon: Users },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}><Icon size={20} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Trend Chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><TrendingUp size={18} /> Explainability Feature Usage Trend (6 weeks)</div>
              <span className="badge badge-green">↗ Adoption growing</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={explainabilityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="rgba(59,130,246,0.1)" name="Score Views" />
                <Area type="monotone" dataKey="shapAccess" stroke="#8b5cf6" fill="rgba(139,92,246,0.1)" name="SHAP Access" />
                <Area type="monotone" dataKey="fullReports" stroke="#10b981" fill="rgba(16,185,129,0.1)" name="Full Reports" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Explainability Access Log */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><FileText size={18} /> Explainability Access Log</div>
              <span className="badge badge-blue">{explainabilityLog.length} recent entries</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Customer</th>
                    <th>Features Viewed</th>
                  </tr>
                </thead>
                <tbody>
                  {explainabilityLog.map((l, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{l.timestamp}</td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{l.user}</td>
                      <td>
                        <span className={`badge ${l.role === 'Admin' ? 'badge-purple' : l.role === 'BM' ? 'badge-blue' : 'badge-green'}`}>
                          {l.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>{l.action}</td>
                      <td style={{ fontSize: '0.82rem' }}>{l.customer}</td>
                      <td>
                        {l.featureCount > 0 ? (
                          <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{l.featureCount} features</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
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

      {/* ═══════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ═══════════════════════════════════════════ */}

      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setSelectedChallenge(null)} />
          <div style={{ position: 'relative', width: 600, maxHeight: '80vh', overflowY: 'auto', background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Scale size={20} color="var(--accent-purple)" /> Challenge Detail — {selectedChallenge.id}
              </h3>
              <button onClick={() => setSelectedChallenge(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>CUSTOMER</div>
                <div style={{ fontWeight: 700 }}>{selectedChallenge.customer}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedChallenge.customerId}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>CHALLENGER</div>
                <div style={{ fontWeight: 700 }}>{selectedChallenge.challenger}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedChallenge.date}</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>CHALLENGE REASON</div>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{selectedChallenge.challengeReason}</div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>ORIGINAL SCORE</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{selectedChallenge.originalScore}</div>
              </div>
              {selectedChallenge.adjustedScore !== null && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}><ArrowRight size={24} color="var(--text-muted)" /></div>
                  <div style={{ flex: 1, background: 'rgba(16,185,129,0.08)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>ADJUSTED SCORE</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{selectedChallenge.adjustedScore}</div>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge" style={{ background: STATUS_STYLES[selectedChallenge.status]?.bg, color: STATUS_STYLES[selectedChallenge.status]?.color, fontSize: '0.82rem', padding: '6px 14px' }}>
                {selectedChallenge.status}
              </span>
              {selectedChallenge.reviewer && (
                <span className="badge badge-blue" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
                  Reviewed by: {selectedChallenge.reviewer}
                </span>
              )}
            </div>

            {selectedChallenge.status === 'OPEN' && (
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>
                  <CheckCircle size={14} /> Uphold Challenge
                </button>
                <button className="btn btn-secondary" style={{ flex: 1 }}>
                  <Unlock size={14} /> Override Score
                </button>
                <button className="btn btn-danger">
                  <XCircle size={14} /> Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {approvalModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setApprovalModal(null)} />
          <div style={{ position: 'relative', width: 500, background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={20} color="var(--accent-green)" /> Approve Incentive — {approvalModal.id}
              </h3>
              <button onClick={() => setApprovalModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Customer</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{approvalModal.customer}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Value</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-green)' }}>₹{approvalModal.value.toLocaleString()}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Requester</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{approvalModal.requester}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Type</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{approvalModal.incentiveType}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Approval Notes</label>
              <textarea className="form-input" placeholder="Add approval notes or conditions..." rows={3} />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setApprovalModal(null)}>
                <CheckCircle size={14} /> Approve
              </button>
              <button className="btn btn-danger" onClick={() => setApprovalModal(null)}>
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
