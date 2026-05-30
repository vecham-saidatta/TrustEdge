import { useState, useMemo, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PORTAL_TRANSLATIONS } from '../../translations';
import {
  Bell, CheckCheck, Search, CreditCard, Clock, AlertTriangle, Gift, MessageSquare,
  Shield, Megaphone, TrendingUp, IndianRupee, X, ChevronRight, Mail, Smartphone,
  MessageCircle, Monitor, Eye, EyeOff, Wallet, PiggyBank, AlertCircle,
  BellOff, Filter, ArrowDownCircle, ArrowUpCircle, Landmark, CalendarClock,
  BadgeCheck, Zap, BellRing, RefreshCw
} from 'lucide-react';
import './customer-portal.css';

/* ── Utility ─────────────────────────────────────────────── */
function formatINR(n) {
  const abs = Math.abs(n);
  const s = abs.toString();
  let formatted;
  if (s.length <= 3) { formatted = s; }
  else {
    const last3 = s.slice(-3);
    const remaining = s.slice(0, -3);
    const groups = [];
    for (let i = remaining.length; i > 0; i -= 2) {
      groups.unshift(remaining.slice(Math.max(0, i - 2), i));
    }
    formatted = groups.join(',') + ',' + last3;
  }
  return (n < 0 ? '-' : '') + '₹' + formatted;
}

/* ── Channel Config ──────────────────────────────────────── */
const CHANNEL_MAP = {
  SMS: { icon: Smartphone, color: '#10b981' },
  WhatsApp: { icon: MessageCircle, color: '#25d366' },
  Email: { icon: Mail, color: '#3b82f6' },
  'In-App': { icon: Monitor, color: '#8b5cf6' },
};

/* ── Filter Types ────────────────────────────────────────── */
const FILTER_TYPES = [
  { id: 'All', label: 'All', icon: Bell },
  { id: 'Transactions', label: 'Transactions', icon: IndianRupee },
  { id: 'EMI', label: 'EMI', icon: CalendarClock },
  { id: 'Offers', label: 'Offers', icon: Gift },
  { id: 'Security', label: 'Security', icon: Shield },
  { id: 'SAGE', label: 'SAGE', icon: MessageSquare },
  { id: 'Announcements', label: 'Announcements', icon: Megaphone },
];

/* ── Mock Notifications ──────────────────────────────────── */
const INITIAL_NOTIFICATIONS = [
  // TODAY
  {
    id: 'n01', type: 'Transactions', group: 'Today',
    title: 'Salary Credited — ₹85,000',
    message: '₹85,000.00 credited to A/c ****8801 from TCS Ltd via NEFT. Updated balance: ₹3,42,580.',
    time: '2 hours ago', timestamp: Date.now() - 2 * 3600000,
    channel: 'SMS', read: false,
    icon: ArrowDownCircle, color: '#10b981',
    action: { label: 'View Account', route: '/portal/accounts' },
  },
  {
    id: 'n02', type: 'Transactions', group: 'Today',
    title: 'Large Debit Alert — ₹24,500',
    message: 'UPI payment of ₹24,500 to Croma Electronics (Ref: UPI/426189745). This is higher than your usual spend in this category.',
    time: '4 hours ago', timestamp: Date.now() - 4 * 3600000,
    channel: 'SMS', read: false,
    icon: AlertTriangle, color: '#f59e0b',
    action: { label: 'View Transaction', route: '/portal/transactions' },
  },
  {
    id: 'n03', type: 'EMI', group: 'Today',
    title: 'Home Loan EMI Reminder',
    message: 'Your Home Loan EMI of ₹16,200 is due on June 5, 2026. Current savings balance (₹3,42,580) is sufficient. No action needed.',
    time: '6 hours ago', timestamp: Date.now() - 6 * 3600000,
    channel: 'In-App', read: false,
    icon: CalendarClock, color: '#3b82f6',
    action: { label: 'View Loan Details', route: '/portal/loans' },
  },
  {
    id: 'n04', type: 'Security', group: 'Today',
    title: 'New Device Login Detected',
    message: 'Login from Chrome / Windows 11 in Mumbai at 11:24 AM IST (IP: 103.21.xx.xx). If this wasn\'t you, secure your account immediately.',
    time: '8 hours ago', timestamp: Date.now() - 8 * 3600000,
    channel: 'SMS', read: false,
    icon: Shield, color: '#ef4444',
    action: { label: 'Review Login Activity', route: '/portal/security' },
  },

  // YESTERDAY
  {
    id: 'n05', type: 'Offers', group: 'Yesterday',
    title: 'Special FD Rate — 7.25% p.a.',
    message: 'You have a special FD rate offer — 0.45% higher than standard. Your FD of ₹3,50,000 matures in 19 days. View and compare rates now.',
    time: '1 day ago', timestamp: Date.now() - 24 * 3600000,
    channel: 'WhatsApp', read: true,
    icon: Gift, color: '#f59e0b',
    action: { label: 'View Offer', route: '/portal/offers' },
  },
  {
    id: 'n06', type: 'SAGE', group: 'Yesterday',
    title: 'SAGE Spending Insight',
    message: 'You spent ₹4,200 more on groceries this month vs your 3-month average (₹8,800 vs ₹4,600). Want me to help set up a monthly grocery budget?',
    time: '1 day ago', timestamp: Date.now() - 28 * 3600000,
    channel: 'In-App', read: true,
    icon: Zap, color: '#8b5cf6',
    action: { label: 'Open SAGE', route: '/portal/sage' },
  },
  {
    id: 'n07', type: 'EMI', group: 'Yesterday',
    title: 'Personal Loan EMI Successful',
    message: 'EMI of ₹5,400 for Personal Loan (Loan ID: PL-89214) debited successfully from A/c ****8801. Next EMI: July 5, 2026.',
    time: '1 day ago', timestamp: Date.now() - 30 * 3600000,
    channel: 'Email', read: true,
    icon: BadgeCheck, color: '#10b981',
    action: { label: 'View EMI Schedule', route: '/portal/loans' },
  },

  // THIS WEEK
  {
    id: 'n08', type: 'Transactions', group: 'This Week',
    title: 'SIP Executed — HDFC Nifty 50',
    message: '₹5,000 debited for HDFC Nifty 50 Index Fund SIP. Units allotted: 12.34 at NAV ₹405.20. Total units held: 248.56.',
    time: '3 days ago', timestamp: Date.now() - 3 * 24 * 3600000,
    channel: 'Email', read: true,
    icon: TrendingUp, color: '#14b8a6',
    action: { label: 'View SIP Portfolio', route: '/portal/investments' },
  },
  {
    id: 'n09', type: 'Transactions', group: 'This Week',
    title: 'FD Maturity Reminder — 19 Days',
    message: 'Your Fixed Deposit of ₹3,50,000 (FD-2024-78912) matures on June 18, 2026. Maturity amount: ₹3,73,625. Decide: renew, withdraw, or reinvest.',
    time: '3 days ago', timestamp: Date.now() - 3 * 24 * 3600000,
    channel: 'In-App', read: true,
    icon: PiggyBank, color: '#f59e0b',
    action: { label: 'Manage FD', route: '/portal/deposits' },
  },
  {
    id: 'n10', type: 'Security', group: 'This Week',
    title: 'Password Changed Successfully',
    message: 'Your TrustEdge portal password was changed successfully on May 27, 2026 at 3:45 PM from your registered device.',
    time: '3 days ago', timestamp: Date.now() - 3 * 24 * 3600000,
    channel: 'SMS', read: true,
    icon: Shield, color: '#10b981',
    action: null,
  },
  {
    id: 'n11', type: 'SAGE', group: 'This Week',
    title: 'Tax Saving Reminder from SAGE',
    message: 'You\'ve used only ₹50,000 of ₹1,50,000 Section 80C limit. Consider ELSS SIP of ₹12,500/mo to save up to ₹31,200 in tax this year.',
    time: '4 days ago', timestamp: Date.now() - 4 * 24 * 3600000,
    channel: 'In-App', read: true,
    icon: Zap, color: '#8b5cf6',
    action: { label: 'Ask SAGE About Tax', route: '/portal/sage' },
  },
  {
    id: 'n12', type: 'Transactions', group: 'This Week',
    title: 'UPI Transfer — ₹12,000 to Rajesh Kumar',
    message: 'UPI transfer of ₹12,000 to rajesh.kumar@okicici (Ref: UPI/428715632). Note: This is 2x your average UPI transfer amount.',
    time: '5 days ago', timestamp: Date.now() - 5 * 24 * 3600000,
    channel: 'SMS', read: true,
    icon: ArrowUpCircle, color: '#ef4444',
    action: { label: 'View Transaction', route: '/portal/transactions' },
  },

  // EARLIER
  {
    id: 'n13', type: 'EMI', group: 'Earlier',
    title: 'EMI Balance Warning — Personal Loan',
    message: 'Your savings balance may not cover the Personal Loan EMI of ₹5,400 due on June 10. Please ensure sufficient balance or transfer funds.',
    time: '6 days ago', timestamp: Date.now() - 6 * 24 * 3600000,
    channel: 'WhatsApp', read: true,
    icon: AlertCircle, color: '#ef4444',
    action: { label: 'Transfer Funds', route: '/portal/transfers' },
  },
  {
    id: 'n14', type: 'Announcements', group: 'Earlier',
    title: 'RBI Repo Rate Unchanged at 6.50%',
    message: 'The RBI MPC has kept the repo rate unchanged at 6.50%. Your floating-rate Home Loan EMI (₹16,200) remains the same. No action needed.',
    time: '8 days ago', timestamp: Date.now() - 8 * 24 * 3600000,
    channel: 'In-App', read: true,
    icon: Landmark, color: '#6366f1',
    action: null,
  },
  {
    id: 'n15', type: 'Announcements', group: 'Earlier',
    title: 'Scheduled Maintenance — June 1',
    message: 'TrustEdge online banking will be under maintenance on June 1, 2026 from 1:00 AM to 5:00 AM IST. UPI and ATM services will remain available.',
    time: '10 days ago', timestamp: Date.now() - 10 * 24 * 3600000,
    channel: 'Email', read: true,
    icon: Megaphone, color: '#64748b',
    action: null,
  },
  {
    id: 'n16', type: 'Transactions', group: 'Earlier',
    title: 'Balance Alert — Below ₹50,000',
    message: 'Your savings account ****8801 balance dropped below ₹50,000 (current: ₹47,820). This is your configured alert threshold.',
    time: '12 days ago', timestamp: Date.now() - 12 * 24 * 3600000,
    channel: 'SMS', read: true,
    icon: Wallet, color: '#f97316',
    action: { label: 'View Account', route: '/portal/accounts' },
  },
];

const DATE_GROUPS = ['Today', 'Yesterday', 'This Week', 'Earlier'];

/* ══════════════════════════════════════════════════════════ */
export default function NotificationsPage() {
  const { customerLang } = useOutletContext();
  const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

  const filterTypeKeyMap = {
    'All': 'filterAll',
    'Transactions': 'filterTxn',
    'EMI': 'filterEmi',
    'Offers': 'filterOffers',
    'Security': 'filterSecurity',
    'SAGE': 'filterSage',
    'Announcements': 'filterAnnouncements',
  };

  const groupKeyMap = {
    'Today': 'todayGroup',
    'Yesterday': 'yesterdayGroup',
    'This Week': 'thisWeekGroup',
    'Earlier': 'earlierGroup'
  };

  const actionLabelKeyMap = {
    'View Account': 'viewAccountLabel',
    'View Transaction': 'viewTransactionLabel',
    'View Loan Details': 'viewLoanDetailsLabel',
    'Review Login Activity': 'reviewLoginActivityLabel',
    'View Offer': 'viewOfferLabel',
    'Open SAGE': 'openSageLabel',
    'View EMI Schedule': 'viewEmiScheduleLabel',
    'View SIP Portfolio': 'viewSipPortfolioLabel',
    'Manage FD': 'manageFdLabel',
    'Ask SAGE About Tax': 'askSageAboutTaxLabel',
    'Transfer Funds': 'transferFundsLabel',
  };

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filterType, setFilterType] = useState('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    import('../../api').then(({ portalAPI }) => {
        portalAPI.getNotifications().then(res => {
            if (res.data?.data?.notifications) {
                const apiNotifs = res.data.data.notifications.map(n => ({
                    id: n.id,
                    type: n.category === 'SECURITY' ? 'Security' : 
                          n.category === 'OFFER' ? 'Offers' : 
                          n.category === 'TRANSACTION' ? 'Transactions' : 
                          n.category === 'SAGE' ? 'SAGE' : 'Announcements',
                    group: 'This Week',
                    title: n.title,
                    message: n.message,
                    time: new Date(n.createdAt).toLocaleDateString(),
                    timestamp: new Date(n.createdAt).getTime(),
                    channel: 'In-App',
                    read: n.isRead,
                    icon: n.category === 'SECURITY' ? Shield : Bell,
                    color: n.category === 'SECURITY' ? '#ef4444' : '#3b82f6',
                    action: n.actionUrl ? { label: 'View', route: n.actionUrl } : null,
                }));
                if (apiNotifs.length > 0) setNotifications(apiNotifs);
            }
        }).catch(err => console.error('Failed to fetch notifications:', err));
    }).catch(() => {});
  }, []);

  /* ── Derived ─────────────────────────────────────────── */
  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (filterType !== 'All' && n.type !== filterType) return false;
      if (showUnreadOnly && n.read) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      }
      return true;
    });
  }, [notifications, filterType, showUnreadOnly, searchQuery]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const groupedFiltered = useMemo(() => {
    const groups = {};
    DATE_GROUPS.forEach(g => { groups[g] = []; });
    filtered.forEach(n => {
      if (groups[n.group]) groups[n.group].push(n);
    });
    return groups;
  }, [filtered]);

  const filterCounts = useMemo(() => {
    const counts = { All: notifications.length };
    FILTER_TYPES.forEach(ft => {
      if (ft.id !== 'All') {
        counts[ft.id] = notifications.filter(n => n.type === ft.id).length;
      }
    });
    return counts;
  }, [notifications]);

  /* ── Handlers ────────────────────────────────────────── */
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  /* ── Notification Card ──────────────────────────────── */
  function NotificationCard({ notif, index }) {
    const NIcon = notif.icon;
    const channelConf = CHANNEL_MAP[notif.channel] || CHANNEL_MAP['In-App'];
    const CIcon = channelConf.icon;

    return (
      <div
        className={`cp-notif-card ${!notif.read ? 'cp-notif-card--unread' : ''}`}
        style={{ animationDelay: `${index * 0.04}s` }}
        onClick={() => toggleRead(notif.id)}
      >
        {/* Unread indicator */}
        {!notif.read && <div className="cp-notif-unread-dot" />}

        {/* Icon */}
        <div className="cp-notif-icon" style={{ background: `${notif.color}18`, color: notif.color }}>
          <NIcon size={20} />
        </div>

        {/* Content */}
        <div className="cp-notif-body">
          <div className="cp-notif-title-row">
            <span className={`cp-notif-title ${!notif.read ? 'unread' : ''}`}>{notif.title}</span>
          </div>

          <p className="cp-notif-message">{notif.message}</p>

          <div className="cp-notif-footer">
            <span className="cp-notif-time">
              <Clock size={11} />
              {notif.time}
            </span>

            {notif.action && (
              <button className="cp-notif-action-btn" onClick={e => e.stopPropagation()}>
                {t[actionLabelKeyMap[notif.action.label]] || notif.action.label}
                <ChevronRight size={13} />
              </button>
            )}

            <button
              className="cp-notif-read-btn"
              onClick={(e) => { e.stopPropagation(); toggleRead(notif.id); }}
              title={notif.read ? t.markAsUnreadTooltip : t.markAsReadTooltip}
            >
              {notif.read ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {/* Dismiss */}
        <button
          className="cp-notif-dismiss"
          onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
          title={t.dismissTooltip}
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  /* ── Render ──────────────────────────────────────────── */
  return (
    <div className="cp-page">
      {/* Header */}
      <div className="cp-section">
        <div className="cp-notif-page-header">
          <div className="cp-notif-page-header-left">
            <div className="cp-notif-header-icon">
              <BellRing size={22} />
              {unreadCount > 0 && (
                <span className="cp-notif-header-badge">{unreadCount}</span>
              )}
            </div>
            <div>
              <h2 className="cp-notif-page-title">{t.notificationsTitle}</h2>
              <p className="cp-notif-page-subtitle">{t.notificationsSubtitle}</p>
            </div>
          </div>
          <div className="cp-notif-page-header-actions">
            {unreadCount > 0 && (
              <button className="cp-btn cp-btn-secondary cp-btn-sm" onClick={markAllRead}>
                <CheckCheck size={14} />
                {t.markAllRead} ({unreadCount})
              </button>
            )}
            <button
              className={`cp-btn ${showUnreadOnly ? 'cp-btn-primary' : 'cp-btn-secondary'} cp-btn-sm`}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              {showUnreadOnly ? <Eye size={14} /> : <BellOff size={14} />}
              {showUnreadOnly ? t.showAllLabel : t.unreadOnlyLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="cp-section">
        <div className="cp-notif-search-wrapper">
          <Search size={16} className="cp-notif-search-icon" />
          <input
            type="text"
            className="cp-notif-search-input"
            placeholder={t.searchNotifPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="cp-notif-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="cp-section">
        <div className="cp-notif-filters">
          {FILTER_TYPES.map(ft => {
            const FIcon = ft.icon;
            const count = filterCounts[ft.id] || 0;
            const isActive = filterType === ft.id;
            return (
              <button
                key={ft.id}
                className={`cp-notif-filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => setFilterType(ft.id)}
              >
                <FIcon size={14} />
                <span>{t[filterTypeKeyMap[ft.id]] || ft.label}</span>
                <span className={`cp-notif-filter-count ${isActive ? 'active' : ''}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification list grouped by date */}
      <div className="cp-section">
        {filtered.length === 0 ? (
          <div className="cp-notif-empty">
            <Bell size={48} />
            <h3>{t.noNotifFound}</h3>
            <p>
              {showUnreadOnly ? t.emptyUnreadDesc : searchQuery ? `${t.emptyNoResultsDesc} "${searchQuery}"` : t.emptyCategoryDesc}
            </p>
          </div>
        ) : (
          <div className="cp-notif-grouped-list">
            {DATE_GROUPS.map(group => {
              const items = groupedFiltered[group];
              if (!items || items.length === 0) return null;
              return (
                <div key={group} className="cp-notif-group">
                  <div className="cp-notif-group-label">
                    <span>{t[groupKeyMap[group]] || group}</span>
                    <span className="cp-notif-group-count">{items.length}</span>
                  </div>
                  <div className="cp-notif-group-items">
                    {items.map((notif, i) => (
                      <NotificationCard key={notif.id} notif={notif} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer summary */}
      {filtered.length > 0 && (
        <div className="cp-section">
          <div className="cp-notif-footer-summary">
            <span>
              {customerLang === 'HI' 
                ? `कुल ${notifications.length} सूचनाओं में से ${filtered.length} दिखाई जा रही हैं` 
                : `Showing ${filtered.length} of ${notifications.length} notifications`}
            </span>
            {(filterType !== 'All' || showUnreadOnly || searchQuery) && (
              <button
                className="cp-btn cp-btn-ghost cp-btn-sm"
                onClick={() => { setFilterType('All'); setShowUnreadOnly(false); setSearchQuery(''); }}
              >
                <RefreshCw size={13} /> {t.clearFiltersLabel}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
