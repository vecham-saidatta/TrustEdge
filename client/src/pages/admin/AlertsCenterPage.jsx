import { useState } from 'react';
import {
  Bell, AlertTriangle, Shield, Cpu, Gavel, Filter, CheckCircle,
  XCircle, Eye, Users, Clock, ArrowUpRight, ArrowDownRight, Minus,
  Settings, Search, X, Volume2, VolumeX, Mail, MessageSquare,
  Smartphone, MonitorSmartphone, AlertCircle, TrendingUp, Zap,
  Bot, Activity, CreditCard, Target, BarChart3, FileText, ChevronDown
} from 'lucide-react';

// ═══════════════════════════════════════════════
// MOCK ALERTS — Per Plan Section 13.1
// ═══════════════════════════════════════════════

const alertsData = [
  { id: 'ALR-001', priority: 'P1', source: 'AI Engine', message: 'Customer Pradeep Menon risk score crossed 0.85 — now at 0.91 (CRITICAL)', target: 'RM / Branch Manager', channel: 'In-portal + SMS', timestamp: '2 min ago', status: 'Unacknowledged', branch: 'Koramangala', customer: 'Pradeep Menon' },
  { id: 'ALR-002', priority: 'P1', source: 'Operational', message: 'Case RC-2026-0398 SLA breached — open 6 days, limit 5 days', target: 'Branch Manager', channel: 'In-portal + Email', timestamp: '14 min ago', status: 'Unacknowledged', branch: 'Indiranagar', customer: null },
  { id: 'ALR-003', priority: 'P1', source: 'AI Engine', message: 'SAGE distress keywords detected: "can\'t pay EMI", "feeling stuck" — Customer Meera Reddy', target: 'RM / Compliance', channel: 'In-portal + SMS + Email', timestamp: '22 min ago', status: 'Acknowledged', branch: 'HSR Layout', customer: 'Meera Reddy' },
  { id: 'ALR-004', priority: 'P1', source: 'System', message: 'PULSE drift detected: Email channel accuracy dropped 4.1% (>3% threshold)', target: 'System Admin / Data Science', channel: 'In-portal + Email', timestamp: '38 min ago', status: 'Acknowledged', branch: null, customer: null },
  { id: 'ALR-005', priority: 'P2', source: 'AI Engine', message: 'Campaign "FD Renewal Push" opt-out rate at 2.3% — exceeds 2% threshold', target: 'Campaign Manager', channel: 'In-portal', timestamp: '1h ago', status: 'Unacknowledged', branch: null, customer: null },
  { id: 'ALR-006', priority: 'P2', source: 'Operational', message: 'RM Rahul Verma: 3 call outcomes not recorded for 48h+', target: 'Branch Manager', channel: 'In-portal + Email', timestamp: '1h 15m ago', status: 'Unacknowledged', branch: 'JP Nagar', customer: null },
  { id: 'ALR-007', priority: 'P2', source: 'System', message: 'Translation API latency degraded: p99 at 8.4s (SLA: 3s)', target: 'System Admin', channel: 'In-portal', timestamp: '1h 30m ago', status: 'Acknowledged', branch: null, customer: null },
  { id: 'ALR-008', priority: 'P2', source: 'Operational', message: 'Incentive approval pending >24h: ₹15,000 fee waiver for Vikram Singh', target: 'Branch Manager', channel: 'In-portal + Email', timestamp: '2h ago', status: 'Unacknowledged', branch: 'Koramangala', customer: 'Vikram Singh' },
  { id: 'ALR-009', priority: 'P2', source: 'AI Engine', message: 'Customer Sunita Kumar risk increased from 0.45 to 0.72 in 7 days — spouse of flagged customer', target: 'RM', channel: 'In-portal', timestamp: '2h 30m ago', status: 'Acknowledged', branch: 'Koramangala', customer: 'Sunita Kumar' },
  { id: 'ALR-010', priority: 'P3', source: 'Operational', message: 'New case assigned: RC-2026-0452 — Anjali Patel (CHURN_RISK, HIGH)', target: 'RM Priya Sharma', channel: 'In-portal', timestamp: '3h ago', status: 'Acknowledged', branch: 'MG Road', customer: 'Anjali Patel' },
  { id: 'ALR-011', priority: 'P3', source: 'Operational', message: 'Monthly incentive budget at 82% — ₹4.1L of ₹5L consumed (Koramangala branch)', target: 'Branch Manager', channel: 'In-portal', timestamp: '4h ago', status: 'Unacknowledged', branch: 'Koramangala', customer: null },
  { id: 'ALR-012', priority: 'P3', source: 'AI Engine', message: 'Model accuracy below 85%: Current 84.2% (rolling 7-day) — investigate recent data drift', target: 'Data Science', channel: 'In-portal', timestamp: '5h ago', status: 'Acknowledged', branch: null, customer: null },
  { id: 'ALR-013', priority: 'P3', source: 'AI Engine', message: 'SAGE low-confidence response flagged: Conversation SAGE-4515 (Anjali Patel, BUDGETING)', target: 'SAGE Admin', channel: 'In-portal', timestamp: '5h 30m ago', status: 'Acknowledged', branch: null, customer: 'Anjali Patel' },
  { id: 'ALR-014', priority: 'P3', source: 'Operational', message: 'FD maturity in 7 days: ₹5L FD for Rajesh Kumar — no renewal inquiry received', target: 'RM Priya Sharma', channel: 'In-portal', timestamp: '6h ago', status: 'Unacknowledged', branch: 'Koramangala', customer: 'Rajesh Kumar' },
  { id: 'ALR-015', priority: 'P4', source: 'System', message: 'Scheduled maintenance: Redis cache restart at 02:00 IST — expected 2 min downtime', target: 'All Admins', channel: 'In-portal', timestamp: '8h ago', status: 'Acknowledged', branch: null, customer: null },
  { id: 'ALR-016', priority: 'P4', source: 'Compliance', message: 'Monthly RBI compliance report due in 5 days — auto-generation scheduled', target: 'Compliance Officer', channel: 'In-portal', timestamp: '12h ago', status: 'Acknowledged', branch: null, customer: null },
  { id: 'ALR-017', priority: 'P4', source: 'AI Engine', message: 'PULSE model v1.47 deployed successfully — MAB weights updated', target: 'Data Science', channel: 'In-portal', timestamp: '1d ago', status: 'Resolved', branch: null, customer: null },
  { id: 'ALR-018', priority: 'P2', source: 'Operational', message: 'RM Deepa Nair: conversion rate below 25% for 3rd consecutive week', target: 'Branch Manager', channel: 'In-portal + Email', timestamp: '1d ago', status: 'Resolved', branch: 'Whitefield', customer: null },
];

const suppressionRules = [
  { id: 'SUP-01', type: 'Duplicate Suppression', rule: 'Same alert type for same customer within 4 hours', status: 'Active', lastTriggered: '2h ago', suppressed: 14 },
  { id: 'SUP-02', type: 'Maintenance Window', rule: 'Suppress system alerts during 02:00-03:00 IST', status: 'Active', lastTriggered: '22h ago', suppressed: 3 },
  { id: 'SUP-03', type: 'Silence Rule', rule: 'P4 Translation API alerts silenced until Jun 5', status: 'Active', lastTriggered: '6h ago', suppressed: 8 },
  { id: 'SUP-04', type: 'Rate Limit', rule: 'Max 5 P3 alerts per RM per hour', status: 'Active', lastTriggered: '45m ago', suppressed: 6 },
];

const notificationPrefs = [
  { type: 'Customer risk > 0.85', email: true, sms: true, portal: true, digest: false },
  { type: 'Case SLA breach', email: true, sms: false, portal: true, digest: false },
  { type: 'SAGE distress detected', email: true, sms: true, portal: true, digest: false },
  { type: 'PULSE drift alert', email: true, sms: false, portal: true, digest: false },
  { type: 'Campaign opt-out high', email: false, sms: false, portal: true, digest: true },
  { type: 'RM outcome not recorded', email: true, sms: false, portal: true, digest: true },
  { type: 'Translation API degraded', email: false, sms: false, portal: true, digest: true },
  { type: 'Incentive approval pending', email: true, sms: false, portal: true, digest: false },
  { type: 'New case assigned', email: false, sms: false, portal: true, digest: true },
  { type: 'Budget threshold reached', email: true, sms: false, portal: true, digest: true },
];

export default function AlertsCenterPage() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterSource, setFilterSource] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState(alertsData);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const tabs = [
    { id: 'inbox', label: 'Alert Inbox', icon: Bell },
    { id: 'suppression', label: 'Suppression Rules', icon: VolumeX },
    { id: 'preferences', label: 'Notification Prefs', icon: Settings },
    { id: 'history', label: 'Alert History', icon: Clock },
  ];

  const counts = {
    P1: alerts.filter(a => a.priority === 'P1').length,
    P2: alerts.filter(a => a.priority === 'P2').length,
    P3: alerts.filter(a => a.priority === 'P3').length,
    P4: alerts.filter(a => a.priority === 'P4').length,
    unack: alerts.filter(a => a.status === 'Unacknowledged').length,
    total: alerts.length,
  };

  const priorityConfig = {
    P1: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: 'Critical', pulse: true },
    P2: { color: '#f97316', bg: 'rgba(249,115,22,0.12)', label: 'High', pulse: false },
    P3: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Medium', pulse: false },
    P4: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', label: 'Low', pulse: false },
  };

  const sourceConfig = {
    'AI Engine': { icon: Bot, color: '#8b5cf6' },
    'Operational': { icon: Activity, color: '#3b82f6' },
    'System': { icon: Cpu, color: '#06b6d4' },
    'Compliance': { icon: Gavel, color: '#f59e0b' },
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterPriority !== 'ALL' && a.priority !== filterPriority) return false;
    if (filterSource !== 'ALL' && a.source !== filterSource) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    if (searchQuery && !a.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Acknowledged' } : a));
  };

  const handleResolve = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  const handleBulkAck = (priority) => {
    setAlerts(prev => prev.map(a => a.priority === priority && a.status === 'Unacknowledged' ? { ...a, status: 'Acknowledged' } : a));
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Alerts Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Consolidated alert triage with priority routing and suppression management</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="status-dot online" /> {counts.unack} unacknowledged of {counts.total} total
          </span>
        </div>
      </div>

      {/* Priority Summary Badges */}
      <div className="admin-grid admin-grid-4" style={{ marginBottom: 24 }}>
        {['P1', 'P2', 'P3', 'P4'].map(p => {
          const cfg = priorityConfig[p];
          const unack = alerts.filter(a => a.priority === p && a.status === 'Unacknowledged').length;
          return (
            <div key={p} className="metric-card-mini" style={{ borderLeft: `3px solid ${cfg.color}`, cursor: 'pointer' }}
              onClick={() => { setFilterPriority(p); setActiveTab('inbox'); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="metric-label">{p} {cfg.label}</span>
                {cfg.pulse && unack > 0 && <span className="status-dot" style={{ background: cfg.color, animation: 'pulseNotif 2s infinite' }} />}
              </div>
              <span className="metric-value" style={{ color: cfg.color }}>{counts[p]}</span>
              {unack > 0 && (
                <span style={{ fontSize: '0.72rem', color: cfg.color, fontWeight: 600 }}>{unack} unacknowledged</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Alert Inbox */}
      {activeTab === 'inbox' && (
        <div className="fade-in">
          {/* Filters */}
          <div className="admin-filter-bar">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search alerts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
            <span className="filter-label">Priority:</span>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="ALL">All</option>
              <option value="P1">P1 Critical</option>
              <option value="P2">P2 High</option>
              <option value="P3">P3 Medium</option>
              <option value="P4">P4 Low</option>
            </select>
            <span className="filter-label">Source:</span>
            <select value={filterSource} onChange={e => setFilterSource(e.target.value)}>
              <option value="ALL">All Sources</option>
              <option value="AI Engine">AI Engine</option>
              <option value="Operational">Operational</option>
              <option value="System">System</option>
              <option value="Compliance">Compliance</option>
            </select>
            <span className="filter-label">Status:</span>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="ALL">All</option>
              <option value="Unacknowledged">Unacknowledged</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Bulk Actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button className="action-btn" onClick={() => handleBulkAck('P3')}><CheckCircle size={14} /> Acknowledge All P3</button>
            <button className="action-btn" onClick={() => handleBulkAck('P4')}><CheckCircle size={14} /> Acknowledge All P4</button>
          </div>

          {/* Alert List */}
          {filteredAlerts.map(alert => {
            const pCfg = priorityConfig[alert.priority];
            const sCfg = sourceConfig[alert.source];
            const SourceIcon = sCfg?.icon || AlertCircle;

            return (
              <div key={alert.id} className="admin-panel" style={{
                marginBottom: 8, padding: '16px 20px',
                borderLeft: `4px solid ${pCfg.color}`,
                opacity: alert.status === 'Resolved' ? 0.6 : 1,
                background: alert.status === 'Unacknowledged' ? `${pCfg.bg}` : undefined,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  {/* Priority + Source */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
                    <span className="badge" style={{
                      background: pCfg.bg, color: pCfg.color, fontWeight: 800, fontSize: '0.75rem',
                      animation: pCfg.pulse && alert.status === 'Unacknowledged' ? 'pulseNotif 2s infinite' : 'none'
                    }}>{alert.priority}</span>
                    <SourceIcon size={14} style={{ color: sCfg?.color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 300 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 4, lineHeight: 1.4 }}>
                      {alert.message}
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span className="inline-tag" style={{ background: `${sCfg?.color}15`, color: sCfg?.color }}>{alert.source}</span>
                      <span>→ {alert.target}</span>
                      <span>• {alert.channel}</span>
                      {alert.branch && <span>• {alert.branch}</span>}
                      <span>• {alert.timestamp}</span>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span className={`badge ${alert.status === 'Unacknowledged' ? 'badge-red' : alert.status === 'Acknowledged' ? 'badge-yellow' : 'badge-green'}`}>
                      {alert.status}
                    </span>
                    {alert.status === 'Unacknowledged' && (
                      <button className="action-btn" onClick={() => handleAcknowledge(alert.id)} style={{ fontSize: '0.72rem' }}>
                        <CheckCircle size={12} /> Ack
                      </button>
                    )}
                    {alert.status !== 'Resolved' && (
                      <button className="action-btn success" onClick={() => handleResolve(alert.id)} style={{ fontSize: '0.72rem' }}>
                        <CheckCircle size={12} /> Resolve
                      </button>
                    )}
                    {alert.customer && (
                      <button className="action-btn" style={{ fontSize: '0.72rem' }}>
                        <Eye size={12} /> View Customer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAlerts.length === 0 && (
            <div className="empty-state">
              <Bell size={48} />
              <h3>No alerts match your filters</h3>
              <p>Try adjusting your filter criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Suppression Rules */}
      {activeTab === 'suppression' && (
        <div className="fade-in">
          <div className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="admin-panel-header">
              <span className="admin-panel-title"><VolumeX size={16} /> Active Suppression Rules</span>
              <button className="action-btn primary"><Zap size={14} /> Add Rule</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>ID</th><th>Type</th><th>Rule</th><th>Status</th><th>Last Triggered</th><th>Suppressed (24h)</th><th>Actions</th></tr></thead>
                <tbody>
                  {suppressionRules.map(rule => (
                    <tr key={rule.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{rule.id}</td>
                      <td><span className="badge badge-purple">{rule.type}</span></td>
                      <td style={{ fontSize: '0.82rem', maxWidth: 300 }}>{rule.rule}</td>
                      <td><span className="badge badge-green">{rule.status}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{rule.lastTriggered}</td>
                      <td style={{ fontWeight: 700 }}>{rule.suppressed}</td>
                      <td>
                        <div className="action-row">
                          <button className="action-btn" style={{ fontSize: '0.72rem' }}><Settings size={12} /> Edit</button>
                          <button className="action-btn danger" style={{ fontSize: '0.72rem' }}><XCircle size={12} /> Disable</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Maintenance Window */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Clock size={16} /> Maintenance Windows</span>
            </div>
            <div className="admin-grid admin-grid-2">
              <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: '3px solid var(--accent-blue)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>Daily Maintenance</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>02:00 — 03:00 IST (nightly)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Suppresses: System alerts, Cache restart notifications</div>
                <span className="badge badge-green" style={{ marginTop: 8 }}>Active</span>
              </div>
              <div style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: '3px solid var(--accent-yellow)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>Scheduled Upgrade</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Jun 1, 2026 — 00:00-04:00 IST</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Suppresses: All system alerts during upgrade window</div>
                <span className="badge badge-yellow" style={{ marginTop: 8 }}>Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences */}
      {activeTab === 'preferences' && (
        <div className="fade-in">
          <div className="admin-panel" style={{ marginBottom: 24 }}>
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Settings size={16} /> Notification Channel Preferences</span>
              <span className="admin-panel-subtitle">Per alert type configuration</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Alert Type</th>
                    <th style={{ textAlign: 'center' }}><Mail size={14} /> Email</th>
                    <th style={{ textAlign: 'center' }}><Smartphone size={14} /> SMS</th>
                    <th style={{ textAlign: 'center' }}><MonitorSmartphone size={14} /> Portal</th>
                    <th style={{ textAlign: 'center' }}><FileText size={14} /> Digest</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationPrefs.map((pref, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>{pref.type}</td>
                      {['email', 'sms', 'portal', 'digest'].map(ch => (
                        <td key={ch} style={{ textAlign: 'center' }}>
                          <div style={{
                            width: 36, height: 20, borderRadius: 10, margin: '0 auto',
                            background: pref[ch] ? 'var(--accent-green)' : 'var(--border-strong)',
                            position: 'relative', cursor: 'pointer', transition: 'var(--transition)',
                          }}>
                            <div style={{
                              width: 16, height: 16, borderRadius: '50%', background: 'white',
                              position: 'absolute', top: 2,
                              left: pref[ch] ? 18 : 2, transition: 'var(--transition)',
                            }} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><AlertTriangle size={16} /> Emergency Contact Configuration</span>
            </div>
            <div className="admin-grid admin-grid-2">
              <div className="form-group">
                <label className="form-label">P1 Emergency SMS Number</label>
                <input className="form-input" value="+91-98765-43210" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">P1 Emergency Email</label>
                <input className="form-input" value="admin-escalation@trustedge.bank" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Compliance Officer Contact</label>
                <input className="form-input" value="+91-99887-76543" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">System Admin Pager</label>
                <input className="form-input" value="sysadmin-oncall@trustedge.bank" readOnly />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert History */}
      {activeTab === 'history' && (
        <div className="fade-in">
          <div className="admin-filter-bar" style={{ marginBottom: 16 }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search alert history..." style={{ flex: 1 }} />
            <span className="filter-label">Date Range:</span>
            <input type="date" defaultValue="2026-04-27" />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input type="date" defaultValue="2026-05-27" />
            <button className="action-btn primary"><Search size={14} /> Search</button>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <span className="admin-panel-title"><Clock size={16} /> 90-Day Alert History</span>
              <span className="admin-panel-subtitle">Showing resolved alerts</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead><tr><th>Alert ID</th><th>Priority</th><th>Source</th><th>Message</th><th>Created</th><th>Resolved</th><th>Resolution Time</th><th>Resolved By</th></tr></thead>
                <tbody>
                  {[
                    { id: 'ALR-R01', priority: 'P1', source: 'AI Engine', message: 'Customer Amit Shah risk crossed 0.85', created: 'May 20', resolved: 'May 20', time: '2h 15m', by: 'RM Anita' },
                    { id: 'ALR-R02', priority: 'P2', source: 'Operational', message: 'Case SLA breach — RC-2026-0312', created: 'May 18', resolved: 'May 19', time: '18h', by: 'BM Rakesh' },
                    { id: 'ALR-R03', priority: 'P1', source: 'System', message: 'Kafka consumer lag spike >10s', created: 'May 15', resolved: 'May 15', time: '45m', by: 'SysAdmin' },
                    { id: 'ALR-R04', priority: 'P3', source: 'AI Engine', message: 'SAGE confidence <0.65 on tax questions', created: 'May 12', resolved: 'May 14', time: '2d', by: 'SAGE Admin' },
                    { id: 'ALR-R05', priority: 'P2', source: 'Compliance', message: 'Data access audit anomaly detected', created: 'May 10', resolved: 'May 11', time: '22h', by: 'Compliance' },
                  ].map(h => (
                    <tr key={h.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{h.id}</td>
                      <td><span className={`badge ${h.priority === 'P1' ? 'badge-red' : h.priority === 'P2' ? 'badge-yellow' : 'badge-blue'}`}>{h.priority}</span></td>
                      <td><span className="inline-tag">{h.source}</span></td>
                      <td style={{ fontSize: '0.82rem', maxWidth: 300 }}>{h.message}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{h.created}</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{h.resolved}</td>
                      <td style={{ fontWeight: 700 }}>{h.time}</td>
                      <td style={{ fontSize: '0.82rem' }}>{h.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
