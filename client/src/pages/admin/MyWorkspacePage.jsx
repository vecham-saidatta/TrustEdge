import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import {
  Phone, AlertTriangle, Clock, TrendingUp, TrendingDown, MessageSquare, ClipboardList,
  Users, ShieldAlert, Megaphone, BarChart3, CheckCircle, XCircle, ArrowUpRight,
  ArrowDownRight, Eye, UserCheck, Briefcase, Building2, MapPin, Activity,
  Zap, Target, Bell, ChevronRight, RefreshCw, Calendar, Star, FileText, Send
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend, AreaChart, Area, Cell
} from 'recharts';

// ═══════════════════════════════════════════════════
// MOCK DATA — Indian Banking Context
// ═══════════════════════════════════════════════════

const ROLES = [
  { key: 'rm', label: 'Relationship Manager', icon: UserCheck, color: 'var(--accent-blue)' },
  { key: 'bm', label: 'Branch Manager', icon: Building2, color: 'var(--accent-green)' },
  { key: 'rm_regional', label: 'Regional Manager', icon: MapPin, color: 'var(--accent-purple)' },
];

const now = new Date();
const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// HELPER: Mini Sparkline
// ═══════════════════════════════════════════════════
function Sparkline({ data, width = 80, height = 24, color = '#3b82f6' }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * height} r="3" fill={color} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// HELPER: Pulsing Dot
// ═══════════════════════════════════════════════════
function PulsingDot({ color = 'var(--accent-red)', size = 8 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color,
      boxShadow: `0 0 0 0 ${color}`,
      animation: 'pulse-dot 2s infinite',
    }}>
      <style>{`@keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 70% { box-shadow: 0 0 0 8px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }`}</style>
    </span>
  );
}

// ═══════════════════════════════════════════════════
// HELPER: Risk Score Bar
// ═══════════════════════════════════════════════════
function RiskBar({ score }) {
  const pct = Math.round(score * 100);
  const color = score >= 0.85 ? 'var(--accent-red)' : score >= 0.65 ? '#f97316' : score >= 0.45 ? 'var(--accent-yellow)' : 'var(--accent-green)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}dd)`, borderRadius: 4, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color, minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// HELPER: Urgency Badge
// ═══════════════════════════════════════════════════
function UrgencyBadge({ urgency }) {
  const colors = {
    Critical: { bg: 'var(--accent-red-soft)', color: 'var(--accent-red)' },
    High: { bg: 'var(--accent-yellow-soft)', color: 'var(--accent-yellow)' },
    Moderate: { bg: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)' },
    Medium: { bg: 'var(--accent-yellow-soft)', color: 'var(--accent-yellow)' },
    Low: { bg: 'var(--accent-green-soft)', color: 'var(--accent-green)' },
  };
  const c = colors[urgency] || colors.Moderate;
  return <span className="badge" style={{ background: c.bg, color: c.color }}>{urgency}</span>;
}

// ═══════════════════════════════════════════════════
// HELPER: Severity Badge
// ═══════════════════════════════════════════════════
function SeverityBadge({ severity }) {
  const map = {
    Critical: 'badge-red', High: 'badge-yellow', Moderate: 'badge-blue', Warning: 'badge-yellow', Healthy: 'badge-green'
  };
  return <span className={`badge ${map[severity] || 'badge-blue'}`}>{severity}</span>;
}

// ═══════════════════════════════════════════════════
// CUSTOM RECHARTS TOOLTIP
// ═══════════════════════════════════════════════════
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{ background: 'rgba(26,32,53,0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 14px', fontSize: '0.78rem' }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, display: 'flex', gap: 8 }}>
          <span>{p.name}:</span><span style={{ fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════
export default function MyWorkspacePage() {
  const [data, setData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    adminAPI.getStats().then(res => {
      setData(res.data.data || res.data);
    }).catch(console.error);
  }, [lastRefresh]);

  const [activeRole, setActiveRole] = useState('rm');
  const [toast, setToast] = useState('');
  const [actionModal, setActionModal] = useState(null);
  const [outcomeRecords, setOutcomeRecords] = useState({});
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState([]);
  const [callbackCompleted, setCallbackCompleted] = useState([]);
  const [actionedCampaigns, setActionedCampaigns] = useState([]);

  if (!data) return <div style={{padding: 40, color: '#fff'}}>Loading Workspace Data...</div>;
  const dbData = (data.data || data);
  const { rmView, bmView, regionalView } = dbData;
  const { priorityCustomers, stressAlerts, pendingCallbacks, riskEscalations, sageConversations, outreachOutcomes } = rmView;
  const { bmStats, campaignApprovals, rmActivityData } = bmView;
  const { branchHealth, campaignComparisonData, escalatedCases, decliningBranches } = regionalView;



  // Greeting
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const userName = activeRole === 'rm' ? 'Ankit Verma' : activeRole === 'bm' ? 'Suresh Menon' : 'Meera Krishnamurthy';

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    showToast('🔄 Workspace refreshed — all queues updated');
  };

  // ════════════════ RM VIEW ════════════════
  const RMView = () => (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary Stats Row */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-card red">
          <div className="stat-icon red"><AlertTriangle size={22} /></div>
          <div className="stat-value">5</div>
          <div className="stat-label">Priority Calls Due</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><Bell size={22} /></div>
          <div className="stat-value">{stressAlerts.length - acknowledgedAlerts.length}</div>
          <div className="stat-label">Unacknowledged Alerts</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue"><Phone size={22} /></div>
          <div className="stat-value">{pendingCallbacks.length - callbackCompleted.length}</div>
          <div className="stat-label">Pending Callbacks</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple"><TrendingUp size={22} /></div>
          <div className="stat-value">₹1.41Cr</div>
          <div className="stat-label">Total AUM at Risk</div>
        </div>
      </div>

      {/* Section 1: Priority Queue */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Zap size={18} color="var(--accent-yellow)" /> AI-Ranked Priority Queue — Top 5 Customers to Call Today</div>
          <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><PulsingDot size={6} /> LIVE</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Risk Score</th>
                <th>AUM at Risk</th>
                <th>Segment</th>
                <th>Urgency</th>
                <th>Last Contact</th>
                <th>Trend (30d)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {priorityCustomers.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 800, color: i === 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                  </td>
                  <td><RiskBar score={c.riskScore} /></td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-red)' }}>₹{(c.aumAtRisk / 100000).toFixed(1)}L</td>
                  <td><span className="badge badge-purple">{c.segment}</span></td>
                  <td><UrgencyBadge urgency={c.urgency} /></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{c.lastContact}</td>
                  <td><Sparkline data={c.trend} color={c.riskScore >= 0.85 ? '#ef4444' : '#f59e0b'} /></td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => showToast(`📞 Initiating call to ${c.name}...`)}>
                      <Phone size={14} /> Call Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Section 2: Stress Alerts */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><ShieldAlert size={18} color="var(--accent-red)" /> Unacknowledged Stress Alerts</div>
            <span className="badge badge-yellow">{stressAlerts.filter(a => !acknowledgedAlerts.includes(a.id)).length} pending</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stressAlerts.filter(a => !acknowledgedAlerts.includes(a.id)).map(alert => (
              <div key={alert.id} className="alert-card" style={{
                borderLeftColor: alert.severity === 'Critical' ? 'var(--accent-red)' : alert.severity === 'High' ? '#f97316' : 'var(--accent-yellow)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{alert.customer}</span>
                    <SeverityBadge severity={alert.severity} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{alert.time}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{alert.message}</p>
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => {
                  setAcknowledgedAlerts(prev => [...prev, alert.id]);
                  showToast(`✅ Alert for ${alert.customer} acknowledged`);
                }}>
                  <CheckCircle size={14} /> Acknowledge
                </button>
              </div>
            ))}
            {stressAlerts.filter(a => !acknowledgedAlerts.includes(a.id)).length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                <CheckCircle size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <div>All alerts acknowledged ✓</div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Pending Callbacks */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Clock size={18} color="var(--accent-blue)" /> Pending Callback Commitments</div>
            <span className="badge badge-blue">{pendingCallbacks.filter(c => !callbackCompleted.includes(c.id)).length} today</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pendingCallbacks.map(cb => (
              <div key={cb.id} style={{
                background: callbackCompleted.includes(cb.id) ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)',
                borderRadius: 12, padding: '14px 18px',
                borderLeft: `3px solid ${callbackCompleted.includes(cb.id) ? 'var(--accent-green)' : cb.priority === 'High' ? 'var(--accent-yellow)' : 'var(--accent-blue)'}`,
                opacity: callbackCompleted.includes(cb.id) ? 0.6 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{cb.customer}</span>
                    <UrgencyBadge urgency={cb.priority} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-blue)' }}>
                    <Clock size={14} />
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cb.scheduledTime}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 8px 0' }}>{cb.purpose}</p>
                {!callbackCompleted.includes(cb.id) ? (
                  <button className="btn btn-primary btn-sm" onClick={() => {
                    setCallbackCompleted(prev => [...prev, cb.id]);
                    showToast(`📞 Calling ${cb.customer} at ${cb.phone}`);
                  }}>
                    <Phone size={14} /> Call {cb.scheduledTime}
                  </button>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600 }}>✓ Completed</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Risk Score Escalations */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><TrendingUp size={18} color="var(--accent-red)" /> Overnight Risk Score Escalations</div>
          <span className="badge badge-red">{riskEscalations.length} escalated</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {riskEscalations.map(esc => (
            <div key={esc.id} style={{
              background: 'var(--bg-secondary)', borderRadius: 12, padding: '18px 20px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{esc.customer}</span>
                <span className="badge badge-red">{esc.change}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>BEFORE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-yellow)' }}>{Math.round(esc.scoreBefore * 100)}%</div>
                </div>
                <ArrowUpRight size={20} color="var(--accent-red)" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>AFTER</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red)' }}>{Math.round(esc.scoreAfter * 100)}%</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Sparkline data={esc.trend} width={90} height={28} color="#ef4444" />
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 10px 0' }}>{esc.reason}</p>
              <button className="btn btn-sm btn-danger" onClick={() => showToast(`🚨 Investigating ${esc.customer}'s risk escalation...`)}>
                <Eye size={14} /> Investigate & Act
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column: SAGE + Outreach */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Section 5: SAGE Unresolved */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><MessageSquare size={18} color="var(--accent-purple)" /> SAGE Unresolved Conversations</div>
            <span className="badge badge-purple">{sageConversations.length} unresolved</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sageConversations.map(conv => (
              <div key={conv.id} style={{
                background: 'var(--bg-secondary)', borderRadius: 12, padding: '16px 18px',
                borderLeft: '3px solid var(--accent-purple)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{conv.customer}</span>
                    {conv.unread > 0 && (
                      <span style={{
                        background: 'var(--accent-purple)', color: 'white', fontSize: '0.65rem', fontWeight: 700,
                        borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>{conv.unread}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{conv.time}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-yellow)', marginBottom: 6 }}>
                  Topic: {conv.topic}
                </div>
                <div style={{
                  fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic',
                  padding: '8px 12px', background: 'rgba(139,92,246,0.06)', borderRadius: 8, marginBottom: 10
                }}>
                  "{conv.lastMessage}"
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sentiment:</span>
                    <span style={{
                      fontSize: '0.78rem', fontWeight: 700,
                      color: conv.sentiment < -0.5 ? 'var(--accent-red)' : 'var(--accent-yellow)'
                    }}>
                      {conv.sentiment < -0.5 ? '😟 Negative' : '😐 Cautious'} ({conv.sentiment.toFixed(2)})
                    </span>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast(`💬 Opening SAGE thread for ${conv.customer}...`)}>
                    <Send size={14} /> Follow Up
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Outreach Outcomes to Record */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><ClipboardList size={18} color="var(--accent-green)" /> Outreach Outcomes to Record</div>
            <span className="badge badge-yellow">{outreachOutcomes.filter(o => !outcomeRecords[o.id]).length} pending</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {outreachOutcomes.map(out => (
              <div key={out.id} style={{
                background: outcomeRecords[out.id] ? 'rgba(16,185,129,0.06)' : 'var(--bg-secondary)',
                borderRadius: 12, padding: '14px 18px',
                borderLeft: `3px solid ${outcomeRecords[out.id] ? 'var(--accent-green)' : 'var(--accent-yellow)'}`,
                opacity: outcomeRecords[out.id] ? 0.6 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{out.customer}</span>
                  <span className="badge badge-blue">{out.type}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  <span><Calendar size={12} style={{ marginRight: 4 }} />{out.callTime}</span>
                  <span><Clock size={12} style={{ marginRight: 4 }} />{out.duration}</span>
                </div>
                {!outcomeRecords[out.id] ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-primary" onClick={() => {
                      setOutcomeRecords(prev => ({ ...prev, [out.id]: 'Retained' }));
                      showToast(`✅ Outcome for ${out.customer} recorded: Retained`);
                    }}>
                      <CheckCircle size={14} /> Record Outcome
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => {
                      setOutcomeRecords(prev => ({ ...prev, [out.id]: 'No Response' }));
                      showToast(`📋 Outcome for ${out.customer}: No Response`);
                    }}>
                      <XCircle size={14} /> No Response
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                    ✓ Recorded: {outcomeRecords[out.id]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ════════════════ BRANCH MANAGER VIEW ════════════════
  const BMView = () => (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* BM Summary Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card red">
          <div className="stat-icon red"><AlertTriangle size={22} /></div>
          <div className="stat-value">{bmStats.criticalWithoutCase}</div>
          <div className="stat-label">Critical Customers — No Active Case</div>
          <button className="btn btn-sm btn-danger" style={{ marginTop: 10 }} onClick={() => showToast('📋 Opening case assignment panel...')}>
            <UserCheck size={14} /> Assign Now
          </button>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><Clock size={22} /></div>
          <div className="stat-value">{bmStats.slaBreaches}</div>
          <div className="stat-label">SLA Breaches — Cases Open {'>'} 5 Days</div>
          <button className="btn btn-sm btn-secondary" style={{ marginTop: 10 }} onClick={() => showToast('🔍 Opening SLA breach cases...')}>
            <Eye size={14} /> View & Resolve
          </button>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue"><Target size={22} /></div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <div className="stat-value">₹{(bmStats.aumAtRisk / 10000000).toFixed(2)}Cr</div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: bmStats.aumTrend < 0 ? 'var(--accent-red)' : 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 2 }}>
              {bmStats.aumTrend < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {bmStats.aumTrend}%
            </span>
          </div>
          <div className="stat-label">Branch AUM at Risk This Week</div>
        </div>
      </div>

      {/* Campaign Approvals */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><Megaphone size={18} color="var(--accent-green)" /> Campaign Approval Requests</div>
          <span className="badge badge-yellow">{campaignApprovals.filter(c => !actionedCampaigns.includes(c.id)).length} awaiting sign-off</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {campaignApprovals.filter(c => !actionedCampaigns.includes(c.id)).map(camp => (
            <div key={camp.id} style={{
              background: 'var(--bg-secondary)', borderRadius: 12, padding: '18px 20px',
              borderLeft: `3px solid ${camp.submittedBy.includes('PULSE') ? 'var(--accent-purple)' : 'var(--accent-green)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>{camp.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Submitted by: {camp.submittedBy} · {camp.created}
                  </div>
                </div>
                {camp.submittedBy.includes('PULSE') && <span className="badge badge-purple">🤖 AI Generated</span>}
              </div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
                <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Channel: </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{camp.channel}</span>
                </div>
                <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Budget: </span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-yellow)' }}>₹{(camp.budget / 1000).toFixed(0)}K</span>
                </div>
                <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target: </span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{camp.targetCustomers.toLocaleString()} customers</span>
                </div>
                <div style={{ background: 'var(--bg-input)', borderRadius: 8, padding: '6px 12px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Expected ROI: </span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-green)' }}>{camp.expectedROI}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-sm btn-primary" onClick={() => {
                  showToast(`✅ Campaign "${camp.name}" approved`);
                  setActionedCampaigns(prev => [...prev, camp.id]);
                }}>
                  <CheckCircle size={14} /> Approve
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => showToast(`📝 Opening review for "${camp.name}"`)}>
                  <Eye size={14} /> Review Details
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => {
                  showToast(`❌ Campaign "${camp.name}" rejected`);
                  setActionedCampaigns(prev => [...prev, camp.id]);
                }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
          {campaignApprovals.filter(c => !actionedCampaigns.includes(c.id)).length === 0 && (
            <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
              <CheckCircle size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <div>All campaigns reviewed ✓</div>
            </div>
          )}
        </div>
      </div>

      {/* RM Activity Summary Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><BarChart3 size={18} color="var(--accent-blue)" /> Yesterday's RM Activity Summary</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-blue)' }}></span> Calls Due
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-green)' }}></span> Calls Made
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={rmActivityData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="due" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} name="Due" />
            <Bar dataKey="made" fill="var(--accent-green)" radius={[4, 4, 0, 0]} name="Made" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '10px 16px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Total Due: <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{rmActivityData.reduce((s, r) => s + r.due, 0)}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Total Made: <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{rmActivityData.reduce((s, r) => s + r.made, 0)}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Completion Rate: <span style={{ fontWeight: 700, color: Math.round(rmActivityData.reduce((s, r) => s + r.made, 0) / rmActivityData.reduce((s, r) => s + r.due, 0) * 100) >= 85 ? 'var(--accent-green)' : 'var(--accent-yellow)' }}>
              {Math.round(rmActivityData.reduce((s, r) => s + r.made, 0) / rmActivityData.reduce((s, r) => s + r.due, 0) * 100)}%
            </span>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => showToast('📊 Opening detailed RM performance dashboard...')}>
            <BarChart3 size={14} /> Drill Down
          </button>
        </div>
      </div>
    </div>
  );

  // ════════════════ REGIONAL MANAGER VIEW ════════════════
  const RegionalView = () => (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Branch Health Heatmap */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><MapPin size={18} color="var(--accent-purple)" /> Branch Health Heatmap — South & West Region</div>
          <span className="badge badge-blue">{branchHealth.length} branches</span>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Branch</th>
                <th>Risk Exposure (₹Cr)</th>
                <th>Total AUM (₹Cr)</th>
                <th>At-Risk Customers</th>
                <th>RM Count</th>
                <th>Conversion %</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {branchHealth.map((b, i) => {
                const statusColor = b.status === 'Critical' ? 'var(--accent-red)' : b.status === 'Warning' ? 'var(--accent-yellow)' : 'var(--accent-green)';
                return (
                  <tr key={i} style={{ background: b.status === 'Critical' ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.branch}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: `${statusColor}15`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.85rem', color: statusColor,
                        }}>
                          {b.riskExposure}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{b.totalAUM}Cr</td>
                    <td>
                      <span style={{ fontWeight: 700, color: b.atRiskCustomers > 30 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                        {b.atRiskCustomers}
                      </span>
                    </td>
                    <td>{b.rmCount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, color: b.conversion < 75 ? 'var(--accent-red)' : b.conversion < 85 ? 'var(--accent-yellow)' : 'var(--accent-green)' }}>
                          {b.conversion}%
                        </span>
                      </div>
                    </td>
                    <td><SeverityBadge severity={b.status} /></td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => showToast(`🔍 Drilling into ${b.branch}...`)}>
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Comparison Chart */}
      <div className="card">
        <div className="card-header">
          <div className="card-title"><TrendingUp size={18} color="var(--accent-green)" /> Regional Campaign Performance vs Last Period</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.78rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-blue)' }}></span> Current Period
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--text-muted)' }}></span> Previous Period
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={campaignComparisonData}>
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="previous" stroke="#64748b" fill="url(#prevGrad)" strokeWidth={2} name="Previous Period %" />
            <Area type="monotone" dataKey="current" stroke="#3b82f6" fill="url(#currentGrad)" strokeWidth={2.5} name="Current Period %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column: Escalated Cases + Declining Branches */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
        {/* Escalated Cases */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><ShieldAlert size={18} color="var(--accent-red)" /> Escalated Cases Awaiting Regional Approval</div>
            <span className="badge badge-red">{escalatedCases.length} pending</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {escalatedCases.map(esc => (
              <div key={esc.id} className="alert-card" style={{
                borderLeftColor: esc.severity === 'Critical' ? 'var(--accent-red)' : '#f97316',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{esc.customer}</span>
                      <SeverityBadge severity={esc.severity} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>
                      {esc.branch} · RM: {esc.assignedRM}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 8,
                    background: esc.daysOpen > 7 ? 'var(--accent-red-soft)' : 'var(--accent-yellow-soft)',
                    fontSize: '0.72rem', fontWeight: 700,
                    color: esc.daysOpen > 7 ? 'var(--accent-red)' : 'var(--accent-yellow)',
                  }}>
                    {esc.daysOpen} days open
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>{esc.issue}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-sm btn-primary" onClick={() => showToast(`✅ Case for ${esc.customer} approved with regional priority`)}>
                    <CheckCircle size={14} /> Approve & Escalate
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => showToast(`📞 Scheduling call with ${esc.assignedRM}`)}>
                    <Phone size={14} /> Call RM
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining Branches */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingDown size={18} color="var(--accent-red)" /> Declining RM Conversion Rates</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {decliningBranches.map((b, i) => (
              <div key={i} style={{
                background: 'var(--bg-secondary)', borderRadius: 12, padding: '16px 18px',
                border: '1px solid rgba(239,68,68,0.15)',
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 6 }}>{b.branch}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PREV</div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-green)', fontSize: '1.1rem' }}>{b.previousConversion}%</div>
                  </div>
                  <ArrowDownRight size={18} color="var(--accent-red)" />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>NOW</div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-red)', fontSize: '1.1rem' }}>{b.currentConversion}%</div>
                  </div>
                  <span className="badge badge-red" style={{ marginLeft: 'auto' }}>{b.decline}%</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                  Root cause: {b.topIssue}
                </div>
                <button className="btn btn-sm btn-secondary" onClick={() => showToast(`🔍 Opening intervention plan for ${b.branch}`)}>
                  <Target size={14} /> Intervene
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════
  return (
    <div className="fade-in">
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'rgba(26,32,53,0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-strong)', borderRadius: 12,
          padding: '14px 20px', fontSize: '0.85rem', fontWeight: 500,
          color: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.3s ease', maxWidth: 400,
        }}>
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            ☀️ {greeting}, {userName}
          </h2>
          <p>{dateStr} · Last synced {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} /> Refresh
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--bg-secondary)', borderRadius: 8, padding: 2,
            border: '1px solid var(--border-color)',
          }}>
            <PulsingDot color="var(--accent-green)" size={6} />
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 600, padding: '0 8px' }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Role Selector */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 28, background: 'var(--bg-secondary)',
        borderRadius: 12, padding: 6, border: '1px solid var(--border-color)', width: 'fit-content'
      }}>
        {ROLES.map(role => {
          const Icon = role.icon;
          const isActive = activeRole === role.key;
          return (
            <button key={role.key} onClick={() => setActiveRole(role.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: isActive ? `${role.color}15` : 'transparent',
                color: isActive ? role.color : 'var(--text-muted)',
                fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', transition: 'var(--transition)',
                borderBottom: isActive ? `2px solid ${role.color}` : '2px solid transparent',
              }}>
              <Icon size={16} />
              {role.label}
            </button>
          );
        })}
      </div>

      {/* Role-specific Content */}
      {activeRole === 'rm' && <RMView />}
      {activeRole === 'bm' && <BMView />}
      {activeRole === 'rm_regional' && <RegionalView />}
    </div>
  );
}
