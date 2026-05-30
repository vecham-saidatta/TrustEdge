import React from 'react';
import ChurnDNABreakdown from './ChurnDNABreakdown';
import RiskCurveChart from './RiskCurveChart';

export default function CustomerDetailView({ isOpen, customer, onClose, onSendOutreach }) {
  if (!isOpen || !customer) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      maxWidth: '650px',
      height: '100%',
      backgroundColor: '#0a0e1a',
      borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.6)',
      zIndex: 999,
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '20px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#f8fafc', fontSize: '1.4rem', fontWeight: 700 }}>
            Customer Insights: {customer.customerName}
          </h2>
          <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.82rem', color: '#64748b' }}>
            <span>ID: {customer.customerId.substring(0, 8)}...</span>
            <span>·</span>
            <span>Branch: {customer.branchName}</span>
            <span>·</span>
            <span>Account: {customer.accountType}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
      </div>

      {/* Grid containing DNA and Risk Curve */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px',
        marginBottom: '30px'
      }}>
        {/* Panel A: Churn DNA */}
        <div>
          <ChurnDNABreakdown dna={customer.churnDna} />
        </div>

        {/* Panel B: 90-day curve */}
        <div>
          <RiskCurveChart baseRisk={customer.churnProbability} />
        </div>
      </div>

      {/* Panel C: SAGE Recommendation */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.6) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#c084fc',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '16px'
        }}>
          <span>🤖</span> SAGE Retentive Intelligence Recommendation
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#cbd5e1', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: '#94a3b8', display: 'inline-block', width: '90px' }}>Action:</span>
            <strong style={{ color: '#f8fafc' }}>{customer.recommendedAction}</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8', display: 'inline-block', width: '90px' }}>Channel:</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.78rem',
              color: '#3b82f6',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              {customer.suggestedChannel}
            </span>
          </div>
          <div>
            <span style={{ color: '#94a3b8', display: 'inline-block', width: '90px' }}>Offer details:</span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{customer.suggestedOffer}</span>
          </div>
        </div>

        <button
          onClick={() => onSendOutreach(customer)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
            border: 'none',
            color: '#ffffff',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            marginTop: '20px',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          Send Outreach via {customer.suggestedChannel.replace('_', ' ')}
        </button>
      </div>
    </div>
  );
}
