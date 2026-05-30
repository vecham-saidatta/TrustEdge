import { useState } from 'react';
import {
  UserCheck, Bell, ShieldCheck, FileBarChart, Cpu, Bot, TrendingUp, Activity,
  Users, Target, BarChart3, Zap, AlertTriangle, VolumeX, GitBranch, Shield,
  Clock, Eye, Scale, FileText, Brain, MessageSquare, Database, Radio, Network,
  PieChart, Gavel, Lock, CheckCircle, ArrowUpRight, ArrowDownRight, Minus,
  Layers, Sparkles, ChevronRight, Monitor, ArrowLeft
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════
//  PLACEHOLDER WRAPPER — Temporary Feature-Flag Overlay
//  Wraps incomplete admin modules with a premium overview experience.
//  To remove: simply delete the <PlaceholderWrapper> tag from App.jsx
// ═══════════════════════════════════════════════════════════════════

const MODULE_REGISTRY = {
  'rm-operations': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: UserCheck, iconColor: '#3b82f6',
    description: 'Track RM portfolio performance, conversion SLAs, and branch-level productivity metrics to optimize relationship management and service delivery across the organization.',
    features: [
      { icon: Users, title: 'RM Performance Leaderboard', desc: 'Ranked scorecards with conversion rates, retention saves, and SLA adherence per RM' },
      { icon: Target, title: 'Task Outcome Recording', desc: 'Track call/visit outcomes with automated SLA monitoring and escalation triggers' },
      { icon: BarChart3, title: 'Portfolio Churn Heatmaps', desc: 'Visual risk distribution across RM portfolios with drill-down by branch and segment' },
      { icon: Zap, title: 'Smart Resource Allocation', desc: 'AI-recommended case redistribution based on RM capacity and expertise match' },
      { icon: TrendingUp, title: 'Conversion Analytics', desc: 'Funnel analysis from risk detection through intervention to successful retention' },
    ],
    metrics: [
      { label: 'Active RMs', value: '14 / 16', change: '+2 this week', changeType: 'up', color: '#3b82f6' },
      { label: 'Avg SLA Completion', value: '92.4%', change: '+3.1%', changeType: 'up', color: '#10b981' },
      { label: 'Retained Portfolio', value: '₹48.2 Cr', change: '+₹4.8 Cr MTD', changeType: 'up', color: '#8b5cf6' },
      { label: 'Pending Outcomes', value: '23', change: '-8 from yesterday', changeType: 'down', color: '#f59e0b' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'API Integration', status: 'active', label: 'In Progress' },
      { stage: 'Security Audit', status: 'planned', label: 'Q3 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Interactive UI shell with mock data' },
      { quarter: 'Q3 2026', milestone: 'Live API integration & RM data feeds' },
      { quarter: 'Q4 2026', milestone: 'Full release with performance benchmarks' },
    ],
    chartType: 'bar',
    chartData: { labels: ['Priya S.', 'Rahul V.', 'Deepa N.', 'Anita K.', 'Suresh M.', 'Kavita R.'], values: [94, 87, 76, 91, 82, 88], target: 85, title: 'RM Conversion Rate vs Target (%)' },
  },

  'alerts-center': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: Bell, iconColor: '#ef4444',
    description: 'Unified alert triage inbox consolidating AI-generated risk signals, operational SLA breaches, system health warnings, and compliance notifications with smart routing and suppression.',
    features: [
      { icon: AlertTriangle, title: 'Multi-Priority Routing', desc: 'P1-P4 severity classification with auto-escalation to branch managers and compliance' },
      { icon: VolumeX, title: 'Smart Suppression Engine', desc: 'Duplicate detection, rate limiting, and maintenance window silence rules' },
      { icon: GitBranch, title: 'Contextual Journey Links', desc: 'One-click navigation from alert to Customer 360, case, or campaign context' },
      { icon: Shield, title: 'Emergency Escalation Trees', desc: 'Configurable escalation paths with SMS/email fallback for critical alerts' },
      { icon: Clock, title: 'SLA Breach Tracking', desc: 'Real-time monitoring of acknowledgment and resolution time targets' },
    ],
    metrics: [
      { label: 'Unacknowledged', value: '12', change: '+3 in last hour', changeType: 'up', color: '#ef4444' },
      { label: 'Active Suppressions', value: '4', change: 'Rules active', changeType: 'neutral', color: '#8b5cf6' },
      { label: 'Mean Time to Ack', value: '14m', change: '-6m vs last week', changeType: 'down', color: '#10b981' },
      { label: 'Resolved (24h)', value: '47', change: '93% resolution rate', changeType: 'up', color: '#3b82f6' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'API Integration', status: 'active', label: 'In Progress' },
      { stage: 'Security Audit', status: 'planned', label: 'Q3 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Alert UI with mock triage workflows' },
      { quarter: 'Q3 2026', milestone: 'Live Kafka event stream integration' },
      { quarter: 'Q4 2026', milestone: 'ML-powered alert correlation engine' },
    ],
    chartType: 'severity',
    chartData: { segments: [{ label: 'P1 Critical', value: 4, color: '#ef4444' }, { label: 'P2 High', value: 5, color: '#f97316' }, { label: 'P3 Medium', value: 5, color: '#f59e0b' }, { label: 'P4 Low', value: 4, color: '#3b82f6' }], title: 'Alert Distribution by Severity' },
  },

  'ai-governance': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: ShieldCheck, iconColor: '#8b5cf6',
    description: 'Ensure all AI-driven risk scores, recommendations, and automated decisions are transparent, auditable, and compliant with RBI regulatory frameworks and internal bias thresholds.',
    features: [
      { icon: Eye, title: 'Explainable AI Dashboard', desc: 'SHAP/LIME feature attribution for every churn score with natural language explanations' },
      { icon: Scale, title: 'Score Override System', desc: 'Human-in-the-loop controls allowing RMs to challenge and override AI recommendations' },
      { icon: Users, title: 'Demographic Bias Monitor', desc: 'Continuous fairness auditing across gender, age, geography, and income segments' },
      { icon: Activity, title: 'Model Drift Detection', desc: 'Automated accuracy tracking with alerts when performance degrades beyond thresholds' },
      { icon: FileText, title: 'Regulatory Audit Trail', desc: 'Immutable logs of every AI decision for RBI compliance and internal governance reviews' },
    ],
    metrics: [
      { label: 'Model Drift Score', value: '0.04', change: 'Within bounds', changeType: 'neutral', color: '#10b981' },
      { label: 'Override Rate', value: '2.1%', change: '-0.3% this month', changeType: 'down', color: '#3b82f6' },
      { label: 'Bias Impact Ratio', value: '0.98', change: 'Target: >0.95', changeType: 'neutral', color: '#8b5cf6' },
      { label: 'Decisions Audited', value: '14.2K', change: '+2.1K this week', changeType: 'up', color: '#06b6d4' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'Backend Services', status: 'active', label: 'In Progress' },
      { stage: 'RBI Compliance', status: 'planned', label: 'Q3 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Governance dashboard with SHAP visualizations' },
      { quarter: 'Q3 2026', milestone: 'Live bias monitoring & override workflows' },
      { quarter: 'Q4 2026', milestone: 'Full RBI audit integration & certification' },
    ],
    chartType: 'feature-importance',
    chartData: { features: [{ name: 'Balance Trend', value: 0.28, color: '#3b82f6' }, { name: 'Transaction Freq', value: 0.22, color: '#8b5cf6' }, { name: 'Product Holdings', value: 0.18, color: '#06b6d4' }, { name: 'Complaint History', value: 0.14, color: '#f59e0b' }, { name: 'Tenure (Years)', value: 0.10, color: '#10b981' }, { name: 'Digital Engagement', value: 0.08, color: '#f97316' }], title: 'Churn Model Feature Importance (SHAP)' },
  },

  'audit-compliance': {
    status: 'Coming Soon', statusColor: '#3b82f6',
    icon: FileBarChart, iconColor: '#f59e0b',
    description: 'Centralized regulatory compliance hub with cryptographically secured audit logs, automated RBI report generation, and real-time compliance drift monitoring for enterprise governance.',
    features: [
      { icon: FileText, title: 'Automated RBI Reports', desc: 'Pre-formatted regulatory submissions with auto-populated data from platform operations' },
      { icon: Lock, title: 'Immutable Audit Trail', desc: 'Blockchain-anchored event logs ensuring tamper-proof records of all system actions' },
      { icon: Shield, title: 'PII Access Guardrails', desc: 'Role-based data access controls with automatic masking and consent verification' },
      { icon: TrendingUp, title: 'Compliance Drift Monitor', desc: 'Real-time tracking of regulatory adherence metrics with threshold-based alerts' },
      { icon: Gavel, title: 'Policy Enforcement Engine', desc: 'Automated policy checks against RBI guidelines with violation flagging' },
    ],
    metrics: [
      { label: 'Log Integrity', value: '100%', change: 'Cryptographic verification', changeType: 'neutral', color: '#10b981' },
      { label: 'Audit Status', value: 'Compliant', change: 'Last audit: May 15', changeType: 'neutral', color: '#10b981' },
      { label: 'Access Events (24h)', value: '14,821', change: '+1.2K vs avg', changeType: 'up', color: '#3b82f6' },
      { label: 'Open Findings', value: '0', change: 'All resolved', changeType: 'neutral', color: '#10b981' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'Backend Services', status: 'planned', label: 'Q3 2026' },
      { stage: 'RBI Certification', status: 'planned', label: 'Q4 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Compliance dashboard UI with mock data' },
      { quarter: 'Q3 2026', milestone: 'Immutable log infrastructure & API layer' },
      { quarter: 'Q4 2026', milestone: 'RBI report automation & external audit prep' },
    ],
    chartType: 'compliance-score',
    chartData: { score: 96, maxScore: 100, categories: [{ name: 'Data Privacy', score: 98 }, { name: 'Access Control', score: 95 }, { name: 'Audit Logging', score: 100 }, { name: 'Report Timeliness', score: 91 }], title: 'Compliance Health Score' },
  },

  'system-health': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: Cpu, iconColor: '#06b6d4',
    description: 'Real-time infrastructure telemetry console monitoring service health, database performance, message broker throughput, cache efficiency, and GPU cluster utilization across the TrustEdge platform.',
    features: [
      { icon: Activity, title: 'Latency Percentile Telemetry', desc: 'Live p50/p95/p99 latency tracking for all critical API endpoints and services' },
      { icon: Cpu, title: 'GPU Cluster Monitoring', desc: 'Ray cluster utilization metrics for PULSE PPO training jobs and batch inference' },
      { icon: Radio, title: 'Kafka Broker Telemetry', desc: 'Consumer lag, partition health, and throughput metrics for the event streaming layer' },
      { icon: Database, title: 'Database Connection Pools', desc: 'PostgreSQL and Redis connection pool monitoring with automatic scaling alerts' },
      { icon: Network, title: 'Service Mesh Health', desc: 'Inter-service communication health with circuit breaker status and retry metrics' },
    ],
    metrics: [
      { label: 'PG Latency (p99)', value: '12ms', change: 'Within SLA', changeType: 'neutral', color: '#10b981' },
      { label: 'Redis Cache Hit', value: '99.4%', change: '+0.2% this week', changeType: 'up', color: '#06b6d4' },
      { label: 'Kafka Topic Lag', value: '0.18s', change: 'Healthy', changeType: 'neutral', color: '#10b981' },
      { label: 'System Uptime', value: '99.97%', change: '30-day rolling', changeType: 'neutral', color: '#3b82f6' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'Metrics Pipeline', status: 'active', label: 'In Progress' },
      { stage: 'Alerting Rules', status: 'planned', label: 'Q3 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Health dashboard with simulated telemetry' },
      { quarter: 'Q3 2026', milestone: 'Live Prometheus/Grafana data integration' },
      { quarter: 'Q4 2026', milestone: 'Auto-scaling triggers & incident management' },
    ],
    chartType: 'service-status',
    chartData: { services: [{ name: 'SAGE LLM API', status: 'healthy', latency: '1.2s', uptime: '99.98%' }, { name: 'Churn ML Engine', status: 'healthy', latency: '340ms', uptime: '99.99%' }, { name: 'PULSE PPO Service', status: 'healthy', latency: 'Background', uptime: '100%' }, { name: 'Kafka Event Bus', status: 'healthy', latency: '0.18s lag', uptime: '99.99%' }, { name: 'Redis Cache', status: 'healthy', latency: '0.8ms', uptime: '99.99%' }, { name: 'PostgreSQL Primary', status: 'healthy', latency: '12ms', uptime: '100%' }], title: 'Service Health Matrix' },
  },

  'sage-monitor': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: Bot, iconColor: '#10b981',
    description: 'Supervisory oversight dashboard for the SAGE AI conversational assistant — monitoring conversation quality, sentiment drift, distress detection accuracy, and RM handoff performance in real time.',
    features: [
      { icon: Activity, title: 'Sentiment Drift Monitoring', desc: 'Real-time SAGE conversation sentiment tracking with trend analysis and anomaly detection' },
      { icon: AlertTriangle, title: 'Distress Detection QA', desc: 'Accuracy metrics for keyword-based distress identification and false positive tracking' },
      { icon: Users, title: 'RM Handoff Analytics', desc: 'Handoff success rates, time-to-connect, and customer satisfaction post-escalation' },
      { icon: Brain, title: 'Prompt Quality Analytics', desc: 'LLM prompt engineering metrics including response confidence and relevance scoring' },
      { icon: MessageSquare, title: 'Conversation Replay', desc: 'Searchable archive of flagged SAGE conversations with annotation capabilities' },
    ],
    metrics: [
      { label: 'Chats Monitored (24h)', value: '142', change: '+18 vs yesterday', changeType: 'up', color: '#10b981' },
      { label: 'Sentiment Index', value: '4.2 / 5.0', change: '+0.1 this week', changeType: 'up', color: '#3b82f6' },
      { label: 'RM Handoff Rate', value: '98.6%', change: 'Above 95% target', changeType: 'neutral', color: '#8b5cf6' },
      { label: 'Flagged Responses', value: '3', change: '-2 from yesterday', changeType: 'down', color: '#f59e0b' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'LLM Metrics API', status: 'active', label: 'In Progress' },
      { stage: 'Distress ML Model', status: 'planned', label: 'Q3 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Monitor dashboard with sample conversations' },
      { quarter: 'Q3 2026', milestone: 'Live SAGE API telemetry integration' },
      { quarter: 'Q4 2026', milestone: 'Advanced NLP quality scoring engine' },
    ],
    chartType: 'sentiment-trend',
    chartData: { points: [3.8, 4.0, 3.9, 4.1, 4.3, 4.2, 4.2], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], title: 'SAGE Sentiment Index — 7 Day Trend' },
  },

  'predictions': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: TrendingUp, iconColor: '#8b5cf6',
    description: 'Advanced ML risk workbench for churn probability modeling, Monte Carlo balance simulations, risk cohort segmentation, and predictive campaign ROI analysis across the customer portfolio.',
    features: [
      { icon: PieChart, title: 'ML Churn Cohort Analytics', desc: 'Segment customers by risk tier with demographic, behavioral, and financial feature breakdowns' },
      { icon: TrendingUp, title: 'Monte Carlo Simulations', desc: '10,000-path balance trajectory modeling with 90% confidence intervals for portfolio risk' },
      { icon: Target, title: 'Segment Outreach Builder', desc: 'AI-recommended intervention strategies with predicted success rates per cohort' },
      { icon: BarChart3, title: 'Campaign ROI Predictor', desc: 'Pre-launch ROI estimates comparing retention cost vs expected lifetime value impact' },
      { icon: GitBranch, title: 'Network Contagion Model', desc: 'Household/relationship-linked churn propagation analysis and intervention planning' },
    ],
    metrics: [
      { label: 'Model Accuracy', value: '91.2%', change: '+1.4% post-retrain', changeType: 'up', color: '#10b981' },
      { label: 'Portfolio at Risk', value: '₹24.5 Cr', change: '-₹3.2 Cr from interventions', changeType: 'down', color: '#8b5cf6' },
      { label: 'High-Risk Cohorts', value: '412', change: 'Customers >0.7 score', changeType: 'neutral', color: '#ef4444' },
      { label: 'Predicted Saves', value: '₹18.7 Cr', change: 'Next 90 days', changeType: 'up', color: '#3b82f6' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'ML Model API', status: 'active', label: 'In Progress' },
      { stage: 'Monte Carlo Engine', status: 'planned', label: 'Q3 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Predictions dashboard with historical data' },
      { quarter: 'Q3 2026', milestone: 'Live ML pipeline & Monte Carlo integration' },
      { quarter: 'Q4 2026', milestone: 'Campaign ROI optimizer & network analysis' },
    ],
    chartType: 'risk-distribution',
    chartData: { buckets: [{ range: '0.0–0.2', count: 2840, color: '#10b981' }, { range: '0.2–0.4', count: 1920, color: '#06b6d4' }, { range: '0.4–0.6', count: 980, color: '#f59e0b' }, { range: '0.6–0.8', count: 412, color: '#f97316' }, { range: '0.8–1.0', count: 148, color: '#ef4444' }], title: 'Customer Risk Score Distribution' },
  },

  'pulse': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: Activity, iconColor: '#ef4444',
    description: 'Feedback intelligence engine that retrains churn prediction and offer recommendation models in real time using Reinforcement Learning (PPO) based on RM intervention outcomes and campaign results.',
    features: [
      { icon: Cpu, title: 'RL Pipeline Management', desc: 'PPO model version tracking with rollback capabilities and A/B performance comparison' },
      { icon: CheckCircle, title: 'Outcome Collection Audits', desc: 'RM action recording completeness monitoring with gap identification and reminders' },
      { icon: GitBranch, title: 'Multi-Armed Bandit Analysis', desc: 'Real-time channel/offer variant performance with Thompson Sampling exploration metrics' },
      { icon: Activity, title: 'Feature Drift Tracking', desc: 'Continuous monitoring of input feature distributions with automated retraining triggers' },
      { icon: TrendingUp, title: 'Accuracy Lift Analytics', desc: 'Before/after reinforcement learning accuracy comparisons with statistical significance' },
    ],
    metrics: [
      { label: 'Active Model', value: 'PPO v1.47', change: 'Deployed 2d ago', changeType: 'neutral', color: '#8b5cf6' },
      { label: 'Outcome Capture', value: '98.4%', change: '+1.2% this week', changeType: 'up', color: '#10b981' },
      { label: 'Accuracy Lift', value: '+4.2%', change: 'vs baseline model', changeType: 'up', color: '#3b82f6' },
      { label: 'Training Cycles', value: '847', change: 'Total PPO iterations', changeType: 'neutral', color: '#06b6d4' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'PPO Pipeline', status: 'active', label: 'In Progress' },
      { stage: 'Production RL', status: 'planned', label: 'Q4 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'PULSE dashboard with training visualizations' },
      { quarter: 'Q3 2026', milestone: 'Live outcome ingestion & PPO retraining' },
      { quarter: 'Q4 2026', milestone: 'Full production RL with safety guardrails' },
    ],
    chartType: 'accuracy-trend',
    chartData: { baseline: [84.1, 84.3, 84.2, 84.5, 84.4, 84.3, 84.6, 84.5], reinforced: [84.1, 85.2, 86.1, 87.3, 88.0, 89.1, 90.4, 91.2], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'], title: 'Model Accuracy — Baseline vs Reinforced (%)' },
  },

  'customer-360': {
    status: 'Under Development', statusColor: '#f59e0b',
    icon: UserCheck, iconColor: '#3b82f6',
    description: 'Unified 360-degree customer intelligence portal combining real-time core banking data, predictive churn models, SAGE conversation analytics, and personalized retention action recommendations.',
    features: [
      { icon: PieChart, title: 'Comprehensive Financial Snapshot', desc: 'Real-time aggregation of AUM, liabilities, and product holdings across all business units' },
      { icon: Activity, title: 'Behavioral Risk Scoring', desc: 'Live ML-driven health and contagion risk scoring with historical trend analysis' },
      { icon: MessageSquare, title: 'Omnichannel Interaction History', desc: 'Unified timeline of branch visits, app usage, and support calls with NLP sentiment extraction' },
      { icon: Bot, title: 'SAGE AI Conversation Analytics', desc: 'Direct access to AI agent chat transcripts with automated distress and intent tagging' },
      { icon: Target, title: 'Next-Best-Action Engine', desc: 'PPO-optimized intervention recommendations tailored to individual customer risk profiles' },
    ],
    metrics: [
      { label: 'Active Profiles', value: '42.8K', change: 'Synced with Core', changeType: 'neutral', color: '#3b82f6' },
      { label: 'Avg Health Score', value: '0.82', change: '+0.03 vs last month', changeType: 'up', color: '#10b981' },
      { label: 'Data Latency', value: '<2s', change: 'Real-time stream active', changeType: 'neutral', color: '#8b5cf6' },
      { label: 'At-Risk Detected', value: '1,492', change: '-45 post-intervention', changeType: 'down', color: '#f59e0b' },
    ],
    pipeline: [
      { stage: 'UI Wireframes', status: 'done', label: 'Completed' },
      { stage: 'Front-End Shell', status: 'done', label: 'Completed' },
      { stage: 'Data Ingestion APIs', status: 'active', label: 'In Progress' },
      { stage: 'Advanced ML Engine', status: 'planned', label: 'Q3 2026' },
    ],
    roadmap: [
      { quarter: 'Q2 2026', milestone: 'Customer 360 UI with mock interaction data' },
      { quarter: 'Q3 2026', milestone: 'Live integration with core banking and CRM systems' },
      { quarter: 'Q4 2026', milestone: 'Full Next-Best-Action ML rollout and anomaly detection' },
    ],
    chartType: 'risk-distribution',
    chartData: { buckets: [{ range: 'Growth', count: 18450, color: '#10b981' }, { range: 'Stable', count: 12100, color: '#3b82f6' }, { range: 'Dormant', count: 8200, color: '#f59e0b' }, { range: 'At Risk', count: 4141, color: '#ef4444' }], title: 'Portfolio Health Level Distribution' },
  },
};

// ── Shared inline style constants ──────────────────────────────────
const S = {
  glassCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: 24,
    backdropFilter: 'blur(12px)',
    transition: 'all 0.25s ease',
  },
  panelTitle: {
    fontSize: '0.82rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
};

// ── Chart Components ───────────────────────────────────────────────

function BarChart({ data }) {
  const max = Math.max(...data.values);
  return (
    <div>
      <div style={S.panelTitle}><BarChart3 size={14} /> {data.title}</div>
      {data.labels.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 72, fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'right', flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, height: 22, background: 'var(--bg-secondary)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              width: `${(data.values[i] / max) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${data.values[i] >= data.target ? '#10b981' : '#f59e0b'}, ${data.values[i] >= data.target ? '#34d399' : '#fbbf24'})`,
              borderRadius: 6,
              transition: 'width 0.8s ease',
            }} />
            {/* target line */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${(data.target / max) * 100}%`,
              width: 2, borderLeft: '2px dashed rgba(255,255,255,0.3)',
            }} />
          </div>
          <span style={{ width: 32, fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{data.values[i]}</span>
        </div>
      ))}
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
        Dashed line = {data.target}% target
      </div>
    </div>
  );
}

function SeverityChart({ data }) {
  const total = data.segments.reduce((s, seg) => s + seg.value, 0);
  return (
    <div>
      <div style={S.panelTitle}><AlertTriangle size={14} /> {data.title}</div>
      <div style={{ height: 36, borderRadius: 8, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
        {data.segments.map((seg, i) => (
          <div key={i} style={{
            width: `${(seg.value / total) * 100}%`,
            background: seg.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.72rem', fontWeight: 700, color: 'white',
            transition: 'width 0.5s ease',
          }}>
            {seg.value}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {data.segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: seg.color }} />
            {seg.label} ({seg.value})
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureImportanceChart({ data }) {
  const maxVal = Math.max(...data.features.map(f => f.value));
  return (
    <div>
      <div style={S.panelTitle}><Eye size={14} /> {data.title}</div>
      {data.features.map((f, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 110, fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'right', flexShrink: 0 }}>{f.name}</span>
          <div style={{ flex: 1, height: 20, background: 'var(--bg-secondary)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              width: `${(f.value / maxVal) * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${f.color}, ${f.color}aa)`,
              borderRadius: 6,
              transition: 'width 0.6s ease',
            }} />
          </div>
          <span style={{ width: 36, fontSize: '0.75rem', fontWeight: 700, color: f.color }}>{f.value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function ComplianceScoreChart({ data }) {
  const pct = (data.score / data.maxScore) * 100;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div>
      <div style={S.panelTitle}><ShieldCheck size={14} /> {data.title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--border-color)" strokeWidth="10" />
          <circle cx="70" cy="70" r={r} fill="none" stroke="#10b981" strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 70 70)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
          <text x="70" y="66" textAnchor="middle" fill="var(--text-primary)" fontSize="28" fontWeight="800">{data.score}</text>
          <text x="70" y="86" textAnchor="middle" fill="var(--text-muted)" fontSize="11">/ {data.maxScore}</text>
        </svg>
        <div style={{ width: '100%' }}>
          {data.categories.map((cat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span style={{ width: 100, fontSize: '0.75rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{cat.name}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--bg-secondary)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${cat.score}%`, height: '100%',
                  background: cat.score >= 95 ? '#10b981' : cat.score >= 90 ? '#f59e0b' : '#ef4444',
                  borderRadius: 4, transition: 'width 0.6s ease',
                }} />
              </div>
              <span style={{ width: 32, fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceStatusChart({ data }) {
  return (
    <div>
      <div style={S.panelTitle}><Monitor size={14} /> {data.title}</div>
      <div style={{ display: 'grid', gap: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 80px 70px', gap: 8, padding: '0 4px 6px', borderBottom: '1px solid var(--border-color)' }}>
          {['Service', 'Status', 'Latency', 'Uptime'].map(h => (
            <span key={h} style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>
        {data.services.map((svc, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 70px 80px 70px', gap: 8,
            padding: '8px 4px', borderRadius: 6,
            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{svc.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b98188' }} />
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, textTransform: 'capitalize' }}>{svc.status}</span>
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{svc.latency}</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>{svc.uptime}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentTrendChart({ data }) {
  const w = 280, h = 120, pad = 20;
  const min = Math.min(...data.points) - 0.3;
  const max = Math.max(...data.points) + 0.3;
  const pts = data.points.map((v, i) => ({
    x: pad + (i / (data.points.length - 1)) * (w - 2 * pad),
    y: h - pad - ((v - min) / (max - min)) * (h - 2 * pad),
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <div>
      <div style={S.panelTitle}><Activity size={14} /> {data.title}</div>
      <svg width="100%" height={h + 24} viewBox={`0 0 ${w} ${h + 24}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="sentGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <polyline points={polyline} fill="none" stroke="url(#sentGrad)" strokeWidth="2.5" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-card)" stroke="url(#sentGrad)" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fill="var(--text-primary)" fontSize="9" fontWeight="600">{data.points[i]}</text>
            <text x={p.x} y={h + 16} textAnchor="middle" fill="var(--text-muted)" fontSize="9">{data.labels[i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RiskDistributionChart({ data }) {
  const maxCount = Math.max(...data.buckets.map(b => b.count));
  const barH = 100;
  return (
    <div>
      <div style={S.panelTitle}><BarChart3 size={14} /> {data.title}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: 8, height: barH + 40 }}>
        {data.buckets.map((b, i) => {
          const h = (b.count / maxCount) * barH;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: b.color }}>{b.count.toLocaleString()}</span>
              <div style={{
                width: 36, height: h, borderRadius: '6px 6px 2px 2px',
                background: `linear-gradient(180deg, ${b.color}, ${b.color}66)`,
                transition: 'height 0.6s ease',
              }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{b.range}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AccuracyTrendChart({ data }) {
  const w = 280, h = 120, pad = 24;
  const allVals = [...data.baseline, ...data.reinforced];
  const min = Math.min(...allVals) - 1;
  const max = Math.max(...allVals) + 1;
  const toPoint = (v, i) => ({
    x: pad + (i / (data.baseline.length - 1)) * (w - 2 * pad),
    y: h - pad - ((v - min) / (max - min)) * (h - 2 * pad),
  });
  const basePts = data.baseline.map(toPoint);
  const rePts = data.reinforced.map(toPoint);
  const baseLine = basePts.map(p => `${p.x},${p.y}`).join(' ');
  const reLine = rePts.map(p => `${p.x},${p.y}`).join(' ');
  // area under reinforced line
  const areaPath = `M ${rePts[0].x},${h - pad} ` + rePts.map(p => `L ${p.x},${p.y}`).join(' ') + ` L ${rePts[rePts.length - 1].x},${h - pad} Z`;
  return (
    <div>
      <div style={S.panelTitle}><TrendingUp size={14} /> {data.title}</div>
      <svg width="100%" height={h + 28} viewBox={`0 0 ${w} ${h + 28}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="accFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#accFill)" />
        <polyline points={baseLine} fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="4 3" />
        <polyline points={reLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        {rePts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#3b82f6" stroke="var(--bg-card)" strokeWidth="1.5" />
        ))}
        {data.labels.map((l, i) => {
          const x = pad + (i / (data.labels.length - 1)) * (w - 2 * pad);
          return <text key={i} x={x} y={h + 16} textAnchor="middle" fill="var(--text-muted)" fontSize="9">{l}</text>;
        })}
      </svg>
      <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span style={{ width: 16, height: 2, background: 'var(--text-muted)', display: 'inline-block', borderTop: '1.5px dashed var(--text-muted)' }} /> Baseline
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#3b82f6' }}>
          <span style={{ width: 16, height: 2.5, background: '#3b82f6', display: 'inline-block', borderRadius: 2 }} /> Reinforced
        </span>
      </div>
    </div>
  );
}

function ChartRenderer({ chartType, chartData }) {
  switch (chartType) {
    case 'bar': return <BarChart data={chartData} />;
    case 'severity': return <SeverityChart data={chartData} />;
    case 'feature-importance': return <FeatureImportanceChart data={chartData} />;
    case 'compliance-score': return <ComplianceScoreChart data={chartData} />;
    case 'service-status': return <ServiceStatusChart data={chartData} />;
    case 'sentiment-trend': return <SentimentTrendChart data={chartData} />;
    case 'risk-distribution': return <RiskDistributionChart data={chartData} />;
    case 'accuracy-trend': return <AccuracyTrendChart data={chartData} />;
    default: return null;
  }
}

// ── Change Arrow ───────────────────────────────────────────────────
function ChangeIndicator({ change, changeType }) {
  const icon = changeType === 'up' ? <ArrowUpRight size={12} /> : changeType === 'down' ? <ArrowDownRight size={12} /> : <Minus size={12} />;
  const color = changeType === 'up' ? '#10b981' : changeType === 'down' ? '#f59e0b' : 'var(--text-muted)';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color, fontWeight: 500 }}>
      {icon} {change}
    </span>
  );
}

// ── Pipeline Step ──────────────────────────────────────────────────
function PipelineStep({ stage, status, label, isLast }) {
  const dotStyle = {
    done: { bg: '#10b981', border: '#10b981', shadow: '0 0 8px #10b98155' },
    active: { bg: '#3b82f6', border: '#3b82f6', shadow: '0 0 12px #3b82f688' },
    planned: { bg: 'transparent', border: 'var(--border-strong)', shadow: 'none' },
  }[status];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 80 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: dotStyle.bg, border: `2px solid ${dotStyle.border}`,
          boxShadow: dotStyle.shadow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}>
          {status === 'done' && <CheckCircle size={14} color="white" />}
          {status === 'active' && <Sparkles size={12} color="white" />}
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: status === 'active' ? 700 : 500, color: status === 'planned' ? 'var(--text-muted)' : 'var(--text-primary)', textAlign: 'center' }}>{stage}</span>
        <span style={{ fontSize: '0.65rem', color: status === 'active' ? '#3b82f6' : 'var(--text-muted)' }}>{label}</span>
      </div>
      {!isLast && (
        <div style={{
          flex: 1, height: 2, alignSelf: 'flex-start', marginTop: 14,
          background: status === 'done' ? '#10b981' : 'var(--border-color)',
          borderRadius: 2,
        }} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function PlaceholderWrapper({ moduleKey, moduleName, children }) {
  const [showDraftUI, setShowDraftUI] = useState(false);
  const moduleData = MODULE_REGISTRY[moduleKey];

  // Safety: if moduleKey is not in registry, render child page directly
  if (!moduleData) return children;

  const ModuleIcon = moduleData.icon;

  // ── Demo Mode (shows underlying draft page) ──
  if (showDraftUI) {
    return (
      <div>
        {/* Demo Banner */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'linear-gradient(90deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
          borderBottom: '1px solid rgba(59,130,246,0.3)',
          backdropFilter: 'blur(12px)',
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '3px 10px', borderRadius: 6,
              background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)',
              fontSize: '0.72rem', fontWeight: 700, color: '#3b82f6',
              textTransform: 'uppercase', letterSpacing: '1px',
            }}>
              <Layers size={12} /> DEMO MODE
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Static UI Draft Showcase — {moduleName}
            </span>
          </div>
          <button
            onClick={() => setShowDraftUI(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'var(--bg-card)', border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.borderColor = 'var(--accent-blue)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          >
            <ArrowLeft size={14} /> Back to Overview
          </button>
        </div>
        {children}
      </div>
    );
  }

  // ── Overview Placeholder Screen ──
  return (
    <div className="fade-in">
      {/* ── HEADER ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--radius-md)',
            background: `${moduleData.iconColor}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${moduleData.iconColor}22`,
          }}>
            <ModuleIcon size={24} color={moduleData.iconColor} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{moduleName}</h2>
              <span style={{
                padding: '4px 12px', borderRadius: 100,
                background: `${moduleData.statusColor}18`,
                color: moduleData.statusColor,
                fontSize: '0.72rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: moduleData.statusColor,
                  boxShadow: `0 0 8px ${moduleData.statusColor}66`,
                  animation: 'pulseNotif 2s infinite',
                }} />
                {moduleData.status}
              </span>
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 720 }}>
          {moduleData.description}
        </p>
      </div>

      {/* ── METRICS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {moduleData.metrics.map((m, i) => (
          <div key={i} style={{
            ...S.glassCard,
            padding: '18px 20px',
            borderLeft: `3px solid ${m.color}`,
            cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 12px ${m.color}15`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: m.color, marginBottom: 4 }}>{m.value}</div>
            <ChangeIndicator change={m.change} changeType={m.changeType} />
          </div>
        ))}
      </div>

      {/* ── MAIN 2-COL LAYOUT ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* LEFT: Planned Features */}
        <div style={{ ...S.glassCard }}>
          <div style={S.panelTitle}><Layers size={14} /> Planned Capabilities</div>
          <div style={{ display: 'grid', gap: 4 }}>
            {moduleData.features.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} style={{
                  display: 'flex', gap: 14, padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.2s ease', cursor: 'default',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                    background: `${moduleData.iconColor}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FIcon size={16} color={moduleData.iconColor} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Chart + Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Chart */}
          <div style={{ ...S.glassCard }}>
            <ChartRenderer chartType={moduleData.chartType} chartData={moduleData.chartData} />
          </div>

          {/* Pipeline */}
          <div style={{ ...S.glassCard }}>
            <div style={S.panelTitle}><Sparkles size={14} /> Development Pipeline</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              {moduleData.pipeline.map((step, i) => (
                <PipelineStep key={i} {...step} isLast={i === moduleData.pipeline.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ROADMAP TIMELINE ── */}
      <div style={{ ...S.glassCard, marginBottom: 28 }}>
        <div style={S.panelTitle}><ChevronRight size={14} /> Release Roadmap</div>
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          {moduleData.roadmap.map((rm, i) => (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
              position: 'relative', padding: '0 12px',
            }}>
              {/* connector line */}
              {i < moduleData.roadmap.length - 1 && (
                <div style={{
                  position: 'absolute', top: 14, left: '50%', right: '-50%',
                  height: 2, background: i === 0 ? '#10b981' : 'var(--border-color)',
                  zIndex: 0,
                }} />
              )}
              <span style={{
                padding: '4px 12px', borderRadius: 100, zIndex: 1,
                background: i === 0 ? '#10b98122' : 'var(--bg-secondary)',
                border: `1px solid ${i === 0 ? '#10b981' : 'var(--border-color)'}`,
                color: i === 0 ? '#10b981' : 'var(--text-secondary)',
                fontSize: '0.72rem', fontWeight: 700,
              }}>
                {rm.quarter}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.4 }}>
                {rm.milestone}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FLOATING DEMO BUTTON ── */}
      <button
        onClick={() => setShowDraftUI(true)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 90,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 22px', borderRadius: 'var(--radius-xl)',
          background: 'rgba(26, 32, 53, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(59,130,246,0.3)',
          color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.25s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(59,130,246,0.15)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.3)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), 0 0 12px rgba(59,130,246,0.15)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Eye size={16} /> Explore Draft UI <ChevronRight size={14} />
      </button>
    </div>
  );
}
