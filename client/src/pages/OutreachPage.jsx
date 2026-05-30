import { useState, useEffect } from 'react';
import { outreachAPI, retentionAPI } from '../api';
import { Megaphone, Plus, Play, Pause, Eye, Zap, BarChart3, Send, X, Gift } from 'lucide-react';

const CHANNELS = ['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'INAPP', 'RM_CALL', 'BRANCH'];
const CH_ICONS = { EMAIL: '📧', SMS: '📱', WHATSAPP: '💬', PUSH: '🔔', INAPP: '📲', RM_CALL: '📞', BRANCH: '🏦' };
const STATUS_COLORS = { DRAFT: '#64748b', ACTIVE: '#10b981', PAUSED: '#f59e0b', COMPLETED: '#3b82f6' };
const HEALTH_COLORS = { THRIVING: 'green', HEALTHY: 'blue', NEEDS_ATTENTION: 'yellow', AT_RISK: 'red', CRITICAL: 'red' };
const STAGE_COLORS = { NEW: 'blue', GROWTH: 'green', STABLE: 'purple', DORMANT: 'yellow', AT_RISK: 'red', PREMIUM_RECOVERY: 'purple' };

// ═══════════════════════════════════════════
// HELPER COMPONENTS & MODALS
// ═══════════════════════════════════════════

function StatCard({ label, value, color, icon }) {
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '16px 20px', flex: 1, minWidth: 150 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
        </div>
    );
}

function CampaignCard({ c, onView, onActivate, onPause, onTrigger }) {
    const sc = STATUS_COLORS[c.status] || '#64748b';
    const enabledCh = c.channelConfigs?.filter(ch => ch.enabled) || [];
    return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 20, transition: 'all 0.2s', cursor: 'pointer' }}
            onClick={() => onView(c.id)}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{c.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 280 }}>{c.description || 'No description'}</p>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: `${sc}18`, color: sc }}>{c.status}</span>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                {enabledCh.map(ch => (
                    <span key={ch.channel} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {CH_ICONS[ch.channel]} {ch.channel.replace('_', ' ')}
                    </span>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {c.variants?.length || 0} variants · {c._count?.executionLogs || 0} sent
                </div>
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    {c.status === 'DRAFT' && <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '4px 10px' }} onClick={() => onActivate(c.id)}><Play size={12} /> Activate</button>}
                    {c.status === 'ACTIVE' && <button className="btn btn-secondary" style={{ fontSize: '0.72rem', padding: '4px 10px' }} onClick={() => onPause(c.id)}><Pause size={12} /> Pause</button>}
                    {(c.status === 'ACTIVE' || c.status === 'PAUSED') && <button className="btn btn-primary" style={{ fontSize: '0.72rem', padding: '4px 10px' }} onClick={() => onTrigger(c.id)}><Zap size={12} /> Run</button>}
                </div>
            </div>
        </div>
    );
}

function CreateCampaignModal({ onClose, onCreated, segments }) {
    const [form, setForm] = useState({
        name: '', description: '', startDate: '', endDate: '', segmentId: '',
        variants: [{ label: 'Variant A', offerJson: '{"headline":"Special Offer","discount":"10%"}', weight: 50 }, { label: 'Variant B', offerJson: '{"headline":"Premium Deal","cashback":"5%"}', weight: 50 }],
        channels: CHANNELS.map(ch => ({ channel: ch, enabled: ['EMAIL', 'SMS', 'PUSH'].includes(ch), templateBody: '' }))
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const updateVariant = (i, k, v) => {
        const vs = [...form.variants];
        vs[i] = { ...vs[i], [k]: v };
        setForm(f => ({ ...f, variants: vs }));
    };

    const toggleChannel = (i) => {
        const chs = [...form.channels];
        chs[i] = { ...chs[i], enabled: !chs[i].enabled };
        setForm(f => ({ ...f, channels: chs }));
    };

    const submit = async () => {
        if (!form.name || !form.startDate || !form.endDate) { setError('Name, start & end dates required'); return; }
        setSaving(true); setError('');
        try {
            await outreachAPI.createCampaign({ ...form, channels: form.channels.filter(c => c.enabled) });
            onCreated();
        } catch (e) {
            setError(e.response?.data?.message || 'Failed to create campaign');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
            <div style={{ position: 'relative', width: 620, maxHeight: '85vh', overflowY: 'auto', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>🚀 Create Early Stress Campaign</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                {error && <div style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)', padding: '8px 12px', borderRadius: 8, fontSize: '0.82rem', marginBottom: 16 }}>{error}</div>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div><label style={lbl}>Campaign Name *</label><input style={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Proactive Fee Waiver Intervention" /></div>
                    <div><label style={lbl}>Description</label><textarea style={{ ...inp, minHeight: 50 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief intervention goal" /></div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}><label style={lbl}>Start Date *</label><input type="date" style={inp} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                        <div style={{ flex: 1 }}><label style={lbl}>End Date *</label><input type="date" style={inp} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
                    </div>
                    <div>
                        <label style={lbl}>Audience Segment</label>
                        <select style={inp} value={form.segmentId} onChange={e => setForm(f => ({ ...f, segmentId: e.target.value }))}>
                            <option value="">All Clients</option>
                            {segments.map(s => <option key={s.id} value={s.id}>{s.name} ({s.customerCount} matches)</option>)}
                        </select>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                        <label style={{ ...lbl, marginBottom: 10, display: 'block' }}>A/B Split Test Variants</label>
                        {form.variants.map((v, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                <input style={{ ...inp, flex: 1 }} value={v.label} onChange={e => updateVariant(i, 'label', e.target.value)} placeholder="Label" />
                                <input style={{ ...inp, width: 60, textAlign: 'center' }} type="number" value={v.weight} onChange={e => updateVariant(i, 'weight', parseInt(e.target.value) || 0)} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>% weight</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                        <label style={{ ...lbl, marginBottom: 10, display: 'block' }}>Intervention Channels</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {form.channels.map((ch, i) => (
                                <button key={ch.channel} onClick={() => toggleChannel(i)}
                                    style={{
                                        padding: '6px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', fontFamily: 'inherit',
                                        background: ch.enabled ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)',
                                        borderColor: ch.enabled ? '#3b82f6' : 'var(--border-color)',
                                        color: ch.enabled ? '#3b82f6' : 'var(--text-muted)'
                                    }}>
                                    {CH_ICONS[ch.channel]} {ch.channel.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={submit} disabled={saving}>{saving ? 'Creating...' : '🚀 Launch Campaign'}</button>
                </div>
            </div>
        </div>
    );
}

const lbl = { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' };
const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' };

function DetailModal({ id, onClose }) {
    const [campaign, setCampaign] = useState(null);
    const [tab, setTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        outreachAPI.getCampaign(id).then(r => setCampaign(r.data.data)).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    const TABS = ['overview', 'variants', 'channels', 'ab_results', 'logs'];

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
            <div style={{ position: 'relative', width: 680, maxHeight: '85vh', overflowY: 'auto', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{loading ? 'Compiling data...' : campaign?.name}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                {loading ? <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Synching with gateway...</div> : campaign && <>
                    <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border-color)' }}>
                        {TABS.map(t => (
                            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? '#3b82f6' : 'transparent'}`, color: tab === t ? '#3b82f6' : 'var(--text-muted)', fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: tab === t ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize' }}>
                                {t.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {tab === 'overview' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Row l="Status" v={campaign.status} color={STATUS_COLORS[campaign.status]} />
                            <Row l="Description" v={campaign.description || '—'} />
                            <Row l="Campaign Start" v={new Date(campaign.startDate).toLocaleDateString('en-IN')} />
                            <Row l="Campaign End" v={new Date(campaign.endDate).toLocaleDateString('en-IN')} />
                            <Row l="Target Audience" v={campaign.segment?.name || 'All Clients'} />
                            <Row l="Dispatches Completed" v={campaign.executionLogs?.length || 0} />
                        </div>
                    )}

                    {tab === 'variants' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {campaign.variants?.map(v => (
                                <div key={v.id} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{v.label}</span>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3b82f6' }}>Split: {v.weight}%</span>
                                    </div>
                                    <pre style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', margin: 0 }}>{v.offerJson}</pre>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'channels' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {campaign.channelConfigs?.map(ch => (
                                <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px' }}>
                                    <span style={{ fontSize: '0.88rem' }}>{CH_ICONS[ch.channel] || '📡'} {ch.channel.replace('_', ' ')}</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ch.enabled ? '#10b981' : '#ef4444' }}>{ch.enabled ? '✓ Enabled' : '✗ Disabled'}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'ab_results' && (
                        <div>
                            {(!campaign.abTestResults || campaign.abTestResults.length === 0) ? (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No A/B telemetry collected. Run campaign once.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {campaign.abTestResults.map(r => {
                                        const maxImp = Math.max(...campaign.abTestResults.map(x => x.impressions), 1);
                                        return (
                                            <div key={r.id} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <span style={{ fontWeight: 700 }}>{r.variant?.label}</span>
                                                    <span style={{ fontWeight: 800, color: '#10b981' }}>{(r.conversionRate * 100).toFixed(1)}% Conversion Rate</span>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                                                    <span>📨 {r.impressions} sent</span>
                                                    <span>✅ {r.delivered} delivered</span>
                                                    <span>👁 {r.opened} opened</span>
                                                    <span>🎯 {r.conversions} conversions</span>
                                                </div>
                                                <div style={{ background: 'var(--bg-input)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                                                    <div style={{ width: `${(r.impressions / maxImp) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#3b82f6,#10b981)', borderRadius: 6 }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'logs' && (
                        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                            {(!campaign.executionLogs || campaign.executionLogs.length === 0) ? (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No logs compiled.</div>
                            ) : (
                                <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            {['Channel', 'Intervention Status', 'Sent Timestamp'].map(h => <th key={h} style={{ padding: '8px 6px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaign.executionLogs.map(log => (
                                            <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '8px 6px' }}>{CH_ICONS[log.channel] || '📡'} {log.channel}</td>
                                                <td style={{ padding: '8px 6px' }}>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: log.status === 'CONVERTED' ? 'rgba(16,185,129,0.15)' : log.status === 'FAILED' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)', color: log.status === 'CONVERTED' ? '#10b981' : log.status === 'FAILED' ? '#ef4444' : '#3b82f6' }}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '8px 6px', color: 'var(--text-muted)' }}>{log.sentAt ? new Date(log.sentAt).toLocaleString('en-IN') : 'Pending'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </>}
            </div>
        </div>
    );
}

function Row({ l, v, color }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: color || 'var(--text-primary)' }}>{v}</span>
        </div>
    );
}

// ═══════════════════════════════════════════
// MAIN WORKSPACE
// ═══════════════════════════════════════════

export default function OutreachPage() {
    const [activeTab, setActiveTab] = useState('campaigns');
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState(null);
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateCampaign, setShowCreateCampaign] = useState(false);
    const [viewId, setViewId] = useState(null);
    const [filter, setFilter] = useState('');
    const [toast, setToast] = useState('');

    // Offer Library state
    const [offerTemplates, setOfferTemplates] = useState([]);
    const [showCreateTemplate, setShowCreateTemplate] = useState(false);
    const [templateForm, setTemplateForm] = useState({ name: '', category: 'FEE_WAIVER', tier: 'STANDARD', description: '', whyShown: '', problemSolved: '', customerGain: '', validityDays: 30, cooldownDays: 30, maxPerCustomer: 1, requiresApproval: false });

    // Active Issued Offers State
    const [issuedOffers, setIssuedOffers] = useState([]);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

    const loadAllOutreach = async () => {
        try {
            const [cRes, sRes, segRes, libraryRes, issuedRes] = await Promise.all([
                outreachAPI.getCampaigns(filter ? { status: filter } : {}),
                outreachAPI.getStats(),
                outreachAPI.getSegments(),
                retentionAPI.getOfferLibrary(),
                retentionAPI.getRetentionOffers()
            ]);
            setCampaigns(cRes.data.data || []);
            setStats(sRes.data.data);
            setSegments(segRes.data.data || []);
            setOfferTemplates(libraryRes.data.data || []);
            setIssuedOffers(issuedRes.data.data || []);
        } catch (e) {
            console.error('Error fetching outreach data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllOutreach();
    }, [filter]);

    const handleActivate = async (id) => {
        try { await outreachAPI.activateCampaign(id); showToast('✅ Campaign activated successfully!'); loadAllOutreach(); }
        catch (e) { showToast('❌ ' + (e.response?.data?.message || 'Activation Failed')); }
    };

    const handlePause = async (id) => {
        try { await outreachAPI.pauseCampaign(id); showToast('⏸ Campaign paused'); loadAllOutreach(); }
        catch (e) { showToast('❌ ' + (e.response?.data?.message || 'Failed to pause')); }
    };

    const handleTrigger = async (id) => {
        try {
            const r = await outreachAPI.triggerCampaign(id);
            const d = r.data.data;
            showToast(`🚀 Dispatched ${d.sent} alerts (${d.delivered} delivered successfully)`);
            loadAllOutreach();
        } catch (e) { showToast('❌ ' + (e.response?.data?.message || 'Execution Failed')); }
    };

    const handleCreateTemplate = async () => {
        try {
            await retentionAPI.createOfferTemplate(templateForm);
            showToast('✅ Retention Offer template created!');
            setShowCreateTemplate(false);
            setTemplateForm({ name: '', category: 'FEE_WAIVER', tier: 'STANDARD', description: '', whyShown: '', problemSolved: '', customerGain: '', validityDays: 30, cooldownDays: 30, maxPerCustomer: 1, requiresApproval: false });
            loadAllOutreach();
        } catch (e) {
            showToast('❌ ' + (e.response?.data?.message || 'Template Creation Failed'));
        }
    };

    if (loading && campaigns.length === 0) return <div className="loading-page"><div className="spinner" /></div>;

    const CATEGORIES = ['FEE_WAIVER', 'RATE_ADJUSTMENT', 'REWARD_BOOST', 'SERVICE_RECOVERY', 'BUNDLE_UPGRADE', 'REACTIVATION_PROMPT'];
    const TIERS = ['LOW_COST', 'STANDARD', 'PREMIUM', 'EMERGENCY'];

    return (
        <div className="fade-in">
            {/* Header section */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2>📡 Outreach & Incentives Control</h2>
                    <p>Early-intervention proactive dispatches, A/B variant split, and the approved Offer templates registry</p>
                </div>
                {activeTab === 'campaigns' ? (
                    <button className="btn btn-primary" onClick={() => setShowCreateCampaign(true)}>
                        <Plus size={16} /> New Campaign
                    </button>
                ) : activeTab === 'library' ? (
                    <button className="btn btn-primary" onClick={() => setShowCreateTemplate(!showCreateTemplate)}>
                        <Plus size={16} /> {showCreateTemplate ? 'Cancel' : 'New Offer Template'}
                    </button>
                ) : null}
            </div>

            {/* Stats section */}
            {stats && activeTab === 'campaigns' && (
                <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                    <StatCard label="Dispatched Campaigns" value={stats.totalCampaigns} color="#3b82f6" icon="📊" />
                    <StatCard label="Active Campaigns" value={stats.activeCampaigns} color="#10b981" icon="▶️" />
                    <StatCard label="Total Interventions Sent" value={stats.totalSent} color="#8b5cf6" icon="📨" />
                    <StatCard label="Gateway Delivery Rate" value={`${stats.deliveryRate}%`} color="#f59e0b" icon="✅" />
                    <StatCard label="Intervention CVR" value={`${stats.conversionRate}%`} color="#10b981" icon="🎯" />
                </div>
            )}

            {/* Tab switcher */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-color)', marginBottom: 24, paddingBottom: 2 }}>
                {[
                    { key: 'campaigns', label: 'Outreach Campaigns', icon: Megaphone },
                    { key: 'library', label: 'Offer Templates Library', icon: Gift },
                    { key: 'issued', label: 'Active Issued Offers', icon: Zap },
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

            {/* TAB PANELS */}

            {/* TAB 1: CAMPAIGNS */}
            {activeTab === 'campaigns' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                        {['', 'DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'].map(s => (
                            <button key={s} onClick={() => setFilter(s)}
                                style={{
                                    padding: '6px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', fontFamily: 'inherit',
                                    background: filter === s ? 'rgba(59,130,246,0.15)' : 'var(--bg-secondary)',
                                    borderColor: filter === s ? '#3b82f6' : 'var(--border-color)',
                                    color: filter === s ? '#3b82f6' : 'var(--text-muted)'
                                }}>
                                {s || 'All Statuses'}
                            </button>
                        ))}
                    </div>

                    {campaigns.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                            <Megaphone size={40} color="var(--text-muted)" style={{ marginBottom: 16 }} />
                            <h3 style={{ color: 'var(--text-muted)', marginBottom: 8 }}>No dispatches match the filters</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Create an early-intervention campaign to begin.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
                            {campaigns.map(c => (
                                <CampaignCard key={c.id} c={c} onView={setViewId} onActivate={handleActivate} onPause={handlePause} onTrigger={handleTrigger} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: OFFER LIBRARY */}
            {activeTab === 'library' && (
                <div className="fade-in">
                    {showCreateTemplate && (
                        <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--accent-green)' }}>
                            <div className="card-header"><div className="card-title">Approved Retention Incentive Template</div></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div className="form-group"><label className="form-label">Template Name</label><input className="form-input" value={templateForm.name} onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })} placeholder="e.g. Rate Boost — Savings Gold" /></div>
                                <div className="form-group"><label className="form-label">Category</label><select className="form-input" value={templateForm.category} onChange={e => setTemplateForm({ ...templateForm, category: e.target.value })}>{CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}</select></div>
                                <div className="form-group"><label className="form-label">Cost Tier</label><select className="form-input" value={templateForm.tier} onChange={e => setTemplateForm({ ...templateForm, tier: e.target.value })}>{TIERS.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}</select></div>
                                <div className="form-group"><label className="form-label">Validity (Days)</label><input className="form-input" type="number" value={templateForm.validityDays} onChange={e => setTemplateForm({ ...templateForm, validityDays: +e.target.value })} /></div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Customer-facing explanation ("Why am I seeing this?")</label><input className="form-input" value={templateForm.whyShown} onChange={e => setTemplateForm({ ...templateForm, whyShown: e.target.value })} placeholder="e.g. Because we want to support you through transaction changes..." /></div>
                                <div className="form-group"><label className="form-label">Grievance / Problem Solved</label><input className="form-input" value={templateForm.problemSolved} onChange={e => setTemplateForm({ ...templateForm, problemSolved: e.target.value })} placeholder="e.g. This helps save on monthly maintenance charges..." /></div>
                                <div className="form-group"><label className="form-label">Immediate Customer Gain</label><input className="form-input" value={templateForm.customerGain} onChange={e => setTemplateForm({ ...templateForm, customerGain: e.target.value })} placeholder="e.g. Complete waiver of savings fees for 90 days..." /></div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Description</label><textarea className="form-input" value={templateForm.description} onChange={e => setTemplateForm({ ...templateForm, description: e.target.value })} rows={2} /></div>
                            </div>
                            <button className="btn btn-primary" onClick={handleCreateTemplate} disabled={!templateForm.name}>Create Template</button>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                        {offerTemplates.map(o => (
                            <div key={o.id} className="card" style={{ borderLeft: `4px solid ${o.tier === 'EMERGENCY' ? 'var(--accent-red)' : o.tier === 'PREMIUM' ? 'var(--accent-purple)' : o.tier === 'STANDARD' ? 'var(--accent-blue)' : 'var(--accent-green)'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span className="badge badge-blue">{o.category?.replace(/_/g, ' ')}</span><span className={`badge badge-${o.tier === 'EMERGENCY' ? 'red' : o.tier === 'PREMIUM' ? 'purple' : 'green'}`}>{o.tier}</span></div>
                                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{o.name}</div>
                                {o.description && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{o.description}</p>}
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Valid: {o.validityDays}d · Cooldown cap: {o.cooldownDays}d · Max: {o.maxPerCustomer}/customer</div>
                                {o.whyShown && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(59,130,246,0.08)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>💬 "{o.whyShown}"</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: ISSUED OFFERS */}
            {activeTab === 'issued' && (
                <div className="fade-in">
                    {issuedOffers.length === 0 ? (
                        <div className="empty-state"><Gift size={40} /><h3>No active retention offers issued</h3><p>Incentives are automatically dispatched during early-intervention pipelines.</p></div>
                    ) : (
                        <div className="card">
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Customer</th>
                                            <th>Offer Attached</th>
                                            <th>Delivery Medium</th>
                                            <th>Status</th>
                                            <th>Customer Feedback Note</th>
                                            <th>Valid Until</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {issuedOffers.map(o => (
                                            <tr key={o.id}>
                                                <td style={{ fontWeight: 600 }}>{o.user?.name}</td>
                                                <td>{o.offerLibrary?.name || '—'}<div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.offerLibrary?.category?.replace(/_/g, ' ')}</div></td>
                                                <td><span className="badge badge-blue">{o.channel}</span></td>
                                                <td><span className={`badge badge-${o.status === 'ACCEPTED' ? 'green' : o.status === 'DECLINED' || o.status === 'COMPLAINED' ? 'red' : 'yellow'}`}>{o.status}</span></td>
                                                <td style={{ fontSize: '0.82rem' }}>{o.customerResponse || 'No feedback yet'}</td>
                                                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.validUntil ? new Date(o.validUntil).toLocaleDateString('en-IN') : '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MODALS & TOAST */}
            {showCreateCampaign && <CreateCampaignModal onClose={() => setShowCreateCampaign(false)} onCreated={() => { setShowCreateCampaign(false); loadAllOutreach(); showToast('✅ Early campaign created!'); }} segments={segments} />}
            {viewId && <DetailModal id={viewId} onClose={() => { setViewId(null); loadAllOutreach(); }} />}
            {toast && (
                <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 20px', fontSize: '0.85rem', fontWeight: 600, boxShadow: 'var(--shadow-lg)', zIndex: 3000, animation: 'fadeInUp 0.3s ease' }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
