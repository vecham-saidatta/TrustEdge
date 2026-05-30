import { useState, useEffect } from 'react';
import { complaintsAPI } from '../api';
import { Plus, X, ChevronRight, FileText, Clock, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const CATEGORIES = ['TRANSACTION','ACCOUNT','LOAN','CARD','SERVICE','FRAUD','OTHER'];
const PRIORITIES = ['LOW','MEDIUM','HIGH','URGENT'];

const STATUS_META = {
  OPEN:        { label: 'Open',        color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: AlertCircle },
  RESOLVED:    { label: 'Resolved',    color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: CheckCircle },
  CLOSED:      { label: 'Closed',      color: '#64748b', bg: 'rgba(100,116,139,0.12)',icon: XCircle },
};

const PRIORITY_META = {
  LOW:    { color: '#10b981' },
  MEDIUM: { color: '#f59e0b' },
  HIGH:   { color: '#f97316' },
  URGENT: { color: '#ef4444' },
};

function StatCard({ label, value, color }) {
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:12, padding:'16px 20px', flex:1 }}>
      <div style={{ fontSize:'1.6rem', fontWeight:800, color }}>{value}</div>
      <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.OPEN;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:100, fontSize:'0.75rem', fontWeight:600, background:m.bg, color:m.color }}>
      <m.icon size={12}/> {m.label}
    </span>
  );
}

function PriorityDot({ priority }) {
  const c = (PRIORITY_META[priority] || PRIORITY_META.MEDIUM).color;
  return <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:c, marginRight:4 }} />;
}

function SubmitModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ category:'TRANSACTION', subject:'', description:'', priority:'MEDIUM', attachmentNote:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) { setError('Subject and description are required.'); return; }
    setLoading(true); setError('');
    try {
      const res = await complaintsAPI.submit(form);
      onSuccess(res.data.data.complaint);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:560, maxHeight:'90vh', overflow:'auto', padding:32 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h3 style={{ fontSize:'1.1rem', fontWeight:700 }}>Submit a Complaint</h3>
            <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginTop:2 }}>We typically respond within 2–3 business days.</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}><X size={20}/></button>
        </div>

        {error && <div style={{ background:'rgba(239,68,68,0.12)', color:'#ef4444', padding:'10px 14px', borderRadius:8, fontSize:'0.85rem', marginBottom:16 }}>{error}</div>}

        <form onSubmit={submit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
            <div>
              <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Category *</label>
              <select className="form-input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0)+c.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Priority</label>
              <select className="form-input" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0)+p.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Subject *</label>
            <input className="form-input" placeholder="Brief summary of your issue..." value={form.subject} onChange={e => set('subject', e.target.value)} maxLength={120} />
          </div>

          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Description *</label>
            <textarea className="form-input" rows={5} placeholder="Describe your issue in detail — include dates, amounts, transaction IDs if applicable..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize:'vertical' }} />
          </div>

          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px' }}>Supporting Information (optional)</label>
            <input className="form-input" placeholder="e.g. Transaction ID: TXN123456, Screenshot filename..." value={form.attachmentNote} onChange={e => set('attachmentNote', e.target.value)} />
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex:1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex:2 }} disabled={loading}>
              {loading ? <><Loader size={16} style={{ animation:'spin 0.8s linear infinite' }}/> Submitting...</> : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailModal({ complaint, onClose, onWithdraw }) {
  const [withdrawing, setWithdrawing] = useState(false);

  const doWithdraw = async () => {
    if (!window.confirm('Withdraw this complaint?')) return;
    setWithdrawing(true);
    try { await onWithdraw(complaint.id); onClose(); }
    catch { setWithdrawing(false); }
  };

  const canWithdraw = complaint.status === 'OPEN' || complaint.status === 'IN_PROGRESS';

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:20, width:'100%', maxWidth:580, maxHeight:'90vh', overflow:'auto', padding:32 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
          <div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:4 }}>{complaint.ticketNumber}</div>
            <h3 style={{ fontSize:'1.1rem', fontWeight:700 }}>{complaint.subject}</h3>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', flexShrink:0 }}><X size={20}/></button>
        </div>

        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
          <StatusBadge status={complaint.status} />
          <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:100, fontSize:'0.75rem', fontWeight:600, background:'var(--bg-secondary)', color:'var(--text-secondary)' }}>
            <PriorityDot priority={complaint.priority}/>{complaint.priority}
          </span>
          <span style={{ display:'inline-flex', alignItems:'center', padding:'4px 10px', borderRadius:100, fontSize:'0.75rem', background:'var(--bg-secondary)', color:'var(--text-secondary)' }}>
            {complaint.category}
          </span>
        </div>

        <div style={{ background:'var(--bg-secondary)', borderRadius:10, padding:16, marginBottom:16 }}>
          <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:6, fontWeight:600, textTransform:'uppercase' }}>Your Description</div>
          <p style={{ fontSize:'0.9rem', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{complaint.description}</p>
        </div>

        {complaint.attachmentNote && (
          <div style={{ background:'var(--bg-secondary)', borderRadius:10, padding:12, marginBottom:16, fontSize:'0.85rem', color:'var(--text-secondary)' }}>
            📎 {complaint.attachmentNote}
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
          {[
            ['Submitted', new Date(complaint.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })],
            ['Assigned To', complaint.assignedTo || '—'],
            ['Channel', complaint.channel],
            ['Last Updated', new Date(complaint.updatedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })],
          ].map(([k, v]) => (
            <div key={k} style={{ background:'var(--bg-secondary)', borderRadius:8, padding:'10px 14px' }}>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:'0.85rem', fontWeight:500 }}>{v}</div>
            </div>
          ))}
        </div>

        {complaint.resolution && (
          <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:10, padding:16, marginBottom:20 }}>
            <div style={{ fontSize:'0.75rem', color:'#10b981', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>✅ Resolution</div>
            <p style={{ fontSize:'0.9rem', lineHeight:1.6 }}>{complaint.resolution}</p>
            {complaint.resolvedAt && <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:8 }}>Resolved on {new Date(complaint.resolvedAt).toLocaleDateString('en-IN')}</div>}
          </div>
        )}

        {canWithdraw && (
          <button onClick={doWithdraw} disabled={withdrawing} style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#ef4444', fontFamily:'inherit', fontWeight:600, fontSize:'0.85rem', cursor:'pointer' }}>
            {withdrawing ? 'Withdrawing...' : 'Withdraw Complaint'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        complaintsAPI.getAll({ status: filterStatus || undefined }),
        complaintsAPI.getStats(),
      ]);
      setComplaints(cRes.data.data || []);
      setStats(sRes.data.data.stats);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleSuccess = (c) => {
    setShowSubmit(false);
    setSuccess(`Complaint submitted! Ticket: ${c.ticketNumber}`);
    load();
    setTimeout(() => setSuccess(''), 5000);
  };

  const handleWithdraw = async (id) => {
    await complaintsAPI.withdraw(id);
    load();
  };

  const STATUS_FILTERS = [{ v:'', l:'All' }, { v:'OPEN', l:'Open' }, { v:'IN_PROGRESS', l:'In Progress' }, { v:'RESOLVED', l:'Resolved' }, { v:'CLOSED', l:'Closed' }];

  return (
    <div className="fade-in">
      {showSubmit && <SubmitModal onClose={() => setShowSubmit(false)} onSuccess={handleSuccess} />}
      {selected && <DetailModal complaint={selected} onClose={() => setSelected(null)} onWithdraw={handleWithdraw} />}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:4 }}>🗂️ Complaints & Support</h2>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Track your complaints and service requests in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowSubmit(true)} style={{ gap:8 }}>
          <Plus size={16}/> New Complaint
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div style={{ background:'rgba(16,185,129,0.12)', border:'1px solid rgba(16,185,129,0.3)', color:'#10b981', padding:'12px 16px', borderRadius:10, marginBottom:20, fontSize:'0.9rem', fontWeight:500 }}>
          ✅ {success}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
          <StatCard label="Total Tickets" value={stats.total} color="var(--text-primary)" />
          <StatCard label="Open" value={stats.open} color="#3b82f6" />
          <StatCard label="In Progress" value={stats.inProgress} color="#f59e0b" />
          <StatCard label="Resolved" value={stats.resolved} color="#10b981" />
        </div>
      )}

      {/* Info banner */}
      <div style={{ background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', gap:12, alignItems:'flex-start' }}>
        <span style={{ fontSize:'1.2rem' }}>ℹ️</span>
        <div style={{ fontSize:'0.83rem', color:'var(--text-secondary)', lineHeight:1.5 }}>
          <strong style={{ color:'var(--text-primary)' }}>RBI Grievance Redressal:</strong> All complaints are addressed within 30 days as per RBI Banking Ombudsman guidelines. For urgent matters, call our 24×7 helpline: <strong style={{ color:'var(--accent-blue)' }}>1800-XXX-XXXX</strong> (toll-free).
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {STATUS_FILTERS.map(f => (
          <button key={f.v} onClick={() => setFilterStatus(f.v)} style={{ padding:'6px 16px', borderRadius:100, fontSize:'0.82rem', fontWeight:filterStatus === f.v ? 700 : 500, border: filterStatus === f.v ? '1px solid var(--accent-blue)' : '1px solid var(--border-strong)', background: filterStatus === f.v ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)', color: filterStatus === f.v ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
            {f.l}
          </button>
        ))}
      </div>

      {/* Complaints list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {loading ? (
          <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}><Loader size={28} style={{ animation:'spin 0.8s linear infinite' }}/></div>
        ) : complaints.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>
            <FileText size={44} style={{ marginBottom:12, opacity:0.4 }}/>
            <p style={{ fontWeight:600, marginBottom:6 }}>No complaints found</p>
            <p style={{ fontSize:'0.85rem' }}>You haven't submitted any complaints yet.</p>
            <button className="btn btn-primary" style={{ marginTop:16 }} onClick={() => setShowSubmit(true)}>+ Raise a Complaint</button>
          </div>
        ) : complaints.map(c => (
          <div key={c.id} onClick={() => setSelected(c)} style={{ background:'var(--bg-card)', border:'1px solid var(--border-color)', borderRadius:12, padding:'16px 20px', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:16 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <div style={{ width:40, height:40, borderRadius:10, background:'var(--bg-secondary)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <FileText size={18} color="var(--text-muted)"/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'monospace' }}>{c.ticketNumber}</span>
                <StatusBadge status={c.status}/>
                <span style={{ fontSize:'0.72rem', color: (PRIORITY_META[c.priority]||PRIORITY_META.MEDIUM).color, fontWeight:600 }}><PriorityDot priority={c.priority}/>{c.priority}</span>
              </div>
              <div style={{ fontWeight:600, fontSize:'0.92rem', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.subject}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{c.category} · {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink:0 }}/>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div style={{ marginTop:24, padding:'14px 18px', background:'var(--bg-secondary)', borderRadius:10, fontSize:'0.8rem', color:'var(--text-muted)', lineHeight:1.6 }}>
        🔒 <strong style={{ color:'var(--text-primary)' }}>Your data is protected.</strong> All complaints are encrypted and handled by our dedicated support team in strict confidence. Reference our <span style={{ color:'var(--accent-blue)', cursor:'pointer' }}>Privacy Policy</span> for more information.
      </div>
    </div>
  );
}
