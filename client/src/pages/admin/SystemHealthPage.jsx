import { useState, useEffect } from 'react';
import {
  Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, XCircle,
  Clock, RefreshCw, Zap, BarChart3, TrendingUp, TrendingDown, Layers,
  HardDrive, Cpu, MemoryStick, Globe, Shield, Eye, Settings, Search,
  AlertCircle, ArrowRight, FileText, Calendar, ChevronDown, ChevronUp,
  Radio, X, Hash, Gauge, Timer, Bug
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// ═══════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════

const services = [
  { name: 'TGN Scoring Engine', status: 'healthy', latency: '142ms', p99: '142ms', uptime: '99.91%', uptimeNum: 99.91, icon: '🧬', desc: 'Temporal Graph Neural Network inference', lastCheck: '12s ago' },
  { name: 'SAGE LLM API', status: 'healthy', latency: '2.1s', p99: '2.1s', uptime: '99.87%', uptimeNum: 99.87, icon: '🤖', desc: 'GPT-4o conversational AI layer', lastCheck: '8s ago' },
  { name: 'Translation API', status: 'degraded', latency: '8.4s', p99: '8.4s', uptime: '98.2%', uptimeNum: 98.2, icon: '🌐', desc: 'Multi-language translation service', lastCheck: '5s ago' },
  { name: 'PULSE PPO Service', status: 'healthy', latency: 'Background', p99: 'Background', uptime: '100%', uptimeNum: 100, icon: '🧠', desc: 'Proximal Policy Optimization RL engine', lastCheck: '15s ago' },
  { name: 'Kafka Event Bus', status: 'healthy', latency: '0.18s lag', p99: '0.18s', uptime: '99.99%', uptimeNum: 99.99, icon: '📡', desc: 'Event streaming backbone', lastCheck: '2s ago' },
  { name: 'Redis Cache', status: 'healthy', latency: '0.8ms', p99: '0.8ms', uptime: '99.99%', uptimeNum: 99.99, icon: '⚡', desc: 'In-memory cache layer', lastCheck: '1s ago' },
  { name: 'PostgreSQL Primary', status: 'healthy', latency: '12ms', p99: '12ms', uptime: '100%', uptimeNum: 100, icon: '🐘', desc: 'Primary RDBMS cluster', lastCheck: '3s ago' },
  { name: 'Milvus Vector Store', status: 'healthy', latency: '45ms', p99: '45ms', uptime: '99.94%', uptimeNum: 99.94, icon: '🔮', desc: 'Vector similarity search engine', lastCheck: '10s ago' },
  { name: 'CDC Debezium Pipeline', status: 'healthy', latency: '0.6s lag', p99: '0.6s', uptime: '99.97%', uptimeNum: 99.97, icon: '🔄', desc: 'Change Data Capture streaming', lastCheck: '4s ago' },
  { name: 'WORM Audit Logger', status: 'healthy', latency: '3ms', p99: '3ms', uptime: '100%', uptimeNum: 100, icon: '🔒', desc: 'Write-Once-Read-Many audit storage', lastCheck: '6s ago' },
];

const STATUS_CONFIG = {
  healthy: { label: 'Healthy', color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '✅' },
  degraded: { label: 'Degraded', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '⚠️' },
  down: { label: 'Down', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '❌' },
};

// Kafka data
const kafkaConsumerLag = [
  { topic: 'transactions', lag: 245, partitions: 12, consumers: 6 },
  { topic: 'crm-events', lag: 89, partitions: 6, consumers: 3 },
  { topic: 'mobile-events', lag: 156, partitions: 8, consumers: 4 },
  { topic: 'risk-scores', lag: 12, partitions: 4, consumers: 2 },
  { topic: 'outreach-logs', lag: 34, partitions: 4, consumers: 2 },
  { topic: 'audit-events', lag: 3, partitions: 2, consumers: 1 },
];

const kafkaThroughput = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m ago`,
  transactions: 1200 + Math.random() * 800,
  crmEvents: 300 + Math.random() * 200,
  mobileEvents: 600 + Math.random() * 400,
}));

const dlqData = [
  { topic: 'transactions.DLQ', count: 3, oldest: '2h ago', reason: 'Schema validation failure' },
  { topic: 'crm-events.DLQ', count: 0, oldest: '—', reason: '—' },
  { topic: 'mobile-events.DLQ', count: 1, oldest: '45m ago', reason: 'Missing required field: deviceId' },
];

// Model Serving data
const tgnRequestsData = Array.from({ length: 30 }, (_, i) => ({
  time: `${30 - i}m`,
  requests: 45 + Math.random() * 30,
  p99: 120 + Math.random() * 60,
}));

const cacheMetrics = {
  hitRate: 94.2,
  missRate: 5.8,
  totalKeys: 48523,
  memoryUsed: '2.4 GB',
  memoryMax: '4 GB',
  evictions: 12,
  connections: 45,
  opsPerSec: 8945,
};

const gnnQueueDepth = Array.from({ length: 20 }, (_, i) => ({
  time: `${20 - i}m`,
  depth: Math.floor(Math.random() * 15),
  processing: Math.floor(Math.random() * 8),
}));

const pulseMetrics = {
  utilization: 67.3,
  trainingEpochs: 1247,
  lastTrainTime: '2026-05-26 18:00',
  modelVersion: 'v2.4.1',
  reward: 0.847,
  explorationRate: 0.05,
};

// Database data
const queryLatency = [
  { percentile: 'P50', value: 8, color: '#10b981' },
  { percentile: 'P75', value: 15, color: '#3b82f6' },
  { percentile: 'P90', value: 28, color: '#f59e0b' },
  { percentile: 'P95', value: 45, color: '#f59e0b' },
  { percentile: 'P99', value: 89, color: '#ef4444' },
];

const dbConnections = {
  active: 45,
  idle: 30,
  poolLimit: 100,
  waiting: 0,
};

const slowQueries = [
  { query: 'SELECT * FROM txn_master WHERE customer_id = $1 AND date >= $2 ORDER BY date DESC', duration: '1.2s', table: 'txn_master', occurrences: 3, lastSeen: '5m ago' },
  { query: 'UPDATE health_scores SET score = $1, updated_at = NOW() WHERE user_id IN (SELECT id FROM users WHERE branch_id = $2)', duration: '890ms', table: 'health_scores', occurrences: 1, lastSeen: '12m ago' },
  { query: 'SELECT u.*, hs.*, cr.* FROM users u JOIN health_scores hs ON u.id = hs.user_id LEFT JOIN churn_reports cr ON u.id = cr.user_id WHERE hs.health_level = $1', duration: '720ms', table: 'users (join)', occurrences: 5, lastSeen: '2m ago' },
  { query: 'INSERT INTO audit_log (actor, action, entity, before_state, after_state, reason, ip, hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', duration: '560ms', table: 'audit_log', occurrences: 2, lastSeen: '8m ago' },
];

const replicationLag = {
  primary: 'pg-primary-01',
  replicas: [
    { name: 'pg-replica-01', lag: '0.2s', status: 'streaming', lsn: '1/4A238F0' },
    { name: 'pg-replica-02', lag: '0.4s', status: 'streaming', lsn: '1/4A238E8' },
    { name: 'pg-replica-03 (DR)', lag: '1.8s', status: 'streaming', lsn: '1/4A23880' },
  ],
};

// Incidents
const activeIncidents = [
  { id: 'INC-0042', title: 'Translation API Degraded Performance', severity: 'P2', service: 'Translation API', startTime: '2026-05-27 00:15:00', duration: '51 min', status: 'INVESTIGATING', assignee: 'DevOps Team', impact: 'Non-English SAGE responses delayed by 6-8s' },
];

const incidentHistory = [
  { id: 'INC-0041', title: 'Redis Cache Memory Alert', severity: 'P3', service: 'Redis Cache', startTime: '2026-05-26 14:22:00', endTime: '2026-05-26 14:45:00', duration: '23 min', status: 'RESOLVED', rootCause: 'Memory threshold hit 85% due to batch score recalculation. Auto-eviction resolved.' },
  { id: 'INC-0040', title: 'Kafka Consumer Lag Spike', severity: 'P2', service: 'Kafka Event Bus', startTime: '2026-05-25 09:10:00', endTime: '2026-05-25 09:35:00', duration: '25 min', status: 'RESOLVED', rootCause: 'End-of-day CBS batch caused 10x event spike. Consumer auto-scaled.' },
  { id: 'INC-0039', title: 'TGN Scoring Timeout', severity: 'P1', service: 'TGN Scoring Engine', startTime: '2026-05-23 16:45:00', endTime: '2026-05-23 17:20:00', duration: '35 min', status: 'RESOLVED', rootCause: 'GPU memory leak in v3.2.0. Hotfix deployed, model rolled back then forward.' },
  { id: 'INC-0038', title: 'CDC Pipeline Stall', severity: 'P2', service: 'CDC Debezium Pipeline', startTime: '2026-05-22 11:00:00', endTime: '2026-05-22 11:18:00', duration: '18 min', status: 'RESOLVED', rootCause: 'Schema change in CBS without notification. Debezium connector reconfigured.' },
  { id: 'INC-0037', title: 'SAGE LLM Rate Limit', severity: 'P3', service: 'SAGE LLM API', startTime: '2026-05-20 13:30:00', endTime: '2026-05-20 13:42:00', duration: '12 min', status: 'RESOLVED', rootCause: 'OpenAI rate limit hit during peak usage. Retry queue with exponential backoff activated.' },
];

const incidentTimeline = [
  { time: '00:15', event: 'Translation API p99 latency crossed 5s threshold', type: 'alert' },
  { time: '00:18', event: 'PagerDuty alert triggered — DevOps on-call notified', type: 'notification' },
  { time: '00:22', event: 'On-call engineer acknowledged. Investigation started.', type: 'action' },
  { time: '00:28', event: 'Root cause identified: upstream provider rate limiting', type: 'finding' },
  { time: '00:35', event: 'Failover to secondary translation endpoint initiated', type: 'action' },
  { time: '00:42', event: 'Latency improving — p99 down to 4.2s', type: 'improvement' },
  { time: '00:55', event: 'Monitoring continued. Primary endpoint recovery ETA: 1h', type: 'status' },
];

const TABS = [
  { key: 'services', label: 'Service Health', icon: Server },
  { key: 'kafka', label: 'Kafka Monitoring', icon: Radio },
  { key: 'model', label: 'Model Serving', icon: Cpu },
  { key: 'database', label: 'Database', icon: Database },
  { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
];

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

// Gauge component
function GaugeChart({ value, max, label, color, unit = '' }) {
  const pct = (value / max) * 100;
  const gaugeColor = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : color || '#10b981';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-input)" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke={gaugeColor} strokeWidth="10"
            strokeDasharray={`${(pct / 100) * 314} 314`}
            strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: gaugeColor }}>{value}{unit}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/ {max}</div>
        </div>
      </div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 8, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export default function SystemHealthPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const downCount = services.filter(s => s.status === 'down').length;

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={28} color="var(--accent-green)" /> System Health & Infrastructure
          </h2>
          <p>Real-time monitoring of all TrustEdge platform services and infrastructure components</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: autoRefresh ? '#10b981' : '#64748b', animation: autoRefresh ? 'voiceStatusBlink 1.2s ease-in-out infinite' : 'none' }} />
            Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
          </div>
          <button className="btn btn-sm btn-secondary"
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{ color: autoRefresh ? 'var(--accent-green)' : 'var(--text-muted)' }}>
            <RefreshCw size={14} /> {autoRefresh ? 'Auto' : 'Manual'}
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => setLastUpdated(new Date())}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Top-level health summary bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.4rem' }}>✅</span>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{healthyCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Healthy</div>
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--border-color)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.4rem' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{degradedCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Degraded</div>
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--border-color)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.4rem' }}>❌</span>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>{downCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Down</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Platform Uptime (30d)</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>99.94%</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Incidents</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: activeIncidents.length > 0 ? '#f59e0b' : '#10b981' }}>{activeIncidents.length}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'none', border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--accent-green)' : 'transparent'}`,
                color: isActive ? 'var(--accent-green)' : 'var(--text-muted)', fontFamily: 'inherit',
                fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}>
              <Icon size={15} /> {t.label}
              {t.key === 'incidents' && activeIncidents.length > 0 && (
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeIncidents.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 1: SERVICE HEALTH */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'services' && (
        <div className="fade-in">
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Server size={18} /> Service Health Matrix</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Last updated: {lastUpdated.toLocaleTimeString('en-IN')}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {services.map((svc, i) => {
                const cfg = STATUS_CONFIG[svc.status];
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                    background: cfg.bg, borderRadius: 12, border: `1px solid ${cfg.color}30`,
                    transition: 'var(--transition-slow)'
                  }}>
                    {/* Status Icon + Service Info */}
                    <div style={{ fontSize: '1.6rem', width: 44, textAlign: 'center' }}>{cfg.icon}</div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{svc.icon} {svc.name}</span>
                        <span className="badge" style={{ background: `${cfg.color}25`, color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{svc.desc}</div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: 'flex', gap: 24 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>P99 LATENCY</div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{svc.p99}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>UPTIME (30d)</div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: svc.uptimeNum >= 99.9 ? '#10b981' : svc.uptimeNum >= 99 ? '#f59e0b' : '#ef4444' }}>
                          {svc.uptime}
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', minWidth: 70 }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>LAST CHECK</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{svc.lastCheck}</div>
                      </div>

                      {/* Mini uptime bar */}
                      <div style={{ width: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                          <div style={{
                            width: `${svc.uptimeNum}%`, height: '100%',
                            background: svc.uptimeNum >= 99.9 ? '#10b981' : svc.uptimeNum >= 99 ? '#f59e0b' : '#ef4444',
                            borderRadius: 4, transition: 'width 1s ease'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 2: KAFKA MONITORING */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'kafka' && (
        <div className="fade-in">
          {/* Stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'Total Topics', value: '6', color: 'blue', icon: Layers },
              { label: 'Total Lag', value: '539', color: 'yellow', icon: Timer },
              { label: 'DLQ Messages', value: '4', color: 'red', icon: AlertCircle },
              { label: 'Throughput', value: '2.1K/s', color: 'green', icon: Zap },
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Consumer Lag Bar Chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><BarChart3 size={18} /> Consumer Lag per Topic</div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={kafkaConsumerLag}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 10 }} angle={-15} textAnchor="end" height={45} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="lag" name="Lag (msgs)" radius={[4, 4, 0, 0]} barSize={32}>
                    {kafkaConsumerLag.map((entry, i) => (
                      <Cell key={i} fill={entry.lag > 200 ? '#ef4444' : entry.lag > 100 ? '#f59e0b' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Throughput Line Chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><TrendingUp size={18} /> Throughput (events/sec)</div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={kafkaThroughput}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval={3} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} name="Transactions" dot={false} />
                  <Line type="monotone" dataKey="crmEvents" stroke="#10b981" strokeWidth={2} name="CRM Events" dot={false} />
                  <Line type="monotone" dataKey="mobileEvents" stroke="#8b5cf6" strokeWidth={2} name="Mobile Events" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dead Letter Queue */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><AlertCircle size={18} /> Dead Letter Queue</div>
              <span className="badge badge-yellow">{dlqData.reduce((a, d) => a + d.count, 0)} messages</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>DLQ Topic</th>
                    <th>Messages</th>
                    <th>Oldest</th>
                    <th>Reason</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dlqData.map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{d.topic}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: d.count > 0 ? '#ef4444' : '#10b981', fontSize: '1rem' }}>{d.count}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{d.oldest}</td>
                      <td style={{ fontSize: '0.82rem' }}>{d.reason}</td>
                      <td>
                        {d.count > 0 && (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-sm btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                              <Eye size={10} /> Inspect
                            </button>
                            <button className="btn btn-sm btn-primary" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                              <RefreshCw size={10} /> Retry
                            </button>
                          </div>
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
      {/* TAB 3: MODEL SERVING */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'model' && (
        <div className="fade-in">
          {/* Stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'TGN Requests/sec', value: '62.4', color: 'blue', icon: Zap },
              { label: 'Cache Hit Rate', value: `${cacheMetrics.hitRate}%`, color: 'green', icon: HardDrive },
              { label: 'GNN Queue Depth', value: '4', color: 'yellow', icon: Layers },
              { label: 'PULSE Utilization', value: `${pulseMetrics.utilization}%`, color: 'purple', icon: Cpu },
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* TGN Requests Chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Zap size={18} /> TGN Endpoint — Requests & Latency</div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={tgnRequestsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval={4} />
                  <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Area yAxisId="left" type="monotone" dataKey="requests" stroke="#3b82f6" fill="rgba(59,130,246,0.15)" name="Req/sec" />
                  <Line yAxisId="right" type="monotone" dataKey="p99" stroke="#f59e0b" strokeWidth={2} name="P99 (ms)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* GNN Queue Depth */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Layers size={18} /> GNN Inference Queue</div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gnnQueueDepth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval={3} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Bar dataKey="depth" fill="#8b5cf6" name="Queue Depth" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="processing" fill="#3b82f6" name="Processing" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Redis Cache Metrics */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><HardDrive size={18} /> Redis Cache Metrics</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 20 }}>
                <GaugeChart value={cacheMetrics.hitRate} max={100} label="Hit Rate" color="#10b981" unit="%" />
                <GaugeChart value={parseFloat(cacheMetrics.memoryUsed)} max={parseFloat(cacheMetrics.memoryMax)} label="Memory" color="#3b82f6" unit="GB" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Total Keys', value: cacheMetrics.totalKeys.toLocaleString() },
                  { label: 'Ops/sec', value: cacheMetrics.opsPerSec.toLocaleString() },
                  { label: 'Evictions', value: cacheMetrics.evictions },
                  { label: 'Connections', value: cacheMetrics.connections },
                  { label: 'Hit Rate', value: `${cacheMetrics.hitRate}%` },
                  { label: 'Miss Rate', value: `${cacheMetrics.missRate}%` },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PULSE PPO Metrics */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Cpu size={18} /> PULSE PPO Engine</div>
                <span className="badge badge-purple">{pulseMetrics.modelVersion}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <GaugeChart value={pulseMetrics.utilization} max={100} label="GPU Utilization" color="#8b5cf6" unit="%" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {[
                  { label: 'Training Epochs', value: pulseMetrics.trainingEpochs.toLocaleString() },
                  { label: 'Average Reward', value: pulseMetrics.reward.toFixed(3) },
                  { label: 'Exploration Rate', value: `${(pulseMetrics.explorationRate * 100).toFixed(1)}%` },
                  { label: 'Last Train', value: '26 May 18:00' },
                  { label: 'Model Version', value: pulseMetrics.modelVersion },
                  { label: 'Status', value: '🟢 Training' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 4: DATABASE */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'database' && (
        <div className="fade-in">
          {/* Stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'P50 Latency', value: '8ms', color: 'green', icon: Timer },
              { label: 'P99 Latency', value: '89ms', color: 'yellow', icon: Timer },
              { label: 'Active Connections', value: `${dbConnections.active}`, color: 'blue', icon: Globe },
              { label: 'Slow Queries (>500ms)', value: `${slowQueries.length}`, color: 'red', icon: AlertTriangle },
              { label: 'Replication Lag (max)', value: '1.8s', color: 'yellow', icon: RefreshCw },
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Query Latency Percentiles */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><BarChart3 size={18} /> Query Latency Percentiles</div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={queryLatency}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="percentile" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Latency (ms)" radius={[6, 6, 0, 0]} barSize={40}>
                    {queryLatency.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Connection Pool Gauge */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Globe size={18} /> Connection Pool</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <GaugeChart value={dbConnections.active + dbConnections.idle} max={dbConnections.poolLimit} label="Total Connections" color="#3b82f6" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { label: 'Active', value: dbConnections.active, color: '#3b82f6' },
                  { label: 'Idle', value: dbConnections.idle, color: '#10b981' },
                  { label: 'Pool Limit', value: dbConnections.poolLimit, color: 'var(--text-primary)' },
                  { label: 'Waiting', value: dbConnections.waiting, color: dbConnections.waiting > 0 ? '#ef4444' : '#10b981' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>{m.label}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slow Queries */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><Bug size={18} /> Slow Query Log (&gt;500ms)</div>
              <span className="badge badge-red">{slowQueries.length} queries</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Query</th>
                    <th>Duration</th>
                    <th>Table</th>
                    <th>Count</th>
                    <th>Last Seen</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {slowQueries.map((q, i) => (
                    <tr key={i}>
                      <td style={{ maxWidth: 400 }}>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: 'var(--bg-secondary)', padding: '6px 10px', borderRadius: 6, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                          {q.query}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: parseFloat(q.duration) > 1 ? '#ef4444' : '#f59e0b', fontSize: '0.92rem' }}>
                          {q.duration}
                        </span>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{q.table}</td>
                      <td style={{ fontWeight: 600 }}>{q.occurrences}×</td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{q.lastSeen}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                          <Eye size={10} /> Analyze
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Replication Status */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><RefreshCw size={18} /> Replication Status</div>
              <span className="badge badge-green">All replicas streaming</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '12px 20px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PRIMARY</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#10b981' }}>🐘 {replicationLag.primary}</div>
              </div>
              <ArrowRight size={20} color="var(--text-muted)" />
              <div style={{ display: 'flex', gap: 12 }}>
                {replicationLag.replicas.map((r, i) => (
                  <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', border: `1px solid ${parseFloat(r.lag) > 1 ? 'rgba(245,158,11,0.3)' : 'var(--border-color)'}` }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{r.name}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem' }}>
                      <span style={{ color: parseFloat(r.lag) > 1 ? '#f59e0b' : '#10b981' }}>Lag: {r.lag}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{r.status}</span>
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 4 }}>LSN: {r.lsn}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 5: INCIDENTS */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'incidents' && (
        <div className="fade-in">
          {/* Active Incidents */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><AlertTriangle size={18} color="#f59e0b" /> Active Incidents</div>
              <span className="badge badge-yellow">{activeIncidents.length} active</span>
            </div>
            {activeIncidents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                <CheckCircle size={40} color="#10b981" style={{ marginBottom: 12, opacity: 0.5 }} />
                <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>All systems operational. No active incidents.</div>
              </div>
            ) : (
              activeIncidents.map(inc => (
                <div key={inc.id} className="alert-card critical" style={{ borderLeftColor: '#f59e0b', marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="badge badge-red">{inc.severity}</span>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{inc.title}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {inc.service} · Started: {inc.startTime} · Duration: {inc.duration}
                      </div>
                    </div>
                    <span className="badge badge-yellow" style={{ fontSize: '0.78rem', padding: '4px 12px' }}>{inc.status}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                    <strong>Impact:</strong> {inc.impact}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                    <strong>Assignee:</strong> {inc.assignee}
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => setSelectedIncident(inc)}>
                    <Eye size={12} /> View Timeline
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Incident Timeline (for active) */}
          {activeIncidents.length > 0 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <div className="card-title"><Clock size={18} /> Incident Timeline — {activeIncidents[0].id}</div>
              </div>
              <div style={{ position: 'relative', paddingLeft: 24 }}>
                {/* Timeline line */}
                <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: 'var(--border-color)' }} />

                {incidentTimeline.map((evt, i) => {
                  const colors = {
                    alert: '#ef4444', notification: '#f59e0b', action: '#3b82f6',
                    finding: '#8b5cf6', improvement: '#10b981', status: '#64748b'
                  };
                  return (
                    <div key={i} style={{ position: 'relative', paddingLeft: 24, paddingBottom: 20 }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute', left: -17, top: 4, width: 12, height: 12,
                        borderRadius: '50%', background: colors[evt.type] || '#64748b',
                        border: '2px solid var(--bg-card)'
                      }} />
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', minWidth: 50 }}>
                          {evt.time}
                        </span>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {evt.event}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Incident History */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><FileText size={18} /> Incident History (Last 30 days)</div>
              <button className="btn btn-sm btn-secondary"><FileText size={12} /> Generate Report</button>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Severity</th>
                    <th>Title</th>
                    <th>Service</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Root Cause</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentHistory.map((inc, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{inc.id}</td>
                      <td>
                        <span className={`badge ${inc.severity === 'P1' ? 'badge-red' : inc.severity === 'P2' ? 'badge-yellow' : 'badge-blue'}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{inc.title}</td>
                      <td style={{ fontSize: '0.82rem' }}>{inc.service}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: parseInt(inc.duration) > 30 ? '#ef4444' : '#f59e0b' }}>{inc.duration}</span>
                      </td>
                      <td>
                        <span className="badge badge-green"><CheckCircle size={10} /> {inc.status}</span>
                      </td>
                      <td style={{ fontSize: '0.78rem', maxWidth: 300, color: 'var(--text-secondary)' }}>{inc.rootCause}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Auto-report template */}
            <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(59,130,246,0.08)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <FileText size={18} color="#3b82f6" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#3b82f6' }}>Auto-Report Template</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Generate a standardized post-incident report with timeline, root cause, and action items.
                </div>
              </div>
              <button className="btn btn-sm btn-primary"><FileText size={12} /> Generate PIR</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* INCIDENT DETAIL MODAL */}
      {/* ═══════════════════════════════════════════ */}
      {selectedIncident && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setSelectedIncident(null)} />
          <div style={{ position: 'relative', width: 600, maxHeight: '85vh', overflowY: 'auto', background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} color="#f59e0b" /> {selectedIncident.id} — {selectedIncident.title}
              </h3>
              <button onClick={() => setSelectedIncident(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Severity</div>
                <span className="badge badge-red" style={{ marginTop: 4 }}>{selectedIncident.severity}</span>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Duration</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>{selectedIncident.duration}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status</div>
                <span className="badge badge-yellow" style={{ marginTop: 4 }}>{selectedIncident.status}</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>IMPACT</div>
              <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{selectedIncident.impact}</div>
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>Post-Incident Timeline</div>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{ position: 'absolute', left: 5, top: 0, bottom: 0, width: 2, background: 'var(--border-color)' }} />
              {incidentTimeline.map((evt, i) => {
                const colors = {
                  alert: '#ef4444', notification: '#f59e0b', action: '#3b82f6',
                  finding: '#8b5cf6', improvement: '#10b981', status: '#64748b'
                };
                return (
                  <div key={i} style={{ position: 'relative', paddingLeft: 20, paddingBottom: 16 }}>
                    <div style={{
                      position: 'absolute', left: -15, top: 4, width: 10, height: 10,
                      borderRadius: '50%', background: colors[evt.type] || '#64748b',
                    }} />
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: colors[evt.type], fontWeight: 600 }}>{evt.time}</span>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{evt.event}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>
                <FileText size={14} /> Generate PIR Report
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedIncident(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
