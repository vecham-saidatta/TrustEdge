import { useState } from 'react';
import {
  Bot, MessageSquare, AlertTriangle, TrendingUp, Shield, Globe, Clock,
  ThumbsUp, ThumbsDown, Flag, Eye, CheckCircle, XCircle, Edit3,
  Send, Filter, RefreshCw, Users, Activity, BarChart3, ArrowUpRight,
  ArrowDownRight, Minus, ChevronRight, X, Search, Zap, Languages,
  HeadphonesIcon, Settings, FileText, Star, AlertCircle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// ═══════════════════════════════════════════════
// MOCK DATA — SAGE Conversation Monitoring
// ═══════════════════════════════════════════════

const headerMetrics = [
  { label: 'Active Conversations', value: '47', trend: 'up', change: '+12%', color: '#3b82f6' },
  { label: 'Avg Session Duration', value: '4.2 min', trend: 'neutral', change: 'Stable', color: '#8b5cf6' },
  { label: 'Helpful Ratio', value: '87.3%', trend: 'up', change: '+2.1%', color: '#10b981' },
  { label: 'Escalation Rate', value: '3.8%', trend: 'down', change: '-0.4%', color: '#f59e0b' },
];

const topicVolume = [
  { name: 'Budgeting', value: 342, color: '#3b82f6' },
  { name: 'Saving', value: 287, color: '#10b981' },
  { name: 'Debt', value: 198, color: '#ef4444' },
  { name: 'Investing', value: 156, color: '#8b5cf6' },
  { name: 'General', value: 264, color: '#f59e0b' },
];

const satisfactionTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `May ${i + 13}`,
  satisfaction: 82 + Math.random() * 10,
  confidence: 78 + Math.random() * 12,
  escalation: 2 + Math.random() * 4,
}));

const translationStats = [
  { lang: 'Hindi', total: 1247, success: 1198, rate: 96.1, feedback: 4.2 },
  { lang: 'Telugu', total: 423, success: 389, rate: 92.0, feedback: 3.8 },
];

const flaggedConversations = [
  { id: 'SAGE-4521', customer: 'Meera Reddy', topic: 'DEBT', flag: 'Distress Keywords', confidence: 0.42, time: '14 min ago', messages: 8, severity: 'P1',
    transcript: [
      { role: 'user', text: 'I have too many EMIs and I don\'t know what to do. I feel completely stuck.', confidence: null },
      { role: 'sage', text: 'I understand this feels overwhelming. Let\'s look at your EMI commitments together and explore options for restructuring...', confidence: 0.42 },
      { role: 'user', text: 'I\'m thinking of just closing everything and moving to another bank. My friend got better rates.', confidence: null },
      { role: 'sage', text: 'Before making any changes, let me help you compare the total costs. Sometimes switching can involve hidden fees...', confidence: 0.58 },
    ]},
  { id: 'SAGE-4518', customer: 'Vikram Singh', topic: 'INVESTING', flag: 'Not Helpful ×2', confidence: 0.71, time: '42 min ago', messages: 12, severity: 'P2',
    transcript: [
      { role: 'user', text: 'Should I invest in cryptocurrency?', confidence: null },
      { role: 'sage', text: 'Cryptocurrency is a high-risk asset class. As a general guideline, only invest what you can afford to lose...', confidence: 0.71 },
      { role: 'user', text: 'That\'s not helpful. Give me specific coin recommendations.', confidence: null },
      { role: 'sage', text: 'I\'m not able to provide specific cryptocurrency recommendations as they fall outside regulated financial products...', confidence: 0.68 },
    ]},
  { id: 'SAGE-4515', customer: 'Anjali Patel', topic: 'BUDGETING', flag: 'Confidence <0.65', confidence: 0.53, time: '1h 12m ago', messages: 6, severity: 'P2',
    transcript: [
      { role: 'user', text: 'How do I calculate my GST liability for my small business?', confidence: null },
      { role: 'sage', text: 'For GST calculations, you would need to determine your turnover threshold. Businesses above ₹40L annual turnover...', confidence: 0.53 },
    ]},
  { id: 'SAGE-4512', customer: 'Ramesh Gupta', topic: 'SAVING', flag: 'Topic Drift', confidence: 0.78, time: '1h 45m ago', messages: 15, severity: 'P3',
    transcript: [
      { role: 'user', text: 'I wanted to ask about savings accounts but now let me ask about life insurance...', confidence: null },
      { role: 'sage', text: 'Sure! Life insurance is an important financial planning tool. There are two main types...', confidence: 0.78 },
    ]},
  { id: 'SAGE-4508', customer: 'Sunita Devi', topic: 'GENERAL', flag: 'Translation Low', confidence: 0.81, time: '2h 30m ago', messages: 4, severity: 'P3',
    transcript: [
      { role: 'user', text: 'मुझे लोन कैसे मिलेगा? (How to get loan?)', confidence: null },
      { role: 'sage', text: 'लोन प्राप्त करने के लिए, आपको कुछ दस्तावेज़ जमा करने होंगे... (To get a loan, you need to submit documents...)', confidence: 0.81 },
    ]},
  { id: 'SAGE-4505', customer: 'Karthik Iyer', topic: 'DEBT', flag: 'Factual Error', confidence: 0.67, time: '3h 15m ago', messages: 7, severity: 'P1',
    transcript: [
      { role: 'user', text: 'What is the current RBI repo rate?', confidence: null },
      { role: 'sage', text: 'The current RBI repo rate is 6.25% as of January 2026.', confidence: 0.67 },
    ]},
];

const qualityByTopic = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 12}`,
  Budgeting: 82 + Math.random() * 10,
  Saving: 85 + Math.random() * 8,
  Debt: 75 + Math.random() * 12,
  Investing: 78 + Math.random() * 10,
  General: 80 + Math.random() * 8,
}));

const topicAccuracy = [
  { topic: 'Budgeting', accuracy: 91.2, color: '#3b82f6' },
  { topic: 'Saving', accuracy: 89.5, color: '#10b981' },
  { topic: 'General', accuracy: 86.8, color: '#f59e0b' },
  { topic: 'Investing', accuracy: 83.4, color: '#8b5cf6' },
  { topic: 'Debt', accuracy: 80.1, color: '#ef4444' },
];

const languagePerformance = [
  { lang: 'English', helpful: 91.2, notHelpful: 8.8 },
  { lang: 'Hindi', helpful: 87.4, notHelpful: 12.6 },
  { lang: 'Telugu', helpful: 82.1, notHelpful: 17.9 },
];

const handoffQueue = [
  { id: 'HO-101', customer: 'Deepak Mehta', topic: 'DEBT', reason: 'Suicide ideation keywords detected', priority: 'P1', waitTime: '2 min', status: 'WAITING' },
  { id: 'HO-102', customer: 'Lata Krishnan', topic: 'INVESTING', reason: 'Complex regulatory question', priority: 'P2', waitTime: '8 min', status: 'ASSIGNED' },
  { id: 'HO-103', customer: 'Farhan Sheikh', topic: 'GENERAL', reason: 'Customer requested human agent', priority: 'P3', waitTime: '15 min', status: 'WAITING' },
];

const translationAudit = [
  { id: 'TR-001', original: 'How to apply for home loan?', translated: 'होम लोन कैसे अप्लाई करें?', lang: 'Hindi', confidence: 0.94, method: 'Live API', feedback: 'Correct' },
  { id: 'TR-002', original: 'What is the interest rate for FD?', translated: 'FD యొక్క వడ్డీ రేటు ఎంత?', lang: 'Telugu', confidence: 0.87, method: 'Live API', feedback: 'Needs Edit' },
  { id: 'TR-004', original: 'EMI calculator for car loan', translated: 'कार लोन के लिए EMI कैलकुलेटर', lang: 'Hindi', confidence: 0.96, method: 'Live API', feedback: null },
  { id: 'TR-005', original: 'What documents needed for KYC?', translated: 'KYC కోసం ఏ డాక్యుమెంట్లు అవసరం?', lang: 'Telugu', confidence: 0.72, method: 'Offline Dict', feedback: 'Incorrect' },
];

const TOPIC_COLORS = { Budgeting: '#3b82f6', Saving: '#10b981', Debt: '#ef4444', Investing: '#8b5cf6', General: '#f59e0b' };

export default function SageMonitorPage() {
  const [activeTab, setActiveTab] = useState('live');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [correctedResponse, setCorrectedResponse] = useState('');

  const tabs = [
    { id: 'live', label: 'Live Dashboard', icon: Activity, badge: null },
    { id: 'flagged', label: 'Flagged', icon: Flag, badge: flaggedConversations.length, badgeColor: '#ef4444' },
    { id: 'quality', label: 'Quality Trends', icon: TrendingUp },
    { id: 'handoff', label: 'Human Handoff', icon: HeadphonesIcon, badge: handoffQueue.filter(h => h.status === 'WAITING').length, badgeColor: '#f59e0b' },
    { id: 'translation', label: 'Translation Quality', icon: Languages },
  ];

  const getSeverityBadge = (sev) => {
    const map = { P1: 'badge-red', P2: 'badge-yellow', P3: 'badge-blue' };
    return map[sev] || 'badge-blue';
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>SAGE Monitor</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>AI conversation quality monitoring, governance, and continuous improvement</p>
        </div>
        <div className="live-indicator">Live Monitoring</div>
      </div>

      {/* Header Metrics */}
      <div className="admin-grid admin-grid-4" style={{ marginBottom: 24 }}>
        {headerMetrics.map((m, i) => (
          <div key={i} className="metric-card-mini">
            <span className="metric-label">{m.label}</span>
            <span className="metric-value" style={{ color: m.color }}>{m.value}</span>
            <span className={`metric-trend ${m.trend === 'up' ? (m.label === 'Escalation Rate' ? 'down' : 'up') : m.trend}`}>
              {m.trend === 'up' ? <ArrowUpRight size={12} /> : m.trend === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />}
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon size={16} /> {tab.label}
            {tab.badge && (
              <span className="tab-badge" style={{ background: `${tab.badgeColor}22`, color: tab.badgeColor }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Live Dashboard */}
      {activeTab === 'live' && (
        <div className="fade-in">
          <div className="admin-grid admin-grid-2" style={{ marginBottom: 24 }}>
            {/* Topic Volume Donut */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <span className="admin-panel-title"><BarChart3 size={16} /> Volume by Topic (24h)</span>
                <span className="admin-panel-subtitle">{topicVolume.reduce((s, t) => s + t.value, 0)} total</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie data={topicVolume} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                      {topicVolume.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid #2d3748', borderRadius: 8, color: '#f0f4ff' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ flex: 1 }}>
                  {topicVolume.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: t.color }} />
                      <span style={{ flex: 1, fontSize: '0.82rem' }}>{t.name}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Satisfaction & Confidence Trend */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <span className="admin-panel-title"><TrendingUp size={16} /> Quality Metrics Trend</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={satisfactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} interval={2} />
                  <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid #2d3748', borderRadius: 8, color: '#f0f4ff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} name="Satisfaction %" dot={false} />
                  <Line type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={2} name="Avg Confidence" dot={false} />
                  <Line type="monotone" dataKey="escalation" stroke="#ef4444" strokeWidth={2} name="Escalation %" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Translation Success */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Languages size={16} /> Translation Success Rate by Language</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Language</th><th>Total Translations</th><th>Successful</th><th>Success Rate</th><th>Avg Feedback</th><th>Status</th></tr></thead>
                <tbody>
                  {translationStats.map((t, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{t.lang}</td>
                      <td>{t.total.toLocaleString()}</td>
                      <td>{t.success.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar-track" style={{ width: 100, height: 6 }}>
                            <div className={`progress-bar-value ${t.rate > 94 ? 'good' : t.rate > 90 ? 'warning' : 'danger'}`} style={{ width: `${t.rate}%` }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{t.rate}%</span>
                        </div>
                      </td>
                      <td><span style={{ color: t.feedback >= 4 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>★ {t.feedback}/5</span></td>
                      <td><span className={`badge ${t.rate > 94 ? 'badge-green' : 'badge-yellow'}`}>{t.rate > 94 ? 'Healthy' : 'Monitor'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Flagged Conversations */}
      {activeTab === 'flagged' && (
        <div className="fade-in">
          {flaggedConversations.map((conv, i) => (
            <div key={i} className="admin-panel" style={{
              marginBottom: 12,
              borderLeft: `3px solid ${conv.severity === 'P1' ? 'var(--accent-red)' : conv.severity === 'P2' ? 'var(--accent-yellow)' : 'var(--accent-blue)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <span className={`badge ${getSeverityBadge(conv.severity)}`} style={{ fontWeight: 700 }}>{conv.severity}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{conv.customer}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
                      <span>{conv.id}</span>
                      <span>•</span>
                      <span>{conv.topic}</span>
                      <span>•</span>
                      <span>{conv.messages} messages</span>
                      <span>•</span>
                      <span>{conv.time}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge badge-red" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <Flag size={12} /> {conv.flag}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: conv.confidence < 0.65 ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                    Confidence: {(conv.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="action-row">
                  <button className="action-btn" onClick={() => { setSelectedConversation(conv); setShowTranscript(true); }}>
                    <Eye size={14} /> View Transcript
                  </button>
                  <button className="action-btn success"><CheckCircle size={14} /> Acceptable</button>
                  <button className="action-btn" style={{ color: 'var(--accent-yellow)', borderColor: 'rgba(245,158,11,0.3)' }}>
                    <Edit3 size={14} /> Needs Improvement
                  </button>
                  <button className="action-btn danger"><XCircle size={14} /> Model Error</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quality Trends */}
      {activeTab === 'quality' && (
        <div className="fade-in">
          <div className="admin-grid admin-grid-2" style={{ marginBottom: 24 }}>
            <div className="admin-panel">
              <div className="admin-panel-header">
                <span className="admin-panel-title"><TrendingUp size={16} /> Weekly Confidence by Topic</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={qualityByTopic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid #2d3748', borderRadius: 8, color: '#f0f4ff' }} />
                  <Legend />
                  {Object.keys(TOPIC_COLORS).map(topic => (
                    <Line key={topic} type="monotone" dataKey={topic} stroke={TOPIC_COLORS[topic]} strokeWidth={2} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <span className="admin-panel-title"><BarChart3 size={16} /> Topic Accuracy Rates</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topicAccuracy} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis type="number" domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis type="category" dataKey="topic" tick={{ fill: '#94a3b8', fontSize: 12 }} width={80} />
                  <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid #2d3748', borderRadius: 8, color: '#f0f4ff' }} />
                  <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                    {topicAccuracy.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language Performance */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Globe size={16} /> Regional Language Performance</span>
            </div>
            <div className="admin-grid admin-grid-4">
              {languagePerformance.map((l, i) => (
                <div key={i} style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 8 }}>{l.lang}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: l.helpful > 85 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
                    {l.helpful}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Helpful Rate</div>
                  <div className="progress-bar-track" style={{ marginTop: 8, height: 6 }}>
                    <div className={`progress-bar-value ${l.helpful > 85 ? 'good' : 'warning'}`} style={{ width: `${l.helpful}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Human Handoff */}
      {activeTab === 'handoff' && (
        <div className="fade-in">
          <div className="admin-grid admin-grid-3" style={{ marginBottom: 24 }}>
            <div className="metric-card-mini">
              <span className="metric-label">Waiting</span>
              <span className="metric-value" style={{ color: 'var(--accent-yellow)' }}>{handoffQueue.filter(h => h.status === 'WAITING').length}</span>
            </div>
            <div className="metric-card-mini">
              <span className="metric-label">Assigned</span>
              <span className="metric-value" style={{ color: 'var(--accent-green)' }}>{handoffQueue.filter(h => h.status === 'ASSIGNED').length}</span>
            </div>
            <div className="metric-card-mini">
              <span className="metric-label">Handoff Success Rate</span>
              <span className="metric-value" style={{ color: 'var(--accent-blue)' }}>89.2%</span>
            </div>
          </div>

          <div className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="admin-panel-header">
              <span className="admin-panel-title"><HeadphonesIcon size={16} /> Active Handoff Queue</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>ID</th><th>Customer</th><th>Topic</th><th>Reason</th><th>Priority</th><th>Wait Time</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {handoffQueue.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{h.id}</td>
                      <td style={{ fontWeight: 600 }}>{h.customer}</td>
                      <td><span className="inline-tag">{h.topic}</span></td>
                      <td style={{ fontSize: '0.82rem', maxWidth: 250 }}>{h.reason}</td>
                      <td><span className={`badge ${getSeverityBadge(h.priority)}`}>{h.priority}</span></td>
                      <td style={{ fontWeight: 700, color: h.status === 'WAITING' ? 'var(--accent-yellow)' : 'var(--text-muted)' }}>{h.waitTime}</td>
                      <td><span className={`badge ${h.status === 'WAITING' ? 'badge-yellow' : 'badge-green'}`}>{h.status}</span></td>
                      <td>
                        <button className="action-btn primary" style={{ fontSize: '0.72rem' }}>
                          <Users size={12} /> {h.status === 'WAITING' ? 'Assign Agent' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Handoff Config */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Settings size={16} /> Auto-Handoff Configuration</span>
            </div>
            <div className="admin-grid admin-grid-3">
              {[
                { trigger: 'Suicide/Self-harm Keywords', action: 'Immediate P1 Handoff', enabled: true },
                { trigger: 'Confidence < 0.40 twice', action: 'Auto-escalate to agent', enabled: true },
                { trigger: 'Customer requests human', action: 'Route to available agent', enabled: true },
                { trigger: '3+ "Not Helpful" ratings', action: 'Flag + offer handoff', enabled: true },
                { trigger: 'Complex regulatory question', action: 'Route to compliance agent', enabled: false },
                { trigger: 'Sentiment drops to Angry', action: 'Priority handoff', enabled: true },
              ].map((cfg, i) => (
                <div key={i} style={{
                  padding: 14, background: 'var(--bg-secondary)', borderRadius: 8,
                  borderLeft: `3px solid ${cfg.enabled ? 'var(--accent-green)' : 'var(--border-color)'}`,
                  opacity: cfg.enabled ? 1 : 0.6
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 4 }}>{cfg.trigger}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cfg.action}</div>
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 32, height: 18, borderRadius: 9, background: cfg.enabled ? 'var(--accent-green)' : 'var(--border-strong)',
                      position: 'relative', cursor: 'pointer', transition: 'var(--transition)'
                    }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: '50%', background: 'white',
                        position: 'absolute', top: 2, left: cfg.enabled ? 16 : 2, transition: 'var(--transition)'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: cfg.enabled ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                      {cfg.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Translation Quality */}
      {activeTab === 'translation' && (
        <div className="fade-in">
          <div className="admin-grid admin-grid-3" style={{ marginBottom: 24 }}>
            <div className="metric-card-mini">
              <span className="metric-label">Overall Translation Accuracy</span>
              <span className="metric-value" style={{ color: 'var(--accent-green)' }}>94.1%</span>
            </div>
            <div className="metric-card-mini">
              <span className="metric-label">Fallback Rate (Offline Dict)</span>
              <span className="metric-value" style={{ color: 'var(--accent-yellow)' }}>12.3%</span>
            </div>
            <div className="metric-card-mini">
              <span className="metric-label">Customer Feedback Score</span>
              <span className="metric-value" style={{ color: 'var(--accent-blue)' }}>★ 4.0/5</span>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><FileText size={16} /> Translation Audit Log</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>ID</th><th>Original (English)</th><th>Translated</th><th>Language</th><th>Confidence</th><th>Method</th><th>Feedback</th><th>Actions</th></tr></thead>
                <tbody>
                  {translationAudit.map(t => (
                    <tr key={t.id} style={t.feedback === 'Incorrect' ? { background: 'rgba(239,68,68,0.06)' } : {}}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{t.id}</td>
                      <td style={{ fontSize: '0.82rem', maxWidth: 200 }}>{t.original}</td>
                      <td style={{ fontSize: '0.82rem', maxWidth: 200 }}>{t.translated}</td>
                      <td><span className="inline-tag">{t.lang}</span></td>
                      <td>
                        <span style={{ fontWeight: 700, color: t.confidence > 0.9 ? 'var(--accent-green)' : t.confidence > 0.8 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                          {(t.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td><span className={`badge ${t.method === 'Live API' ? 'badge-blue' : 'badge-yellow'}`}>{t.method}</span></td>
                      <td>
                        {t.feedback ? (
                          <span className={`badge ${t.feedback === 'Correct' ? 'badge-green' : t.feedback === 'Needs Edit' ? 'badge-yellow' : 'badge-red'}`}>
                            {t.feedback}
                          </span>
                        ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pending</span>}
                      </td>
                      <td><button className="action-btn" style={{ fontSize: '0.72rem' }}><Edit3 size={12} /> Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transcript Viewer Modal */}
      {showTranscript && selectedConversation && (
        <div className="admin-modal-overlay" onClick={() => setShowTranscript(false)}>
          <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">Conversation Transcript — {selectedConversation.id}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {selectedConversation.customer} • {selectedConversation.topic} • {selectedConversation.messages} messages
                </div>
              </div>
              <button className="admin-modal-close" onClick={() => setShowTranscript(false)}><X size={16} /></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <span className={`badge ${getSeverityBadge(selectedConversation.severity)}`}>{selectedConversation.severity}</span>
                <span className="badge badge-red"><Flag size={12} /> {selectedConversation.flag}</span>
              </div>

              {selectedConversation.transcript.map((msg, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, marginBottom: 16,
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem'
                  }}>{msg.role === 'user' ? 'U' : 'S'}</div>
                  <div style={{
                    maxWidth: '70%', padding: '12px 16px', borderRadius: 12,
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'var(--bg-secondary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    border: msg.role === 'sage' ? '1px solid var(--border-color)' : 'none',
                  }}>
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{msg.text}</div>
                    {msg.confidence && (
                      <div style={{ marginTop: 8, fontSize: '0.72rem', color: msg.confidence < 0.65 ? '#ef4444' : '#94a3b8' }}>
                        Confidence: {(msg.confidence * 100).toFixed(0)}%
                        {msg.confidence < 0.65 && ' ⚠️ Low'}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* RLHF Correction */}
              <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: 8, color: 'var(--accent-yellow)' }}>
                  <Edit3 size={14} style={{ marginRight: 6 }} /> Corrected Response (RLHF Pipeline)
                </div>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Enter the corrected response that should have been given..."
                  value={correctedResponse}
                  onChange={e => setCorrectedResponse(e.target.value)}
                  style={{ resize: 'vertical', width: '100%' }}
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="action-btn success"><CheckCircle size={14} /> Mark Acceptable</button>
              <button className="action-btn" style={{ color: 'var(--accent-yellow)', borderColor: 'rgba(245,158,11,0.3)' }}>
                <AlertCircle size={14} /> Needs Improvement
              </button>
              <button className="action-btn danger"><XCircle size={14} /> Submit as Model Error</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
