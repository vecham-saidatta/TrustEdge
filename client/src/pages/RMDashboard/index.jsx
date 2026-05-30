import React, { useState, useEffect } from 'react';
import SummaryMetricCards from './SummaryMetricCards';
import AtRiskCustomersTable from './AtRiskCustomersTable';
import CustomerDetailView from './CustomerDetailView';
import SendOutreachModal from './SendOutreachModal';
import CampaignTrackerTab from './CampaignTrackerTab';

export default function RMDashboard() {
  const [activeTab, setActiveTab] = useState('cohort'); // 'cohort' or 'campaigns'
  const [summary, setSummary] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Selected customer for detailed view/drawer
  const [selectedDetailCust, setSelectedDetailCust] = useState(null);
  // Selected customer for outreach message simulation modal
  const [selectedOutreachCust, setSelectedOutreachCust] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/v1', '') : 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/at-risk-customers?limit=20&minScore=0.45`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setSummary(data.summary);
      setCustomers(data.customers);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load at-risk customers queue. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (customer) => {
    setSelectedDetailCust(customer);
  };

  const handleOpenOutreach = (customer) => {
    setSelectedOutreachCust(customer);
  };

  return (
    <div style={{
      padding: '24px 30px',
      background: '#0a0e1a',
      minHeight: '100vh',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: '16px'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Relationship Manager Workspace
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            TrustEdge AI Churn Diagnostics & Dynamic Retention Console
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.85rem',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
        >
          🔄 Refresh Feed
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryMetricCards summary={summary} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <button
          onClick={() => setActiveTab('cohort')}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === 'cohort' ? '#3b82f6' : '#94a3b8',
            borderBottom: activeTab === 'cohort' ? '2px solid #3b82f6' : '2px solid transparent',
            padding: '10px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          🎯 At-Risk Queue
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          style={{
            background: 'transparent',
            border: 'none',
            color: activeTab === 'campaigns' ? '#3b82f6' : '#94a3b8',
            borderBottom: activeTab === 'campaigns' ? '2px solid #3b82f6' : '2px solid transparent',
            padding: '10px 16px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          📢 Campaign Ledger
        </button>
      </div>

      {/* Content */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          padding: '14px 20px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '20px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          <div className="spinner" style={{ margin: '0 auto 16px auto', width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite' }} />
          Loading at-risk accounts queue...
        </div>
      ) : (
        activeTab === 'cohort' ? (
          <AtRiskCustomersTable
            customers={customers}
            onViewDetail={handleOpenDetail}
            onSendOutreach={handleOpenOutreach}
          />
        ) : (
          <CampaignTrackerTab />
        )
      )}

      {/* Customer detail panel drawer */}
      <CustomerDetailView
        isOpen={!!selectedDetailCust}
        customer={selectedDetailCust}
        onClose={() => setSelectedDetailCust(null)}
        onSendOutreach={(cust) => {
          setSelectedDetailCust(null);
          handleOpenOutreach(cust);
        }}
      />

      {/* Send outreach simulation modal */}
      <SendOutreachModal
        isOpen={!!selectedOutreachCust}
        customer={selectedOutreachCust}
        onClose={() => setSelectedOutreachCust(null)}
        onRefresh={fetchDashboardData}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
