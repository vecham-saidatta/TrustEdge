import { useState, useEffect } from 'react';
import { commandCenterAPI, outreachAPI, retentionAPI, feedbackAPI, signalAPI } from '../api';
import {
    Activity, Target, Megaphone, Brain, Zap, TrendingUp, Users, AlertTriangle,
    CheckCircle, BarChart3, ArrowRight, Eye, X, FileText, Send, RefreshCw, Heart, Gift, Map, Loader
} from 'lucide-react';

// Color & Icon Maps
const RISK_COLORS = { LOW: '#10b981', MODERATE: '#f59e0b', HIGH: '#ef4444', CRITICAL: '#dc2626' };
const HEALTH_COLORS = { THRIVING: '#3b82f6', HEALTHY: '#10b981', NEEDS_ATTENTION: '#f59e0b', AT_RISK: '#ef4444', CRITICAL: '#dc2626' };
const STAGE_COLORS = { NEW: 'blue', GROWTH: 'green', STABLE: 'purple', DORMANT: 'yellow', AT_RISK: 'red', PREMIUM_RECOVERY: 'purple' };
const SIG_ICONS = {
    TRANSACTION: '💳', DIGITAL: '📱', LOGIN: '🔑', COMPLAINT: '😤', SUPPORT_CALL: '📞',
    LIFE_EVENT: '🎯', MARKET: '📊', PRODUCT_INQUIRY: '🔍', PAYMENT_BOUNCE: '⚠️', BALANCE_DROP: '📉'
};
const CH_ICONS = { EMAIL: '📧', SMS: '📱', WHATSAPP: '💬', PUSH: '🔔', INAPP: '📲', RM_CALL: '📞', BRANCH: '🏦' };
const ACTION_COLORS = { INCREASE_WEIGHT: '#10b981', DECREASE_WEIGHT: '#ef4444', MAINTAIN: '#3b82f6', PAUSE: '#6b7280' };
const ACTION_LABELS = { INCREASE_WEIGHT: '⬆ Increase', DECREASE_WEIGHT: '⬇ Decrease', MAINTAIN: '🔄 Maintain', PAUSE: '⏸ Pause' };

// ═══════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════

function MiniChart({ data, width = 280, height = 60, color = '#3b82f6', bands }) {
    if (!data || !data.length) return null;
    const max = Math.max(...data, ...(bands?.p95 || []), 0.01);
    const pts = (arr) => arr.map((v, i) => `${(i / (arr.length - 1)) * width},${height - (v / max) * height}`).join(' ');
    return (
        <svg width={width} height={height} style={{ display: 'block' }}>
            {bands && (
                <>
                    <polygon points={`${pts(bands.p5)} ${pts(bands.p95).split(' ').reverse().join(' ')}`} fill={`${color}08`} stroke="none" />
                    <polygon points={`${pts(bands.p25)} ${pts(bands.p75).split(' ').reverse().join(' ')}`} fill={`${color}15`} stroke="none" />
                    <polyline points={pts(bands.p50)} fill="none" stroke={color} strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                </>
            )}
            <polyline points={pts(data)} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </svg>
    );
}

function StatCard({ label, value, color, icon, sub }) {
    return (
        <div className="stat-card" style={{ flex: 1, minWidth: 160, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, fontSize: '3rem', opacity: 0.06 }}>{icon}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1.2 }}>{value}</div>
            {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
        </div>
    );
}

function MS({ label, value }) {
    return (
        <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{value}</div>
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
// CHURN DNA REPORT MODAL (Consolidated from SignalEnginePage)
// ═══════════════════════════════════════════

function ReportModal({ reportId, onClose }) {
    const [r, setR] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');

    useEffect(() => {
        signalAPI.getReport(reportId)
            .then(res => setR(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [reportId]);

    if (loading) return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 32 }}>
                <div className="spinner" style={{ width: 24, height: 24 }} />
                <span>Running 10,000 Monte Carlo simulations...</span>
            </div>
        </div>
    );

    if (!r) return null;

    const gj = r.ghostJourney || {};
    const mc = gj.monteCarlo || null;
    const dna = gj.churnDNA || null;
    const pulse = (r.recommendations && typeof r.recommendations === 'object' && !Array.isArray(r.recommendations) && r.recommendations.channels) ? r.recommendations : null;
    const TABS = ['overview', 'risk_curve', 'monte_carlo', 'tgnn_dna', 'pulse_rl', 'factors'];

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={onClose} />
            <div style={{ position: 'relative', width: 700, maxHeight: '85vh', overflowY: 'auto', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>🧬 Churn DNA Report</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.user?.email}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: RISK_COLORS[r.riskLevel] }}>{r.churnProbability}%</div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: `${RISK_COLORS[r.riskLevel]}20`, color: RISK_COLORS[r.riskLevel] }}>{r.riskLevel}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
                    {TABS.map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{
                                flex: 1, padding: '10px 4px', background: 'none', border: 'none',
                                borderBottom: `2px solid ${tab === t ? '#3b82f6' : 'transparent'}`,
                                color: tab === t ? '#3b82f6' : 'var(--text-muted)', fontFamily: 'inherit',
                                fontSize: '0.72rem', fontWeight: tab === t ? 700 : 500, cursor: 'pointer',
                                textTransform: 'capitalize', whiteSpace: 'nowrap'
                            }}>
                            {t.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {tab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Row l="Period" v={`${new Date(r.periodStart).toLocaleDateString('en-IN')} — ${new Date(r.periodEnd).toLocaleDateString('en-IN')}`} />
                        <Row l="Overall Risk" v={r.overallRisk.toFixed(4)} color={RISK_COLORS[r.riskLevel]} />
                        <Row l="Churn Probability" v={`${r.churnProbability}%`} color={RISK_COLORS[r.riskLevel]} />
                        {mc && (
                            <>
                                <Row l="Monte Carlo Samples" v={mc.samples?.toLocaleString()} />
                                <Row l="90-Day Prediction" v={mc.prediction?.replace(/_/g, ' ')} color={mc.finalRisk > 0.5 ? '#ef4444' : '#10b981'} />
                                <Row l="Confidence Interval" v={mc.confidenceInterval} />
                                <Row l="Revenue at Risk (90d)" v={`₹${mc.revenueAtRisk90d?.toLocaleString()}`} color="#ef4444" />
                                <Row l="Revenue Worst Case" v={`₹${mc.revenueWorstCase?.toLocaleString()}`} color="#dc2626" />
                            </>
                        )}
                        {dna && <Row l="Contagion Score" v={dna.contagionScore?.toFixed(4)} />}
                        {pulse && <Row l="PULSE Model" v={`${pulse.modelVersion} (${(pulse.accuracy * 100).toFixed(0)}% accuracy)`} />}
                    </div>
                )}

                {tab === 'risk_curve' && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>Historical 90-day churn risk trajectory</div>
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 16 }}>
                            <MiniChart data={r.dailyRiskCurve} width={600} height={160} color={RISK_COLORS[r.riskLevel]} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 8 }}><span>Day 1</span><span>Day 30</span><span>Day 60</span><span>Day 90</span></div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                            <MS label="Peak" value={Math.max(...r.dailyRiskCurve).toFixed(3)} />
                            <MS label="Min" value={Math.min(...r.dailyRiskCurve).toFixed(3)} />
                            <MS label="Avg" value={(r.dailyRiskCurve.reduce((a, b) => a + b, 0) / r.dailyRiskCurve.length).toFixed(3)} />
                            <MS label="Trend" value={r.dailyRiskCurve[89] > r.dailyRiskCurve[0] ? '↗ Rising' : '↘ Falling'} />
                        </div>
                    </div>
                )}

                {tab === 'monte_carlo' && mc && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>10,000 Ghost Journey samples — 90-day forward projection</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 12 }}>Shaded bands: P5-P95 (light) and P25-P75 (darker). Solid line: P50 median.</div>
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 16 }}>
                            <MiniChart data={mc.percentiles.p50} width={600} height={160} color="#8b5cf6" bands={mc.percentiles} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 8 }}><span>Today</span><span>+30d</span><span>+60d</span><span>+90d</span></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                            <MS label="Churn Prob" value={`${mc.churnProbability}%`} />
                            <MS label="Final Risk (P50)" value={(mc.finalRisk * 100).toFixed(1) + '%'} />
                            <MS label="Revenue Risk" value={`₹${mc.revenueAtRisk90d?.toLocaleString()}`} />
                            <MS label="Worst Case" value={`₹${mc.revenueWorstCase?.toLocaleString()}`} />
                        </div>
                    </div>
                )}

                {tab === 'tgnn_dna' && dna && (
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 }}>Temporal Graph Neural Network — Churn DNA Fingerprint</div>
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 10 }}>🔬 Behavioral Velocity Changes (14-day window)</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                {Object.entries(dna.velocities).map(([k, v]) => {
                                    const c = v > 0.1 ? '#ef4444' : v < -0.1 ? '#10b981' : 'var(--text-muted)';
                                    return (
                                        <div key={k} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${c}30`, background: `${c}08` }}>
                                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{SIG_ICONS[k] || '📡'} {k}</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: c }}>{v > 0 ? '+' : ''}{(v * 100).toFixed(1)}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14, marginBottom: 12 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 10 }}>🕸️ Network Contagion Score</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: dna.contagionScore > 0.05 ? '#ef4444' : '#10b981' }}>{(dna.contagionScore * 100).toFixed(2)}%</div>
                                <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, dna.contagionScore * 1000)}%`, height: '100%', background: dna.contagionScore > 0.05 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#10b981,#3b82f6)', borderRadius: 6 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'pulse_rl' && pulse && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PULSE PPO Channel Optimization</div>
                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>{pulse.modelVersion} · {(pulse.accuracy * 100).toFixed(0)}%</span>
                        </div>
                        {pulse.channels?.map((ch, i) => {
                            const bg = ch.recommended ? 'rgba(16,185,129,0.08)' : 'var(--bg-secondary)';
                            return (
                                <div key={i} style={{ background: bg, borderRadius: 10, padding: 14, marginBottom: 8, borderLeft: `3px solid ${ch.recommended ? '#10b981' : 'var(--border-color)'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>📡 {ch.channel.replace('_', ' ')}</span>
                                        <div style={{ display: 'flex', gap: 8, fontSize: '0.7rem' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>Q: {ch.qValue}</span>
                                            <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>ROI: {ch.roi}</span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{ch.action}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {tab === 'factors' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {r.topRiskFactors?.map((f, i) => (
                            <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14, borderLeft: `3px solid ${f.impact > 0 ? '#ef4444' : '#10b981'}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{SIG_ICONS[f.factor] || '📡'} {f.factor}</span>
                                    <span style={{ fontSize: '0.7rem', color: f.impact > 0 ? '#ef4444' : '#10b981' }}>Impact: {f.impact > 0 ? '+' : ''}{f.impact}</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{f.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════
// MASTER COCKPIT MAIN
// ═══════════════════════════════════════════

export default function CommandCenterPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    // Shared State Core
    const [stats, setStats] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [journeys, setJourneys] = useState([]);
    const [insights, setInsights] = useState([]);
    const [learningSummary, setLearningSummary] = useState(null);

    // Churn DNA State
    const [customers, setCustomers] = useState([]);
    const [signalStats, setSignalStats] = useState(null);
    const [generatingReport, setGeneratingReport] = useState(null);
    const [viewReportId, setViewReportId] = useState(null);

    // Retention Hub State
    const [healthScores, setHealthScores] = useState([]);
    const [healthFilter, setHealthFilter] = useState('');
    const [metrics, setMetrics] = useState([]);

    // PULSE Filter State
    const [pulseFilter, setPulseFilter] = useState({ channel: '', riskLevel: '' });

    const showToast = (m) => { setToast(m); setTimeout(() => setToast(''), 4000); };

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [
                statsRes, hsRes, cRes, jRes,
                custRes, sigStatsRes, metricRes,
                iRes, learnRes
            ] = await Promise.all([
                commandCenterAPI.getStats(),
                retentionAPI.getHealthScores(healthFilter ? { healthLevel: healthFilter } : {}),
                outreachAPI.getCampaigns(),
                retentionAPI.getJourneys(),
                signalAPI.getCustomers(),
                signalAPI.getStats(),
                retentionAPI.getMetrics(),
                feedbackAPI.getInsights(pulseFilter),
                feedbackAPI.getLearningSummary()
            ]);

            setStats(statsRes.data.data);
            setHealthScores(hsRes.data.data || []);
            setCampaigns(cRes.data.data || []);
            setJourneys(jRes.data.data || []);
            setCustomers(custRes.data.data || []);
            setSignalStats(sigStatsRes.data.data);
            setMetrics(metricRes.data.data || []);
            setInsights(iRes.data.data || []);
            setLearningSummary(learnRes.data.data || {});
        } catch (e) {
            console.error('Error fetching admin workspace data:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllData();
    }, [healthFilter, pulseFilter.channel, pulseFilter.riskLevel]);

    const handleRunFeedback = async () => {
        try {
            const r = await feedbackAPI.aggregate();
            showToast(`🔄 Feedback Loop run complete: Aggregated ${r.data.data.insights} new insights!`);
            loadAllData();
        } catch (e) {
            showToast('❌ ' + (e.response?.data?.message || 'Failed'));
        }
    };

    const handleAnalyzeCustomer = async (userId) => {
        setGeneratingReport(userId);
        try {
            const res = await signalAPI.generateReport(userId);
            const d = res.data.data;
            const outreach = d.outreach;
            let toastMsg = `✅ Analysis complete: ${d.riskLevel} risk · ${d.churnProbability}% churn`;
            if (outreach && !outreach.error) {
                toastMsg += ` | 🚀 Auto-intervention triggered successfully!`;
            }
            showToast(toastMsg);
            setViewReportId(d.id);
            loadAllData();
        } catch (e) {
            showToast('❌ ' + (e.response?.data?.message || 'Analysis Failed'));
        } finally {
            setGeneratingReport(null);
        }
    };

    const handleViewReport = async (userId) => {
        try {
            const r = await signalAPI.getReports(userId);
            if (r.data.data.length > 0) setViewReportId(r.data.data[0].id);
            else showToast('No existing reports found. Please analyze customer first.');
        } catch {
            showToast('❌ Failed to load report');
        }
    };

    const handleRecalculateHealth = async () => {
        try {
            await retentionAPI.recalculateAll();
            showToast('🩺 Recalculated health scores across all customers!');
            loadAllData();
        } catch (e) {
            showToast('❌ ' + (e.response?.data?.message || 'Recalculation Failed'));
        }
    };

    const handleGenerateSnapshot = async () => {
        try {
            await retentionAPI.generateSnapshot();
            showToast('📊 Success metrics snapshot generated!');
            loadAllData();
        } catch (e) {
            showToast('❌ ' + (e.response?.data?.message || 'Snapshot Failed'));
        }
    };

    if (loading && campaigns.length === 0) return <div className="loading-page"><div className="spinner" /></div>;

    const s = stats?.signal || {};
    const o = stats?.outreach || {};
    const r = stats?.retention || {};
    const activeCamps = campaigns.filter(c => c.status === 'ACTIVE');
    const pulseCamps = campaigns.filter(c => c.source === 'PULSE_AUTO' || c.name?.includes('PULSE'));

    // pipelines pipelineColumn arrays
    const riskItems = healthScores
        .filter(h => ['CRITICAL', 'AT_RISK', 'NEEDS_ATTENTION'].includes(h.healthLevel))
        .map(h => ({
            title: h.user?.name || 'Unknown User',
            subtitle: `${h.lifecycleStage} · ${h.disengagementReason?.replace('_', ' ') || 'N/A'} · Score: ${(h.healthScore * 100).toFixed(0)}%`,
            badge: h.healthLevel,
            badgeColor: HEALTH_COLORS[h.healthLevel] || '#3b82f6',
            color: HEALTH_COLORS[h.healthLevel] || '#3b82f6',
        }));

    const outreachItems = activeCamps.map(c => ({
        title: c.name,
        subtitle: `${c.variants?.length || 0} variants · ${c._count?.executionLogs || 0} sent`,
        badge: c.source === 'PULSE_AUTO' ? '🤖 PULSE' : 'MANUAL',
        badgeColor: c.source === 'PULSE_AUTO' ? '#8b5cf6' : '#3b82f6',
        color: '#3b82f6',
    }));

    const journeyItems = journeys
        .filter(j => j.stage !== 'CLOSED' && j.stage !== 'RESOLVED')
        .map(j => ({
            title: j.user?.name || 'Unknown User',
            subtitle: `${j.triggerType?.replace('_', ' ')} ➜ ${j.stage?.replace('_', ' ')}`,
            badge: j.outcome || 'IN TRANSIT',
            badgeColor: j.outcome === 'RETAINED' ? '#10b981' : j.outcome === 'CHURNED' ? '#ef4444' : '#f59e0b',
            color: '#f59e0b',
        }));

    return (
        <div className="fade-in">
            {/* Master Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h2>⚡ Customer Intelligence Hub</h2>
                    <p>Consolidated platform telemetry: Risk Signals × Retention Strategy × PULSE Machine Learning</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={loadAllData}>
                        <RefreshCw size={16} /> Sync Console
                    </button>
                    <button className="btn btn-primary" onClick={handleRunFeedback}>
                        <Brain size={16} /> Run Feedback Loop
                    </button>
                </div>
            </div>

            {/* Navigation Tabs bar */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-color)', marginBottom: 24, overflowX: 'auto', paddingBottom: 2 }}>
                {[
                    { key: 'overview', label: 'Ecosystem Overview', icon: Zap },
                    { key: 'signals', label: 'Signals & Churn DNA', icon: Activity },
                    { key: 'health', label: 'Retention & Health CRM', icon: Target },
                    { key: 'insights', label: 'AI Optimization (PULSE)', icon: Brain },
                ].map(t => {
                    const Icon = t.icon;
                    const isActive = activeTab === t.key;
                    return (
                        <button key={t.key} className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setActiveTab(t.key)}
                            style={{
                                borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
                                borderBottom: isActive ? '2px solid var(--accent-blue)' : 'none',
                                background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1))' : 'transparent',
                                borderColor: isActive ? 'var(--accent-blue)' : 'transparent',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)'
                            }}>
                            <Icon size={14} /> {t.label}
                        </button>
                    );
                })}
            </div>

            {/* TAB CONTENTS */}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="fade-in">
                    <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                        <StatCard label="Total Monitored" value={r.totalHealthScores || 0} color="var(--accent-blue)" icon="🩺" sub={`Avg Health: ${((r.avgHealthScore || 0) * 100).toFixed(0)}%`} />
                        <StatCard label="At Risk Cases" value={r.healthDistribution?.AT_RISK || r.healthDistribution?.CRITICAL || 0} color="var(--accent-red)" icon="⚠️" sub="Urgent outreach needed" />
                        <StatCard label="Active Campaigns" value={o.activeCampaigns || 0} color="var(--accent-green)" icon="📡" sub={`${pulseCamps.length} AI automated`} />
                        <StatCard label="Interventions Sent" value={o.totalSent || 0} color="var(--accent-purple)" icon="📨" sub={`${o.deliveryRate || 0}% delivered`} />
                        <StatCard label="Retention CVR" value={`${o.conversionRate || 0}%`} color="var(--accent-yellow)" icon="🎯" sub={`${o.totalConverted || 0} customer savings`} />
                        <StatCard label="PULSE Feedback" value={insights.length} color="var(--accent-cyan)" icon="🧠" sub="Aggregated learnings" />
                    </div>

                    {/* SVG Flow diagram */}
                    <div className="card" style={{ marginBottom: 24, padding: 24 }}>
                        <div className="card-header" style={{ marginBottom: 20 }}><div className="card-title">🔗 Platform Customer Engagement Lifecycle</div></div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
                            {[
                                { icon: '🧬', label: 'Signal Engine', desc: 'Behavior patterns', color: '#8b5cf6', val: `${s.totalReports || 0} assessments` },
                                null,
                                { icon: '🩺', label: 'Health Score', desc: 'Predict disengagement', color: '#3b82f6', val: `${r.activeOfferTemplates || 0} offer plans` },
                                null,
                                { icon: '📡', label: 'Outreach Engine', desc: 'Early campaign split', color: '#10b981', val: `${o.totalCampaigns || 0} campaigns` },
                                null,
                                { icon: '🎯', label: 'Retention Journeys', desc: 'Handoff resolution', color: '#f59e0b', val: `${journeys.length} customer maps` },
                                null,
                                { icon: '🧠', label: 'PULSE Feedback', desc: 'Dynamic weighting', color: '#06b6d4', val: `${insights.length} insight policies` },
                            ].map((item, i) => item === null ? (
                                <ArrowRight key={i} size={20} color="var(--text-muted)" style={{ margin: '0 12px', opacity: 0.4 }} />
                            ) : (
                                <div key={i} style={{ textAlign: 'center', padding: '14px 18px', borderRadius: 12, background: `${item.color}08`, border: `1px solid ${item.color}20`, minWidth: 140 }}>
                                    <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>{item.icon}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.78rem', color: item.color }}>{item.label}</div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, marginTop: 6 }}>{item.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Unified Pipelines Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                        {/* Risk Detection column */}
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
                                <AlertTriangle size={18} color="var(--accent-red)" />
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>High-Risk Alerts Detected</span>
                            </div>
                            {riskItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.85rem' }}>All clear. No elevated customer risk.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {riskItems.slice(0, 5).map((item, i) => (
                                        <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', borderLeft: `3px solid ${item.color}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.title}</span>
                                                <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: `${item.color}15`, color: item.color }}>{item.badge}</span>
                                            </div>
                                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Outreach column */}
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
                                <Megaphone size={18} color="var(--accent-green)" />
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Active Proactive Outreach</span>
                            </div>
                            {outreachItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.85rem' }}>No campaigns actively sending.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {outreachItems.slice(0, 5).map((item, i) => (
                                        <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', borderLeft: `3px solid ${item.color}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.title}</span>
                                                <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: `${item.badgeColor}15`, color: item.badgeColor }}>{item.badge}</span>
                                            </div>
                                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Journeys column */}
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border-color)' }}>
                                <Target size={18} color="var(--accent-yellow)" />
                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Active Customer Journeys</span>
                            </div>
                            {journeyItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: '0.85rem' }}>No journeys in progress.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {journeyItems.slice(0, 5).map((item, i) => (
                                        <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', borderLeft: `3px solid ${item.color}` }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.title}</span>
                                                <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: `${item.badgeColor}15`, color: item.badgeColor }}>{item.badge}</span>
                                            </div>
                                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: CHURN DNA / SIGNALS */}
            {activeTab === 'signals' && (
                <div className="fade-in">
                    {signalStats && (
                        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                            <StatCard label="Signals Ingested" value={signalStats.totalSignals?.toLocaleString()} color="var(--accent-blue)" icon="📡" />
                            <StatCard label="DNA Reports Compiled" value={signalStats.totalReports} color="var(--accent-purple)" icon="📋" />
                            <StatCard label="Average System Risk" value={`${(signalStats.avgRisk * 100).toFixed(1)}%`} color={signalStats.avgRisk > 0.5 ? '#ef4444' : '#10b981'} icon="📊" />
                            <StatCard label="Monte Carlo Run Trials" value={signalStats.monteCarloSamples?.toLocaleString()} color="var(--accent-yellow)" icon="🎲" />
                            <StatCard label="Tracked Signal Indicators" value={Object.keys(signalStats.signalsByType || {}).length} color="var(--accent-cyan)" icon="🧬" />
                        </div>
                    )}

                    {/* Signal Distribution */}
                    {signalStats?.signalsByType && (
                        <div className="card" style={{ marginBottom: 20 }}>
                            <div className="card-header"><div className="card-title"><Activity size={18} /> Customer Interaction Signal Distribution</div></div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                                {Object.entries(signalStats.signalsByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
                                    const mx = Math.max(...Object.values(signalStats.signalsByType));
                                    return (
                                        <div key={type} style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 8 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: 4 }}>
                                                <span style={{ color: 'var(--text-muted)' }}>{SIG_ICONS[type] || '📡'} {type}</span>
                                                <span style={{ fontWeight: 700 }}>{count}</span>
                                            </div>
                                            <div style={{ background: 'var(--bg-input)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
                                                <div style={{ width: `${(count / mx) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', borderRadius: 4 }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Customer Signals List */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title"><FileText size={18} /> Client Behavioral Churn DNA Registry</div>
                            <span className="badge badge-blue">{customers.length} registered clients</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {customers.map(c => {
                                const rc = c.lastReport ? RISK_COLORS[c.lastReport.riskLevel] : 'var(--text-muted)';
                                return (
                                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: 12, padding: '14px 18px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 2 }}>{c.name}</div>
                                            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{c.email} · Account Number: ****{c.accountNumber?.slice(-4) || 'N/A'}</div>
                                            <div style={{ display: 'flex', gap: 6, marginTop: 6, fontSize: '0.7rem' }}>
                                                <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>📡 {c._count?.signals || 0} behavioral signals</span>
                                                <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>📋 {c._count?.churnReports || 0} reports</span>
                                                {c.financialProfile && <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>Current Balance: ₹{c.financialProfile.currentBalance?.toLocaleString()}</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                                            {c.lastReport ? (
                                                <span style={{ fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: `${rc}18`, color: rc }}>
                                                    {c.lastReport.riskLevel} Risk ({c.lastReport.churnProbability}% Prob)
                                                </span>
                                            ) : <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pending Assessment</span>}
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button className="btn btn-primary" style={{ fontSize: '0.68rem', padding: '4px 10px' }}
                                                    disabled={generatingReport === c.id}
                                                    onClick={() => handleAnalyzeCustomer(c.id)}>
                                                    <Zap size={12} /> {generatingReport === c.id ? '10K Monte Carlo Running...' : 'Analyze DNA'}
                                                </button>
                                                {c.lastReport && (
                                                    <button className="btn btn-secondary" style={{ fontSize: '0.68rem', padding: '4px 10px' }} onClick={() => handleViewReport(c.id)}>
                                                        <Eye size={12} /> View Report
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 3: CUSTOMER HEALTH / RETENTION HUB */}
            {activeTab === 'health' && (
                <div className="fade-in">
                    <div className="stat-grid">
                        <div className="stat-card blue"><div className="stat-icon blue"><Heart size={22} /></div><div className="stat-value">{stats?.retention?.totalHealthScores || 0}</div><div className="stat-label">Clients Scored</div></div>
                        <div className="stat-card green"><div className="stat-icon green"><Activity size={22} /></div><div className="stat-value">{((stats?.retention?.avgHealthScore || 0) * 100).toFixed(0)}%</div><div className="stat-label">Avg Health Index</div></div>
                        <div className="stat-card purple"><div className="stat-icon purple"><Gift size={22} /></div><div className="stat-value">{stats?.retention?.activeOfferTemplates || 0}</div><div className="stat-label">Approved Retention Incentives</div></div>
                        <div className="stat-card red"><div className="stat-icon red"><AlertTriangle size={22} /></div><div className="stat-value">{(stats?.retention?.healthDistribution?.CRITICAL || 0) + (stats?.retention?.healthDistribution?.AT_RISK || 0)}</div><div className="stat-label">Vulnerable High-Risk Clients</div></div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                        {['', 'THRIVING', 'HEALTHY', 'NEEDS_ATTENTION', 'AT_RISK', 'CRITICAL'].map(f => (
                            <button key={f} className={`btn btn-sm ${healthFilter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setHealthFilter(f)}>
                                {f || 'All Levels'}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
                        {/* Health score table list */}
                        <div className="card">
                            <div className="card-header"><div className="card-title">🩺 Client Loyalty & Health Registry</div></div>
                            {healthScores.length === 0 ? (
                                <div className="empty-state"><Heart size={36} /><p>No health score data available. Run recalculation below.</p></div>
                            ) : (
                                <div className="table-container">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Client</th>
                                                <th>Health Index</th>
                                                <th>Risk Tier</th>
                                                <th>Disengagement Factor</th>
                                                <th>Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {healthScores.map(s => (
                                                <tr key={s.id}>
                                                    <td style={{ fontWeight: 600 }}>{s.user?.name}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                            <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--bg-input)', overflow: 'hidden' }}>
                                                                <div style={{ width: `${s.healthScore * 100}%`, height: '100%', background: s.healthScore > 0.6 ? '#10b981' : s.healthScore > 0.3 ? '#f59e0b' : '#ef4444' }} />
                                                            </div>
                                                            <span style={{ fontSize: '0.8rem' }}>{(s.healthScore * 100).toFixed(0)}%</span>
                                                        </div>
                                                    </td>
                                                    <td><span className={`badge badge-${HEALTH_COLORS[s.healthLevel] === '#10b981' ? 'green' : HEALTH_COLORS[s.healthLevel] === '#f59e0b' ? 'yellow' : HEALTH_COLORS[s.healthLevel] === '#3b82f6' ? 'blue' : 'red'}`}>{s.healthLevel}</span></td>
                                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.disengagementReason?.replace(/_/g, ' ') || 'HEALTHY'}</td>
                                                    <td style={{ fontSize: '0.8rem', fontWeight: 600, color: s.engagementTrend?.includes('DECLINING') ? '#ef4444' : '#10b981' }}>{s.engagementTrend || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Strategic retention metrics panel */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="card-header"><div className="card-title"><TrendingUp size={18} /> Strategic Success Metrics</div></div>
                            {metrics.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>Generate metrics snapshot.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Aggregated Snapshot Period: <strong>{metrics[0].periodLabel}</strong></div>
                                    {[
                                        { label: 'Platform Churn Rate', value: `${metrics[0].churnRate?.toFixed(1)}%`, color: metrics[0].churnRate > 5 ? '#ef4444' : '#10b981' },
                                        { label: 'Customer Trust Index', value: `${metrics[0].trustIndex?.toFixed(0)}/100`, color: '#3b82f6' },
                                        { label: 'Silent Churn Reduction', value: `${metrics[0].silentChurnReduction?.toFixed(1)}%`, color: '#10b981' },
                                        { label: 'Avg Customer Value Saved', value: `₹${metrics[0].revenueRetained?.toLocaleString()}`, color: '#10b981' },
                                        { label: 'Acquisition Costs Saved', value: `₹${metrics[0].acquisitionCostSaved?.toLocaleString()}`, color: '#8b5cf6' },
                                    ].map((m, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{m.label}</span>
                                            <strong style={{ fontSize: '0.88rem', color: m.color }}>{m.value}</strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-primary" onClick={handleRecalculateHealth}>
                            <RefreshCw size={14} /> Recalculate Health Indices
                        </button>
                        <button className="btn btn-secondary" onClick={handleGenerateSnapshot}>
                            <BarChart3 size={14} /> Aggregate Strategic Metrics
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 4: PULSE INSIGHTS */}
            {activeTab === 'insights' && (
                <div className="fade-in">
                    {/* Summary statistics */}
                    {learningSummary && (
                        <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 160, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '18px 22px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 6 }}>Total PULSE Insights</div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#3b82f6' }}>{learningSummary.totalInsights || 0}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 160, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '18px 22px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 6 }}>Top Performers</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>{learningSummary.topPerformers?.slice(0, 3).join(', ') || 'None Compiled'}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 160, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '18px 22px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 6 }}>Last Loop Aggregation</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{learningSummary.lastAggregated ? new Date(learningSummary.lastAggregated).toLocaleString('en-IN') : 'Never'}</div>
                            </div>
                        </div>
                    )}

                    {/* Rankings Grid */}
                    {learningSummary?.channelRankingsByRisk && Object.keys(learningSummary.channelRankingsByRisk).length > 0 && (
                        <div className="card" style={{ marginBottom: 24, padding: 20 }}>
                            <div className="card-header" style={{ marginBottom: 16 }}>
                                <div className="card-title"><BarChart3 size={18} /> AI Recommended Outreach Channel Rankings by Risk Category</div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                                {Object.entries(learningSummary.channelRankingsByRisk).map(([risk, channels]) => (
                                    <div key={risk} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, borderTop: `3px solid ${RISK_COLORS[risk]}` }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: 12, color: RISK_COLORS[risk] }}>{risk} Risk Channels</div>
                                        {channels.map((ch, i) => {
                                            const maxCvr = Math.max(...channels.map(c => c.conversionRate), 0.01);
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                    <span style={{ width: 20, textAlign: 'center', fontSize: '0.85rem' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                                                    <span style={{ width: 80, fontSize: '0.78rem', fontWeight: 600 }}>{CH_ICONS[ch.channel] || '📡'} {ch.channel?.replace('_', ' ')}</span>
                                                    <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                                                        <div style={{ width: `${(ch.conversionRate / maxCvr) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${RISK_COLORS[risk]}, ${ACTION_COLORS[ch.recommendedAction]})`, borderRadius: 4 }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, minWidth: 40, textAlign: 'right' }}>{(ch.conversionRate * 100).toFixed(1)}%</span>
                                                    <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, background: `${ACTION_COLORS[ch.recommendedAction]}15`, color: ACTION_COLORS[ch.recommendedAction], fontWeight: 600 }}>
                                                        {ACTION_LABELS[ch.recommendedAction]}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filter controls */}
                    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Outreach Medium:</span>
                            {['', 'WHATSAPP', 'SMS', 'EMAIL', 'INAPP', 'RM_CALL', 'PUSH', 'BRANCH'].map(ch => (
                                <button key={ch} onClick={() => setPulseFilter(f => ({ ...f, channel: ch }))}
                                    style={{
                                        padding: '4px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: '1px solid', fontFamily: 'inherit',
                                        background: pulseFilter.channel === ch ? 'rgba(59,130,246,0.15)' : 'transparent',
                                        borderColor: pulseFilter.channel === ch ? '#3b82f6' : 'var(--border-color)',
                                        color: pulseFilter.channel === ch ? '#3b82f6' : 'var(--text-muted)'
                                    }}>
                                    {ch ? `${CH_ICONS[ch]} ${ch.replace('_', ' ')}` : 'All'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Insights Feed list */}
                    <div className="card">
                        <div className="card-header"><div className="card-title"><Brain size={18} /> Deep PULSE Feedback Insights</div></div>
                        {insights.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Adjust filters or run Aggregate Feedback above.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {insights.map((ins, i) => (
                                    <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: '14px 18px', borderLeft: `4px solid ${ACTION_COLORS[ins.recommendedAction]}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: '1.1rem' }}>{CH_ICONS[ins.channel]}</span>
                                                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{ins.channel?.replace('_', ' ')}</span>
                                                <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 6, background: `${RISK_COLORS[ins.riskLevel]}15`, color: RISK_COLORS[ins.riskLevel], fontWeight: 700 }}>{ins.riskLevel}</span>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Batch: {ins.periodLabel}</span>
                                            </div>
                                            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: `${ACTION_COLORS[ins.recommendedAction]}15`, color: ACTION_COLORS[ins.recommendedAction] }}>
                                                {ACTION_LABELS[ins.recommendedAction]}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.5 }}>{ins.insight}</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                                            {[
                                                { label: 'Samples Analyzed', value: ins.sampleSize, icon: '📊' },
                                                { label: 'Delivery Rate', value: `${(ins.deliveryRate * 100).toFixed(0)}%`, icon: '📨' },
                                                { label: 'Open Rate', value: `${(ins.openRate * 100).toFixed(0)}%`, icon: '👁️' },
                                                { label: 'Conversion CVR', value: `${(ins.conversionRate * 100).toFixed(1)}%`, icon: '🎯' },
                                                { label: 'Complaint Rate', value: `${(ins.complaintRate * 100).toFixed(1)}%`, icon: '⚠️', color: ins.complaintRate > 0.05 ? '#ef4444' : '#10b981' },
                                                { label: 'Retention CAC Cost', value: `₹${ins.costPerConversion}`, icon: '💰' },
                                            ].map((m, j) => (
                                                <div key={j} style={{ background: 'var(--bg-card)', borderRadius: 8, padding: '6px 10px', textAlign: 'center' }}>
                                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: 2 }}>{m.icon} {m.label}</div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: m.color || 'var(--text-primary)' }}>{m.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL & TOAST */}
            {viewReportId && <ReportModal reportId={viewReportId} onClose={() => setViewReportId(null)} />}
            {toast && (
                <div style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '12px 20px', fontSize: '0.85rem', fontWeight: 600, boxShadow: 'var(--shadow-lg)', zIndex: 3000, animation: 'fadeInUp 0.3s ease' }}>
                    {toast}
                </div>
            )}
        </div>
    );
}
