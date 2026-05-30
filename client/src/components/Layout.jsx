import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import ProfilePanel from './ProfilePanel';
import '../customer-portal.css';
import {
    LayoutDashboard, CreditCard, AlertTriangle, MessageSquare,
    Scale, Shield, Users, BarChart3, LogOut, Heart, FileText, MessageCircle, Megaphone,
    Zap, Brain, Target, Activity, UserCheck, Bell, Settings, Monitor,
    ClipboardList, Eye, TrendingUp, FolderOpen, Gavel, Search, ChevronRight,
    Radio, Bot, GitBranch, Database, PieChart, Briefcase, Clock,
    ShieldCheck, FileBarChart, Cpu, Network, BookOpen,
    Home, Wallet, Package, Gift, LifeBuoy, ArrowLeft, Globe, Sparkles, BrainCircuit
} from 'lucide-react';

const TRANSLATIONS = {
    EN: {
        home: 'Home',
        sage: 'SAGE Assistant',
        finances: 'My Finances',
        offers: 'Offers For Me',
        notifications: 'Notifications',
        support: 'Support',
        settings: 'My Settings',
        logout: 'Logout',
        goodMorning: 'Good Morning',
        goodAfternoon: 'Good Afternoon',
        goodEvening: 'Good Evening',
        newUpdates: 'new updates',
        back: 'Back',
        adminPortal: 'Admin Portal',
        companion: 'Your Financial Companion'
    },
    HI: {
        home: 'मुख्य पृष्ठ',
        sage: 'सेज सहायक',
        finances: 'मेरी वित्तीय स्थिति',
        offers: 'मेरे लिए ऑफ़र',
        notifications: 'सूचनाएं',
        support: 'सहायता',
        settings: 'मेरी सेटिंग्स',
        logout: 'लॉगआऊट',
        goodMorning: 'शुभ प्रभात',
        goodAfternoon: 'शुभ दोपहर',
        goodEvening: 'शुभ संध्या',
        newUpdates: 'नई अपडेट्स',
        back: 'पीछे',
        adminPortal: 'एडमिन पोर्टल',
        companion: 'आपका वित्तीय साथी'
    }
};

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notificationCount] = useState(7);
    const [currentTime, setCurrentTime] = useState(new Date());

    // ── Customer Portal State ──
    const [customerLang, setCustomerLang] = useState(() => {
        try { return sessionStorage.getItem('te_lang') || 'EN'; } catch { return 'EN'; }
    });
    const t = TRANSLATIONS[customerLang] || TRANSLATIONS.EN;
    const [customerNotifCount, setCustomerNotifCount] = useState(0);
    const customerWellbeing = 'green'; // green | yellow | red — from API

    useEffect(() => {
        if (user?.role === 'CUSTOMER') {
            import('../api').then(({ portalAPI }) => {
                portalAPI.getNotifCount().then(res => {
                    setCustomerNotifCount(res.data?.data?.count || 0);
                }).catch(() => {});
            });
        }
    }, [user?.role]);

    // Persist language selection in session
    useEffect(() => {
        try { sessionStorage.setItem('te_lang', customerLang); } catch {}
    }, [customerLang]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

    // Greeting based on time of day
    const getGreeting = () => {
        const h = currentTime.getHours();
        if (h < 12) return t.goodMorning;
        if (h < 17) return t.goodAfternoon;
        return t.goodEvening;
    };

    // Generate breadcrumb from path
    const getBreadcrumb = () => {
        const parts = location.pathname.split('/').filter(Boolean);
        const labels = {
            'admin': 'Admin',
            'portal': 'Portal',
            'dashboard': 'Dashboard',
            'workspace': 'My Workspace',
            'command-center': 'Command Center',
            'retention-cases': 'Signal Engine',
            'outreach': 'Outreach Engine',
            'sage-monitor': 'SAGE Monitor',
            'predictions': 'Predictions Hub',
            'customer-360': 'Customer 360',
            'rm-operations': 'RM Operations',
            'alerts-center': 'Alerts Center',
            'ai-governance': 'AI Governance',
            'audit-compliance': 'Audit & Compliance',
            'system-health': 'System Health',
            'transactions': 'Transactions',
            'alerts': 'Alerts',
            'sage': t.sage,
            'truth': 'TRUTH Compare',
            'complaints': 'Complaints',
            'shield': 'SHIELD',
            'governance': 'Platform Governance',
            // Customer Portal routes
            'home': t.home,
            'finances': t.finances,
            'offers': t.offers,
            'notifications': t.notifications,
            'support': t.support,
            'settings': t.settings,
        };
        return parts.map(p => labels[p] || p.charAt(0).toUpperCase() + p.slice(1));
    };

    return (
        <div className="app-layout">
            <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className={`sidebar-logo ${user?.role === 'CUSTOMER' ? 'sidebar-logo-customer' : ''}`}>
                    <img src="/logo.png" alt="TrustEdge" style={{ width: 40, height: 40, borderRadius: 10 }} />
                    {!sidebarCollapsed && (
                        <div>
                            <h1>TrustEdge</h1>
                            <span className={user?.role === 'CUSTOMER' ? 'sidebar-subtitle' : ''}>
                                {user?.role === 'CUSTOMER' ? t.companion : 'Admin Portal'}
                            </span>
                        </div>
                    )}
                </div>

                <nav className={`sidebar-nav ${user?.role === 'CUSTOMER' ? 'customer-sidebar-nav' : ''}`}>
                    {/* ═══════════════════════════════════════════════════
                        CUSTOMER NAVIGATION — 8-Section Portal
                        Per TRUSTEDGE_CUSTOMER_PORTAL_PLAN Section 3
                       ═══════════════════════════════════════════════════ */}
                    {user?.role === 'CUSTOMER' && (
                        <div className="customer-nav-section">
                            <NavLink to="/portal/home" className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon"><Home size={18} /></span>
                                <span className="nav-label">{t.home}</span>
                            </NavLink>
                            <NavLink to="/portal/sage" className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon"><MessageSquare size={18} /></span>
                                <span className="nav-label">{t.sage}</span>
                            </NavLink>

                            <div className="customer-nav-divider" />

                            <NavLink to="/portal/finances" className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon"><Wallet size={18} /></span>
                                <span className="nav-label">{t.finances}</span>
                            </NavLink>
                            <NavLink to="/portal/offers" className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon"><Gift size={18} /></span>
                                <span className="nav-label">{t.offers}</span>
                            </NavLink>

                            <div className="customer-nav-divider" />

                            <NavLink to="/portal/notifications" className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon"><Bell size={18} /></span>
                                <span className="nav-label">{t.notifications}</span>
                                {customerNotifCount > 0 && (
                                    <span className="nav-count">{customerNotifCount}</span>
                                )}
                            </NavLink>
                            <NavLink to="/portal/support" className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon"><LifeBuoy size={18} /></span>
                                <span className="nav-label">{t.support}</span>
                            </NavLink>
                            <NavLink to="/portal/settings" className={({ isActive }) => `customer-nav-link ${isActive ? 'active' : ''}`}>
                                <span className="nav-icon"><Settings size={18} /></span>
                                <span className="nav-label">{t.settings}</span>
                            </NavLink>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════
                        ADMIN NAVIGATION — 12-Module Enterprise Portal
                        Organized by operational intent per Section 3.1
                       ═══════════════════════════════════════════════════ */}
                    {user?.role === 'ADMIN' && (
                        <>
                            {/* Primary Operations */}
                            <div className="nav-section">
                                <div className="nav-section-title">Operations</div>
                                <NavLink to="/admin/workspace" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Briefcase size={18} />
                                    <span>My Workspace</span>
                                    <span className="nav-badge pulse-badge">5</span>
                                </NavLink>
                                <NavLink to="/admin/command-center" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Monitor size={18} />
                                    <span>Command Center</span>
                                </NavLink>
                                <NavLink to="/admin/retention-cases" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <ClipboardList size={18} />
                                    <span>Signal Engine</span>
                                    <span className="nav-badge critical-badge">8</span>
                                </NavLink>
                                <NavLink to="/admin/outreach" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Megaphone size={18} />
                                    <span>Outreach Engine</span>
                                </NavLink>
                                <NavLink to="/admin/feedback-loop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <BrainCircuit size={18} />
                                    <span>Feedback Loop</span>
                                    <span className="nav-badge highlight-badge">AI</span>
                                </NavLink>
                                <NavLink to="/rm-dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Target size={18} />
                                    <span>RM Dashboard</span>
                                </NavLink>
                            </div>


                            {/* Intelligence & AI */}
                            <div className="nav-section">
                                <div className="nav-section-title">Intelligence</div>
                                <NavLink to="/admin/sage-monitor" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Bot size={18} />
                                    <span>SAGE Monitor</span>
                                </NavLink>
                                <NavLink to="/admin/predictions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <TrendingUp size={18} />
                                    <span>Predictions Hub</span>
                                </NavLink>
                                <NavLink to="/admin/pulse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Activity size={18} />
                                    <span>PULSE Feedback</span>
                                </NavLink>
                            </div>

                            {/* People & Customers */}
                            <div className="nav-section">
                                <div className="nav-section-title">People</div>
                                <NavLink to="/admin/customer-360" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Users size={18} />
                                    <span>Customer 360</span>
                                </NavLink>
                                <NavLink to="/admin/rm-operations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <UserCheck size={18} />
                                    <span>RM Operations</span>
                                </NavLink>
                            </div>

                            {/* Governance & Compliance */}
                            <div className="nav-section">
                                <div className="nav-section-title">Governance</div>
                                <NavLink to="/admin/alerts-center" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Bell size={18} />
                                    <span>Alerts Center</span>
                                    <span className="nav-badge warning-badge">3</span>
                                </NavLink>
                                <NavLink to="/admin/ai-governance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <ShieldCheck size={18} />
                                    <span>AI Governance</span>
                                </NavLink>
                                <NavLink to="/admin/audit-compliance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <FileBarChart size={18} />
                                    <span>Audit & Compliance</span>
                                </NavLink>
                                <NavLink to="/admin/system-health" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    <Cpu size={18} />
                                    <span>System Health</span>
                                </NavLink>
                            </div>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    {/* Session Info — Admin only */}
                    {user?.role === 'ADMIN' && (
                        <div className="session-info">
                            <Clock size={12} />
                            <span>{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="session-dot"></span>
                            <span>Active</span>
                        </div>
                    )}

                    {/* Customer Notification Bell */}
                    {user?.role === 'CUSTOMER' && (
                        <div className="customer-notification-bar" onClick={() => navigate('/portal/notifications')}>
                            <div className="customer-notification-bell">
                                <Bell size={18} />
                                {customerNotifCount > 0 && (
                                    <span className="bell-count">{customerNotifCount}</span>
                                )}
                            </div>
                            <span className="customer-notification-text">
                                <strong>{customerNotifCount}</strong> {t.newUpdates}
                            </span>
                        </div>
                    )}

                    <div className="user-badge" onClick={() => setShowProfile(true)} style={{ cursor: 'pointer', borderRadius: 10, transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {/* Wellbeing indicator for customers */}
                        {user?.role === 'CUSTOMER' ? (
                            <div className="wellbeing-indicator-wrapper">
                                <div className="user-avatar" style={{ boxShadow: '0 0 0 2px rgba(59,130,246,0.4)' }}>{initials}</div>
                                <span className={`wellbeing-dot ${customerWellbeing}`} title={`Financial Wellbeing: ${customerWellbeing}`} />
                            </div>
                        ) : (
                            <div className="user-avatar" style={{ boxShadow: '0 0 0 2px rgba(59,130,246,0.4)' }}>{initials}</div>
                        )}
                        <div className="user-info">
                            <h4>{user?.name}</h4>
                            <span style={{ color: 'var(--accent-blue)', fontSize: '0.7rem' }}>
                                {user?.role === 'ADMIN' ? 'National Admin' : user?.role === 'CUSTOMER' ? 'Customer' : user?.role} →
                            </span>
                        </div>
                    </div>
                    <button className="nav-link" onClick={handleLogout} style={{ width: '100%', marginTop: 8, border: 'none', background: 'none' }}>
                        <LogOut size={18} /> {t.logout}
                    </button>
                </div>
            </aside>

            <main className="main-content fade-in">
                {/* Top Bar for Admin */}
                {user?.role === 'ADMIN' && (
                    <div className="admin-topbar">
                        <div className="breadcrumb-trail">
                            {getBreadcrumb().map((crumb, i, arr) => (
                                <span key={i} className="breadcrumb-item">
                                    {i > 0 && <ChevronRight size={14} className="breadcrumb-sep" />}
                                    <span className={i === arr.length - 1 ? 'breadcrumb-current' : 'breadcrumb-parent'}>
                                        {crumb}
                                    </span>
                                </span>
                            ))}
                        </div>
                        <div className="topbar-actions">
                            <div className="topbar-search">
                                <Search size={16} />
                                <input type="text" placeholder="Search customers, cases, campaigns..." />
                            </div>
                            <button className="topbar-notification" onClick={() => navigate('/admin/alerts-center')}>
                                <Bell size={20} />
                                {notificationCount > 0 && (
                                    <span className="notification-dot">{notificationCount}</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Customer Top Bar ─────────────────────── */}
                {user?.role === 'CUSTOMER' && (
                    <div className="customer-topbar">
                        <div className="customer-topbar-left">
                            {location.pathname !== '/portal/home' && (
                                <button className="customer-back-btn" onClick={() => navigate(-1)}>
                                    <ArrowLeft size={16} /> {t.back}
                                </button>
                            )}
                            <div className="customer-topbar-greeting">
                                <span className="greeting-text">{getGreeting()}</span>
                                <span className="greeting-name">{user?.name?.split(' ')[0] || 'Customer'}</span>
                            </div>
                        </div>
                        <div className="customer-topbar-right">
                            <div className="lang-toggle-bar">
                                {[{ code: 'EN', label: 'EN' }, { code: 'HI', label: 'हिंदी' }].map(lang => (
                                    <button
                                        key={lang.code}
                                        className={`lang-toggle-btn ${customerLang === lang.code ? 'active' : ''}`}
                                        onClick={() => setCustomerLang(lang.code)}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                            <div className="breadcrumb-trail">
                                {getBreadcrumb().map((crumb, i, arr) => (
                                    <span key={i} className="breadcrumb-item">
                                        {i > 0 && <ChevronRight size={14} className="breadcrumb-sep" />}
                                        <span className={i === arr.length - 1 ? 'breadcrumb-current' : 'breadcrumb-parent'}>
                                            {crumb}
                                        </span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <Outlet context={{ customerLang }} />
            </main>

            {/* ── Persistent Floating SAGE Button (Customer only) ── */}
            {user?.role === 'CUSTOMER' && location.pathname !== '/portal/sage' && (
                <button
                    className="sage-floating-btn"
                    onClick={() => navigate('/portal/sage')}
                    aria-label="Open SAGE Assistant"
                >
                    <Sparkles size={24} />
                    <span className="sage-float-pulse" />
                    <span className="sage-floating-label">Ask SAGE</span>
                </button>
            )}

            {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}
        </div>
    );
}
