import { useState, useEffect } from 'react';
import {
  Megaphone, Plus, Search, Filter, Eye, Edit3, CheckCircle, PauseCircle, StopCircle,
  Send, Mail, MessageSquare, Phone, Smartphone, Bell, Users, Target, TrendingUp,
  TrendingDown, BarChart3, PieChart, Calendar, Clock, DollarSign, AlertTriangle,
  X, ChevronRight, ChevronLeft, Zap, Award, ShieldAlert, UserX, Ban, RefreshCw,
  ArrowRight, Layers, Brain, Sparkles, Copy, Trash2, Play, Archive, MoreVertical,
  Activity, ShieldCheck, HeartHandshake, History, FileText
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Funnel, FunnelChart,
  LabelList
} from 'recharts';
import { outreachAPI } from '../../api';

// ═══════════════════════════════════════════════════════════
// MOCK DATA — Retention-Driven Outreach Cases
// ═══════════════════════════════════════════════════════════

const CHANNEL_ICONS = {
  WhatsApp: MessageSquare,
  'RM Call': Phone,
  'In-App': Smartphone,
  SMS: Mail,
  Email: Mail,
  Push: Bell,
};

const CHANNEL_COLORS = {
  WhatsApp: '#25D366',
  'RM Call': '#f59e0b',
  'In-App': '#8b5cf6',
  SMS: '#3b82f6',
  Email: '#06b6d4',
  Push: '#ef4444',
};

const STATUS_CONFIG = {
  'PENDING_ANALYSIS': { color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
  'OUTREACH_TRIGGERED': { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  'AWAITING_RESPONSE': { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  'RM_INTERVENTION': { color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  'RESOLVED_RECOVERED': { color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  'RESOLVED_STABILIZED': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  'CHURNED': { color: '#475569', bg: 'rgba(71,85,105,0.15)' },
};

const INITIAL_OUTREACH_CASES = [
  {
    caseId: 'RC-2026-0891',
    customerName: 'Rajesh Sharma',
    customerId: 'CUST-8921',
    triggerSource: 'Churn Prediction Engine',
    event: 'High Churn Risk (Score: 0.92)',
    riskLevel: 'Critical',
    healthScore: 34,
    retentionObjective: 'Prevent AUM Outflow',
    channel: 'RM Call',
    status: 'RM_INTERVENTION',
    customerResponse: 'Expressed dissatisfaction with branch service',
    outcome: 'Pending RM Follow-up',
    revenueProtected: 0,
    revenueAtRisk: 4850000,
    rmAssigned: 'Priya D.',
    aiTransparency: {
      confidenceScore: 94,
      triggerReason: 'Sudden drop in transactions + Competitor app login detected',
      recommendedAction: 'Immediate RM Call & Fee Waiver',
      actualActionTaken: 'RM Call Scheduled',
    },
    journey: [
      { step: 'Customer Event', desc: 'Competitor activity detected', time: 'May 28, 10:15 AM' },
      { step: 'AI Analysis', desc: 'Churn risk escalated to 92%', time: 'May 28, 10:20 AM' },
      { step: 'Outreach Trigger', desc: 'RM Call Workflow Initiated', time: 'May 28, 10:21 AM' },
      { step: 'Channel Execution', desc: 'Alert sent to RM Priority Queue', time: 'May 28, 10:25 AM' },
      { step: 'Customer Response', desc: 'Pending', time: '—' },
    ],
    validation: { stage: 'Investigation', status: 'Still At Risk' }
  },
  {
    caseId: 'RC-2026-0892',
    customerName: 'Anita Desai',
    customerId: 'CUST-5512',
    triggerSource: 'Complaint Intelligence Engine',
    event: 'SLA Breach (Stage 4)',
    riskLevel: 'Severe',
    healthScore: 52,
    retentionObjective: 'De-escalate & Resolve',
    channel: 'WhatsApp',
    status: 'AWAITING_RESPONSE',
    customerResponse: 'Read WhatsApp Message',
    outcome: 'Awaiting Support Resolution',
    revenueProtected: 0,
    revenueAtRisk: 1200000,
    rmAssigned: 'Unassigned',
    aiTransparency: {
      confidenceScore: 98,
      triggerReason: 'Complaint #TCK-992 unresolved for >72hrs',
      recommendedAction: 'Automated Apology & ETA Update via WhatsApp',
      actualActionTaken: 'WhatsApp Sent',
    },
    journey: [
      { step: 'Customer Event', desc: 'Complaint raised', time: 'May 25, 09:00 AM' },
      { step: 'AI Analysis', desc: '72hr SLA breached', time: 'May 28, 09:00 AM' },
      { step: 'Outreach Trigger', desc: 'Stage 4 Delay Management', time: 'May 28, 09:05 AM' },
      { step: 'Channel Execution', desc: 'WhatsApp Message Sent', time: 'May 28, 09:10 AM' },
      { step: 'Customer Response', desc: 'Message Read', time: 'May 28, 09:45 AM' },
    ],
    validation: { stage: 'Support Escalation', status: 'Escalation Required' }
  },
  {
    caseId: 'RC-2026-0893',
    customerName: 'Vikram Singh',
    customerId: 'CUST-3310',
    triggerSource: 'Sentiment Analysis Engine',
    event: 'Negative SAGE Sentiment',
    riskLevel: 'High',
    healthScore: 48,
    retentionObjective: 'Service Recovery',
    channel: 'RM Call',
    status: 'RESOLVED_RECOVERED',
    customerResponse: 'Accepted Apology & Offer',
    outcome: 'Customer Recovered',
    revenueProtected: 350000,
    revenueAtRisk: 350000,
    rmAssigned: 'Rahul M.',
    aiTransparency: {
      confidenceScore: 88,
      triggerReason: 'Used aggressive language with SAGE bot',
      recommendedAction: 'Service Recovery Call by RM',
      actualActionTaken: 'RM Call Conducted',
    },
    journey: [
      { step: 'Customer Event', desc: 'Negative interaction with SAGE', time: 'May 27, 02:15 PM' },
      { step: 'AI Analysis', desc: 'Sentiment dropped to -0.8', time: 'May 27, 02:16 PM' },
      { step: 'Outreach Trigger', desc: 'Service Recovery RM Call', time: 'May 27, 02:20 PM' },
      { step: 'Channel Execution', desc: 'RM completed call', time: 'May 27, 04:30 PM' },
      { step: 'Customer Response', desc: 'Satisfied with resolution', time: 'May 27, 04:45 PM' },
      { step: 'Validation', desc: 'Sentiment Positive', time: 'May 29, 10:00 AM' },
    ],
    validation: { stage: 'Stage 7: Retention Validation', status: 'Customer Recovered' }
  },
  {
    caseId: 'RC-2026-0894',
    customerName: 'Meera Reddy',
    customerId: 'CUST-7721',
    triggerSource: 'Customer Health Engine',
    event: 'Milestone: 5 Year Anniversary',
    riskLevel: 'Low',
    healthScore: 95,
    retentionObjective: 'Relationship Strengthening',
    channel: 'Email',
    status: 'RESOLVED_STABILIZED',
    customerResponse: 'Clicked Reward Link',
    outcome: 'Loyalty Reinforced',
    revenueProtected: 850000,
    revenueAtRisk: 0,
    rmAssigned: 'System',
    aiTransparency: {
      confidenceScore: 99,
      triggerReason: 'Account age reached 5 years, zero complaints',
      recommendedAction: 'Send Anniversary Appreciation + Reward',
      actualActionTaken: 'Email Sent',
    },
    journey: [
      { step: 'Customer Event', desc: '5 Year Anniversary', time: 'May 29, 00:01 AM' },
      { step: 'AI Analysis', desc: 'High lifetime value, healthy account', time: 'May 29, 00:05 AM' },
      { step: 'Outreach Trigger', desc: 'Appreciation Workflow', time: 'May 29, 08:00 AM' },
      { step: 'Channel Execution', desc: 'Email Delivered', time: 'May 29, 08:05 AM' },
      { step: 'Customer Response', desc: 'Reward Link Clicked', time: 'May 29, 10:20 AM' },
    ],
    validation: { stage: 'Ongoing Monitoring', status: 'Customer Stabilized' }
  },
  {
    caseId: 'RC-2026-0895',
    customerName: 'Suresh Patel',
    customerId: 'CUST-1198',
    triggerSource: 'Manual Admin Trigger',
    event: 'Branch Feedback Follow-up',
    riskLevel: 'Moderate',
    healthScore: 68,
    retentionObjective: 'Acknowledge Feedback',
    channel: 'SMS',
    status: 'OUTREACH_TRIGGERED',
    customerResponse: 'Pending',
    outcome: 'Awaiting Delivery',
    revenueProtected: 0,
    revenueAtRisk: 150000,
    rmAssigned: 'Branch Manager',
    aiTransparency: {
      confidenceScore: 100,
      triggerReason: 'Manual trigger by Branch Manager post-visit',
      recommendedAction: 'N/A',
      actualActionTaken: 'SMS Sent',
    },
    journey: [
      { step: 'Customer Event', desc: 'Provided feedback at branch', time: 'May 30, 09:00 AM' },
      { step: 'Admin Action', desc: 'Manual outreach triggered', time: 'May 30, 11:30 AM' },
      { step: 'Channel Execution', desc: 'SMS queued for delivery', time: 'May 30, 11:35 AM' },
    ],
    validation: { stage: 'N/A', status: 'N/A' }
  },
  {
    caseId: 'RC-2026-0896',
    customerName: 'Priya Venkatesh',
    customerId: 'CUST-3341',
    triggerSource: 'Feedback Intelligence Loop',
    event: 'High fees concern leading to competitor attraction',
    riskLevel: 'High',
    healthScore: 45,
    retentionObjective: 'Fee Waiver Discussion & Value Reinforcement',
    channel: 'In-App Notification + Email',
    status: 'PENDING_ANALYSIS',
    customerResponse: 'Pending',
    outcome: 'Pending Outreach Execution',
    revenueProtected: 0,
    revenueAtRisk: 1850000,
    rmAssigned: 'Feedback Engine',
    aiTransparency: {
      confidenceScore: 92,
      triggerReason: 'Multiple high fee charges, Browsed competitor credit cards',
      recommendedAction: 'Offer lifetime fee waiver on next credit card renewal.',
      actualActionTaken: 'Pending Execution',
    },
    journey: [
      { step: 'Customer Event', desc: 'Browsed competitor credit cards', time: 'May 30, 08:30 AM' },
      { step: 'Feedback Intelligence Analysis', desc: 'Root cause identified', time: 'May 30, 08:35 AM' }
    ],
    validation: { stage: 'N/A', status: 'N/A' }
  },
  {
    caseId: 'RC-2026-0897',
    customerName: 'Kavya Krishnan',
    customerId: 'CUST-8492',
    triggerSource: 'Churn Prediction Engine',
    event: 'Withdrew $50,000 from brokerage',
    riskLevel: 'Critical',
    healthScore: 30,
    retentionObjective: 'Wealth Management Re-engagement',
    channel: 'Direct Phone Call',
    status: 'RM_INTERVENTION',
    customerResponse: 'Scheduled Portfolio Review',
    outcome: 'Awaiting RM Meeting',
    revenueProtected: 0,
    revenueAtRisk: 25000000,
    rmAssigned: 'Senior Advisor Team',
    aiTransparency: {
      confidenceScore: 91,
      triggerReason: 'Stopped using wealth management tools, large withdrawal',
      recommendedAction: 'Complimentary 1-on-1 portfolio review',
      actualActionTaken: 'RM Scheduled Call',
    },
    journey: [
      { step: 'Customer Event', desc: 'Large withdrawal detected', time: 'May 29, 02:00 PM' },
      { step: 'Outreach Trigger', desc: 'RM Call Workflow Initiated', time: 'May 29, 02:15 PM' },
      { step: 'Customer Response', desc: 'Agreed to meeting', time: 'May 30, 10:00 AM' }
    ],
    validation: { stage: 'Meeting Scheduled', status: 'In Progress' }
  },
  {
    caseId: 'RC-2026-0898',
    customerName: 'Aarav Gupta',
    customerId: 'CUST-4112',
    triggerSource: 'Complaint Intelligence Engine',
    event: '3 consecutive months of late payment fees',
    riskLevel: 'Moderate',
    healthScore: 65,
    retentionObjective: 'Fee Reversal & AutoPay Setup',
    channel: 'SMS + Push Notification',
    status: 'RESOLVED_RECOVERED',
    customerResponse: 'Enabled AutoPay',
    outcome: 'Loyalty Reinforced',
    revenueProtected: 25000,
    revenueAtRisk: 25000,
    rmAssigned: 'System',
    aiTransparency: {
      confidenceScore: 89,
      triggerReason: 'Customer sentiment dropped to Angry due to fees',
      recommendedAction: 'One-time fee reversal coupled with automated payment setup',
      actualActionTaken: 'Automated SMS Offer Sent',
    },
    journey: [
      { step: 'Customer Event', desc: 'Angry sentiment logged in SAGE', time: 'May 28, 04:00 PM' },
      { step: 'Outreach Trigger', desc: 'Automated SMS Sent', time: 'May 28, 04:05 PM' },
      { step: 'Customer Response', desc: 'AutoPay enabled', time: 'May 28, 05:00 PM' },
      { step: 'Validation', desc: 'Fee reversed successfully', time: 'May 29, 09:00 AM' }
    ],
    validation: { stage: 'Closed', status: 'Customer Recovered' }
  }
];

export default function OutreachManagerPage() {
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('outreachCases_v2');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('outreachCases_v2', JSON.stringify(INITIAL_OUTREACH_CASES));
    return INITIAL_OUTREACH_CASES;
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [manualIntervention, setManualIntervention] = useState({
    customerId: '', reason: '', channel: 'WhatsApp', notes: ''
  });

  const TABS = [
    { key: 'all', label: 'All Open Cases', count: cases.length },
    { key: 'churn', label: 'Churn Prevention', count: cases.filter(c => c.triggerSource.includes('Churn')).length },
    { key: 'complaints', label: 'Complaint Intelligence', count: cases.filter(c => c.triggerSource.includes('Complaint')).length },
    { key: 'sentiment', label: 'Sentiment Recovery', count: cases.filter(c => c.triggerSource.includes('Sentiment')).length },
    { key: 'rm', label: 'RM Interventions', count: cases.filter(c => c.status === 'RM_INTERVENTION').length },
  ];

  const filteredCases = cases.filter(c => {
    if (activeTab === 'churn' && !c.triggerSource.includes('Churn')) return false;
    if (activeTab === 'complaints' && !c.triggerSource.includes('Complaint')) return false;
    if (activeTab === 'sentiment' && !c.triggerSource.includes('Sentiment')) return false;
    if (activeTab === 'rm' && c.status !== 'RM_INTERVENTION') return false;
    
    if (searchQuery && !c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) && !c.caseId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={28} color="var(--accent-blue)" /> Retention & Outreach Operations Center
          </h2>
          <p>1-to-1 intelligent customer retention, relationship management, and automated recovery workflows</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Initiate Manual Intervention
          </button>
        </div>
      </div>

      {/* Executive KPI Layer */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="stat-card blue">
          <div className="stat-icon blue"><Activity size={22} /></div>
          <div className="stat-value">1,482</div>
          <div className="stat-label">Customers At Risk</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><HeartHandshake size={22} /></div>
          <div className="stat-value">845</div>
          <div className="stat-label">Customers Saved</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple"><ShieldCheck size={22} /></div>
          <div className="stat-value">₹14.2 Cr</div>
          <div className="stat-label">Revenue Protected</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><TrendingUp size={22} /></div>
          <div className="stat-value">82%</div>
          <div className="stat-label">Customer Recovery Rate</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red"><AlertTriangle size={22} /></div>
          <div className="stat-value">14</div>
          <div className="stat-label">SLA Breaches</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setSelectedCase(null); }}
            style={{
              padding: '10px 16px', background: 'none', border: 'none',
              borderBottom: activeTab === t.key ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: activeTab === t.key ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: activeTab === t.key ? 700 : 500,
              cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {t.label}
            {t.count !== null && (
              <span style={{
                fontSize: '0.7rem', padding: '1px 7px', borderRadius: 100,
                background: activeTab === t.key ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)',
                fontWeight: 700,
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* RETENTION CASES TABLE */}
      {/* ═══════════════════════════════════════ */}
      {!selectedCase && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: 300 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="form-input"
                placeholder="Search case ID or customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Retention Case ID</th>
                    <th>Customer</th>
                    <th>Intelligence Source</th>
                    <th>Trigger Event</th>
                    <th>Risk Level</th>
                    <th>Communication Status</th>
                    <th>Outcome</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map(c => {
                    const st = STATUS_CONFIG[c.status];
                    return (
                      <tr key={c.caseId}>
                        <td style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>{c.caseId}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{c.customerName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.customerId} • Health: {c.healthScore}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                            <Brain size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                            {c.triggerSource}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.82rem', maxWidth: 200 }}>{c.event}</td>
                        <td>
                          <div style={{ fontWeight: 600, color: c.riskLevel === 'Critical' || c.riskLevel === 'Severe' ? '#ef4444' : c.riskLevel === 'High' ? '#f97316' : '#10b981' }}>
                            {c.riskLevel}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: st.bg, color: st.color }}>
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>
                          <div style={{ fontWeight: 600, color: c.outcome.includes('Recovered') ? '#10b981' : 'var(--text-primary)' }}>{c.outcome}</div>
                          {c.revenueProtected > 0 && <div style={{ fontSize: '0.7rem', color: '#10b981' }}>+₹{(c.revenueProtected / 100000).toFixed(1)}L Protected</div>}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '4px 8px' }}
                            onClick={() => setSelectedCase(c)}
                            title="Inspect Journey"
                          >
                            <Eye size={13} /> Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredCases.length === 0 && (
              <div className="empty-state">
                <ShieldCheck size={40} />
                <h3>No retention cases found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* CUSTOMER JOURNEY DETAIL VIEW */}
      {/* ═══════════════════════════════════════ */}
      {selectedCase && (
        <div className="fade-in">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedCase(null)}
            style={{ marginBottom: 16 }}
          >
            <ChevronLeft size={14} /> Back to Cases
          </button>

          {/* Case Header */}
          <div className="card" style={{ marginBottom: 20, borderTop: `4px solid ${STATUS_CONFIG[selectedCase.status].color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {selectedCase.customerName} ({selectedCase.customerId})
                  <span style={{
                    fontSize: '0.72rem', fontWeight: 700, padding: '3px 12px', borderRadius: 100,
                    background: STATUS_CONFIG[selectedCase.status].bg,
                    color: STATUS_CONFIG[selectedCase.status].color,
                  }}>
                    {selectedCase.status.replace('_', ' ')}
                  </span>
                </h3>
                <div style={{ display: 'flex', gap: 20, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 10 }}>
                  <span><strong style={{color: 'var(--text-primary)'}}>Case ID:</strong> {selectedCase.caseId}</span>
                  <span><strong style={{color: 'var(--text-primary)'}}>Objective:</strong> {selectedCase.retentionObjective}</span>
                  <span><strong style={{color: 'var(--text-primary)'}}>RM Assigned:</strong> {selectedCase.rmAssigned}</span>
                  <span><strong style={{color: 'var(--text-primary)'}}>Rev at Risk:</strong> ₹{selectedCase.revenueAtRisk.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: selectedCase.healthScore < 40 ? '#ef4444' : selectedCase.healthScore < 70 ? '#f59e0b' : '#10b981' }}>
                  {selectedCase.healthScore}/100
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Health</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
            {/* End to End Journey */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><History size={18} /> End-to-End Customer Journey</div>
              </div>
              <div style={{ position: 'relative', paddingLeft: 20, marginTop: 10 }}>
                {/* Vertical Timeline Line */}
                <div style={{ position: 'absolute', left: 24, top: 10, bottom: 10, width: 2, background: 'var(--border-color)' }} />
                
                {selectedCase.journey.map((step, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ 
                      width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-blue)', 
                      marginTop: 6, zIndex: 2, border: '2px solid var(--bg-card)' 
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{step.step}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{step.time}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Decision Transparency & Validation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div className="card">
                <div className="card-header">
                  <div className="card-title"><Brain size={18} color="var(--accent-purple)" /> AI Decision Transparency</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confidence Score</span>
                    <span className="badge badge-green">{selectedCase.aiTransparency.confidenceScore}%</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Trigger Reason</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: 10, borderRadius: 8 }}>
                      {selectedCase.aiTransparency.triggerReason}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Recommended Action</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', background: 'rgba(59,130,246,0.1)', padding: 10, borderRadius: 8 }}>
                      {selectedCase.aiTransparency.recommendedAction}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 12, marginTop: 4 }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Actual Action Taken</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selectedCase.aiTransparency.actualActionTaken}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage 7 Validation */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title"><ShieldCheck size={18} color="var(--accent-green)" /> Retention Validation Layer</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={20} color="var(--accent-blue)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Validation Stage</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedCase.validation.stage}</div>
                  </div>
                </div>
                <div style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Current Status:</span>
                  <span style={{ 
                    fontWeight: 700, fontSize: '0.9rem',
                    color: selectedCase.validation.status.includes('Recovered') || selectedCase.validation.status.includes('Stabilized') ? '#10b981' : 
                           selectedCase.validation.status.includes('At Risk') ? '#f59e0b' : '#ef4444' 
                  }}>
                    {selectedCase.validation.status}
                  </span>
                </div>
              </div>

              {/* RM Interventions */}
              {selectedCase.status === 'RM_INTERVENTION' && (
                <div className="card" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
                  <div className="card-header">
                    <div className="card-title"><Phone size={18} color="#ef4444" /> RM Intervention Required</div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                    This case has been escalated to human intervention. Please update the tracking notes.
                  </p>
                  <button className="btn btn-primary" style={{ width: '100%', background: '#ef4444', color: 'white' }}>
                    Log RM Outreach Outcome
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* INITIATE MANUAL INTERVENTION MODAL */}
      {/* ═══════════════════════════════════════ */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowCreateModal(false)} />
          <div style={{
            position: 'relative', width: 500, background: 'rgba(26, 32, 53, 0.95)',
            backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Initiate Manual Intervention</h3>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="form-group">
              <label className="form-label">Customer ID / Name</label>
              <input className="form-input" placeholder="e.g. CUST-8921" value={manualIntervention.customerId} onChange={e => setManualIntervention({...manualIntervention, customerId: e.target.value})} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Trigger Reason</label>
              <select className="form-input" value={manualIntervention.reason} onChange={e => setManualIntervention({...manualIntervention, reason: e.target.value})}>
                <option value="">Select reason...</option>
                <option>Executive Escalation</option>
                <option>Branch Walk-in Follow-up</option>
                <option>Manual Risk Override</option>
                <option>Relationship Manager Discretion</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Outreach Channel</label>
              <select className="form-input" value={manualIntervention.channel} onChange={e => setManualIntervention({...manualIntervention, channel: e.target.value})}>
                <option>RM Call</option>
                <option>WhatsApp</option>
                <option>SMS</option>
                <option>Email</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Intervention Notes</label>
              <textarea className="form-input" rows={3} placeholder="Add context for this manual override..." value={manualIntervention.notes} onChange={e => setManualIntervention({...manualIntervention, notes: e.target.value})} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowCreateModal(false)}>
                <Send size={14} /> Trigger Workflow
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
