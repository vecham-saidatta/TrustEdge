import { useState, useEffect } from 'react';
import { adminAPI } from '../api';
import { Shield, Users, FileText, CheckCircle, AlertTriangle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminGovernancePage() {
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    // User Registry state
    const [users, setUsers] = useState([]);
    const [userFilter, setUserFilter] = useState('');
    const [userPage, setUserPage] = useState(1);
    const [userPagination, setUserPagination] = useState({});

    // Audit Logs state
    const [logs, setLogs] = useState([]);
    const [logPage, setLogPage] = useState(1);
    const [logPagination, setLogPagination] = useState({});

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 3500); };

    const loadUsers = async () => {
        setLoading(true);
        try {
            const params = { page: userPage, limit: 15 };
            if (userFilter) params.role = userFilter;
            const res = await adminAPI.getUsers(params);
            setUsers(res.data.data.users || []);
            setUserPagination(res.data.data.pagination || {});
        } catch (e) {
            console.error('Error loading users:', e);
            showToast('❌ Failed to sync User registry');
        } finally {
            setLoading(false);
        }
    };

    const loadLogs = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.getAuditLogs({ page: logPage, limit: 20 });
            setLogs(res.data.data || []);
            setLogPagination(res.data.pagination || {});
        } catch (e) {
            console.error('Error loading audit logs:', e);
            showToast('❌ Failed to sync compliance logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'users') {
            loadUsers();
        } else {
            loadLogs();
        }
    }, [activeTab, userFilter, userPage, logPage]);

    const handleToggleActive = async (id, name, currentStatus) => {
        try {
            await adminAPI.updateUser(id, { isActive: !currentStatus });
            showToast(`✅ Account for ${name} ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
            loadUsers();
        } catch (e) {
            showToast('❌ ' + (e.response?.data?.message || 'Update failed'));
        }
    };

    return (
        <div className="fade-in">
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2>🛡️ Platform Governance & Compliance</h2>
                    <p>Administrative system security, staff identity registry, and compliance audit trail</p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={activeTab === 'users' ? loadUsers : loadLogs}>
                    <RefreshCw size={14} /> Refresh Workspace
                </button>
            </div>

            {/* Tab Swapper */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-color)', marginBottom: 24, paddingBottom: 2 }}>
                {[
                    { key: 'users', label: 'User Identity Registry', icon: Users },
                    { key: 'logs', label: 'Compliance Audit Trail', icon: FileText },
                ].map(t => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.key;
                    return (
                        <button key={t.key} className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab(t.key)}
                            style={{
                                borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                                borderBottom: isActive ? '2px solid var(--accent-blue)' : 'none',
                                background: isActive ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))' : 'transparent',
                                borderColor: isActive ? 'var(--accent-blue)' : 'transparent',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)'
                            }}>
                            <Icon size={14} /> {t.label}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENTS */}

            {/* TAB 1: USER IDENTITY REGISTRY */}
            {activeTab === 'users' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        {['', 'CUSTOMER', 'ADMIN'].map(r => (
                            <button key={r} className={`btn btn-sm ${userFilter === r ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => { setUserFilter(r); setUserPage(1); }}>
                                {r || 'All Roles'}
                            </button>
                        ))}
                    </div>

                    <div className="card">
                        {loading && users.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div>
                        ) : users.length === 0 ? (
                            <div className="empty-state"><Users size={36} /><p>No users registered under this role.</p></div>
                        ) : (
                            <>
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Email Address</th>
                                                <th>System Role</th>
                                                <th>Status</th>
                                                <th>Date Joined</th>
                                                <th style={{ textAlign: 'right' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id}>
                                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <span className={`badge badge-${u.role === 'ADMIN' ? 'purple' : 'green'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge badge-${u.isActive ? 'green' : 'red'}`}>
                                                            {u.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                                    <td style={{ textAlign: 'right' }}>
                                                        <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`}
                                                            onClick={() => handleToggleActive(u.id, u.name, u.isActive)}
                                                            style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                                                            {u.isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination controls */}
                                {userPagination.totalPages > 1 && (
                                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
                                        <button className="btn btn-secondary btn-sm" disabled={userPage <= 1} onClick={() => setUserPage(userPage - 1)}>
                                            <ChevronLeft size={14} /> Prev
                                        </button>
                                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Page {userPage} of {userPagination.totalPages}</span>
                                        <button className="btn btn-secondary btn-sm" disabled={userPage >= userPagination.totalPages} onClick={() => setUserPage(userPage + 1)}>
                                            Next <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: COMPLIANCE AUDIT TRAIL */}
            {activeTab === 'logs' && (
                <div className="fade-in">
                    <div className="card">
                        {loading && logs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" /></div>
                        ) : logs.length === 0 ? (
                            <div className="empty-state"><FileText size={36} /><p>No audit trail logs compiled.</p></div>
                        ) : (
                            <>
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Timestamp</th>
                                                <th>Audited Actor</th>
                                                <th>Action</th>
                                                <th>Entity Model</th>
                                                <th>IP Address</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map(log => (
                                                <tr key={log.id}>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                                                    <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{log.user?.name || 'Automated System'}</td>
                                                    <td>
                                                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td>{log.entityType || '—'}</td>
                                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ipAddress || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination controls */}
                                {logPagination.totalPages > 1 && (
                                    <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 }}>
                                        <button className="btn btn-secondary btn-sm" disabled={logPage <= 1} onClick={() => setLogPage(logPage - 1)}>
                                            <ChevronLeft size={14} /> Prev
                                        </button>
                                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Page {logPage} of {logPagination.totalPages}</span>
                                        <button className="btn btn-secondary btn-sm" disabled={logPage >= logPagination.totalPages} onClick={() => setLogPage(logPage + 1)}>
                                            Next <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Toast feedback */}
            {toast && (
                <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 20px', fontSize: '0.85rem', fontWeight: 600, boxShadow: 'var(--shadow-lg)', zIndex: 3000, animation: 'fadeInUp 0.3s ease' }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
