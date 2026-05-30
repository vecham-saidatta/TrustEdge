import { useState, useEffect } from 'react';
import { coreAPI } from '../api';
import { CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadTransactions(); }, [page, filter]);

    const loadTransactions = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15 };
            if (filter) params.type = filter;
            const res = await coreAPI.getTransactions(params);
            setTransactions(res.data.data);
            setPagination(res.data.pagination);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const categoryColors = {
        SALARY: 'green', RENT: 'red', FOOD: 'yellow', UTILITIES: 'blue',
        ENTERTAINMENT: 'purple', TRANSPORT: 'blue', EMERGENCY: 'red',
    };

    if (loading && transactions.length === 0) return <div className="loading-page"><div className="spinner" /></div>;

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>💳 Transaction History</h2>
                <p>All your financial transactions</p>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['', 'CREDIT', 'DEBIT'].map((t) => (
                    <button key={t} className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setFilter(t); setPage(1); }}>
                        {t || 'All'} {t === 'CREDIT' && '↑'} {t === 'DEBIT' && '↓'}
                    </button>
                ))}
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th style={{ textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn) => (
                                <tr key={txn.id}>
                                    <td>{new Date(txn.transactionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {txn.type === 'CREDIT' ? <ArrowUpRight size={14} color="var(--accent-green)" /> : <ArrowDownRight size={14} color="var(--accent-red)" />}
                                            <span className={`badge badge-${txn.type === 'CREDIT' ? 'green' : 'red'}`}>{txn.type}</span>
                                        </span>
                                    </td>
                                    <td><span className={`badge badge-${categoryColors[txn.category] || 'blue'}`}>{txn.category}</span></td>
                                    <td style={{ color: 'var(--text-primary)' }}>{txn.description || '—'}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: txn.type === 'CREDIT' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                        {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Page {page} of {pagination.totalPages}</span>
                        <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next →</button>
                    </div>
                )}
            </div>
        </div>
    );
}
