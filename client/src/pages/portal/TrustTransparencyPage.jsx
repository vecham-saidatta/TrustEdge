import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PORTAL_TRANSLATIONS } from '../../translations';
import {
    BookOpen, ChevronDown, ChevronUp, MessageSquare, Globe, Search,
    Landmark, CreditCard, TrendingUp, Percent, FileText, Shield, Scale, Award
} from 'lucide-react';
import './customer-portal.css';

const ARTICLES = [
    {
        id: 'a1', icon: Landmark, color: '#3b82f6',
        title: 'How interest on FDs is calculated',
        summary: 'Understand simple vs compound interest and how your FD earnings are computed.',
        content: `When you open a Fixed Deposit, the bank pays you interest on your deposited amount. Here's how it works:

**Simple Interest (rare for FDs)**
Interest = Principal × Rate × Time
Example: ₹1,00,000 at 7% for 1 year = ₹1,00,000 × 0.07 × 1 = ₹7,000

**Compound Interest (most common — quarterly compounding)**
Most banks compound interest quarterly. This means every 3 months, the interest earned is added to your principal, and the next quarter's interest is calculated on this new amount.

Example: ₹1,00,000 at 7% p.a., compounded quarterly for 1 year:
- Quarter 1: ₹1,00,000 × 7%/4 = ₹1,750 → Balance: ₹1,01,750
- Quarter 2: ₹1,01,750 × 7%/4 = ₹1,781 → Balance: ₹1,03,531
- Quarter 3: ₹1,03,531 × 7%/4 = ₹1,812 → Balance: ₹1,05,343
- Quarter 4: ₹1,05,343 × 7%/4 = ₹1,843 → Balance: ₹1,07,186

Total interest earned: ₹7,186 (vs ₹7,000 with simple interest)

**Key Points:**
- Senior citizens usually get 0.25% to 0.50% extra
- Premature withdrawal typically costs 1% penalty on applicable rate
- TDS (Tax Deducted at Source) applies if interest exceeds ₹40,000/year (₹50,000 for senior citizens)`
    },
    {
        id: 'a2', icon: CreditCard, color: '#ef4444',
        title: 'What affects my credit score',
        summary: 'Learn the 5 factors that determine your CIBIL score and how to improve it.',
        content: `Your credit score (CIBIL score) ranges from 300 to 900. A score above 750 is considered good. Here's what affects it:

**1. Payment History (35% weightage)**
- Paying EMIs and credit card bills on time is the single biggest factor
- Even one missed payment can drop your score by 50-100 points
- Tip: Set up auto-debit for EMIs

**2. Credit Utilization (30% weightage)**
- This is how much of your credit limit you're using
- Using more than 30% of your credit card limit hurts your score
- Example: If your limit is ₹1,00,000, try to keep usage below ₹30,000

**3. Credit History Length (15% weightage)**
- Longer credit history = better score
- Don't close old credit cards — they help your average account age

**4. Credit Mix (10% weightage)**
- Having a mix of secured (home loan) and unsecured (credit card, personal loan) credit is beneficial

**5. New Credit Inquiries (10% weightage)**
- Too many loan applications in a short period signals desperation
- Each hard inquiry can temporarily reduce your score by 5-10 points

**How to check your score:** You can check your CIBIL score for free once a year at cibil.com. This "soft inquiry" does not affect your score.`
    },
    {
        id: 'a3', icon: TrendingUp, color: '#10b981',
        title: 'How SIP returns are calculated',
        summary: 'Understand NAV, units, XIRR, and why SIP returns differ from lump sum returns.',
        content: `A Systematic Investment Plan (SIP) invests a fixed amount every month into a mutual fund. Here's how returns work:

**How SIP Works:**
Each month, your ₹5,000 buys units at the current NAV (Net Asset Value):
- January: NAV ₹400 → 12.5 units
- February: NAV ₹380 → 13.16 units (you get MORE units when market dips!)
- March: NAV ₹420 → 11.9 units

This is called "rupee cost averaging" — you automatically buy more when prices are low and less when prices are high.

**Calculating Your Return:**
After 12 months, if you invested ₹60,000 and your total units are worth ₹68,200:
- Absolute Return = (₹68,200 - ₹60,000) / ₹60,000 = 13.7%
- But this isn't accurate because each installment was invested at different times

**XIRR (Extended Internal Rate of Return):**
This is the correct way to measure SIP returns. It accounts for the fact that each ₹5,000 was invested on a different date.

**Important:** Past performance does not guarantee future returns. SIPs are subject to market risk. The advantage of SIP is discipline and rupee cost averaging, not guaranteed returns.

**Real example from your portfolio:**
Your HDFC Nifty 50 SIP of ₹5,000/month for 12 months:
- Total invested: ₹60,000
- Current value: ₹68,200
- Absolute return: +₹8,200 (+13.7%)`
    },
    {
        id: 'a4', icon: Percent, color: '#f59e0b',
        title: 'What is a floating interest rate and what does RBI rate mean for you',
        summary: 'Understand how RBI repo rate affects your home loan EMI.',
        content: `**Fixed vs Floating Rate:**
- Fixed Rate: Your interest rate stays the same throughout the loan tenure (e.g., 13.5% for your Personal Loan)
- Floating Rate: Your interest rate changes based on market conditions (e.g., 8.5% for your Home Loan)

**RBI Repo Rate:**
The Reserve Bank of India sets a "repo rate" — the rate at which banks borrow from RBI. Currently: 6.50%

When RBI increases the repo rate → your bank's cost of funds goes up → your floating rate EMI may increase
When RBI decreases the repo rate → your floating rate EMI may decrease

**How it affects you:**
Your Home Loan is at 8.5% floating rate. This is typically structured as:
Rate = Bank's Spread + Repo Rate = 2.0% + 6.5% = 8.5%

If RBI reduces repo rate by 0.25% to 6.25%:
New Rate = 2.0% + 6.25% = 8.25%
Your EMI would reduce from ₹16,200 to approximately ₹15,900 — saving ₹300/month or ₹3,600/year.

**Key Points:**
- Floating rate changes are not immediate — banks typically revise every quarter
- You can switch from floating to fixed (and vice versa) — but there may be a conversion fee
- RBI announces rate decisions 6 times a year`
    },
    {
        id: 'a5', icon: FileText, color: '#8b5cf6',
        title: 'Understanding TDS on FD interest',
        summary: 'Know when TDS applies, how to claim refund, and Form 15G/15H.',
        content: `**What is TDS on FD?**
Tax Deducted at Source (TDS) is tax that the bank deducts from your FD interest before paying you.

**When is TDS deducted?**
- If your total FD interest exceeds ₹40,000 in a financial year (April to March)
- For senior citizens (60+): The limit is ₹50,000
- TDS rate: 10% (if PAN is provided), 20% (if PAN is not provided)

**Your situation:**
Your FDs earn approximately ₹12,840 per year in interest. Since this is below ₹40,000, no TDS will be deducted currently.

**Form 15G / 15H:**
If your total income is below the taxable limit (₹2.5 lakh for under-60, ₹3 lakh for 60-80, ₹5 lakh for 80+), you can submit Form 15G (or 15H for senior citizens) to the bank to avoid TDS deduction altogether.

**If TDS is deducted:**
- It's NOT an additional tax — it's advance tax payment
- You can claim it back when filing your Income Tax Return
- You'll receive a TDS certificate (Form 16A) from the bank

**Download your TDS certificate:** You can download Form 16A from the Products → Fixed Deposits section.`
    },
    {
        id: 'a6', icon: BookOpen, color: '#06b6d4',
        title: 'How to read your account statement',
        summary: 'A guide to understanding every column in your bank statement.',
        content: `Your account statement contains these columns:

**Date:** The date the transaction was processed (not necessarily when you initiated it)

**Description/Narration:** What the transaction was. Examples:
- "NEFT/IN/ABC123" = Money received via NEFT, reference ABC123
- "UPI/DR/priya@upi" = UPI debit to priya@upi
- "ATM/CASH/WDR" = ATM cash withdrawal
- "EMI/SBI HOME/LN123" = Home loan EMI auto-debit

**Debit (Dr):** Money going OUT of your account
**Credit (Cr):** Money coming INTO your account
**Balance:** Your account balance AFTER this transaction

**Common abbreviations:**
- NEFT: National Electronic Funds Transfer (free, takes 30 min to 2 hours)
- RTGS: Real Time Gross Settlement (for amounts ≥ ₹2 lakh, instant)
- IMPS: Immediate Payment Service (instant, 24/7)
- UPI: Unified Payments Interface
- DR: Debit | CR: Credit
- CHQ: Cheque | CLG: Clearing

**Tips:**
- Check your statement monthly — report discrepancies within 30 days
- Look for unauthorized transactions, especially small test charges
- Recurring debits should match your known EMIs, SIPs, and subscriptions`
    },
    {
        id: 'a7', icon: Shield, color: '#10b981',
        title: 'What deposit insurance covers (DICGC — ₹5 Lakh guarantee)',
        summary: 'Your deposits are insured up to ₹5 Lakh by the Government of India.',
        content: `**What is DICGC?**
Deposit Insurance and Credit Guarantee Corporation (DICGC) is a subsidiary of the Reserve Bank of India. It insures your bank deposits.

**Coverage:**
- Maximum insurance: ₹5,00,000 per depositor per bank
- This covers: Savings accounts + Current accounts + Fixed Deposits + Recurring Deposits
- The ₹5 Lakh limit includes both principal and interest

**Your coverage:**
With total deposits of approximately ₹4,84,320 across your accounts at this bank, you are within the ₹5 Lakh limit and fully covered.

**What this means:**
If (hypothetically) this bank were to fail, DICGC would pay you up to ₹5,00,000 within 90 days.

**Important details:**
- Insurance is per depositor, per bank — if you have accounts at 2 different banks, you get ₹5 Lakh coverage at each
- Joint accounts are treated separately from individual accounts
- NRI deposits are also covered
- The insurance premium is paid by the bank, not by you

**Note:** Indian banking is one of the most regulated systems in the world. Bank failures are extremely rare. The last major bank rescue (Yes Bank, 2020) was managed by RBI with zero depositor losses.`
    },
    {
        id: 'a8', icon: Scale, color: '#f97316',
        title: 'Your rights as a bank customer',
        summary: 'Know your rights under RBI\'s Customer Charter and how to escalate complaints.',
        content: `As a bank customer in India, you have several rights protected by RBI:

**1. Right to Fair Treatment**
- Banks cannot discriminate based on gender, caste, religion, or disability
- Loan rejection must be communicated with reasons in writing

**2. Right to Transparency**
- All charges, fees, and penalties must be disclosed upfront
- Interest rate changes on loans must be communicated before implementation
- No hidden charges on any product

**3. Right to Privacy**
- Banks cannot share your data with third parties without your consent
- Marketing calls/SMS can be stopped by registering on DND (Do Not Disturb)

**4. Right to Grievance Redressal**
Escalation path:
Step 1: Complain to your branch/bank → Response within 30 days
Step 2: If unsatisfied → RBI Banking Ombudsman (free, online at cms.rbi.org.in)
Step 3: If still unsatisfied → Appellate Authority at RBI
Step 4: Consumer court / Banking court

**5. Right to Banking Services**
- No-frills accounts (Basic Savings Bank Deposit Account) — zero minimum balance
- Free services: NEFT/RTGS, cheque book (first 10 cheques), passbook

**6. Right to Compensation**
- For unauthorized electronic transactions: Zero liability if reported within 3 days
- For delayed credit of NEFT/RTGS: ₹100/day penalty to the bank

**Your TrustEdge complaint portal:** All complaints filed through our Support section follow these timelines and escalation paths.`
    }
];

export default function TrustTransparencyPage() {
    const navigate = useNavigate();
    const { customerLang } = useOutletContext();
    const t = PORTAL_TRANSLATIONS[customerLang] || PORTAL_TRANSLATIONS.EN;

    const [expandedArticle, setExpandedArticle] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState(customerLang === 'HI' ? 'हिंदी' : 'EN');

    useEffect(() => {
        setLanguage(customerLang === 'HI' ? 'हिंदी' : 'EN');
    }, [customerLang]);

    const getArticleTitle = (id, title, lang) => {
        if (lang === 'हिंदी') {
            switch (id) {
                case 'a1': return 'एफडी (FD) पर ब्याज की गणना कैसे की जाती है';
                case 'a2': return 'मेरे क्रेडिट स्कोर को क्या प्रभावित करता है';
                case 'a3': return 'एसआईपी (SIP) रिटर्न की गणना कैसे की जाती है';
                case 'a4': return 'फ्लोटिंग ब्याज दर क्या है और आरबीआई दर का आपके लिए क्या अर्थ है';
                case 'a5': return 'एफडी ब्याज पर टीडीएस (TDS) को समझना';
                case 'a6': return 'अपने खाते का विवरण (Statement) कैसे पढ़ें';
                case 'a7': return 'जमा बीमा क्या कवर करता है (DICGC — ₹5 लाख की गारंटी)';
                case 'a8': return 'एक बैंक ग्राहक के रूप में आपके अधिकार';
                default: return title;
            }
        }
        return title;
    };

    const getArticleSummary = (id, summary, lang) => {
        if (lang === 'हिंदी') {
            switch (id) {
                case 'a1': return 'साधारण बनाम चक्रवृद्धि ब्याज और आपकी एफडी कमाई की गणना कैसे की जाती है, इसे समझें।';
                case 'a2': return 'आपके सिबिल (CIBIL) स्कोर को निर्धारित करने वाले 5 कारकों और इसे सुधारने के तरीके के बारे में जानें।';
                case 'a3': return 'एनएवी (NAV), यूनिट्स, एक्सआईआरआर (XIRR) को समझें और जानें कि एसआईपी रिटर्न एकमुश्त रिटर्न से अलग क्यों होता है।';
                case 'a4': return 'समझें कि आरबीआई रेपो दर आपके गृह ऋण ईएमआई को कैसे प्रभावित करती है।';
                case 'a5': return 'जानें कि टीडीएस कब लागू होता है, रिफंड का दावा कैसे करें, और फॉर्म 15G/15H क्या है।';
                case 'a6': return 'आपके बैंक विवरण में प्रत्येक कॉलम को समझने के लिए एक गाइड।';
                case 'a7': return 'भारत सरकार द्वारा आपकी जमा राशि का ₹5 लाख तक का बीमा किया जाता है।';
                case 'a8': return 'आरबीआई के ग्राहक चार्टर के तहत अपने अधिकारों और शिकायतों को आगे बढ़ाने के तरीके को जानें।';
                default: return summary;
            }
        }
        return summary;
    };

    const filtered = ARTICLES.filter(a => {
        const titleMatch = getArticleTitle(a.id, a.title, language).toLowerCase().includes(searchQuery.toLowerCase());
        const summaryMatch = getArticleSummary(a.id, a.summary, language).toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || summaryMatch;
    });

    return (
        <div className="fade-in">
            <div className="page-header">
                <h2>{t.trustTitle}</h2>
                <p>{t.trustSubtitle}</p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={customerLang === 'HI' ? 'विषय खोजें...' : 'Search topics...'}
                        className="form-input" style={{ paddingLeft: 36 }} />
                </div>
                <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: 3, borderRadius: 8 }}>
                    {['EN', 'हिंदी'].map(lang => (
                        <button key={lang} onClick={() => setLanguage(lang)} style={{
                            padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                            background: language === lang ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                            color: language === lang ? 'white' : 'var(--text-muted)',
                            fontWeight: 600, fontSize: '0.78rem', fontFamily: 'inherit',
                        }}>{lang}</button>
                    ))}
                </div>
            </div>

            {/* No product placement notice */}
            <div style={{ padding: '10px 16px', background: 'rgba(16,185,129,0.06)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)', marginBottom: 20, fontSize: '0.78rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} /> {customerLang === 'HI' ? 'ये लेख केवल शैक्षणिक हैं। कोई उत्पाद प्लेसमेंट नहीं, कोई अपसेलिंग नहीं — बस ईमानदार वित्तीय साक्षरता।' : 'These articles are purely educational. No product placement, no upselling — just honest financial literacy.'}
            </div>

            {/* Articles */}
            {filtered.map((article, i) => {
                const AIcon = article.icon;
                const isExpanded = expandedArticle === article.id;
                return (
                    <div key={article.id} className="card" style={{
                        marginBottom: 12, cursor: 'pointer', borderLeft: `4px solid ${article.color}`,
                        animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
                    }} onClick={() => setExpandedArticle(isExpanded ? null : article.id)}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${article.color}20`, color: article.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <AIcon size={20} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 2 }}>📘 {getArticleTitle(article.id, article.title, language)}</h3>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{getArticleSummary(article.id, article.summary, language)}</p>
                                </div>
                            </div>
                            {isExpanded ? <ChevronUp size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronDown size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                        </div>

                        {isExpanded && (
                            <div onClick={e => e.stopPropagation()} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                    {article.content.split('\n').map((line, li) => {
                                        if (line.startsWith('**') && line.endsWith('**')) {
                                            return <div key={li} style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 12, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>;
                                        }
                                        if (line.startsWith('- ')) {
                                            return <div key={li} style={{ paddingLeft: 16, position: 'relative' }}><span style={{ position: 'absolute', left: 4 }}>•</span>{line.substring(2)}</div>;
                                        }
                                        return <div key={li}>{line}</div>;
                                    })}
                                </div>
                                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                                    <button onClick={() => navigate('/portal/sage')} className="btn btn-secondary btn-sm"><MessageSquare size={14} /> {t.askSage}</button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
