import { useState, useMemo } from 'react';
import {
  Brain, Activity, BarChart3, Search, AlertTriangle, Shield,
  TrendingUp, TrendingDown, Users, Eye, X, Edit3, ChevronRight,
  Zap, RefreshCw, Play, Pause, Check, Clock, Award,
  FileText, GitBranch, Layers, Settings, Info, Lock,
  ArrowRight, RotateCcw, GitCompare, CheckCircle, XCircle,
  Star, Trophy, Medal, Target, Gauge, Radio
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, ComposedChart
} from 'recharts';

// ═══════════════════════════════════════════════════
// MOCK DATA — ML Operations
// ═══════════════════════════════════════════════════

const PULSE_STATUS = {
  lastPPORun: '3h 42m ago',
  runDuration: '18 min',
  nextScheduledRun: 'In 20h 18m',
  outcomesIngested: 1247,
  rewardSignalQuality: 0.74,
  policyImprovement: 1.2,
  modelVersion: 'v1.47',
  gnnAccuracy: 87.3,
  lastUpdated: '27 May 2026, 09:24 IST',
};

const GNN_ACCURACY_TREND = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  accuracy: 82.5 + Math.random() * 6 + (i * 0.15),
  baseline: 82.0,
}));

const MAB_PROBABILITIES = [
  { channel: 'RM Call', probability: 42, successRate: 67, totalActions: 1240, color: '#3b82f6' },
  { channel: 'WhatsApp', probability: 31, successRate: 54, totalActions: 2180, color: '#10b981' },
  { channel: 'In-App', probability: 14, successRate: 41, totalActions: 890, color: '#8b5cf6' },
  { channel: 'SMS', probability: 8, successRate: 28, totalActions: 1560, color: '#f59e0b' },
  { channel: 'Email', probability: 5, successRate: 19, totalActions: 3420, color: '#ef4444' },
];

const DRIFT_ALERTS = [
  {
    id: 1, channel: 'Email', severity: 'warning',
    message: 'Email channel accuracy dropped 4.1% (>3% threshold)',
    timestamp: '2h ago', metric: 'accuracy', change: -4.1, threshold: 3.0
  },
  {
    id: 2, channel: 'SMS', severity: 'info',
    message: 'SMS conversion rate increased 2.3% — MAB weight adjusting',
    timestamp: '6h ago', metric: 'conversion', change: 2.3, threshold: 5.0
  },
];

const RM_RECORDING_DATA = [
  { name: 'Anand Krishnan', branch: 'Jayanagar', assigned: 34, recorded: 31, rate: 91.2, status: 'excellent', streak: 12 },
  { name: 'Priya Sharma', branch: 'T. Nagar', assigned: 28, recorded: 26, rate: 92.9, status: 'excellent', streak: 8 },
  { name: 'Vikram Patel', branch: 'SG Highway', assigned: 41, recorded: 36, rate: 87.8, status: 'good', streak: 5 },
  { name: 'Sunita Rao', branch: 'MG Road', assigned: 22, recorded: 19, rate: 86.4, status: 'good', streak: 3 },
  { name: 'Rajesh Verma', branch: 'CP Delhi', assigned: 37, recorded: 30, rate: 81.1, status: 'good', streak: 2 },
  { name: 'Deepika Nair', branch: 'FC Road', assigned: 19, recorded: 15, rate: 78.9, status: 'warning', streak: 0 },
  { name: 'Arjun Mehta', branch: 'Bandra', assigned: 45, recorded: 33, rate: 73.3, status: 'critical', streak: 0 },
  { name: 'Kavita Singh', branch: 'Sector 17', assigned: 31, recorded: 22, rate: 71.0, status: 'critical', streak: 0 },
  { name: 'Suresh Iyer', branch: 'Koramangala', assigned: 26, recorded: 17, rate: 65.4, status: 'critical', streak: 0 },
  { name: 'Nandini Reddy', branch: 'Jubilee Hills', assigned: 33, recorded: 21, rate: 63.6, status: 'critical', streak: 0 },
];

const BRANCH_RECORDING_DATA = [
  { branch: 'T. Nagar, Chennai', rms: 6, assigned: 142, recorded: 128, rate: 90.1, status: 'excellent' },
  { branch: 'Jayanagar, Bengaluru', rms: 8, assigned: 198, recorded: 174, rate: 87.9, status: 'good' },
  { branch: 'SG Highway, Ahmedabad', rms: 5, assigned: 120, recorded: 102, rate: 85.0, status: 'good' },
  { branch: 'FC Road, Pune', rms: 4, assigned: 88, recorded: 72, rate: 81.8, status: 'good' },
  { branch: 'Connaught Place, Delhi', rms: 7, assigned: 178, recorded: 140, rate: 78.7, status: 'warning' },
  { branch: 'Bandra, Mumbai', rms: 9, assigned: 245, recorded: 182, rate: 74.3, status: 'critical' },
  { branch: 'Sector 17, Chandigarh', rms: 3, assigned: 78, recorded: 52, rate: 66.7, status: 'critical' },
];

const REWARD_SIGNAL_BREAKDOWN = [
  { name: 'Conversions', value: 312, color: '#10b981', description: 'Customer retained after intervention' },
  { name: 'Engagements', value: 487, color: '#3b82f6', description: 'Customer interacted but not yet retained' },
  { name: 'Ignored', value: 198, color: '#64748b', description: 'Customer did not respond to intervention' },
  { name: 'Opted Out', value: 89, color: '#f59e0b', description: 'Customer declined communication' },
  { name: 'Churned', value: 161, color: '#ef4444', description: 'Customer left despite intervention' },
];

const REWARD_SIGNAL_WEEKLY = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  conversions: Math.floor(35 + Math.random() * 15),
  engagements: Math.floor(55 + Math.random() * 20),
  ignored: Math.floor(20 + Math.random() * 10),
  optedOut: Math.floor(8 + Math.random() * 6),
  churned: Math.floor(16 + Math.random() * 10),
}));

const MODEL_VERSIONS = [
  {
    version: 'v1.47', deployedAt: '2 days ago', accuracy: 87.3,
    notes: 'Updated MAB weights post-email drift correction. Enhanced RM Call channel Q-value.',
    status: 'Active', statusColor: '#10b981', precision: 85.1, recall: 89.4, f1: 87.2,
    auc: 0.912, changes: ['MAB weight rebalance', 'Email channel penalty', 'Reward signal smoothing']
  },
  {
    version: 'v1.46', deployedAt: '9 days ago', accuracy: 86.1,
    notes: 'Stable release with improved WhatsApp channel predictions.',
    status: 'Checkpoint', statusColor: '#3b82f6', precision: 83.8, recall: 88.2, f1: 85.9,
    auc: 0.903, changes: ['WhatsApp NLP features', 'GNN layer optimization']
  },
  {
    version: 'v1.45', deployedAt: '16 days ago', accuracy: 85.2,
    notes: 'Stable release, baseline for Q2 metrics.',
    status: 'Checkpoint', statusColor: '#3b82f6', precision: 82.4, recall: 87.6, f1: 84.9,
    auc: 0.895, changes: ['Baseline Q2 calibration', 'Regional weight tuning']
  },
  {
    version: 'v1.44', deployedAt: '23 days ago', accuracy: 83.7,
    notes: 'Pre-email channel fix. Known issue: Email channel over-weighted.',
    status: 'Checkpoint', statusColor: '#3b82f6', precision: 80.9, recall: 86.1, f1: 83.4,
    auc: 0.882, changes: ['Initial email integration', 'SIP signal weighting']
  },
  {
    version: 'v1.43', deployedAt: '31 days ago', accuracy: 81.9,
    notes: 'Emergency hotfix for contagion score overflow.',
    status: 'Archived', statusColor: '#64748b', precision: 79.3, recall: 84.2, f1: 81.6,
    auc: 0.869, changes: ['Contagion overflow fix', 'Batch norm adjustment']
  },
];

const GAMIFICATION_BADGES = [
  { icon: '🏆', name: 'Recording Champion', description: '>95% for 4 consecutive weeks', holders: ['Priya Sharma'] },
  { icon: '⚡', name: 'Speed Recorder', description: 'Average <2h recording time', holders: ['Anand Krishnan', 'Vikram Patel'] },
  { icon: '🎯', name: 'Perfect Accuracy', description: '100% outcome match rate', holders: ['Sunita Rao'] },
  { icon: '🔥', name: '10-Week Streak', description: '>80% for 10+ weeks', holders: ['Anand Krishnan'] },
  { icon: '📊', name: 'Data Quality Star', description: 'Detailed notes on all recordings', holders: ['Priya Sharma', 'Rajesh Verma'] },
];

// ═══════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════

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
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            {p.name?.includes('ccuracy') || p.name?.includes('ate') ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

const getStatusColor = (status) => {
  if (status === 'excellent') return '#10b981';
  if (status === 'good') return '#3b82f6';
  if (status === 'warning') return '#f59e0b';
  return '#ef4444';
};

const getStatusLabel = (status) => {
  if (status === 'excellent') return 'Excellent';
  if (status === 'good') return 'Good';
  if (status === 'warning') return 'Warning';
  return 'Below Threshold';
};

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export default function PulseDashboardPage() {
  const [activeTab, setActiveTab] = useState('status');
  const [toast, setToast] = useState('');
  const [rmSearch, setRmSearch] = useState('');
  const [rmSortBy, setRmSortBy] = useState('rate');
  const [rmSortDir, setRmSortDir] = useState('desc');
  const [outcomeSubTab, setOutcomeSubTab] = useState('rm');
  const [compareModal, setCompareModal] = useState(null);
  const [compareVersions, setCompareVersions] = useState({ a: 'v1.47', b: 'v1.46' });
  const [manualCorrection, setManualCorrection] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({ signalId: '', currentOutcome: '', newOutcome: '', reason: '' });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // Sorted & Filtered RMs
  const sortedRMs = useMemo(() => {
    let list = RM_RECORDING_DATA.filter(rm =>
      rm.name.toLowerCase().includes(rmSearch.toLowerCase()) ||
      rm.branch.toLowerCase().includes(rmSearch.toLowerCase())
    );
    list.sort((a, b) => {
      const val = rmSortBy === 'rate' ? a.rate - b.rate : rmSortBy === 'assigned' ? a.assigned - b.assigned : a.recorded - b.recorded;
      return rmSortDir === 'desc' ? -val : val;
    });
    return list;
  }, [rmSearch, rmSortBy, rmSortDir]);

  const totalSignals = REWARD_SIGNAL_BREAKDOWN.reduce((s, r) => s + r.value, 0);

  const TABS = [
    { key: 'status', label: 'PULSE Status', icon: Activity },
    { key: 'outcomes', label: 'Outcome Recording', icon: FileText },
    { key: 'rewards', label: 'Reward Signal Audit', icon: Zap },
    { key: 'versions', label: 'Model Versions', icon: GitBranch },
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
          <h2>⚡ PULSE Feedback Loop Dashboard</h2>
          <p>Operational visibility into PPO training cycles, reward signals, channel MAB optimization & model versioning</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 100,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
            fontSize: '0.75rem', fontWeight: 600, color: '#10b981'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'voiceStatusBlink 1.2s ease-in-out infinite' }} />
            System Healthy
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => showToast('🧠 Triggering manual PPO training run...')}>
            <Brain size={14} /> Trigger PPO Run
          </button>
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
          TAB 1: PULSE STATUS
          ═══════════════════════════════════════════════ */}
      {activeTab === 'status' && (
        <div className="fade-in">
          {/* Status Panel Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24
          }}>
            {/* PPO Run Info */}
            <div className="card" style={{ gridColumn: 'span 2' }}>
              <div className="card-header">
                <div className="card-title"><Brain size={18} /> PPO Training Status</div>
                <span className="badge badge-green">Operational</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Last PPO Run', value: PULSE_STATUS.lastPPORun, icon: <Clock size={16} color="#3b82f6" />, sub: `Duration: ${PULSE_STATUS.runDuration}` },
                  { label: 'Next Scheduled Run', value: PULSE_STATUS.nextScheduledRun, icon: <Play size={16} color="#10b981" />, sub: 'Auto-scheduled' },
                  { label: 'Outcomes Ingested', value: PULSE_STATUS.outcomesIngested.toLocaleString(), icon: <Activity size={16} color="#8b5cf6" />, sub: 'This 24h cycle' },
                  { label: 'Policy Improvement', value: `+${PULSE_STATUS.policyImprovement}%`, icon: <TrendingUp size={16} color="#10b981" />, sub: 'Churn prediction accuracy' },
                  { label: 'Model Version', value: PULSE_STATUS.modelVersion, icon: <GitBranch size={16} color="#f59e0b" />, sub: 'Active in production' },
                  { label: 'Last Updated', value: '09:24 IST', icon: <RefreshCw size={16} color="#06b6d4" />, sub: '27 May 2026' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: 14, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      {item.icon}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>
                        {item.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reward Signal Quality Gauge */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Gauge size={18} /> Reward Signal Quality</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="10" />
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke={PULSE_STATUS.rewardSignalQuality >= 0.6 && PULSE_STATUS.rewardSignalQuality <= 0.9 ? '#10b981' : '#f59e0b'}
                      strokeWidth="10"
                      strokeDasharray={`${PULSE_STATUS.rewardSignalQuality * 264} 264`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {PULSE_STATUS.rewardSignalQuality}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Quality Score</span>
                  </div>
                </div>
                <div style={{
                  marginTop: 12, padding: '8px 14px', borderRadius: 8,
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                  textAlign: 'center', width: '100%'
                }}>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>Healthy Range</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>0.60 — 0.90</div>
                </div>
                <div style={{
                  marginTop: 8, width: '100%', height: 8, borderRadius: 4,
                  background: 'var(--bg-input)', overflow: 'hidden', position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute', left: '60%', right: '10%', height: '100%',
                    background: 'rgba(16,185,129,0.15)', borderRadius: 4
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: `${PULSE_STATUS.rewardSignalQuality * 100}%`,
                    top: -2, width: 12, height: 12, borderRadius: '50%',
                    background: '#10b981', border: '2px solid var(--bg-card)',
                    transform: 'translateX(-50%)'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Drift Alert */}
          {DRIFT_ALERTS.map(alert => (
            <div key={alert.id} className="alert-card" style={{
              borderLeftColor: alert.severity === 'warning' ? '#f59e0b' : '#3b82f6',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AlertTriangle size={18} color={alert.severity === 'warning' ? '#f59e0b' : '#3b82f6'} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {alert.timestamp} · Channel: {alert.channel} · Threshold: {alert.threshold}%
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => showToast(`👁 Investigating ${alert.channel} drift...`)}>
                  Investigate
                </button>
                <button className="btn btn-sm" style={{
                  background: 'none', border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 6,
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem'
                }}
                  onClick={() => showToast('✓ Alert acknowledged')}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 12 }}>
            {/* GNN Accuracy Rolling 30d */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><TrendingUp size={18} /> GNN Accuracy — Rolling 30 Days</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                    {PULSE_STATUS.gnnAccuracy}%
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={GNN_ACCURACY_TREND}>
                  <defs>
                    <linearGradient id="gradAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={4} />
                  <YAxis domain={[78, 92]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} iconType="circle" />
                  <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                  <Area type="monotone" dataKey="accuracy" name="Accuracy" stroke="#10b981" fill="url(#gradAcc)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Channel MAB Probabilities */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><BarChart3 size={18} /> Channel MAB Probabilities</div>
                <span className="badge badge-purple">Multi-Armed Bandit</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {MAB_PROBABILITIES.map((ch, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: ch.color }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {ch.channel}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {ch.totalActions.toLocaleString()} actions
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {ch.successRate}% success
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: ch.color, minWidth: 36, textAlign: 'right' }}>
                          {ch.probability}%
                        </span>
                      </div>
                    </div>
                    <div style={{
                      height: 24, borderRadius: 6, background: 'var(--bg-input)', overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${ch.probability}%`, height: '100%',
                        background: `linear-gradient(90deg, ${ch.color}, ${ch.color}90)`,
                        borderRadius: 6, transition: 'width 0.8s ease',
                        display: 'flex', alignItems: 'center', paddingLeft: 8
                      }}>
                        {ch.probability > 15 && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white' }}>
                            {ch.probability}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 16, padding: 12, borderRadius: 8,
                background: 'var(--bg-secondary)', fontSize: '0.75rem', color: 'var(--text-muted)'
              }}>
                💡 RM Call dominates due to high success rate in HNI segment. Email suppressed after drift detection.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 2: OUTCOME RECORDING
          ═══════════════════════════════════════════════ */}
      {activeTab === 'outcomes' && (
        <div className="fade-in">
          {/* Threshold Alert */}
          <div style={{
            padding: '14px 20px', borderRadius: 'var(--radius-md)',
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={18} color="#f59e0b" />
              <div>
                <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.88rem' }}>
                  Alert Threshold: 75% minimum recording rate
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                  4 RMs and 2 branches below threshold
                </span>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('📧 Reminder emails sent to underperforming RMs')}>
              Send Reminders
            </button>
          </div>

          {/* Sub Tab: RM vs Branch */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[
              { key: 'rm', label: 'Per RM Recording', icon: Users },
              { key: 'branch', label: 'Per Branch Recording', icon: Target },
              { key: 'leaderboard', label: 'Weekly Leaderboard', icon: Trophy },
              { key: 'badges', label: 'Gamification', icon: Award },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setOutcomeSubTab(t.key)}
                  className={`btn btn-sm ${outcomeSubTab === t.key ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* RM Recording Table */}
          {outcomeSubTab === 'rm' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Users size={18} /> RM Outcome Recording Rates</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    placeholder="Search RM or branch..."
                    value={rmSearch}
                    onChange={e => setRmSearch(e.target.value)}
                    style={{ width: 220, padding: '6px 12px', fontSize: '0.8rem' }}
                  />
                  <select
                    className="form-input"
                    value={rmSortBy}
                    onChange={e => setRmSortBy(e.target.value)}
                    style={{ width: 140, padding: '6px 10px', fontSize: '0.8rem' }}
                  >
                    <option value="rate">Sort by Rate</option>
                    <option value="assigned">Sort by Assigned</option>
                    <option value="recorded">Sort by Recorded</option>
                  </select>
                </div>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>RM Name</th>
                      <th>Branch</th>
                      <th>Assigned Cases</th>
                      <th>Recorded</th>
                      <th>Rate</th>
                      <th>Streak</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRMs.map((rm, i) => (
                      <tr key={rm.name}>
                        <td>
                          <span style={{
                            width: 24, height: 24, borderRadius: '50%', display: 'inline-flex',
                            alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem',
                            fontWeight: 700,
                            background: i < 3 ? 'rgba(245,158,11,0.15)' : 'var(--bg-secondary)',
                            color: i < 3 ? '#f59e0b' : 'var(--text-muted)'
                          }}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rm.name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{rm.branch}</td>
                        <td style={{ textAlign: 'center' }}>{rm.assigned}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{rm.recorded}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 50, height: 6, borderRadius: 3, background: 'var(--bg-input)', overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${rm.rate}%`, height: '100%',
                                background: getStatusColor(rm.status), borderRadius: 3
                              }} />
                            </div>
                            <span style={{ fontWeight: 700, color: getStatusColor(rm.status), fontSize: '0.85rem' }}>
                              {rm.rate}%
                            </span>
                          </div>
                        </td>
                        <td>
                          {rm.streak > 0 ? (
                            <span style={{
                              fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b',
                              display: 'flex', alignItems: 'center', gap: 4
                            }}>
                              🔥 {rm.streak}w
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${
                            rm.status === 'excellent' ? 'badge-green' :
                            rm.status === 'good' ? 'badge-blue' :
                            rm.status === 'warning' ? 'badge-yellow' : 'badge-red'
                          }`}>
                            {getStatusLabel(rm.status)}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}
                            onClick={() => showToast(`📊 Viewing detailed stats for ${rm.name}`)}>
                            <Eye size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Branch Recording */}
          {outcomeSubTab === 'branch' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Target size={18} /> Per Branch Recording Rates</div>
                <span className="badge badge-blue">{BRANCH_RECORDING_DATA.length} branches</span>
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      <th>RMs</th>
                      <th>Assigned</th>
                      <th>Recorded</th>
                      <th>Rate</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRANCH_RECORDING_DATA.map((br, i) => (
                      <tr key={br.branch}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{br.branch}</td>
                        <td>{br.rms}</td>
                        <td>{br.assigned}</td>
                        <td style={{ fontWeight: 600 }}>{br.recorded}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 60, height: 8, borderRadius: 4, background: 'var(--bg-input)', overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${br.rate}%`, height: '100%',
                                background: getStatusColor(br.status), borderRadius: 4
                              }} />
                            </div>
                            <span style={{ fontWeight: 700, color: getStatusColor(br.status) }}>
                              {br.rate}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            br.status === 'excellent' ? 'badge-green' :
                            br.status === 'good' ? 'badge-blue' :
                            br.status === 'warning' ? 'badge-yellow' : 'badge-red'
                          }`}>
                            {getStatusLabel(br.status)}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}
                            onClick={() => showToast(`📊 Branch details: ${br.branch}`)}>
                            <Eye size={12} /> Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Weekly Leaderboard */}
          {outcomeSubTab === 'leaderboard' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Trophy size={18} /> Weekly RM Leaderboard — Outcome Recording Completeness</div>
                <span className="badge badge-yellow">Week 22, 2026</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {RM_RECORDING_DATA.slice(0, 3).map((rm, i) => {
                  const medals = ['🥇', '🥈', '🥉'];
                  const colors = ['#f59e0b', '#94a3b8', '#cd7f32'];
                  return (
                    <div key={rm.name} style={{
                      textAlign: 'center', padding: 24,
                      background: `linear-gradient(135deg, ${colors[i]}10, transparent)`,
                      border: `2px solid ${colors[i]}30`,
                      borderRadius: 'var(--radius-lg)'
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{medals[i]}</div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{rm.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>{rm.branch}</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: colors[i] }}>{rm.rate}%</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {rm.recorded}/{rm.assigned} outcomes recorded
                      </div>
                      {rm.streak > 0 && (
                        <div style={{
                          marginTop: 8, padding: '4px 12px', borderRadius: 100,
                          background: 'rgba(245,158,11,0.1)', fontSize: '0.72rem',
                          fontWeight: 600, color: '#f59e0b', display: 'inline-flex',
                          alignItems: 'center', gap: 4
                        }}>
                          🔥 {rm.streak}-week streak
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>RM</th>
                      <th>Branch</th>
                      <th>This Week</th>
                      <th>Trend</th>
                      <th>Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RM_RECORDING_DATA.map((rm, i) => (
                      <tr key={rm.name}>
                        <td style={{ fontWeight: 700 }}>#{i + 1}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rm.name}</td>
                        <td>{rm.branch}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: getStatusColor(rm.status) }}>{rm.rate}%</span>
                        </td>
                        <td>
                          {rm.rate >= 85 ? (
                            <TrendingUp size={14} color="#10b981" />
                          ) : rm.rate >= 75 ? (
                            <ArrowRight size={14} color="#f59e0b" />
                          ) : (
                            <TrendingDown size={14} color="#ef4444" />
                          )}
                        </td>
                        <td style={{ fontWeight: 600 }}>{Math.floor(rm.rate * 10 + rm.streak * 5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Gamification Badges */}
          {outcomeSubTab === 'badges' && (
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Award size={18} /> Gamification Badges & Achievements</div>
                <span className="badge badge-purple">{GAMIFICATION_BADGES.length} badges available</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {GAMIFICATION_BADGES.map((badge, i) => (
                  <div key={i} style={{
                    padding: 20, borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    transition: 'var(--transition-slow)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {badge.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {badge.description}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                      Current Holders:
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {badge.holders.map((h, j) => (
                        <span key={j} style={{
                          padding: '4px 10px', borderRadius: 100,
                          background: 'rgba(139,92,246,0.1)', color: '#8b5cf6',
                          fontSize: '0.72rem', fontWeight: 600
                        }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 3: REWARD SIGNAL AUDIT
          ═══════════════════════════════════════════════ */}
      {activeTab === 'rewards' && (
        <div className="fade-in">
          {/* Health Indicator Bar */}
          <div style={{
            display: 'flex', gap: 16, marginBottom: 24
          }}>
            <div className="stat-card green" style={{ flex: 1 }}>
              <div className="stat-icon green"><CheckCircle size={20} /></div>
              <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                {REWARD_SIGNAL_BREAKDOWN[0].value}
              </div>
              <div className="stat-label">Conversions</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: 4 }}>
                {((REWARD_SIGNAL_BREAKDOWN[0].value / totalSignals) * 100).toFixed(1)}% of total
              </div>
            </div>
            <div className="stat-card blue" style={{ flex: 1 }}>
              <div className="stat-icon blue"><Activity size={20} /></div>
              <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>
                {REWARD_SIGNAL_BREAKDOWN[1].value}
              </div>
              <div className="stat-label">Engagements</div>
            </div>
            <div className="stat-card" style={{ flex: 1 }}>
              <div className="stat-icon" style={{ background: 'rgba(100,116,139,0.15)', color: '#64748b' }}><XCircle size={20} /></div>
              <div className="stat-value" style={{ color: '#64748b' }}>
                {REWARD_SIGNAL_BREAKDOWN[2].value}
              </div>
              <div className="stat-label">Ignored</div>
            </div>
            <div className="stat-card yellow" style={{ flex: 1 }}>
              <div className="stat-icon yellow"><Shield size={20} /></div>
              <div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>
                {REWARD_SIGNAL_BREAKDOWN[3].value}
              </div>
              <div className="stat-label">Opted Out</div>
            </div>
            <div className="stat-card red" style={{ flex: 1 }}>
              <div className="stat-icon red"><AlertTriangle size={20} /></div>
              <div className="stat-value" style={{ color: 'var(--accent-red)' }}>
                {REWARD_SIGNAL_BREAKDOWN[4].value}
              </div>
              <div className="stat-label">Churned</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Pie Chart Breakdown */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><BarChart3 size={18} /> Reward Signal Breakdown</div>
                <span className="badge badge-blue">{totalSignals.toLocaleString()} total</span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={REWARD_SIGNAL_BREAKDOWN}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={120}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: 'rgba(148,163,184,0.3)' }}
                  >
                    {REWARD_SIGNAL_BREAKDOWN.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                {REWARD_SIGNAL_BREAKDOWN.map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: '0.72rem', color: 'var(--text-muted)'
                  }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: r.color }} />
                    {r.name}: {r.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Signal Distribution Over Time */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Activity size={18} /> Signal Distribution — 8 Week Trend</div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={REWARD_SIGNAL_WEEKLY} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                  <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.72rem' }} iconType="circle" />
                  <Bar dataKey="conversions" name="Conversions" stackId="a" fill="#10b981" />
                  <Bar dataKey="engagements" name="Engagements" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="ignored" name="Ignored" stackId="a" fill="#64748b" />
                  <Bar dataKey="optedOut" name="Opted Out" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="churned" name="Churned" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reward Signal Health + Manual Correction */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Health Indicator */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><CheckCircle size={18} /> Reward Signal Health Indicator</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { metric: 'Conversion Rate', value: '25.0%', target: '>20%', status: 'healthy', bar: 82 },
                  { metric: 'Engagement Rate', value: '39.1%', target: '>30%', status: 'healthy', bar: 90 },
                  { metric: 'Churn Rate', value: '12.9%', target: '<15%', status: 'healthy', bar: 35 },
                  { metric: 'Opt-Out Rate', value: '7.1%', target: '<10%', status: 'healthy', bar: 25 },
                  { metric: 'Signal Latency', value: '2.4h avg', target: '<4h', status: 'healthy', bar: 60 },
                  { metric: 'Data Completeness', value: '94.2%', target: '>90%', status: 'healthy', bar: 94 },
                  { metric: 'Signal Consistency', value: '87.8%', target: '>85%', status: 'healthy', bar: 88 },
                ].map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <CheckCircle size={14} color={h.status === 'healthy' ? '#10b981' : '#f59e0b'} />
                    <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{h.metric}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: 60, textAlign: 'right' }}>
                      {h.target}
                    </span>
                    <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--bg-input)', overflow: 'hidden' }}>
                      <div style={{
                        width: `${h.bar}%`, height: '100%',
                        background: h.status === 'healthy' ? '#10b981' : '#f59e0b', borderRadius: 3
                      }} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981', width: 60, textAlign: 'right' }}>
                      {h.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Reward Correction */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Edit3 size={18} /> Manual Reward Correction</div>
                <button className="btn btn-primary btn-sm" onClick={() => setManualCorrection(true)}>
                  <Edit3 size={14} /> New Correction
                </button>
              </div>
              {!manualCorrection ? (
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    Recent corrections applied to reward signals:
                  </div>
                  {[
                    { id: 'SIG-4521', from: 'Churned', to: 'Conversion', by: 'Anand K.', date: '26 May', reason: 'Customer returned within 48h' },
                    { id: 'SIG-4489', from: 'Ignored', to: 'Engagement', by: 'Priya S.', date: '25 May', reason: 'WhatsApp read receipt confirmed' },
                    { id: 'SIG-4412', from: 'Engagement', to: 'Opted Out', by: 'Admin', date: '24 May', reason: 'Customer filed DNC request' },
                  ].map((c, i) => (
                    <div key={i} style={{
                      padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: 8,
                      marginBottom: 8, borderLeft: '3px solid var(--accent-blue)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{c.id}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.date} by {c.by}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>{c.from}</span>
                        {' → '}
                        <span style={{ color: '#10b981', fontWeight: 600 }}>{c.to}</span>
                        <span style={{ color: 'var(--text-muted)' }}> — {c.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label className="form-label">Signal ID</label>
                    <input className="form-input" placeholder="e.g., SIG-4521" value={correctionForm.signalId}
                      onChange={e => setCorrectionForm(f => ({ ...f, signalId: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="form-group">
                      <label className="form-label">Current Outcome</label>
                      <select className="form-input" value={correctionForm.currentOutcome}
                        onChange={e => setCorrectionForm(f => ({ ...f, currentOutcome: e.target.value }))}>
                        <option value="">Select...</option>
                        <option>Conversion</option>
                        <option>Engagement</option>
                        <option>Ignored</option>
                        <option>Opted Out</option>
                        <option>Churned</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Corrected Outcome</label>
                      <select className="form-input" value={correctionForm.newOutcome}
                        onChange={e => setCorrectionForm(f => ({ ...f, newOutcome: e.target.value }))}>
                        <option value="">Select...</option>
                        <option>Conversion</option>
                        <option>Engagement</option>
                        <option>Ignored</option>
                        <option>Opted Out</option>
                        <option>Churned</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Correction Reason</label>
                    <textarea className="form-input" rows={2} placeholder="Explain why this correction is needed..."
                      value={correctionForm.reason}
                      onChange={e => setCorrectionForm(f => ({ ...f, reason: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={() => setManualCorrection(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => {
                      setManualCorrection(false);
                      setCorrectionForm({ signalId: '', currentOutcome: '', newOutcome: '', reason: '' });
                      showToast('✅ Reward signal correction applied and logged');
                    }}>
                      <Check size={14} /> Apply Correction
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TAB 4: MODEL VERSIONS
          ═══════════════════════════════════════════════ */}
      {activeTab === 'versions' && (
        <div className="fade-in">
          {/* Version Action Bar */}
          <div style={{
            display: 'flex', gap: 10, marginBottom: 24, justifyContent: 'flex-end'
          }}>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('🔒 Current version v1.47 locked')}>
              <Lock size={14} /> Lock Current Version
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setCompareModal(true)}>
              <GitCompare size={14} /> Compare Versions
            </button>
          </div>

          {/* Version Table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><GitBranch size={18} /> Model Version History</div>
              <span className="badge badge-blue">{MODEL_VERSIONS.length} versions</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Deployed</th>
                    <th>Accuracy</th>
                    <th>Precision</th>
                    <th>Recall</th>
                    <th>F1</th>
                    <th>AUC</th>
                    <th>Notes</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MODEL_VERSIONS.map((v, i) => (
                    <tr key={v.version}>
                      <td>
                        <span style={{
                          fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem',
                          fontFamily: 'monospace'
                        }}>
                          {v.version}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{v.deployedAt}</td>
                      <td>
                        <span style={{
                          fontWeight: 800, fontSize: '1rem',
                          color: v.accuracy >= 87 ? '#10b981' : v.accuracy >= 85 ? '#3b82f6' : '#f59e0b'
                        }}>
                          {v.accuracy}%
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{v.precision}%</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{v.recall}%</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{v.f1}%</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{v.auc.toFixed(3)}</td>
                      <td style={{ maxWidth: 200 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.notes}</span>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 10px', borderRadius: 100, fontSize: '0.72rem',
                          fontWeight: 700,
                          background: `${v.statusColor}15`, color: v.statusColor
                        }}>
                          {v.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {v.status !== 'Active' && (
                            <button className="btn btn-danger btn-sm" style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                              onClick={() => showToast(`⚠️ Rollback to ${v.version} initiated. Confirmation required.`)}>
                              <RotateCcw size={11} /> Rollback
                            </button>
                          )}
                          <button className="btn btn-secondary btn-sm" style={{ padding: '3px 8px' }}
                            onClick={() => showToast(`📊 Viewing ${v.version} details`)}>
                            <Eye size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Version Changes Detail Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {MODEL_VERSIONS.slice(0, 4).map((v, i) => (
              <div key={v.version} className="card" style={{
                borderTop: `3px solid ${v.statusColor}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem' }}>{v.version}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: '0.68rem',
                    fontWeight: 700, background: `${v.statusColor}15`, color: v.statusColor
                  }}>
                    {v.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>{v.notes}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <span style={{ padding: '3px 8px', background: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Acc: {v.accuracy}%
                  </span>
                  <span style={{ padding: '3px 8px', background: 'var(--bg-secondary)', borderRadius: 6, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    AUC: {v.auc}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>Changes:</div>
                {v.changes.map((ch, j) => (
                  <div key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem',
                    color: 'var(--text-secondary)', marginBottom: 3
                  }}>
                    <span style={{ color: '#10b981' }}>•</span> {ch}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Compare Modal */}
          {compareModal && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setCompareModal(false)} />
              <div style={{
                position: 'relative', width: 720, maxHeight: '85vh', overflowY: 'auto',
                background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-strong)', padding: 28
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📊 Version Comparison</h3>
                  <button onClick={() => setCompareModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                </div>

                {/* Version Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Version A</label>
                    <select className="form-input" value={compareVersions.a}
                      onChange={e => setCompareVersions(v => ({ ...v, a: e.target.value }))}>
                      {MODEL_VERSIONS.map(v => <option key={v.version} value={v.version}>{v.version} — {v.status}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Version B</label>
                    <select className="form-input" value={compareVersions.b}
                      onChange={e => setCompareVersions(v => ({ ...v, b: e.target.value }))}>
                      {MODEL_VERSIONS.map(v => <option key={v.version} value={v.version}>{v.version} — {v.status}</option>)}
                    </select>
                  </div>
                </div>

                {/* Comparison Table */}
                {(() => {
                  const vA = MODEL_VERSIONS.find(v => v.version === compareVersions.a);
                  const vB = MODEL_VERSIONS.find(v => v.version === compareVersions.b);
                  if (!vA || !vB) return null;
                  const metrics = [
                    { label: 'Accuracy', a: vA.accuracy, b: vB.accuracy, unit: '%' },
                    { label: 'Precision', a: vA.precision, b: vB.precision, unit: '%' },
                    { label: 'Recall', a: vA.recall, b: vB.recall, unit: '%' },
                    { label: 'F1 Score', a: vA.f1, b: vB.f1, unit: '%' },
                    { label: 'AUC', a: vA.auc, b: vB.auc, unit: '' },
                  ];

                  const chartData = metrics.map(m => ({
                    metric: m.label,
                    [compareVersions.a]: m.a,
                    [compareVersions.b]: m.b,
                  }));

                  return (
                    <>
                      <div className="table-container" style={{ marginBottom: 20 }}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Metric</th>
                              <th style={{ textAlign: 'center' }}>{compareVersions.a}</th>
                              <th style={{ textAlign: 'center' }}>{compareVersions.b}</th>
                              <th style={{ textAlign: 'center' }}>Diff</th>
                            </tr>
                          </thead>
                          <tbody>
                            {metrics.map((m, i) => {
                              const diff = m.a - m.b;
                              return (
                                <tr key={i}>
                                  <td style={{ fontWeight: 600 }}>{m.label}</td>
                                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {m.unit === '%' ? `${m.a}%` : m.a.toFixed(3)}
                                  </td>
                                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {m.unit === '%' ? `${m.b}%` : m.b.toFixed(3)}
                                  </td>
                                  <td style={{
                                    textAlign: 'center', fontWeight: 700,
                                    color: diff > 0 ? '#10b981' : diff < 0 ? '#ef4444' : 'var(--text-muted)'
                                  }}>
                                    {diff > 0 ? '+' : ''}{m.unit === '%' ? `${diff.toFixed(1)}%` : diff.toFixed(3)}
                                    {diff > 0 ? ' ↑' : diff < 0 ? ' ↓' : ''}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Comparison Chart */}
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={chartData} barGap={8}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                          <XAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <YAxis domain={[75, 95]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: '0.75rem' }} iconType="circle" />
                          <Bar dataKey={compareVersions.a} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                          <Bar dataKey={compareVersions.b} fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
