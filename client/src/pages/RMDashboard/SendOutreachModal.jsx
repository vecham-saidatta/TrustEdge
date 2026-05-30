import React, { useState, useEffect } from 'react';

export default function SendOutreachModal({ isOpen, customer, onClose, onRefresh }) {
  const [channel, setChannel] = useState('WHATSAPP');
  const [loading, setLoading] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [status, setStatus] = useState('SENT'); // 'SENT' or 'ACCEPTED'

  useEffect(() => {
    if (isOpen && customer) {
      // Auto-set recommended channel or fallback to WHATSAPP
      setChannel(customer.suggestedChannel || 'WHATSAPP');
      setStatus('SENT');
      setMessageData(null);
      fetchOutreach(customer.customerId, customer.suggestedChannel || 'WHATSAPP');
    }
  }, [isOpen, customer]);

  const fetchOutreach = async (customerId, currentChannel) => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulate-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, channel: currentChannel }),
      });
      const data = await response.json();
      setMessageData(data);
    } catch (err) {
      console.error('Failed to simulate outreach:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelChange = (newChannel) => {
    setChannel(newChannel);
    if (customer) {
      fetchOutreach(customer.customerId, newChannel);
    }
  };

  const handleMarkAccepted = async () => {
    if (!messageData || !messageData.offerId) return;
    try {
      const response = await fetch(`/api/retention-offers/${messageData.offerId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerResponse: 'ACCEPTED' }),
      });
      if (response.ok) {
        setStatus('ACCEPTED');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Failed to accept offer:', err);
    }
  };

  if (!isOpen || !customer) return null;

  const renderMessageBubble = () => {
    if (loading) {
      return (
        <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
          <div className="spinner" style={{ margin: '0 auto 10px auto', width: '24px', height: '24px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#3B82F6', animation: 'spin 1s linear infinite' }} />
          SAGE Empathy Engine compiling talktrack...
        </div>
      );
    }

    if (!messageData) return null;

    if (channel === 'WHATSAPP') {
      return (
        <div style={{
          background: '#075E54',
          borderRadius: '12px',
          padding: '16px',
          color: '#ffffff',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          maxWidth: '450px',
          margin: '20px auto 0 auto',
          fontFamily: 'Segoe UI, Helvetica, sans-serif'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#128C7E', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💬 WhatsApp Message Simulation
          </div>
          <div style={{
            background: '#DCF8C6',
            color: '#303030',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.9rem',
            whiteSpace: 'pre-line',
            lineHeight: '1.4'
          }}>
            {messageData.message}
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#a0a0a0', marginTop: '6px' }}>
            Sent via TrustEdge Twilio Gateway
          </div>
        </div>
      );
    }

    if (channel === 'SMS') {
      return (
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '16px',
          color: '#f8fafc',
          maxWidth: '450px',
          margin: '20px auto 0 auto',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
            📱 SMS Gateway Preview
          </div>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre-line',
            color: '#38bdf8'
          }}>
            {messageData.message}
          </div>
        </div>
      );
    }

    if (channel === 'RM_CALL') {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '18px',
          color: '#cbd5e1',
          maxWidth: '550px',
          margin: '20px auto 0 auto',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📞 Relationship Manager Talk Track (RBI Audited)
          </div>
          <div style={{
            fontSize: '0.88rem',
            lineHeight: '1.5',
            whiteSpace: 'pre-line',
            background: 'rgba(0,0,0,0.2)',
            padding: '14px',
            borderRadius: '8px',
            borderLeft: '4px solid #8B5CF6'
          }}>
            {messageData.message}
          </div>
        </div>
      );
    }

    return (
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '16px',
        color: '#cbd5e1',
        maxWidth: '450px',
        margin: '20px auto 0 auto',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold', marginBottom: '6px', textTransform: 'uppercase' }}>
          💻 In-App Nudge Notification
        </div>
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '0.88rem',
          whiteSpace: 'pre-line'
        }}>
          {messageData.message}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.25rem', fontWeight: 700 }}>
              Initiate Churn Mitigation
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.82rem' }}>
              Target: <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>{customer.customerName}</span>
            </p>
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

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>
            Select Delivery Channel
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['WHATSAPP', 'SMS', 'RM_CALL', 'INAPP'].map((chan) => (
              <button
                key={chan}
                onClick={() => handleChannelChange(chan)}
                disabled={loading}
                style={{
                  flex: 1,
                  background: channel === chan ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: channel === chan ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: channel === chan ? '#3b82f6' : '#cbd5e1',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                {chan.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          minHeight: '180px',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: '10px',
          padding: '12px',
        }}>
          {renderMessageBubble()}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div>
            {status === 'ACCEPTED' ? (
              <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🟢 Churn Mitigation Offer Accepted!
              </span>
            ) : (
              <span style={{ color: '#F59E0B', fontWeight: 'bold', fontSize: '0.85rem' }}>
                🟡 Offer Sent (Awaiting Client Reply)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {status === 'SENT' && messageData && (
              <button
                onClick={handleMarkAccepted}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                }}
              >
                Mark as Offer Accepted
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.85rem',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
