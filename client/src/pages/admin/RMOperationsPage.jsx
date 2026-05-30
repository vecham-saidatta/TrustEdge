import { useState, useEffect, useMemo, Fragment } from 'react';
import {
  Users, Award, TrendingUp, BookOpen, GraduationCap, Search, Filter, ChevronDown, ChevronUp,
  Star, Target, Phone, Clock, Brain, MessageSquare, Shield, CheckCircle, AlertTriangle,
  BarChart3, PieChart as PieChartIcon, Briefcase, Calendar, PlayCircle, ArrowRight,
  ThumbsUp, Copy, BookmarkPlus, Megaphone, Eye, X, FileText, User, RefreshCw, Zap,
  DollarSign, TrendingDown, AlertCircle, Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

// ═══════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════

const MOCK_RMS = [
  {
    id: 'rm1', name: 'Ananya Sharma', branch: 'Connaught Place, Delhi', empId: 'RM-2041',
    caseResolution: 82, conversionRate: 48, outcomeRecording: 94, aiAcceptance: 62,
    sageHandoff: 88, callAttempt: 97, avgCaseAge: 2.8, totalCases: 145, activeCases: 23,
    customersManaged: 312, aumManaged: 4520000000, joinDate: '2022-03-15',
    sparkline: [72, 75, 78, 80, 82, 81, 84, 82]
  },
  {
    id: 'rm2', name: 'Rajesh Patel', branch: 'Bandra West, Mumbai', empId: 'RM-1987',
    caseResolution: 58, conversionRate: 22, outcomeRecording: 71, aiAcceptance: 92,
    sageHandoff: 55, callAttempt: 78, avgCaseAge: 8.2, totalCases: 98, activeCases: 41,
    customersManaged: 287, aumManaged: 3810000000, joinDate: '2021-08-10',
    sparkline: [65, 62, 59, 58, 56, 55, 57, 58]
  },
  {
    id: 'rm3', name: 'Priya Krishnamurthy', branch: 'Koramangala, Bengaluru', empId: 'RM-2103',
    caseResolution: 91, conversionRate: 55, outcomeRecording: 98, aiAcceptance: 74,
    sageHandoff: 92, callAttempt: 99, avgCaseAge: 1.9, totalCases: 167, activeCases: 12,
    customersManaged: 345, aumManaged: 5670000000, joinDate: '2020-11-22',
    sparkline: [85, 87, 89, 90, 91, 92, 91, 91]
  },
  {
    id: 'rm4', name: 'Vikram Singh', branch: 'Sector 17, Chandigarh', empId: 'RM-2056',
    caseResolution: 73, conversionRate: 38, outcomeRecording: 86, aiAcceptance: 45,
    sageHandoff: 76, callAttempt: 91, avgCaseAge: 4.1, totalCases: 112, activeCases: 28,
    customersManaged: 298, aumManaged: 3240000000, joinDate: '2022-06-01',
    sparkline: [68, 70, 72, 73, 74, 73, 73, 73]
  },
  {
    id: 'rm5', name: 'Deepa Menon', branch: 'MG Road, Kochi', empId: 'RM-2089',
    caseResolution: 67, conversionRate: 31, outcomeRecording: 78, aiAcceptance: 28,
    sageHandoff: 62, callAttempt: 84, avgCaseAge: 5.6, totalCases: 89, activeCases: 35,
    customersManaged: 256, aumManaged: 2890000000, joinDate: '2023-01-15',
    sparkline: [60, 62, 64, 65, 66, 67, 66, 67]
  },
  {
    id: 'rm6', name: 'Arjun Reddy', branch: 'Jubilee Hills, Hyderabad', empId: 'RM-2011',
    caseResolution: 88, conversionRate: 52, outcomeRecording: 96, aiAcceptance: 71,
    sageHandoff: 85, callAttempt: 96, avgCaseAge: 2.3, totalCases: 156, activeCases: 18,
    customersManaged: 331, aumManaged: 4980000000, joinDate: '2021-04-10',
    sparkline: [80, 82, 84, 86, 87, 88, 88, 88]
  },
  {
    id: 'rm7', name: 'Sneha Gupta', branch: 'Park Street, Kolkata', empId: 'RM-2134',
    caseResolution: 55, conversionRate: 19, outcomeRecording: 62, aiAcceptance: 95,
    sageHandoff: 48, callAttempt: 72, avgCaseAge: 9.1, totalCases: 76, activeCases: 44,
    customersManaged: 223, aumManaged: 2120000000, joinDate: '2023-07-20',
    sparkline: [58, 56, 54, 53, 52, 54, 55, 55]
  },
  {
    id: 'rm8', name: 'Karthik Iyer', branch: 'Anna Nagar, Chennai', empId: 'RM-2067',
    caseResolution: 79, conversionRate: 42, outcomeRecording: 91, aiAcceptance: 58,
    sageHandoff: 81, callAttempt: 94, avgCaseAge: 3.4, totalCases: 134, activeCases: 22,
    customersManaged: 308, aumManaged: 4150000000, joinDate: '2022-09-05',
    sparkline: [74, 75, 77, 78, 79, 79, 80, 79]
  },
  {
    id: 'rm9', name: 'Meera Joshi', branch: 'FC Road, Pune', empId: 'RM-2145',
    caseResolution: 76, conversionRate: 36, outcomeRecording: 88, aiAcceptance: 67,
    sageHandoff: 79, callAttempt: 92, avgCaseAge: 3.8, totalCases: 121, activeCases: 26,
    customersManaged: 289, aumManaged: 3560000000, joinDate: '2022-12-10',
    sparkline: [70, 72, 74, 75, 76, 76, 77, 76]
  },
  {
    id: 'rm10', name: 'Rohan Das', branch: 'Hazratganj, Lucknow', empId: 'RM-2098',
    caseResolution: 62, conversionRate: 27, outcomeRecording: 74, aiAcceptance: 35,
    sageHandoff: 68, callAttempt: 86, avgCaseAge: 6.2, totalCases: 95, activeCases: 38,
    customersManaged: 245, aumManaged: 2670000000, joinDate: '2023-03-25',
    sparkline: [58, 60, 61, 62, 63, 62, 62, 62]
  }
];

const PORTFOLIO_DATA = {
  rm1: {
    totalCustomers: 312, totalAUM: 4520000000,
    riskDist: [
      { name: 'Critical', value: 18, color: '#ef4444' },
      { name: 'High', value: 42, color: '#f97316' },
      { name: 'Moderate', value: 108, color: '#f59e0b' },
      { name: 'Low', value: 144, color: '#10b981' },
    ],
    aumAtRisk: 890000000,
    aumTrend: [
      { month: 'Jan', value: 920 }, { month: 'Feb', value: 905 }, { month: 'Mar', value: 890 },
      { month: 'Apr', value: 875 }, { month: 'May', value: 890 }
    ],
    noContact: [
      { name: 'Suresh Mehta', days: 45, aum: 12500000, risk: 'High' },
      { name: 'Kavita Bhatia', days: 38, aum: 8700000, risk: 'Moderate' },
      { name: 'Ramesh Agarwal', days: 52, aum: 15200000, risk: 'Critical' },
      { name: 'Pooja Nair', days: 33, aum: 6800000, risk: 'Moderate' },
    ],
    fdMaturities: [
      { name: 'Amit Kumar', amount: 5000000, maturityDate: '2026-06-15', tenure: '12M', rate: '7.25%' },
      { name: 'Lakshmi Devi', amount: 2500000, maturityDate: '2026-06-08', tenure: '6M', rate: '6.80%' },
      { name: 'Harish Chandra', amount: 8000000, maturityDate: '2026-06-22', tenure: '24M', rate: '7.50%' },
      { name: 'Nisha Verma', amount: 3200000, maturityDate: '2026-06-18', tenure: '12M', rate: '7.10%' },
    ],
    sipReviews: [
      { name: 'Sanjay Kapoor', sipAmount: 25000, fundName: 'SBI Blue Chip Fund', reviewDate: '2026-06-10' },
      { name: 'Geeta Sharma', sipAmount: 15000, fundName: 'HDFC Mid-Cap Fund', reviewDate: '2026-06-14' },
      { name: 'Anil Verma', sipAmount: 50000, fundName: 'ICICI Pru Value Fund', reviewDate: '2026-06-20' },
    ]
  }
};

// Generate portfolio data for other RMs
MOCK_RMS.forEach(rm => {
  if (!PORTFOLIO_DATA[rm.id]) {
    const custCount = rm.customersManaged;
    const critPct = Math.floor(Math.random() * 8) + 4;
    const highPct = Math.floor(Math.random() * 12) + 8;
    const modPct = Math.floor(Math.random() * 20) + 25;
    PORTFOLIO_DATA[rm.id] = {
      totalCustomers: custCount,
      totalAUM: rm.aumManaged,
      riskDist: [
        { name: 'Critical', value: Math.floor(custCount * critPct / 100), color: '#ef4444' },
        { name: 'High', value: Math.floor(custCount * highPct / 100), color: '#f97316' },
        { name: 'Moderate', value: Math.floor(custCount * modPct / 100), color: '#f59e0b' },
        { name: 'Low', value: custCount - Math.floor(custCount * (critPct + highPct + modPct) / 100), color: '#10b981' },
      ],
      aumAtRisk: Math.floor(rm.aumManaged * (0.12 + Math.random() * 0.1)),
      aumTrend: [
        { month: 'Jan', value: Math.floor(rm.aumManaged / 10000000 * (1.05 + Math.random() * 0.05)) },
        { month: 'Feb', value: Math.floor(rm.aumManaged / 10000000 * (1.02 + Math.random() * 0.05)) },
        { month: 'Mar', value: Math.floor(rm.aumManaged / 10000000 * (1.0 + Math.random() * 0.05)) },
        { month: 'Apr', value: Math.floor(rm.aumManaged / 10000000 * (0.98 + Math.random() * 0.05)) },
        { month: 'May', value: Math.floor(rm.aumManaged / 10000000) },
      ],
      noContact: [
        { name: 'Customer A', days: 35 + Math.floor(Math.random() * 20), aum: 5000000 + Math.floor(Math.random() * 10000000), risk: 'High' },
        { name: 'Customer B', days: 31 + Math.floor(Math.random() * 15), aum: 3000000 + Math.floor(Math.random() * 8000000), risk: 'Moderate' },
        { name: 'Customer C', days: 40 + Math.floor(Math.random() * 25), aum: 7000000 + Math.floor(Math.random() * 15000000), risk: 'Critical' },
      ],
      fdMaturities: [
        { name: 'FD Customer 1', amount: 2000000 + Math.floor(Math.random() * 5000000), maturityDate: '2026-06-12', tenure: '12M', rate: '7.25%' },
        { name: 'FD Customer 2', amount: 1500000 + Math.floor(Math.random() * 3000000), maturityDate: '2026-06-20', tenure: '6M', rate: '6.80%' },
      ],
      sipReviews: [
        { name: 'SIP Customer 1', sipAmount: 10000 + Math.floor(Math.random() * 40000), fundName: 'Axis Long Term Equity', reviewDate: '2026-06-15' },
        { name: 'SIP Customer 2', sipAmount: 5000 + Math.floor(Math.random() * 20000), fundName: 'Mirae Asset Emerging', reviewDate: '2026-06-22' },
      ]
    };
  }
});

const TALK_TRACKS = [
  {
    id: 'tt1', title: 'FD Maturity Retention — Premium Segment',
    category: 'Retention', segment: 'Premium', effectiveness: 4.6, usageCount: 342,
    content: 'Good morning [Customer Name], this is [RM Name] from [Bank]. I noticed your Fixed Deposit of ₹[Amount] is maturing on [Date]. Given the current interest rate environment, I wanted to discuss some attractive renewal options before the maturity date...',
    tags: ['FD', 'Maturity', 'Premium'],
    regulatoryNote: 'Must disclose applicable TDS deduction and premature withdrawal penalties as per RBI guidelines.'
  },
  {
    id: 'tt2', title: 'High-Value Account Balance Drop Alert',
    category: 'Risk Mitigation', segment: 'HNI', effectiveness: 4.2, usageCount: 189,
    content: 'Hello [Customer Name], I hope you\'re doing well. I\'m reaching out as your dedicated relationship manager. I wanted to check in and see if there\'s anything we can assist you with regarding your recent account activity...',
    tags: ['Balance Drop', 'HNI', 'Proactive'],
    regulatoryNote: 'Do not reference specific transaction amounts without customer verification. Follow KYC re-verification protocol if needed.'
  },
  {
    id: 'tt3', title: 'SIP Lapse Recovery — Mutual Fund',
    category: 'Recovery', segment: 'Mass Affluent', effectiveness: 3.9, usageCount: 256,
    content: '[Customer Name], I noticed that your SIP in [Fund Name] has been paused for [Duration]. Market conditions have been favorable recently, and I wanted to discuss resuming your systematic investment to stay on track with your financial goals...',
    tags: ['SIP', 'Mutual Fund', 'Recovery'],
    regulatoryNote: 'Mutual fund investments are subject to market risks. Past performance is not indicative of future results. Read all scheme-related documents carefully.'
  },
  {
    id: 'tt4', title: 'Digital Banking Onboarding — Senior Citizens',
    category: 'Engagement', segment: 'Senior Citizen', effectiveness: 4.4, usageCount: 178,
    content: 'Namaste [Customer Name], this is [RM Name]. We have launched a simplified version of our mobile banking app specially designed for ease of use. I would love to walk you through the basic features during your next branch visit...',
    tags: ['Digital', 'Senior Citizen', 'Onboarding'],
    regulatoryNote: 'Ensure explicit consent for digital channel activation. Follow accessibility guidelines per DPSI Act 2023.'
  },
  {
    id: 'tt5', title: 'Cross-Sell Insurance — Post Loan Disbursement',
    category: 'Cross-Sell', segment: 'Retail', effectiveness: 3.7, usageCount: 423,
    content: 'Congratulations on your [Loan Type] approval, [Customer Name]! To protect your family and ensure loan repayment security, I\'d like to discuss our loan protection insurance plans that offer comprehensive coverage...',
    tags: ['Insurance', 'Cross-Sell', 'Loan'],
    regulatoryNote: 'Insurance is not mandatory for loan approval. Must clearly state this is optional. Follow IRDAI mis-selling prevention guidelines.'
  },
  {
    id: 'tt6', title: 'Salary Account Retention — Corporate Exit',
    category: 'Retention', segment: 'Salaried', effectiveness: 4.1, usageCount: 134,
    content: '[Customer Name], we understand your employer has recently changed their banking partner. We value your relationship with us and would like to offer you our [Premium Account Variant] with zero balance requirements for the next 12 months...',
    tags: ['Salary', 'Retention', 'Corporate'],
    regulatoryNote: 'Any fee waiver commitments must be documented and approved by branch head. Follow circular on account conversion protocols.'
  },
  {
    id: 'tt7', title: 'NRI Services — Repatriation Assistance',
    category: 'Service', segment: 'NRI', effectiveness: 4.5, usageCount: 87,
    content: 'Dear [Customer Name], as your NRI relationship manager, I wanted to inform you about our enhanced repatriation services and the current favorable exchange rates for [Currency]. We can assist with...',
    tags: ['NRI', 'Repatriation', 'Forex'],
    regulatoryNote: 'All repatriation transactions subject to FEMA regulations. Verify LRS limits and obtain Form 15CA/15CB as applicable.'
  },
  {
    id: 'tt8', title: 'Distress Detection — Empathetic Outreach',
    category: 'Distress', segment: 'All', effectiveness: 4.8, usageCount: 56,
    content: '[Customer Name], I\'m [RM Name], your relationship manager. I wanted to personally reach out and let you know that we\'re here to support you. If you\'re facing any financial difficulties, we have several restructuring options and support programs available...',
    tags: ['Distress', 'Empathy', 'Support'],
    regulatoryNote: 'Follow RBI circular on COVID/distress restructuring guidelines. Do not discuss specific debt recovery actions during empathetic outreach.'
  }
];

const ONBOARDING_RMS = [
  {
    id: 'ob1', name: 'Aditya Verma', startDate: '2026-05-01', currentMilestone: 'System Training',
    progress: 35, estimatedAccess: '2026-07-15', branch: 'Rajouri Garden, Delhi',
    milestones: [
      { name: 'HR Onboarding & Documentation', done: true },
      { name: 'Compliance & Regulatory Training', done: true },
      { name: 'System Training (TrustEdge Platform)', done: false, current: true },
      { name: 'SAGE AI Assistant Certification', done: false },
      { name: 'Shadow RM Assignment (2 weeks)', done: false },
      { name: 'Practice Case Simulation', done: false },
      { name: 'Branch Head Sign-off', done: false },
      { name: 'Full Portfolio Access', done: false },
    ]
  },
  {
    id: 'ob2', name: 'Kavya Nair', startDate: '2026-04-15', currentMilestone: 'SAGE Certification',
    progress: 55, estimatedAccess: '2026-06-30', branch: 'Indiranagar, Bengaluru',
    milestones: [
      { name: 'HR Onboarding & Documentation', done: true },
      { name: 'Compliance & Regulatory Training', done: true },
      { name: 'System Training (TrustEdge Platform)', done: true },
      { name: 'SAGE AI Assistant Certification', done: false, current: true },
      { name: 'Shadow RM Assignment (2 weeks)', done: false },
      { name: 'Practice Case Simulation', done: false },
      { name: 'Branch Head Sign-off', done: false },
      { name: 'Full Portfolio Access', done: false },
    ]
  },
  {
    id: 'ob3', name: 'Rahul Tiwari', startDate: '2026-03-20', currentMilestone: 'Practice Cases',
    progress: 78, estimatedAccess: '2026-06-10', branch: 'Civil Lines, Jaipur',
    milestones: [
      { name: 'HR Onboarding & Documentation', done: true },
      { name: 'Compliance & Regulatory Training', done: true },
      { name: 'System Training (TrustEdge Platform)', done: true },
      { name: 'SAGE AI Assistant Certification', done: true },
      { name: 'Shadow RM Assignment (2 weeks)', done: true },
      { name: 'Practice Case Simulation', done: false, current: true },
      { name: 'Branch Head Sign-off', done: false },
      { name: 'Full Portfolio Access', done: false },
    ]
  },
  {
    id: 'ob4', name: 'Ishita Banerjee', startDate: '2026-05-10', currentMilestone: 'HR Onboarding',
    progress: 12, estimatedAccess: '2026-08-01', branch: 'Salt Lake, Kolkata',
    milestones: [
      { name: 'HR Onboarding & Documentation', done: false, current: true },
      { name: 'Compliance & Regulatory Training', done: false },
      { name: 'System Training (TrustEdge Platform)', done: false },
      { name: 'SAGE AI Assistant Certification', done: false },
      { name: 'Shadow RM Assignment (2 weeks)', done: false },
      { name: 'Practice Case Simulation', done: false },
      { name: 'Branch Head Sign-off', done: false },
      { name: 'Full Portfolio Access', done: false },
    ]
  }
];

const PRACTICE_CASES = [
  { id: 'pc1', title: 'FD Maturity — ₹25L Renewal Risk', difficulty: 'Medium', type: 'Retention', completions: 89, avgScore: 78 },
  { id: 'pc2', title: 'HNI Balance Drop — ₹1.2Cr Transfer Out', difficulty: 'Hard', type: 'Risk Mitigation', completions: 45, avgScore: 65 },
  { id: 'pc3', title: 'Senior Citizen Digital Migration', difficulty: 'Easy', type: 'Engagement', completions: 124, avgScore: 85 },
  { id: 'pc4', title: 'Salary Account Corporate Exit', difficulty: 'Medium', type: 'Retention', completions: 67, avgScore: 72 },
  { id: 'pc5', title: 'Distress Call — Loan EMI Default', difficulty: 'Hard', type: 'Distress', completions: 34, avgScore: 58 },
];

// ═══════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════

function ProgressBar({ value, target, alert, label, isDual }) {
  let color = '#10b981';
  if (isDual) {
    if (value < alert || value > 90) color = '#ef4444';
    else if (value < target || value > 85) color = '#f59e0b';
    else color = '#10b981';
  } else {
    if (value < alert) color = '#ef4444';
    else if (value < target) color = '#f59e0b';
    else color = '#10b981';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          {label && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{label}</span>}
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>{value}%</span>
        </div>
        <div style={{ background: 'var(--bg-input)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
          <div style={{
            width: `${Math.min(100, value)}%`, height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            borderRadius: 4, transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
}

function MiniSparkline({ data, color = '#3b82f6', width = 80, height = 24 }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function MetricBadge({ value, target, alert, suffix = '%', invert = false }) {
  let color = '#10b981';
  const numVal = typeof value === 'string' ? parseFloat(value) : value;
  if (invert) {
    if (numVal > alert) color = '#ef4444';
    else if (numVal > target) color = '#f59e0b';
    else color = '#10b981';
  } else {
    if (numVal < alert) color = '#ef4444';
    else if (numVal < target) color = '#f59e0b';
    else color = '#10b981';
  }
  return (
    <span style={{
      fontSize: '0.78rem', fontWeight: 700, color,
      padding: '2px 8px', borderRadius: 6,
      background: `${color}15`
    }}>
      {value}{suffix}
    </span>
  );
}

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} fill={i <= Math.floor(rating) ? '#f59e0b' : 'none'}
          color={i <= Math.floor(rating) ? '#f59e0b' : 'var(--text-muted)'} />
      ))}
      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: 4 }}>{rating.toFixed(1)}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function RMOperationsPage() {
  const [activeTab, setActiveTab] = useState('scorecards');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRM, setExpandedRM] = useState(null);
  const [selectedRM, setSelectedRM] = useState('rm1');
  const [talkTrackSearch, setTalkTrackSearch] = useState('');
  const [talkTrackFilter, setTalkTrackFilter] = useState('All');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [expandedTrack, setExpandedTrack] = useState(null);
  const [expandedOnboarding, setExpandedOnboarding] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(null);
  const [showPromoteModal, setShowPromoteModal] = useState(null);
  const [branchFilter, setBranchFilter] = useState('All');
  const [sortField, setSortField] = useState('caseResolution');
  const [sortDir, setSortDir] = useState('desc');

  const branches = useMemo(() => ['All', ...new Set(MOCK_RMS.map(r => r.branch))], []);
  const categories = ['All', ...new Set(TALK_TRACKS.map(t => t.category))];
  const segments = ['All', ...new Set(TALK_TRACKS.map(t => t.segment))];

  const filteredRMs = useMemo(() => {
    let rms = [...MOCK_RMS];
    if (searchTerm) {
      rms = rms.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.branch.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (branchFilter !== 'All') {
      rms = rms.filter(r => r.branch === branchFilter);
    }
    rms.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
    return rms;
  }, [searchTerm, branchFilter, sortField, sortDir]);

  const filteredTracks = useMemo(() => {
    let tracks = [...TALK_TRACKS];
    if (talkTrackSearch) {
      tracks = tracks.filter(t =>
        t.title.toLowerCase().includes(talkTrackSearch.toLowerCase()) ||
        t.content.toLowerCase().includes(talkTrackSearch.toLowerCase())
      );
    }
    if (talkTrackFilter !== 'All') {
      tracks = tracks.filter(t => t.category === talkTrackFilter);
    }
    if (segmentFilter !== 'All') {
      tracks = tracks.filter(t => t.segment === segmentFilter);
    }
    return tracks;
  }, [talkTrackSearch, talkTrackFilter, segmentFilter]);

  const portfolioData = PORTFOLIO_DATA[selectedRM];
  const selectedRMData = MOCK_RMS.find(r => r.id === selectedRM);

  const overallStats = useMemo(() => {
    const rms = MOCK_RMS;
    return {
      totalRMs: rms.length,
      avgResolution: (rms.reduce((s, r) => s + r.caseResolution, 0) / rms.length).toFixed(1),
      avgConversion: (rms.reduce((s, r) => s + r.conversionRate, 0) / rms.length).toFixed(1),
      belowTarget: rms.filter(r => r.caseResolution < 60 || r.conversionRate < 25).length,
      totalAUM: rms.reduce((s, r) => s + r.aumManaged, 0),
      totalCustomers: rms.reduce((s, r) => s + r.customersManaged, 0)
    };
  }, []);

  const tabs = [
    { key: 'scorecards', label: 'RM Scorecards', icon: Award },
    { key: 'portfolio', label: 'Portfolio Health', icon: PieChartIcon },
    { key: 'talktracks', label: 'Talk Track Library', icon: MessageSquare },
    { key: 'training', label: 'Training & Onboarding', icon: GraduationCap },
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={10} style={{ opacity: 0.3 }} />;
    return sortDir === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />;
  };

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={28} color="var(--accent-blue)" /> RM Operations & Performance
          </h2>
          <p>Relationship Manager scorecards, portfolio health monitoring, talk tracks & onboarding management</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Sync Data
          </button>
          <button className="btn btn-primary btn-sm">
            <FileText size={14} /> Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-card blue">
          <div className="stat-icon blue"><Users size={22} /></div>
          <div className="stat-value">{overallStats.totalRMs}</div>
          <div className="stat-label">Active RMs</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><Target size={22} /></div>
          <div className="stat-value">{overallStats.avgResolution}%</div>
          <div className="stat-label">Avg Resolution Rate</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon purple"><TrendingUp size={22} /></div>
          <div className="stat-value">{overallStats.avgConversion}%</div>
          <div className="stat-label">Avg Conversion Rate</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red"><AlertTriangle size={22} /></div>
          <div className="stat-value">{overallStats.belowTarget}</div>
          <div className="stat-label">RMs Below Target</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><DollarSign size={22} /></div>
          <div className="stat-value">₹{(overallStats.totalAUM / 10000000).toFixed(0)}Cr</div>
          <div className="stat-label">Total AUM Managed</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex', gap: 4, borderBottom: '1px solid var(--border-color)',
        marginBottom: 24, overflowX: 'auto', paddingBottom: 0
      }}>
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                border: 'none', borderBottom: `2px solid ${isActive ? 'var(--accent-blue)' : 'transparent'}`,
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: isActive ? 700 : 500,
                cursor: 'pointer', transition: 'var(--transition)', whiteSpace: 'nowrap'
              }}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 1: RM SCORECARDS */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'scorecards' && (
        <div className="fade-in">
          {/* Filters */}
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" placeholder="Search RM name or branch..."
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: 36 }} />
              </div>
              <select className="form-input" style={{ width: 220 }} value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Filter size={14} /> {filteredRMs.length} RMs shown
              </div>
            </div>
          </div>

          {/* Scorecard Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ minWidth: 180 }}>RM Details</th>
                    <th style={{ cursor: 'pointer', minWidth: 110 }} onClick={() => handleSort('caseResolution')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        Resolution Rate <SortIcon field="caseResolution" />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', minWidth: 110 }} onClick={() => handleSort('conversionRate')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        Conversion <SortIcon field="conversionRate" />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', minWidth: 120 }} onClick={() => handleSort('outcomeRecording')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        Outcome Rec. <SortIcon field="outcomeRecording" />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', minWidth: 110 }} onClick={() => handleSort('aiAcceptance')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        AI Accept <SortIcon field="aiAcceptance" />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', minWidth: 110 }} onClick={() => handleSort('sageHandoff')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        SAGE Handoff <SortIcon field="sageHandoff" />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', minWidth: 100 }} onClick={() => handleSort('callAttempt')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        Call Rate <SortIcon field="callAttempt" />
                      </div>
                    </th>
                    <th style={{ cursor: 'pointer', minWidth: 90 }} onClick={() => handleSort('avgCaseAge')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        Avg Age <SortIcon field="avgCaseAge" />
                      </div>
                    </th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRMs.map(rm => (
                    <Fragment key={rm.id}>
                      <tr onClick={() => setExpandedRM(expandedRM === rm.id ? null : rm.id)}
                        style={{ cursor: 'pointer' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 700, color: 'white', flexShrink: 0
                            }}>
                              {rm.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{rm.name}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rm.branch}</div>
                            </div>
                          </div>
                        </td>
                        <td><ProgressBar value={rm.caseResolution} target={75} alert={60} /></td>
                        <td><ProgressBar value={rm.conversionRate} target={40} alert={25} /></td>
                        <td><ProgressBar value={rm.outcomeRecording} target={90} alert={75} /></td>
                        <td><ProgressBar value={rm.aiAcceptance} target={50} alert={30} isDual /></td>
                        <td><MetricBadge value={rm.sageHandoff} target={80} alert={65} /></td>
                        <td><MetricBadge value={rm.callAttempt} target={95} alert={80} /></td>
                        <td><MetricBadge value={rm.avgCaseAge} target={4} alert={7} suffix="d" invert /></td>
                        <td>
                          <MiniSparkline data={rm.sparkline}
                            color={rm.sparkline[rm.sparkline.length - 1] > rm.sparkline[0] ? '#10b981' : '#ef4444'} />
                        </td>
                      </tr>
                      {expandedRM === rm.id && (
                        <tr style={{ background: 'var(--bg-secondary)', padding: 20 }}>
                          <td colSpan={9} style={{ background: 'var(--bg-secondary)', padding: 20 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                              <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Performance Summary</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Employee ID</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rm.empId}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Cases</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rm.totalCases}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Cases</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: rm.activeCases > 30 ? '#ef4444' : 'var(--text-primary)' }}>{rm.activeCases}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Join Date</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{new Date(rm.joinDate).toLocaleDateString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>
                              <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Portfolio Overview</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Customers</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{rm.customersManaged}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>AUM Managed</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>₹{(rm.aumManaged / 10000000).toFixed(0)} Cr</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg AUM/Customer</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>₹{(rm.aumManaged / rm.customersManaged / 100000).toFixed(1)} L</span>
                                  </div>
                                </div>
                              </div>
                              <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>KPI Targets</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                  <ProgressBar value={rm.caseResolution} target={75} alert={60} label="Resolution >75%" />
                                  <ProgressBar value={rm.conversionRate} target={40} alert={25} label="Conversion >40%" />
                                  <ProgressBar value={rm.outcomeRecording} target={90} alert={75} label="Outcome Rec. >90%" />
                                </div>
                              </div>
                              <div style={{ background: 'var(--bg-card)', borderRadius: 12, padding: 16, border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase' }}>Quick Actions</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                                    <Eye size={14} /> View Full Scorecard
                                  </button>
                                  <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                                    <MessageSquare size={14} /> Send Feedback
                                  </button>
                                  <button className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                                    <Calendar size={14} /> Schedule 1:1 Review
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: '0.75rem', color: 'var(--text-muted)', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981' }} /> Meeting Target
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b' }} /> Below Target
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444' }} /> Below Alert Threshold
            </span>
            <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>Click any RM row to expand detailed scorecard</span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 2: PORTFOLIO HEALTH */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'portfolio' && (
        <div className="fade-in">
          {/* RM Selector */}
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <User size={18} color="var(--accent-blue)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Select RM:</span>
              <select className="form-input" style={{ width: 320 }}
                value={selectedRM} onChange={e => setSelectedRM(e.target.value)}>
                {MOCK_RMS.map(rm => (
                  <option key={rm.id} value={rm.id}>{rm.name} — {rm.branch}</option>
                ))}
              </select>
              {selectedRMData && (
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>EmpID: <strong style={{ color: 'var(--text-primary)' }}>{selectedRMData.empId}</strong></span>
                  <span style={{ color: 'var(--text-muted)' }}>Since: <strong style={{ color: 'var(--text-primary)' }}>{new Date(selectedRMData.joinDate).toLocaleDateString('en-IN')}</strong></span>
                </div>
              )}
            </div>
          </div>

          {portfolioData && (
            <>
              {/* Portfolio Summary Stats */}
              <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 24 }}>
                <div className="stat-card blue">
                  <div className="stat-icon blue"><Users size={20} /></div>
                  <div className="stat-value">{portfolioData.totalCustomers}</div>
                  <div className="stat-label">Total Customers</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon green"><DollarSign size={20} /></div>
                  <div className="stat-value">₹{(portfolioData.totalAUM / 10000000).toFixed(0)}Cr</div>
                  <div className="stat-label">Total AUM</div>
                </div>
                <div className="stat-card red">
                  <div className="stat-icon red"><TrendingDown size={20} /></div>
                  <div className="stat-value">₹{(portfolioData.aumAtRisk / 10000000).toFixed(0)}Cr</div>
                  <div className="stat-label">AUM at Risk This Month</div>
                </div>
                <div className="stat-card yellow">
                  <div className="stat-icon yellow"><AlertCircle size={20} /></div>
                  <div className="stat-value">{portfolioData.noContact.length}</div>
                  <div className="stat-label">No Contact &gt;30 Days</div>
                </div>
              </div>

              {/* Risk Distribution & AUM Trend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
                {/* Pie Chart */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><PieChartIcon size={18} /> Risk Distribution</div>
                  </div>
                  <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={portfolioData.riskDist} dataKey="value" nameKey="name"
                          cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                          paddingAngle={3} stroke="none">
                          {portfolioData.riskDist.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.8rem' }}
                          itemStyle={{ color: 'var(--text-primary)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                    {portfolioData.riskDist.map(r => (
                      <span key={r.name} style={{
                        fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: 4,
                        padding: '2px 8px', borderRadius: 6, background: `${r.color}15`, color: r.color
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                        {r.name}: {r.value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AUM Trend */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><TrendingUp size={18} /> AUM at Risk Trend (₹ Cr)</div>
                  </div>
                  <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={portfolioData.aumTrend}>
                        <defs>
                          <linearGradient id="aumGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} />
                        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} />
                        <Tooltip
                          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.8rem' }}
                          formatter={(value) => [`₹${value} Cr`, 'AUM at Risk']}
                        />
                        <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#aumGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Engagement Gap & FD Maturities */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {/* No Contact */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><AlertTriangle size={18} color="var(--accent-red)" /> Engagement Gap (&gt;30 Days No Contact)</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {portfolioData.noContact.map((c, i) => (
                      <div key={i} style={{
                        background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px',
                        borderLeft: `3px solid ${c.risk === 'Critical' ? '#ef4444' : c.risk === 'High' ? '#f97316' : '#f59e0b'}`
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              AUM: ₹{(c.aum / 100000).toFixed(1)}L · Last Contact: {c.days} days ago
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                            <span className={`badge badge-${c.risk === 'Critical' ? 'red' : c.risk === 'High' ? 'yellow' : 'blue'}`}>{c.risk}</span>
                            <button className="btn btn-primary btn-sm" style={{ fontSize: '0.68rem', padding: '3px 10px' }}>
                              <Phone size={10} /> Initiate Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FD Maturities */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"><Calendar size={18} color="var(--accent-blue)" /> Upcoming FD Maturities (30 Days)</div>
                    <span className="badge badge-blue">{portfolioData.fdMaturities.length} FDs</span>
                  </div>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Maturity</th>
                          <th>Rate</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.fdMaturities.map((fd, i) => (
                          <tr key={i}>
                            <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.82rem' }}>{fd.name}</td>
                            <td style={{ fontWeight: 600 }}>₹{(fd.amount / 100000).toFixed(1)}L</td>
                            <td>{new Date(fd.maturityDate).toLocaleDateString('en-IN')}</td>
                            <td><span className="badge badge-green">{fd.rate}</span></td>
                            <td>
                              <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                                <ArrowRight size={10} /> Retain
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SIP Reviews */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title"><RefreshCw size={18} color="var(--accent-purple)" /> Upcoming SIP Review Dates</div>
                  <span className="badge badge-purple">{portfolioData.sipReviews.length} Reviews</span>
                </div>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>SIP Amount</th>
                        <th>Fund Name</th>
                        <th>Review Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData.sipReviews.map((sip, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sip.name}</td>
                          <td style={{ fontWeight: 600 }}>₹{sip.sipAmount.toLocaleString()}/mo</td>
                          <td>{sip.fundName}</td>
                          <td>{new Date(sip.reviewDate).toLocaleDateString('en-IN')}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-primary btn-sm" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                                <Phone size={10} /> Call
                              </button>
                              <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                                <MessageSquare size={10} /> SMS
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 3: TALK TRACK LIBRARY */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'talktracks' && (
        <div className="fade-in">
          {/* Search & Filters */}
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 250, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" placeholder="Search talk tracks..."
                  value={talkTrackSearch} onChange={e => setTalkTrackSearch(e.target.value)}
                  style={{ paddingLeft: 36 }} />
              </div>
              <select className="form-input" style={{ width: 180 }} value={talkTrackFilter} onChange={e => setTalkTrackFilter(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
              <select className="form-input" style={{ width: 180 }} value={segmentFilter} onChange={e => setSegmentFilter(e.target.value)}>
                {segments.map(s => <option key={s} value={s}>{s === 'All' ? 'All Segments' : s}</option>)}
              </select>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{filteredTracks.length} tracks</span>
            </div>
          </div>

          {/* Talk Track Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredTracks.map(track => (
              <div key={track.id} className="card" style={{ borderLeft: `3px solid ${
                track.category === 'Retention' ? '#3b82f6' :
                track.category === 'Risk Mitigation' ? '#ef4444' :
                track.category === 'Recovery' ? '#f59e0b' :
                track.category === 'Cross-Sell' ? '#10b981' :
                track.category === 'Distress' ? '#8b5cf6' :
                track.category === 'Service' ? '#06b6d4' : '#64748b'
              }` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{track.title}</h3>
                      <span className={`badge badge-${
                        track.category === 'Retention' ? 'blue' :
                        track.category === 'Risk Mitigation' ? 'red' :
                        track.category === 'Recovery' ? 'yellow' :
                        track.category === 'Cross-Sell' ? 'green' :
                        track.category === 'Distress' ? 'purple' : 'blue'
                      }`}>{track.category}</span>
                      <span className="badge badge-blue">{track.segment}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
                      <StarRating rating={track.effectiveness} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Eye size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        {track.usageCount} uses
                      </span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {track.tags.map(tag => (
                          <span key={tag} style={{
                            fontSize: '0.65rem', padding: '2px 6px', borderRadius: 4,
                            background: 'var(--bg-input)', color: 'var(--text-muted)'
                          }}>#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowTemplateModal(track.id)}
                      title="Save as Template">
                      <BookmarkPlus size={14} /> Save Template
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowPromoteModal(track.id)}
                      title="Promote to Branch Standard">
                      <Megaphone size={14} /> Promote
                    </button>
                  </div>
                </div>

                {/* Expandable content */}
                <div>
                  <button onClick={() => setExpandedTrack(expandedTrack === track.id ? null : track.id)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent-blue)',
                      fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 4, padding: 0, marginBottom: 8
                    }}>
                    {expandedTrack === track.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expandedTrack === track.id ? 'Hide Script' : 'View Script'}
                  </button>
                  {expandedTrack === track.id && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                      <div style={{
                        background: 'var(--bg-secondary)', borderRadius: 10, padding: 16, marginBottom: 12,
                        fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7,
                        fontStyle: 'italic', borderLeft: '3px solid var(--accent-blue)'
                      }}>
                        "{track.content}"
                      </div>
                      <div style={{
                        background: 'rgba(245, 158, 11, 0.08)', borderRadius: 8, padding: 12,
                        borderLeft: '3px solid var(--accent-yellow)', display: 'flex', alignItems: 'flex-start', gap: 8
                      }}>
                        <Shield size={16} color="var(--accent-yellow)" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-yellow)', marginBottom: 4 }}>
                            REGULATORY COMPLIANCE NOTE
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{track.regulatoryNote}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button className="btn btn-secondary btn-sm">
                          <Copy size={12} /> Copy Script
                        </button>
                        <button className="btn btn-secondary btn-sm">
                          <ThumbsUp size={12} /> Rate Effective
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Regulatory Snippets Section */}
          <div className="card" style={{ marginTop: 24, borderTop: '2px solid var(--accent-yellow)' }}>
            <div className="card-header">
              <div className="card-title"><Shield size={18} color="var(--accent-yellow)" /> Mandated Regulatory Language Snippets</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
              {[
                { title: 'Mutual Fund Disclaimer', text: 'Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing.', source: 'SEBI' },
                { title: 'Insurance Disclaimer', text: 'Insurance is the subject matter of solicitation. IRDAI Registration No. [XXX]. This is not a guaranteed returns product.', source: 'IRDAI' },
                { title: 'Loan Protection Clarification', text: 'Availing insurance cover is not mandatory for sanction/disbursement of loan. Your loan application will not be affected if you choose not to subscribe.', source: 'RBI' },
                { title: 'KYC Compliance', text: 'KYC is one-time exercise while dealing in securities markets. Once KYC is done through a SEBI registered intermediary, no need to undergo the process again.', source: 'SEBI' },
              ].map((snippet, i) => (
                <div key={i} style={{
                  background: 'var(--bg-secondary)', borderRadius: 10, padding: 14,
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{snippet.title}</span>
                    <span className="badge badge-yellow">{snippet.source}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{snippet.text}</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 8, fontSize: '0.68rem' }}>
                    <Copy size={10} /> Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* TAB 4: TRAINING & ONBOARDING */}
      {/* ═══════════════════════════════════════════ */}
      {activeTab === 'training' && (
        <div className="fade-in">
          {/* Onboarding Tracker Table */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><GraduationCap size={18} color="var(--accent-blue)" /> New RM Onboarding Tracker</div>
              <span className="badge badge-blue">{ONBOARDING_RMS.length} In Progress</span>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>RM Name</th>
                    <th>Branch</th>
                    <th>Start Date</th>
                    <th>Current Milestone</th>
                    <th>Progress</th>
                    <th>Est. Full Access</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ONBOARDING_RMS.map(rm => (
                    <Fragment key={rm.id}>
                      <tr style={{ cursor: 'pointer' }}
                        onClick={() => setExpandedOnboarding(expandedOnboarding === rm.id ? null : rm.id)}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--accent-green), var(--accent-cyan))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.7rem', fontWeight: 700, color: 'white'
                            }}>
                              {rm.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{rm.name}</span>
                          </div>
                        </td>
                        <td>{rm.branch}</td>
                        <td>{new Date(rm.startDate).toLocaleDateString('en-IN')}</td>
                        <td>
                          <span className="badge badge-blue">{rm.currentMilestone}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, background: 'var(--bg-input)', borderRadius: 4, height: 8, overflow: 'hidden', minWidth: 80 }}>
                              <div style={{
                                width: `${rm.progress}%`, height: '100%',
                                background: rm.progress > 70 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                                  rm.progress > 40 ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' :
                                    'linear-gradient(90deg, #f59e0b, #fbbf24)',
                                borderRadius: 4, transition: 'width 0.5s ease'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', minWidth: 35 }}>{rm.progress}%</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{new Date(rm.estimatedAccess).toLocaleDateString('en-IN')}</td>
                        <td>
                          <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.7rem' }}>
                            {expandedOnboarding === rm.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />} Milestones
                          </button>
                        </td>
                      </tr>
                      {expandedOnboarding === rm.id && (
                        <tr key={`${rm.id}-milestones`}>
                          <td colSpan={7} style={{ background: 'var(--bg-secondary)', padding: 20 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                              Onboarding Milestones — {rm.name}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
                              {rm.milestones.map((m, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', position: 'relative' }}>
                                  {/* Vertical connector line */}
                                  {i < rm.milestones.length - 1 && (
                                    <div style={{
                                      position: 'absolute', left: 12, top: 30, bottom: -10,
                                      width: 2, background: m.done ? '#10b981' : 'var(--border-color)'
                                    }} />
                                  )}
                                  {/* Step indicator */}
                                  <div style={{
                                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', zIndex: 1,
                                    background: m.done ? '#10b981' : m.current ? 'var(--accent-blue)' : 'var(--bg-card)',
                                    border: `2px solid ${m.done ? '#10b981' : m.current ? 'var(--accent-blue)' : 'var(--border-strong)'}`,
                                    ...(m.current ? { boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)', animation: 'voicePulse 2s ease-in-out infinite' } : {})
                                  }}>
                                    {m.done ? <CheckCircle size={14} color="white" /> :
                                      m.current ? <Zap size={12} color="white" /> :
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{i + 1}</span>}
                                  </div>
                                  <span style={{
                                    fontSize: '0.82rem',
                                    color: m.done ? '#10b981' : m.current ? 'var(--accent-blue)' : 'var(--text-muted)',
                                    fontWeight: m.current ? 700 : m.done ? 600 : 400,
                                    textDecoration: m.done ? 'line-through' : 'none'
                                  }}>
                                    {m.name}
                                    {m.current && <span style={{ marginLeft: 8, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue)' }}>IN PROGRESS</span>}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Practice Cases & Simulations */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title"><PlayCircle size={18} color="var(--accent-purple)" /> Simulated Practice Cases</div>
              <button className="btn btn-primary btn-sm"><Zap size={14} /> Create New Scenario</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {PRACTICE_CASES.map(pc => (
                <div key={pc.id} style={{
                  background: 'var(--bg-secondary)', borderRadius: 12, padding: 18,
                  border: '1px solid var(--border-color)', transition: 'var(--transition)',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1, marginRight: 8 }}>{pc.title}</h4>
                    <span className={`badge badge-${pc.difficulty === 'Easy' ? 'green' : pc.difficulty === 'Medium' ? 'yellow' : 'red'}`}>
                      {pc.difficulty}
                    </span>
                  </div>
                  <span className="badge badge-purple" style={{ marginBottom: 10, display: 'inline-flex' }}>{pc.type}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    <span>{pc.completions} completions</span>
                    <span>Avg Score: <strong style={{ color: pc.avgScore >= 75 ? '#10b981' : pc.avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>{pc.avgScore}%</strong></span>
                  </div>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: 12 }}>
                    <PlayCircle size={14} /> Start Simulation
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Tracker Summary */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><BarChart3 size={18} color="var(--accent-green)" /> Onboarding Progress Summary</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {ONBOARDING_RMS.map(rm => (
                <div key={rm.id} style={{
                  background: 'var(--bg-secondary)', borderRadius: 12, padding: 16,
                  border: '1px solid var(--border-color)', textAlign: 'center'
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px',
                    background: `conic-gradient(${rm.progress > 70 ? '#10b981' : rm.progress > 40 ? '#3b82f6' : '#f59e0b'} ${rm.progress * 3.6}deg, var(--bg-input) 0deg)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)'
                    }}>
                      {rm.progress}%
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 4 }}>{rm.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rm.currentMilestone}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Day {Math.floor((new Date() - new Date(rm.startDate)) / 86400000)} of Onboarding
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ═══════════════════════════════════════════ */}

      {/* Save Template Modal */}
      {showTemplateModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setShowTemplateModal(null)} />
          <div style={{
            position: 'relative', width: 480, background: 'rgba(26, 32, 53, 0.95)',
            backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>💾 Save as Template</h3>
              <button onClick={() => setShowTemplateModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Template Name</label>
              <input className="form-input" defaultValue={TALK_TRACKS.find(t => t.id === showTemplateModal)?.title || ''} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input">
                <option>Retention</option>
                <option>Recovery</option>
                <option>Cross-Sell</option>
                <option>Engagement</option>
                <option>Service</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows={3} placeholder="Add internal notes about this template..." />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowTemplateModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowTemplateModal(null); }}>
                <BookmarkPlus size={16} /> Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promote Modal */}
      {showPromoteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} onClick={() => setShowPromoteModal(null)} />
          <div style={{
            position: 'relative', width: 480, background: 'rgba(26, 32, 53, 0.95)',
            backdropFilter: 'blur(20px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: 28
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📢 Promote to Branch Standard</h3>
              <button onClick={() => setShowPromoteModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.08)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                This will make the talk track available to all RMs in the selected branches as a recommended standard approach.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Select Branches</label>
              <select className="form-input" multiple style={{ height: 100 }}>
                {branches.filter(b => b !== 'All').map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Effective From</label>
              <input className="form-input" type="date" defaultValue="2026-06-01" />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowPromoteModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowPromoteModal(null); }}>
                <Megaphone size={16} /> Promote to Standard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
