import { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, Shield, User, Phone, MapPin, CreditCard, FileText, Users } from 'lucide-react';
import { authAPI } from '../api';

// ── Helpers ────────────────────────────────────
const mask = (str, show = 4) => {
    if (!str) return '—';
    const clean = str.replace(/[-\s]/g, '');
    return '•'.repeat(Math.max(0, clean.length - show)) + clean.slice(-show);
};

const maskPAN = (pan) => {
    if (!pan) return '—';
    return pan.slice(0, 2) + '•••••' + pan.slice(-3);
};

const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const fmtCurrency = (n) => {
    if (n == null) return '—';
    return '₹' + Number(n).toLocaleString('en-IN');
};

const calcAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const age = Math.floor((new Date() - birth) / (365.25 * 24 * 3600 * 1000));
    return age;
};

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const copy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px 4px', borderRadius: 4 }}>
            {copied ? <CheckCircle size={12} color="#10b981" /> : <Copy size={12} />}
        </button>
    );
}

function InfoRow({ label, value, sensitive, copyable, mono }) {
    const [revealed, setReveal] = useState(false);
    const display = sensitive && !revealed ? mask(value) : value || '—';
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flex: 1 }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, fontFamily: mono ? 'monospace' : 'inherit', color: 'var(--text-primary)' }}>{display}</span>
                {sensitive && (
                    <button onClick={() => setReveal(r => !r)} style={{ background: 'none', cursor: 'pointer', fontSize: '0.7rem', color: 'var(--accent-blue)', padding: '1px 5px', borderRadius: 4, border: '1px solid rgba(59,130,246,0.3)' }}>
                        {revealed ? 'Hide' : 'View'}
                    </button>
                )}
                {copyable && value && <CopyButton text={value} />}
            </div>
        </div>
    );
}

function Section({ icon: Icon, title, children, color = '#3b82f6' }) {
    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${color}22` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={14} color={color} />
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
            </div>
            {children}
        </div>
    );
}

export default function ProfilePanel({ onClose }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        authAPI.me().then(res => {
            setProfile(res.data.data?.user || res.data.data || res.data.user || res.data);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    const KYC_COLOR = { VERIFIED: '#10b981', PENDING: '#f59e0b', REJECTED: '#ef4444' };
    const kycColor = KYC_COLOR[profile?.kycStatus] || '#64748b';

    const TABS = [
        { key: 'personal', label: 'Personal' },
        { key: 'account', label: 'Account' },
        { key: 'kyc', label: 'KYC & Docs' },
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex' }}>
            {/* Backdrop */}
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />

            {/* Drawer panel */}
            <div style={{ width: 420, background: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', animation: 'slideInRight 0.25s ease' }}>
                {/* Header */}
                <div style={{ padding: '20px 24px 0', background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>My Profile</div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                    </div>

                    {loading ? (
                        <div style={{ height: 80 }} />
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 4px 14px rgba(59,130,246,0.4)' }}>
                                {initials}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 3 }}>{profile?.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 5 }}>{profile?.email}</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 100, background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>{profile?.role}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Financial snapshot — balance only */}
                    {profile?.financialProfile && (
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Balance</span>
                                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#3b82f6' }}>{fmtCurrency(profile.financialProfile.currentBalance)}</span>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: 'none', gap: 0 }}>
                        {TABS.map(t => (
                            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === t.key ? '#3b82f6' : 'transparent'}`, color: activeTab === t.key ? '#3b82f6' : 'var(--text-muted)', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: activeTab === t.key ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s' }}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 24px', flex: 1 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</div>
                    ) : (
                        <>
                            {/* ── PERSONAL TAB ── */}
                            {activeTab === 'personal' && (
                                <div>
                                    <Section icon={User} title="Personal Information" color="#3b82f6">
                                        <InfoRow label="Full Name" value={profile?.name} copyable />
                                        <InfoRow label="Date of Birth" value={fmtDate(profile?.dateOfBirth)} />
                                        {profile?.dateOfBirth && <InfoRow label="Age" value={`${calcAge(profile.dateOfBirth)} years`} />}
                                        <InfoRow label="Gender" value={profile?.gender ? (profile.gender.charAt(0) + profile.gender.slice(1).toLowerCase()) : '—'} />
                                        <InfoRow label="Email Address" value={profile?.email} copyable />
                                        <InfoRow label="Mobile Number" value={profile?.phone} copyable />
                                    </Section>

                                    <Section icon={MapPin} title="Address" color="#8b5cf6">
                                        <InfoRow label="Address" value={profile?.address} />
                                        <InfoRow label="City" value={profile?.city} />
                                        <InfoRow label="State" value={profile?.state} />
                                        <InfoRow label="Pincode" value={profile?.pincode} mono />
                                    </Section>

                                    {(profile?.nomineeName) && (
                                        <Section icon={Users} title="Nominee Details" color="#06b6d4">
                                            <InfoRow label="Nominee Name" value={profile?.nomineeName} />
                                            <InfoRow label="Relationship" value={profile?.nomineeRelation} />
                                        </Section>
                                    )}
                                </div>
                            )}

                            {/* ── ACCOUNT TAB ── */}
                            {activeTab === 'account' && (
                                <div>
                                    <Section icon={CreditCard} title="Account Details" color="#10b981">
                                        <InfoRow label="Account Number" value={profile?.accountNumber} sensitive copyable mono />
                                        <InfoRow label="Account Type" value={profile?.accountType} />
                                        <InfoRow label="IFSC Code" value={profile?.ifscCode} copyable mono />
                                        <InfoRow label="Branch Name" value={profile?.branchName} />
                                        <InfoRow label="Bank Name" value="TrustEdge Bank Ltd." />
                                        <InfoRow label="Member Since" value={fmtDate(profile?.createdAt)} />
                                    </Section>

                                    {/* Mini passbook style */}
                                    {profile?.financialProfile && (
                                        <Section icon={FileText} title="Account Summary" color="#f59e0b">
                                            <InfoRow label="Available Balance" value={fmtCurrency(profile.financialProfile.currentBalance)} />
                                            <InfoRow label="Monthly Income (avg)" value={fmtCurrency(profile.financialProfile.monthlyIncome)} />
                                            <InfoRow label="Financial Health" value={profile.financialProfile.stressLevel} />
                                            <InfoRow label="Risk Score" value={`${(profile.financialProfile.riskScore * 100).toFixed(0)}%`} />
                                        </Section>
                                    )}

                                    {/* Net banking notice */}
                                    <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        🔐 <strong style={{ color: 'var(--text-primary)' }}>Net Banking Enabled.</strong> For NEFT/RTGS/IMPS transfers, use the account number and IFSC code above. Daily transfer limit: ₹10,00,000.
                                    </div>
                                </div>
                            )}

                            {/* ── KYC TAB ── */}
                            {activeTab === 'kyc' && (
                                <div>
                                    {/* KYC Status Card */}
                                    <div style={{ background: `${kycColor}10`, border: `1px solid ${kycColor}30`, borderRadius: 12, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <Shield size={28} color={kycColor} />
                                        <div>
                                            <div style={{ fontWeight: 700, color: kycColor, fontSize: '0.95rem' }}>
                                                {profile?.kycStatus === 'VERIFIED' ? '✓ KYC Verified' : profile?.kycStatus === 'PENDING' ? '⏳ KYC Pending' : '✗ KYC Rejected'}
                                            </div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                                {profile?.kycStatus === 'VERIFIED' ? `Verified on ${fmtDate(profile?.kycVerifiedAt)}` : 'Please complete KYC verification'}
                                            </div>
                                        </div>
                                    </div>

                                    <Section icon={FileText} title="Identity Documents" color="#f97316">
                                        <InfoRow label="PAN Number" value={maskPAN(profile?.panNumber)} copyable={false} />
                                        <InfoRow label="Aadhaar Number" value={profile?.aadhaarNumber} sensitive mono />
                                        <InfoRow label="KYC Status" value={profile?.kycStatus || '—'} />
                                        <InfoRow label="KYC Date" value={fmtDate(profile?.kycVerifiedAt)} />
                                    </Section>

                                    {/* Regulatory notice */}
                                    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        ⚠️ <strong style={{ color: 'var(--text-primary)' }}>RBI KYC Compliance:</strong> As per RBI guidelines, KYC must be updated every 8 years for low-risk customers and every 2 years for high-risk customers. <span style={{ color: '#3b82f6', cursor: 'pointer' }}>Update KYC</span>
                                    </div>

                                    <div style={{ marginTop: 16, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                        🔒 <strong style={{ color: 'var(--text-primary)' }}>Data Protection:</strong> Your PAN and Aadhaar data is encrypted at rest and never shared with third parties. Compliant with DPDP Act 2023.
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.82rem' }} onClick={onClose}>Close</button>
                    <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.82rem' }}>Edit Profile</button>
                </div>
            </div>
        </div>
    );
}
