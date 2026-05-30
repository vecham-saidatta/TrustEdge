import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import AlertsPage from './pages/AlertsPage';
import SagePage from './pages/SagePage';
import TruthPage from './pages/TruthPage';

import ComplaintsPage from './pages/ComplaintsPage';

import AdminComplaintsPage from './pages/AdminComplaintsPage';
import OutreachPage from './pages/OutreachPage';
import CommandCenterPage from './pages/CommandCenterPage';
import AdminGovernancePage from './pages/AdminGovernancePage';
import PlaceholderWrapper from './components/PlaceholderWrapper';

import React, { lazy, Suspense, Component } from 'react';

// Error Boundary to catch and display runtime rendering crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          color: '#ef4444',
          background: '#0a0e1a',
          minHeight: '100vh',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'left'
        }}>
          <div style={{
            maxWidth: '800px',
            width: '100%',
            background: '#111827',
            padding: '32px',
            borderRadius: '12px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: '#f8fafc' }}>
              ⚠️ React Runtime Crash
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
              An error occurred during page rendering. See details below:
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f43f5e', textTransform: 'uppercase', marginBottom: '6px' }}>Error Message</div>
              <pre style={{
                background: '#162032',
                padding: '16px',
                borderRadius: '8px',
                overflow: 'auto',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.05)',
                margin: 0,
                fontFamily: 'monospace',
                fontSize: '0.85rem'
              }}>
                {this.state.error?.stack || this.state.error?.toString()}
              </pre>
            </div>

            {this.state.errorInfo && (
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Component Stack</div>
                <pre style={{
                  background: '#162032',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.05)',
                  margin: 0,
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  maxHeight: '300px'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '24px',
                padding: '10px 20px',
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.88rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2563eb'}
              onMouseLeave={e => e.currentTarget.style.background = '#3b82f6'}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MyWorkspacePage = lazy(() => import('./pages/admin/MyWorkspacePage'));
const AdminCommandCenterPage = lazy(() => import('./pages/admin/AdminCommandCenterPage'));
const RetentionCasesPage = lazy(() => import('./pages/admin/RetentionCasesPage'));
const OutreachManagerPage = lazy(() => import('./pages/admin/OutreachManagerPage'));
const FeedbackLoopPage = lazy(() => import('./pages/admin/FeedbackLoopPage'));
const SageMonitorPage = lazy(() => import('./pages/admin/SageMonitorPage'));
const PredictionsHubPage = lazy(() => import('./pages/admin/PredictionsHubPage'));
const PulseDashboardPage = lazy(() => import('./pages/admin/PulseDashboardPage'));
const Customer360Page = lazy(() => import('./pages/admin/Customer360Page'));
const RMOperationsPage = lazy(() => import('./pages/admin/RMOperationsPage'));
const AlertsCenterPage = lazy(() => import('./pages/admin/AlertsCenterPage'));
const AIGovernancePage = lazy(() => import('./pages/admin/AIGovernancePage'));
const AuditCompliancePage = lazy(() => import('./pages/admin/AuditCompliancePage'));
const SystemHealthPage = lazy(() => import('./pages/admin/SystemHealthPage'));
const RMDashboard = lazy(() => import('./pages/RMDashboard/index'));

// ═══════════════════════════════════════════════════════════════
//  CUSTOMER PORTAL — Lazy-loaded pages per TRUSTEDGE_CUSTOMER_PORTAL_PLAN
// ═══════════════════════════════════════════════════════════════
const CustomerHomePage = lazy(() => import('./pages/portal/CustomerHomePage'));
const SageAssistantPage = lazy(() => import('./pages/portal/SageAssistantPage'));
const MyFinancesPage = lazy(() => import('./pages/portal/MyFinancesPage'));
const OffersPage = lazy(() => import('./pages/portal/OffersPage'));
const NotificationsPage = lazy(() => import('./pages/portal/NotificationsPage'));
const SupportPage = lazy(() => import('./pages/portal/SupportPage'));
const SettingsPage = lazy(() => import('./pages/portal/SettingsPage'));
const StressSupport = lazy(() => import('./pages/portal/StressSupport'));
const TrustTransparencyPage = lazy(() => import('./pages/portal/TrustTransparencyPage'));

// Loading skeleton for lazy-loaded admin pages
function AdminPageSkeleton() {
  return (
    <div className="admin-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-line wide"></div>
        <div className="skeleton-line narrow"></div>
      </div>
      <div className="skeleton-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line wide"></div>
            <div className="skeleton-line medium"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

// Admin route wrapper with Suspense
function AdminRoute({ children }) {
  return (
    <ProtectedRoute roles={['ADMIN']}>
      <Suspense fallback={<AdminPageSkeleton />}>
        {children}
      </Suspense>
    </ProtectedRoute>
  );
}

// Customer Portal route wrapper with Suspense
function PortalRoute({ children }) {
  return (
    <ProtectedRoute roles={['CUSTOMER']}>
      <Suspense fallback={<AdminPageSkeleton />}>
        {children}
      </Suspense>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  // Determine role-based landing page
  const adminHome = '/admin/workspace';
  const customerHome = '/portal/home';

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? adminHome : user.role === 'CUSTOMER' ? customerHome : '/dashboard'} /> : <LoginPage />} />

      {/* Protected with Layout */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rm-dashboard" element={<Suspense fallback={<AdminPageSkeleton />}><RMDashboard /></Suspense>} />
        <Route path="/alerts" element={<AlertsPage />} />

        {/* Legacy Customer Routes (keep for backwards compatibility) */}
        <Route path="/transactions" element={<ProtectedRoute roles={['CUSTOMER']}><TransactionsPage /></ProtectedRoute>} />
        <Route path="/sage" element={<ProtectedRoute roles={['CUSTOMER']}><SagePage /></ProtectedRoute>} />
        <Route path="/truth" element={<ProtectedRoute roles={['CUSTOMER']}><TruthPage /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute roles={['CUSTOMER']}><ComplaintsPage /></ProtectedRoute>} />

        {/* ═════════════════════════════════════════════════════════
            CUSTOMER PORTAL v2.0 — 8-Section Enterprise Routes
            Per TRUSTEDGE_CUSTOMER_PORTAL_PLAN Section 3
           ═════════════════════════════════════════════════════════ */}

        {/* 🏠 Home — Financial snapshot, priority actions, wellbeing pulse */}
        <Route path="/portal/home" element={<PortalRoute><CustomerHomePage /></PortalRoute>} />

        {/* 💬 SAGE Assistant — AI companion with guided flows & feedback */}
        <Route path="/portal/sage" element={<PortalRoute><SageAssistantPage /></PortalRoute>} />

        {/* 💰 My Finances — Accounts, spending insights, transactions, net worth */}
        <Route path="/portal/finances" element={<PortalRoute><MyFinancesPage /></PortalRoute>} />

        {/* 🎁 Offers — Transparent offer marketplace */}
        <Route path="/portal/offers" element={<PortalRoute><OffersPage /></PortalRoute>} />

        {/* 🔔 Notifications — Communication center */}
        <Route path="/portal/notifications" element={<PortalRoute><NotificationsPage /></PortalRoute>} />

        {/* 🛡️ Support — Self-service, tickets, branch booking, RM contact */}
        <Route path="/portal/support" element={<PortalRoute><SupportPage /></PortalRoute>} />

        {/* ⚙️ Settings — Profile, comms, privacy, security, fees */}
        <Route path="/portal/settings" element={<PortalRoute><SettingsPage /></PortalRoute>} />

        {/* 💙 Stress Support — EMI distress & loan restructuring */}
        <Route path="/portal/stress-support" element={<PortalRoute><StressSupport /></PortalRoute>} />

        {/* 📚 Trust & Transparency — Financial literacy hub */}
        <Route path="/portal/trust" element={<PortalRoute><TrustTransparencyPage /></PortalRoute>} />


        {/* ═════════════════════════════════════════════════════════
            ADMIN PORTAL v4.0 — 12-Module Enterprise Routes
            Per TRUSTEDGE_ADMIN_PORTAL_PLAN Section 3.1
           ═════════════════════════════════════════════════════════ */}

        {/* 🏠 My Workspace — Role-adaptive daily action queue */}
        <Route path="/admin/workspace" element={<AdminRoute><MyWorkspacePage /></AdminRoute>} />

        {/* 📊 Command Center — Redesigned situation room dashboard */}
        <Route path="/admin/command-center" element={<AdminRoute><AdminCommandCenterPage /></AdminRoute>} />

        {/* 🎯 Retention Cases — Case-based retention management */}
        <Route path="/admin/retention-cases" element={<AdminRoute><RetentionCasesPage /></AdminRoute>} />

        {/* 📣 Outreach Manager — Campaign lifecycle with approvals */}
        <Route path="/admin/outreach" element={<AdminRoute><OutreachManagerPage /></AdminRoute>} />

        {/* Feedback Intelligence Loop */}
        <Route path="/admin/feedback-loop" element={<AdminRoute><FeedbackLoopPage /></AdminRoute>} />

        {/* SAGE Monitor — AI conversation quality oversight */}
        <Route path="/admin/sage-monitor" element={<AdminRoute><PlaceholderWrapper moduleKey="sage-monitor" moduleName="SAGE Monitor"><SageMonitorPage /></PlaceholderWrapper></AdminRoute>} />

        {/* 🔮 Predictions Hub — Churn scoring, Monte Carlo, risk cohorts */}
        <Route path="/admin/predictions" element={<AdminRoute><PlaceholderWrapper moduleKey="predictions" moduleName="Predictions Hub"><PredictionsHubPage /></PlaceholderWrapper></AdminRoute>} />

        {/* 📈 PULSE Dashboard — Feedback loop operations */}
        <Route path="/admin/pulse" element={<AdminRoute><PlaceholderWrapper moduleKey="pulse" moduleName="PULSE Feedback"><PulseDashboardPage /></PlaceholderWrapper></AdminRoute>} />

        {/* 👥 Customer 360 — Individual customer journey view */}
        <Route path="/admin/customer-360" element={<AdminRoute><Customer360Page /></AdminRoute>} />

        {/* 👔 RM Operations — RM performance & portfolio health */}
        <Route path="/admin/rm-operations" element={<AdminRoute><PlaceholderWrapper moduleKey="rm-operations" moduleName="RM Operations"><RMOperationsPage /></PlaceholderWrapper></AdminRoute>} />

        {/* 🔔 Alerts Center — Consolidated alert triage */}
        <Route path="/admin/alerts-center" element={<AdminRoute><PlaceholderWrapper moduleKey="alerts-center" moduleName="Alerts Center"><AlertsCenterPage /></PlaceholderWrapper></AdminRoute>} />

        {/* ⚙️ AI Governance — Model oversight, explainability, bias */}
        <Route path="/admin/ai-governance" element={<AdminRoute><PlaceholderWrapper moduleKey="ai-governance" moduleName="AI Governance"><AIGovernancePage /></PlaceholderWrapper></AdminRoute>} />

        {/* 📋 Audit & Compliance — Immutable logs, RBI reports */}
        <Route path="/admin/audit-compliance" element={<AdminRoute><PlaceholderWrapper moduleKey="audit-compliance" moduleName="Audit & Compliance"><AuditCompliancePage /></PlaceholderWrapper></AdminRoute>} />

        {/* 🖥️ System Health — Infrastructure monitoring */}
        <Route path="/admin/system-health" element={<AdminRoute><PlaceholderWrapper moduleKey="system-health" moduleName="System Health"><SystemHealthPage /></PlaceholderWrapper></AdminRoute>} />

        {/* Legacy admin routes (redirects) */}
        <Route path="/admin/complaints" element={<ProtectedRoute roles={['ADMIN']}><AdminComplaintsPage /></ProtectedRoute>} />
        <Route path="/admin/governance" element={<ProtectedRoute roles={['ADMIN']}><AdminGovernancePage /></ProtectedRoute>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={user ? (user.role === 'ADMIN' ? adminHome : user.role === 'CUSTOMER' ? customerHome : '/dashboard') : '/login'} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
