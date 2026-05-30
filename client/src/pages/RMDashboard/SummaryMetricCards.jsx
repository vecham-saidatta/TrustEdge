import React from 'react';

export default function SummaryMetricCards({ summary, activeCampaigns = 2 }) {
  const totalAtRisk = summary?.totalAtRisk || 0;
  const avgChurnProbability = summary?.avgChurnProbability || 0;
  const totalRevenueAtRisk = summary?.totalRevenueAtRisk || 0;

  const CARDS = [
    {
      key: 'totalAtRisk',
      label: 'At-Risk Customers',
      value: totalAtRisk.toString(),
      icon: '⚠️',
      color: '#EF4444',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
    },
    {
      key: 'avgChurnProbability',
      label: 'Avg Churn Probability',
      value: `${(avgChurnProbability * 100).toFixed(1)}%`,
      icon: '📊',
      color: '#F97316',
      bgGlow: 'rgba(249, 115, 22, 0.15)',
    },
    {
      key: 'totalRevenueAtRisk',
      label: 'Revenue at Risk',
      value: `₹${(totalRevenueAtRisk / 100000).toFixed(2)} L`,
      icon: '₹',
      color: '#8B5CF6',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
    },
    {
      key: 'activeCampaigns',
      label: 'Campaigns Active',
      value: activeCampaigns.toString(),
      icon: '📣',
      color: '#10B981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    }}>
      {CARDS.map((card) => (
        <div
          key={card.key}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 6px 24px ${card.bgGlow}`;
            e.currentTarget.style.borderColor = card.color;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <div>
            <div style={{
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              {card.label}
            </div>
            <div style={{
              color: '#f8fafc',
              fontSize: '1.75rem',
              fontWeight: '700',
            }}>
              {card.value}
            </div>
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: card.bgGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: card.color,
          }}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
