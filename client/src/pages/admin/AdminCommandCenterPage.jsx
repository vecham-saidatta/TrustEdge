import { useState, useEffect } from 'react';
import { commandCenterAPI } from '../../api';
import {
  Shield, AlertTriangle, Users, Phone, Clock, Megaphone, TrendingUp, TrendingDown,
  Activity, Brain, Cpu, MessageSquare, CheckCircle, XCircle, Eye, RefreshCw,
  Filter, ChevronDown, ArrowUpRight, ArrowDownRight, Zap, Target, BarChart3,
  Globe, Building2, UserCheck, Radio, Wifi, WifiOff, Server, Bot, Languages,
  CircleDot, AlertCircle, ChevronRight, Calendar, Hash, ClipboardList
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend, ComposedChart, Area, Cell
} from 'recharts';

// ═══════════════════════════════════════════════════
// MOCK DATA — Indian Banking Context
// ═══════════════════════════════════════════════════

const now = new Date();
const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });


const Icons = { Brain, Radio, Bot, Languages, Zap, Shield };
// HELPER COMPONENTS

// ═══════════════════════════════════════════════════

function PulsingDot({ color = 'var(--accent-green)', size = 8 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color,
      animation: 'cmdPulse 2s infinite',
    }}>
      <style>{`@keyframes cmdPulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 70% { box-shadow: 0 0 0 8px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }`}</style>
    </span>
  );
}

function StatusDot({ status }) {
  const color = status === 'Operational' ? 'var(--accent-green)' : status === 'Degraded' ? 'var(--accent-yellow)' : 'var(--accent-red)';
  return <PulsingDot color={color} size={8} />;
}

function TrendArrow({ direction, size = 14 }) {
  if (direction === 'up') return <ArrowUpRight size={size} color="var(--accent-green)" />;
  if (direction === 'down') return <ArrowDownRight size={size} color="var(--accent-red)" />;
  return <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>—</span>;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{
      background: 'rgba(26,32,53,0.95)', backdropFilter: 'blur(20px)',
      border: '1px solid var(--border-color)', borderRadius: 10,
      padding: '12px 16px', fontSize: '0.78rem',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill, display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 2 }}>
          <span>{p.name}:</span>
          <span style={{ fontWeight: 700 }}>{typeof p.value === 'number' && p.name?.includes('Rate') ? `${p.value}%` : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export default function AdminCommandCenterPage() {
  const [data, setData] = useState({
      riskExposure: null,
      operationsHealth: null,
      campaignPerformance: [],
      sageHealth: null,
      revenueProtectionData: [],
      systemHealth: []
  });

  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    commandCenterAPI.getStats().then(res => {
      const backendData = res?.data?.data || {};
      if (backendData.signal && backendData.signal.systemHealth) {
          backendData.signal.systemHealth.forEach(s => s.icon = Icons[s.iconName] || Brain);
      }
      setData({
           riskExposure: backendData?.signal?.riskExposure || null,
           operationsHealth: backendData?.retention?.operationsHealth || null,
           campaignPerformance: backendData?.outreach?.campaignPerformance || [],
           sageHealth: backendData?.feedback?.sageHealth || null,
           revenueProtectionData: backendData?.retention?.revenueProtectionData || [],
           systemHealth: backendData?.signal?.systemHealth || [],
      });
    }).catch(console.error);
  }, [lastRefresh]);

  const { riskExposure, operationsHealth, campaignPerformance, sageHealth, revenueProtectionData, systemHealth } = data;

  const [toast, setToast] = useState('');
  const [liveTime, setLiveTime] = useState(new Date());

  // Filter State
  const [scopeFilter, setScopeFilter] = useState('National');
  const [timeWindow, setTimeWindow] = useState('Today');
  const [riskTier, setRiskTier] = useState('All');
  const [campaignFilter, setCampaignFilter] = useState('All');

  // Interactive State
  const [expandedPanel, setExpandedPanel] = useState(null);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!riskExposure) return <div style={{padding: 40, color: '#fff'}}>Loading Command Center Data...</div>;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    showToast('🔄 Command Center refreshed — all panels synced');
  };

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════
  return (
    <div className="fade-in">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'rgba(26,32,53,0.95)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-strong)', borderRadius: 12,
          padding: '14px 20px', fontSize: '0.85rem', fontWeight: 500,
          color: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.3s ease', maxWidth: 420,
        }}>
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            🎯 Admin Command Center
          </h2>
          <p>Situation Room — Real-time retention operations intelligence</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 14px',
            border: '1px solid var(--border-color)', fontSize: '0.82rem', fontWeight: 600,
            fontFamily: 'monospace', color: 'var(--text-primary)',
          }}>
            <PulsingDot color="var(--accent-green)" size={6} />
            {liveTime.toLocaleTimeString('en-IN')}
          </div>
          <button className="btn btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} /> Sync
          </button>
        </div>
      </div>

      {/* ═══════════ GLOBAL FILTER BAR ═══════════ */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 28, padding: '14px 20px',
        background: 'var(--bg-card)', borderRadius: 12,
        border: '1px solid var(--border-color)', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <Filter size={16} color="var(--text-muted)" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Scope</label>
          <select className="form-input" value={scopeFilter} onChange={e => setScopeFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.82rem', minWidth: 140, background: 'var(--bg-input)' }}>
            {['National', 'South Region', 'West Region', 'North Region', 'East Region', 'MG Road Branch', 'Bandra Branch'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Time Window</label>
          <select className="form-input" value={timeWindow} onChange={e => setTimeWindow(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.82rem', minWidth: 120, background: 'var(--bg-input)' }}>
            {['Today', 'This Week', 'This Month', 'Custom'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Risk Tier</label>
          <select className="form-input" value={riskTier} onChange={e => setRiskTier(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.82rem', minWidth: 120, background: 'var(--bg-input)' }}>
            {['All', 'Critical', 'High', 'Moderate'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Campaign</label>
          <select className="form-input" value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.82rem', minWidth: 160, background: 'var(--bg-input)' }}>
            <option value="All">All Campaigns</option>
            {campaignPerformance.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scope: <strong style={{ color: 'var(--accent-blue)' }}>{scopeFilter}</strong></span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>·</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Window: <strong style={{ color: 'var(--accent-blue)' }}>{timeWindow}</strong></span>
        </div>
      </div>

      {/* ═══════════ PANEL 1: LIVE RISK EXPOSURE ═══════════ */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">
            <Shield size={18} color="var(--accent-red)" />
            Live Risk Exposure Summary
            <span style={{
              marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 10px', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700,
              background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)',
            }}>
              <PulsingDot color="var(--accent-red)" size={6} /> LIVE
            </span>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={() => showToast('📊 Loading full risk cohort analysis...')}>
            View All Risk Cohorts <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.values(riskExposure).map((tier, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr 1fr 1fr auto',
              gap: 20, alignItems: 'center', padding: '16px 20px',
              background: 'var(--bg-secondary)', borderRadius: 12,
              borderLeft: `4px solid ${tier.color}`,
            }}>
              {/* Tier Label */}
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: tier.color, marginBottom: 2 }}>
                  {tier.tier}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Score {tier.range}</div>
              </div>

              {/* Customer Count */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tier.count.toLocaleString()}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Customers</div>
              </div>

              {/* AUM at Risk */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: tier.color }}>
                  ₹{(tier.aumAtRisk / 10000000).toFixed(1)}Cr
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AUM at Risk</div>
              </div>

              {/* Unassigned */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.3rem', fontWeight: 800,
                  color: tier.unassigned > 20 ? 'var(--accent-red)' : tier.unassigned > 10 ? 'var(--accent-yellow)' : 'var(--accent-green)',
                }}>
                  {tier.unassigned}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unassigned</div>
              </div>

              {/* Action Button */}
              <button className="btn btn-sm btn-primary" onClick={() => showToast(`📋 Opening ${tier.tier.toLowerCase()} tier assignment panel — ${tier.unassigned} customers need RMs`)}>
                <UserCheck size={14} /> Assign Now
              </button>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 16,
          padding: '10px 16px', background: 'var(--bg-input)', borderRadius: 8,
          fontSize: '0.78rem', color: 'var(--text-muted)',
        }}>
          <span>Total Exposure: <strong style={{ color: 'var(--accent-red)' }}>
            ₹{((riskExposure.critical.aumAtRisk + riskExposure.high.aumAtRisk + riskExposure.moderate.aumAtRisk) / 10000000).toFixed(1)}Cr
          </strong></span>
          <span>Total Customers: <strong style={{ color: 'var(--text-primary)' }}>
            {(riskExposure.critical.count + riskExposure.high.count + riskExposure.moderate.count).toLocaleString()}
          </strong></span>
          <span>Unassigned: <strong style={{ color: 'var(--accent-yellow)' }}>
            {riskExposure.critical.unassigned + riskExposure.high.unassigned + riskExposure.moderate.unassigned}
          </strong></span>
        </div>
      </div>

      {/* ═══════════ PANEL 2: RETENTION OPERATIONS HEALTH ═══════════ */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {/* Open Cases */}
        <div className="stat-card blue" style={{ position: 'relative' }}>
          <div className="stat-icon blue"><ClipboardList size={22} /></div>
          <div className="stat-value">{operationsHealth.openCases.active}</div>
          <div className="stat-label">Open Cases</div>
          <div style={{
            marginTop: 8, padding: '4px 10px', borderRadius: 6,
            background: operationsHealth.openCases.overdue > 20 ? 'var(--accent-red-soft)' : 'var(--accent-yellow-soft)',
            fontSize: '0.75rem', fontWeight: 700,
            color: operationsHealth.openCases.overdue > 20 ? 'var(--accent-red)' : 'var(--accent-yellow)',
            display: 'inline-block',
          }}>
            {operationsHealth.openCases.overdue} overdue
          </div>
          <button className="btn btn-sm btn-secondary" style={{ marginTop: 8, width: '100%' }} onClick={() => showToast('📋 Opening case management dashboard...')}>
            <Eye size={14} /> View Cases
          </button>
        </div>

        {/* Pending Outreach */}
        <div className="stat-card green" style={{ position: 'relative' }}>
          <div className="stat-icon green"><Megaphone size={22} /></div>
          <div className="stat-value">{operationsHealth.pendingOutreach.queued}</div>
          <div className="stat-label">Pending Outreach</div>
          <div style={{
            marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)',
          }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-yellow)' }}>{operationsHealth.pendingOutreach.suppressed}</span> suppressed (fatigue rules)
          </div>
          <button className="btn btn-sm btn-secondary" style={{ marginTop: 8, width: '100%' }} onClick={() => showToast('📧 Opening outreach queue...')}>
            <Eye size={14} /> View Queue
          </button>
        </div>

        {/* RM Calls Due */}
        <div className="stat-card yellow" style={{ position: 'relative' }}>
          <div className="stat-icon yellow"><Phone size={22} /></div>
          <div className="stat-value">{operationsHealth.rmCallsDue.assigned}</div>
          <div className="stat-label">RM Calls Due Today</div>
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
              <span style={{ color: 'var(--text-muted)' }}>Completion</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>
                {Math.round((operationsHealth.rmCallsDue.completed / operationsHealth.rmCallsDue.assigned) * 100)}%
              </span>
            </div>
            <div style={{ background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div style={{
                width: `${(operationsHealth.rmCallsDue.completed / operationsHealth.rmCallsDue.assigned) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-green), #34d399)',
                borderRadius: 4, transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" style={{ marginTop: 8, width: '100%' }} onClick={() => showToast('📞 Opening RM call tracker...')}>
            <BarChart3 size={14} /> View Details
          </button>
        </div>

        {/* SLA Breaches */}
        <div className="stat-card red" style={{ position: 'relative' }}>
          <div className="stat-icon red"><AlertTriangle size={22} /></div>
          <div className="stat-value" style={{ color: 'var(--accent-red)' }}>{operationsHealth.slaBreaches.count}</div>
          <div className="stat-label">SLA Breaches</div>
          <div style={{
            marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)',
          }}>
            Avg open: <span style={{ fontWeight: 700, color: 'var(--accent-red)' }}>{operationsHealth.slaBreaches.avgDaysOpen} days</span>
          </div>
          <button className="btn btn-sm btn-danger" style={{ marginTop: 8, width: '100%' }} onClick={() => showToast('🚨 Opening SLA breach resolution panel...')}>
            <Eye size={14} /> View & Resolve
          </button>
        </div>
      </div>

      {/* ═══════════ PANEL 3: CAMPAIGN PERFORMANCE ═══════════ */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title"><Megaphone size={18} color="var(--accent-green)" /> Campaign Performance (Live)</div>
          <span className="badge badge-green">{campaignPerformance.filter(c => c.status === 'Active').length} active</span>
        </div>

        {/* Warning Alert for Declining Campaigns */}
        {campaignPerformance.filter(c => c.status === 'Warning').length > 0 && (
          <div className="alert-card" style={{
            borderLeftColor: 'var(--accent-yellow)', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <AlertTriangle size={18} color="var(--accent-yellow)" />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--accent-yellow)', fontSize: '0.85rem' }}>
                ⚠ {campaignPerformance.filter(c => c.status === 'Warning').length} campaigns showing declining performance
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                — {campaignPerformance.filter(c => c.status === 'Warning').map(c => c.name).join(', ')}
              </span>
            </div>
            <button className="btn btn-sm btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => showToast('🔍 Analyzing declining campaign patterns...')}>
              Investigate
            </button>
          </div>
        )}

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Channel</th>
                <th>Engagement %</th>
                <th>Conversions</th>
                <th>Spend</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaignPerformance
                .filter(c => campaignFilter === 'All' || c.name === campaignFilter)
                .map(camp => (
                <tr key={camp.id} style={{
                  background: camp.status === 'Warning' ? 'rgba(245,158,11,0.04)' : 'transparent'
                }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 240 }}>{camp.name}</td>
                  <td>
                    <span className="badge badge-blue">{camp.channel}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: camp.engagement > 20 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                        {camp.engagement}%
                      </span>
                      <TrendArrow direction={camp.engagementTrend} />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{camp.conversions}</span>
                      <TrendArrow direction={camp.conversionsTrend} />
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    ₹{(camp.spend / 1000).toFixed(0)}K
                  </td>
                  <td>
                    <span className={`badge ${camp.status === 'Active' ? 'badge-green' : 'badge-yellow'}`}>
                      {camp.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => showToast(`📊 Opening detailed analytics for "${camp.name}"`)}>
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════ PANELS 4 & 5 (Two Column) ═══════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, marginBottom: 24 }}>

        {/* ═══════════ PANEL 4: SAGE AI HEALTH ═══════════ */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><Brain size={18} color="var(--accent-purple)" /> SAGE AI Health</div>
            <span className="badge badge-purple">24h</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {/* Total Conversations */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px',
              borderLeft: '3px solid var(--accent-purple)',
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                Conversations (24h)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {sageHealth.totalConversations24h.toLocaleString()}
              </div>
            </div>

            {/* Avg Satisfaction */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px',
              borderLeft: '3px solid var(--accent-green)',
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                Avg Satisfaction
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                  {sageHealth.avgSatisfaction}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/5</span>
                <span style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  color: sageHealth.satisfactionTrend > 0 ? 'var(--accent-green)' : 'var(--accent-red)',
                  display: 'flex', alignItems: 'center', gap: 2,
                }}>
                  {sageHealth.satisfactionTrend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {sageHealth.satisfactionTrend > 0 ? '+' : ''}{sageHealth.satisfactionTrend}
                </span>
              </div>
            </div>

            {/* Unresolved Escalations */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px',
              borderLeft: `3px solid ${sageHealth.unresolvedEscalations > 5 ? 'var(--accent-red)' : 'var(--accent-yellow)'}`,
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                Unresolved Escalations
              </div>
              <div style={{
                fontSize: '1.4rem', fontWeight: 800,
                color: sageHealth.unresolvedEscalations > 5 ? 'var(--accent-red)' : 'var(--accent-yellow)',
              }}>
                {sageHealth.unresolvedEscalations}
              </div>
            </div>

            {/* Low Confidence */}
            <div style={{
              background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px',
              borderLeft: '3px solid var(--accent-yellow)',
            }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>
                Low-Confidence Flagged
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-yellow)' }}>
                {sageHealth.lowConfidenceFlagged}
              </div>
            </div>

            {/* Translation Success Rate - Full width */}
            <div style={{
              gridColumn: '1 / -1',
              background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px',
              borderLeft: '3px solid var(--accent-cyan)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Translation Success Rate
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {sageHealth.translationSuccessRate}%
                </span>
              </div>
              <div style={{ background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{
                  width: `${sageHealth.translationSuccessRate}%`, height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-cyan), #22d3ee)',
                  borderRadius: 4,
                }} />
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {sageHealth.topLanguages.map(lang => (
                  <span key={lang} style={{
                    padding: '2px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 600,
                    background: 'rgba(6,182,212,0.1)', color: 'var(--accent-cyan)',
                  }}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-sm btn-secondary" style={{ flex: 1 }} onClick={() => showToast('💬 Opening SAGE conversation monitor...')}>
              <MessageSquare size={14} /> View Conversations
            </button>
            <button className="btn btn-sm btn-secondary" style={{ flex: 1 }} onClick={() => showToast('🔍 Opening flagged responses for review...')}>
              <AlertCircle size={14} /> Review Flagged
            </button>
          </div>
        </div>

        {/* ═══════════ PANEL 5: REVENUE PROTECTION TREND ═══════════ */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={18} color="var(--accent-green)" /> Revenue Protection Trend (7-Day)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.78rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-green)' }}></span> AUM Protected
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent-red)' }}></span> AUM Lost
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 3, height: 10, borderRadius: 1, background: 'var(--accent-blue)' }}></span> Retention Rate
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={revenueProtectionData}>
              <defs>
                <linearGradient id="protectedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="lostGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(148,163,184,0.1)' }} />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
                label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                yAxisId="right" orientation="right"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
                domain={[70, 100]}
                label={{ value: '%', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="protected" fill="url(#protectedGrad)" radius={[4, 4, 0, 0]} name="AUM Protected (₹Cr)" barSize={28} />
              <Bar yAxisId="left" dataKey="lost" fill="url(#lostGrad)" radius={[4, 4, 0, 0]} name="AUM Lost (₹Cr)" barSize={28} />
              <Line yAxisId="right" type="monotone" dataKey="retentionRate" stroke="var(--accent-blue)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--accent-blue)' }} name="Retention Rate" />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Summary Stats Below Chart */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 16,
          }}>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>Total Protected</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                ₹{revenueProtectionData.reduce((s, d) => s + d.protected, 0).toFixed(1)}Cr
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>Total Lost</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                ₹{revenueProtectionData.reduce((s, d) => s + d.lost, 0).toFixed(1)}Cr
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>Net Retention</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                {Math.round((revenueProtectionData.reduce((s, d) => s + d.protected, 0) / (revenueProtectionData.reduce((s, d) => s + d.protected, 0) + revenueProtectionData.reduce((s, d) => s + d.lost, 0))) * 100)}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>Best Day</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                {revenueProtectionData.reduce((best, d) => d.retentionRate > best.retentionRate ? d : best).day} ({revenueProtectionData.reduce((best, d) => d.retentionRate > best.retentionRate ? d : best).retentionRate}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ PANEL 6: SYSTEM & MODEL HEALTH ═══════════ */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title"><Cpu size={18} color="var(--accent-cyan)" /> System & Model Health</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
            {systemHealth.every(s => s.status === 'Operational') ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-green)', fontWeight: 600 }}>
                <Wifi size={14} /> All Systems Operational
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-yellow)', fontWeight: 600 }}>
                <AlertCircle size={14} /> {systemHealth.filter(s => s.status !== 'Operational').length} Degraded
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {systemHealth.map((sys, i) => {
            const Icon = sys.icon;
            const isDegraded = sys.status !== 'Operational';
            return (
              <div key={i} style={{
                background: isDegraded ? 'rgba(245,158,11,0.06)' : 'var(--bg-secondary)',
                borderRadius: 10, padding: '14px 16px',
                border: `1px solid ${isDegraded ? 'rgba(245,158,11,0.2)' : 'var(--border-color)'}`,
                transition: 'var(--transition)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${sys.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: sys.color,
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{sys.name}</span>
                  </div>
                  <StatusDot status={sys.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{sys.metric}</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{sys.latency}</span>
                </div>
                <div style={{
                  marginTop: 6, fontSize: '0.68rem', fontWeight: 600,
                  color: sys.color,
                }}>
                  {sys.status}
                </div>
              </div>
            );
          })}
        </div>

        {/* Degraded System Alert */}
        {systemHealth.some(s => s.status === 'Degraded') && (
          <div className="alert-card" style={{
            borderLeftColor: 'var(--accent-yellow)', marginTop: 16,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <AlertCircle size={18} color="var(--accent-yellow)" />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-yellow)', fontSize: '0.85rem' }}>
                Service Degradation Detected
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                — {systemHealth.filter(s => s.status === 'Degraded').map(s => s.name).join(', ')} showing elevated latency
              </span>
            </div>
            <button className="btn btn-sm btn-secondary" onClick={() => showToast('🔧 Opening infrastructure monitoring dashboard...')}>
              <Server size={14} /> Investigate
            </button>
          </div>
        )}
      </div>

      {/* Footer — Last Refresh */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8,
        fontSize: '0.75rem', color: 'var(--text-muted)',
        border: '1px solid var(--border-color)',
      }}>
        <span>Last full sync: {lastRefresh.toLocaleString('en-IN')}</span>
        <span>Filters: {scopeFilter} · {timeWindow} · Risk: {riskTier}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <PulsingDot color="var(--accent-green)" size={6} />
          Auto-refresh: 60s interval
        </span>
      </div>
    </div>
  );
}
