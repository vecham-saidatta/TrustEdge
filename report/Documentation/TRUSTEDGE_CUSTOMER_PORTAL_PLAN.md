# TrustEdge Customer Portal — Enterprise Strategy & Implementation Plan
## Production-Ready Customer Experience Redesign
### Version 4.0 · For Engineering & Product Implementation

---

## Table of Contents

1. [Strategic Overview & Gap Analysis](#1-strategic-overview--gap-analysis)
2. [Customer Segmentation & Persona Architecture](#2-customer-segmentation--persona-architecture)
3. [Customer Portal Navigation & Information Architecture](#3-customer-portal-navigation--information-architecture)
4. [Home Dashboard — Redesigned](#4-home-dashboard--redesigned)
5. [SAGE AI Assistant — Full Redesign](#5-sage-ai-assistant--full-redesign)
6. [Financial Health & Insights Engine](#6-financial-health--insights-engine)
7. [Products & Portfolio Management](#7-products--portfolio-management)
8. [Goal Planning & Savings Engine](#8-goal-planning--savings-engine)
9. [Stress Detection & Support System](#9-stress-detection--support-system)
10. [Outreach & Offer Experience](#10-outreach--offer-experience)
11. [Notifications & Communication Preferences](#11-notifications--communication-preferences)
12. [Multilingual & Accessibility Experience](#12-multilingual--accessibility-experience)
13. [Complaint & Support Lifecycle](#13-complaint--support-lifecycle)
14. [Trust & Transparency Layer](#14-trust--transparency-layer)
15. [Security & Privacy Controls](#15-security--privacy-controls)
16. [Mobile Experience Strategy](#16-mobile-experience-strategy)
17. [Feature Rationalization Matrix](#17-feature-rationalization-matrix)
18. [Customer Data Architecture](#18-customer-data-architecture)
19. [Customer UX Principles](#19-customer-ux-principles)
20. [Implementation Phasing](#20-implementation-phasing)

---

## 1. Strategic Overview & Gap Analysis

### 1.1 What the Current Customer Strategy Gets Right

The original TrustEdge document defines strong intentions for the customer-facing experience:
- SAGE as a friendly, non-judgmental financial companion
- Empathy-first conversational tone ("friendly older sibling")
- No predatory upselling or hidden commissions
- Regional language support (Hindi, Telugu)
- Speech-to-Text for voice input
- Isolated inline translation without global UI disruption
- Offline fallback dictionary for demo stability
- Indian-context financial analogies and Rupee-first framing

These intentions are philosophically correct. However, the current strategy **defines what SAGE is philosophically but almost nothing about what the customer actually experiences end-to-end**. There is effectively no customer portal strategy — only a chatbot strategy. This is the central gap.

### 1.2 Critical Gaps Identified

#### Experience Gaps
- **No customer home screen**: There is no specification of what a customer sees when they log in. The entire customer UX is a chatbot and nothing else.
- **No financial dashboard**: Customers have no view of their own balances, transactions, products, or financial health in TrustEdge. They are expected to go to the CBS/core banking app for that and come to SAGE only for advice. This creates a disconnected experience.
- **No product awareness surface**: Customers cannot browse or compare products without asking SAGE. If they do not know what to ask, they miss relevant offerings entirely.
- **No goal-setting or planning tools**: SAGE talks about saving and budgeting but there is no tool that makes these actionable — no goal tracker, no budget planner, no savings target.
- **No offer/campaign inbox**: When TRUTH delivers an outreach message (WhatsApp, SMS, in-app nudge), the customer has no portal-based surface to view, compare, and respond to these offers deliberately.
- **No complaint management for customers**: Customers can talk to SAGE but cannot log, track, or escalate a formal complaint from the portal.
- **No notification center**: Customers receive alerts via external channels (SMS, WhatsApp) but have no in-portal notification history.
- **No self-service controls**: Customers cannot set communication preferences, mute alerts, update their profile, or control how the bank contacts them.

#### SAGE-Specific Gaps
- **Single conversation mode only**: SAGE is described as a single chat interface. There is no conversation history, session resumption, or context continuity between sessions.
- **No proactive nudges from SAGE**: SAGE only responds when the customer speaks. It never initiates a check-in, celebrates a milestone, or surfaces a relevant insight proactively.
- **No topic quick-starts**: Customers arriving at SAGE face a blank chat. Many real users — especially first-time or low-digital-literacy users — do not know what to type. There are no suggested prompts or guided flows.
- **Voice input but no voice output**: Speech-to-Text exists, but SAGE always responds in text. For rural or low-literacy users who benefit most from voice, this is an incomplete experience.
- **Translation is isolated to bubbles**: While architecturally correct, there is no persistent language preference. Every session starts in English, requiring customers to re-translate every visit.
- **No feedback beyond binary thumbs**: The "Helpful / Not Helpful" signal is too coarse. Customers cannot explain why a response was not helpful, which limits SAGE's improvement.

#### Trust & Transparency Gaps
- **No explanation of AI involvement**: Customers interact with SAGE without knowing it is AI, what data it uses, or how to opt out.
- **No product comparison tool**: TRUTH is described as comparing products "side-by-side with national benchmarks" but this is only described from the bank's internal perspective — customers never see a transparent comparison.
- **No consent management**: Customers cannot see what data the bank is using about them, cannot withdraw consent for AI-driven profiling, and cannot request data deletion.
- **No explanation of outreach**: When a customer receives an SMS or WhatsApp about a product, they have no way to understand why they were targeted or what the basis is.

#### Stress & Wellbeing Gaps
- **Stress detection with no customer-facing response**: The system detects financial stress and fires internal alerts to RMs — but the customer experiencing the stress receives nothing proactively helpful from the platform itself. The customer is the subject of internal action but not a participant in their own resolution.
- **NPA risk modeled but no preemptive customer support**: Customers heading toward loan default receive no early warning, no restructuring option surfaced proactively, no empathetic outreach at the right moment.

---

## 2. Customer Segmentation & Persona Architecture

### 2.1 Why Segmentation Drives UX Design

Different customer types use banking software in fundamentally different ways. A single interface designed for the average user serves everyone poorly. TrustEdge must adapt its customer portal experience based on persona signals.

### 2.2 Primary Customer Personas

**Persona 1: The Urban Professional (Salary Account Holder)**
- Age 25–40, English-comfortable, smartphone-first
- Primary concern: investment optimization, tax saving, building wealth
- Behavior: Active mobile banking, checks app daily, compares interest rates
- What they need from TrustEdge: Proactive investment nudges, FD rate comparisons, SIP recommendations, tax-saving alerts before March 31
- Language: English primary, no translation needed
- Voice: Uses text, does not use voice input
- Key risk: Migrating savings to neobanks or private sector for better digital experience

**Persona 2: The Rural/Semi-Urban Depositor**
- Age 35–60, Hindi/Telugu primary, lower digital literacy
- Primary concern: Safety of deposits, knowing their balance, basic banking
- Behavior: Visits branch occasionally, uses basic mobile banking, family-assisted app usage
- What they need: Simple Hindi/Telugu interface, voice input and output, jargon-free explanations, branch appointment booking
- Language: Hindi or Telugu primary
- Voice: Benefits from both voice input AND voice output
- Key risk: Disengagement due to language and literacy barriers, migration to cooperative banks or informal savings

**Persona 3: The Small Business Owner**
- Age 30–55, mixed digital literacy, current account holder
- Primary concern: Working capital, loan access, EMI management, cash flow
- Behavior: Irregular banking patterns, large transactions, multiple accounts
- What they need: Cash flow visibility, EMI reminders, loan restructuring options, business loan eligibility view
- Language: English or regional, based on geography
- Key risk: NPA, switching to private bank for business loan products

**Persona 4: The Senior Citizen / Pensioner**
- Age 60+, pension account holder, conservative saver
- Primary concern: FD safety, pension credit confirmation, family-linked access
- Behavior: Branch-first, low digital confidence, large FD holdings
- What they need: High-contrast simple UI, large fonts, appointment booking, nominee management, inheritance clarity
- Language: Regional primary
- Key risk: FD migration, nominee disputes, vulnerability to financial fraud

**Persona 5: The Financially Stressed Customer**
- Any age, experiencing income disruption, mounting EMIs, or debt stress
- Primary concern: Getting help without judgment, restructuring options, understanding their situation
- Behavior: Reduced app engagement, irregular payments, seeking alternatives
- What they need: Non-judgmental financial guidance, restructuring options surfaced proactively, human support access
- Key risk: Loan default, account dormancy, silent churn

### 2.3 Persona-Adaptive Experience Rules

The portal adapts based on detected persona signals (derived from Churn DNA + behavioral data):

| Signal | Adaptation |
|---|---|
| Device = low-end Android, region = rural district | Default to simplified UI mode, large buttons, regional language default |
| Age > 60 (from KYC) | Large font mode enabled, reduced animation, simplified navigation |
| Last app login > 60 days | Welcome-back flow, summarize what changed, easy re-engagement path |
| Active SIPs + monthly income > ₹1L | Surface investment optimization content, tax-saving alerts |
| EMI-to-income ratio > 50% | Stress support mode: hide upsell content, surface restructuring and support |
| First login ever | Guided onboarding flow — do not show empty dashboard |

---

## 3. Customer Portal Navigation & Information Architecture

### 3.1 Core Navigation Structure

The customer portal is organized around **what customers care about**, not around banking product categories:

```
TRUSTEDGE CUSTOMER PORTAL
│
├── 🏠  HOME                (Personalized financial snapshot + priority actions)
│
├── 💬  SAGE ASSISTANT      (Conversational AI — the primary engagement surface)
│
├── 💰  MY FINANCES         (Account overview, transactions, balances, trends)
│
├── 📦  MY PRODUCTS         (All holdings: FDs, SIPs, Loans, Cards — status + actions)
│
├── 🎯  MY GOALS            (Savings goals, financial targets, planning tools)
│
├── 🎁  OFFERS FOR ME       (Personalized, transparent product offers from TRUTH engine)
│
├── 🔔  NOTIFICATIONS       (Full history of all alerts, outreach, bank communications)
│
├── 🛡️  SUPPORT             (Complaint management, branch booking, human escalation)
│
└── ⚙️  MY SETTINGS         (Profile, language, communication preferences, privacy controls)
```

### 3.2 Navigation Design Rules

- **No more than 8 top-level sections** — prevent cognitive overload
- **Bottom navigation bar on mobile** — 5 most-used items: Home, SAGE, My Finances, Offers, Notifications
- **Persistent SAGE button** — floating action button on every page so SAGE is always one tap away
- **Language toggle in header** — persistent, session-sticky language selector (not buried in settings)
- **Back navigation always visible** — never trap customers in a flow without a clear exit
- **No banking jargon in navigation labels** — "My Products" not "Portfolio Management", "Offers For Me" not "Campaign Inbox"

---

## 4. Home Dashboard — Redesigned

### 4.1 Philosophy: The Right Information at the Right Time

The customer Home screen is not a generic financial dashboard. It is a **daily briefing** — what does this specific customer need to know and act on today? It is entirely personalized and changes dynamically based on events, time of year, and customer state.

### 4.2 Home Screen Anatomy

**Section 1: Financial Snapshot (top, always visible)**

A clean, single-row summary — not an overwhelming grid:

```
┌──────────────────────────────────────────────────────────┐
│  Good morning, Priya 👋                                  │
│  ─────────────────────────────────────────────────────── │
│  Total Savings    ₹2,84,320  ↑ ₹4,200 this month        │
│  FD Earnings      ₹12,840    earning 6.8% p.a.           │
│  Active SIPs      3          next debit: 5th June        │
└──────────────────────────────────────────────────────────┘
```

**Design rules:**
- Show net worth summary (savings + FD + investment holdings minus loan outstanding)
- Show one forward-looking signal per product category (next SIP debit, FD maturity date, EMI due)
- No raw account numbers on home screen (security)
- Trend indicator: is the customer's financial position improving or declining vs. last month?

**Section 2: Priority Actions (contextual, changes daily)**

The most important section — 1 to 3 action cards, AI-selected based on urgency and relevance:

```
┌──────────────────────────────────────────────────────────┐
│  TODAY'S PRIORITY                                        │
│  ─────────────────────────────────────────────────────── │
│  📅 Your FD of ₹50,000 matures on June 15               │
│     What would you like to do with it?                   │
│  [Renew FD]  [Invest in SIP]  [Transfer to Savings]      │
│                                                          │
│  💡 You could earn ₹840 more per year by switching       │
│     to our Senior Citizen FD rate. See comparison →      │
└──────────────────────────────────────────────────────────┘
```

More Priority Action examples:
- "Your EMI is due in 3 days — ₹12,400. Your balance is sufficient."
- "Tax-saving season: ₹64,000 remaining in your 80C limit. Invest before March 31."
- "You missed 2 SIP debits last month. Would you like to catch up?"
- "Your salary has not been credited this month. Everything okay? [Chat with SAGE]"
- "You have an offer from us — FD rate increased to 7.2%. Valid until June 20. [See Offer]"

**Section 3: SAGE Quick-Start (always present)**

Prompts customers to start a SAGE conversation with contextual suggestions:

```
┌──────────────────────────────────────────────────────────┐
│  💬 Ask SAGE                                             │
│  ─────────────────────────────────────────────────────── │
│  Suggested for you:                                      │
│  [How can I save more this month?]                       │
│  [What happens when my FD matures?]                      │
│  [How do I start an SIP?]                                │
│  [I'm having trouble paying my EMI]                      │
└──────────────────────────────────────────────────────────┘
```

Suggestions are AI-generated based on:
- Recent transaction patterns ("spending increased in entertainment last month")
- Upcoming events ("FD maturing in 3 weeks")
- Seasonal context ("tax filing season")
- Customer life stage signals ("large purchase suggests home buying interest")

**Section 4: Financial Wellbeing Pulse (condensed)**

A single-line health indicator — not a complex graph:

```
Your financial health this month: 🟢 Good
Spending is within budget. Savings are on track. No missed payments.
[See full breakdown →]
```

States: 🟢 Good / 🟡 Watch / 🔴 Needs Attention

When state is 🔴: Shows 1 specific reason and 1 specific action. Never shows multiple problems simultaneously (overwhelming).

**Section 5: Recent Activity (compact)**

Last 5 transactions with clean categorization:
- Salary credit, grocery, electricity, EMI, UPI transfer
- One-tap to see full transaction history
- Anomaly flagging: "This amount is higher than your usual utility payment."

### 4.3 Home Screen States

**First Login / Onboarding State:**
- "Welcome to TrustEdge" with 3-step guided setup
- Step 1: Link your accounts (CBS sync)
- Step 2: Set your first financial goal
- Step 3: Meet SAGE — starts a brief introductory conversation

**Post-Inactivity Return (last login > 30 days):**
- "Welcome back" message with summary of what changed since last visit
- "Here's what's new" highlights: FD interest earned, balance change, any pending offers

**Stress State (detected by AI):**
- Home screen adapts: Promotional content hidden, upsell banners removed
- Priority actions focus only on support: "Talk to SAGE about your situation" or "Book a call with your relationship manager"
- Tone shift: All copy becomes warmer, more supportive, explicitly non-judgmental

---

## 5. SAGE AI Assistant — Full Redesign

### 5.1 Current State vs. Required State

**Current state**: A chat interface where customers type questions and SAGE responds. Sessions are isolated — no history, no continuity, no proactive behavior.

**Required state**: SAGE is a persistent financial companion that knows the customer's history, can reference previous conversations, proactively surfaces insights, adapts its communication style to the individual, and smoothly hands off to human support when needed.

### 5.2 Conversation Architecture

**Session Model:**

Every SAGE conversation is saved, titled, and searchable in the customer's conversation history. Sessions are not isolated events — they form a continuous relationship log.

```
MY SAGE CONVERSATIONS
│
├── Today
│   └── "How to save for my daughter's school fees" — 14 min ago
│
├── Last Week
│   ├── "Understanding my FD maturity" — 3 days ago
│   └── "EMI stress and options" — 6 days ago (📌 Pinned — follow-up pending)
│
└── This Month
    ├── "SIP vs FD comparison" — 12 days ago
    └── "Budget review for April" — 18 days ago
```

**Cross-Session Context:**

When a customer starts a new conversation, SAGE opens with awareness of recent history:

> "Welcome back, Priya. Last time we talked about your FD maturity on June 15 — that's coming up in 12 days. Would you like to continue planning for that, or is there something new on your mind?"

This eliminates the frustrating experience of having to re-explain context every session.

### 5.3 SAGE Conversation Modes

**Mode 1: Guided Flow (for specific decisions)**

When a customer says: "My FD is maturing, what should I do?"

SAGE does not dump a wall of text. It runs a structured guided flow:

```
SAGE: "Great — let me help you decide. A few quick questions:
       What amount is maturing? [₹50,000 shown from your account]
       When do you need this money next? 
       [In 1 year] [In 3–5 years] [No fixed timeline]"

Customer: In 3-5 years

SAGE: "Perfect. Since you don't need it soon, here are 3 options 
       tailored for you:
       
       Option A: Renew FD at 7.0% → earns ₹10,500 in 3 years
       Option B: SIP in debt mutual fund → estimated ₹11,800 in 3 years (moderate risk)
       Option C: Split 50/50 FD + SIP → balanced approach
       
       Which one would you like to explore further?"
```

Guided flows exist for:
- FD maturity planning
- SIP starting guide
- EMI stress and restructuring
- Budget setup
- Goal creation
- Emergency fund planning

**Mode 2: Free Conversation (for questions and education)**

Standard open-ended chat for questions, explanations, and financial literacy. Same as current SAGE model but with cross-session context added.

**Mode 3: Stress Support Mode (triggered by distress signals)**

When SAGE detects distress language ("I can't pay my EMI", "I'm worried about money", "I don't know what to do"), SAGE shifts into a slower, more empathetic mode:

- Responses are shorter, warmer
- No product recommendations
- Explicitly validates feelings first before moving to solutions
- Offers human escalation proactively
- Logs stress signal to internal system (triggers RM alert) without customer being aware of internal mechanics

Example:
> "I can hear that things feel difficult right now. That's completely understandable. Let's take this one step at a time. Can you tell me a bit more about what's worrying you most — is it a specific payment coming up, or is it more of a general feeling about your finances?"

**Mode 4: Voice Mode (for rural / low-literacy users)**

Separate UI mode triggered by microphone icon:
- Speech-to-Text (existing, browser-native)
- Text-to-Speech response (NEW — SAGE reads its response aloud using Web Speech API)
- Larger text display of SAGE response
- Simplified vocabulary automatically applied
- Response length shortened (shorter sentences are easier to hear)

### 5.4 Proactive SAGE Behaviors

SAGE is not purely reactive. It generates in-app nudges that appear in the Home section and as notifications:

| Trigger | Proactive SAGE Message |
|---|---|
| Salary credited | "Your salary came in. You saved ₹2,100 more than last month. Nice work!" |
| Large unusual debit | "We noticed a larger-than-usual debit. Everything okay? [Chat with SAGE]" |
| FD maturity in 14 days | "Your FD is maturing in 2 weeks. Want to plan what to do with it?" |
| SIP debit failed | "Your SIP payment didn't go through. Let's fix that together." |
| 80C limit not utilized (Jan–Feb) | "You have ₹64,000 in tax savings you haven't used yet this year." |
| First month of spending tracked | "Your first month of spending is summarized. Want to see where your money went?" |
| EMI paid on time 6 months in a row | "6 months of on-time EMIs! Your credit score is likely improving." |

All proactive nudges appear as SAGE-branded notification cards — not impersonal bank alerts. The customer taps the card to open a pre-contextualized SAGE conversation about that topic.

### 5.5 Topic Routing & Guardrails

SAGE operates within 5 core financial topic tracks:

| Topic Track | Scope |
|---|---|
| Budgeting | Monthly income/expense management, spending categories, saving habits |
| Saving | Savings accounts, FDs, emergency fund, short-term goals |
| Debt Management | EMI tracking, loan restructuring options, prepayment, credit card management |
| Investing | SIPs, mutual funds basics, FD vs. MF comparison, goal-based investing |
| General Financial Literacy | Compound interest, inflation, insurance basics, tax awareness |

**Out-of-scope detection**: If a customer asks SAGE something outside these tracks (legal advice, crypto trading, specific stock tips), SAGE responds:

> "That's a bit outside my area — I focus on everyday banking and savings guidance. For stock-specific advice, a registered financial advisor would be the right person to speak with. Is there something about general investing I can help you with?"

**Absolute guardrails** (never violated regardless of phrasing):
- Never recommends specific stocks, cryptocurrencies, or speculative instruments
- Never provides legal advice
- Never makes guarantees about investment returns
- Never pressures customers to take any action ("You should open this FD today or you'll lose the rate")
- Never shares one customer's data with another
- Never confirms or denies whether the bank intends to contact a customer for a specific reason

### 5.6 Improved Feedback System

Replace binary thumbs with a layered feedback mechanism:

**Layer 1 (always shown):** 👍 Helpful / 👎 Not helpful

**Layer 2 (shown when 👎 selected):** Why wasn't this helpful?
- "The answer was confusing / hard to understand"
- "This didn't answer my actual question"
- "The advice doesn't apply to my situation"
- "I got better information elsewhere"
- "Other (please describe)"

Layer 2 feedback is routed to the SAGE admin monitor (see Admin Portal plan) for quality review and model improvement.

**Layer 3 (shown periodically, not after every message):** Rate your SAGE experience today: ⭐⭐⭐⭐⭐

Session-level rating (not per-message) is stored and used to track SAGE quality trends over time.

### 5.7 Conversation Export & Sharing

Customers can:
- Download a PDF summary of any SAGE conversation (useful for: keeping a record of financial advice, sharing with family, referring back to plans made)
- Pin a specific conversation as "Important" (appears at top of history)
- Request that a SAGE conversation summary be sent to their email

---

## 6. Financial Health & Insights Engine

### 6.1 My Finances — Full Specification

This section gives customers visibility into their financial life within TrustEdge — accounts, transactions, spending patterns, and trends. This is separate from the core banking app — it is the **analytical and insights layer** on top of CBS data.

### 6.2 Account Overview

```
┌──────────────────────────────────────────────────────────┐
│  MY ACCOUNTS                                             │
├──────────────────────────────────────────────────────────┤
│  Savings Account ****4231          ₹2,84,320  ↑ this mo  │
│  Salary Account  ****8801          ₹1,12,450  ↑ salary   │
│  Current Account ****2200          ₹67,900    ↓ business │
├──────────────────────────────────────────────────────────┤
│  TOTAL BALANCE                     ₹4,64,670             │
└──────────────────────────────────────────────────────────┘
```

Account cards are tappable → opens account detail with:
- Full transaction history (filterable by date, category, amount)
- Monthly balance trend graph (12-month sparkline)
- Account-specific alerts (low balance warning threshold, large debit notification)

### 6.3 Transaction Intelligence

Every transaction is auto-categorized by the AI layer:

**Categories**: Salary, Housing, Groceries, Utilities, Transport, Healthcare, Education, Entertainment, Investment, Insurance, EMI, Transfer, Other

**Transaction view features:**
- Search by merchant, amount, category, or date range
- Flag a transaction as "incorrect category" → feeds back to categorization model
- "Recurring" badge on detected recurring payments (subscriptions, standing instructions)
- Export transactions: PDF statement, CSV (for tax filing)
- UPI-linked transactions shown with merchant name (not just UPI ID)

**Smart annotations:**
- "This is 40% higher than your usual grocery spending this month"
- "You've paid Netflix 8 months in a row — ₹1,196/month"
- "This transfer matches your rent amount from previous months"

### 6.4 Spending Insights

Monthly spending breakdown with actionable intelligence:

**Spending Ring Chart** (not a pie chart — rings allow better proportion reading):
- Inner ring: Essential (Housing + Utilities + Groceries + EMI)
- Outer ring: Discretionary (Entertainment + Dining + Shopping)
- Center: Net savings amount

**Monthly Comparison:**
- This month vs. last month vs. 3-month average — per category
- Highlight: "You spent ₹4,200 more on food this month than your average"
- Category drill-down: tap any category to see all transactions within it

**Savings Rate Tracker:**
- Formula displayed transparently: Income − Expenses = Net Savings
- Savings rate %: "You saved 23% of your income this month" (benchmark: "The recommended minimum is 20%")
- Historical trend: 6-month savings rate chart

**Budget Setup (optional, customer-initiated):**
- Customer sets monthly spending limits per category (or accepts AI suggestion)
- Real-time budget tracking: traffic light system within each category
- Alert when budget 80% consumed in a category (configurable)
- No enforcement — budgets are guides, not locks

### 6.5 Net Worth Tracker

A single, clear view of the customer's full financial position:

```
FINANCIAL POSITION — May 2026
─────────────────────────────────────────────────────────
ASSETS
  Savings & Current Accounts          ₹4,64,670
  Fixed Deposits                      ₹2,00,000
  SIP / Mutual Funds (approx. NAV)    ₹84,320
  Recurring Deposit                   ₹36,000
  ─────────────────────────────────────────────
  Total Assets                        ₹7,84,990

LIABILITIES
  Home Loan Outstanding               ₹18,40,000
  Personal Loan Outstanding           ₹1,20,000
  Credit Card Balance                 ₹23,400
  ─────────────────────────────────────────────
  Total Liabilities                   ₹19,83,400

NET WORTH                            (₹11,98,410)

📌 Your assets are growing. Liabilities declined ₹18,200 this month.
   [Ask SAGE: How do I improve my net worth?]
```

**Important design principle**: Negative net worth is displayed honestly and non-judgmentally. The framing is always progress-oriented ("your liabilities declined") rather than alarming.

---

## 7. Products & Portfolio Management

### 7.1 My Products — Full Specification

All customer product holdings in one place, with actionable management tools.

### 7.2 Fixed Deposits

```
┌──────────────────────────────────────────────────────────────────────┐
│  MY FIXED DEPOSITS                                     [Add New FD]  │
├────────────────┬──────────┬──────────┬──────────────┬───────────────┤
│ FD             │ Amount   │ Rate     │ Matures      │ Action        │
├────────────────┼──────────┼──────────┼──────────────┼───────────────┤
│ Senior Citizen │ ₹1,00,000│ 7.25% p.a│ 15 Jun 2026  │ [Plan Maturity]│
│ Regular 2Y     │ ₹50,000  │ 6.80% p.a│ 30 Sep 2027  │ [View Details]│
├────────────────┴──────────┴──────────┴──────────────┴───────────────┤
│  Total FD value: ₹1,62,840 (including accrued interest)             │
│  ⚠️ 1 FD matures in 19 days — Plan now to avoid auto-renewal         │
└──────────────────────────────────────────────────────────────────────┘
```

**FD Detail View:**
- Principal, rate, start date, maturity date, maturity amount (projected)
- Interest earned so far (running total)
- Maturity instruction (auto-renew / credit to account / custom) — customer can update at any time
- TDS certificate download
- Premature withdrawal calculator: "If you break this FD today, you receive ₹XX after penalty"
- "Ask SAGE about this FD" shortcut

**FD Maturity Planner** (triggered 30 days before maturity):
- Guided flow: "What do you want to do when this FD matures?"
- Option comparison: Renew same / Renew at new rate / Move to SIP / Split
- Rate comparison with current market: "Our current 2-year FD rate is 7.0% — up from your current 6.8%"
- Customer makes decision and saves it — RM and system are notified of customer preference

### 7.3 SIPs & Mutual Funds

```
MY SIPs
─────────────────────────────────────────────────────────
Name            Monthly  Invested  Current  Return  Status
─────────────────────────────────────────────────────────
HDFC Nifty 50   ₹5,000   ₹60,000   ₹68,200  +13.7%  ✅ Active
Axis ELSS       ₹3,000   ₹36,000   ₹39,400  +9.4%   ✅ Active
SBI Debt Fund   ₹2,000   ₹24,000   ₹25,100  +4.6%   ⏸️ Paused
─────────────────────────────────────────────────────────
Total SIP investment: ₹1,20,000 → Current value: ₹1,32,700 (+10.6%)
```

**SIP Management Actions:**
- Pause SIP (with reason selection — financial stress → triggers SAGE support flow)
- Resume SIP
- Increase / decrease monthly amount
- Stop SIP
- Switch fund
- View full investment history and NAV chart

**Return Display Philosophy:**
- Always show absolute return amount AND percentage
- Show since-inception return, not just recent performance
- Include disclaimer: "Past performance does not guarantee future returns — displayed for information only"
- Never use language that implies guaranteed returns

### 7.4 Loans & EMIs

```
MY LOANS
──────────────────────────────────────────────────────────────────
Home Loan ****8801
  Outstanding: ₹18,40,000  │  Rate: 8.5% p.a. (floating)
  Monthly EMI: ₹16,200     │  Remaining: 112 payments (9.3 years)
  Next EMI: June 5, 2026   │  Balance: Sufficient ✅
  
  [EMI Calendar]  [Prepayment Calculator]  [Ask SAGE about my loan]

Personal Loan ****2211
  Outstanding: ₹1,20,000   │  Rate: 13.5% p.a.
  Monthly EMI: ₹5,400      │  Remaining: 24 payments (2 years)
  Next EMI: June 10, 2026  │  Balance: Low ⚠️ (top up recommended)
──────────────────────────────────────────────────────────────────
Total Monthly EMI Burden: ₹21,600 (46% of your monthly income)
⚠️ EMI-to-income ratio is high. Ask SAGE for debt management guidance.
```

**Loan Detail Features:**
- Amortization schedule: full table of every remaining payment showing principal vs. interest split
- Prepayment calculator: "If I pay ₹50,000 extra today, how much interest do I save and how many months do I save?"
- EMI calculator: "If I increase my EMI by ₹2,000, when will I finish repaying?"
- Rate change alert: When RBI rate changes → "Your floating rate loan may be affected. [See impact]"
- EMI calendar view: Visual monthly calendar showing all upcoming EMI dates across all loans

**EMI Stress Pathway** (when customer has EMI-to-income ratio > 50%):
- System shows a warning (non-alarming) in the loan section
- Suggests: "Your EMI load is high. SAGE can help you explore options."
- Options surfaced proactively: partial prepayment to reduce EMI, loan restructuring request, extending tenure to reduce monthly burden
- No automatic action — customer initiates

### 7.5 Recurring Deposits

- Balance, monthly contribution, maturity date, projected maturity amount
- "Pause contribution" option with explanation of impact
- Maturity planner (same as FD)

### 7.6 Insurance (if bank-sold)

- Policy name, type, sum assured, premium due date
- Premium payment history
- Claim status tracking (if applicable)
- Important: No upselling from within this view — only information about existing policies

---

## 8. Goal Planning & Savings Engine

### 8.1 Philosophy

Real financial behavior change happens when customers connect their money to things they care about. "Save more money" is abstract. "Save for Riya's school fees by December" is motivating. TrustEdge's goal engine creates this connection.

### 8.2 Goal Creation Flow

Customer taps "Create New Goal":

**Step 1: What are you saving for?**
- Common goal templates (customer selects):
  - 🏠 Home Down Payment
  - 🎓 Child's Education
  - 🏥 Emergency Fund
  - ✈️ Vacation
  - 💍 Wedding
  - 🚗 Vehicle Purchase
  - 👴 Retirement Cushion
  - 📦 Other (custom)

**Step 2: How much do you need and when?**
- Target amount: ₹ [input]
- Target date: [date picker]
- System calculates: "You need to save ₹X per month to reach this goal"

**Step 3: Where does this money come from?**
- Option A: Automatic transfer from salary account on salary day
- Option B: Manual deposits when you have surplus
- Option C: Link to an existing SIP or RD

**Step 4: Review & Confirm**
- Summary: Goal name, target, monthly contribution, projected completion date
- "Ask SAGE: Is this goal realistic for my situation?"

### 8.3 Goal Tracking View

Each active goal displays as a progress card:

```
┌──────────────────────────────────────────────────────────┐
│  🎓 Riya's School Fees                                   │
│  ████████████████░░░░░░░░  64% complete                  │
│  Saved: ₹64,000  │  Target: ₹1,00,000  │  By: Dec 2026  │
│  Monthly contribution: ₹5,000 via auto-transfer          │
│  On track: ✅ You'll reach your goal 1 month early        │
│  [Adjust] [Pause] [Ask SAGE]                             │
└──────────────────────────────────────────────────────────┘
```

**Goal State Variants:**
- ✅ On track: Positive reinforcement, no action required
- ⚠️ Behind schedule: "You're ₹4,000 behind your monthly target. Want to catch up?" → one-tap catch-up transfer
- 🎉 Goal reached: Celebration moment + prompt to create next goal
- ⏸️ Paused: "Your goal is paused. Resume when ready." → no pressure

**Goal Projection Under Stress:**
When the stress detection engine flags a customer, the Goals view adapts:
- Goals that require immediate action are highlighted
- Goals that are flexible are shown as "temporarily paused — your financial health comes first"
- SAGE automatically offers to review goals in the context of the customer's current financial stress

### 8.4 Emergency Fund Tracker

Special goal type with dedicated tracking:

```
EMERGENCY FUND
Target: 3 months of expenses = ₹54,000
Current: ₹27,000 (50% — you have 1.5 months covered)

[Why do I need this?] [Build faster] [Ask SAGE]
```

"Why do I need this?" opens an inline educational card — not a SAGE conversation. Quick, self-contained explanation of emergency fund purpose. This respects the customer's time for simple educational content.

---

## 9. Stress Detection & Support System

### 9.1 Customer-Facing Stress Response (Currently Missing)

The original strategy detects financial stress and alerts internal teams. This is correct but incomplete. The customer experiencing stress also deserves a direct, proactive response from the platform. Treating customers as silent subjects of internal action — rather than participants in their own support — undermines the "human-first" manifesto.

### 9.2 Stress Detection Signals (Customer-Visible Context)

When the AI detects stress signals, the customer's experience changes in 3 ways:

**Way 1: UI Tone Shift**
- All promotional content, upsell banners, and new product nudges are immediately hidden
- Page titles and action button labels shift to supportive framing
- Home dashboard Priority Actions block shows only support-oriented options

**Way 2: Proactive Support Card**
A non-intrusive, empathetic card appears on the Home screen:

```
┌──────────────────────────────────────────────────────────┐
│  💙 We're here for you                                   │
│  We noticed some changes in your account recently.       │
│  If you're going through a difficult time financially,   │
│  we have options that might help.                        │
│  [Talk to SAGE]  [Speak to my RM]  [See support options] │
└──────────────────────────────────────────────────────────┘
```

**Important design rules for this card:**
- Never says "we think you're struggling" — observes changes, doesn't diagnose
- Never appears more than once per week regardless of stress level
- Customer can dismiss it permanently if they prefer privacy
- Appears only when stress score crosses a meaningful threshold, not on minor variations

**Way 3: Contextual Support Within SAGE**

If customer talks to SAGE during a stress period, SAGE is pre-briefed with soft context (not the full internal risk score — just the tone directive):
- Slower, warmer pacing
- Active listening responses before solutions
- Explicitly offers human escalation: "Would you prefer to speak with your relationship manager directly? I can arrange that."

### 9.3 EMI Distress Support Flow

For customers showing EMI stress signals (irregular payments, high EMI-to-income, declining balance before EMI date):

**Step 1 — Early Warning (customer-facing, 30 days before predicted difficulty):**
> "Your savings pattern suggests your upcoming EMI might be tight this month. Would you like to explore options?"

Options offered by SAGE:
- "Move your EMI date" — request to bank to shift payment date by up to 7 days
- "Explore EMI reduction" — partial prepayment or tenure extension
- "Temporary EMI pause" — moratorium request (if bank policy allows)
- "Talk to your RM" — human support

**Step 2 — At-Risk (5 days before EMI, balance insufficient):**
- Specific alert with balance amount, EMI amount, shortfall
- Immediate actionable options: transfer from another account, request RM call

**Step 3 — Post-Missed EMI (non-judgmental):**
- "Your EMI payment of ₹12,400 was not processed. There's still time to resolve this before a late fee is applied."
- Clear next steps, not a list of consequences
- Immediate SAGE conversation trigger

### 9.4 Loan Restructuring Request Flow (Customer-Initiated)

Customer taps "Explore Restructuring Options" from their Loan section or from SAGE:

**Guided flow:**
1. SAGE asks: "What is the main challenge you're facing?" → [Income reduced / Unexpected expense / Job change / Medical emergency / Other]
2. SAGE explains available options based on the challenge type:
   - Tenure extension (reduces monthly EMI, increases total interest)
   - Moratorium (pause EMI for 3–6 months — interest continues to accrue)
   - Rate negotiation (if applicable)
   - Partial prepayment to reduce burden
3. For each option: SAGE shows clear math — "With a 6-month moratorium, your EMI stays at ₹0 but total interest increases by ₹X"
4. Customer selects preferred option → Request submitted to RM for review → RM contacts customer within 48h

---

## 10. Outreach & Offer Experience

### 10.1 "Offers For Me" Section — Full Specification

The current TRUTH engine delivers outreach through external channels (SMS, WhatsApp, RM call). These are effective for reaching customers but do not create a deliberate, in-portal space for customers to evaluate offers at their own pace. The "Offers For Me" section solves this.

### 10.2 Offer Cards

Each offer displayed in the portal follows a strict transparent format:

```
┌──────────────────────────────────────────────────────────────────────┐
│  🏦 OFFER FOR YOU                                     Expires Jun 20 │
│  ─────────────────────────────────────────────────────────────────── │
│  FIXED DEPOSIT — SPECIAL RATE                                        │
│  Earn 7.25% per annum on your next FD                                │
│                                                                      │
│  How this compares:                                                  │
│  Our standard rate:   6.80% p.a.                                     │
│  SBI current rate:    6.75% p.a.        ← benchmark shown always     │
│  This offer:          7.25% p.a.  ✅ Better than market              │
│                                                                      │
│  On ₹1,00,000 for 2 years:                                           │
│  Standard rate: matures at ₹1,14,532                                │
│  This offer:    matures at ₹1,15,456  → ₹924 more                   │
│                                                                      │
│  Conditions:                                                         │
│  • Available for new FDs only                                        │
│  • Minimum deposit: ₹50,000                                          │
│  • No premature withdrawal within 6 months                           │
│  • TDS applicable as per standard rules                              │
│  • No processing fee                                                 │
│  ─────────────────────────────────────────────────────────────────── │
│  Why am I seeing this?                                               │
│  Your FD of ₹1,00,000 matures in 19 days. We thought this           │
│  timing might be helpful.                                            │
│  ─────────────────────────────────────────────────────────────────── │
│  [Ask SAGE about this offer]  [Accept Offer]  [Not Interested]       │
└──────────────────────────────────────────────────────────────────────┘
```

**Mandatory elements for every offer card:**
1. Clear offer headline
2. Transparent rate/benefit comparison (our standard rate vs. national benchmark vs. this offer)
3. Real-money calculation (not just percentage — show what ₹1L becomes)
4. Full conditions in plain language (no legal fine-print only)
5. Zero hidden fees — state "No processing fee" explicitly or list the fee
6. "Why am I seeing this?" — explains the targeting reason in plain language
7. "Ask SAGE" — customer can ask questions before deciding
8. "Not Interested" — always available, never hidden

### 10.3 Offer Response Tracking

When customer clicks "Not Interested":
- Brief optional reason: "Rate not attractive / Already have an FD / Not the right time / Other"
- Response: "Understood. We'll try to show you more relevant offers in future."
- Offer removed from their inbox
- Reason fed to PULSE for campaign improvement

When customer clicks "Accept Offer":
- Guided completion flow (link to CBS for actual product opening)
- Confirmation screen with full terms summary
- Offer moved to "Accepted Offers" history

### 10.4 Offer Inbox Management

Customers see all offers in one place, organized by:
- **New** (unseen offers)
- **Expiring Soon** (offers with < 3 days remaining)
- **Exploring** (customer clicked but did not accept — shows interest)
- **Accepted** (historical record of accepted offers)
- **Declined** (historical record, with option to reconsider if still active)

**Offer frequency guarantee (visible to customer):**
> "We show you a maximum of 2 offers per month and only when we think the timing is right for you."

This builds trust through transparency about the bank's own outreach policy.

---

## 11. Notifications & Communication Preferences

### 11.1 Notification Center

All bank communications to the customer — via any channel — are also logged in the in-portal Notification Center. This ensures:
- Customer always has a full record of every communication
- Customer can reference an SMS they received days ago without scrolling through messages
- No communication is "lost" or denied

**Notification types:**
- Transaction alerts (debit/credit above threshold)
- EMI reminders (upcoming, successful, failed)
- FD maturity reminders (30 days, 14 days, 3 days before)
- SIP execution confirmations
- Offer notifications (from TRUTH)
- SAGE proactive insights
- Balance alerts (below customer-set threshold)
- Security alerts (login from new device, password change)
- Bank announcements (rate changes, policy updates)

**Notification Card Format:**
- Title + brief message + timestamp
- Channel it was also sent on (SMS / WhatsApp / Email / In-app only)
- Related action button (where applicable)
- Mark as read / dismiss

### 11.2 Communication Preferences (Customer-Controlled)

Customers must have meaningful control over how the bank communicates with them. This builds trust and reduces opt-out rates on external channels.

```
MY COMMUNICATION PREFERENCES
─────────────────────────────────────────────────────────
ALERTS I ALWAYS WANT (cannot be turned off for your security)
  ✅ Transaction above ₹10,000
  ✅ Login from new device
  ✅ EMI payment confirmation

ALERTS I CAN CONFIGURE
  Balance drops below [₹ ______ ] → [SMS] [WhatsApp] [Email] [In-App]
  FD maturity reminders         → [SMS] [WhatsApp] [Email] [In-App]
  SIP execution confirmation    → [SMS] [WhatsApp] [Email] [In-App]
  SAGE proactive nudges         → [WhatsApp] [In-App] [Off]
  
OFFERS & PROMOTIONS
  I would like to receive personalized offers:
  [✅ Yes, maximum 2 per month]  [❌ No, pause all offers for 90 days]
  
  Preferred channel for offers:
  [WhatsApp] [Email] [In-App only] [SMS]

  Language preference for offers:
  [English] [Hindi] [Telugu]

QUIET HOURS
  Do not send SMS/WhatsApp between: [9:00 PM] and [8:00 AM]
```

**Note on mandatory alerts**: Security-critical alerts (transactions, login) cannot be fully disabled but customers can choose channel. Regulatory-required communications (RBI-mandated notices) are always sent regardless of preference settings.

### 11.3 Do Not Disturb & Opt-Out

- **Pause all marketing for 90 days**: Single toggle — immediately suppresses all non-mandatory outreach across all channels
- **Permanent marketing opt-out**: Available per applicable regulations — applies to all external promotional channels
- **Block specific channel**: Customer can opt out of WhatsApp communications independently of SMS, for example
- All opt-out records are immutable audit entries, immediately effective, and communicated to TRUTH's suppression list in real-time

---

## 12. Multilingual & Accessibility Experience

### 12.1 Language Strategy Overhaul

The current strategy uses isolated bubble-level translation within SAGE. This is architecturally sound but the overall language strategy needs expansion.

**Language layers in TrustEdge:**

| Layer | Current State | Improved State |
|---|---|---|
| Global UI (navigation, buttons, labels) | English only | English + Hindi + Telugu toggleable |
| SAGE conversations | English with bubble-level translation | Full session language selection (English / Hindi / Telugu) |
| Transaction descriptions | English only | AI-translated where available for regional language users |
| Offer content | English only | Fully localized offer copy per language |
| Error messages | English only | Localized |
| SAGE voice output | Not supported | Web Speech API TTS in Hindi (hi-IN) and Telugu (te-IN) |
| Notifications (SMS/WhatsApp) | English only | Language-preference-matched |
| Financial terms education | English only | Inline glossary in regional language |

### 12.2 Language Selection UX

**Session preference (in header, always visible):**
```
[EN]  [हिंदी]  [తెలుగు]
```

Switching language:
- Changes all UI elements immediately (navigation labels, button text, standard messages)
- SAGE is notified of language preference and responds in that language from next message
- Financial amounts and numbers always use Indian numeral formatting (₹2,84,320 → not 284320)
- Preference is saved to account — persists across sessions

**Regional number formatting:**
- Use Indian lakh/crore system by default: ₹2.84 Lakhs, not ₹284,000
- Rural persona: also display in words where helpful — "Two Lakh Eighty-Four Thousand Rupees"

### 12.3 Accessibility Standards

TrustEdge customer portal must meet WCAG 2.1 AA standards as minimum:

**Visual accessibility:**
- Minimum contrast ratio: 4.5:1 for all text on background
- Text does not convey meaning by color alone (color + icon + label)
- Font size: minimum 16px body text, 14px for labels; user-adjustable up to 200%
- Senior mode (triggered by age > 60 from KYC or manual toggle): 20px base font, simplified layout, reduced information density

**Motor accessibility:**
- All interactive elements minimum 44×44px touch target
- No gesture-only interactions (all gestures have button equivalents)
- Voice input available on all text input fields (not just SAGE)
- No time-limited interactions — forms do not expire mid-completion

**Cognitive accessibility:**
- No more than 5 items per list without pagination
- All financial terms have tap-to-define glossary tooltips
- Progress indicators on all multi-step flows
- Confirmation steps before irreversible actions (closing account, stopping SIP)

**Low-bandwidth mode:**
- Detects slow connection speed automatically
- Switches to low-data mode: disables animations, compresses images, loads content progressively
- Explicit toggle available in settings
- Critical functions (balance check, EMI payment) always available even in low-bandwidth mode

### 12.4 Offline Capability (PWA)

For rural customers with intermittent connectivity:

**Available offline:**
- Last-synced account balance and recent transactions (read-only)
- Saved SAGE conversations (read-only)
- EMI calendar and upcoming payment dates
- Saved financial goals (read-only)

**Requires connectivity:**
- SAGE live conversations
- New transactions
- Offer acceptance
- Any account action

Offline state is clearly communicated: "You're offline. Showing last updated data from [timestamp]. [Retry connection]"

---

## 13. Complaint & Support Lifecycle

### 13.1 Current Gap

The original strategy mentions complaint sentiment logs as a signal input but has no customer-facing complaint management system. Customers experiencing service issues have no self-service resolution path.

### 13.2 Support Section — Full Specification

**Self-Service First:**
Before logging a complaint, the system tries to resolve it:

Customer taps "I have a problem":
```
What's the issue?
─────────────────────────────────────────────────────────
[Wrong transaction amount]
[Transaction not received]
[EMI incorrectly charged]
[ATM didn't dispense / debited without cash]
[KYC update needed]
[Account temporarily blocked]
[FD / SIP issue]
[Other]
```

For each selection, the system:
1. Checks if there's an automated resolution available
   - "ATM didn't dispense": Initiates auto-chargeback request immediately
   - "Account blocked": Shows reason if available and step to resolve (document upload, branch visit, KYC update)
2. If not auto-resolvable: Offers to connect to SAGE for guidance
3. If SAGE cannot help: Creates a formal complaint ticket

### 13.3 Complaint Ticket Lifecycle

```
COMPLAINT #TKT-2024-04821
─────────────────────────────────────────────────────────
Issue: EMI incorrectly charged — extra ₹200 charged on May 15
Submitted: May 16, 2026 at 2:34 PM
Status: 🟡 Under Review

Timeline:
  ✅ May 16 2:34 PM — Complaint received
  ✅ May 16 4:00 PM — Assigned to Branch Operations team
  🔄 May 17 — Under review (expected resolution: May 19)
  ⬜ Resolution — Pending
  
Your reference: TKT-2024-04821
Track this complaint: [RBI Ombudsman Portal link shown if resolution delayed]
─────────────────────────────────────────────────────────
[Add more information]  [Cancel complaint]  [Chat with SAGE]
```

**SLA commitments displayed to customer:**
- Standard complaints: 7 business days
- ATM/transaction disputes: 5 business days
- Account blocking: 24 hours

**Escalation path (transparent):**
- If not resolved within SLA: auto-escalated, customer notified
- Customer can manually escalate after SLA breach
- RBI Banking Ombudsman link always visible on complaint page (regulatory requirement)

### 13.4 Branch Appointment Booking

For customers who need in-person support (especially seniors and rural depositors):

```
BOOK A BRANCH APPOINTMENT
─────────────────────────────────────────────────────────
Branch: [Auto-selected nearest branch — changeable]
Reason: [Account issue / KYC update / Loan query / FD opening / Other]
Date:   [Calendar — shows available slots]
Time:   [Available time slots for selected date]
RM:     [Auto-assigned or customer can request specific RM]
─────────────────────────────────────────────────────────
Confirmation sent to: [registered mobile / email]
```

Appointment reminder: 24 hours before and 1 hour before.
Post-appointment: "How was your branch visit?" rating card.

### 13.5 RM Direct Contact

For high-relationship-value customers (determined by account type and balance tier):
- Direct WhatsApp message to assigned RM (bank-mediated, not personal number)
- Schedule RM callback from within the app
- View RM name, photo (optional), and availability status

For standard customers:
- Request a callback from available RM (not specifically assigned)
- Expected callback time shown: "We'll call you within 2 business hours"

---

## 14. Trust & Transparency Layer

### 14.1 My Privacy Dashboard

Customers must be able to understand and control how TrustEdge uses their data.

```
MY PRIVACY & DATA
─────────────────────────────────────────────────────────
DATA WE USE ABOUT YOU
  Your account transactions        → To show you your finances
  Your product holdings            → To show you your FDs, SIPs, loans
  Your app usage patterns          → To personalize your experience
  Your SAGE conversation topics    → To improve SAGE responses
  
DATA WE DO NOT SHARE
  ✅ We do not sell your data to third parties
  ✅ We do not share your data with advertisers
  ✅ AI recommendations are made by our own system — not by external vendors
  ✅ Your conversations with SAGE are stored encrypted and not used for any purpose other than improving your experience
  
WHAT AI DOES IN YOUR ACCOUNT
  We use AI to:
  • Categorize your transactions automatically
  • Suggest relevant offers at the right time
  • Power SAGE financial conversations
  • Detect unusual activity for your security
  
  AI does NOT:
  • Make final decisions about your loans without human review
  • Share your information with other customers
  • Access your SAGE conversations for marketing
─────────────────────────────────────────────────────────
[Download my data]  [Delete my SAGE history]  [Manage consents]
```

### 14.2 Consent Management

Granular consent controls per data usage type:
- Personalized offer targeting (AI uses transaction data to determine offer relevance)
- SAGE conversation analysis (for model improvement)
- Cross-product profile building (linking savings + loan + investment behavior)
- External API data sharing (e.g., Account Aggregator — only with explicit consent)

Each consent item:
- Plain English description of what is being consented to
- Explicit toggle (on/off)
- Date of last consent change
- What changes when consent is withdrawn

**Withdrawal of consent**: Honored within 48 hours. Customer notified of what specific functionality is reduced as a result.

### 14.3 Financial Transparency Hub

Educational content that builds financial literacy and trust:

```
UNDERSTAND YOUR BANKING
─────────────────────────────────────────────────────────
📘 How interest on FDs is calculated
📘 What affects my credit score
📘 How SIP returns are calculated (with examples)
📘 What is a floating interest rate and what does RBI rate mean for you
📘 Understanding TDS on FD interest
📘 How to read your account statement
📘 What deposit insurance covers (DICGC — ₹5 Lakh guarantee)
📘 Your rights as a bank customer
```

Each article:
- 300–500 words maximum
- Rupee-first examples, Indian financial context
- Available in Hindi and Telugu
- "Ask SAGE for more" link at bottom of each article
- No product placement or upselling within educational content

### 14.4 Fee Transparency

Accessible from any product page and Settings:

```
FEES & CHARGES
─────────────────────────────────────────────────────────
Savings Account
  Minimum balance charge: ₹X/month if below ₹Y
  ATM withdrawal (own network): Free
  ATM withdrawal (other network): ₹20 + GST after 5 free/month
  NEFT: Free
  RTGS: Free
  Debit card annual fee: ₹299 + GST
  
FD-related
  Premature withdrawal penalty: 1% reduction in applicable rate
  
Loan-related
  Processing fee: 1% of loan amount
  Prepayment charges: Nil for floating rate loans
  Late payment charge: 2% per month on overdue amount
─────────────────────────────────────────────────────────
[Download full fee schedule PDF]  [Ask SAGE about any fee]
```

This table is always up to date (synced from CBS), never hidden, and linked from every relevant product page.

---

## 15. Security & Privacy Controls

### 15.1 Security Center

```
MY ACCOUNT SECURITY
─────────────────────────────────────────────────────────
Last login: Today, 11:24 AM from Mumbai (Chrome / Android)
Recent login history: [Show last 10 logins]

ACTIVE SESSIONS
  This device (Redmi Note 12)    Current  [End session]
  
SECURITY SETTINGS
  ✅ 2-Factor Authentication: Enabled (OTP on registered mobile)
  ✅ Biometric login: Enabled
  ✅ Transaction PIN: Set
  
  [Change Password]
  [Change Transaction PIN]
  [Update Registered Mobile]
  [Block / Unblock Debit Card]
  
UNUSUAL ACTIVITY?
  [Report Unauthorized Transaction]  [Block All Transactions]
```

**"Block All Transactions" — Emergency freeze:**
- Single tap, immediate effect
- Blocks all debits (card, UPI, NEFT, RTGS)
- Does NOT block salary credits or EMI direct debits
- Branch visit or video KYC required to unblock
- Audit trail created immediately

### 15.2 Transaction Alert Threshold (Customer-Set)

Customers set their own alert thresholds:
- "Alert me for every transaction"
- "Alert me for transactions above ₹[____]"
- "Alert me for all UPI transactions"
- "Alert me for international transactions"

These replace the bank's default one-size-fits-all threshold.

---

## 16. Mobile Experience Strategy

### 16.1 Mobile-First Design Principles

Given that the majority of PSB customers in India access banking via mobile (particularly Android), the customer portal must be designed mobile-first:

- **Touch targets**: Minimum 48×48px for all interactive elements
- **Thumb zone design**: Primary actions in bottom 60% of screen (reachable by thumb)
- **Progressive disclosure**: Show summary on mobile, expand on tap — never force horizontal scroll
- **One action per screen**: Multi-step flows show one decision at a time
- **Native feel**: Bottom sheet overlays instead of modals, swipe to dismiss, pull to refresh

### 16.2 PWA vs. Native App Decision

TrustEdge customer portal is deployed as a Progressive Web App (PWA) for Phase 1:
- Installable on Android home screen without Play Store
- Works on low-end devices (< 2GB RAM)
- Offline capability for basic data viewing
- Auto-updates without user action
- Single codebase — reduces maintenance overhead

Phase 2 consideration: Native Android app for customers who need advanced features (voice output, biometric authentication, camera for document upload).

### 16.3 Low-End Device Optimization

For devices below ₹8,000 price point (significant PSB customer segment):
- Asset bundle < 200KB initial load
- Images lazy-loaded and compressed
- No heavy animation libraries
- SQLite-powered local cache (Workbox service worker)
- Graceful degradation: advanced features (charts, voice) show fallback text on older browsers

### 16.4 Mobile-Specific Features

- **Face/fingerprint login** (Web Authentication API where supported)
- **Camera-based document upload** for KYC and complaint evidence
- **GPS-based nearest branch** locator with directions
- **QR code scanning** for in-branch interactions (appointment check-in, quick contact with RM)
- **WhatsApp deep-link** from notification: one tap to open conversation with bank's WhatsApp Business account
- **Share** any SAGE advice, goal progress, or financial insight as an image (for sharing with family — relevant for joint financial decision-making)

---

## 17. Feature Rationalization Matrix

### 17.1 Keep (Core Value — Do Not Change)

| Feature | Reason |
|---|---|
| SAGE conversational AI | The platform's primary differentiator — keep and expand |
| Isolated inline translation (bubble-level) | Architecturally correct — expand to global UI toggle |
| Browser-native Speech-to-Text | Privacy-preserving, essential for rural users |
| Offline translation fallback dictionary | Demo stability and low-connectivity resilience |
| No commercial upselling within SAGE | Core trust principle — must be enforced as a hard constraint |
| Indian Rupee and lakh/crore formatting | Culturally correct, keep and extend to all financial displays |
| 5 topic tracks for SAGE | Appropriate scope — focused guidance without overreach |

### 17.2 Merge (Reduce Duplication)

| Feature A | Feature B | Merged Into |
|---|---|---|
| SAGE proactive nudge | Home "Priority Actions" | Single proactive card system with SAGE as the source of all contextual nudges |
| Stress alert (internal) | Customer wellbeing support | Unified stress response: internal RM alert + customer-facing support card in single trigger |
| FD maturity notification | FD maturity planner | Maturity planner auto-activates when maturity notification is sent |
| Complaint logging | Support chat with SAGE | Unified support flow: SAGE first, escalate to ticket if unresolved |

### 17.3 Remove (Unrealistic or Counterproductive)

| Feature | Reason to Remove |
|---|---|
| English-only global dashboard | Excludes primary target audience (rural, regional language users) |
| Single-session SAGE with no history | Creates distrust and repetition burden; cross-session context is essential |
| Binary thumbs-only feedback | Too coarse for meaningful model improvement |
| No customer-facing stress response | Contradicts "human-first" manifesto; internal-only stress handling is incomplete |
| No offer transparency ("Why am I seeing this?") | Missing in current design; required for trust |
| No consent management | Regulatory risk and trust deficit |
| No self-service communication preferences | Causes customer frustration and channel opt-outs |

### 17.4 Add (Missing for Production Readiness)

| Feature | Reason / Impact |
|---|---|
| Customer Home Dashboard | Most important missing piece — currently no landing experience |
| My Finances (transactions, spending insights, net worth) | Core financial visibility — customers will not use a portal that doesn't show their finances |
| Goal Planning & Savings Engine | Behavioral finance — connects money to motivation |
| Offers For Me (transparent offer inbox) | Converts TRUTH outreach into deliberate customer decisions |
| Notification Center (full history) | Communications audit trail for customers |
| Complaint Ticket System | Required for self-service resolution |
| Communication Preference Controls | Required for customer trust and opt-out rate reduction |
| Branch Appointment Booking | Serves senior and rural customers who need in-person support |
| SAGE Cross-Session Context | Critical for relationship continuity |
| SAGE Voice Output (TTS) | Completes the voice experience for low-literacy users |
| SAGE Guided Flows (structured decision support) | Makes SAGE actionable, not just conversational |
| Proactive SAGE Nudges | Transforms SAGE from reactive to relationship-building |
| Privacy Dashboard & Consent Management | Regulatory compliance and trust |
| Financial Transparency Hub (fees, education) | Trust-building and financial literacy |
| Emergency Account Freeze | Security essential for mobile banking |
| EMI Stress Pathway & Loan Restructuring Flow | NPA prevention through proactive customer engagement |
| PWA with offline support | Serves low-connectivity rural customers |
| Senior / Simplified UI mode | Serves the large PSB senior citizen depositor base |
| Global language toggle (EN/HI/TE) | Extends regional language support beyond SAGE to full portal |

---

## 18. Customer Data Architecture

### 18.1 Schema Additions Required

The existing Prisma schema needs customer-facing additions:

```prisma
model CustomerGoal {
  id                String    @id @default(uuid())
  userId            String
  goalType          String    // HOME, EDUCATION, EMERGENCY_FUND, VACATION, WEDDING, VEHICLE, RETIREMENT, OTHER
  goalName          String
  targetAmount      Float
  currentAmount     Float     @default(0.0)
  targetDate        DateTime
  monthlyContribution Float
  status            String    @default("ACTIVE") // ACTIVE, PAUSED, COMPLETED, ABANDONED
  linkedProductId   String?   // Optional: linked SIP or RD
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  user              User      @relation(fields: [userId], references: [id])
}

model CustomerPreferences {
  id                    String   @id @default(uuid())
  userId                String   @unique
  languagePreference    String   @default("EN")  // EN, HI, TE
  uiMode                String   @default("STANDARD")  // STANDARD, SENIOR, LOW_BANDWIDTH
  
  // Notification channels per type (JSON config)
  transactionAlertChannels  String @default("[\"SMS\",\"IN_APP\"]")
  emiBdChannels             String @default("[\"SMS\",\"IN_APP\"]")
  offerChannels             String @default("[\"IN_APP\"]")
  sageNudgeChannels         String @default("[\"IN_APP\"]")
  
  // Preferences
  transactionAlertThreshold Float @default(1000.0)
  marketingOptIn            Boolean @default(true)
  marketingPausedUntil      DateTime?
  quietHoursStart           Int @default(21) // 9 PM
  quietHoursEnd             Int @default(8)  // 8 AM
  
  updatedAt             DateTime @updatedAt
  user                  User     @relation(fields: [userId], references: [id])
}

model ConsentRecord {
  id             String   @id @default(uuid())
  userId         String
  consentType    String   // PERSONALIZED_OFFERS, SAGE_ANALYSIS, CROSS_PRODUCT_PROFILE, ACCOUNT_AGGREGATOR
  granted        Boolean
  grantedAt      DateTime
  withdrawnAt    DateTime?
  ipAddress      String
  
  user           User     @relation(fields: [userId], references: [id])
}

model SupportTicket {
  id              String    @id @default(uuid())
  userId          String
  category        String    // TRANSACTION, EMI, ATM, KYC, FD_SIP, OTHER
  subCategory     String?
  description     String
  evidenceUrls    String?   // JSON array of document URLs
  status          String    @default("OPEN") // OPEN, UNDER_REVIEW, ESCALATED, RESOLVED, CLOSED
  resolutionNote  String?
  slaDays         Int       @default(7)
  slaDeadline     DateTime
  assignedTeam    String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  resolvedAt      DateTime?
  
  user            User      @relation(fields: [userId], references: [id])
  communications  TicketCommunication[]
}

model TicketCommunication {
  id        String   @id @default(uuid())
  ticketId  String
  fromRole  String   // CUSTOMER, BANK
  message   String
  createdAt DateTime @default(now())
  
  ticket    SupportTicket @relation(fields: [ticketId], references: [id])
}

model BranchAppointment {
  id             String   @id @default(uuid())
  userId         String
  branchCode     String
  appointmentDate DateTime
  timeSlot       String   // e.g., "10:00 AM - 10:30 AM"
  reason         String
  assignedRmId   String?
  status         String   @default("SCHEDULED") // SCHEDULED, CONFIRMED, COMPLETED, CANCELLED
  reminderSent   Boolean  @default(false)
  createdAt      DateTime @default(now())
  
  user           User     @relation(fields: [userId], references: [id])
}

model OfferInteraction {
  id              String    @id @default(uuid())
  userId          String
  outreachLogId   String    // Links to OutreachLog (TRUTH engine)
  viewedAt        DateTime?
  action          String?   // ACCEPTED, DECLINED, EXPLORING, IGNORED
  declineReason   String?
  actionTakenAt   DateTime?
  
  user            User      @relation(fields: [userId], references: [id])
}

model CustomerSpendingBudget {
  id          String   @id @default(uuid())
  userId      String
  category    String   // HOUSING, GROCERIES, TRANSPORT, ENTERTAINMENT, etc.
  monthlyLimit Float
  isActive    Boolean  @default(true)
  updatedAt   DateTime @updatedAt
  
  user        User     @relation(fields: [userId], references: [id])
}
```

### 18.2 Privacy & Data Minimization

- Transaction categorization ML model runs on-premise — raw transaction descriptions never leave the bank's VPC
- SAGE conversation content is stored encrypted at rest (AES-256)
- Voice input is processed client-side (browser Web Speech API) — audio never transmitted to server
- Regional language translation via LLM API: PII is scrubbed before transmission (account numbers, names replaced with placeholders)
- Customer financial data used for SAGE context is passed as anonymized behavioral signals, not raw account data, when external LLM APIs are called

---

## 19. Customer UX Principles

### 19.1 The 5 Core Design Commitments

**1. Never surprise the customer with money leaving their account**
Every automatic action (auto-renewal, standing instruction, auto-debit) sends a notification minimum 3 days in advance, with a clear "cancel" option where permitted.

**2. Every recommendation comes with a "why"**
No SAGE suggestion, no offer card, no nudge appears without an explanation of why TrustEdge thinks it is relevant. Customers are intelligent adults who deserve to understand the reasoning.

**3. Stress hides selling**
When a customer shows financial stress signals, all promotional content disappears automatically. The portal never sells to a distressed customer.

**4. Declining is always easy**
"Not interested", "No thanks", "Not now" are always equally prominent as acceptance options. No dark patterns — no hidden opt-out buttons, no guilt-trip copy, no false urgency.

**5. The customer controls their relationship with the bank, not the other way around**
Communication preferences, data consents, language choices, offer frequency — all controlled by the customer, with real effect, explained in plain language.

### 19.2 Language & Tone Standards

**All customer-facing copy must:**
- Use first person for the bank ("We", not "The Bank")
- Address the customer by first name in SAGE conversations; formal in official communications
- Use Indian financial context: "your EMI", "your FD", "your SIP" — not "your fixed-term deposit product"
- Express amounts in lakh/crore system: ₹2.5 Lakhs, not ₹2,50,000
- Use active voice: "Your FD matures on June 15" not "The maturity of your Fixed Deposit account is scheduled for..."
- Contain zero unexplained jargon: every technical term has an inline explanation or glossary link

**Emotional tone by context:**
- Normal operations: Warm, helpful, clear
- Financial stress: Empathetic, slow-paced, validating — never clinical
- Security alerts: Clear, firm, not alarming — never creates panic
- Milestone moments (goal reached, salary credited, EMI completed): Celebratory and human

### 19.3 Error & Edge Case Design

**Empty states** (no data available yet):
- Never show a blank screen or "No data found"
- Explain why the section is empty and what the customer can do
- Example: "You don't have any FDs yet. [Open your first FD] or [Ask SAGE to explain how FDs work]"

**Loading states:**
- Skeleton placeholders matching the layout of expected content
- Never a blank spinner for more than 500ms
- Progressive loading: show available data immediately while rest loads

**Failed actions:**
- Plain English error message: "We couldn't process that right now. Please try again or contact support." — never technical error codes shown to customers
- Always provide a next step: "Try again" or "Contact support" — never a dead end
- Preserve entered data: if form submission fails, don't clear the form

---

## 20. Implementation Phasing

### Phase 1: Foundation (Months 1–3)
**Goal**: Give customers a real portal experience, not just a chatbot.

Deliverables:
- [ ] Customer Home Dashboard (financial snapshot, priority actions, SAGE quick-start)
- [ ] My Finances — Account Overview & Transaction List with AI categorization
- [ ] SAGE with cross-session context and conversation history
- [ ] SAGE guided flows for FD maturity, EMI stress, SIP setup
- [ ] SAGE proactive nudges (5 most common trigger types)
- [ ] My Products — FD, SIP, Loan detail views with management actions
- [ ] Offers For Me — transparent offer cards with comparison and conditions
- [ ] Notification Center
- [ ] Communication Preferences (basic: opt-in/out, channel selection)
- [ ] Global language toggle (EN / HI / TE) for UI and SAGE
- [ ] Customer-facing stress support card (non-intrusive, dismissible)
- [ ] Emergency account freeze

### Phase 2: Depth & Trust (Months 4–6)
**Goal**: Deepen financial engagement and build customer trust.

Deliverables:
- [ ] Goal Planning & Savings Engine (full goal creation and tracking)
- [ ] Spending Insights & Budget Setup
- [ ] Net Worth Tracker
- [ ] FD Maturity Planner (guided decision flow)
- [ ] Loan EMI Stress Pathway & Restructuring Request Flow
- [ ] SAGE voice output (TTS in Hindi and Telugu)
- [ ] Privacy Dashboard & Consent Management
- [ ] Financial Transparency Hub (fee schedule, educational articles)
- [ ] Complaint Ticket System with full lifecycle tracking
- [ ] Branch Appointment Booking
- [ ] Improved SAGE feedback (layered: thumbs → reason → session rating)
- [ ] Senior / Simplified UI mode
- [ ] PWA with offline support for basic data

### Phase 3: Scale & Intelligence (Months 7–12)
**Goal**: Full personalization, multi-bank intelligence, accessibility excellence.

Deliverables:
- [ ] Account Aggregator integration (consented multi-bank financial view)
- [ ] Advanced goal analytics (goal projection under stress, scenario modeling)
- [ ] Real-time EMI impact calculator (rate change → how does my EMI change?)
- [ ] SAGE session export (PDF download, email summary)
- [ ] Live RM communication channel (bank-mediated WhatsApp from within portal)
- [ ] Full WCAG 2.1 AA accessibility audit and remediation
- [ ] Native Android app (for advanced device features: biometric, camera, GPS)
- [ ] Network contagion transparency: "Your family member also banks with us — your accounts are protected by the same guarantee"
- [ ] Tax filing season features: 26AS data, interest certificate downloads, 80C investment tracker

---

## Appendix A: SAGE Conversation Quality Rubric

Used by Admin team for flagged conversation review:

| Quality Dimension | Poor (1) | Acceptable (3) | Excellent (5) |
|---|---|---|---|
| Accuracy | Factually incorrect | Mostly correct with minor gaps | Fully accurate, verifiable |
| Relevance | Misses the customer's actual question | Partially addresses the question | Directly answers what was asked |
| Clarity | Jargon-heavy, confusing | Understandable with some effort | Instantly clear, no jargon |
| Empathy (when applicable) | Clinical or dismissive | Neutral | Warm, validating, human |
| Actionability | No clear next step | Suggests something vague | Clear, specific, feasible next step |
| Appropriateness | Crosses into upselling, legal advice, or guarantees | Borderline acceptable | Stays firmly within guardrails |

---

## Appendix B: Regional Language Glossary — Core Financial Terms

| English Term | Hindi | Telugu |
|---|---|---|
| Fixed Deposit | सावधि जमा (Savadhi Jama) | స్థిర డిపాజిట్ (Sthira Deposit) |
| SIP (Systematic Investment Plan) | व्यवस्थित निवेश योजना | క్రమపద్ధతి పెట్టుబడి పథకం |
| EMI (Equated Monthly Installment) | समान मासिक किस्त | సమాన నెలవారీ వాయిదా |
| Interest Rate | ब्याज दर (Byaj Dar) | వడ్డీ రేటు (Vaddi Retu) |
| Net Worth | कुल संपत्ति (Kul Sampatti) | నికర విలువ (Nikar Viluva) |
| Balance | शेष राशि (Shesh Rashi) | నిల్వ (Nilva) |
| Savings | बचत (Bachat) | పొదుపు (Podupu) |
| Loan | ऋण (Rin) | రుణం (Runam) |
| Credit Score | क्रेडिट स्कोर | క్రెడిట్ స్కోరు |
| Nominee | नामांकित (Namankeet) | నామినీ (Nominee) |

---

*TrustEdge Customer Portal Strategy v4.0*
*Prepared for: Team Tech Bugs!! — Engineering & Product Implementation*
*Classification: Internal Engineering Reference*
