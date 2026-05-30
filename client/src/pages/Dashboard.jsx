import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { coreAPI, sageAPI, adminAPI } from '../api';
import { TrendingDown, AlertTriangle, DollarSign, Activity, Users, Shield, MessageSquare, Scale } from 'lucide-react';

function CustomerDashboard() {
    const [profile, setProfile] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [sugLoading, setSugLoading] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [profileRes, alertsRes] = await Promise.all([
                    coreAPI.getProfile(),
                    coreAPI.getAlerts({ limit: 5 }),
                ]);
                setProfile(profileRes.data.data.profile);
                setAlerts(alertsRes.data.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        async function loadSuggestions() {
            try {
                const res = await sageAPI.getSuggestions();
                setSuggestions(res.data.data.suggestions || []);
            } catch (e) { console.error(e); }
            finally { setSugLoading(false); }
        }
        load();
        loadSuggestions();
    }, []);

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;

    const stressColor = {
        LOW: 'green', MODERATE: 'yellow', HIGH: 'red', CRITICAL: 'red'
    }[profile?.stressLevel] || 'blue';

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>Welcome back 👋</h2>
                <p>Here's your financial health overview</p>
            </div>

            <div className="stat-grid">
                <div className={`stat-card ${stressColor}`}>
                    <div className={`stat-icon ${stressColor}`}><Activity size={22} /></div>
                    <div className="stat-value">{profile?.stressLevel || 'N/A'}</div>
                    <div className="stat-label">Financial Stress Level</div>
                </div>
                <div className="stat-card blue">
                    <div className="stat-icon blue"><DollarSign size={22} /></div>
                    <div className="stat-value">₹{(profile?.currentBalance || 0).toLocaleString()}</div>
                    <div className="stat-label">Current Balance</div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon green"><TrendingDown size={22} /></div>
                    <div className="stat-value">₹{(profile?.monthlyIncome || 0).toLocaleString()}</div>
                    <div className="stat-label">Monthly Income</div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon purple"><AlertTriangle size={22} /></div>
                    <div className="stat-value">{alerts.length}</div>
                    <div className="stat-label">Active Alerts</div>
                </div>
            </div>

            {/* Risk Score Bar */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <div className="card-title"><Activity size={18} /> Financial Risk Score</div>
                    <span className={`badge badge-${stressColor}`}>{((profile?.riskScore || 0) * 100).toFixed(0)}%</span>
                </div>
                <div style={{ background: 'var(--bg-input)', borderRadius: 100, height: 12, overflow: 'hidden' }}>
                    <div style={{
                        width: `${(profile?.riskScore || 0) * 100}%`,
                        height: '100%',
                        background: stressColor === 'green' ? 'var(--accent-green)' : stressColor === 'yellow' ? 'var(--accent-yellow)' : 'var(--accent-red)',
                        borderRadius: 100,
                        transition: 'width 1s ease',
                    }} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    {profile?.riskScore < 0.3 ? 'Your finances look healthy! Keep it up.' :
                        profile?.riskScore < 0.6 ? 'Some patterns need attention. Check your alerts.' :
                            'Your financial stress is elevated. We recommend reviewing the alerts below.'}
                </p>
            </div>

            {/* Smart Suggestions Box */}
            <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--accent-cyan)' }}>
                <div className="card-header">
                    <div className="card-title">🧠 Smart Suggestions</div>
                    <span className="badge badge-blue">AI Powered</span>
                </div>
                {sugLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
                        <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analyzing your financial data...</span>
                    </div>
                ) : suggestions.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No suggestions available right now.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {suggestions.map((s, i) => {
                            const priorityConfig = {
                                urgent: { color: 'var(--accent-red)', bg: 'var(--accent-red-soft)', dot: '🔴' },
                                important: { color: 'var(--accent-yellow)', bg: 'var(--accent-yellow-soft)', dot: '🟡' },
                                good: { color: 'var(--accent-green)', bg: 'var(--accent-green-soft)', dot: '🟢' },
                            };
                            const pc = priorityConfig[s.priority] || priorityConfig.good;
                            return (
                                <div key={i} style={{ padding: '14px 18px', background: pc.bg, borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${pc.color}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span>{pc.dot}</span>
                                        <strong style={{ fontSize: '0.9rem' }}>{s.title}</strong>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginLeft: 24 }}>{s.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Recent Alerts */}
            <div className="card">
                <div className="card-header">
                    <div className="card-title"><AlertTriangle size={18} /> Recent Alerts</div>
                </div>
                {alerts.length === 0 ? (
                    <div className="empty-state">
                        <AlertTriangle size={40} />
                        <h3>No alerts</h3>
                        <p>You're doing great! No financial stress detected.</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className={`alert-card ${alert.severity.toLowerCase()}`}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span className={`badge badge-${alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'red' : 'yellow'}`}>
                                    {alert.severity}
                                </span>
                                <span className={`badge badge-${alert.status === 'OPEN' ? 'blue' : 'green'}`}>{alert.status}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', marginTop: 8 }}>{alert.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [statsRes, auditRes] = await Promise.all([
                    adminAPI.getStats(),
                    adminAPI.getAuditLogs({ page: 1, limit: 4 }),
                ]);
                setStats(statsRes.data.data);
                setAuditLogs(auditRes.data.data || []);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        load();
    }, []);

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;

    const shieldScore = stats?.shield?.avgStressScore || 0;
    const isBurnout = shieldScore >= 7;
    const isWarning = shieldScore >= 5 && shieldScore < 7;

    const stressStatus = isBurnout 
        ? { label: 'CRITICAL / BURNOUT WARNING', color: 'var(--accent-red)', bg: 'var(--accent-red-soft)' }
        : isWarning 
            ? { label: 'MODERATE STRESS', color: 'var(--accent-yellow)', bg: 'var(--accent-yellow-soft)' }
            : { label: 'HEALTHY WELL-BEING', color: 'var(--accent-green)', bg: 'var(--accent-green-soft)' };

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>System & Staff Cockpit ⚙️</h2>
                <p>Real-time platform overview and team well-being telemetry</p>
            </div>

            <div className="stat-grid">
                <div className="stat-card blue">
                    <div className="stat-icon blue"><Users size={22} /></div>
                    <div className="stat-value">{stats?.users?.total || 0}</div>
                    <div className="stat-label">Total Users</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        🧑‍💼 {stats?.users?.customers || 0} clients · 👔 {stats?.users?.employees || 0} staff
                    </div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon red"><AlertTriangle size={22} /></div>
                    <div className="stat-value">{stats?.alerts?.open || 0}</div>
                    <div className="stat-label">Open Alerts</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        🚨 Needs immediate relationship outreach
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon green"><MessageSquare size={22} /></div>
                    <div className="stat-value">{stats?.sage?.totalConversations || 0}</div>
                    <div className="stat-label">SAGE Chat Runs</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        🎓 AI helpfulness rate: {((stats?.sage?.helpfulRate || 0) * 100).toFixed(0)}%
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon purple"><Scale size={22} /></div>
                    <div className="stat-value">{stats?.truth?.totalComparisons || 0}</div>
                    <div className="stat-label">TRUTH Product Audits</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 8 }}>
                        ⚖️ Caution/Avoid rate: {((stats?.truth?.cautionRate || 0) * 100).toFixed(0)}%
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                {/* Consensual SHIELD Well-being Card */}
                <div className="card" style={{ borderLeft: `4px solid ${stressStatus.color}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div className="card-header" style={{ marginBottom: 16 }}>
                            <div className="card-title"><Shield size={18} /> 🛡️ SHIELD Team Well-being Monitor</div>
                            <span className="badge badge-purple" style={{ textTransform: 'none' }}>Audited & Anonymous</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                            Anonymized emotional weight monitoring of bank support staff to prevent systemic burnout.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 12, marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stressStatus.color, textAlign: 'center' }}>
                                    {shieldScore}
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/10</span>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center', marginTop: 2, fontWeight: 600 }}>Avg Stress</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                                    <span>{stressStatus.label}</span>
                                    <span>{shieldScore > 0 ? `${(shieldScore * 10).toFixed(0)}%` : '0%'}</span>
                                </div>
                                <div style={{ background: 'var(--bg-input)', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                                    <div style={{ width: `${shieldScore * 10}%`, height: '100%', background: stressStatus.color, borderRadius: 10, transition: 'width 1s ease' }} />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                            <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 10, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 2 }}>👥 Active Peer Connections</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-purple)' }}>{stats?.shield?.peerSupportRequests || 0}</div>
                            </div>
                            <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 10, textAlign: 'center' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 2 }}>📝 Participation Rate</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)' }}>94%</div>
                            </div>
                        </div>
                    </div>

                    {isBurnout && (
                        <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px dashed var(--accent-red)', borderRadius: 10, padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--accent-red)', lineHeight: 1.4, margin: 0 }}>
                                <strong>Burnout Threshold Exceeded:</strong> Average team stress is elevated. We strongly recommend reducing support case assignment queues and issuing a peer-support reminder circular.
                            </p>
                        </div>
                    )}
                </div>

                {/* Live Operations Feed (Audit Logs Preview) */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div className="card-header" style={{ marginBottom: 16 }}>
                            <div className="card-title"><Activity size={18} /> 📡 Live Platform Audit Trail</div>
                            <span className="badge badge-blue">Real-Time</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                            Recent administrative actions and automated interventions across the TrustEdge system.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {auditLogs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                    No operations recorded yet.
                                </div>
                            ) : (
                                auditLogs.map((log) => (
                                    <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 10, fontSize: '0.78rem' }}>
                                        <div>
                                            <span className="badge badge-blue" style={{ padding: '2px 6px', fontSize: '0.62rem', marginRight: 8 }}>{log.action}</span>
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{log.user?.name || 'System'}</span>
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: 12 }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Full audit history is accessible in the <strong style={{ color: 'var(--accent-blue)' }}>Platform Governance</strong> center.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();

    if (user?.role === 'ADMIN') return <AdminDashboard />;
    return <CustomerDashboard />;
}
