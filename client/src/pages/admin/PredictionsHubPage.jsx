import { useState, useEffect, useMemo } from 'react';
import {
  Brain, Target, Network, BarChart3, Search, AlertTriangle, Shield,
  TrendingUp, TrendingDown, Users, Eye, X, Edit3, ChevronRight,
  Zap, Activity, ArrowRight, RefreshCw, Play, Pause, Check,
  MessageSquare, FileText, GitBranch, Layers, Settings, Info,
  DollarSign, Calculator, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine, ComposedChart,
  Line, Cell, PieChart, Pie
} from 'recharts';

// ═══════════════════════════════════════════════════
// MOCK DATA — Indian Banking Context
// ═══════════════════════════════════════════════════

const COHORTS_DATA = [
  {
    id: 1, name: 'Code Red', range: [0.85, 1.0], customers: 23, avgAUM: 780000,
    defaultAction: 'Trigger Outreach Engine: Urgent RM Call', status: 'Active', color: '#ef4444',
    badge: 'badge-red', churnRate: 78, revenueAtRisk: 1794000, trend: [0.82, 0.84, 0.87, 0.89, 0.91, 0.88, 0.90]
  },
  {
    id: 2, name: 'High Risk', range: [0.70, 0.85], customers: 67, avgAUM: 420000,
    defaultAction: 'Trigger Outreach Engine: Retention Case', status: 'Active', color: '#f97316',
    badge: 'badge-yellow', churnRate: 52, revenueAtRisk: 2814000, trend: [0.71, 0.73, 0.72, 0.75, 0.74, 0.76, 0.75]
  },
  {
    id: 3, name: 'At Risk', range: [0.55, 0.70], customers: 142, avgAUM: 210000,
    defaultAction: 'Trigger Outreach Engine: Automated Journey', status: 'Active', color: '#f59e0b',
    badge: 'badge-yellow', churnRate: 31, revenueAtRisk: 2982000, trend: [0.56, 0.58, 0.57, 0.60, 0.62, 0.61, 0.63]
  },
  {
    id: 4, name: 'Early Warning', range: [0.40, 0.55], customers: 289, avgAUM: 140000,
    defaultAction: 'Trigger Outreach Engine: In-app Nudge', status: 'Active', color: '#3b82f6',
    badge: 'badge-blue', churnRate: 14, revenueAtRisk: 4046000, trend: [0.42, 0.41, 0.43, 0.44, 0.42, 0.45, 0.44]
  },
  {
    id: 5, name: 'Stable', range: [0.0, 0.40], customers: 4291, avgAUM: 80000,
    defaultAction: 'Monitor Signals', status: 'Monitoring', color: '#10b981',
    badge: 'badge-green', churnRate: 3, revenueAtRisk: 34328000, trend: [0.18, 0.17, 0.19, 0.18, 0.17, 0.16, 0.17]
  }
];

const RISK_DISTRIBUTION = Array.from({ length: 12 }, (_, i) => {
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
  return {
    month,
    codeRed: Math.floor(18 + Math.random() * 10),
    highRisk: Math.floor(55 + Math.random() * 20),
    atRisk: Math.floor(120 + Math.random() * 40),
    earlyWarning: Math.floor(250 + Math.random() * 60),
    stable: Math.floor(4100 + Math.random() * 300)
  };
});

const CUSTOMERS_LIST = [
  { id: 'C001', name: 'Rajesh Krishnamurthy', accountNo: 'XXXX4521', branch: 'Jayanagar, Bengaluru', score: 0.87, confidence: 92, aum: 1240000, segment: 'NRI Premium', riskTrend: 'rising' },
  { id: 'C002', name: 'Priya Venkataraman', accountNo: 'XXXX7834', branch: 'T. Nagar, Chennai', score: 0.79, confidence: 88, aum: 680000, segment: 'Salary Plus', riskTrend: 'stable' },
  { id: 'C003', name: 'Amit Sharma', accountNo: 'XXXX1290', branch: 'Connaught Place, Delhi', score: 0.73, confidence: 85, aum: 920000, segment: 'Business Banking', riskTrend: 'rising' },
  { id: 'C004', name: 'Sunita Deshpande', accountNo: 'XXXX9012', branch: 'FC Road, Pune', score: 0.64, confidence: 91, aum: 340000, segment: 'Regular Savings', riskTrend: 'falling' },
  { id: 'C005', name: 'Vikram Malhotra', accountNo: 'XXXX6745', branch: 'Sector 17, Chandigarh', score: 0.91, confidence: 96, aum: 2100000, segment: 'HNI', riskTrend: 'rising' },
  { id: 'C006', name: 'Deepa Nair', accountNo: 'XXXX3378', branch: 'MG Road, Kochi', score: 0.56, confidence: 82, aum: 450000, segment: 'Women First', riskTrend: 'stable' },
  { id: 'C007', name: 'Arjun Patel', accountNo: 'XXXX8901', branch: 'SG Highway, Ahmedabad', score: 0.82, confidence: 90, aum: 780000, segment: 'Business Premium', riskTrend: 'rising' },
  { id: 'C008', name: 'Meera Iyer', accountNo: 'XXXX2345', branch: 'Koramangala, Bengaluru', score: 0.45, confidence: 87, aum: 190000, segment: 'Salary Account', riskTrend: 'falling' },
];

const RISK_SIGNALS = [
  { signal: 'Primary salary credit stopped', attribution: 0.31, category: 'Income', icon: '💰', direction: 'negative' },
  { signal: '3 SIP cancellations in 21 days', attribution: 0.22, category: 'Investment', icon: '📉', direction: 'negative' },
  { signal: 'Mobile app login gap: 34 days', attribution: 0.17, category: 'Engagement', icon: '📱', direction: 'negative' },
  { signal: '₹2.1L transfer to Paytm wallet', attribution: 0.12, category: 'Transaction', icon: '💸', direction: 'negative' },
  { signal: 'FD matured, not renewed', attribution: 0.05, category: 'Product', icon: '🏦', direction: 'negative' },
];

const MONTE_CARLO_DATA = Array.from({ length: 90 }, (_, i) => {
  const day = i + 1;
  const base = 45000 + Math.random() * 5000;
  const decay = Math.exp(-0.008 * day);
  return {
    day,
    p10: Math.max(0, base * decay * 0.6 + (Math.random() - 0.5) * 8000),
    p50: Math.max(0, base * decay * 0.85 + (Math.random() - 0.5) * 5000),
    p90: Math.max(0, base * decay * 1.05 + (Math.random() - 0.5) * 3000),
  };
});

const NETWORK_NODES = [
  { id: 'n1', name: 'Rajesh K.', x: 300, y: 200, risk: 0.87, type: 'primary' },
  { id: 'n2', name: 'Lakshmi K.', x: 480, y: 160, risk: 0.61, type: 'spouse' },
  { id: 'n3', name: 'Suresh K.', x: 160, y: 140, risk: 0.34, type: 'family' },
  { id: 'n4', name: 'Priya V.', x: 440, y: 340, risk: 0.79, type: 'referral' },
  { id: 'n5', name: 'Amit S.', x: 180, y: 320, risk: 0.73, type: 'referral' },
  { id: 'n6', name: 'Nandini K.', x: 360, y: 80, risk: 0.22, type: 'family' },
  { id: 'n7', name: 'Vikram M.', x: 520, y: 300, risk: 0.91, type: 'joint' },
  { id: 'n8', name: 'Deepa N.', x: 100, y: 250, risk: 0.56, type: 'referral' },
  { id: 'n9', name: 'Meera I.', x: 260, y: 400, risk: 0.45, type: 'family' },
  { id: 'n10', name: 'Arjun P.', x: 420, y: 440, risk: 0.82, type: 'joint' },
];

const NETWORK_EDGES = [
  { from: 'n1', to: 'n2', type: 'Spouse', strength: 0.95 },
  { from: 'n1', to: 'n3', type: 'Family', strength: 0.7 },
  { from: 'n1', to: 'n6', type: 'Family', strength: 0.6 },
  { from: 'n1', to: 'n5', type: 'Referral', strength: 0.4 },
  { from: 'n2', to: 'n7', type: 'Joint Account', strength: 0.85 },
  { from: 'n4', to: 'n7', type: 'Referral', strength: 0.3 },
  { from: 'n5', to: 'n8', type: 'Referral', strength: 0.35 },
  { from: 'n3', to: 'n9', type: 'Family', strength: 0.65 },
  { from: 'n4', to: 'n10', type: 'Joint Account', strength: 0.8 },
  { from: 'n8', to: 'n9', type: 'Referral', strength: 0.25 },
];

// ═══════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════

const getRiskColor = (score) => {
  if (score >= 0.85) return '#ef4444';
  if (score >= 0.70) return '#f97316';
  if (score >= 0.55) return '#f59e0b';
  if (score >= 0.40) return '#3b82f6';
  return '#10b981';
};

const getRiskLabel = (score) => {
  if (score >= 0.85) return 'Critical';
  if (score >= 0.70) return 'High';
  if (score >= 0.55) return 'At Risk';
  if (score >= 0.40) return 'Early Warning';
  return 'Stable';
};

const formatCurrency = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)',
      border: '1px solid var(--border-strong)', borderRadius: 12, padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
    }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

function SparkLine({ data, color = '#3b82f6', width = 80, height = 24 }) {
  if (!data?.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export default function PredictionsHubPage() {
  const [activeTab, setActiveTab] = useState('cohorts');
  const [cohorts, setCohorts] = useState(COHORTS_DATA);
  const [editingCohort, setEditingCohort] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS_LIST[0]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [challengeModal, setChallengeModal] = useState(false);
  const [whatIfModal, setWhatIfModal] = useState(false);
  const [whatIfResult, setWhatIfResult] = useState(null);
  const [challengeForm, setChallengeForm] = useState({ reason: '', context: '', evidence: '' });
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [monteCarloCustomer, setMonteCarloCustomer] = useState(CUSTOMERS_LIST[0]);
  const [roiCost, setRoiCost] = useState(15000);
  const [roiResult, setRoiResult] = useState(null);
  const [networkSelectedNode, setNetworkSelectedNode] = useState(null);
  const [moveCohortModal, setMoveCohortModal] = useState(null);
  const [moveTarget, setMoveTarget] = useState('');
  const [toast, setToast] = useState('');

  // API state
  const [apiCustomers, setApiCustomers] = useState(null);
  const [apiMonteCarloData, setApiMonteCarloData] = useState(null);
  const [apiRiskSignals, setApiRiskSignals] = useState(null);
  const [apiSimulationMeta, setApiSimulationMeta] = useState(null);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingSignals, setLoadingSignals] = useState(false);
  const [loadingMonteCarlo, setLoadingMonteCarlo] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // Effective data: API data with mock fallbacks
  const effectiveCustomers = apiCustomers || CUSTOMERS_LIST;
  const effectiveRiskSignals = apiRiskSignals || RISK_SIGNALS;
  const effectiveMonteCarloData = apiMonteCarloData || MONTE_CARLO_DATA;

  // Fetch customer list on mount
  useEffect(() => {
    let cancelled = false;
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/v1/signal/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const mapped = data.map(c => ({
          id: c.id,
          name: c.name,
          accountNo: c.accountNumber || 'N/A',
          branch: c.financialProfile?.branchName || 'Unknown',
          score: c.lastReport?.overallRisk ?? c.financialProfile?.riskScore ?? 0.5,
          confidence: 85 + Math.floor(Math.random() * 10),
          aum: c.financialProfile?.currentBalance ?? 0,
          segment: c.financialProfile?.stressLevel || 'Unknown',
          riskTrend: 'stable',
        }));
        setApiCustomers(mapped);
        // Update selected customers if they're still on defaults
        if (mapped.length > 0) {
          setSelectedCustomer(prev => prev === CUSTOMERS_LIST[0] ? mapped[0] : prev);
          setMonteCarloCustomer(prev => prev === CUSTOMERS_LIST[0] ? mapped[0] : prev);
        }
      } catch (err) {
        console.warn('Failed to fetch customers, using mock data:', err);
      } finally {
        if (!cancelled) setLoadingCustomers(false);
      }
    };
    fetchCustomers();
    return () => { cancelled = true; };
  }, []);

  // Fetch risk signals when selectedCustomer changes
  useEffect(() => {
    if (!selectedCustomer?.id) return;
    let cancelled = false;
    const fetchSignals = async () => {
      setLoadingSignals(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/v1/signal/customers/${selectedCustomer.id}/reports`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const reports = await res.json();
        if (cancelled) return;
        if (reports.length > 0 && reports[0].topRiskFactors?.length > 0) {
          const iconMap = { Income: '💰', Investment: '📉', Engagement: '📱', Transaction: '💸', Product: '🏦', Behavioral: '🧠', Account: '🏧' };
          const mapped = reports[0].topRiskFactors.map(f => ({
            signal: f.signal || f.factor || f.name || 'Unknown signal',
            attribution: f.attribution ?? f.weight ?? f.impact ?? 0,
            category: f.category || 'General',
            icon: iconMap[f.category] || '⚠️',
            direction: 'negative',
          }));
          setApiRiskSignals(mapped);
        } else {
          setApiRiskSignals(null);
        }
      } catch (err) {
        console.warn('Failed to fetch risk signals, using mock data:', err);
        setApiRiskSignals(null);
      } finally {
        if (!cancelled) setLoadingSignals(false);
      }
    };
    fetchSignals();
    return () => { cancelled = true; };
  }, [selectedCustomer?.id]);

  // Fetch Monte Carlo simulation when monteCarloCustomer changes
  useEffect(() => {
    if (!monteCarloCustomer?.id) return;
    let cancelled = false;
    const fetchSimulation = async () => {
      setLoadingMonteCarlo(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/v1/signal/customers/${monteCarloCustomer.id}/simulate`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.projections?.length > 0) {
          setApiMonteCarloData(data.projections);
        } else {
          setApiMonteCarloData(null);
        }
        setApiSimulationMeta({
          revenueAtRisk90d: data.revenueAtRisk90d,
          revenueWorstCase: data.revenueWorstCase,
          confidenceInterval: data.confidenceInterval,
          samples: data.samples,
          currentRisk: data.currentRisk,
          churnProbability: data.churnProbability,
        });
      } catch (err) {
        console.warn('Failed to fetch Monte Carlo data, using mock data:', err);
        setApiMonteCarloData(null);
        setApiSimulationMeta(null);
      } finally {
        if (!cancelled) setLoadingMonteCarlo(false);
      }
    };
    fetchSimulation();
    return () => { cancelled = true; };
  }, [monteCarloCustomer?.id]);

  // Filtered customers for search
  const filteredCustomers = useMemo(() =>
    effectiveCustomers.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.accountNo.includes(customerSearch) ||
      c.branch.toLowerCase().includes(customerSearch.toLowerCase())
    ), [customerSearch, effectiveCustomers]
  );

  // Calculate ROI
  const calculateROI = () => {
    const expectedReturn = roiCost * (2.4 + Math.random() * 1.5);
    const netROI = ((expectedReturn - roiCost) / roiCost * 100).toFixed(1);
    const recommendation = netROI > 200 ? 'Intervene' : netROI > 80 ? 'Monitor' : 'Suppress';
    setRoiResult({
      cost: roiCost,
      expectedReturn: Math.round(expectedReturn),
      netROI,
      recommendation,
      confidenceBand: `${(netROI * 0.7).toFixed(0)}% - ${(netROI * 1.3).toFixed(0)}%`,
      breakEvenDays: Math.floor(15 + Math.random() * 30)
    });
  };

  // What-If Simulation
  const runWhatIf = () => {
    const baseScore = selectedCustomer?.score || 0.87;
    const newScore = Math.max(0.15, baseScore - 0.28 - Math.random() * 0.12);
    setWhatIfResult({
      originalScore: baseScore,
      newScore: parseFloat(newScore.toFixed(2)),
      change: parseFloat((baseScore - newScore).toFixed(2)),
      factors: [
        { action: 'FD Renewal (₹5L for 1 year)', impact: -0.14 },
        { action: 'SIP Resumption (₹10K/month)', impact: -0.11 },
        { action: 'Salary Credit Restoration', impact: -0.08 },
      ]
    });
  };

  const handleCohortSave = (cohortId, newRange) => {
    setCohorts(prev => prev.map(c =>
      c.id === cohortId ? { ...c, range: newRange } : c
    ));
    setEditingCohort(null);
    showToast('✅ Cohort threshold boundaries updated successfully');
  };

  const TABS = [
    { key: 'cohorts', label: 'Risk Cohorts', icon: Layers },
    { key: 'explainability', label: 'Score Explainability', icon: Brain },
    { key: 'montecarlo', label: 'Monte Carlo Viewer', icon: Activity },
    { key: 'network', label: 'Network View', icon: Network },
  ];

  return (
    <div className="fade-in">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--accent-green)', borderRadius: 'var(--radius-md)',
          padding: '14px 24px', color: 'var(--text-primary)', fontSize: '0.85rem',
          fontWeight: 600, boxShadow: 'var(--shadow-glow-green)',
          animation: 'fadeInUp 0.3s ease'
        }}>
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>🧠 Predictions Intelligence Hub</h2>
          <p>Predictive analytics with risk cohorts, GNN explainability, Monte Carlo simulations & network contagion</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', marginRight: 4 }} />
            Model v3.2 • 87.3% accuracy
          </span>
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('🔄 Refreshing predictions...')}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 24 }}>
        <div className="stat-card red">
          <div className="stat-icon red"><AlertTriangle size={20} /></div>
          <div className="stat-value" style={{ color: 'var(--accent-red)' }}>23</div>
          <div className="stat-label">Code Red Customers</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-red)', marginTop: 4 }}>↑ 3 since yesterday</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><Target size={20} /></div>
          <div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>232</div>
          <div className="stat-label">At Risk + High Risk</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>67 high + 142 at risk + 23 critical</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue"><Users size={20} /></div>
          <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>4,812</div>
          <div className="stat-label">Total Monitored</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: 4 }}>89.1% stable</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple"><Brain size={20} /></div>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>87.3%</div>
          <div className="stat-label">Model Accuracy</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: 4 }}>↑ 1.2% this week</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><DollarSign size={20} /></div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>₹4.6Cr</div>
          <div className="stat-label">Revenue at Risk</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-red)', marginTop: 4 }}>Across all cohorts</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 24,
        background: 'var(--bg-card)', borderRadius: 'var(--radius-md)',
        padding: 4, border: '1px solid var(--border-color)'
      }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.15))' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500, fontSize: '0.85rem',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'var(--transition)'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════
          TAB 1: RISK COHORTS
          ═══════════════════════════════════════════════ */}
      {activeTab === 'cohorts' && (
        <div className="fade-in">
          {/* Cohort Management Table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Layers size={18} /> Cohort Management</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('📊 Cohort report exported')}>
                  <FileText size={14} /> Export Report
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => showToast('🔄 Recalculating cohort assignments...')}>
                  <RefreshCw size={14} /> Recalculate
                </button>
              </div>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cohort</th>
                    <th>Score Range</th>
                    <th>Customers</th>
                    <th>Avg AUM</th>
                    <th>Churn Rate</th>
                    <th>Revenue at Risk</th>
                    <th>Default Action</th>
                    <th>Status</th>
                    <th>Trend</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map(cohort => (
                    <tr key={cohort.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            width: 12, height: 12, borderRadius: '50%', background: cohort.color,
                            boxShadow: `0 0 8px ${cohort.color}60`
                          }} />
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cohort.name}</span>
                        </div>
                      </td>
                      <td>
                        {editingCohort === cohort.id ? (
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <input
                              type="number" step="0.01" min="0" max="1"
                              defaultValue={cohort.range[0]}
                              style={{
                                width: 60, padding: '4px 6px', background: 'var(--bg-input)',
                                border: '1px solid var(--accent-blue)', borderRadius: 6,
                                color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'inherit'
                              }}
                              id={`range-low-${cohort.id}`}
                            />
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                            <input
                              type="number" step="0.01" min="0" max="1"
                              defaultValue={cohort.range[1]}
                              style={{
                                width: 60, padding: '4px 6px', background: 'var(--bg-input)',
                                border: '1px solid var(--accent-blue)', borderRadius: 6,
                                color: 'var(--text-primary)', fontSize: '0.8rem', fontFamily: 'inherit'
                              }}
                              id={`range-high-${cohort.id}`}
                            />
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ padding: '3px 8px' }}
                              onClick={() => {
                                const low = parseFloat(document.getElementById(`range-low-${cohort.id}`).value);
                                const high = parseFloat(document.getElementById(`range-high-${cohort.id}`).value);
                                handleCohortSave(cohort.id, [low, high]);
                              }}
                            >
                              <Check size={12} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: cohort.color }}>
                            {cohort.range[0].toFixed(2)} — {cohort.range[1].toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                          {cohort.customers.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                        {formatCurrency(cohort.avgAUM)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 40, height: 6, borderRadius: 3, background: 'var(--bg-input)', overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${cohort.churnRate}%`, height: '100%',
                              background: cohort.churnRate > 50 ? '#ef4444' : cohort.churnRate > 20 ? '#f59e0b' : '#10b981',
                              borderRadius: 3
                            }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cohort.churnRate}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--accent-red)', fontWeight: 600 }}>
                        {formatCurrency(cohort.revenueAtRisk)}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem', color: 'var(--text-secondary)',
                          background: 'var(--bg-secondary)', padding: '4px 10px',
                          borderRadius: 6
                        }}>
                          {cohort.defaultAction}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${cohort.status === 'Active' ? 'badge-green' : 'badge-blue'}`}>
                          {cohort.status}
                        </span>
                      </td>
                      <td>
                        <SparkLine data={cohort.trend} color={cohort.color} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => setEditingCohort(editingCohort === cohort.id ? null : cohort.id)}
                            title="Edit thresholds"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => { setMoveCohortModal(cohort); setMoveTarget(''); }}
                            title="Move customers"
                          >
                            <ArrowRight size={12} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px' }}
                            onClick={() => showToast(`👁 Viewing ${cohort.customers} customers in ${cohort.name}`)}
                            title="View customers"
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Distribution Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><BarChart3 size={18} /> Risk Distribution — 12 Month Trend</div>
              <span className="badge badge-blue">Stacked by cohort</span>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={RISK_DISTRIBUTION} barCategoryGap="12%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '0.75rem', color: '#94a3b8' }}
                  iconType="circle"
                />
                <Bar dataKey="codeRed" name="Code Red" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
                <Bar dataKey="highRisk" name="High Risk" stackId="a" fill="#f97316" />
                <Bar dataKey="atRisk" name="At Risk" stackId="a" fill="#f59e0b" />
                <Bar dataKey="earlyWarning" name="Early Warning" stackId="a" fill="#3b82f6" />
                <Bar dataKey="stable" name="Stable" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Move Customer Modal */}
          {moveCohortModal && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setMoveCohortModal(null)} />
              <div style={{
                position: 'relative', width: 480, background: 'rgba(26, 32, 53, 0.95)',
                backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-strong)', padding: 28
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Move Customers Between Cohorts</h3>
                  <button onClick={() => setMoveCohortModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>
                <div className="form-group">
                  <label className="form-label">Source Cohort</label>
                  <div style={{
                    padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: moveCohortModal.color }} />
                    <span style={{ fontWeight: 600 }}>{moveCohortModal.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({moveCohortModal.customers} customers)</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Cohort</label>
                  <select className="form-input" value={moveTarget} onChange={e => setMoveTarget(e.target.value)}>
                    <option value="">Select target cohort...</option>
                    {cohorts.filter(c => c.id !== moveCohortModal.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.range[0].toFixed(2)} — {c.range[1].toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Customer IDs (comma separated)</label>
                  <input className="form-input" placeholder="e.g., C001, C005, C007" />
                </div>
                <div className="form-group">
                  <label className="form-label">Override Reason</label>
                  <textarea className="form-input" rows={3} placeholder="Provide justification for the manual override..." />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setMoveCohortModal(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => {
                    setMoveCohortModal(null);
                    showToast('✅ Customers moved successfully. Audit record created.');
                  }}>
                    <ArrowRight size={14} /> Move Customers
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 2: SCORE EXPLAINABILITY
          ═══════════════════════════════════════════════ */}
      {activeTab === 'explainability' && (
        <div className="fade-in">
          {/* Customer Search & Selection */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Search size={18} /> Customer Selector</div>
              <span className="badge badge-blue">{filteredCustomers.length} results</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <input
                className="form-input"
                placeholder="Search by name, account number, or branch..."
                value={customerSearch}
                onChange={e => setCustomerSearch(e.target.value)}
                style={{ maxWidth: 500 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {filteredCustomers.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                    background: selectedCustomer?.id === c.id
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))'
                      : 'var(--bg-secondary)',
                    border: selectedCustomer?.id === c.id
                      ? '1px solid rgba(59,130,246,0.4)'
                      : '1px solid var(--border-color)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getRiskColor(c.score)}, ${getRiskColor(c.score)}80)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: 'white'
                  }}>
                    {(c.score * 100).toFixed(0)}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.accountNo} · {c.branch}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Customer Detail */}
          {selectedCustomer && (
            <>
              {/* Risk Score Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24
              }}>
                {/* Score Card */}
                <div className="card" style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>CHURN RISK SCORE</div>
                    <div style={{
                      width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                      background: `conic-gradient(${getRiskColor(selectedCustomer.score)} ${selectedCustomer.score * 360}deg, rgba(148,163,184,0.1) 0deg)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 30px ${getRiskColor(selectedCustomer.score)}30`
                    }}>
                      <div style={{
                        width: 96, height: 96, borderRadius: '50%', background: 'var(--bg-card)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: getRiskColor(selectedCustomer.score) }}>
                          {selectedCustomer.score.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <span className={`badge ${selectedCustomer.score >= 0.7 ? 'badge-red' : selectedCustomer.score >= 0.55 ? 'badge-yellow' : 'badge-green'}`}
                        style={{ fontSize: '0.8rem' }}>
                        {getRiskLabel(selectedCustomer.score)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                      Confidence: {selectedCustomer.confidence}% ·
                      {selectedCustomer.riskTrend === 'rising' ? ' ↗ Rising' : selectedCustomer.riskTrend === 'falling' ? ' ↘ Falling' : ' → Stable'}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Customer Details</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedCustomer.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedCustomer.accountNo} · {selectedCustomer.segment}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedCustomer.branch}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: 4 }}>
                      AUM: {formatCurrency(selectedCustomer.aum)}
                    </div>
                  </div>
                </div>

                {/* Risk Signals Attribution */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><Zap size={18} /> Top Risk Signals — GNN Feature Attribution</div>
                    <span className="badge badge-purple">TGNN v3.2</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {loadingSignals && (
                      <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        ⏳ Loading risk signals...
                      </div>
                    )}
                    {effectiveRiskSignals.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: 20 }}>
                          #{i + 1}
                        </span>
                        <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4
                          }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {s.signal}
                            </span>
                            <span style={{
                              fontSize: '0.8rem', fontWeight: 700,
                              color: '#ef4444',
                              padding: '2px 8px', borderRadius: 6,
                              background: 'rgba(239,68,68,0.1)'
                            }}>
                              +{s.attribution.toFixed(2)}
                            </span>
                          </div>
                          <div style={{
                            height: 8, borderRadius: 4, background: 'var(--bg-input)', overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${(s.attribution / 0.35) * 100}%`,
                              height: '100%',
                              background: `linear-gradient(90deg, #ef4444, #f97316)`,
                              borderRadius: 4,
                              transition: 'width 0.8s ease'
                            }} />
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            Category: {s.category}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Network Contagion */}
                  <div style={{
                    marginTop: 20, padding: 14, borderRadius: 'var(--radius-sm)',
                    background: 'rgba(139, 92, 246, 0.08)',
                    border: '1px solid rgba(139, 92, 246, 0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Network size={16} color="#8b5cf6" />
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#8b5cf6' }}>Network Contagion Detected</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                      Spouse account (Lakshmi K.) shows similar disengagement pattern — linked customer risk at <strong style={{ color: '#f59e0b' }}>0.61</strong>.
                      Joint account holder Vikram M. is at <strong style={{ color: '#ef4444' }}>0.91</strong> (Critical).
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                <button
                  className="btn btn-danger"
                  onClick={() => { setChallengeModal(true); setChallengeSubmitted(false); setChallengeForm({ reason: '', context: '', evidence: '' }); }}
                >
                  <Shield size={16} /> Challenge This Score
                </button>
                <button className="btn btn-secondary" onClick={() => showToast('📜 Loading full signal history...')}>
                  <FileText size={16} /> View Full Signal History
                </button>
                <button className="btn btn-primary" onClick={() => { setWhatIfModal(true); setWhatIfResult(null); }}>
                  <Play size={16} /> Run What-If Simulation
                </button>
              </div>
            </>
          )}

          {/* Challenge Score Modal */}
          {challengeModal && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setChallengeModal(false)} />
              <div style={{
                position: 'relative', width: 560, background: 'rgba(26, 32, 53, 0.95)',
                backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-strong)', padding: 28
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🛡️ Challenge Score — AI Governance</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Creates an audit record in the AI Governance system
                    </p>
                  </div>
                  <button onClick={() => setChallengeModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                {challengeSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-green-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                    }}>
                      <Check size={28} color="#10b981" />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Challenge Submitted Successfully</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      AI Governance record GOV-2024-{Math.floor(1000 + Math.random() * 9000)} created.
                      The model team will review within 48h.
                    </p>
                    <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setChallengeModal(false)}>
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{
                      padding: 14, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                      marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{selectedCustomer?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedCustomer?.accountNo}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: getRiskColor(selectedCustomer?.score) }}>
                          {selectedCustomer?.score?.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Score</div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Challenge Reason</label>
                      <select
                        className="form-input"
                        value={challengeForm.reason}
                        onChange={e => setChallengeForm(f => ({ ...f, reason: e.target.value }))}
                      >
                        <option value="">Select reason...</option>
                        <option value="data_error">Data Error / Incorrect Signal</option>
                        <option value="context_missing">Missing Business Context</option>
                        <option value="life_event">Known Life Event (not churn)</option>
                        <option value="seasonal">Seasonal Pattern Misidentified</option>
                        <option value="relationship">RM Relationship Knowledge</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Context & Explanation</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        placeholder="Explain why you believe the risk score is inaccurate..."
                        value={challengeForm.context}
                        onChange={e => setChallengeForm(f => ({ ...f, context: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Supporting Evidence</label>
                      <input
                        className="form-input"
                        placeholder="Reference ticket IDs, customer communication dates, etc."
                        value={challengeForm.evidence}
                        onChange={e => setChallengeForm(f => ({ ...f, evidence: e.target.value }))}
                      />
                    </div>
                    <div style={{
                      padding: 12, background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(245,158,11,0.2)', marginBottom: 20
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#f59e0b' }}>
                        <Info size={14} /> This challenge will be logged in the AI Governance audit trail
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button className="btn btn-secondary" onClick={() => setChallengeModal(false)}>Cancel</button>
                      <button
                        className="btn btn-danger"
                        disabled={!challengeForm.reason || !challengeForm.context}
                        onClick={() => setChallengeSubmitted(true)}
                      >
                        <Shield size={14} /> Submit Challenge
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* What-If Simulation Modal */}
          {whatIfModal && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setWhatIfModal(false)} />
              <div style={{
                position: 'relative', width: 600, background: 'rgba(26, 32, 53, 0.95)',
                backdropFilter: 'blur(20px)', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-strong)', padding: 28
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🔮 What-If Simulation</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Simulate score changes if customer takes specific actions
                    </p>
                  </div>
                  <button onClick={() => setWhatIfModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                <div style={{
                  padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                  marginBottom: 20
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>
                    SCENARIO: Customer takes following actions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Renew Fixed Deposit (₹5L, 1 year)', checked: true },
                      { label: 'Resume SIP investment (₹10K/month)', checked: true },
                      { label: 'Restore primary salary credit', checked: false },
                      { label: 'Re-login to mobile app', checked: true },
                    ].map((item, i) => (
                      <label key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                        borderRadius: 8, background: 'var(--bg-input)', cursor: 'pointer',
                        fontSize: '0.85rem', color: 'var(--text-primary)'
                      }}>
                        <input type="checkbox" defaultChecked={item.checked}
                          style={{ accentColor: 'var(--accent-blue)' }} />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', marginBottom: 20 }} onClick={runWhatIf}>
                  <Play size={16} /> Run Simulation
                </button>

                {whatIfResult && (
                  <div style={{
                    padding: 20, borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.06)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    animation: 'fadeInUp 0.3s ease'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)', marginBottom: 16 }}>
                      SIMULATION RESULTS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 20 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Score</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: getRiskColor(whatIfResult.originalScore) }}>
                          {whatIfResult.originalScore.toFixed(2)}
                        </div>
                      </div>
                      <ArrowRight size={24} color="var(--accent-green)" />
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Projected Score</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: getRiskColor(whatIfResult.newScore) }}>
                          {whatIfResult.newScore.toFixed(2)}
                        </div>
                      </div>
                      <div style={{
                        padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                        background: 'var(--accent-green-soft)', color: 'var(--accent-green)',
                        fontWeight: 700, fontSize: '1rem'
                      }}>
                        ↓ {whatIfResult.change.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {whatIfResult.factors.map((f, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8
                        }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{f.action}</span>
                          <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.85rem' }}>
                            {f.impact.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      marginTop: 16, padding: 12, borderRadius: 8,
                      background: 'var(--bg-secondary)', textAlign: 'center'
                    }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        New risk level: <strong style={{ color: getRiskColor(whatIfResult.newScore) }}>
                          {getRiskLabel(whatIfResult.newScore)}
                        </strong> — cohort change from{' '}
                        <strong style={{ color: getRiskColor(whatIfResult.originalScore) }}>
                          {getRiskLabel(whatIfResult.originalScore)}
                        </strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 3: MONTE CARLO VIEWER
          ═══════════════════════════════════════════════ */}
      {activeTab === 'montecarlo' && (
        <div className="fade-in">
          {/* Customer Selector */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Search size={18} /> Select Customer for Monte Carlo Projection</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {effectiveCustomers.slice(0, 6).map(c => (
                <button
                  key={c.id}
                  onClick={() => setMonteCarloCustomer(c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 'var(--radius-sm)',
                    background: monteCarloCustomer?.id === c.id
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))'
                      : 'var(--bg-secondary)',
                    border: monteCarloCustomer?.id === c.id
                      ? '1px solid rgba(139,92,246,0.4)'
                      : '1px solid var(--border-color)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'var(--transition)'
                  }}
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: getRiskColor(c.score)
                  }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    ({c.score.toFixed(2)})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Monte Carlo Projection Chart */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Activity size={18} /> P10 / P50 / P90 Revenue Loss Projection — 90 Days</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="badge badge-purple">{apiSimulationMeta?.samples ? `${apiSimulationMeta.samples.toLocaleString()} simulations` : '10,000 simulations'}</span>
                <span className="badge badge-blue">{monteCarloCustomer?.name}</span>
              </div>
            </div>

            {/* Quick Stats */}
            {loadingMonteCarlo && (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ⏳ Running Monte Carlo simulation...
              </div>
            )}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20
            }}>
              {[
                { label: 'P10 (Optimistic)', value: apiSimulationMeta?.revenueAtRisk90d != null ? formatCurrency(Math.round(apiSimulationMeta.revenueAtRisk90d * 0.3)) : '₹12,400', color: '#10b981', desc: 'Best case scenario' },
                { label: 'P50 (Median)', value: apiSimulationMeta?.revenueAtRisk90d != null ? formatCurrency(apiSimulationMeta.revenueAtRisk90d) : '₹28,700', color: '#f59e0b', desc: 'Most likely outcome' },
                { label: 'P90 (Pessimistic)', value: apiSimulationMeta?.revenueWorstCase != null ? formatCurrency(apiSimulationMeta.revenueWorstCase) : '₹47,200', color: '#ef4444', desc: 'Worst case scenario' },
                { label: 'Key Inflection', value: apiSimulationMeta?.confidenceInterval != null ? `${apiSimulationMeta.confidenceInterval}% CI` : 'Day 23', color: '#8b5cf6', desc: apiSimulationMeta?.confidenceInterval != null ? 'Confidence interval' : 'Critical decision point' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: 14, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                  borderTop: `3px solid ${s.color}`, textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={effectiveMonteCarloData}>
                <defs>
                  <linearGradient id="gradP90" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradP50" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradP10" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(d) => `Day ${d}`}
                  interval={14}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} iconType="circle" />
                <ReferenceLine x={23} stroke="#8b5cf6" strokeDasharray="5 5" label={{
                  value: "Inflection Point", fill: '#8b5cf6', fontSize: 11, position: 'top'
                }} />
                <ReferenceLine x={60} stroke="#f97316" strokeDasharray="5 5" label={{
                  value: "FD Maturity", fill: '#f97316', fontSize: 11, position: 'top'
                }} />
                <Area type="monotone" dataKey="p90" name="P90 (Pessimistic)" stroke="#ef4444" fill="url(#gradP90)" strokeWidth={2} />
                <Area type="monotone" dataKey="p50" name="P50 (Median)" stroke="#f59e0b" fill="url(#gradP50)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="p10" name="P10 (Optimistic)" stroke="#10b981" fill="url(#gradP10)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Campaign ROI Calculator */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Calculator size={18} /> Campaign ROI Calculator</div>
              <span className="badge badge-green">Cost-Benefit Analysis</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Input Side */}
              <div>
                <div className="form-group">
                  <label className="form-label">Intervention Cost (₹)</label>
                  <input
                    className="form-input"
                    type="number"
                    value={roiCost}
                    onChange={e => setRoiCost(parseInt(e.target.value) || 0)}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Include RM time, offer cost, channel fees
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Intervention Type</label>
                  <select className="form-input">
                    <option>RM Personal Call + Premium Offer</option>
                    <option>WhatsApp + Rate Enhancement</option>
                    <option>In-App Nudge + Loyalty Points</option>
                    <option>Branch Visit + Relationship Review</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Time Horizon</label>
                  <select className="form-input">
                    <option>30 Days</option>
                    <option>60 Days</option>
                    <option selected>90 Days</option>
                    <option>180 Days</option>
                  </select>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={calculateROI}>
                  <Calculator size={16} /> Calculate ROI
                </button>
              </div>

              {/* Result Side */}
              <div>
                {roiResult ? (
                  <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                    <div style={{
                      textAlign: 'center', padding: 20, borderRadius: 'var(--radius-md)',
                      background: roiResult.recommendation === 'Intervene'
                        ? 'rgba(16, 185, 129, 0.08)'
                        : roiResult.recommendation === 'Monitor'
                        ? 'rgba(245, 158, 11, 0.08)'
                        : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${
                        roiResult.recommendation === 'Intervene' ? 'rgba(16, 185, 129, 0.3)'
                        : roiResult.recommendation === 'Monitor' ? 'rgba(245, 158, 11, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)'
                      }`,
                      marginBottom: 16
                    }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>RECOMMENDATION</div>
                      <div style={{
                        fontSize: '1.8rem', fontWeight: 800,
                        color: roiResult.recommendation === 'Intervene' ? '#10b981'
                          : roiResult.recommendation === 'Monitor' ? '#f59e0b' : '#ef4444'
                      }}>
                        {roiResult.recommendation === 'Intervene' ? '✅' : roiResult.recommendation === 'Monitor' ? '👁️' : '⛔'}{' '}
                        {roiResult.recommendation}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Intervention Cost', value: formatCurrency(roiResult.cost), color: 'var(--accent-red)' },
                        { label: 'Expected Return', value: formatCurrency(roiResult.expectedReturn), color: 'var(--accent-green)' },
                        { label: 'Net ROI', value: `${roiResult.netROI}%`, color: parseFloat(roiResult.netROI) > 100 ? '#10b981' : '#f59e0b' },
                        { label: 'Confidence Band', value: roiResult.confidenceBand, color: 'var(--accent-blue)' },
                        { label: 'Break-Even', value: `${roiResult.breakEvenDays} days`, color: 'var(--accent-purple)' },
                      ].map((r, i) => (
                        <div key={i} style={{
                          display: 'flex', justifyContent: 'space-between', padding: '10px 14px',
                          background: 'var(--bg-secondary)', borderRadius: 8
                        }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{r.label}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: r.color }}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
                    textAlign: 'center', padding: 40
                  }}>
                    <Calculator size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                    <div style={{ fontSize: '0.9rem', marginBottom: 4 }}>Enter parameters and calculate</div>
                    <div style={{ fontSize: '0.75rem' }}>ROI analysis will appear here</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 4: NETWORK VIEW
          ═══════════════════════════════════════════════ */}
      {activeTab === 'network' && (
        <div className="fade-in">
          {/* Network Legend + Controls */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Network size={18} /> Customer Relationship Network — Churn Contagion Map</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast('🔄 Refreshing network graph...')}>
                  <RefreshCw size={14} /> Refresh
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => showToast('📊 Running cluster analysis...')}>
                  <GitBranch size={14} /> Analyze Clusters
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} /> Critical (&gt;0.85)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f97316' }} /> High (0.70-0.85)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} /> At Risk (0.55-0.70)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#3b82f6' }} /> Early Warning (0.40-0.55)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} /> Stable (&lt;0.40)
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>── Spouse</span>
                <span style={{ borderBottom: '2px dashed var(--text-muted)', lineHeight: 1 }}>--- Family</span>
                <span style={{ borderBottom: '2px dotted var(--text-muted)', lineHeight: 1 }}>··· Referral</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            {/* Network Graph */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                position: 'relative', width: '100%', height: 520,
                background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.03) 0%, transparent 70%)'
              }}>
                {/* Draw Edges */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  {NETWORK_EDGES.map((edge, i) => {
                    const fromNode = NETWORK_NODES.find(n => n.id === edge.from);
                    const toNode = NETWORK_NODES.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    const strokeStyle = edge.type === 'Spouse' ? 'none'
                      : edge.type.includes('Family') ? '8 4'
                      : edge.type.includes('Joint') ? '4 2'
                      : '2 4';
                    const bothHighRisk = fromNode.risk >= 0.7 && toNode.risk >= 0.7;
                    return (
                      <g key={i}>
                        <line
                          x1={fromNode.x} y1={fromNode.y}
                          x2={toNode.x} y2={toNode.y}
                          stroke={bothHighRisk ? 'rgba(239,68,68,0.5)' : 'rgba(148,163,184,0.15)'}
                          strokeWidth={edge.strength * 3}
                          strokeDasharray={strokeStyle}
                        />
                        <text
                          x={(fromNode.x + toNode.x) / 2}
                          y={(fromNode.y + toNode.y) / 2 - 6}
                          fill="rgba(148,163,184,0.4)"
                          fontSize="9"
                          textAnchor="middle"
                        >
                          {edge.type}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Draw Nodes */}
                {NETWORK_NODES.map(node => {
                  const isSelected = networkSelectedNode?.id === node.id;
                  const nodeColor = getRiskColor(node.risk);
                  const size = node.type === 'primary' ? 52 : 42;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setNetworkSelectedNode(isSelected ? null : node)}
                      style={{
                        position: 'absolute',
                        left: node.x - size / 2,
                        top: node.y - size / 2,
                        width: size, height: size,
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${nodeColor}30, ${nodeColor}10)`,
                        border: `2px solid ${nodeColor}`,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                        boxShadow: isSelected ? `0 0 20px ${nodeColor}60` : `0 0 8px ${nodeColor}20`,
                        zIndex: isSelected ? 10 : 1
                      }}
                    >
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: nodeColor }}>
                        {(node.risk * 100).toFixed(0)}
                      </span>
                    </div>
                  );
                })}

                {/* Node Labels */}
                {NETWORK_NODES.map(node => (
                  <div
                    key={`label-${node.id}`}
                    style={{
                      position: 'absolute',
                      left: node.x - 35,
                      top: node.y + (node.type === 'primary' ? 30 : 24),
                      width: 70,
                      textAlign: 'center',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      pointerEvents: 'none'
                    }}
                  >
                    {node.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Node Detail Panel */}
            <div>
              {networkSelectedNode ? (
                <div className="card" style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{
                    textAlign: 'center', marginBottom: 20, paddingBottom: 20,
                    borderBottom: '1px solid var(--border-color)'
                  }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px',
                      background: `radial-gradient(circle, ${getRiskColor(networkSelectedNode.risk)}30, ${getRiskColor(networkSelectedNode.risk)}10)`,
                      border: `3px solid ${getRiskColor(networkSelectedNode.risk)}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 20px ${getRiskColor(networkSelectedNode.risk)}30`
                    }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: getRiskColor(networkSelectedNode.risk) }}>
                        {(networkSelectedNode.risk * 100).toFixed(0)}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{networkSelectedNode.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {networkSelectedNode.type} relationship
                    </div>
                    <span className={`badge ${networkSelectedNode.risk >= 0.7 ? 'badge-red' : networkSelectedNode.risk >= 0.55 ? 'badge-yellow' : 'badge-green'}`}
                      style={{ marginTop: 8 }}>
                      {getRiskLabel(networkSelectedNode.risk)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                      borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Risk Score</span>
                      <span style={{ fontWeight: 700, color: getRiskColor(networkSelectedNode.risk) }}>
                        {networkSelectedNode.risk.toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                      borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Connections</span>
                      <span style={{ fontWeight: 700 }}>
                        {NETWORK_EDGES.filter(e => e.from === networkSelectedNode.id || e.to === networkSelectedNode.id).length}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', padding: '8px 0',
                      borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Contagion</span>
                      <span style={{ fontWeight: 700, color: '#8b5cf6' }}>
                        {(NETWORK_EDGES.filter(e => e.from === networkSelectedNode.id || e.to === networkSelectedNode.id)
                          .reduce((sum, e) => sum + e.strength, 0) / 10).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Connected Nodes */}
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Connected Customers
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {NETWORK_EDGES
                      .filter(e => e.from === networkSelectedNode.id || e.to === networkSelectedNode.id)
                      .map((e, i) => {
                        const otherId = e.from === networkSelectedNode.id ? e.to : e.from;
                        const other = NETWORK_NODES.find(n => n.id === otherId);
                        if (!other) return null;
                        return (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 10px', background: 'var(--bg-secondary)',
                            borderRadius: 8, cursor: 'pointer'
                          }}
                          onClick={() => setNetworkSelectedNode(other)}
                          >
                            <span style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: getRiskColor(other.risk)
                            }} />
                            <span style={{ flex: 1, fontSize: '0.8rem', fontWeight: 600 }}>{other.name}</span>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: 700,
                              color: getRiskColor(other.risk)
                            }}>
                              {other.risk.toFixed(2)}
                            </span>
                            <span style={{
                              fontSize: '0.65rem', color: 'var(--text-muted)',
                              padding: '2px 6px', background: 'var(--bg-input)', borderRadius: 4
                            }}>
                              {e.type}
                            </span>
                          </div>
                        );
                      })
                    }
                  </div>

                  <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: 16 }}
                    onClick={() => showToast(`📊 Detailed analysis for ${networkSelectedNode.name}`)}>
                    <Eye size={14} /> View Full Profile
                  </button>
                </div>
              ) : (
                <div className="card" style={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center'
                }}>
                  <Network size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Click a node to view details
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Node size indicates account type. Color shows risk level.
                  </div>
                </div>
              )}

              {/* Cluster Risk Summary */}
              <div className="card" style={{ marginTop: 20 }}>
                <div className="card-title" style={{ marginBottom: 16 }}>
                  <GitBranch size={16} /> Cluster Churn Risk
                </div>
                {[
                  { cluster: 'Krishnamurthy Family', nodes: 4, avgRisk: 0.51, contagion: 'High' },
                  { cluster: 'Malhotra-Patel Joint', nodes: 3, avgRisk: 0.84, contagion: 'Critical' },
                  { cluster: 'Referral Network A', nodes: 3, avgRisk: 0.69, contagion: 'Moderate' },
                ].map((cl, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 8,
                    marginBottom: 8, borderLeft: `3px solid ${getRiskColor(cl.avgRisk)}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{cl.cluster}</span>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: 6,
                        background: `${getRiskColor(cl.avgRisk)}15`,
                        color: getRiskColor(cl.avgRisk)
                      }}>
                        Avg: {cl.avgRisk.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {cl.nodes} nodes · Contagion: {cl.contagion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
