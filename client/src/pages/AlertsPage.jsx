import { useState, useEffect } from 'react';
import { coreAPI } from '../api';
import { useAuth } from '../AuthContext';
import { AlertTriangle, CheckCircle, Clock, XCircle, Eye, ShieldCheck, Ban } from 'lucide-react';

export default function AlertsPage() {
    const { user } = useAuth();
    const [allAlerts, setAllAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        setLoading(true);
        try {
            const res = await coreAPI.getAlerts({ limit: 100 });
            setAllAlerts(res.data.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            await coreAPI.updateAlert(id, { status });
            loadAlerts();
        } catch (e) { console.error(e); }
    };

    // Filter alerts based on active tab
    const filteredAlerts = activeTab === 'ALL'
        ? allAlerts
        : allAlerts.filter(a => a.status === activeTab);

    // Count per status
    const counts = {
        ALL: allAlerts.length,
        OPEN: allAlerts.filter(a => a.status === 'OPEN').length,
        ACKNOWLEDGED: allAlerts.filter(a => a.status === 'ACKNOWLEDGED').length,
        RESOLVED: allAlerts.filter(a => a.status === 'RESOLVED').length,
        DISMISSED: allAlerts.filter(a => a.status === 'DISMISSED').length,
    };

    const tabs = [
        { key: 'ALL', label: 'All', icon: <Eye size={14} />, color: 'blue' },
        { key: 'OPEN', label: 'Open', icon: <AlertTriangle size={14} />, color: 'red' },
        { key: 'ACKNOWLEDGED', label: 'Acknowledged', icon: <Clock size={14} />, color: 'yellow' },
        { key: 'RESOLVED', label: 'Resolved', icon: <ShieldCheck size={14} />, color: 'green' },
        { key: 'DISMISSED', label: 'Dismissed', icon: <Ban size={14} />, color: 'purple' },
    ];

    const severityIcon = {
        CRITICAL: <XCircle size={16} color="var(--accent-red)" />,
        HIGH: <AlertTriangle size={16} color="#f97316" />,
        MODERATE: <Clock size={16} color="var(--accent-yellow)" />,
        LOW: <CheckCircle size={16} color="var(--accent-green)" />,
    };

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>🚨 Stress Alerts</h2>
                <p>{user?.role === 'CUSTOMER' ? 'Financial stress patterns detected in your account' : 'Customer alerts requiring attention'}</p>
            </div>

            {/* Interactive Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: 6,
                marginBottom: 24,
                padding: 4,
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
            }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: '10px 14px',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '0.8rem',
                            fontWeight: activeTab === tab.key ? 700 : 500,
                            transition: 'all 0.25s ease',
                            background: activeTab === tab.key
                                ? `var(--accent-${tab.color})`
                                : 'transparent',
                            color: activeTab === tab.key
                                ? 'white'
                                : 'var(--text-secondary)',
                            boxShadow: activeTab === tab.key
                                ? `0 2px 12px rgba(59, 130, 246, 0.3)`
                                : 'none',
                            transform: activeTab === tab.key ? 'scale(1.02)' : 'scale(1)',
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                        <span style={{
                            background: activeTab === tab.key
                                ? 'rgba(255,255,255,0.25)'
                                : 'var(--bg-card)',
                            padding: '2px 7px',
                            borderRadius: 100,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            minWidth: 20,
                            textAlign: 'center',
                        }}>
                            {counts[tab.key]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            {filteredAlerts.length === 0 ? (
                <div className="empty-state" style={{ paddingTop: 80 }}>
                    <CheckCircle size={48} />
                    <h3>No {activeTab !== 'ALL' ? activeTab.toLowerCase() : ''} alerts found</h3>
                    <p>{activeTab === 'ALL' ? 'Everything looks clear!' : `No alerts with status "${activeTab}"`}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredAlerts.map((alert, index) => (
                        <div
                            key={alert.id}
                            className={`alert-card ${alert.severity.toLowerCase()}`}
                            style={{
                                animation: `fadeIn 0.3s ease ${index * 0.05}s both`,
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    {severityIcon[alert.severity]}
                                    <span className={`badge badge-${alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'red' : 'yellow'}`}>
                                        {alert.alertType?.replace('_', ' ')}
                                    </span>
                                    <span className={`badge badge-${alert.status === 'OPEN' ? 'blue' : alert.status === 'RESOLVED' ? 'green' : 'purple'}`}>
                                        {alert.status}
                                    </span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                    {new Date(alert.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <p style={{ fontSize: '0.9rem', marginBottom: 8, lineHeight: 1.6 }}>{alert.message}</p>

                            {alert.customer && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Customer: <strong>{alert.customer.name}</strong> ({alert.customer.email})
                                </p>
                            )}

                            {/* Action buttons for Admin */}
                            {(user?.role === 'ADMIN') && alert.status === 'OPEN' && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(alert.id, 'ACKNOWLEDGED')}>
                                        <Clock size={14} /> Acknowledge
                                    </button>
                                    <button className="btn btn-sm btn-primary" onClick={() => updateStatus(alert.id, 'RESOLVED')}>
                                        <ShieldCheck size={14} /> Resolve
                                    </button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(alert.id, 'DISMISSED')}>
                                        <Ban size={14} /> Dismiss
                                    </button>
                                </div>
                            )}
                            {(user?.role === 'ADMIN') && alert.status === 'ACKNOWLEDGED' && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    <button className="btn btn-sm btn-primary" onClick={() => updateStatus(alert.id, 'RESOLVED')}>
                                        <ShieldCheck size={14} /> Resolve
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
