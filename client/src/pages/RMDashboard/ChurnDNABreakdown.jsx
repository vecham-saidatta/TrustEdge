import React from 'react';

export default function ChurnDNABreakdown({ dna }) {
  const feeSensitivity = (dna?.fee_sensitivity || 0) * 100;
  const digitalAdoption = (dna?.digital_adoption || 0) * 100;
  const complaintVelocity = (dna?.complaint_velocity || 0) * 100;

  const data = [
    { label: 'Fee Sensitivity', value: feeSensitivity, color: '#EF4444' },
    { label: 'Digital Disengagement', value: digitalAdoption, color: '#3B82F6' },
    { label: 'Complaint Velocity', value: complaintVelocity, color: '#F59E0B' },
  ];

  // Determine dominant driver
  const dominant = data.reduce((max, item) => item.value > max.value ? item : max, data[0]);

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '20px',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#f8fafc', fontSize: '0.95rem', fontWeight: 600 }}>
        Churn DNA Breakdown
      </h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.map((item) => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px', color: '#94a3b8' }}>
              <span>{item.label}</span>
              <span style={{ color: item.color, fontWeight: 700 }}>{item.value.toFixed(0)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: '#1e293b',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${item.value}%`,
                height: '100%',
                background: item.color,
                borderRadius: '4px',
                transition: 'width 0.5s ease-out'
              }} />
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: '20px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.8rem',
        color: '#cbd5e1'
      }}>
        Primary Driver: <strong style={{ color: dominant.color, textTransform: 'uppercase' }}>{dominant.label}</strong>
      </div>
    </div>
  );
}
