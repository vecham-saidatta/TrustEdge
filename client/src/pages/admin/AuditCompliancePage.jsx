import { useState, useMemo } from 'react';
import {
  Shield, FileText, Clock, Search, Filter, Download, Eye, Lock, Unlock,
  CheckCircle, XCircle, AlertTriangle, Users, Key, Activity, Globe,
  Database, RefreshCw, ChevronLeft, ChevronRight, Hash, Calendar,
  BarChart3, TrendingUp, ArrowRight, Settings, LogIn, LogOut, UserCheck,
  ShieldCheck, AlertCircle, Fingerprint, MapPin, Layers, X, Printer
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// ═══════════════════════════════════════════
// MOCK DATA — AUDIT LOG (20+ entries)
// ═══════════════════════════════════════════

const auditEntries = [
  { id: 'AUD-0001', timestamp: '2026-05-27 00:58:42', who: { name: 'Priya Mehta', role: 'RM', branch: 'Andheri West' }, action: 'VIEW_CUSTOMER_PROFILE', entity: 'Customer: Rajesh Sharma (CIF-20045)', before: null, after: null, reason: 'Routine review before scheduled call', endpoint: '/api/customers/CIF-20045', ip: '10.24.56.12', hash: 'a3f2c8d1e9b7' },
  { id: 'AUD-0002', timestamp: '2026-05-27 00:45:18', who: { name: 'Anil Kumar', role: 'AVP Risk', branch: 'HO Mumbai' }, action: 'OVERRIDE_RISK_SCORE', entity: 'Customer: Kavitha Reddy (CIF-27891)', before: 'Risk Score: 71', after: 'Risk Score: 38', reason: 'Property purchase — balance drop not voluntary churn signal', endpoint: '/api/governance/override', ip: '10.24.56.1', hash: 'b8e4f2a1c3d5' },
  { id: 'AUD-0003', timestamp: '2026-05-27 00:32:05', who: { name: 'System (PULSE)', role: 'AI Engine', branch: 'Auto' }, action: 'GENERATE_RECOMMENDATION', entity: 'Campaign: PULSE-AUTO-FD-RENEWAL', before: null, after: 'Variant A/B created, 245 recipients', reason: 'Automated RL policy — FD maturity cohort', endpoint: '/api/pulse/recommend', ip: '127.0.0.1', hash: 'c1d3e5f7a9b2' },
  { id: 'AUD-0004', timestamp: '2026-05-26 23:58:33', who: { name: 'Ravi Gupta', role: 'RM', branch: 'Bandra East' }, action: 'SEND_OUTREACH', entity: 'Customer: Sunita Devi (CIF-18923)', before: 'No outreach', after: 'WhatsApp message sent — Template: rate_renegotiation_v2', reason: 'High risk customer — proactive retention', endpoint: '/api/outreach/send', ip: '10.24.57.8', hash: 'd2e4f6a8b0c1' },
  { id: 'AUD-0005', timestamp: '2026-05-26 23:42:19', who: { name: 'Meera Joshi', role: 'VP Retail', branch: 'HO Mumbai' }, action: 'APPROVE_INCENTIVE', entity: 'Incentive: APR-004 — ₹75,000 Cash', before: 'Status: PENDING', after: 'Status: APPROVED', reason: 'High-value customer retention — 15yr vintage', endpoint: '/api/incentives/approve', ip: '10.24.56.2', hash: 'e3f5a7b9c1d2' },
  { id: 'AUD-0006', timestamp: '2026-05-26 23:15:42', who: { name: 'Neha Singh', role: 'RM', branch: 'Powai' }, action: 'VIEW_SCORE_EXPLANATION', entity: 'Customer: Amit Patel (CIF-31056)', before: null, after: 'Viewed 12 SHAP features', reason: 'Score challenged — reviewing factors', endpoint: '/api/explain/shap', ip: '10.24.58.3', hash: 'f4a6b8c0d2e3' },
  { id: 'AUD-0007', timestamp: '2026-05-26 22:48:11', who: { name: 'Admin (System)', role: 'System', branch: 'Auto' }, action: 'BATCH_RISK_RECALC', entity: 'All customers (48,523)', before: 'Previous scores', after: 'Recalculated: 234 risk level changes', reason: 'Scheduled daily batch recalculation', endpoint: '/api/risk/recalculate-all', ip: '127.0.0.1', hash: 'a5b7c9d1e3f4' },
  { id: 'AUD-0008', timestamp: '2026-05-26 22:10:05', who: { name: 'Sanjay Deshmukh', role: 'BM', branch: 'Thane' }, action: 'CHALLENGE_SCORE', entity: 'Customer: Mohammed Irfan (CIF-15432)', before: 'Risk Score: 45', after: 'Challenge Filed — CH-005', reason: 'Customer complained twice — score should be higher', endpoint: '/api/governance/challenge', ip: '10.24.59.4', hash: 'b6c8d0e2f4a5' },
  { id: 'AUD-0009', timestamp: '2026-05-26 21:45:33', who: { name: 'Vikram Rao', role: 'AVP Risk', branch: 'HO Mumbai' }, action: 'APPROVE_CAMPAIGN', entity: 'Campaign: Savings-Festival-May26', before: 'Status: DRAFT', after: 'Status: APPROVED for 12,450 recipients', reason: 'Campaign targeting verified — no vulnerable segments', endpoint: '/api/campaigns/approve', ip: '10.24.56.5', hash: 'c7d9e1f3a5b6' },
  { id: 'AUD-0010', timestamp: '2026-05-26 21:20:19', who: { name: 'Deepa Nair', role: 'RM', branch: 'Dadar' }, action: 'UPDATE_CUSTOMER_NOTE', entity: 'Customer: Lakshmi Iyer (CIF-22871)', before: 'Note: Last visit Apr 12', after: 'Note: Customer traveling abroad May-Jul, will return for FD renewal', reason: 'Branch visit feedback update', endpoint: '/api/customers/notes', ip: '10.24.60.6', hash: 'd8e0f2a4b6c7' },
  { id: 'AUD-0011', timestamp: '2026-05-26 20:55:48', who: { name: 'Rahul Verma', role: 'RM', branch: 'Borivali' }, action: 'GENERATE_DNA_REPORT', entity: 'Customer: Arjun Kapoor (CIF-34210)', before: null, after: 'Report generated: 91% churn probability', reason: 'Quarterly portfolio review', endpoint: '/api/signal/generate-report', ip: '10.24.61.7', hash: 'e9f1a3b5c7d8' },
  { id: 'AUD-0012', timestamp: '2026-05-26 20:12:35', who: { name: 'System (CDC)', role: 'Pipeline', branch: 'Auto' }, action: 'DATA_INGESTION', entity: 'Debezium CDC — CBS Transactions', before: 'Offset: 4,523,891', after: 'Offset: 4,524,156 (+265 events)', reason: 'Continuous data capture', endpoint: '/internal/cdc/ingest', ip: '127.0.0.1', hash: 'f0a2b4c6d8e9' },
  { id: 'AUD-0013', timestamp: '2026-05-26 19:45:22', who: { name: 'Pooja Sharma', role: 'RM', branch: 'Churchgate' }, action: 'INITIATE_RETENTION_JOURNEY', entity: 'Customer: Geeta Bhandari (CIF-28745)', before: 'No active journey', after: 'Journey: SALARY_SHIFT_RECOVERY initiated', reason: 'Customer confirmed salary shift to HDFC', endpoint: '/api/retention/journey/create', ip: '10.24.62.8', hash: 'a1b3c5d7e9f0' },
  { id: 'AUD-0014', timestamp: '2026-05-26 19:20:11', who: { name: 'Suresh Jain', role: 'RM', branch: 'Malad' }, action: 'MARK_FALSE_POSITIVE', entity: 'Customer: Fatima Begum (CIF-19087)', before: 'Risk Level: CRITICAL', after: 'Marked as False Positive', reason: 'Customer was traveling — transactions resumed normal', endpoint: '/api/governance/false-positive', ip: '10.24.63.9', hash: 'b2c4d6e8f0a1' },
  { id: 'AUD-0015', timestamp: '2026-05-26 18:55:48', who: { name: 'Anjali Das', role: 'BM', branch: 'Kolkata Main' }, action: 'ROLE_CHANGE_REQUEST', entity: 'User: Suresh Jain', before: 'Role: RM', after: 'Requested: Senior RM', reason: 'Promotion effective June 1', endpoint: '/api/admin/roles', ip: '10.24.64.10', hash: 'c3d5e7f9a1b2' },
  { id: 'AUD-0016', timestamp: '2026-05-26 18:30:25', who: { name: 'System (SAGE)', role: 'LLM API', branch: 'Auto' }, action: 'TRANSLATE_RESPONSE', entity: 'Conversation: SAGE-45821', before: 'Language: English', after: 'Translated to: Hindi', reason: 'Customer language preference', endpoint: '/api/sage/translate', ip: '127.0.0.1', hash: 'd4e6f8a0b2c3' },
  { id: 'AUD-0017', timestamp: '2026-05-26 18:05:12', who: { name: 'Vikram Rao', role: 'AVP Risk', branch: 'HO Mumbai' }, action: 'MODEL_RETRAIN_APPROVE', entity: 'TGN Model v3.2.1', before: 'Model v3.2.0 (AUC: 0.935)', after: 'Model v3.2.1 (AUC: 0.947) — Approved for production', reason: 'Quarterly model refresh — dual approval completed', endpoint: '/api/model/deploy', ip: '10.24.56.5', hash: 'e5f7a9b1c3d4' },
  { id: 'AUD-0018', timestamp: '2026-05-26 17:40:55', who: { name: 'Security (WAF)', role: 'System', branch: 'Auto' }, action: 'BLOCK_SUSPICIOUS_IP', entity: 'IP: 203.45.67.89', before: 'Access: Allowed', after: 'Access: Blocked (24hr)', reason: 'Brute force login attempt detected — 15 failures in 2min', endpoint: '/security/waf/block', ip: '203.45.67.89', hash: 'f6a8b0c2d4e5' },
  { id: 'AUD-0019', timestamp: '2026-05-26 17:15:33', who: { name: 'Priya Mehta', role: 'RM', branch: 'Andheri West' }, action: 'EXPORT_CUSTOMER_DATA', entity: 'Portfolio: 45 customers', before: null, after: 'CSV exported — 45 records, PII masked', reason: 'Monthly portfolio review preparation', endpoint: '/api/export/customers', ip: '10.24.56.12', hash: 'a7b9c1d3e5f6' },
  { id: 'AUD-0020', timestamp: '2026-05-26 16:50:18', who: { name: 'System (Scheduler)', role: 'Cron', branch: 'Auto' }, action: 'COMPLIANCE_REPORT_GEN', entity: 'Report: Customer Data Access Log (May)', before: null, after: 'Generated — 1,234 access events logged', reason: 'Monthly automated compliance report', endpoint: '/api/reports/generate', ip: '127.0.0.1', hash: 'b8c0d2e4f6a7' },
  { id: 'AUD-0021', timestamp: '2026-05-26 16:25:42', who: { name: 'Meera Joshi', role: 'VP Retail', branch: 'HO Mumbai' }, action: 'REJECT_INCENTIVE', entity: 'Incentive: APR-008 — ₹95,000 Cash', before: 'Status: PENDING', after: 'Status: REJECTED', reason: 'Budget exceeded for branch — defer to next month', endpoint: '/api/incentives/reject', ip: '10.24.56.2', hash: 'c9d1e3f5a7b8' },
  { id: 'AUD-0022', timestamp: '2026-05-26 15:55:09', who: { name: 'Admin (Root)', role: 'Super Admin', branch: 'HO Mumbai' }, action: 'WORM_ARCHIVE_VERIFY', entity: 'Audit Logs: May 1-25, 2026', before: 'Verification: Pending', after: 'Verification: PASSED (15,892 entries, 0 tampering)', reason: 'Monthly WORM storage integrity check', endpoint: '/api/audit/verify-worm', ip: '10.24.56.1', hash: 'd0e2f4a6b8c9' },
];

const ACTION_COLORS = {
  VIEW_CUSTOMER_PROFILE: '#3b82f6',
  OVERRIDE_RISK_SCORE: '#8b5cf6',
  GENERATE_RECOMMENDATION: '#06b6d4',
  SEND_OUTREACH: '#10b981',
  APPROVE_INCENTIVE: '#10b981',
  VIEW_SCORE_EXPLANATION: '#3b82f6',
  BATCH_RISK_RECALC: '#f59e0b',
  CHALLENGE_SCORE: '#8b5cf6',
  APPROVE_CAMPAIGN: '#10b981',
  UPDATE_CUSTOMER_NOTE: '#3b82f6',
  GENERATE_DNA_REPORT: '#06b6d4',
  DATA_INGESTION: '#64748b',
  INITIATE_RETENTION_JOURNEY: '#f59e0b',
  MARK_FALSE_POSITIVE: '#ef4444',
  ROLE_CHANGE_REQUEST: '#8b5cf6',
  TRANSLATE_RESPONSE: '#06b6d4',
  MODEL_RETRAIN_APPROVE: '#10b981',
  BLOCK_SUSPICIOUS_IP: '#ef4444',
  EXPORT_CUSTOMER_DATA: '#f59e0b',
  COMPLIANCE_REPORT_GEN: '#64748b',
  REJECT_INCENTIVE: '#ef4444',
  WORM_ARCHIVE_VERIFY: '#10b981',
};

// Compliance Reports
const complianceReports = [
  { name: 'Customer Data Access Log', frequency: 'Monthly', lastGenerated: '2026-05-01', status: 'GENERATED', format: 'PDF', size: '2.4 MB', dueDate: '2026-06-01' },
  { name: 'AI Decision Impact Report', frequency: 'Quarterly', lastGenerated: '2026-04-01', status: 'GENERATED', format: 'PDF', size: '8.1 MB', dueDate: '2026-07-01' },
  { name: 'Incentive Disbursement Audit', frequency: 'Monthly', lastGenerated: '2026-05-01', status: 'GENERATED', format: 'PDF', size: '3.7 MB', dueDate: '2026-06-01' },
  { name: 'Campaign Targeting Report', frequency: 'Per Campaign', lastGenerated: '2026-05-24', status: 'GENERATED', format: 'PDF', size: '1.2 MB', dueDate: 'On demand' },
  { name: 'Complaint Resolution Report', frequency: 'Monthly', lastGenerated: '2026-05-01', status: 'GENERATED', format: 'PDF', size: '4.5 MB', dueDate: '2026-06-01' },
  { name: 'Model Governance Report', frequency: 'Quarterly', lastGenerated: '2026-04-01', status: 'DUE SOON', format: 'PDF', size: '—', dueDate: '2026-07-01' },
  { name: 'Data Breach / Anomaly Report', frequency: 'As-needed', lastGenerated: '2026-03-15', status: 'NO INCIDENTS', format: 'PDF', size: '—', dueDate: 'On trigger' },
];

// RBAC Audit Trail
const rbacEvents = [
  { timestamp: '2026-05-27 00:55:12', type: 'LOGIN_SUCCESS', user: 'Priya Mehta', role: 'RM', ip: '10.24.56.12', details: 'MFA: OTP verified', location: 'Mumbai', device: 'Chrome/Windows' },
  { timestamp: '2026-05-27 00:42:08', type: 'LOGIN_FAILURE', user: 'Unknown', role: '—', ip: '203.45.67.89', details: 'Invalid credentials — attempt 12/15', location: 'Unknown (VPN)', device: 'curl/7.68' },
  { timestamp: '2026-05-26 23:58:45', type: 'ROLE_ASSIGNMENT', user: 'Admin (Root)', role: 'Super Admin', ip: '10.24.56.1', details: 'Assigned "Senior RM" role to Suresh Jain', location: 'HO Mumbai', device: 'Firefox/Linux' },
  { timestamp: '2026-05-26 23:30:22', type: 'PERMISSION_ESCALATION', user: 'Meera Joshi', role: 'VP Retail', ip: '10.24.56.2', details: 'Temporary "Model Deploy" permission granted (4hr TTL)', location: 'HO Mumbai', device: 'Chrome/macOS' },
  { timestamp: '2026-05-26 22:45:11', type: 'LOGIN_SUCCESS', user: 'Anil Kumar', role: 'AVP Risk', ip: '10.24.56.1', details: 'MFA: Authenticator App', location: 'HO Mumbai', device: 'Edge/Windows' },
  { timestamp: '2026-05-26 22:10:33', type: 'MFA_BYPASS', user: 'Ravi Gupta', role: 'RM', ip: '10.24.57.8', details: 'MFA bypassed — trusted device (registered laptop)', location: 'Bandra East', device: 'Chrome/Windows' },
  { timestamp: '2026-05-26 21:55:18', type: 'SESSION_ANOMALY', user: 'Deepa Nair', role: 'RM', ip: '182.73.45.89', details: 'Unusual IP — not on trusted network. Session flagged.', location: 'Pune (non-branch)', device: 'Safari/iOS' },
  { timestamp: '2026-05-26 21:30:05', type: 'BULK_EXPORT', user: 'Priya Mehta', role: 'RM', ip: '10.24.56.12', details: 'Exported 45 customer records — PII masked', location: 'Andheri West', device: 'Chrome/Windows' },
  { timestamp: '2026-05-26 20:48:42', type: 'LOGIN_SUCCESS', user: 'Sanjay Deshmukh', role: 'BM', ip: '10.24.59.4', details: 'MFA: OTP verified', location: 'Thane', device: 'Chrome/Android' },
  { timestamp: '2026-05-26 20:15:33', type: 'ROLE_CHANGE', user: 'Admin (Root)', role: 'Super Admin', ip: '10.24.56.1', details: 'Changed Pooja Sharma: RM → Senior RM (effective Jun 1)', location: 'HO Mumbai', device: 'Firefox/Linux' },
  { timestamp: '2026-05-26 19:42:19', type: 'LOGIN_FAILURE', user: 'Unknown', role: '—', ip: '203.45.67.89', details: 'Invalid credentials — attempt 15/15. IP BLOCKED.', location: 'Unknown (VPN)', device: 'curl/7.68' },
  { timestamp: '2026-05-26 19:05:55', type: 'LOGIN_SUCCESS', user: 'Neha Singh', role: 'RM', ip: '10.24.58.3', details: 'MFA: Biometric (fingerprint)', location: 'Powai', device: 'Chrome/macOS' },
  { timestamp: '2026-05-26 18:30:41', type: 'SESSION_ANOMALY', user: 'Rahul Verma', role: 'RM', ip: '10.24.61.7', details: 'Unusual time — login at 6:30 AM (typically 9-6 PM)', location: 'Borivali', device: 'Chrome/Windows' },
  { timestamp: '2026-05-26 17:55:22', type: 'PERMISSION_REVOKE', user: 'Admin (Root)', role: 'Super Admin', ip: '10.24.56.1', details: 'Revoked "Model Deploy" from Meera Joshi (TTL expired)', location: 'HO Mumbai', device: 'System' },
];

const RBAC_TYPE_STYLES = {
  LOGIN_SUCCESS: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: LogIn },
  LOGIN_FAILURE: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: XCircle },
  ROLE_ASSIGNMENT: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', icon: UserCheck },
  ROLE_CHANGE: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', icon: Users },
  PERMISSION_ESCALATION: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: Unlock },
  PERMISSION_REVOKE: { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b', icon: Lock },
  MFA_BYPASS: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: Fingerprint },
  SESSION_ANOMALY: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: AlertTriangle },
  BULK_EXPORT: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: Download },
};

const rbacSummaryData = [
  { type: 'Login Success', count: 1247, color: '#10b981' },
  { type: 'Login Failure', count: 38, color: '#ef4444' },
  { type: 'Role Changes', count: 12, color: '#8b5cf6' },
  { type: 'MFA Bypasses', count: 3, color: '#f59e0b' },
  { type: 'Session Anomalies', count: 7, color: '#ef4444' },
  { type: 'Bulk Exports', count: 15, color: '#06b6d4' },
];

const rbacTrend = [
  { day: 'Mon', logins: 245, failures: 8, anomalies: 1 },
  { day: 'Tue', logins: 267, failures: 5, anomalies: 2 },
  { day: 'Wed', logins: 234, failures: 12, anomalies: 0 },
  { day: 'Thu', logins: 256, failures: 6, anomalies: 1 },
  { day: 'Fri', logins: 278, failures: 4, anomalies: 3 },
  { day: 'Sat', logins: 89, failures: 2, anomalies: 0 },
  { day: 'Sun', logins: 45, failures: 1, anomalies: 0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div style={{ background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '10px 14px', fontSize: '0.78rem' }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: p.color }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span>{p.name}: {p.value}</span>
        </div>
      ))}
    </div>
  );
};

const TABS = [
  { key: 'audit', label: 'Audit Log', icon: FileText },
  { key: 'compliance', label: 'Compliance Reports', icon: Shield },
  { key: 'rbac', label: 'RBAC Audit Trail', icon: Key },
];

const ITEMS_PER_PAGE = 8;

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export default function AuditCompliancePage() {
  const [activeTab, setActiveTab] = useState('audit');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [actorFilter, setActorFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(null);
  const [rbacTypeFilter, setRbacTypeFilter] = useState('ALL');

  // Filter audit entries
  const filteredAudit = useMemo(() => {
    return auditEntries.filter(e => {
      const matchSearch = !searchQuery ||
        e.who.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.action.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAction = actionFilter === 'ALL' || e.action === actionFilter;
      const matchActor = actorFilter === 'ALL' || e.who.name.includes(actorFilter);
      return matchSearch && matchAction && matchActor;
    });
  }, [searchQuery, actionFilter, actorFilter]);

  const totalPages = Math.ceil(filteredAudit.length / ITEMS_PER_PAGE);
  const paginatedAudit = filteredAudit.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const filteredRbac = useMemo(() => {
    return rbacEvents.filter(e => {
      return rbacTypeFilter === 'ALL' || e.type === rbacTypeFilter;
    });
  }, [rbacTypeFilter]);

  const handleGenerateReport = (reportName) => {
    setGeneratingReport(reportName);
    setTimeout(() => setGeneratingReport(null), 2500);
  };

  const uniqueActions = [...new Set(auditEntries.map(e => e.action))];
  const uniqueActors = [...new Set(auditEntries.map(e => e.who.name))];

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={28} color="var(--accent-blue)" /> Audit, Compliance & Reporting
          </h2>
          <p>Immutable audit trails, RBI-aligned compliance reports, and access control monitoring</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm">
            <Hash size={14} /> Verify Integrity
          </button>
          <button className="btn btn-primary btn-sm">
            <RefreshCw size={14} /> Sync
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-color)', marginBottom: 24, overflowX: 'auto' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setCurrentPage(1); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'none', border: 'none',
                borderBottom: `2px solid ${isActive ? 'var(--accent-blue)' : 'transparent'}`,
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)', fontFamily: 'inherit',
                fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              }}>
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 1: AUDIT LOG */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <div className="fade-in">
          {/* Summary Stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'Total Entries (Today)', value: '1,247', color: 'blue', icon: FileText },
              { label: 'Unique Actors', value: '24', color: 'green', icon: Users },
              { label: 'High-Risk Actions', value: '18', color: 'red', icon: AlertTriangle },
              { label: 'Integrity Verified', value: '100%', color: 'green', icon: CheckCircle },
              { label: 'WORM Archive', value: '15,892', color: 'purple', icon: Database },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}><Icon size={20} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" placeholder="Search by actor, entity, ID, action..."
                value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ paddingLeft: 36 }} />
            </div>
            <select className="form-input" style={{ width: 200 }} value={actionFilter}
              onChange={e => { setActionFilter(e.target.value); setCurrentPage(1); }}>
              <option value="ALL">All Actions</option>
              {uniqueActions.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
            </select>
            <select className="form-input" style={{ width: 180 }} value={actorFilter}
              onChange={e => { setActorFilter(e.target.value); setCurrentPage(1); }}>
              <option value="ALL">All Actors</option>
              {uniqueActors.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-sm btn-secondary"><Download size={14} /> PDF</button>
              <button className="btn btn-sm btn-secondary"><Download size={14} /> CSV</button>
              <button className="btn btn-sm btn-secondary"><Download size={14} /> JSON</button>
            </div>
          </div>

          {/* Audit Table */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-title"><FileText size={18} /> Immutable Audit Log</div>
              <span className="badge badge-blue">{filteredAudit.length} entries</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>🔗</th>
                    <th>Timestamp</th>
                    <th>Who</th>
                    <th>What</th>
                    <th>Before / After</th>
                    <th>Why</th>
                    <th>How</th>
                    <th>SHA-256</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAudit.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACTION_COLORS[e.action] || '#64748b' }} />
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {e.timestamp}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{e.who.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {e.who.role} · {e.who.branch}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ background: `${ACTION_COLORS[e.action]}20`, color: ACTION_COLORS[e.action], fontSize: '0.68rem', marginBottom: 4, display: 'inline-block' }}>
                          {e.action.replace(/_/g, ' ')}
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 200 }}>{e.entity}</div>
                      </td>
                      <td style={{ fontSize: '0.75rem', maxWidth: 200 }}>
                        {e.before && (
                          <div style={{ color: '#ef4444', marginBottom: 2 }}>
                            <span style={{ opacity: 0.6 }}>−</span> {e.before}
                          </div>
                        )}
                        {e.after && (
                          <div style={{ color: '#10b981' }}>
                            <span style={{ opacity: 0.6 }}>+</span> {e.after}
                          </div>
                        )}
                        {!e.before && !e.after && <span style={{ color: 'var(--text-muted)' }}>Read-only</span>}
                      </td>
                      <td style={{ fontSize: '0.75rem', maxWidth: 180, color: 'var(--text-secondary)' }}>{e.reason}</td>
                      <td>
                        <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{e.endpoint}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>IP: {e.ip}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle size={12} color="#10b981" />
                          <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#10b981' }}>{e.hash}</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                          onClick={() => setSelectedEntry(e)}>
                          <Eye size={10} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={14} /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={p === currentPage ? 'active' : ''} onClick={() => setCurrentPage(p)}>
                  {p}
                </button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 2: COMPLIANCE REPORTS */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'compliance' && (
        <div className="fade-in">
          {/* Stats */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
            {[
              { label: 'Reports Available', value: '7', color: 'blue', icon: FileText },
              { label: 'Generated This Month', value: '5', color: 'green', icon: CheckCircle },
              { label: 'Due Soon', value: '1', color: 'yellow', icon: Clock },
              { label: 'Compliance Score', value: '98.2%', color: 'green', icon: ShieldCheck },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}><Icon size={20} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Reports Grid */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Shield size={18} /> RBI-Aligned Compliance Reports</div>
              <button className="btn btn-sm btn-primary">
                <RefreshCw size={12} /> Generate All Due
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
              {complianceReports.map((r, i) => {
                const isGenerating = generatingReport === r.name;
                const statusColor = r.status === 'GENERATED' ? '#10b981' : r.status === 'DUE SOON' ? '#f59e0b' : '#3b82f6';
                return (
                  <div key={i} style={{
                    background: 'var(--bg-secondary)', borderRadius: 12, padding: 20,
                    border: '1px solid var(--border-color)', transition: 'var(--transition-slow)',
                    borderLeft: `4px solid ${statusColor}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: 4 }}>{r.name}</div>
                        <span className="badge" style={{ background: `${statusColor}20`, color: statusColor }}>{r.status}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 6 }}>
                        {r.frequency}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14, fontSize: '0.78rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>LAST GENERATED</div>
                        <div style={{ fontWeight: 600 }}>{r.lastGenerated}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>NEXT DUE</div>
                        <div style={{ fontWeight: 600, color: r.status === 'DUE SOON' ? '#f59e0b' : 'var(--text-primary)' }}>{r.dueDate}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>FORMAT</div>
                        <div style={{ fontWeight: 600 }}>{r.format}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>SIZE</div>
                        <div style={{ fontWeight: 600 }}>{r.size}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-sm btn-primary" style={{ flex: 1 }}
                        disabled={isGenerating}
                        onClick={() => handleGenerateReport(r.name)}>
                        {isGenerating ? (
                          <><div className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> Generating...</>
                        ) : (
                          <><RefreshCw size={12} /> Generate</>
                        )}
                      </button>
                      {r.status === 'GENERATED' && (
                        <>
                          <button className="btn btn-sm btn-secondary"><Download size={12} /> PDF</button>
                          <button className="btn btn-sm btn-secondary"><Printer size={12} /></button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 3: RBAC AUDIT TRAIL */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'rbac' && (
        <div className="fade-in">
          {/* Summary Cards */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 24 }}>
            {rbacSummaryData.map((s, i) => (
              <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
                <div className="stat-value" style={{ color: s.color }}>{s.count}</div>
                <div className="stat-label">{s.type}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
            {/* Login Trend Chart */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><BarChart3 size={18} /> Weekly Login Activity</div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={rbacTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.78rem' }} />
                  <Bar dataKey="logins" fill="#10b981" name="Successful" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failures" fill="#ef4444" name="Failures" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="anomalies" fill="#f59e0b" name="Anomalies" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Event Distribution Pie */}
            <div className="card">
              <div className="card-header">
                <div className="card-title"><Activity size={18} /> Event Distribution</div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={rbacSummaryData} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                    paddingAngle={3} label={({ type, count }) => `${count}`}>
                    {rbacSummaryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <select className="form-input" style={{ width: 220 }} value={rbacTypeFilter} onChange={e => setRbacTypeFilter(e.target.value)}>
              <option value="ALL">All Event Types</option>
              {[...new Set(rbacEvents.map(e => e.type))].map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* RBAC Events Table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Key size={18} /> RBAC & Access Audit Trail</div>
              <span className="badge badge-blue">{filteredRbac.length} events</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Details</th>
                    <th>Location</th>
                    <th>IP / Device</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRbac.map((e, i) => {
                    const style = RBAC_TYPE_STYLES[e.type] || { bg: 'rgba(100,116,139,0.15)', color: '#64748b', icon: Activity };
                    const TypeIcon = style.icon;
                    return (
                      <tr key={i}>
                        <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {e.timestamp}
                        </td>
                        <td>
                          <span className="badge" style={{ background: style.bg, color: style.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <TypeIcon size={10} /> {e.type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: e.user === 'Unknown' ? '#ef4444' : 'var(--text-primary)' }}>{e.user}</td>
                        <td style={{ fontSize: '0.82rem' }}>{e.role}</td>
                        <td style={{ fontSize: '0.78rem', maxWidth: 280, color: 'var(--text-secondary)' }}>{e.details}</td>
                        <td>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem' }}>
                            <MapPin size={10} color="var(--text-muted)" /> {e.location}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{e.ip}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{e.device}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MFA Bypass Alert */}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={18} color="#ef4444" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444' }}>MFA Bypass Events: 3 this month</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Target: near-zero. All 3 bypasses were trusted device registrations. No unauthorized bypasses detected.
                </div>
              </div>
              <button className="btn btn-sm btn-secondary" style={{ marginLeft: 'auto' }}>Review All</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* AUDIT ENTRY DETAIL MODAL */}
      {/* ═══════════════════════════════════════════ */}
      {selectedEntry && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setSelectedEntry(null)} />
          <div style={{ position: 'relative', width: 650, maxHeight: '85vh', overflowY: 'auto', background: 'rgba(26, 32, 53, 0.95)', backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={20} color="var(--accent-blue)" /> Audit Entry — {selectedEntry.id}
              </h3>
              <button onClick={() => setSelectedEntry(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>TIMESTAMP</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>{selectedEntry.timestamp}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>ACTOR</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedEntry.who.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedEntry.who.role} · {selectedEntry.who.branch}</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>ACTION</div>
              <span className="badge" style={{ background: `${ACTION_COLORS[selectedEntry.action]}20`, color: ACTION_COLORS[selectedEntry.action], fontSize: '0.82rem', padding: '4px 12px' }}>
                {selectedEntry.action.replace(/_/g, ' ')}
              </span>
              <div style={{ marginTop: 8, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{selectedEntry.entity}</div>
            </div>

            {(selectedEntry.before || selectedEntry.after) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: 10, padding: 14, border: '1px solid rgba(239,68,68,0.15)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#ef4444', marginBottom: 4 }}>BEFORE STATE</div>
                  <div style={{ fontSize: '0.85rem' }}>{selectedEntry.before || 'N/A'}</div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 10, padding: 14, border: '1px solid rgba(16,185,129,0.15)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', marginBottom: 4 }}>AFTER STATE</div>
                  <div style={{ fontSize: '0.85rem' }}>{selectedEntry.after || 'N/A'}</div>
                </div>
              </div>
            )}

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>REASON</div>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>{selectedEntry.reason}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>ENDPOINT</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{selectedEntry.endpoint}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>IP ADDRESS</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{selectedEntry.ip}</div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 10, padding: 14, border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ fontSize: '0.7rem', color: '#10b981', marginBottom: 4 }}>SHA-256 HASH</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={12} /> {selectedEntry.hash}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
