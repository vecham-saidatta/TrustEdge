import { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle, Clock, Users, Shield, TrendingUp, TrendingDown, ChevronDown,
  Search, Filter, Eye, UserPlus, ArrowUpRight, CheckCircle, XCircle, X,
  Phone, MessageSquare, FileText, Calendar, Target, Zap, BarChart3,
  RefreshCw, ChevronRight, Activity, Brain, Award, ThumbsUp, ThumbsDown,
  Send, AlertCircle, Timer, Briefcase, DollarSign, ArrowUp, ArrowDown,
  MoreVertical, Check, Star, Flame, Layers, GitBranch, CircleDot
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const BRANCHES = ['Connaught Place', 'Bandra West', 'Anna Nagar', 'Koramangala', 'Salt Lake', 'Jubilee Hills'];
const RMS = ['Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh', 'Ananya Das'];

const generateTransactionTimeline = () => {
  const types = ['UPI', 'NEFT', 'IMPS', 'POS', 'ATM', 'Salary Credit', 'EMI Debit', 'Bill Pay'];
  const data = [];
  for (let i = 0; i < 25; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 90));
    data.push({
      id: `TXN${100000 + i}`,
      date: d.toISOString().split('T')[0],
      type: types[Math.floor(Math.random() * types.length)],
      amount: Math.floor(Math.random() * 500000) + 500,
      direction: Math.random() > 0.4 ? 'DEBIT' : 'CREDIT',
      description: ['Swiggy', 'Amazon', 'Salary - TCS', 'Home Loan EMI', 'SIP - HDFC MF', 'Electricity Bill', 'Rent Transfer'][Math.floor(Math.random() * 7)],
    });
  }
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};

const MOCK_CASES = [
  {
    id: 'RC-2026-0001', customerName: 'Rajesh Kumar', accountMasked: '****4521', branch: 'Connaught Place',
    caseType: 'CHURN_RISK', priority: 'CRITICAL', status: 'IN_PROGRESS', assignedRM: 'Priya Sharma',
    slaDeadline: new Date(Date.now() - 2 * 3600000), aumAtRisk: 4520000, caseAge: 5,
    churnScore: 0.87, riskSignals: [
      { signal: 'Salary credit dropped 60%', attribution: 0.31 },
      { signal: 'SIP cancelled (HDFC Flexi Cap)', attribution: 0.22 },
      { signal: 'Balance dropped below ₹50K avg', attribution: 0.18 },
      { signal: 'Competitor app detected (Kotak 811)', attribution: 0.10 },
      { signal: 'No login in 14 days', attribution: 0.06 },
    ],
    aiConfidence: 0.92, similarCases: 847,
    products: [
      { name: 'Savings Account', balance: 45200, trend: 'down' },
      { name: 'FD Portfolio', balance: 2500000, trend: 'stable' },
      { name: 'SIP (HDFC Flexi Cap)', balance: 850000, trend: 'cancelled' },
      { name: 'Home Loan', outstanding: 3200000, trend: 'active' },
    ],
    recommendations: {
      primary: { action: 'Offer premium savings rate upgrade (7.1% → 7.5%)', confidence: 0.89, conversion: 0.72 },
      secondary: { action: 'Waive locker charges for 2 years + priority banking', confidence: 0.76, conversion: 0.58 },
      fallback: { action: 'Branch manager personal call + wealth advisory session', confidence: 0.64, conversion: 0.41 },
    },
    interventionLog: [
      { timestamp: '2026-05-22 09:15', actor: 'Outreach Engine', actionType: 'CASE_CREATED', outcome: 'Escalated from Outreach Workflow', notes: 'Trigger: Negative Sentiment & Churn Risk > 85%' },
      { timestamp: '2026-05-22 14:30', actor: 'Priya Sharma', actionType: 'ASSIGNED', outcome: 'Accepted', notes: 'High-value customer, priority handling' },
      { timestamp: '2026-05-23 10:00', actor: 'Priya Sharma', actionType: 'CALL_ATTEMPTED', outcome: 'No Answer', notes: 'Customer did not pick up, will retry' },
      { timestamp: '2026-05-24 11:30', actor: 'Priya Sharma', actionType: 'CALL_CONNECTED', outcome: 'Discussed', notes: 'Customer unhappy with service charges. Offered rate revision.' },
      { timestamp: '2026-05-25 16:00', actor: 'System', actionType: 'SLA_WARNING', outcome: 'Alert', notes: '24 hours remaining on SLA' },
    ],
    approvalRequests: [
      { id: 'APR-001', type: 'Rate Override', description: 'Savings rate increase 7.1% → 7.5%', requestedBy: 'Priya Sharma', status: 'PENDING', requestDate: '2026-05-24', amount: '₹12,400/yr impact' },
    ],
    complaints: [
      { id: 'CMP-2241', date: '2026-04-15', subject: 'Service charges deducted without notice', status: 'RESOLVED' },
      { id: 'CMP-2198', date: '2026-02-20', subject: 'ATM card not working abroad', status: 'RESOLVED' },
    ],
    sageHistory: [
      { date: '2026-05-10', topic: 'FD rates comparison', sentiment: 'Negative' },
      { date: '2026-04-28', topic: 'Account closure process', sentiment: 'Negative' },
    ],
  },
  {
    id: 'RC-2026-0002', customerName: 'Meera Iyer', accountMasked: '****7832', branch: 'Anna Nagar',
    caseType: 'STRESS_ALERT', priority: 'HIGH', status: 'TRIAGED', assignedRM: 'Sneha Reddy',
    slaDeadline: new Date(Date.now() + 18 * 3600000), aumAtRisk: 1850000, caseAge: 3,
    churnScore: 0.72, riskSignals: [
      { signal: 'EMI bounce 2 consecutive months', attribution: 0.35 },
      { signal: 'Balance below minimum threshold', attribution: 0.20 },
      { signal: 'Increased UPI outflows', attribution: 0.12 },
      { signal: 'Support calls increased 3x', attribution: 0.05 },
    ],
    aiConfidence: 0.88, similarCases: 523,
    products: [
      { name: 'Savings Account', balance: 12400, trend: 'down' },
      { name: 'Personal Loan', outstanding: 450000, trend: 'stress' },
      { name: 'Credit Card', outstanding: 89000, trend: 'maxed' },
    ],
    recommendations: {
      primary: { action: 'Restructure personal loan EMI (reduce by 30%)', confidence: 0.84, conversion: 0.67 },
      secondary: { action: 'Offer moratorium period of 3 months', confidence: 0.71, conversion: 0.52 },
      fallback: { action: 'Connect with financial counselor', confidence: 0.59, conversion: 0.38 },
    },
    interventionLog: [
      { timestamp: '2026-05-24 08:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto-generated', notes: 'EMI bounce pattern detected' },
      { timestamp: '2026-05-24 14:00', actor: 'Sneha Reddy', actionType: 'TRIAGED', outcome: 'Accepted', notes: 'Assigned to stress management workflow' },
    ],
    approvalRequests: [],
    complaints: [],
    sageHistory: [],
  },
  {
    id: 'RC-2026-0003', customerName: 'Arjun Malhotra', accountMasked: '****3156', branch: 'Bandra West',
    caseType: 'CHURN_RISK', priority: 'CRITICAL', status: 'ESCALATED', assignedRM: 'Amit Patel',
    slaDeadline: new Date(Date.now() - 12 * 3600000), aumAtRisk: 12750000, caseAge: 8,
    churnScore: 0.93, riskSignals: [
      { signal: 'FD premature withdrawal initiated', attribution: 0.38 },
      { signal: 'Large NEFT to competitor bank', attribution: 0.28 },
      { signal: 'Demat transfer request filed', attribution: 0.15 },
      { signal: 'Account closure inquiry via SAGE', attribution: 0.10 },
      { signal: 'Negative sentiment in calls', attribution: 0.04 },
    ],
    aiConfidence: 0.95, similarCases: 231,
    products: [
      { name: 'Savings Account', balance: 1250000, trend: 'draining' },
      { name: 'FD Portfolio', balance: 8500000, trend: 'withdrawal' },
      { name: 'Mutual Funds', balance: 3000000, trend: 'redemption' },
    ],
    recommendations: {
      primary: { action: 'Escalate to Zonal Head — HNI retention protocol', confidence: 0.91, conversion: 0.65 },
      secondary: { action: 'Offer Wealth Management advisory + fee waiver', confidence: 0.82, conversion: 0.55 },
      fallback: { action: 'Match competitor rates + dedicated RM upgrade', confidence: 0.74, conversion: 0.48 },
    },
    interventionLog: [
      { timestamp: '2026-05-19 11:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto-generated', notes: 'HNI churn alert triggered' },
      { timestamp: '2026-05-19 11:30', actor: 'Amit Patel', actionType: 'ASSIGNED', outcome: 'Accepted', notes: '' },
      { timestamp: '2026-05-20 09:00', actor: 'Amit Patel', actionType: 'CALL_CONNECTED', outcome: 'Discussed', notes: 'Customer frustrated with service quality' },
      { timestamp: '2026-05-21 14:00', actor: 'Amit Patel', actionType: 'ESCALATED', outcome: 'Pending', notes: 'Needs Zonal Head intervention — AUM > ₹1Cr' },
    ],
    approvalRequests: [
      { id: 'APR-003', type: 'HNI Retention Package', description: 'Wealth advisory + fee waiver + premium locker', requestedBy: 'Amit Patel', status: 'APPROVED', requestDate: '2026-05-21', amount: '₹85,000/yr package' },
    ],
    complaints: [
      { id: 'CMP-2256', date: '2026-05-10', subject: 'Poor response time from branch', status: 'OPEN' },
    ],
    sageHistory: [
      { date: '2026-05-18', topic: 'Account closure steps', sentiment: 'Very Negative' },
      { date: '2026-05-15', topic: 'FD premature withdrawal penalty', sentiment: 'Negative' },
    ],
  },
  {
    id: 'RC-2026-0004', customerName: 'Sunita Devi', accountMasked: '****9043', branch: 'Salt Lake',
    caseType: 'NPA_RISK', priority: 'HIGH', status: 'IN_PROGRESS', assignedRM: 'Ananya Das',
    slaDeadline: new Date(Date.now() + 6 * 3600000), aumAtRisk: 750000, caseAge: 12,
    churnScore: 0.65, riskSignals: [
      { signal: 'Loan EMI overdue 60+ days', attribution: 0.40 },
      { signal: 'CIBIL score dropped below 600', attribution: 0.25 },
      { signal: 'Income proof documents expired', attribution: 0.10 },
    ],
    aiConfidence: 0.82, similarCases: 1245,
    products: [
      { name: 'Savings Account', balance: 8900, trend: 'down' },
      { name: 'Gold Loan', outstanding: 350000, trend: 'overdue' },
      { name: 'Personal Loan', outstanding: 400000, trend: 'overdue' },
    ],
    recommendations: {
      primary: { action: 'Offer OTS (One Time Settlement) at 85% of outstanding', confidence: 0.78, conversion: 0.55 },
      secondary: { action: 'Restructure with extended tenure + reduced rate', confidence: 0.72, conversion: 0.48 },
      fallback: { action: 'Initiate SARFAESI notice with 60-day cure period', confidence: 0.65, conversion: 0.30 },
    },
    interventionLog: [
      { timestamp: '2026-05-15 09:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto-generated', notes: 'NPA threshold approaching' },
      { timestamp: '2026-05-16 10:00', actor: 'Ananya Das', actionType: 'ASSIGNED', outcome: 'Accepted', notes: '' },
      { timestamp: '2026-05-18 15:00', actor: 'Ananya Das', actionType: 'SITE_VISIT', outcome: 'Completed', notes: 'Customer willing to negotiate OTS' },
    ],
    approvalRequests: [
      { id: 'APR-004', type: 'OTS Approval', description: 'Settlement at ₹6,37,500 (85% of ₹7,50,000)', requestedBy: 'Ananya Das', status: 'PENDING', requestDate: '2026-05-20', amount: '₹1,12,500 write-off' },
    ],
    complaints: [],
    sageHistory: [],
  },
  {
    id: 'RC-2026-0005', customerName: 'Vikrant Khanna', accountMasked: '****6718', branch: 'Koramangala',
    caseType: 'COMPLAINT_ESCALATION', priority: 'MODERATE', status: 'OPEN', assignedRM: null,
    slaDeadline: new Date(Date.now() + 48 * 3600000), aumAtRisk: 2100000, caseAge: 1,
    churnScore: 0.45, riskSignals: [
      { signal: '3 complaints in 30 days', attribution: 0.30 },
      { signal: 'Negative SAGE conversation sentiment', attribution: 0.15 },
    ],
    aiConfidence: 0.71, similarCases: 392,
    products: [
      { name: 'Savings Account', balance: 210000, trend: 'stable' },
      { name: 'FD', balance: 1500000, trend: 'stable' },
      { name: 'Insurance', balance: 390000, trend: 'active' },
    ],
    recommendations: {
      primary: { action: 'Assign senior RM for complaint resolution', confidence: 0.80, conversion: 0.70 },
      secondary: { action: 'Offer service upgrade + fee reversal', confidence: 0.65, conversion: 0.52 },
      fallback: { action: 'Branch Manager courtesy call', confidence: 0.55, conversion: 0.40 },
    },
    interventionLog: [
      { timestamp: '2026-05-26 07:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto-generated', notes: 'Complaint escalation threshold breached' },
    ],
    approvalRequests: [],
    complaints: [
      { id: 'CMP-2260', date: '2026-05-20', subject: 'Wrong charges on account', status: 'OPEN' },
      { id: 'CMP-2258', date: '2026-05-15', subject: 'Net banking issues', status: 'OPEN' },
      { id: 'CMP-2255', date: '2026-05-05', subject: 'Card delivery delay', status: 'RESOLVED' },
    ],
    sageHistory: [
      { date: '2026-05-22', topic: 'Why am I being charged?', sentiment: 'Angry' },
    ],
  },
  {
    id: 'RC-2026-0006', customerName: 'Priyanka Bose', accountMasked: '****2901', branch: 'Salt Lake',
    caseType: 'CHURN_RISK', priority: 'HIGH', status: 'OPEN', assignedRM: null,
    slaDeadline: new Date(Date.now() + 36 * 3600000), aumAtRisk: 3200000, caseAge: 2,
    churnScore: 0.78, riskSignals: [
      { signal: 'Large withdrawal from savings', attribution: 0.29 },
      { signal: 'New account opened at competitor', attribution: 0.24 },
      { signal: 'Decreased digital engagement', attribution: 0.12 },
    ],
    aiConfidence: 0.85, similarCases: 614,
    products: [{ name: 'Savings', balance: 320000, trend: 'down' }, { name: 'MF', balance: 2880000, trend: 'stable' }],
    recommendations: {
      primary: { action: 'Priority wealth review with personalized portfolio', confidence: 0.83, conversion: 0.61 },
      secondary: { action: 'Enhanced digital banking features demo', confidence: 0.70, conversion: 0.48 },
      fallback: { action: 'Loyalty rewards acceleration', confidence: 0.58, conversion: 0.35 },
    },
    interventionLog: [{ timestamp: '2026-05-25 12:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto-generated', notes: '' }],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0007', customerName: 'Ramesh Gupta', accountMasked: '****5544', branch: 'Connaught Place',
    caseType: 'STRESS_ALERT', priority: 'MODERATE', status: 'RESOLVED', assignedRM: 'Vikram Singh',
    slaDeadline: new Date(Date.now() - 72 * 3600000), aumAtRisk: 560000, caseAge: 15,
    churnScore: 0.35, riskSignals: [
      { signal: 'Temporary income disruption', attribution: 0.28 },
      { signal: 'Increased credit card usage', attribution: 0.15 },
    ],
    aiConfidence: 0.79, similarCases: 890,
    products: [{ name: 'Savings', balance: 56000, trend: 'recovering' }],
    recommendations: {
      primary: { action: 'Monitoring — situation stabilizing', confidence: 0.90, conversion: 0.85 },
      secondary: { action: 'Offer credit line increase', confidence: 0.60, conversion: 0.40 },
      fallback: { action: 'Financial wellness check-in', confidence: 0.50, conversion: 0.35 },
    },
    interventionLog: [
      { timestamp: '2026-05-12 09:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto-generated', notes: '' },
      { timestamp: '2026-05-12 14:00', actor: 'Vikram Singh', actionType: 'ASSIGNED', outcome: 'Accepted', notes: '' },
      { timestamp: '2026-05-14 11:00', actor: 'Vikram Singh', actionType: 'CALL_CONNECTED', outcome: 'Resolved', notes: 'Temporary job change, new salary coming next month' },
      { timestamp: '2026-05-20 10:00', actor: 'Vikram Singh', actionType: 'RESOLVED', outcome: 'Retained', notes: 'Customer stable, new salary credited' },
    ],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0008', customerName: 'Fatima Sheikh', accountMasked: '****8876', branch: 'Bandra West',
    caseType: 'CHURN_RISK', priority: 'HIGH', status: 'IN_PROGRESS', assignedRM: 'Amit Patel',
    slaDeadline: new Date(Date.now() + 10 * 3600000), aumAtRisk: 5600000, caseAge: 4,
    churnScore: 0.81, riskSignals: [
      { signal: 'FD maturity not renewed', attribution: 0.33 },
      { signal: 'Large UPI transfers out', attribution: 0.22 },
      { signal: 'Branch visit — closing inquiry', attribution: 0.18 },
    ],
    aiConfidence: 0.90, similarCases: 445,
    products: [{ name: 'FD', balance: 4000000, trend: 'maturing' }, { name: 'Savings', balance: 1600000, trend: 'declining' }],
    recommendations: {
      primary: { action: 'Offer premium FD rate (8.2%) + sweep account', confidence: 0.87, conversion: 0.69 },
      secondary: { action: 'Wealth management upgrade', confidence: 0.73, conversion: 0.54 },
      fallback: { action: 'Branch Head personal meeting', confidence: 0.62, conversion: 0.42 },
    },
    interventionLog: [
      { timestamp: '2026-05-23 08:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto-generated', notes: '' },
      { timestamp: '2026-05-23 12:00', actor: 'Amit Patel', actionType: 'ASSIGNED', outcome: 'Accepted', notes: '' },
    ],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0009', customerName: 'Deepak Joshi', accountMasked: '****1234', branch: 'Jubilee Hills',
    caseType: 'NPA_RISK', priority: 'CRITICAL', status: 'ESCALATED', assignedRM: 'Sneha Reddy',
    slaDeadline: new Date(Date.now() - 6 * 3600000), aumAtRisk: 2800000, caseAge: 20,
    churnScore: 0.55, riskSignals: [
      { signal: 'Loan 90+ DPD (Days Past Due)', attribution: 0.45 },
      { signal: 'Multiple cheque bounces', attribution: 0.25 },
      { signal: 'Legal notice sent', attribution: 0.10 },
    ],
    aiConfidence: 0.86, similarCases: 678,
    products: [{ name: 'Home Loan', outstanding: 2800000, trend: 'NPA' }],
    recommendations: {
      primary: { action: 'Initiate restructuring under RBI guidelines', confidence: 0.75, conversion: 0.45 },
      secondary: { action: 'Mediate settlement through legal desk', confidence: 0.68, conversion: 0.38 },
      fallback: { action: 'Proceed with SARFAESI action', confidence: 0.90, conversion: 0.25 },
    },
    interventionLog: [
      { timestamp: '2026-05-07 09:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto', notes: '' },
      { timestamp: '2026-05-07 11:00', actor: 'Sneha Reddy', actionType: 'ASSIGNED', outcome: 'Accepted', notes: '' },
      { timestamp: '2026-05-10 14:00', actor: 'Sneha Reddy', actionType: 'ESCALATED', outcome: 'Pending', notes: 'Needs legal team involvement' },
    ],
    approvalRequests: [
      { id: 'APR-009', type: 'Legal Action', description: 'SARFAESI notice issuance', requestedBy: 'Sneha Reddy', status: 'APPROVED', requestDate: '2026-05-12', amount: 'Legal costs ₹15,000' },
    ],
    complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0010', customerName: 'Kavitha Menon', accountMasked: '****4477', branch: 'Koramangala',
    caseType: 'CHURN_RISK', priority: 'MODERATE', status: 'IN_PROGRESS', assignedRM: 'Priya Sharma',
    slaDeadline: new Date(Date.now() + 30 * 3600000), aumAtRisk: 980000, caseAge: 6,
    churnScore: 0.52, riskSignals: [
      { signal: 'Reduced transaction frequency', attribution: 0.22 },
      { signal: 'App uninstalled', attribution: 0.18 },
    ],
    aiConfidence: 0.74, similarCases: 1120,
    products: [{ name: 'Savings', balance: 98000, trend: 'declining' }, { name: 'RD', balance: 880000, trend: 'stable' }],
    recommendations: {
      primary: { action: 'Re-engagement campaign — exclusive offers', confidence: 0.76, conversion: 0.58 },
      secondary: { action: 'Digital banking training session', confidence: 0.62, conversion: 0.42 },
      fallback: { action: 'RM call for feedback', confidence: 0.55, conversion: 0.35 },
    },
    interventionLog: [
      { timestamp: '2026-05-21 08:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto', notes: '' },
      { timestamp: '2026-05-21 15:00', actor: 'Priya Sharma', actionType: 'ASSIGNED', outcome: 'Accepted', notes: '' },
    ],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0011', customerName: 'Sanjay Tiwari', accountMasked: '****6690', branch: 'Connaught Place',
    caseType: 'COMPLAINT_ESCALATION', priority: 'HIGH', status: 'TRIAGED', assignedRM: 'Vikram Singh',
    slaDeadline: new Date(Date.now() + 14 * 3600000), aumAtRisk: 1450000, caseAge: 4,
    churnScore: 0.60, riskSignals: [
      { signal: 'Regulatory complaint filed', attribution: 0.40 },
      { signal: 'Social media negative post', attribution: 0.20 },
    ],
    aiConfidence: 0.80, similarCases: 289,
    products: [{ name: 'Current Account', balance: 1450000, trend: 'at-risk' }],
    recommendations: {
      primary: { action: 'Immediate complaint resolution + compensation', confidence: 0.85, conversion: 0.68 },
      secondary: { action: 'Escalate to Grievance Officer', confidence: 0.78, conversion: 0.60 },
      fallback: { action: 'Formal written apology + service recovery', confidence: 0.65, conversion: 0.45 },
    },
    interventionLog: [
      { timestamp: '2026-05-23 10:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto', notes: 'Regulatory complaint detected' },
      { timestamp: '2026-05-23 11:00', actor: 'Vikram Singh', actionType: 'TRIAGED', outcome: 'Priority', notes: 'Regulatory complaint — urgent' },
    ],
    approvalRequests: [], complaints: [
      { id: 'CMP-REG-001', date: '2026-05-22', subject: 'Unauthorized charges — RBI complaint', status: 'OPEN' },
    ], sageHistory: [],
  },
  {
    id: 'RC-2026-0012', customerName: 'Lakshmi Narayanan', accountMasked: '****3311', branch: 'Anna Nagar',
    caseType: 'CHURN_RISK', priority: 'MODERATE', status: 'CLOSED', assignedRM: 'Sneha Reddy',
    slaDeadline: new Date(Date.now() - 120 * 3600000), aumAtRisk: 670000, caseAge: 22,
    churnScore: 0.25, riskSignals: [{ signal: 'Minor balance fluctuation', attribution: 0.15 }],
    aiConfidence: 0.68, similarCases: 1500,
    products: [{ name: 'Savings', balance: 670000, trend: 'stable' }],
    recommendations: {
      primary: { action: 'No action needed — customer retained', confidence: 0.95, conversion: 0.90 },
      secondary: { action: 'Cross-sell FD products', confidence: 0.60, conversion: 0.35 },
      fallback: { action: 'Routine check-in', confidence: 0.50, conversion: 0.30 },
    },
    interventionLog: [
      { timestamp: '2026-05-05 09:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto', notes: '' },
      { timestamp: '2026-05-05 14:00', actor: 'Sneha Reddy', actionType: 'ASSIGNED', outcome: 'Accepted', notes: '' },
      { timestamp: '2026-05-08 11:00', actor: 'Sneha Reddy', actionType: 'CALL_CONNECTED', outcome: 'Stable', notes: 'Customer happy, minor concern addressed' },
      { timestamp: '2026-05-15 09:00', actor: 'Sneha Reddy', actionType: 'CLOSED', outcome: 'Retained', notes: 'Case resolved, customer retained' },
    ],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0013', customerName: 'Anil Kapoor', accountMasked: '****7789', branch: 'Jubilee Hills',
    caseType: 'STRESS_ALERT', priority: 'CRITICAL', status: 'OPEN', assignedRM: null,
    slaDeadline: new Date(Date.now() + 8 * 3600000), aumAtRisk: 4100000, caseAge: 1,
    churnScore: 0.70, riskSignals: [
      { signal: 'Business account cash flow negative', attribution: 0.35 },
      { signal: 'OD limit fully utilized', attribution: 0.25 },
      { signal: 'Tax notice received (flagged by system)', attribution: 0.15 },
    ],
    aiConfidence: 0.83, similarCases: 356,
    products: [
      { name: 'Current Account', balance: 41000, trend: 'critical' },
      { name: 'OD Facility', outstanding: 2500000, trend: 'maxed' },
      { name: 'Business Loan', outstanding: 1600000, trend: 'stress' },
    ],
    recommendations: {
      primary: { action: 'Emergency OD limit extension + cash flow advisory', confidence: 0.81, conversion: 0.59 },
      secondary: { action: 'Business restructuring consultation', confidence: 0.73, conversion: 0.48 },
      fallback: { action: 'Connect with CA partner network', confidence: 0.60, conversion: 0.35 },
    },
    interventionLog: [
      { timestamp: '2026-05-26 06:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto', notes: 'Business stress signals detected' },
    ],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0014', customerName: 'Nisha Agarwal', accountMasked: '****5523', branch: 'Bandra West',
    caseType: 'CHURN_RISK', priority: 'HIGH', status: 'IN_PROGRESS', assignedRM: 'Priya Sharma',
    slaDeadline: new Date(Date.now() + 4 * 3600000), aumAtRisk: 7800000, caseAge: 3,
    churnScore: 0.84, riskSignals: [
      { signal: 'Wealth portfolio rebalancing to competitor', attribution: 0.32 },
      { signal: 'Premium benefits not utilized', attribution: 0.18 },
      { signal: 'Relationship dormancy 45 days', attribution: 0.14 },
    ],
    aiConfidence: 0.91, similarCases: 178,
    products: [
      { name: 'Premium Savings', balance: 2800000, trend: 'declining' },
      { name: 'MF Portfolio', balance: 5000000, trend: 'partial-redemption' },
    ],
    recommendations: {
      primary: { action: 'HNI desk personal outreach + exclusive event invite', confidence: 0.88, conversion: 0.72 },
      secondary: { action: 'Portfolio review with wealth advisor', confidence: 0.79, conversion: 0.60 },
      fallback: { action: 'Premium service upgrade with dedicated support', confidence: 0.67, conversion: 0.48 },
    },
    interventionLog: [
      { timestamp: '2026-05-24 10:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto', notes: '' },
      { timestamp: '2026-05-24 12:00', actor: 'Priya Sharma', actionType: 'ASSIGNED', outcome: 'Accepted', notes: 'HNI — priority handling' },
    ],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
  {
    id: 'RC-2026-0015', customerName: 'Harish Babu', accountMasked: '****0098', branch: 'Anna Nagar',
    caseType: 'NPA_RISK', priority: 'MODERATE', status: 'TRIAGED', assignedRM: 'Ananya Das',
    slaDeadline: new Date(Date.now() + 52 * 3600000), aumAtRisk: 420000, caseAge: 7,
    churnScore: 0.48, riskSignals: [
      { signal: 'Vehicle loan 30+ DPD', attribution: 0.30 },
      { signal: 'Income verification pending', attribution: 0.15 },
    ],
    aiConfidence: 0.75, similarCases: 980,
    products: [
      { name: 'Savings', balance: 22000, trend: 'low' },
      { name: 'Vehicle Loan', outstanding: 420000, trend: 'overdue' },
    ],
    recommendations: {
      primary: { action: 'Restructure EMI with 6-month grace', confidence: 0.77, conversion: 0.56 },
      secondary: { action: 'Offer top-up loan for immediate relief', confidence: 0.62, conversion: 0.40 },
      fallback: { action: 'Physical follow-up and documentation collection', confidence: 0.55, conversion: 0.35 },
    },
    interventionLog: [
      { timestamp: '2026-05-20 09:00', actor: 'System', actionType: 'CASE_CREATED', outcome: 'Auto', notes: '' },
      { timestamp: '2026-05-21 10:00', actor: 'Ananya Das', actionType: 'TRIAGED', outcome: 'Accepted', notes: '' },
    ],
    approvalRequests: [], complaints: [], sageHistory: [],
  },
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getSLAStatus = (deadline) => {
  const now = new Date();
  const diff = deadline - now;
  const hours = diff / 3600000;
  if (hours < 0) return { label: `Breached ${Math.abs(Math.floor(hours))}h ago`, color: '#ef4444', status: 'BREACHED' };
  if (hours < 24) return { label: `${Math.floor(hours)}h ${Math.floor((diff % 3600000) / 60000)}m left`, color: '#f59e0b', status: 'WARNING' };
  return { label: `${Math.floor(hours)}h remaining`, color: '#10b981', status: 'OK' };
};

const CASE_TYPE_CONFIG = {
  CHURN_RISK: { label: 'Churn Risk', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  STRESS_ALERT: { label: 'Stress Alert', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  NPA_RISK: { label: 'NPA Risk', color: '#dc2626', bg: 'rgba(220,38,38,0.12)' },
  COMPLAINT_ESCALATION: { label: 'Complaint Esc.', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
};

const PRIORITY_CONFIG = {
  CRITICAL: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  HIGH: { label: 'High', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  MODERATE: { label: 'Moderate', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
};

const STATUS_CONFIG = {
  OPEN: { label: 'Open', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  TRIAGED: { label: 'Triaged', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  IN_PROGRESS: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  ESCALATED: { label: 'Escalated', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  RESOLVED: { label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  CLOSED: { label: 'Closed', color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};

const formatCurrency = (val) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

// ═══════════════════════════════════════════════════════════════
// SPARKLINE COMPONENT
// ═══════════════════════════════════════════════════════════════
function Sparkline({ data, width = 80, height = 24, color = '#3b82f6' }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data.map(d => d.score));
  const min = Math.min(...data.map(d => d.score));
  const range = max - min || 1;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - ((d.score - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// CASE DETAIL MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════
function CaseDetailModal({ caseData, onClose }) {
  const [activeTab, setActiveTab] = useState('risk');
  const [logCallOpen, setLogCallOpen] = useState(false);
  const [callOutcome, setCallOutcome] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(null);

  const [mcData, setMcData] = useState([]);
  const [churnTrend, setChurnTrend] = useState([]);

  useEffect(() => {
    if (caseData.churnReport?.dailyRiskCurve) {
      try {
        const parsed = JSON.parse(caseData.churnReport.dailyRiskCurve);
        setChurnTrend(parsed.map((item, i) => ({ day: i + 1, score: item.probability || item })));
      } catch (e) {
        console.error('Failed to parse dailyRiskCurve', e);
        setChurnTrend([{day: 1, score: caseData.churnScore}, {day: 30, score: caseData.churnScore}]);
      }
    } else {
      setChurnTrend([{day: 1, score: caseData.churnScore}, {day: 30, score: caseData.churnScore}]);
    }
  }, [caseData.id, caseData.churnScore, caseData.churnReport]);

  useEffect(() => {
    const fetchSimulations = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userId = caseData.userId || caseData.user?.id || '';
        let url = `http://localhost:5000/api/v1/retention/simulate`;
        if (userId) url += `?userId=${userId}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data?.data?.length > 0) {
          setMcData(data.data.map(d => ({ day: d.day, p10: d.p10, p50: d.p50, p90: d.p90 })));
        } else {
           // If no simulations found for user, fetch default baseline
          const res2 = await fetch(`http://localhost:5000/api/v1/retention/simulate`, { headers: { Authorization: `Bearer ${token}` } });
          const data2 = await res2.json();
          if (data2?.data?.length > 0) {
             setMcData(data2.data.map(d => ({ day: d.day, p10: d.p10, p50: d.p50, p90: d.p90 })));
          }
        }
      } catch (e) {
        console.error('Failed to fetch simulations', e);
      }
    };
    fetchSimulations();
  }, [caseData.userId, caseData.user?.id]);

  const txnTimeline = useMemo(() => generateTransactionTimeline(), [caseData.id]);

  const TABS = [
    { key: 'risk', label: 'Risk Intelligence', icon: Brain },
    { key: 'customer360', label: 'Customer 360', icon: Users },
    { key: 'actions', label: 'Recommended Actions', icon: Target },
    { key: 'log', label: 'Intervention Log', icon: FileText },
    { key: 'approvals', label: 'Approval Requests', icon: Award },
  ];

  const sla = getSLAStatus(caseData.slaDeadline);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{
        position: 'relative', width: '90%', maxWidth: 1000, maxHeight: '92vh', overflowY: 'auto',
        background: 'rgba(26, 32, 53, 0.97)', backdropFilter: 'blur(20px)', borderRadius: 20,
        border: '1px solid var(--border-color)', padding: 0, boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '24px 28px 16px', borderBottom: '1px solid var(--border-color)',
          background: 'linear-gradient(135deg, rgba(26,32,53,0.95), rgba(17,24,39,0.95))',
          borderRadius: '20px 20px 0 0', position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{caseData.customerName}</h2>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{caseData.id}</span>
                <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: CASE_TYPE_CONFIG[caseData.caseType].bg, color: CASE_TYPE_CONFIG[caseData.caseType].color }}>
                  {CASE_TYPE_CONFIG[caseData.caseType].label}
                </span>
                <span style={{ padding: '3px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, background: PRIORITY_CONFIG[caseData.priority].bg, color: PRIORITY_CONFIG[caseData.priority].color }}>
                  {PRIORITY_CONFIG[caseData.priority].label}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                A/C: {caseData.accountMasked} · {caseData.branch} Branch · RM: {caseData.assignedRM || 'Unassigned'} · Age: {caseData.caseAge} days
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* SLA Timer */}
              <div style={{
                padding: '10px 18px', borderRadius: 12, background: `${sla.color}12`,
                border: `1px solid ${sla.color}30`, textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 2 }}>SLA STATUS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Timer size={14} color={sla.color} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: sla.color }}>{sla.label}</span>
                </div>
                {sla.status === 'BREACHED' && (
                  <div style={{ fontSize: '0.62rem', color: '#ef4444', marginTop: 2 }}>⚠ Auto-escalation triggered</div>
                )}
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Case Stats Bar */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Churn Score</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: caseData.churnScore > 0.7 ? '#ef4444' : caseData.churnScore > 0.5 ? '#f59e0b' : '#10b981' }}>
                {(caseData.churnScore * 100).toFixed(0)}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>AUM at Risk</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444' }}>{formatCurrency(caseData.aumAtRisk)}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>AI Confidence</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#3b82f6' }}>{(caseData.aiConfidence * 100).toFixed(0)}%</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Similar Cases</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{caseData.similarCases.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '6px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Status</div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: STATUS_CONFIG[caseData.status].color }}>
                {STATUS_CONFIG[caseData.status].label}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: 'none', overflowX: 'auto' }}>
            {TABS.map(t => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  style={{
                    flex: 1, padding: '10px 6px', background: 'none', border: 'none',
                    borderBottom: `2px solid ${isActive ? '#3b82f6' : 'transparent'}`,
                    color: isActive ? '#3b82f6' : 'var(--text-muted)', fontFamily: 'inherit',
                    fontSize: '0.75rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                  }}>
                  <Icon size={13} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px 28px' }}>

          {/* TAB 1: Risk Intelligence */}
          {activeTab === 'risk' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Churn Score with 30-Day Trend Sparkline */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Activity size={14} color="#ef4444" /> Churn Score — 30 Day Trend
                  </div>
                  <div style={{ height: 140 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={churnTrend}>
                        <defs>
                          <linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                        <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, fontSize: '0.75rem' }}
                          formatter={(v) => [`${(v * 100).toFixed(1)}%`, 'Churn Score']} />
                        <ReferenceLine y={0.7} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'High Risk', position: 'right', fill: '#ef4444', fontSize: 10 }} />
                        <Area type="monotone" dataKey="score" stroke="#ef4444" fill="url(#churnGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top 5 Risk Signals with Attribution Bars */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={14} color="#f59e0b" /> Top Risk Signals — Attribution
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {caseData.riskSignals.map((sig, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sig.signal}</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444' }}>+{sig.attribution.toFixed(2)}</span>
                        </div>
                        <div style={{ background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                          <div style={{
                            width: `${sig.attribution * 200}%`, height: '100%',
                            background: `linear-gradient(90deg, #ef4444, ${i < 2 ? '#dc2626' : '#f97316'})`,
                            borderRadius: 4, transition: 'width 0.8s ease',
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monte Carlo Projection Chart */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BarChart3 size={14} color="#8b5cf6" /> Monte Carlo Projection (10K Simulations) — P10 / P50 / P90
                  </div>
                  <span className="badge badge-purple">90-Day Forward</span>
                </div>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mcData}>
                      <defs>
                        <linearGradient id="mcBand" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
                      <Tooltip contentStyle={{ background: '#1a2035', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 8, fontSize: '0.75rem' }}
                        formatter={(v) => [`${(v * 100).toFixed(1)}%`]} />
                      <Area type="monotone" dataKey="p90" stroke="#ef4444" strokeWidth={1} fill="url(#mcBand)" strokeDasharray="4 4" name="P90 (Worst)" />
                      <Area type="monotone" dataKey="p50" stroke="#8b5cf6" strokeWidth={2} fill="none" name="P50 (Median)" />
                      <Area type="monotone" dataKey="p10" stroke="#10b981" strokeWidth={1} fill="none" strokeDasharray="4 4" name="P10 (Best)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 10, justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#10b981' }}><div style={{ width: 16, height: 2, background: '#10b981' }} /> P10 (Best Case)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#8b5cf6' }}><div style={{ width: 16, height: 2, background: '#8b5cf6' }} /> P50 (Median)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#ef4444' }}><div style={{ width: 16, height: 2, background: '#ef4444' }} /> P90 (Worst Case)</div>
                </div>
              </div>

              {/* AI Confidence & Similar Cases */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={22} color="#3b82f6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AI Model Confidence</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6' }}>{(caseData.aiConfidence * 100).toFixed(0)}%</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Based on {caseData.similarCases.toLocaleString()} similar historical cases</div>
                  </div>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 6 }}>SLA Breach History</div>
                  {sla.status === 'BREACHED' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertCircle size={18} color="#ef4444" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>SLA BREACHED</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Auto-escalation active — notified Branch Head</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={18} color="#10b981" />
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>Within SLA</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sla.label}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Customer 360 */}
          {activeTab === 'customer360' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Transaction Timeline */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Activity size={14} color="#3b82f6" /> Transaction Timeline — Last 90 Days
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ minWidth: 600 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th>Direction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txnTimeline.slice(0, 10).map((txn, i) => (
                        <tr key={i}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{txn.date}</td>
                          <td><span className="badge badge-blue">{txn.type}</span></td>
                          <td style={{ fontSize: '0.8rem' }}>{txn.description}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'monospace' }}>{formatCurrency(txn.amount)}</td>
                          <td>
                            <span style={{ color: txn.direction === 'CREDIT' ? '#10b981' : '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>
                              {txn.direction === 'CREDIT' ? '↑' : '↓'} {txn.direction}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Holdings */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Briefcase size={14} color="#10b981" /> Product Holdings & Balance Trends
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {caseData.products.map((prod, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 10, padding: 14, border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>{prod.name}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {formatCurrency(prod.balance || prod.outstanding || 0)}
                      </div>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 6,
                        background: prod.trend === 'stable' || prod.trend === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: prod.trend === 'stable' || prod.trend === 'active' || prod.trend === 'recovering' ? '#10b981' : '#ef4444',
                      }}>
                        {prod.trend === 'down' || prod.trend === 'declining' || prod.trend === 'draining' ? '↓' : prod.trend === 'stable' || prod.trend === 'active' ? '→' : '⚠'} {prod.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complaint History & SAGE */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={14} color="#f59e0b" /> Complaint History
                  </div>
                  {caseData.complaints.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: '0.8rem' }}>No complaints on record</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {caseData.complaints.map((c, i) => (
                        <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 8, borderLeft: `3px solid ${c.status === 'OPEN' ? '#f59e0b' : '#10b981'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                            <span style={{ fontWeight: 600 }}>{c.id}</span>
                            <span style={{ color: c.status === 'OPEN' ? '#f59e0b' : '#10b981', fontWeight: 600 }}>{c.status}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 2 }}>{c.subject}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.date}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MessageSquare size={14} color="#8b5cf6" /> SAGE Conversation History
                  </div>
                  {caseData.sageHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', fontSize: '0.8rem' }}>No SAGE conversations</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {caseData.sageHistory.map((s, i) => {
                        const sentColor = s.sentiment.includes('Negative') || s.sentiment === 'Angry' ? '#ef4444' : s.sentiment === 'Positive' ? '#10b981' : '#f59e0b';
                        return (
                          <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 8, borderLeft: `3px solid ${sentColor}` }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{s.topic}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.date}</span>
                              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: sentColor }}>{s.sentiment}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Recommended Actions */}
          {activeTab === 'actions' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                AI-generated action plan based on customer profile, risk signals, and {caseData.similarCases.toLocaleString()} historical outcomes.
              </div>

              {[
                { key: 'primary', label: 'Primary Recommendation', color: '#10b981', icon: '🎯', data: caseData.recommendations.primary },
                { key: 'secondary', label: 'Secondary Recommendation', color: '#3b82f6', icon: '🔄', data: caseData.recommendations.secondary },
                { key: 'fallback', label: 'Fallback Recommendation', color: '#f59e0b', icon: '🛟', data: caseData.recommendations.fallback },
              ].map((rec) => (
                <div key={rec.key} style={{
                  background: 'var(--bg-secondary)', borderRadius: 12, padding: 20,
                  borderLeft: `4px solid ${rec.color}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: rec.color, fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
                        {rec.icon} {rec.label}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{rec.data.action}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <div style={{ textAlign: 'center', padding: '4px 10px', borderRadius: 8, background: `${rec.color}12` }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Confidence</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: rec.color }}>{(rec.data.confidence * 100).toFixed(0)}%</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '4px 10px', borderRadius: 8, background: 'rgba(139,92,246,0.1)' }}>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Conversion</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8b5cf6' }}>{(rec.data.conversion * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <Check size={13} /> Accept
                    </button>
                    <button className="btn btn-sm" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <FileText size={13} /> Modify
                    </button>
                    <button className="btn btn-sm" onClick={() => setShowRejectForm(showRejectForm === rec.key ? null : rec.key)}
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <XCircle size={13} /> Reject
                    </button>
                  </div>
                  {showRejectForm === rec.key && (
                    <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                      <div className="form-label" style={{ marginBottom: 6 }}>Rejection Reason (Required)</div>
                      <textarea className="form-input" rows={2} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why this recommendation is not suitable..."
                        style={{ fontSize: '0.8rem', minHeight: 60 }} />
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button className="btn btn-sm btn-danger" disabled={!rejectReason.trim()}>Submit Rejection</button>
                        <button className="btn btn-sm btn-secondary" onClick={() => { setShowRejectForm(null); setRejectReason(''); }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Intervention Log */}
          {activeTab === 'log' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Chronological intervention timeline — {caseData.interventionLog.length} entries
                </div>
                <button className="btn btn-sm btn-primary" onClick={() => setLogCallOpen(!logCallOpen)}>
                  <Phone size={13} /> Log Call
                </button>
              </div>

              {logCallOpen && (
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 18, border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: 12 }}>📞 Log New Call</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div className="form-label">Outcome</div>
                      <select className="form-input" value={callOutcome} onChange={(e) => setCallOutcome(e.target.value)}>
                        <option value="">Select outcome...</option>
                        <option value="CONNECTED">Connected — Discussed</option>
                        <option value="NO_ANSWER">No Answer</option>
                        <option value="BUSY">Busy — Callback Requested</option>
                        <option value="VOICEMAIL">Left Voicemail</option>
                        <option value="WRONG_NUMBER">Wrong Number</option>
                        <option value="RESOLVED">Resolved on Call</option>
                      </select>
                    </div>
                    <div>
                      <div className="form-label">Action Type</div>
                      <select className="form-input">
                        <option>Phone Call</option>
                        <option>Video Call</option>
                        <option>Branch Visit</option>
                        <option>WhatsApp Message</option>
                        <option>Email Sent</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="form-label">Notes</div>
                    <textarea className="form-input" rows={2} value={callNotes} onChange={(e) => setCallNotes(e.target.value)}
                      placeholder="Add detailed notes about the interaction..." />
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn btn-sm btn-primary"><Send size={13} /> Submit Entry</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setLogCallOpen(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div style={{ position: 'absolute', left: 10, top: 0, bottom: 0, width: 2, background: 'var(--border-color)' }} />
                {caseData.interventionLog.map((entry, i) => {
                  const typeColors = {
                    CASE_CREATED: '#3b82f6', ASSIGNED: '#06b6d4', TRIAGED: '#06b6d4',
                    CALL_ATTEMPTED: '#f59e0b', CALL_CONNECTED: '#10b981', ESCALATED: '#ef4444',
                    RESOLVED: '#10b981', CLOSED: '#64748b', SITE_VISIT: '#8b5cf6',
                    SLA_WARNING: '#f59e0b',
                  };
                  const color = typeColors[entry.actionType] || '#3b82f6';
                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                      <div style={{
                        position: 'absolute', left: -22, top: 4, width: 12, height: 12, borderRadius: '50%',
                        background: color, border: '2px solid var(--bg-card)',
                      }} />
                      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', borderLeft: `3px solid ${color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{entry.actionType.replace(/_/g, ' ')}</span>
                            <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 6, background: `${color}15`, color }}>{entry.outcome}</span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{entry.timestamp}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: 600 }}>{entry.actor}</span> {entry.notes && `— ${entry.notes}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Approval Requests */}
          {activeTab === 'approvals' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Pending incentive & authority requests for this case
              </div>

              {caseData.approvalRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  <Award size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <div style={{ fontSize: '0.85rem' }}>No approval requests for this case</div>
                </div>
              ) : (
                caseData.approvalRequests.map((req, i) => {
                  const statusColors = { PENDING: '#f59e0b', APPROVED: '#10b981', REJECTED: '#ef4444' };
                  return (
                    <div key={i} style={{
                      background: 'var(--bg-secondary)', borderRadius: 12, padding: 20,
                      borderLeft: `4px solid ${statusColors[req.status]}`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{req.type}</div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{req.description}</div>
                        </div>
                        <span style={{
                          padding: '4px 12px', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700,
                          background: `${statusColors[req.status]}15`, color: statusColors[req.status],
                        }}>
                          {req.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Requested by: <strong style={{ color: 'var(--text-secondary)' }}>{req.requestedBy}</strong></span>
                        <span>Date: {req.requestDate}</span>
                        <span>Impact: <strong style={{ color: '#ef4444' }}>{req.amount}</strong></span>
                      </div>
                      {req.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                          <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                            <Check size={13} /> Approve
                          </button>
                          <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ASSIGN MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════
function AssignModal({ cases, onClose, onAssign }) {
  const [selectedRM, setSelectedRM] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: 440, background: 'rgba(26,32,53,0.97)', backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Assign {cases.length} Case(s) to RM</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div className="form-group">
          <div className="form-label">Select Relationship Manager</div>
          <select className="form-input" value={selectedRM} onChange={(e) => setSelectedRM(e.target.value)}>
            <option value="">Choose RM...</option>
            {RMS.map(rm => <option key={rm} value={rm}>{rm}</option>)}
          </select>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
          Cases: {cases.map(c => c.id).join(', ')}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" disabled={!selectedRM} onClick={() => { onAssign(selectedRM); onClose(); }}>
            <UserPlus size={14} /> Assign
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
import { retentionAPI } from '../../api';

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function RetentionCasesPage() {
  const [cases, setCases] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCases, setSelectedCases] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, journeysRes] = await Promise.all([
          retentionAPI.getDashboardStats(),
          retentionAPI.getJourneys()
        ]);
        
        // Map backend journeys to frontend case schema fallback to mock if empty
        const fetchedCases = journeysRes.data?.data || [];
        if (fetchedCases.length > 0) {
          const mappedCases = fetchedCases.map(j => ({
            id: j.id, 
            customerName: j.user?.name || 'Unknown', 
            accountMasked: '****' + (j.user?.id || '0000').slice(-4), 
            branch: 'Branch API',
            caseType: j.triggerType || 'CHURN_RISK', 
            priority: j.user?.healthScore?.healthLevel === 'CRITICAL' ? 'CRITICAL' : 'HIGH', 
            status: j.stage, 
            assignedRM: null,
            slaDeadline: new Date(new Date(j.createdAt).getTime() + 48 * 3600000), 
            aumAtRisk: j.user?.financialProfile?.currentBalance || 0, 
            caseAge: Math.floor((Date.now() - new Date(j.createdAt).getTime()) / 86400000),
            churnScore: j.user?.healthScore?.healthScore || 0, 
            churnReport: j.user?.churnReports?.[0] || null,
            riskSignals: [],
            aiConfidence: 0.85, 
            similarCases: 100,
            products: [],
            recommendations: {
              primary: { action: 'Review case', confidence: 0.8, conversion: 0.5 },
              secondary: { action: 'Contact customer', confidence: 0.7, conversion: 0.4 },
              fallback: { action: 'Send generic offer', confidence: 0.6, conversion: 0.3 },
            },
            interventionLog: [],
            approvalRequests: [],
            complaints: [],
            sageHistory: [],
          }));
          setCases(mappedCases);
        } else {
          setCases(MOCK_CASES); // Graceful mock fallback
        }

        if (statsRes.data?.data) {
          setApiStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch retention data:', err);
        setCases(MOCK_CASES); // Graceful mock fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterRM, setFilterRM] = useState('');
  const [filterSLA, setFilterSLA] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // SLA timer tick
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter logic
  const filteredCases = useMemo(() => {
    let result = [...cases];

    // Tab filters
    if (activeTab === 'triage') result = result.filter(c => c.status === 'OPEN' && !c.assignedRM);
    if (activeTab === 'my') result = result.filter(c => c.assignedRM === 'Priya Sharma'); // Current user mock
    if (activeTab === 'escalation') result = result.filter(c => c.status === 'ESCALATED');

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.customerName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q)
      );
    }

    // Filters
    if (filterStatus) result = result.filter(c => c.status === filterStatus);
    if (filterPriority) result = result.filter(c => c.priority === filterPriority);
    if (filterType) result = result.filter(c => c.caseType === filterType);
    if (filterBranch) result = result.filter(c => c.branch === filterBranch);
    if (filterRM) result = result.filter(c => c.assignedRM === filterRM);
    if (filterSLA) {
      result = result.filter(c => {
        const s = getSLAStatus(c.slaDeadline);
        return s.status === filterSLA;
      });
    }

    // Sort by SLA urgency (breached first, then warning, then ok)
    if (activeTab === 'my') {
      result.sort((a, b) => {
        const slaA = a.slaDeadline - new Date();
        const slaB = b.slaDeadline - new Date();
        return slaA - slaB;
      });
    }

    return result;
  }, [cases, activeTab, searchQuery, filterStatus, filterPriority, filterType, filterBranch, filterRM, filterSLA]);

  // Stats
  const stats = useMemo(() => {
    const open = cases.filter(c => ['OPEN', 'TRIAGED', 'IN_PROGRESS'].includes(c.status)).length;
    const critical = cases.filter(c => c.priority === 'CRITICAL' && c.status !== 'CLOSED' && c.status !== 'RESOLVED').length;
    const breached = cases.filter(c => getSLAStatus(c.slaDeadline).status === 'BREACHED' && c.status !== 'CLOSED' && c.status !== 'RESOLVED').length;
    const totalAUM = cases.filter(c => c.status !== 'CLOSED' && c.status !== 'RESOLVED').reduce((acc, c) => acc + c.aumAtRisk, 0);
    const triageQueue = cases.filter(c => c.status === 'OPEN' && !c.assignedRM).length;
    const escalated = cases.filter(c => c.status === 'ESCALATED').length;
    return { open, critical, breached, totalAUM, triageQueue, escalated };
  }, [cases]);

  const toggleSelect = (caseId) => {
    setSelectedCases(prev => prev.includes(caseId) ? prev.filter(id => id !== caseId) : [...prev, caseId]);
  };

  const toggleSelectAll = () => {
    if (selectedCases.length === filteredCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map(c => c.id));
    }
  };

  const handleBulkAssign = (rmName) => {
    setCases(prev => prev.map(c =>
      selectedCases.includes(c.id) ? { ...c, assignedRM: rmName, status: c.status === 'OPEN' ? 'TRIAGED' : c.status } : c
    ));
    setSelectedCases([]);
    showToast(`✅ ${selectedCases.length} cases assigned to ${rmName}`);
  };

  const QUEUE_TABS = [
    { key: 'all', label: 'All Cases', icon: Layers, count: cases.length },
    { key: 'triage', label: 'Triage Queue', icon: GitBranch, count: stats.triageQueue },
    { key: 'my', label: 'My Cases', icon: Users, count: cases.filter(c => c.assignedRM === 'Priya Sharma').length },
    { key: 'escalation', label: 'Escalation Queue', icon: ArrowUpRight, count: stats.escalated },
  ];

  const clearFilters = () => {
    setFilterStatus(''); setFilterPriority(''); setFilterType('');
    setFilterBranch(''); setFilterRM(''); setFilterSLA('');
    setSearchQuery('');
  };

  const hasFilters = filterStatus || filterPriority || filterType || filterBranch || filterRM || filterSLA;

  return (
    <div className="fade-in">
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 3000, padding: '12px 20px',
          background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 12, color: '#10b981', fontSize: '0.85rem', fontWeight: 600,
          backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease',
        }}>
          {toast}
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>🛡️ Signal Engine — Lifecycle Management</h2>
          <p>Full case lifecycle: triage, assignment, intervention, resolution & SLA enforcement</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => showToast('🔄 Cases refreshed')}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="btn btn-primary btn-sm">
            <Zap size={14} /> Create Case
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        <div className="stat-card blue">
          <div className="stat-icon blue"><Briefcase size={20} /></div>
          <div className="stat-value">{stats.open}</div>
          <div className="stat-label">Active Cases</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red"><Flame size={20} /></div>
          <div className="stat-value">{stats.critical}</div>
          <div className="stat-label">Critical Priority</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><Timer size={20} /></div>
          <div className="stat-value">{stats.breached}</div>
          <div className="stat-label">SLA Breached</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple"><DollarSign size={20} /></div>
          <div className="stat-value">{formatCurrency(stats.totalAUM)}</div>
          <div className="stat-label">AUM at Risk</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><GitBranch size={20} /></div>
          <div className="stat-value">{stats.triageQueue}</div>
          <div className="stat-label">Awaiting Triage</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red"><ArrowUpRight size={20} /></div>
          <div className="stat-value">{stats.escalated}</div>
          <div className="stat-label">Escalated</div>
        </div>
      </div>

      {/* Queue Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-color)', marginBottom: 20 }}>
        {QUEUE_TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedCases([]); }}
              style={{
                padding: '12px 20px', background: 'none', border: 'none',
                borderBottom: `2px solid ${isActive ? '#3b82f6' : 'transparent'}`,
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s ease',
              }}>
              <Icon size={15} /> {t.label}
              <span style={{
                padding: '2px 8px', borderRadius: 10, fontSize: '0.7rem', fontWeight: 700,
                background: isActive ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)',
                color: isActive ? '#3b82f6' : 'var(--text-muted)',
              }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search by name, case ID, branch..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 36, fontSize: '0.82rem' }} />
          </div>

          <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 130, fontSize: '0.8rem' }}>
            <option value="">All Status</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>

          <select className="form-input" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            style={{ width: 130, fontSize: '0.8rem' }}>
            <option value="">All Priority</option>
            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>

          <select className="form-input" value={filterType} onChange={(e) => setFilterType(e.target.value)}
            style={{ width: 145, fontSize: '0.8rem' }}>
            <option value="">All Types</option>
            {Object.entries(CASE_TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>

          <select className="form-input" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}
            style={{ width: 145, fontSize: '0.8rem' }}>
            <option value="">All Branches</option>
            {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select className="form-input" value={filterRM} onChange={(e) => setFilterRM(e.target.value)}
            style={{ width: 130, fontSize: '0.8rem' }}>
            <option value="">All RMs</option>
            {RMS.map(rm => <option key={rm} value={rm}>{rm}</option>)}
          </select>

          <select className="form-input" value={filterSLA} onChange={(e) => setFilterSLA(e.target.value)}
            style={{ width: 130, fontSize: '0.8rem' }}>
            <option value="">SLA Status</option>
            <option value="BREACHED">Breached</option>
            <option value="WARNING">Warning</option>
            <option value="OK">Within SLA</option>
          </select>

          {hasFilters && (
            <button className="btn btn-sm btn-secondary" onClick={clearFilters} style={{ whiteSpace: 'nowrap' }}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCases.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', marginBottom: 16,
          background: 'rgba(59,130,246,0.08)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)',
        }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3b82f6' }}>
            {selectedCases.length} case(s) selected
          </span>
          <button className="btn btn-sm btn-primary" onClick={() => setShowAssignModal(true)}>
            <UserPlus size={13} /> Assign to RM
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => {
            setCases(prev => prev.map(c =>
              selectedCases.includes(c.id) ? { ...c, status: c.status === 'OPEN' ? 'TRIAGED' : c.status } : c
            ));
            setSelectedCases([]);
            showToast(`✅ ${selectedCases.length} cases acknowledged`);
          }}>
            <Check size={13} /> Acknowledge
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setSelectedCases([])}>
            <X size={13} /> Deselect
          </button>
        </div>
      )}

      {/* Case Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', accentColor: '#3b82f6' }} />
                </th>
                <th>Case ID</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned RM</th>
                <th>SLA Timer</th>
                <th style={{ textAlign: 'right' }}>AUM at Risk</th>
                <th style={{ textAlign: 'center' }}>Age</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    No cases match the current filters
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => {
                  const sla = getSLAStatus(c.slaDeadline);
                  const ct = CASE_TYPE_CONFIG[c.caseType];
                  const pr = PRIORITY_CONFIG[c.priority];
                  const st = STATUS_CONFIG[c.status];
                  return (
                    <tr key={c.id} style={{ cursor: 'pointer' }}
                      onClick={(e) => { if (e.target.type !== 'checkbox') setSelectedCase(c); }}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={selectedCases.includes(c.id)}
                          onChange={() => toggleSelect(c.id)}
                          style={{ cursor: 'pointer', accentColor: '#3b82f6' }} />
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{c.customerName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.accountMasked} · {c.branch}</div>
                      </td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, background: ct.bg, color: ct.color, whiteSpace: 'nowrap' }}>
                          {ct.label}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, background: pr.bg, color: pr.color }}>
                          {c.priority === 'CRITICAL' && <Flame size={10} style={{ marginRight: 3 }} />}
                          {pr.label}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: c.assignedRM ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                        {c.assignedRM || <span style={{ fontStyle: 'italic' }}>Unassigned</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: sla.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: sla.color, whiteSpace: 'nowrap' }}>
                            {sla.label}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        {formatCurrency(c.aumAtRisk)}
                      </td>
                      <td style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                        {c.caseAge}d
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => setSelectedCase(c)}
                            style={{ padding: '4px 8px' }} title="View Details">
                            <Eye size={13} />
                          </button>
                          <button className="btn btn-sm btn-secondary"
                            onClick={() => { setSelectedCases([c.id]); setShowAssignModal(true); }}
                            style={{ padding: '4px 8px' }} title="Assign">
                            <UserPlus size={13} />
                          </button>
                          <button className="btn btn-sm"
                            onClick={() => {
                              setCases(prev => prev.map(cc => cc.id === c.id ? { ...cc, status: 'ESCALATED' } : cc));
                              showToast(`⬆ Case ${c.id} escalated`);
                            }}
                            style={{ padding: '4px 8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                            title="Escalate">
                            <ArrowUpRight size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing {filteredCases.length} of {cases.length} cases
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn btn-sm btn-secondary" disabled>Previous</button>
            <button className="btn btn-sm btn-primary" style={{ minWidth: 32 }}>1</button>
            <button className="btn btn-sm btn-secondary" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedCase && <CaseDetailModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />}
      {showAssignModal && (
        <AssignModal
          cases={cases.filter(c => selectedCases.includes(c.id))}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleBulkAssign}
        />
      )}
    </div>
  );
}
