import { useState, useEffect } from 'react';
import { complaintsAPI } from '../api';
import { X, Loader, AlertTriangle, Shield, Users } from 'lucide-react';

const PRIORITY_COLOR = { LOW:'#10b981', MEDIUM:'#f59e0b', HIGH:'#f97316', URGENT:'#ef4444' };
const STATUS_COLOR   = { OPEN:'#3b82f6', IN_PROGRESS:'#f59e0b', RESOLVED:'#10b981', CLOSED:'#64748b' };
const TIER_META = {
    TIER_1: { label:'Tier 1 — Support',         color:'#3b82f6', bg:'rgba(59,130,246,0.12)' },
    TIER_2: { label:'Tier 2 — Relationship Mgr', color:'#f59e0b', bg:'rgba(245,158,11,0.12)' },
    TIER_3: { label:'Tier 3 — Nodal Officer',    color:'#ef4444', bg:'rgba(239,68,68,0.12)' },
};

function SLABar({ slaDeadline, createdAt }) {
    const total = new Date(slaDeadline) - new Date(createdAt);
    const elapsed = new Date() - new Date(createdAt);
    const pct = Math.min(100, Math.round((elapsed / total) * 100));
    const color = pct >= 100 ? '#ef4444' : pct >= 75 ? '#f97316' : '#10b981';
    const daysLeft = Math.ceil((new Date(slaDeadline) - new Date()) / (1000*60*60*24));
    return (
        <div>
            <div style={{ height:4, background:'var(--bg-secondary)', borderRadius:4, overflow:'hidden', marginBottom:3 }}>
                <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:4, transition:'width 0.3s' }}/>
            </div>
            <span style={{ fontSize:'0.68rem', color }}>{pct>=100 ? `Overdue by ${Math.abs(daysLeft)}d` : daysLeft===0 ? 'Due today' : `${daysLeft}d remaining`}</span>
        </div>
    );
}

function AdminActionModal({ complaint, onClose, onDone }) {
    const [tab, setTab] = useState('resolve');
    const [resolution, setResolution] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    const handleResolve = async () => {
        if (!resolution.trim()) { setErr('Enter resolution note.'); return; }
        setLoading(true); setErr('');
        try { await complaintsAPI.adminResolve(complaint.id, { resolution }); onDone(); }
        catch(e) { setErr(e.response?.data?.message || 'Failed.'); setLoading(false); }
    };

    const handleEscalateT3 = async () => {
        setLoading(true); setErr('');
        try { await complaintsAPI.escalateT3(complaint.id); onDone(); }
        catch(e) { setErr(e.response?.data?.message || 'Failed.'); setLoading(false); }
    };

    const tier = TIER_META[complaint.tier] || TIER_META.TIER_1;

    return (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:560, padding:28, maxHeight:'90vh', overflow:'auto' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                    <div>
                        <span style={{ fontSize:'0.72rem', fontWeight:700, color:tier.color, background:tier.bg, padding:'3px 10px', borderRadius:100 }}>{tier.label}</span>
                        <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:6 }}>{complaint.ticketNumber}</div>
                        <h3 style={{ fontSize:'1rem', fontWeight:700, marginTop:2 }}>{complaint.subject}</h3>
                        <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{complaint.user?.name} · {complaint.category}</div>
                    </div>
                    <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}><X size={18}/></button>
                </div>

                <div style={{ background:'var(--bg-secondary)', borderRadius:10, padding:14, marginBottom:16, fontSize:'0.85rem', lineHeight:1.7, color:'var(--text-secondary)' }}>
                    <div style={{ fontSize:'0.7rem', fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>COMPLAINT</div>
                    {complaint.description}
                </div>

                {complaint.responseNote && (
                    <div style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:8, padding:12, marginBottom:16, fontSize:'0.83rem' }}>
                        <div style={{ fontSize:'0.7rem', color:'var(--accent-blue)', fontWeight:600, marginBottom:4 }}>PREVIOUS RESPONSE</div>
                        {complaint.responseNote}
                    </div>
                )}

                {err && <div style={{ background:'rgba(239,68,68,0.1)', color:'#ef4444', padding:'8px 12px', borderRadius:8, fontSize:'0.83rem', marginBottom:12 }}>{err}</div>}

                {/* Action tabs */}
                <div style={{ display:'flex', gap:6, marginBottom:16 }}>
                    <button onClick={()=>setTab('resolve')} style={{ flex:1, padding:'8px', borderRadius:8, border:`1px solid ${tab==='resolve'?'#10b981':'var(--border-strong)'}`, background:tab==='resolve'?'rgba(16,185,129,0.12)':'var(--bg-secondary)', color:tab==='resolve'?'#10b981':'var(--text-secondary)', fontFamily:'inherit', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>✅ Resolve</button>
                    {complaint.tier === 'TIER_2' && (
                        <button onClick={()=>setTab('escalate')} style={{ flex:1, padding:'8px', borderRadius:8, border:`1px solid ${tab==='escalate'?'#ef4444':'var(--border-strong)'}`, background:tab==='escalate'?'rgba(239,68,68,0.12)':'var(--bg-secondary)', color:tab==='escalate'?'#ef4444':'var(--text-secondary)', fontFamily:'inherit', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>🚨 Escalate T3</button>
                    )}
                </div>

                {tab === 'resolve' && (
                    <div>
                        <label style={{ display:'block', fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:6, fontWeight:600, textTransform:'uppercase' }}>Resolution Note</label>
                        <textarea className="form-input" rows={4} placeholder="Describe how this complaint was resolved..." value={resolution} onChange={e=>setResolution(e.target.value)} style={{ resize:'vertical' }}/>
                        <button onClick={handleResolve} className="btn btn-primary" style={{ width:'100%', marginTop:14, background:'linear-gradient(135deg,#10b981,#059669)' }} disabled={loading}>
                            {loading ? 'Resolving...' : '✅ Mark as Resolved'}
                        </button>
                    </div>
                )}

                {tab === 'escalate' && (
                    <div style={{ textAlign:'center', padding:'20px 0' }}>
                        <AlertTriangle size={40} color="#ef4444" style={{ marginBottom:12 }}/>
                        <p style={{ fontWeight:600, marginBottom:8 }}>Escalate to Tier 3 — Nodal Officer</p>
                        <p style={{ fontSize:'0.83rem', color:'var(--text-muted)', marginBottom:20 }}>This complaint will be handled by the Nodal Officer. SLA resets to 30 days. If still unresolved, it will be flagged for RBI Ombudsman.</p>
                        <button onClick={handleEscalateT3} className="btn btn-danger" style={{ width:'100%' }} disabled={loading}>
                            {loading ? 'Escalating...' : '🚨 Escalate to Nodal Officer'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminComplaintsPage() {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filters, setFilters] = useState({ tier:'', status:'', priority:'' });

    const load = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.tier)     params.tier     = filters.tier;
            if (filters.status)   params.status   = filters.status;
            if (filters.priority) params.priority = filters.priority;
            const [cRes, sRes] = await Promise.all([
                complaintsAPI.adminGetAll(params),
                complaintsAPI.adminGetStats(),
            ]);
            setComplaints(cRes.data.data || []);
            setStats(sRes.data.data.stats);
        } catch(e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [filters]);

    const handleDone = () => { setSelected(null); load(); };

    const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: p[k]===v ? '' : v }));

    return (
        <div className="fade-in">
            {selected && <AdminActionModal complaint={selected} onClose={()=>setSelected(null)} onDone={handleDone}/>}

            <div style={{ marginBottom:24 }}>
                <h2 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>🏦 Complaints Management</h2>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>Full oversight across all 3 tiers. Assign, resolve, escalate, and monitor SLA compliance.</p>
            </div>

            {/* Stats */}
            {stats && (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:10, marginBottom:24 }}>
                    {[
                        { label:'Total', value:stats.total, color:'var(--text-primary)' },
                        { label:'Open', value:stats.open, color:'#3b82f6' },
                        { label:'In Progress', value:stats.inProgress, color:'#f59e0b' },
                        { label:'Resolved', value:stats.resolved, color:'#10b981' },
                        { label:'Tier 1', value:stats.t1, color:'#3b82f6' },
                        { label:'Tier 2', value:stats.t2, color:'#f59e0b' },
                        { label:'Tier 3', value:stats.t3, color:'#ef4444' },
                        { label:'⚠️ SLA Breached', value:stats.breached, color:'#ef4444' },
                        { label:'🚨 RBI Flagged', value:stats.rbi, color:'#dc2626' },
                    ].map(s => (
                        <div key={s.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:10, padding:'12px 14px' }}>
                            <div style={{ fontSize:'1.5rem', fontWeight:800, color:s.color }}>{s.value}</div>
                            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:1 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tier filter pills */}
            <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
                {['TIER_1','TIER_2','TIER_3'].map(t => {
                    const m = TIER_META[t];
                    const active = filters.tier === t;
                    return (
                        <button key={t} onClick={() => setFilter('tier', t)} style={{ padding:'6px 14px', borderRadius:100, fontSize:'0.8rem', fontWeight: active?700:500, border:`1px solid ${active?m.color:'var(--border-strong)'}`, background:active?m.bg:'var(--bg-card)', color:active?m.color:'var(--text-secondary)', cursor:'pointer', fontFamily:'inherit' }}>
                            {m.label}
                        </button>
                    );
                })}
                {['OPEN','IN_PROGRESS','RESOLVED'].map(s => {
                    const active = filters.status === s;
                    const c = STATUS_COLOR[s];
                    return (
                        <button key={s} onClick={()=>setFilter('status',s)} style={{ padding:'6px 14px', borderRadius:100, fontSize:'0.8rem', fontWeight:active?700:500, border:`1px solid ${active?c:'var(--border-strong)'}`, background:active?`${c}18`:'var(--bg-card)', color:active?c:'var(--text-secondary)', cursor:'pointer', fontFamily:'inherit' }}>
                            {s.replace('_',' ')}
                        </button>
                    );
                })}
                {(filters.tier || filters.status) && (
                    <button onClick={()=>setFilters({tier:'',status:'',priority:''})} style={{ padding:'6px 14px', borderRadius:100, fontSize:'0.8rem', border:'1px solid var(--border-strong)', background:'var(--bg-card)', color:'var(--text-muted)', cursor:'pointer', fontFamily:'inherit' }}>
                        ✕ Clear
                    </button>
                )}
            </div>

            {/* Complaints list */}
            {loading ? (
                <div style={{ textAlign:'center', padding:60 }}><Loader size={28} style={{ animation:'spin 0.8s linear infinite', color:'var(--text-muted)' }}/></div>
            ) : complaints.length === 0 ? (
                <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>
                    <Shield size={44} style={{ marginBottom:12, opacity:0.4 }}/>
                    <p style={{ fontWeight:600 }}>No complaints match your filters</p>
                </div>
            ) : complaints.map(c => {
                const tier = TIER_META[c.tier] || TIER_META.TIER_1;
                const isRBI = c.escalatedToRBI;
                return (
                    <div key={c.id} style={{ background:'var(--bg-card)', border:`1px solid ${isRBI?'rgba(239,68,68,0.5)':c.tier==='TIER_3'?'rgba(239,68,68,0.25)':'var(--border-color)'}`, borderRadius:12, padding:'16px 20px', marginBottom:10, cursor:'pointer', transition:'all 0.15s' }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-strong)'}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=isRBI?'rgba(239,68,68,0.5)':c.tier==='TIER_3'?'rgba(239,68,68,0.25)':'var(--border-color)'}
                        onClick={()=>setSelected(c)}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                            <div style={{ flex:1 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5, flexWrap:'wrap' }}>
                                    <span style={{ fontSize:'0.72rem', fontFamily:'monospace', color:'var(--text-muted)' }}>{c.ticketNumber}</span>
                                    <span style={{ fontSize:'0.72rem', fontWeight:700, color:tier.color, background:tier.bg, padding:'2px 8px', borderRadius:100 }}>{tier.label}</span>
                                    <span style={{ fontSize:'0.72rem', fontWeight:700, color:STATUS_COLOR[c.status], background:`${STATUS_COLOR[c.status]}18`, padding:'2px 8px', borderRadius:100 }}>{c.status.replace('_',' ')}</span>
                                    <span style={{ fontSize:'0.72rem', fontWeight:700, color:PRIORITY_COLOR[c.priority] }}>● {c.priority}</span>
                                    {isRBI && <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#dc2626', background:'rgba(220,38,38,0.1)', padding:'2px 8px', borderRadius:100 }}>🚨 RBI FLAGGED</span>}
                                </div>
                                <div style={{ fontWeight:600, fontSize:'0.92rem', marginBottom:3 }}>{c.subject}</div>
                                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
                                    {c.user?.name} · {c.category} · Assigned: {c.assignedTo || 'Unassigned'} · {new Date(c.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                                </div>
                                <div style={{ marginTop:8, maxWidth:300 }}>
                                    <SLABar slaDeadline={c.slaDeadline} createdAt={c.createdAt}/>
                                </div>
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();setSelected(c);}}>Manage</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
