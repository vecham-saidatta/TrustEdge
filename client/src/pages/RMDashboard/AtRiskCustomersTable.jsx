import React from 'react';

const riskBadgeStyle = {
  AT_RISK:  { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', label: '🔴 AT RISK' },
  DORMANT:  { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', label: '🟡 DORMANT' },
  STABLE:   { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', label: '🟢 STABLE'  },
  CRITICAL: { bg: 'rgba(220, 38, 38, 0.2)', text: '#DC2626', label: '💀 CRITICAL' },
};

export default function AtRiskCustomersTable({ customers, onViewDetail, onSendOutreach }) {
  const churnScoreBar = (score) => {
    const color = score > 0.75 ? '#EF4444' : score > 0.50 ? '#F97316' : '#10B981';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '80px',
          height: '6px',
          borderRadius: '3px',
          background: '#334155',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${score * 100}%`,
            height: '100%',
            background: color,
            borderRadius: '3px',
          }} />
        </div>
        <span style={{ color, fontWeight: 700, fontSize: '0.9rem' }}>
          {(score * 100).toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
      marginBottom: '30px',
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
          At-Risk Cohort (Live Queue)
        </h3>
        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Real-time disengagement alerts (RBI compliant)
        </span>
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
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Churn Score</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Risk Level</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Top Risk Driver</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600 }}>Recommended Action</th>
              <th style={{ padding: '16px 24px', color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No at-risk customers found matching criteria.
                </td>
              </tr>
            ) : (
              customers.map((cust) => {
                const badge = riskBadgeStyle[cust.riskLevel] || riskBadgeStyle.STABLE;
                return (
                  <tr
                    key={cust.customerId}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#f8fafc' }}>
                      {cust.customerName}
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>
                        {cust.accountType} · {cust.branchName}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      {churnScoreBar(cust.churnProbability)}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
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
                    <td style={{ padding: '16px 24px', color: '#e2e8f0', fontWeight: '500' }}>
                      {cust.topRiskFactor}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#94a3b8', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cust.recommendedAction}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <button
                        onClick={() => onViewDetail(cust)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#f8fafc',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 500,
                          fontSize: '0.85rem',
                          marginRight: '8px',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                      >
                        View Detail
                      </button>
                      <button
                        onClick={() => onSendOutreach(cust)}
                        style={{
                          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                        onMouseLeave={e => e.currentTarget.style.opacity = 1}
                      >
                        Send Outreach
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
