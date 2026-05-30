import React, { useState } from 'react';
import { 
  BrainCircuit, Activity, LineChart, Network, Lightbulb, 
  ThumbsUp, ThumbsDown, MessageSquare, Target, CheckCircle, 
  TrendingUp, RefreshCw, Zap, Clock, ShieldCheck, Search, X
} from 'lucide-react';

const RECOMMENDATIONS = [
  {
    id: 'REC-001',
    customer: 'Rajesh Sharma',
    customerId: 'CUST-8921',
    signals: ['Salary credits stopped', 'Transactions reduced 70%', 'Mobile app usage dropped', 'Complaint raised recently'],
    rootCause: 'Customer may be moving primary banking relationship elsewhere due to unresolved complaint frustration.',
    historicalInsight: 'For similar customers, generic promotional messages failed. RM outreach improved retention by 42%. Personalized service recovery messages improved retention by 61%.',
    recommendedMessage: 'Hi Rajesh, we noticed reduced account activity and wanted to check if there is anything we can assist with. Your relationship with us is important, and our dedicated team is available to help.',
    channel: 'RM Call + WhatsApp',
    confidence: 87,
    strategy: 'Service Recovery & Relationship Re-engagement',
    status: 'Pending Outreach Execution'
  },
  {
    id: 'REC-002',
    customer: 'Priya Venkatesh',
    customerId: 'CUST-3341',
    signals: ['Multiple high fee charges', 'Browsed competitor credit cards', 'Negative sentiment on SAGE'],
    rootCause: 'High fees concern leading to competitor attraction.',
    historicalInsight: 'Fee-sensitive customers respond better to fee reductions (74% retention) than reward campaigns (12% retention).',
    recommendedMessage: 'Hi Priya, as a valued Premium customer, we would like to offer you a lifetime fee waiver on your next credit card renewal. Tap here to instantly apply.',
    channel: 'In-App Notification + Email',
    confidence: 92,
    strategy: 'Fee Waiver Discussion & Value Reinforcement',
    status: 'Pending Outreach Execution'
  },
  {
    id: 'REC-003',
    customer: 'Amit Patel',
    customerId: 'CUST-5512',
    signals: ['App crash logs detected', '3 failed UPI transactions', 'Unresolved IT support ticket'],
    rootCause: 'Digital experience issue causing immediate transaction frustration.',
    historicalInsight: 'Immediate technical support assistance yields an 88% retention rate post-failure.',
    recommendedMessage: 'Hi Amit, we noticed you had trouble with UPI payments today. Our technical team has resolved the gateway issue. We apologize for the inconvenience.',
    channel: 'SMS + Push Notification',
    confidence: 96,
    strategy: 'Transparent Technical Support Assistance',
    status: 'Executing in Outreach Engine'
  },
  {
    id: 'REC-004',
    customer: 'Sunil Gavaskar',
    customerId: 'CUST-1022',
    signals: ['Low balance in checking', 'High credit card utilization', 'Denied loan application'],
    rootCause: 'Credit distress leading to flight risk to competitor offering easier credit.',
    historicalInsight: 'Debt restructuring or credit counseling offers yield a 55% retention rate compared to standard marketing.',
    recommendedMessage: 'Hi Sunil, we noticed you might benefit from exploring our flexible credit restructuring options. Let\'s review your profile to find a comfortable plan.',
    channel: 'RM Call + Email',
    confidence: 84,
    strategy: 'Credit Restructuring & Debt Relief',
    status: 'Pending Outreach Execution'
  },
  {
    id: 'REC-005',
    customer: 'Kavya Krishnan',
    customerId: 'CUST-8492',
    signals: ['Stopped using wealth management tools', 'Withdrew $50,000 from brokerage'],
    rootCause: 'Seeking better investment yields or lower management fees elsewhere.',
    historicalInsight: 'Offering a complimentary portfolio review with a Senior Wealth Advisor recovers 68% of HNI clients.',
    recommendedMessage: 'Hi Kavya, as one of our most valued Wealth clients, we would like to offer you a complimentary 1-on-1 portfolio review with a Senior Advisor to optimize your yields.',
    channel: 'Direct Phone Call',
    confidence: 91,
    strategy: 'Wealth Management Re-engagement',
    status: 'Pending Outreach Execution'
  },
  {
    id: 'REC-006',
    customer: 'Aarav Gupta',
    customerId: 'CUST-4112',
    signals: ['3 consecutive months of late payment fees', 'Customer sentiment dropped to Angry'],
    rootCause: 'Frustration over accumulated late fees causing churn intent.',
    historicalInsight: 'One-time fee reversal coupled with automated payment setup prevents churn in 82% of cases.',
    recommendedMessage: 'Hi Aarav, we understand late fees can be frustrating. We would like to reverse your recent fees and help you set up AutoPay so you never have to worry again.',
    channel: 'SMS + Push Notification',
    confidence: 89,
    strategy: 'Fee Reversal & AutoPay Setup',
    status: 'Pending Outreach Execution'
  }
];

const LEARNING_LOGS = [
  {
    id: 'OUT-9921',
    customer: 'Meera Reddy',
    rootCause: 'Unresolved Complaint',
    strategyUsed: 'Promotional Offer (Control Group)',
    metrics: { opened: true, responded: false, resolved: false, riskReduced: false, retained: false },
    conclusion: 'Promotional offers fail when foundational trust is broken by unresolved complaints. Increased dissatisfaction detected.',
    success: false
  },
  {
    id: 'OUT-9922',
    customer: 'Vikram Singh',
    rootCause: 'Salary account transition',
    strategyUsed: 'RM Call + Exclusive Lifestyle Benefits',
    metrics: { opened: true, responded: true, resolved: true, riskReduced: true, retained: true },
    conclusion: 'RM intervention paired with tangible lifestyle benefits successfully halted salary account churn in HNI segment.',
    success: true
  },
  {
    id: 'OUT-9923',
    customer: 'Anita Desai',
    rootCause: 'Competitor Mortgage Offer',
    strategyUsed: 'Automated Rate Match Email',
    metrics: { opened: true, responded: true, resolved: true, riskReduced: true, retained: true },
    conclusion: 'Speed of rate matching via automated email prevented churn to competitor. Highly effective for rate-sensitive borrowers.',
    success: true
  },
  {
    id: 'OUT-9924',
    customer: 'Nisha Sharma',
    rootCause: 'High Credit Card Utilization',
    strategyUsed: 'Pre-approved Loan Consolidation Offer',
    metrics: { opened: true, responded: true, resolved: true, riskReduced: true, retained: true },
    conclusion: 'Proactive loan consolidation offers for highly utilized credit lines successfully mitigate default risk and retain accounts.',
    success: true
  },
  {
    id: 'OUT-9925',
    customer: 'Rohan Mehta',
    rootCause: 'App Login Failures',
    strategyUsed: 'Generic "Update App" SMS',
    metrics: { opened: true, responded: false, resolved: false, riskReduced: false, retained: false },
    conclusion: 'Generic SMS alerts are ignored during active IT frustration. Direct human outreach or in-app modals are required.',
    success: false
  },
  {
    id: 'OUT-9926',
    customer: 'Sneha Verma',
    rootCause: 'Competitor Wealth Management',
    strategyUsed: 'Complimentary Portfolio Review',
    metrics: { opened: true, responded: true, resolved: true, riskReduced: true, retained: true },
    conclusion: 'Personalized human advisory outreach successfully countered competitor digital wealth management platforms.',
    success: true
  }
];

const KNOWLEDGE_BASE = [
  "Customers with unresolved complaints respond better to transparency than promotional offers.",
  "Fee-sensitive customers respond better to fee reductions than reward campaigns.",
  "High-value customers respond better to RM intervention than automated messages.",
  "Salary account customers respond better to personalized service recovery than cross-selling.",
  "Speed of acknowledgment (< 15 mins) on transaction failures reduces churn risk by 45%."
];

export default function FeedbackLoopPage() {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS);

  const handleSendToOutreach = (rec) => {
    const saved = localStorage.getItem('outreachCases');
    let outreachCases = saved ? JSON.parse(saved) : [];

    const newCase = {
      caseId: `RC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: rec.customer,
      customerId: rec.customerId,
      triggerSource: 'Feedback Intelligence Loop',
      event: rec.rootCause,
      riskLevel: 'High',
      healthScore: 40,
      retentionObjective: rec.strategy,
      channel: rec.channel,
      status: 'OUTREACH_TRIGGERED',
      customerResponse: 'Pending',
      outcome: 'Awaiting Delivery',
      revenueProtected: 0,
      revenueAtRisk: 1500000,
      rmAssigned: 'Feedback Engine',
      aiTransparency: {
        confidenceScore: rec.confidence,
        triggerReason: rec.signals.join(', '),
        recommendedAction: rec.recommendedMessage,
        actualActionTaken: 'Sent to Outreach Engine',
      },
      journey: [
        { step: 'Customer Event', desc: rec.signals[0], time: 'Just now' },
        { step: 'Feedback Intelligence Analysis', desc: 'Root cause identified', time: 'Just now' },
        { step: 'Strategy Prediction', desc: `Recommended: ${rec.strategy}`, time: 'Just now' },
        { step: 'Outreach Execution', desc: 'Message queued in Outreach Engine', time: 'Just now' },
      ],
      validation: { stage: 'N/A', status: 'N/A' }
    };

    outreachCases.unshift(newCase);
    localStorage.setItem('outreachCases', JSON.stringify(outreachCases));

    setRecommendations(recommendations.filter(r => r.id !== rec.id));
    alert("Case forwarded to Outreach Engine successfully!");
  };

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BrainCircuit size={28} color="var(--accent-purple)" /> Feedback Intelligence Loop
          </h2>
          <p>Continuously learning retention intelligence layer that improves every customer interaction over time.</p>
        </div>
      </div>

      {/* KPI Layer */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card purple">
          <div className="stat-icon purple"><Target size={22} /></div>
          <div className="stat-value">91.4%</div>
          <div className="stat-label">Model Prediction Accuracy</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue"><RefreshCw size={22} /></div>
          <div className="stat-value">12,450</div>
          <div className="stat-label">Learning Cycles Completed</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><ShieldCheck size={22} /></div>
          <div className="stat-value">8,932</div>
          <div className="stat-label">Successful Interventions Learnt</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><TrendingUp size={22} /></div>
          <div className="stat-value">+24%</div>
          <div className="stat-label">Retention Improvement (YoY)</div>
        </div>
      </div>

      {/* Core Workflow Diagram */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(90deg, rgba(26,32,53,1) 0%, rgba(30,41,59,1) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
          {[
            { label: 'Customer Behavior', icon: Activity, color: '#3b82f6' },
            { label: 'Root Cause Detection', icon: Search, color: '#f59e0b' },
            { label: 'Strategy Prediction', icon: BrainCircuit, color: '#8b5cf6' },
            { label: 'Outreach Execution', icon: Zap, color: '#06b6d4' },
            { label: 'Outcome Tracking', icon: LineChart, color: '#10b981' },
            { label: 'Learning Stored', icon: Network, color: '#ec4899' }
          ].map((step, idx, arr) => (
            <React.Fragment key={idx}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', background: `${step.color}15`, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${step.color}40`
                }}>
                  <step.icon size={20} color={step.color} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>
                  {step.label}
                </div>
              </div>
              {idx < arr.length - 1 && (
                <div style={{ flex: 0.5, height: 2, background: 'var(--border-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', right: -4, top: -4, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '5px solid var(--border-color)' }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-color)', marginBottom: 24 }}>
        {[
          { key: 'recommendations', label: 'Intelligent Message Recommendations' },
          { key: 'learning', label: 'Outcome Tracking & Learning System' },
          { key: 'knowledge', label: 'Retention Intelligence Repository' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '10px 16px', background: 'none', border: 'none',
              borderBottom: activeTab === t.key ? '2px solid var(--accent-purple)' : '2px solid transparent',
              color: activeTab === t.key ? 'var(--accent-purple)' : 'var(--text-muted)',
              fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: activeTab === t.key ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* RECOMMENDATIONS TAB */}
      {/* ═══════════════════════════════════════ */}
      {activeTab === 'recommendations' && (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {recommendations.map(rec => (
            <div key={rec.id} className="card" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {rec.customer} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{rec.customerId}</span>
                  </h3>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {rec.signals.map((sig, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--bg-secondary)', borderRadius: 100, border: '1px solid var(--border-color)' }}>
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{rec.confidence}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Confidence Score</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
                {/* Left Col: AI Analysis */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Search size={12} color="var(--accent-yellow)" /> Detected Root Cause
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', padding: '10px 12px', background: 'rgba(245,158,11,0.05)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.2)' }}>
                      {rec.rootCause}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Lightbulb size={12} color="var(--accent-purple)" /> Historical Learning
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '10px 12px', background: 'rgba(139,92,246,0.05)', borderRadius: 8, border: '1px solid rgba(139,92,246,0.2)' }}>
                      {rec.historicalInsight}
                    </div>
                  </div>
                </div>

                {/* Right Col: Recommendation */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageSquare size={12} color="var(--accent-blue)" /> Recommended Outreach Message
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', padding: '10px 12px', background: 'rgba(59,130,246,0.1)', borderRadius: 8, border: '1px solid rgba(59,130,246,0.3)', fontStyle: 'italic' }}>
                      "{rec.recommendedMessage}"
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Predicted Best Channel</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{rec.channel}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Intervention Strategy</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)' }}>{rec.strategy}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: 'auto' }} onClick={() => handleSendToOutreach(rec)}>
                    <Zap size={14} /> Send to Outreach Engine
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* LEARNING TRACKER TAB */}
      {/* ═══════════════════════════════════════ */}
      {activeTab === 'learning' && (
        <div className="fade-in">
          <div className="card" style={{ padding: 0 }}>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Root Cause</th>
                    <th>Strategy Executed</th>
                    <th style={{ textAlign: 'center' }}>Opened</th>
                    <th style={{ textAlign: 'center' }}>Responded</th>
                    <th style={{ textAlign: 'center' }}>Resolved</th>
                    <th style={{ textAlign: 'center' }}>Retained</th>
                    <th>Intelligence Conclusion</th>
                  </tr>
                </thead>
                <tbody>
                  {LEARNING_LOGS.map(log => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 600 }}>{log.customer}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.rootCause}</td>
                      <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{log.strategyUsed}</td>
                      <td style={{ textAlign: 'center' }}>
                        {log.metrics.opened ? <CheckCircle size={16} color="#10b981" /> : <X size={16} color="#ef4444" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {log.metrics.responded ? <CheckCircle size={16} color="#10b981" /> : <X size={16} color="#ef4444" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {log.metrics.resolved ? <CheckCircle size={16} color="#10b981" /> : <X size={16} color="#ef4444" />}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {log.metrics.retained ? <CheckCircle size={16} color="#10b981" /> : <X size={16} color="#ef4444" />}
                      </td>
                      <td>
                        <div style={{ 
                          fontSize: '0.8rem', padding: '8px 12px', borderRadius: 6,
                          background: log.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: log.success ? '#10b981' : '#ef4444', border: `1px solid ${log.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
                        }}>
                          {log.conclusion}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* KNOWLEDGE BASE TAB */}
      {/* ═══════════════════════════════════════ */}
      {activeTab === 'knowledge' && (
        <div className="fade-in">
          <div className="card">
            <div className="card-header">
              <div className="card-title"><BrainCircuit size={18} color="var(--accent-purple)" /> Active Intelligence Repository</div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>
              The Feedback Loop continuously extracts natural language rules based on real-world outcomes. These rules feed back into the Single Engine for future predictions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {KNOWLEDGE_BASE.map((insight, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', 
                  background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-color)'
                }}>
                  <div style={{ 
                    width: 32, height: 32, borderRadius: '50%', background: 'rgba(139,92,246,0.15)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                  }}>
                    <Lightbulb size={16} color="#8b5cf6" />
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {insight}
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle size={14} /> Validated
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
