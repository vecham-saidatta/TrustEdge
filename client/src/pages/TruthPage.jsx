import { useState, useEffect } from 'react';
import { truthAPI } from '../api';
import { Scale, AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function TruthPage() {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [comparison, setComparison] = useState(null);
    const [loanAmount, setLoanAmount] = useState(200000);
    const [tenure, setTenure] = useState(24);
    const [loading, setLoading] = useState(true);
    const [comparing, setComparing] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const res = await truthAPI.getProducts({ limit: 50 });
                setProducts(res.data.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        }
        load();
    }, []);

    const runComparison = async (productId) => {
        setComparing(true);
        setComparison(null);
        try {
            const res = await truthAPI.compare({ productId, loanAmount: Number(loanAmount), tenureMonths: Number(tenure) });
            setComparison(res.data.data.comparison);
        } catch (e) { console.error(e); }
        finally { setComparing(false); }
    };

    const filteredProducts = filter ? products.filter(p => p.type === filter) : products;

    const verdictConfig = {
        RECOMMENDED: { color: 'green', icon: <CheckCircle size={32} />, label: '✅ RECOMMENDED' },
        CAUTION: { color: 'yellow', icon: <AlertTriangle size={32} />, label: '⚠️ CAUTION' },
        AVOID: { color: 'red', icon: <XCircle size={32} />, label: '🚫 AVOID' },
    };

    if (loading) return <div className="loading-page"><div className="spinner" /></div>;

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>⚖️ TRUTH — Product Comparison</h2>
                <p>Honest, unbiased analysis of financial products. We'll tell you the truth — even if it hurts.</p>
            </div>

            {/* Filters + Params */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                {['', 'LOAN', 'CREDIT_CARD', 'SAVINGS'].map((t) => (
                    <button key={t} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(t)}>
                        {t ? t.replace('_', ' ') : 'All'}
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div>
                        <label className="form-label" style={{ marginBottom: 2 }}>Amount (₹)</label>
                        <input className="form-input" type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} style={{ width: 120, padding: '8px 12px' }} />
                    </div>
                    <div>
                        <label className="form-label" style={{ marginBottom: 2 }}>Tenure (mo)</label>
                        <input className="form-input" type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} style={{ width: 80, padding: '8px 12px' }} />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid" style={{ marginBottom: 32 }}>
                {filteredProducts.map((p) => (
                    <div key={p.id} className="product-card" onClick={() => { setSelected(p); runComparison(p.id); }}>
                        <div className="product-provider">{p.provider}</div>
                        <h3>{p.name}</h3>
                        <div className="rate">{p.interestRate}% <span>APR</span></div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                            <span className={`badge badge-${p.riskLevel === 'HIGH' ? 'red' : p.riskLevel === 'MEDIUM' ? 'yellow' : 'green'}`}>{p.riskLevel} risk</span>
                            <span className="badge badge-blue">{p.type.replace('_', ' ')}</span>
                        </div>
                        {(p.processingFee > 0 || p.annualFee > 0 || p.prepaymentPenalty > 0) && (
                            <div style={{ marginTop: 10, fontSize: '0.75rem', color: 'var(--accent-yellow)' }}>
                                ⚠️ Hidden fees detected
                            </div>
                        )}
                        <button className="btn btn-primary btn-sm" style={{ marginTop: 12, width: '100%' }}>
                            Analyze <ArrowRight size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Comparison Result */}
            {comparing && (
                <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                    <div className="spinner" style={{ margin: '0 auto 16px' }} />
                    <p>Analyzing product...</p>
                </div>
            )}

            {comparison && !comparing && (
                <div className="card fade-in" style={{ marginBottom: 32 }}>
                    <div className="card-header">
                        <div className="card-title"><Scale size={18} /> Analysis Result</div>
                    </div>

                    <div className={`verdict-card ${comparison.verdict.toLowerCase()}`} style={{ marginBottom: 24 }}>
                        {verdictConfig[comparison.verdict]?.icon}
                        <h3 style={{ color: comparison.verdict === 'RECOMMENDED' ? 'var(--accent-green)' : comparison.verdict === 'CAUTION' ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                            {verdictConfig[comparison.verdict]?.label}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selected?.name} by {selected?.provider}</p>
                    </div>

                    <div className="stat-grid" style={{ marginBottom: 24 }}>
                        <div className="stat-card blue">
                            <div className="stat-value">₹{comparison.totalCost?.toLocaleString()}</div>
                            <div className="stat-label">Total Cost</div>
                        </div>
                        <div className="stat-card yellow">
                            <div className="stat-value">₹{comparison.hiddenFeesTotal?.toLocaleString()}</div>
                            <div className="stat-label">Hidden Fees</div>
                        </div>
                    </div>

                    <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', padding: 20 }}>
                        <h4 style={{ marginBottom: 12, fontSize: '0.9rem' }}>📋 Detailed Analysis</h4>
                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'Inter, sans-serif' }}>
                            {comparison.reasoning}
                        </pre>
                    </div>

                    {comparison.betterAlternative && (
                        <div style={{ marginTop: 20, padding: 20, background: 'var(--accent-green-soft)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-green)' }}>
                            <h4 style={{ color: 'var(--accent-green)', marginBottom: 8 }}>🏆 Better Alternative Found</h4>
                            <p><strong>{comparison.betterAlternative.name}</strong> by {comparison.betterAlternative.provider}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interest: {comparison.betterAlternative.interestRate}% | No prepayment penalty</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
