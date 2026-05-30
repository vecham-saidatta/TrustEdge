import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Wallet, CreditCard, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Search, Filter, Download, ChevronDown, ChevronUp, AlertTriangle, DollarSign,
  PieChart, BarChart3, Home, Zap, ShoppingCart, Car, Heart, GraduationCap,
  Tv, Utensils, Package, ArrowRightLeft, RefreshCw, MessageSquare, Info,
  Shield, Edit3, Bell, CheckCircle2, X, Briefcase, Umbrella, FileText
} from 'lucide-react';
import './customer-portal.css';
import { PORTAL_TRANSLATIONS } from '../../translations';

/* ═══════════════════════════════════════════════════════
   Indian currency formatter
   ═══════════════════════════════════════════════════════ */
function formatINR(n) {
  if (n === undefined || n === null) return '₹0';
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

/* ═══════════════════════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════════════════════ */
const ACCOUNTS = [
  {
    id: 'a1', type: 'Savings', number: '****4231', balance: 284320, trend: 'up', change: 4200,
    label: '↑ ₹4,200 this month',
    sparkline: [245, 252, 248, 260, 255, 268, 272, 275, 278, 276, 280, 284],
    alerts: ['UPI autopay of ₹649 due tomorrow', 'Average daily balance maintained above ₹25,000'],
  },
  {
    id: 'a2', type: 'Salary', number: '****8801', balance: 112450, trend: 'up', change: 85000,
    label: '↑ Salary credited May 27',
    sparkline: [30, 85, 72, 60, 45, 32, 90, 78, 65, 48, 95, 112],
    alerts: ['Salary credited ₹85,000 on May 27', 'EMI debit of ₹16,200 scheduled Jun 5'],
  },
  {
    id: 'a3', type: 'Current', number: '****2200', balance: 67900, trend: 'down', change: -12400,
    label: '↓ ₹12,400 business expenses',
    sparkline: [88, 92, 85, 78, 95, 82, 74, 88, 80, 72, 70, 68],
    alerts: ['Balance below ₹1,00,000 threshold'],
  },
];

const CATEGORIES = {
  Salary:        { icon: DollarSign,    color: '#10b981' },
  Housing:       { icon: Home,          color: '#3b82f6' },
  Groceries:     { icon: ShoppingCart,  color: '#f59e0b' },
  Utilities:     { icon: Zap,           color: '#06b6d4' },
  Transport:     { icon: Car,           color: '#8b5cf6' },
  Healthcare:    { icon: Heart,         color: '#ef4444' },
  Education:     { icon: GraduationCap, color: '#ec4899' },
  Entertainment: { icon: Tv,            color: '#f97316' },
  Investment:    { icon: TrendingUp,    color: '#14b8a6' },
  Insurance:     { icon: Umbrella,      color: '#6366f1' },
  EMI:           { icon: RefreshCw,     color: '#dc2626' },
  Transfer:      { icon: ArrowRightLeft,color: '#6366f1' },
  Other:         { icon: Package,       color: '#64748b' },
};

const TRANSACTIONS = [
  { id: 't1',  date: '2026-05-27', merchant: 'Salary Credit — TCS Ltd',     amount: 85000,  type: 'credit', category: 'Salary',        account: '****8801' },
  { id: 't2',  date: '2026-05-26', merchant: 'DMart Groceries',             amount: -3420,  type: 'debit',  category: 'Groceries',      account: '****4231', anomaly: '40% higher than usual grocery spending' },
  { id: 't3',  date: '2026-05-25', merchant: 'MSEDCL Electricity',          amount: -2180,  type: 'debit',  category: 'Utilities',      account: '****4231', recurring: true },
  { id: 't4',  date: '2026-05-25', merchant: 'SBI Home Loan EMI',           amount: -16200, type: 'debit',  category: 'EMI',            account: '****8801', recurring: true },
  { id: 't5',  date: '2026-05-24', merchant: 'UPI — Rajesh Kumar',          amount: -12000, type: 'debit',  category: 'Transfer',       account: '****4231', anomaly: 'Higher than usual UPI transfer' },
  { id: 't6',  date: '2026-05-24', merchant: 'Swiggy Food Order',           amount: -680,   type: 'debit',  category: 'Entertainment',  account: '****4231' },
  { id: 't7',  date: '2026-05-23', merchant: 'HDFC SIP — Nifty 50',        amount: -5000,  type: 'debit',  category: 'Investment',     account: '****4231', recurring: true },
  { id: 't8',  date: '2026-05-22', merchant: 'Petrol — HP Pump',            amount: -2500,  type: 'debit',  category: 'Transport',      account: '****4231' },
  { id: 't9',  date: '2026-05-22', merchant: 'Netflix Subscription',        amount: -649,   type: 'debit',  category: 'Entertainment',  account: '****4231', recurring: true },
  { id: 't10', date: '2026-05-21', merchant: 'Rent Transfer',               amount: -22000, type: 'debit',  category: 'Housing',        account: '****4231', recurring: true },
  { id: 't11', date: '2026-05-20', merchant: 'LIC Premium',                 amount: -4200,  type: 'debit',  category: 'Insurance',      account: '****4231', recurring: true },
  { id: 't12', date: '2026-05-19', merchant: 'Apollo Pharmacy',             amount: -1350,  type: 'debit',  category: 'Healthcare',     account: '****4231' },
  { id: 't13', date: '2026-05-18', merchant: 'School Fees — DPS',           amount: -8500,  type: 'debit',  category: 'Education',      account: '****4231', recurring: true },
  { id: 't14', date: '2026-05-17', merchant: 'Personal Loan EMI',           amount: -5400,  type: 'debit',  category: 'EMI',            account: '****2200', recurring: true },
  { id: 't15', date: '2026-05-16', merchant: 'Zerodha — Equity Purchase',   amount: -15000, type: 'debit',  category: 'Investment',     account: '****4231' },
  { id: 't16', date: '2026-05-15', merchant: 'Freelance Payment — Upwork',  amount: 28000,  type: 'credit', category: 'Salary',         account: '****2200' },
];

const SPENDING_CATEGORIES = [
  { name: 'Housing',       essential: true,  thisMonth: 22000, lastMonth: 22000, avg3: 22000, color: '#3b82f6' },
  { name: 'EMI',           essential: true,  thisMonth: 21600, lastMonth: 21600, avg3: 21600, color: '#dc2626' },
  { name: 'Groceries',     essential: true,  thisMonth: 8500,  lastMonth: 7200,  avg3: 7600,  color: '#f59e0b' },
  { name: 'Education',     essential: true,  thisMonth: 8500,  lastMonth: 8500,  avg3: 8500,  color: '#ec4899' },
  { name: 'Utilities',     essential: true,  thisMonth: 4200,  lastMonth: 3800,  avg3: 4000,  color: '#06b6d4' },
  { name: 'Insurance',     essential: true,  thisMonth: 4200,  lastMonth: 4200,  avg3: 4200,  color: '#6366f1' },
  { name: 'Investment',    essential: false, thisMonth: 20000, lastMonth: 5000,  avg3: 8300,  color: '#14b8a6' },
  { name: 'Entertainment', essential: false, thisMonth: 5400,  lastMonth: 4100,  avg3: 4500,  color: '#f97316' },
  { name: 'Transport',     essential: false, thisMonth: 4800,  lastMonth: 4500,  avg3: 4600,  color: '#8b5cf6' },
  { name: 'Healthcare',    essential: false, thisMonth: 1350,  lastMonth: 900,   avg3: 1100,  color: '#ef4444' },
  { name: 'Transfer',      essential: false, thisMonth: 12000, lastMonth: 5000,  avg3: 6000,  color: '#6366f1' },
];

const SAVINGS_TREND = [
  { month: 'Dec', rate: 18 }, { month: 'Jan', rate: 20 }, { month: 'Feb', rate: 22 },
  { month: 'Mar', rate: 19 }, { month: 'Apr', rate: 21 }, { month: 'May', rate: 23 },
];

const BUDGET_ITEMS = [
  { category: 'Groceries',     limit: 8000,  spent: 8500 },
  { category: 'Entertainment', limit: 4000,  spent: 5400 },
  { category: 'Transport',     limit: 5000,  spent: 4800 },
  { category: 'Utilities',     limit: 5000,  spent: 4200 },
  { category: 'Healthcare',    limit: 3000,  spent: 1350 },
  { category: 'Transfer',      limit: 10000, spent: 12000 },
];

const NET_WORTH_ASSETS = [
  { label: 'Savings & Current Accounts', value: 464670, icon: Wallet },
  { label: 'Fixed Deposits',             value: 200000, icon: Shield },
  { label: 'SIP / Mutual Funds',         value: 132700, icon: TrendingUp },
  { label: 'Recurring Deposit',          value: 36000,  icon: RefreshCw },
];

const NET_WORTH_LIABILITIES = [
  { label: 'Home Loan Outstanding',   value: 1840000, icon: Home },
  { label: 'Personal Loan',           value: 120000,  icon: Briefcase },
  { label: 'Credit Card Balance',     value: 23400,   icon: CreditCard },
];

/* ═══════════════════════════════════════════════════════
   Sparkline Component (pure CSS/SVG)
   ═══════════════════════════════════════════════════════ */
function MiniSparkline({ data, color = '#3b82f6', width = 140, height = 40 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${height - ((v - min) / range) * (height - 4) - 2}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={(data.length - 1) * step} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="3" fill={color} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   CSS-based Spending Ring Chart
   ═══════════════════════════════════════════════════════ */
function SpendingRing({ essentialTotal, discretionaryTotal, netSavings, t }) {
  const total = essentialTotal + discretionaryTotal + Math.max(netSavings, 0);
  const essentialPct = (essentialTotal / total) * 100;
  const discretionaryPct = (discretionaryTotal / total) * 100;

  return (
    <div className="cp-spending-ring-container">
      <svg viewBox="0 0 200 200" className="cp-spending-ring-svg">
        {/* Outer ring — discretionary */}
        <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="14" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#f97316" strokeWidth="14"
          strokeDasharray={`${discretionaryPct * 5.53} ${553 - discretionaryPct * 5.53}`}
          strokeDashoffset="138" strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        {/* Inner ring — essential */}
        <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="14" />
        <circle cx="100" cy="100" r="68" fill="none" stroke="#3b82f6" strokeWidth="14"
          strokeDasharray={`${essentialPct * 4.27} ${427 - essentialPct * 4.27}`}
          strokeDashoffset="107" strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="cp-spending-ring-center">
        <div className="cp-spending-ring-label">{t.netSavings}</div>
        <div className="cp-spending-ring-value" style={{ color: netSavings >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
          {formatINR(netSavings)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Budget Progress Bar
   ═══════════════════════════════════════════════════════ */
function BudgetBar({ item, onEditLimit, t, customerLang, getCategoryLabel }) {
  const pct = Math.min((item.spent / item.limit) * 100, 100);
  const status = pct >= 100 ? 'red' : pct >= 80 ? 'yellow' : 'green';
  const statusColor = status === 'red' ? 'var(--accent-red)' : status === 'yellow' ? 'var(--accent-yellow)' : 'var(--accent-green)';

  return (
    <div className="cp-budget-row">
      <div className="cp-budget-row-header">
        <span className="cp-budget-category">{getCategoryLabel(item.category)}</span>
        <div className="cp-budget-amounts">
          <span style={{ color: statusColor, fontWeight: 700 }}>{formatINR(item.spent)}</span>
          <span className="cp-budget-separator">/</span>
          <span>{formatINR(item.limit)}</span>
          <button className="cp-budget-edit-btn" onClick={() => onEditLimit(item.category)} title={customerLang === 'HI' ? 'सीमा संपादित करें' : 'Edit limit'}>
            <Edit3 size={12} />
          </button>
        </div>
      </div>
      <div className="cp-budget-bar-track">
        <div className="cp-budget-bar-fill" style={{ width: `${pct}%`, background: statusColor, transition: 'width 0.8s ease' }} />
      </div>
      {pct >= 100 && (
        <div className="cp-budget-overspend">
          <AlertTriangle size={11} /> {customerLang === 'HI' ? 'बजट से अधिक:' : 'Over budget by'} {formatINR(item.spent - item.limit)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Page Component
   ═══════════════════════════════════════════════════════ */
import { useEffect } from 'react';
import { portalAPI } from '../../api';

export default function MyFinancesPage() {
  const navigate = useNavigate();
  const { customerLang } = useOutletContext();
  const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

  const [activeTab, setActiveTab] = useState('accounts');
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [txnTypeFilter, setTxnTypeFilter] = useState('all');
  
  // API State
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [transactions, setTransactions] = useState(TRANSACTIONS);
  const [spendingCategories, setSpendingCategories] = useState(SPENDING_CATEGORIES);
  const [budgetItems, setBudgetItems] = useState(BUDGET_ITEMS);
  const [netWorthData, setNetWorthData] = useState({
    assets: NET_WORTH_ASSETS,
    liabilities: NET_WORTH_LIABILITIES,
    totalBalance: ACCOUNTS.reduce((sum, a) => sum + a.balance, 0),
    netWorth: NET_WORTH_ASSETS.reduce((s, a) => s + a.value, 0) - NET_WORTH_LIABILITIES.reduce((s, l) => s + l.value, 0)
  });

  const [editingBudget, setEditingBudget] = useState(null);
  const [editBudgetValue, setEditBudgetValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accRes, txnRes, spendRes, nwRes] = await Promise.all([
          portalAPI.getAccounts().catch(() => null),
          portalAPI.getTransactions({ limit: 50 }).catch(() => null),
          portalAPI.getSpendingInsights().catch(() => null),
          portalAPI.getNetWorth().catch(() => null)
        ]);

        if (accRes?.data?.data) {
          const apiAcc = accRes.data.data.primaryAccount;
          // Map to UI format, keeping sparklines/alerts mock for demo visual richness
          setAccounts([{
            id: 'a1',
            type: apiAcc.accountType === 'SAVINGS' ? 'Savings' : 'Salary',
            number: apiAcc.accountNumber ? `****${apiAcc.accountNumber.slice(-4)}` : '****4231',
            balance: apiAcc.balance,
            trend: 'up',
            change: 4200,
            label: '↑ Active Account',
            sparkline: [245, 252, 248, 260, 255, 268, 272, 275, 278, 276, 280, 284],
            alerts: ['Average daily balance maintained']
          }]);
        }

        if (txnRes?.data?.data?.transactions) {
          const apiTxns = txnRes.data.data.transactions.map(t => ({
            id: t.id,
            date: new Date(t.transactionDate).toISOString().split('T')[0],
            merchant: t.description || 'Transaction',
            amount: t.type === 'DEBIT' ? -t.amount : t.amount,
            type: t.type === 'DEBIT' ? 'debit' : 'credit',
            category: t.category,
            account: '****4231' // Mocked account display for now
          }));
          if (apiTxns.length > 0) setTransactions(apiTxns);
        }

        if (spendRes?.data?.data?.categories) {
          const apiSpend = spendRes.data.data.categories.map(c => ({
            name: c.category,
            essential: ['Housing', 'EMI', 'Groceries', 'Education', 'Utilities', 'Insurance'].includes(c.category),
            thisMonth: c.amount,
            lastMonth: c.amount * 0.9, // mock previous
            avg3: c.amount * 0.95, // mock avg
            color: CATEGORIES[c.category]?.color || '#64748b'
          }));
          if (apiSpend.length > 0) setSpendingCategories(apiSpend);
        }

        if (nwRes?.data?.data) {
          const apiNw = nwRes.data.data;
          setNetWorthData({
            assets: [
              { label: 'Savings & Current Accounts', value: apiNw.assets.bankBalance, icon: Wallet },
              { label: 'Fixed Deposits', value: apiNw.assets.fixedDeposits, icon: Shield },
              { label: 'SIP / Mutual Funds', value: apiNw.assets.mutualFunds, icon: TrendingUp },
              { label: 'Recurring Deposit', value: apiNw.assets.recurringDeposits, icon: RefreshCw },
            ],
            liabilities: [
              { label: 'Home Loan Outstanding', value: apiNw.liabilities.homeLoan || 1840000, icon: Home },
              { label: 'Personal Loan', value: apiNw.liabilities.personalLoan || 120000, icon: Briefcase },
              { label: 'Credit Card Balance', value: apiNw.liabilities.creditCardDue || 23400, icon: CreditCard },
            ],
            totalBalance: apiNw.assets.bankBalance,
            netWorth: apiNw.netWorth
          });
        }
      } catch (err) {
        console.error('Error fetching finance data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBalance = netWorthData.totalBalance;

  const getAccountTypeLabel = (type) => {
    if (type === 'Savings') return t.savingsAccount;
    if (type === 'Salary') return t.salaryAccount;
    if (type === 'Current') return t.currentAccount;
    return type;
  };

  const getCategoryLabel = (category) => {
    const mapping = {
      Salary: customerLang === 'HI' ? 'वेतन' : 'Salary',
      Housing: customerLang === 'HI' ? 'आवास' : 'Housing',
      Groceries: customerLang === 'HI' ? 'किराना' : 'Groceries',
      Utilities: customerLang === 'HI' ? 'उपयोगिताएं' : 'Utilities',
      Transport: customerLang === 'HI' ? 'परिवहन' : 'Transport',
      Healthcare: customerLang === 'HI' ? 'स्वास्थ्य सेवा' : 'Healthcare',
      Education: customerLang === 'HI' ? 'शिक्षा' : 'Education',
      Entertainment: customerLang === 'HI' ? 'मनोरंजन' : 'Entertainment',
      Investment: customerLang === 'HI' ? 'निवेश' : 'Investment',
      Insurance: customerLang === 'HI' ? 'बीमा' : 'Insurance',
      EMI: customerLang === 'HI' ? 'ईएमआई' : 'EMI',
      Transfer: customerLang === 'HI' ? 'ट्रान्सफर' : 'Transfer',
      Other: customerLang === 'HI' ? 'अन्य' : 'Other'
    };
    return mapping[category] || category;
  };

  const getNetWorthLabel = (label) => {
    if (label === 'Savings & Current Accounts') return `${t.savingsAccount} & ${t.currentAccount}`;
    if (label === 'Fixed Deposits') return t.tabFD;
    if (label === 'SIP / Mutual Funds') return t.tabSIP;
    if (label === 'Recurring Deposit') return t.tabRD;
    if (label === 'Home Loan Outstanding') return customerLang === 'HI' ? 'गृह ऋण बकाया' : 'Home Loan Outstanding';
    if (label === 'Personal Loan') return customerLang === 'HI' ? 'व्यक्तिगत ऋण' : 'Personal Loan';
    if (label === 'Credit Card Balance') return customerLang === 'HI' ? 'क्रेडिट कार्ड शेष राशि' : 'Credit Card Balance';
    return label;
  };

  const tabs = [
    { id: 'accounts',     label: t.tabAccounts,     icon: Wallet },
    { id: 'transactions', label: t.tabTransactions,  icon: CreditCard },
    { id: 'spending',     label: t.tabSpending,      icon: PieChart },
    { id: 'networth',     label: t.tabNetWorth,      icon: BarChart3 },
  ];

  const filteredTxns = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Math.abs(t.amount).toString().includes(searchQuery) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      const matchesType = txnTypeFilter === 'all' ||
        (txnTypeFilter === 'credits' && t.type === 'credit') ||
        (txnTypeFilter === 'debits' && t.type === 'debit');
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [searchQuery, categoryFilter, txnTypeFilter]);

  /* Spending calculations */
  const essentialTotal = spendingCategories.filter(c => c.essential).reduce((s, c) => s + c.thisMonth, 0);
  const discretionaryTotal = spendingCategories.filter(c => !c.essential).reduce((s, c) => s + c.thisMonth, 0);
  const totalIncome = 113000; // salary + freelance
  const totalExpenses = essentialTotal + discretionaryTotal;
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = Math.round((netSavings / totalIncome) * 100);

  /* Net worth calculations */
  const totalAssets = netWorthData.assets.reduce((s, a) => s + a.value, 0);
  const totalLiabilities = netWorthData.liabilities.reduce((s, l) => s + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  /* Budget edit handlers */
  const handleStartEditBudget = (category) => {
    const item = budgetItems.find(b => b.category === category);
    setEditingBudget(category);
    setEditBudgetValue(String(item?.limit || ''));
  };
  const handleSaveBudget = () => {
    if (editingBudget && editBudgetValue) {
      setBudgetItems(prev => prev.map(b =>
        b.category === editingBudget ? { ...b, limit: parseInt(editBudgetValue) || b.limit } : b
      ));
    }
    setEditingBudget(null);
    setEditBudgetValue('');
  };

  /* Anomaly highlights */
  const anomalies = spendingCategories.filter(c => {
    const diff = c.thisMonth - c.avg3;
    return diff > c.avg3 * 0.15 && diff > 500;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Type', 'Category', 'Account', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredTxns.map(t => `${t.date},"${(t.desc || '').replace(/"/g, '""')}",${t.type},${t.category},${t.account},${t.amount},${t.status || 'COMPLETED'}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions_export.csv';
    link.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="cp-page">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="cp-section page-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Wallet size={26} style={{ color: 'var(--accent-blue)' }} />
          {t.financesTitle}
        </h2>
        <p>{t.financesSubtitle}</p>
      </div>

      {/* ── Tab Navigation ───────────────────────────── */}
      <div className="cp-section cp-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cp-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════
         TAB: ACCOUNTS
         ═══════════════════════════════════════════════ */}
      {activeTab === 'accounts' && (
        <>
          {/* Account Cards Grid */}
          <div className="cp-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
            {accounts.map((acc, i) => (
              <div key={acc.id} className="cp-account-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div
                  className="cp-account-card-main"
                  onClick={() => setExpandedAccount(expandedAccount === acc.id ? null : acc.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="cp-account-card-top">
                    <div>
                      <div className="cp-account-type">{getAccountTypeLabel(acc.type)}</div>
                      <div className="cp-account-number">{acc.number}</div>
                    </div>
                    <div className={`cp-trend-indicator ${acc.trend}`}>
                      {acc.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {formatINR(Math.abs(acc.change))}
                    </div>
                  </div>
                  <div className="cp-account-balance">{formatINR(acc.balance)}</div>
                  <div className="cp-account-card-bottom">
                    <span className="cp-account-label" style={{ color: acc.trend === 'up' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {acc.label}
                    </span>
                    <MiniSparkline data={acc.sparkline} color={acc.trend === 'up' ? '#10b981' : '#ef4444'} width={100} height={28} />
                  </div>
                  <div className="cp-account-expand-hint">
                    {expandedAccount === acc.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    <span>{expandedAccount === acc.id ? t.hideDetails : t.tapForDetails}</span>
                  </div>
                </div>

                {/* Expanded: Transaction filter, sparkline, alerts */}
                {expandedAccount === acc.id && (
                  <div className="cp-account-expanded" style={{ animation: 'cpFadeInUp 0.3s ease' }}>
                    {/* 12-month sparkline */}
                    <div className="cp-account-expanded-section">
                      <div className="cp-account-section-title">
                        <TrendingUp size={14} /> {t.trend12Month}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
                        <MiniSparkline data={acc.sparkline} color="var(--accent-blue)" width={260} height={50} />
                      </div>
                    </div>

                    {/* Account-specific alerts */}
                    {acc.alerts && acc.alerts.length > 0 && (
                      <div className="cp-account-expanded-section">
                        <div className="cp-account-section-title">
                          <Bell size={14} /> {t.accountAlerts}
                        </div>
                        {acc.alerts.map((alert, ai) => (
                          <div key={ai} className="cp-account-alert-item">
                            <Info size={13} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                            <span>{alert}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick transaction filter */}
                    <div className="cp-account-expanded-section">
                      <button className="btn btn-secondary btn-sm" onClick={() => {
                        setActiveTab('transactions');
                        setSearchQuery(acc.number);
                      }}>
                        <Search size={13} /> {t.viewTransactionsFor} {acc.number}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total Balance Row */}
          <div className="cp-section cp-total-balance-card">
            <div className="cp-total-balance-left">
              <div className="cp-total-balance-label">{t.totalBalanceAcross}</div>
              <div className="cp-total-balance-value">{formatINR(totalBalance)}</div>
              <div className="cp-total-balance-meta">
                <span className="cp-trend-indicator up"><ArrowUpRight size={12} /> {formatINR(76800)} {customerLang === 'HI' ? 'इस महीने' : 'this month'}</span>
              </div>
            </div>
            <div className="cp-total-balance-sparkline">
              <MiniSparkline
                data={[245000, 252000, 248000, 260000, 255000, 268000, 272000, 275000, 278000, 276000, 280000, 284320]}
                color="#3b82f6" width={180} height={50}
              />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>{t.monthTrend12}</div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════
         TAB: TRANSACTIONS
         ═══════════════════════════════════════════════ */}
      {activeTab === 'transactions' && (
        <>
          {/* Type filter tabs */}
          <div className="cp-section">
            <div className="cp-txn-type-tabs">
              {[
                { key: 'all', label: t.allTxns },
                { key: 'credits', label: t.credits },
                { key: 'debits', label: t.debits },
              ].map(txnTypeObj => (
                <button
                  key={txnTypeObj.key}
                  className={`cp-txn-type-btn ${txnTypeFilter === txnTypeObj.key ? 'active' : ''}`}
                  onClick={() => setTxnTypeFilter(txnTypeObj.key)}
                >
                  {txnTypeObj.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search, Filter, Export */}
          <div className="cp-section cp-txn-toolbar">
            <div className="cp-txn-search-wrap">
              <Search size={16} className="cp-txn-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="cp-txn-search-input"
              />
            </div>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="cp-txn-category-select">
              <option value="All">{t.allCategories}</option>
              {Object.keys(CATEGORIES).map(cat => <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>)}
            </select>
            <div className="cp-txn-export-btns">
              <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}><Download size={14} /> CSV</button>
              <button className="btn btn-secondary btn-sm" onClick={handleExportPDF}><FileText size={14} /> PDF</button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="cp-section cp-txn-list-card">
            <div className="cp-txn-list-header">
              <span>{filteredTxns.length} {customerLang === 'HI' ? 'लेन-देन' : 'transactions'}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.aiCategorized}</span>
            </div>
            {filteredTxns.length === 0 ? (
              <div className="cp-txn-empty">
                <Search size={32} style={{ opacity: 0.3 }} />
                <p>{t.noTxnsFound}</p>
              </div>
            ) : (
              filteredTxns.map((txn, i) => {
                const cat = CATEGORIES[txn.category] || CATEGORIES.Other;
                const CatIcon = cat.icon;
                return (
                  <div key={txn.id} className="cp-txn-row" style={{ animationDelay: `${i * 0.03}s` }}>
                    <div className="cp-txn-icon-wrap" style={{ background: `${cat.color}18`, color: cat.color }}>
                      <CatIcon size={18} />
                    </div>
                    <div className="cp-txn-info">
                      <div className="cp-txn-merchant-row">
                        <span className="cp-txn-merchant">{txn.merchant}</span>
                        {txn.recurring && <span className="badge badge-blue" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>{customerLang === 'HI' ? 'आवर्ती' : 'Recurring'}</span>}
                      </div>
                      <div className="cp-txn-meta">
                        <span>{txn.date}</span> · <span>{txn.account}</span> · <span style={{ color: cat.color }}>{getCategoryLabel(txn.category)}</span>
                      </div>
                      {txn.anomaly && (
                        <div className="cp-txn-anomaly-inline">
                          <AlertTriangle size={11} /> {txn.anomaly}
                        </div>
                      )}
                    </div>
                    <div className={`cp-txn-amount-value ${txn.type}`}>
                      {txn.type === 'credit' ? '+' : ''}{formatINR(txn.amount)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════
         TAB: SPENDING INSIGHTS
         ═══════════════════════════════════════════════ */}
      {activeTab === 'spending' && (
        <>
          {/* Spending Ring + Savings Rate */}
          <div className="cp-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Spending Ring Chart */}
            <div className="cp-card-glass">
              <div className="cp-section-header">
                <PieChart size={18} style={{ color: 'var(--accent-blue)' }} />
                <h3>{t.spendingBreakdown}</h3>
              </div>
              <SpendingRing essentialTotal={essentialTotal} discretionaryTotal={discretionaryTotal} netSavings={netSavings} t={t} />
              <div className="cp-ring-legend">
                <div className="cp-ring-legend-item">
                  <span className="cp-ring-legend-dot" style={{ background: '#3b82f6' }} />
                  <span>{t.innerEssential} ({formatINR(essentialTotal)})</span>
                </div>
                <div className="cp-ring-legend-item">
                  <span className="cp-ring-legend-dot" style={{ background: '#f97316' }} />
                  <span>{t.outerDiscretionary} ({formatINR(discretionaryTotal)})</span>
                </div>
              </div>
            </div>

            {/* Savings Rate Tracker */}
            <div className="cp-card-glass">
              <div className="cp-section-header">
                <TrendingUp size={18} style={{ color: 'var(--accent-green)' }} />
                <h3>{t.savingsRateTracker}</h3>
              </div>
              <div className="cp-savings-rate-hero">
                <div className="cp-savings-rate-big">{savingsRate}%</div>
                <div className="cp-savings-rate-subtitle">{t.incomeSaved}</div>
                <span className={`badge ${savingsRate >= 20 ? 'badge-green' : 'badge-yellow'}`}>
                  {savingsRate >= 20 ? t.aboveRecommended : t.belowRecommended}
                </span>
              </div>
              <div className="cp-savings-breakdown">
                <div className="cp-savings-breakdown-row">
                  <span>{t.income}</span><span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{formatINR(totalIncome)}</span>
                </div>
                <div className="cp-savings-breakdown-row">
                  <span>{t.expenses}</span><span style={{ fontWeight: 700, color: 'var(--accent-red)' }}>-{formatINR(totalExpenses)}</span>
                </div>
                <div className="cp-savings-breakdown-row cp-savings-net">
                  <span>{t.netSavings}</span><span style={{ fontWeight: 800, color: netSavings >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{formatINR(netSavings)}</span>
                </div>
              </div>
              {/* 6-month trend */}
              <div className="cp-savings-trend-bar">
                {SAVINGS_TREND.map(s => (
                  <div key={s.month} className="cp-savings-trend-col">
                    <div className="cp-savings-trend-bar-fill" style={{ height: `${s.rate * 3}px`, background: s.rate >= 20 ? 'var(--accent-green)' : 'var(--accent-yellow)' }} />
                    <span className="cp-savings-trend-label">{s.month}</span>
                    <span className="cp-savings-trend-value">{s.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Anomaly Highlight Cards */}
          {anomalies.length > 0 && (
            <div className="cp-section" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {anomalies.map(a => {
                const diff = a.thisMonth - a.avg3;
                return (
                  <div key={a.name} className="cp-anomaly-card">
                    <AlertTriangle size={16} style={{ color: 'var(--accent-yellow)', flexShrink: 0 }} />
                    <span>
                      {customerLang === 'HI' ? (
                        <>आपने इस महीने <strong>{getCategoryLabel(a.name)}</strong> पर अपने 3-महीने के औसत से <strong>{formatINR(diff)}</strong> अधिक खर्च किए।</>
                      ) : (
                        <>You spent <strong>{formatINR(diff)}</strong> more on <strong>{a.name}</strong> this month than your 3-month average.</>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Monthly Comparison Table */}
          <div className="cp-section cp-card-glass">
            <div className="cp-section-header">
              <BarChart3 size={18} style={{ color: 'var(--accent-purple)' }} />
              <h3>{t.monthlyComparison}</h3>
            </div>
            <div className="cp-table-wrapper">
              <table className="cp-comparison-table">
                <thead>
                  <tr>
                    <th>{t.tableCategory}</th>
                    <th>{t.tableThisMonth}</th>
                    <th>{t.tableLastMonth}</th>
                    <th>{t.table3MonthAvg}</th>
                    <th>{t.tableChange}</th>
                  </tr>
                </thead>
                <tbody>
                  {spendingCategories.map(row => {
                    const diff = row.thisMonth - row.avg3;
                    return (
                      <tr key={row.name}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="cp-cat-dot" style={{ background: row.color }} />
                            <span style={{ fontWeight: 600 }}>{getCategoryLabel(row.name)}</span>
                            {row.essential && <span className="badge badge-blue" style={{ fontSize: '0.55rem', padding: '1px 5px' }}>{t.essentialLabel}</span>}
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{formatINR(row.thisMonth)}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{formatINR(row.lastMonth)}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{formatINR(row.avg3)}</td>
                        <td style={{ color: diff > 0 ? 'var(--accent-red)' : diff < 0 ? 'var(--accent-green)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {diff > 0 ? '+' : ''}{formatINR(diff)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Budget Setup */}
          <div className="cp-section cp-card-glass">
            <div className="cp-section-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3>{t.budgetSetup}</h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {customerLang === 'HI' ? 'ट्रैफिक लाइट: 🟢 ठीक है · 🟡 >80% · 🔴 अधिक' : 'Traffic light: 🟢 OK · 🟡 >80% · 🔴 Over'}
              </span>
            </div>

            {/* Budget edit modal */}
            {editingBudget && (
              <div className="cp-budget-edit-modal">
                <div className="cp-budget-edit-content">
                  <h4>{customerLang === 'HI' ? `मासिक सीमा संपादित करें — ${getCategoryLabel(editingBudget)}` : `Edit Monthly Limit — ${editingBudget}`}</h4>
                  <input
                    type="number"
                    className="form-input"
                    value={editBudgetValue}
                    onChange={e => setEditBudgetValue(e.target.value)}
                    placeholder={customerLang === 'HI' ? 'मासिक सीमा दर्ज करें' : 'Enter monthly limit'}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn btn-primary btn-sm" onClick={handleSaveBudget}>
                      <CheckCircle2 size={14} /> {t.save}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingBudget(null)}>
                      <X size={14} /> {t.cancel}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="cp-budget-grid">
              {budgetItems.map(item => (
                <BudgetBar key={item.category} item={item} onEditLimit={handleStartEditBudget} t={t} customerLang={customerLang} getCategoryLabel={getCategoryLabel} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════════════════════════════════
         TAB: NET WORTH
         ═══════════════════════════════════════════════ */}
      {activeTab === 'networth' && (
        <>
          <div className="cp-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Assets */}
            <div className="cp-card-glass cp-networth-section">
              <div className="cp-networth-section-header" style={{ borderColor: 'var(--accent-green)' }}>
                <TrendingUp size={18} style={{ color: 'var(--accent-green)' }} />
                <h3 style={{ color: 'var(--accent-green)' }}>{t.assets}</h3>
              </div>
              {netWorthData.assets.map(item => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.label} className="cp-networth-row">
                    <div className="cp-networth-row-left">
                      <div className="cp-networth-row-icon" style={{ background: 'var(--accent-green-soft)', color: 'var(--accent-green)' }}>
                        <ItemIcon size={16} />
                      </div>
                      <span>{getNetWorthLabel(item.label)}</span>
                    </div>
                    <span className="cp-networth-row-value">{formatINR(item.value)}</span>
                  </div>
                );
              })}
              <div className="cp-networth-total-row">
                <span>{t.totalAssets}</span>
                <span style={{ color: 'var(--accent-green)' }}>{formatINR(totalAssets)}</span>
              </div>
            </div>

            {/* Liabilities */}
            <div className="cp-card-glass cp-networth-section">
              <div className="cp-networth-section-header" style={{ borderColor: 'var(--accent-red)' }}>
                <TrendingDown size={18} style={{ color: 'var(--accent-red)' }} />
                <h3 style={{ color: 'var(--accent-red)' }}>{t.liabilities}</h3>
              </div>
              {netWorthData.liabilities.map(item => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.label} className="cp-networth-row">
                    <div className="cp-networth-row-left">
                      <div className="cp-networth-row-icon" style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}>
                        <ItemIcon size={16} />
                      </div>
                      <span>{getNetWorthLabel(item.label)}</span>
                    </div>
                    <span className="cp-networth-row-value">{formatINR(item.value)}</span>
                  </div>
                );
              })}
              <div className="cp-networth-total-row">
                <span>{t.totalLiabilities}</span>
                <span style={{ color: 'var(--accent-red)' }}>{formatINR(totalLiabilities)}</span>
              </div>
            </div>
          </div>

          {/* Net Worth Summary */}
          <div className="cp-section cp-networth-summary">
            <div className="cp-networth-summary-label">{t.netWorthLabel}</div>
            <div className="cp-networth-summary-value" style={{ color: netWorth >= 0 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
              {netWorth < 0 ? '-' : ''}{formatINR(Math.abs(netWorth))}
            </div>

            {/* Progress-oriented framing */}
            <div className="cp-networth-encouragement">
              <span>📌 {t.netWorthEncourage} {formatINR(18200)} {customerLang === 'HI' ? '' : 'this month.'}</span>
            </div>

            <div className="cp-networth-progress-bar">
              <div className="cp-networth-assets-bar" style={{ width: `${Math.min((totalAssets / (totalAssets + totalLiabilities)) * 100, 100)}%` }}>
                {t.assets} {formatINR(totalAssets)}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>{t.assets}: {Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100)}%</span>
              <span>{t.liabilities}: {Math.round((totalLiabilities / (totalAssets + totalLiabilities)) * 100)}%</span>
            </div>

            <button onClick={() => navigate('/portal/sage')} className="btn btn-primary" style={{ marginTop: 20 }}>
              <MessageSquare size={16} /> {t.askSageImprove}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
