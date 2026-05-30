import React, { useState, useEffect } from 'react';

const statusBadgeStyle = {
  SENT:     { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', label: '📧 SENT' },
  ACCEPTED: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', label: '🟢 ACCEPTED' },
  DECLINED: { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', label: '🔴 DECLINED' },
  PENDING:  { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', label: '🟡 PENDING' },
};

export default function CampaignTrackerTab() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      // Mock historical data for campaigns if endpoint doesn't exist
      const mockOffers = [
        { id: '1', customerName: 'Arjun Sharma', offerName: 'EMI Relief Package', channel: 'RM_CALL', sentDate: '2026-05-29', status: 'ACCEPTED' },
        { id: '2', customerName: 'Deepak Verma', offerName: 'Digital Activation Bonus', channel: 'WHATSAPP', sentDate: '2026-05-28', status: 'SENT' },
        { id: '3', customerName: 'Meena Krishnan', offerName: 'Welcome Back FD', channel: 'EMAIL', sentDate: '2026-05-27', status: 'ACCEPTED' },
        { id: '4', customerName: 'Priya Sharma', offerName: 'FD Rate Boost — +0.5%', channel: 'WHATSAPP', sentDate: '2026-05-30', status: 'ACCEPTED' },
        { id: '5', customerName: 'Rahul Verma', offerName: 'EMI Relief Package', channel: 'RM_CALL', sentDate: '2026-05-30', status: 'SENT' },
      ];
      setOffers(mockOffers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(15, 23, 42, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600 }}>
          Retention Outreach Ledger
        </h3>
        <button
          onClick={fetchOffers}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          🔄 Refresh
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          color: '#cbd5e1',
          fontSize: '0.92rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.2)' }}>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Customer Name</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Offer Details</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Channel</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Outreach Date</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              const badge = statusBadgeStyle[offer.status] || statusBadgeStyle.SENT;
              return (
                <tr
                  key={offer.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '16px 24px', fontWeight: 600, color: '#f8fafc' }}>
                    {offer.customerName}
                  </td>
                  <td style={{ padding: '16px 24px', color: '#e2e8f0' }}>
                    {offer.offerName}
                  </td>
                  <td style={{ padding: '16px 24px', fontWeight: 500 }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.05)',
                      fontSize: '0.75rem',
                      color: '#cbd5e1'
                    }}>
                      {offer.channel}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#94a3b8' }}>
                    {offer.sentDate}
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: badge.bg,
                      color: badge.text,
                      whiteSpace: 'nowrap'
                    }}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
