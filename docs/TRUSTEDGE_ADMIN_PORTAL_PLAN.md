# TrustEdge Admin Portal — Enterprise Strategy & Implementation Plan
## Production-Ready Admin Portal Redesign
### Version 4.0 · For Engineering & Product Implementation

---

## Table of Contents

1. [Strategic Overview & Gap Analysis](#1-strategic-overview--gap-analysis)
2. [Role Architecture & Access Control](#2-role-architecture--access-control)
3. [Portal Navigation & Module Structure](#3-portal-navigation--module-structure)
4. [Command Center Dashboard — Redesigned](#4-command-center-dashboard--redesigned)
5. [Retention Case Management System](#5-retention-case-management-system)
6. [Outreach Engine Admin Controls](#6-outreach-engine-admin-controls)
7. [SAGE AI Admin Monitoring & Governance](#7-sage-ai-admin-monitoring--governance)
8. [Predictive Intelligence Hub](#8-predictive-intelligence-hub)
9. [PULSE Feedback Loop Operations](#9-pulse-feedback-loop-operations)
10. [Escalation & Approval Workflows](#10-escalation--approval-workflows)
11. [AI Governance & Explainability Layer](#11-ai-governance--explainability-layer)
12. [Audit, Compliance & Reporting](#12-audit-compliance--reporting)
13. [Alert & Notification Management](#13-alert--notification-management)
14. [Performance & RM Operations](#14-performance--rm-operations)
15. [System Health & Infrastructure Monitoring](#15-system-health--infrastructure-monitoring)
16. [Feature Rationalization Matrix](#16-feature-rationalization-matrix)
17. [Enterprise UX Principles](#17-enterprise-ux-principles)
18. [Scalability & Integration Roadmap](#18-scalability--integration-roadmap)
19. [Data Architecture Improvements](#19-data-architecture-improvements)
20. [Implementation Phasing](#20-implementation-phasing)

---

## 1. Strategic Overview & Gap Analysis

### 1.1 What the Current Strategy Gets Right

The existing TrustEdge Admin Portal (CommandCenter) has a solid conceptual foundation:
- Telemetry surface exists (AUM protected, conversion lift, active campaigns)
- Risk scoring with bell curve visualization
- Campaign telemetry with A/B variant tracking
- Role mentions (RM, Branch Manager, Admin)

These are genuinely useful starting points. However, the current strategy treats the Admin Portal as a **reporting dashboard** rather than an **operational command system**. Real enterprise admin teams do not primarily read dashboards — they triage queues, approve actions, intervene in workflows, investigate anomalies, and manage exceptions.

### 1.2 Critical Gaps Identified

#### Workflow Gaps
- **No task queue or operational inbox**: RMs and admins have no prioritized work queue. There is no concept of "here are the 8 things you need to do today, in order."
- **No escalation logic**: When an AI recommendation fails or a customer escalates a complaint, there is no defined path to human resolution.
- **No approval layer**: High-value campaigns, large incentive allocations, and sensitive outreach actions happen without any human authorization checkpoint.
- **No case lifecycle**: Retention activities have no start, middle, and end. A "stress alert" appears but there is no structure for who owns it, what was done, and what the outcome was.
- **No SLA tracking**: There is no mechanism to know if an RM followed up within the required window, or if a campaign response expired.

#### Operational Gaps
- **Vanity metrics dominate**: "₹4.82 Crores AUM Protected" is a headline metric with no drill-down. Admins cannot investigate which accounts, which RMs, or which campaigns drove it.
- **No customer journey visibility**: Admins cannot see where a specific customer currently sits in the retention lifecycle — what outreach they received, what SAGE conversations they had, what their risk trend looks like.
- **No intervention controls**: Admins cannot pause a campaign, override an AI recommendation, or manually reassign a case to a different RM from the portal.
- **SAGE has no admin visibility**: Admin cannot see SAGE conversation quality, flag poor responses, review sentiment outcomes, or monitor model confidence scores.
- **Translation has no quality tracking**: There is no feedback mechanism to flag bad translations or track regional language conversation success rates.

#### AI Governance Gaps
- **Black-box recommendations**: AI churn scores appear without explanation. Admins and RMs cannot understand why a customer was flagged, making it impossible to challenge or act confidently.
- **No confidence scoring**: All AI outputs are treated equally regardless of prediction certainty.
- **No override mechanism**: If the AI is wrong, there is no formalized way to correct it and feed that correction back into the model.
- **No monitoring of AI recommendation acceptance**: The system does not track whether RMs are accepting or ignoring AI suggestions, making it impossible to measure model trust.

#### Scalability Gaps
- **Single monolithic dashboard view**: The current CommandCenter is described as a single panel with three views. This does not scale to multi-branch, multi-region operations.
- **No branch hierarchy management**: Branch managers, regional managers, and national administrators need hierarchical views with appropriate data scoping.
- **No multi-tenancy design**: Future expansion to multiple PSBs requires tenant isolation at the data and UI level.

---

## 2. Role Architecture & Access Control

### 2.1 Role Hierarchy

The Admin Portal must support a five-tier operational role structure reflecting real PSB organizational hierarchy:

```
NATIONAL ADMIN
    │
    ├── REGIONAL MANAGER (Zone: North / South / East / West / Central)
    │       │
    │       ├── BRANCH MANAGER (Branch Code: specific branch)
    │       │       │
    │       │       ├── RELATIONSHIP MANAGER (RM Code: assigned portfolio)
    │       │       │
    │       │       └── SUPPORT AGENT (Customer service & complaint handling)
    │       │
    │       └── COMPLIANCE OFFICER (Read-only audit access, cross-branch)
    │
    └── SYSTEM ADMIN (Infrastructure, model governance, API management)
```

### 2.2 Role-to-Feature Access Matrix

| Feature / Module | National Admin | Regional Mgr | Branch Mgr | RM | Support Agent | Compliance Officer | System Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| National Analytics Dashboard | ✅ | Read (own region) | ❌ | ❌ | ❌ | ✅ Read | ✅ |
| Branch Performance View | ✅ | ✅ own region | ✅ own branch | ❌ | ❌ | ✅ Read | ✅ |
| Customer Risk Profiles | ✅ | ✅ | ✅ | ✅ own portfolio | ❌ | ✅ Read | ✅ |
| Campaign Launch & Approval | ✅ Approve | ✅ Approve regional | ✅ Approve branch | Propose only | ❌ | ❌ | ✅ |
| SAGE Conversation Logs | ✅ | ✅ | ✅ | ✅ own customers | ❌ | ✅ Read | ✅ |
| Retention Case Management | ✅ | ✅ | ✅ | ✅ own cases | ✅ complaint cases | ❌ | ✅ |
| AI Governance Controls | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ Read | ✅ |
| Outreach Override | ✅ | ✅ | ✅ own branch | ❌ | ❌ | ❌ | ✅ |
| Audit Logs | ✅ | ✅ own region | ✅ own branch | ✅ own actions | ✅ own actions | ✅ Full Read | ✅ |
| System Health | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Model Retraining Controls | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 2.3 Session & Security Requirements

- **Session timeout**: 15 minutes of inactivity for all roles (configurable per institution).
- **MFA requirement**: Mandatory for National Admin, Regional Manager, System Admin, Compliance Officer.
- **Concurrent session restriction**: Maximum 1 active session per RM, 3 per Branch Manager.
- **IP allowlisting**: System Admin and Compliance Officer access restricted to registered internal network IPs.
- **Action logging**: Every create, update, delete, approve, and override action is written to the immutable audit log with actor identity, timestamp, and before/after state.
- **Data masking**: Account numbers and PAN/Aadhaar references are masked by default for RM and Support Agent roles. Full values accessible only via logged reveal action.

---

## 3. Portal Navigation & Module Structure

### 3.1 Primary Navigation Structure

The Admin Portal should be organized around **operational intent**, not system components. Users should think "I want to manage retention cases" — not "I want to open the Retention Hub module."

```
TRUSTEDGE ADMIN PORTAL
│
├── 🏠  MY WORKSPACE          (Personalized daily action queue — role-adaptive)
│
├── 📊  COMMAND CENTER        (Executive dashboard — aggregated health, risk, revenue)
│
├── 🎯  RETENTION CASES       (Case-based retention management — triage, assign, resolve)
│
├── 📣  OUTREACH MANAGER      (Campaign creation, approval, execution, A/B management)
│
├── 🤖  SAGE MONITOR          (AI conversation quality, escalations, model oversight)
│
├── 🔮  PREDICTIONS HUB       (Churn scoring, Monte Carlo results, risk cohorts)
│
├── 👥  CUSTOMER 360           (Individual customer journey — full context view)
│
├── 👔  RM OPERATIONS          (RM workloads, performance, portfolio health)
│
├── 🔔  ALERTS CENTER          (Consolidated alert triage with priority routing)
│
├── ⚙️  AI GOVERNANCE          (Model oversight, confidence monitoring, override logs)
│
├── 📋  AUDIT & COMPLIANCE     (Immutable logs, RBI reports, RBAC audit trails)
│
└── 🖥️  SYSTEM HEALTH          (Infrastructure, API health, Kafka lag, model status)
```

### 3.2 My Workspace — Role-Adaptive Action Inbox

This is the most important page in the entire portal. When a user logs in, they land here — not on a generic dashboard. The Workspace is built around the concept: **"What do I need to do right now?"**

**For an RM**, Workspace shows:
- 📌 Priority queue: Top 5 customers to call today (AI-ranked by revenue at risk × time urgency)
- 🔔 Unacknowledged stress alerts assigned to their portfolio
- 📞 Pending callback commitments logged in previous sessions
- 📈 3 customers whose risk score escalated overnight
- 💬 2 SAGE conversations that ended without resolution (flagged for follow-up)
- ✅ Outreach outcomes to record (calls made yesterday with no outcome logged)

**For a Branch Manager**, Workspace shows:
- 🚨 Critical-risk customers in branch portfolio without active retention case
- 📋 Campaign approval requests awaiting sign-off
- 📊 Yesterday's RM activity summary (calls made vs. calls due)
- ⚠️ SLA breaches: cases open > 5 days without update
- 💰 Branch AUM at risk this week (with drill-down)

**For a Regional Manager**, Workspace shows:
- 🗺️ Branch health heatmap: which branches have highest unresolved risk exposure
- 📣 Regional campaign performance vs. last period
- 🔁 Escalated cases awaiting regional approval
- 📉 Branches with declining RM conversion rates (intervention needed)

**Design principle**: Every item in the Workspace has exactly one primary action button. No item is purely informational without a next step.

---

## 4. Command Center Dashboard — Redesigned

### 4.1 Design Philosophy Shift

The current Command Center is a **scoreboard**. The redesigned Command Center is a **situation room**. Every metric displayed must answer: "What does this mean for what we do next?"

Vanity metrics removed:
- ❌ "₹4.82 Crores AUM Protected" (static, non-actionable headline)
- ❌ "4.8x Conversion Lift" (aggregate ratio without operational meaning)
- ❌ Generic bell curve without drill-down

Replaced with actionable insight panels:

### 4.2 Redesigned Dashboard Panels

**Panel 1: Live Risk Exposure Summary**
```
┌─────────────────────────────────────────────────────────┐
│  LIVE RISK EXPOSURE                          [This Week] │
├──────────────────────┬──────────────────────────────────┤
│  🔴 Critical Risk    │  23 customers │ ₹1.8Cr at risk   │
│     (Score > 0.85)   │  [12 unassigned — Assign Now]    │
├──────────────────────┼──────────────────────────────────┤
│  🟡 High Risk        │  67 customers │ ₹3.2Cr at risk   │
│     (Score 0.65–0.85)│  [34 with active cases]          │
├──────────────────────┼──────────────────────────────────┤
│  🟢 Moderate Risk    │  142 customers│ ₹2.1Cr at risk   │
│     (Score 0.45–0.65)│  [Automated nudge active]        │
└──────────────────────┴──────────────────────────────────┘
                                [View All Risk Cohorts →]
```

**Panel 2: Retention Operations Health**
```
┌─────────────────────────────────────────────────────────┐
│  RETENTION OPERATIONS                        [Today]     │
├──────────────────────────────────────────────────────────┤
│  Open Cases           │  47 active   │ 8 overdue (>5d)  │
│  Pending Outreach     │  134 queued  │ 23 suppressed    │
│  RM Calls Due Today   │  89 assigned │ 31 completed     │
│  SLA Breaches         │  🔴 8 cases  │ [View & Resolve] │
└──────────────────────────────────────────────────────────┘
```

**Panel 3: Campaign Performance (Live)**
```
┌─────────────────────────────────────────────────────────┐
│  ACTIVE CAMPAIGNS                            [Live]      │
├────────────────┬──────────────┬──────────────────────────┤
│ Campaign Name  │ Channel      │ Engagement │ Conversions │
├────────────────┼──────────────┼────────────┼─────────────┤
│ Salary Ret.    │ WhatsApp     │ 78%        │ 34 (↑ 12%)  │
│ FD Re-engage   │ RM Call      │ 62%        │ 19 (↓ 5%)   │
│ SIP Recovery   │ In-App Nudge │ 41%        │ 8  (new)    │
├────────────────┴──────────────┴────────────┴─────────────┤
│  ⚠️ FD Re-engage conversion declining — Review Variant B │
└──────────────────────────────────────────────────────────┘
```

**Panel 4: SAGE AI Health**
```
┌─────────────────────────────────────────────────────────┐
│  SAGE ASSISTANT HEALTH                  [Last 24 Hours]  │
├──────────────────────────────────────────────────────────┤
│  Total Conversations:  284                               │
│  Avg. Satisfaction:    4.2 / 5.0  (↓ from 4.4 yesterday)│
│  Unresolved Escalations: 🔴 6     [Review Now]           │
│  Low-confidence responses flagged: 14  [Review]          │
│  Translation success rate: 96%                           │
└──────────────────────────────────────────────────────────┘
```

**Panel 5: Revenue Protection Trend**
```
7-day rolling view of:
- AUM protected by successful retention conversions (daily bar)
- AUM lost despite intervention (daily bar, red)
- Net retention rate % (line overlay)

Each bar is clickable → drills into which campaigns, which RMs, which customers.
```

**Panel 6: System & Model Health (compact)**
```
┌──────────────────────────────────────────────────────────┐
│  SYSTEM STATUS                                           │
│  GNN Model: ✅ Healthy  │ Last retrain: 6h ago           │
│  Kafka Lag: ✅ 0.2s     │ PULSE PPO: ✅ Running          │
│  SAGE LLM:  ✅ Online   │ Translation API: ⚠️ Degraded   │
└──────────────────────────────────────────────────────────┘
```

### 4.3 Dashboard Filter Bar

Every Command Center panel respects a global filter bar:
- **Scope**: National / Region / Branch / RM
- **Time Window**: Today / This Week / This Month / Custom Range
- **Risk Tier**: All / Critical / High / Moderate
- **Campaign**: All / Specific campaign filter

---

## 5. Retention Case Management System

This is the most operationally important module — and the most underdeveloped in the current strategy. Real retention teams operate through **cases**, not raw alerts.

### 5.1 Case Lifecycle

Every at-risk customer eventually enters a Retention Case. The lifecycle:

```
SIGNAL DETECTED
     │
     ▼
CASE AUTO-CREATED (by TRUSTEDGE CORE when risk > threshold)
     │
     ├── Case Priority: CRITICAL / HIGH / MODERATE (inherited from risk score)
     ├── Case Type: CHURN_RISK / STRESS_ALERT / NPA_RISK / COMPLAINT_ESCALATION
     ├── Auto-assigned to: RM based on customer portfolio mapping
     └── SLA set: Critical = 24h, High = 72h, Moderate = 7 days
     │
     ▼
TRIAGE (RM or Branch Manager)
     │
     ├── Accept case and review AI brief
     ├── Reassign to different RM / escalate to Branch Manager
     └── Flag AI recommendation as incorrect (sends to AI Governance)
     │
     ▼
ACTIVE INTERVENTION
     │
     ├── Log call attempt (outcome: reached / no answer / callback scheduled)
     ├── Select outreach channel via TRUTH (SAGE generates talk track)
     ├── Log customer response and sentiment
     └── Request incentive approval (if offer needed above RM authority)
     │
     ▼
RESOLUTION
     │
     ├── RETAINED: Customer accepted offer / re-engaged
     ├── PARTIAL: Some products retained, others lost
     ├── LOST: Customer fully churned despite intervention
     ├── MONITORING: Risk reduced but not resolved — case kept open at lower priority
     └── FALSE POSITIVE: AI was wrong — flagged to AI Governance
     │
     ▼
POST-CASE LEARNING
     │
     └── Outcome fed to PULSE for PPO reward signal
```

### 5.2 Case Detail View

Every Retention Case opens a comprehensive Case Detail page:

**Header:**
- Customer name (masked account number), branch, RM owner, case type, priority badge, SLA countdown timer, case age

**Tab 1: Risk Intelligence**
- Current churn score with 30-day trend sparkline
- Top 5 risk signals that triggered the case (from GNN explainability layer)
  - Example: "Salary credit dropped 60% last month", "3 SIPs cancelled in 14 days", "Mobile app last opened 23 days ago"
- Monte Carlo projection: chart showing 10th / 50th / 90th percentile revenue loss paths over 90 days
- AI confidence score: "This prediction is based on 847 similar historical patterns. Confidence: 82%"

**Tab 2: Customer 360**
- Transaction timeline (last 90 days) with AI-annotated anomaly markers
- Product holdings: savings, FDs, SIPs, loans — with balance trends
- Complaint history: unresolved tickets, resolution times, satisfaction scores
- SAGE conversation history: all AI chat sessions with sentiment scores
- Previous outreach: all campaigns sent, channels used, outcomes recorded

**Tab 3: Recommended Actions**
- AI-generated action plan (SAGE + TRUTH joint output):
  - Primary recommendation: "Schedule RM call within 24 hours. Lead with FD rate match offer. Customer profile indicates rate sensitivity."
  - Secondary: "If call unanswered, trigger WhatsApp with personalized rate comparison in Hindi."
  - Fallback: "Branch visit invitation if no digital engagement within 5 days."
- Each recommendation shows: confidence score, basis, expected conversion probability
- RM can: Accept recommendation / Modify it / Reject it (with mandatory reason for AI Governance)

**Tab 4: Intervention Log**
- Chronological log of all actions taken on this case
- Each entry: timestamp, actor, action type, outcome, notes
- RM call logs: duration, sentiment (if voice analytics active), outcome recorded

**Tab 5: Approval Requests**
- Incentive requests pending approval (e.g., "Requesting ₹500 cashback offer — Branch Manager approval needed")
- Approval status, approver notes, SLA

### 5.3 Case Queue Views

**Triage Queue** (Branch Manager view):
- All unassigned or newly created cases in branch
- Sortable by: Priority, SLA time remaining, AUM at risk, customer tenure
- Bulk assign selected cases to specific RM

**My Cases** (RM view):
- Personal case queue sorted by SLA urgency
- Color-coded: Red = SLA breached, Amber = SLA < 24h, Green = within SLA
- Quick-action buttons: Log Call, Send TRUTH Outreach, Request Escalation

**Escalation Queue** (Branch Manager / Regional Manager):
- Cases escalated by RMs needing higher authority action
- Approval requests for offers above RM's incentive authority limit

### 5.4 SLA Enforcement Logic

```
Case Created → SLA Timer starts
     │
     ├── No RM action within 50% of SLA → Auto-notification to RM + Branch Manager
     │
     ├── No action within 80% of SLA → Branch Manager alert + Workspace priority bump
     │
     └── SLA breached → Case auto-escalates to Branch Manager
                      → Recorded as SLA breach in RM performance scorecard
                      → Audit log entry created
```

---

## 6. Outreach Engine Admin Controls

### 6.1 Campaign Lifecycle (Full Enterprise Flow)

The current strategy describes TRUTH as an "orchestrator" but does not define how campaigns are created, approved, monitored, and closed.

**Campaign Lifecycle:**

```
DRAFT → PENDING APPROVAL → APPROVED → ACTIVE → PAUSED/COMPLETED → ARCHIVED
```

**DRAFT:** Campaign creator (RM or Branch Manager) defines:
- Target segment (filter criteria: risk score range, product type, branch, tenure, balance tier)
- Estimated reach (auto-calculated based on filters)
- Channel priority sequence (from TRUTH matrix)
- A/B variant definitions (Variant A message / Variant B message)
- Incentive budget (if applicable) — requires approval if above authority limit
- Start date, end date, frequency cap override (if any)
- AI auto-generate content: SAGE generates talk tracks and copy for both variants based on target segment's Churn DNA profile

**PENDING APPROVAL:** Campaign submitted for approval. Approval routing is automatic:
- Budget within RM authority limit (e.g., < ₹5,000 total) → Branch Manager approval
- Budget ₹5,000 – ₹50,000 → Regional Manager approval
- Budget > ₹50,000 or multi-branch reach → National Admin approval

**APPROVED:** Campaign scheduled. Pre-launch checklist auto-validated:
- Frequency cap check: ensures no customer in segment received communication within 7 days
- Regulatory flag check: no customer on do-not-contact list
- Translation readiness: if regional language selected, translations confirmed

**ACTIVE:** Live execution. Admin controls available:
- ⏸️ Pause campaign (with reason logging)
- 🛑 Stop campaign (with reason — permanently halts)
- 📊 View live engagement metrics
- 🔄 Swap winning A/B variant (if statistical significance reached)
- ✏️ Edit messaging (minor corrections — triggers re-approval if budget changes)

**PAUSED/COMPLETED:** Post-campaign:
- Auto-generated performance report: reach, engagement, conversions, cost-per-conversion, AUM protected
- Outcome-to-PULSE feed: all individual customer outcomes exported to PULSE for RL reward signal processing

### 6.2 Campaign Creation — AI-Assisted Segment Builder

Replace manual filter configuration with a conversational segment builder:

The admin types: "Target customers who have had a salary credit drop of more than 40% in the last 60 days, hold at least one FD, and have not engaged with the app in 30 days, in Hyderabad branches."

The system:
1. Parses intent and translates to filter query
2. Shows estimated segment size: "This targets 134 customers across 3 Hyderabad branches"
3. Shows risk distribution within segment: "82 Critical, 47 High, 5 Moderate"
4. Shows AUM exposure: "Total AUM at risk in this segment: ₹6.7 Crores"
5. Allows RM to refine or accept

### 6.3 Frequency Cap & Suppression Management

Admins must be able to:
- View which customers are currently suppressed (received communication within 7-day window) and for how long
- Manually suppress a specific customer from all automated outreach (e.g., customer requested no contact)
- View the global suppression list with reason codes
- Create a permanent do-not-contact flag for specific customers (regulatory or customer request basis)

### 6.4 Channel Performance Analytics

For each channel, per time period:
```
┌──────────────────────────────────────────────────────────────────────┐
│ CHANNEL: WhatsApp Business                           [Last 30 Days]  │
├──────────────────┬───────────────────────────────────────────────────┤
│ Messages Sent    │ 1,247                                             │
│ Delivered        │ 1,191 (95.5%)                                     │
│ Read             │ 847 (71.1%)                                       │
│ Link Clicked     │ 412 (48.6% of read)                               │
│ Converted        │ 156 (37.8% of clicked)                            │
│ Opted Out        │ 23 (1.9%)  ← 🔴 Above 1.5% threshold — Alert     │
│ Cost/Conversion  │ ₹847                                              │
├──────────────────┴───────────────────────────────────────────────────┤
│ Trend: Opt-out rate increasing — Review message content              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 7. SAGE AI Admin Monitoring & Governance

### 7.1 What Admin Needs to See About SAGE

The current strategy treats SAGE as a customer-facing tool with no admin visibility. In production, every AI-powered conversation system needs admin oversight. SAGE Monitor provides:

### 7.2 SAGE Conversation Dashboard

**Volume & Quality Metrics (real-time):**
- Total active conversations right now
- Conversations by topic (Budgeting, Saving, Debt, Investing, General)
- Average session duration
- Helpful / Not Helpful feedback ratio (from customer-side thumbs)
- Escalation rate: % of conversations that resulted in a human handoff request

**Flagging System:**

Conversations are automatically flagged for admin review when:
- Customer explicitly rates response as "Not Helpful" twice in a session
- SAGE confidence score drops below 0.65 for any response
- Customer uses distress keywords (detected by sentiment layer) — e.g., "I can't pay my EMI"
- SAGE response contains a factual error detected by the post-response validation check
- Conversation topic drifts outside the 5 permitted tracks (Budgeting, Saving, Debt, Investing, General)
- Translation confidence is below threshold for regional language responses

**Flagged Conversation Review Queue:**
- Admin sees conversation transcript with AI confidence scores per message
- Can mark as: Acceptable / Needs Improvement / Model Error
- For Model Errors: admin adds corrected response → feeds into RLHF pipeline
- Can escalate conversation to human support agent

### 7.3 SAGE Quality Metrics Over Time

- Weekly trend: average confidence score per topic category
- Topic accuracy rate: % of budgeting responses rated helpful vs. investing responses
- Regional language performance: Hindi helpfulness rate vs. Telugu helpfulness rate
- Response latency: average time-to-first-token, average full response time

### 7.4 Human Handoff System

When a SAGE conversation requires human intervention:

```
Customer types distress message OR SAGE flags low confidence
     │
     ▼
SAGE presents: "I'd like to connect you with a banking advisor. 
               Would you like me to schedule a call?"
     │
     ├── Customer accepts → Retention case auto-created → 
     │                       Assigned to RM → Appears in RM Workspace queue
     │
     └── Customer declines → SAGE continues with a logged caution flag
```

Admin can configure: auto-handoff triggers, handoff messaging tone, routing logic (route to RM vs. Support Agent based on conversation topic).

### 7.5 Translation Quality Management

- **Translation audit log**: Every translation request with source text, translated output, target language, and method used (LLM API or offline dictionary)
- **Fallback rate**: % of translations served from offline dictionary vs. live API (high fallback rate = API issue)
- **Customer feedback on translations**: "Was this translation helpful?" flag per translated message
- **Admin correction tool**: Admin can correct a stored translation in the offline dictionary and it is immediately effective for all future identical source texts

---

## 8. Predictive Intelligence Hub

### 8.1 Risk Cohort Management

Replace the current "bell curve" visualization with an operational cohort management interface:

**Risk Cohorts (auto-defined, admin-adjustable):**

| Cohort | Risk Score | Count | Avg AUM | Default Action | Status |
|---|---|---|---|---|---|
| Code Red — Immediate Action | > 0.85 | 23 | ₹7.8L | RM call within 24h | Active |
| High Risk — Active Retention | 0.70 – 0.85 | 67 | ₹4.2L | Personalized outreach + case | Active |
| At Risk — Watch & Nudge | 0.55 – 0.70 | 142 | ₹2.1L | Automated channel outreach | Active |
| Early Warning — Monitoring | 0.40 – 0.55 | 289 | ₹1.4L | In-app nudge only | Active |
| Stable — Engagement | < 0.40 | 4,291 | ₹0.8L | Standard engagement | Monitoring |

Admin can:
- Adjust threshold boundaries per cohort
- Override default action for a cohort
- Manually move a customer between cohorts with reason logging

### 8.2 Risk Score Explainability Panel

For every customer risk score, admin and RM see a ranked list of contributing signals:

```
┌────────────────────────────────────────────────────────────────────┐
│  CHURN RISK SCORE: 0.87 (Critical)        Confidence: 89%         │
├────────────────────────────────────────────────────────────────────┤
│  Top Risk Signals (GNN Feature Attribution):                       │
│                                                                    │
│  1. ████████████████░░░░ Primary salary credit stopped  (+0.31)   │
│  2. ████████████░░░░░░░░ 3 SIP cancellations in 21 days (+0.22)   │
│  3. ████████░░░░░░░░░░░░ Mobile app login gap: 34 days  (+0.17)   │
│  4. ██████░░░░░░░░░░░░░░ ₹2.1L transfer to Paytm wallet (+0.12)   │
│  5. ████░░░░░░░░░░░░░░░░ FD matured, not renewed        (+0.05)   │
├────────────────────────────────────────────────────────────────────┤
│  Network Contagion: Spouse account shows similar pattern           │
│  → Linked customer also at elevated risk (0.61)                    │
├────────────────────────────────────────────────────────────────────┤
│  [Challenge This Score]  [View Full Signal History]  [Run What-If] │
└────────────────────────────────────────────────────────────────────┘
```

**"Challenge This Score" Button:**
Opens a form where RM or Branch Manager provides context the model may lack:
- "Customer was on maternity leave — salary interruption is temporary"
- "SIP cancellation was due to SIP provider issue, not churn intent"
This challenge creates an AI Governance record and informs PULSE's contextual override layer.

**"Run What-If" Simulation:**
Admin can simulate: "If this customer renews their FD and resumes SIP — what does the risk score drop to?" Runs a 30-second Monte Carlo micro-simulation and displays projected risk trajectory.

### 8.3 Monte Carlo Results Viewer

For customers with active Ghost Journey simulations:

**Summary view:**
- P10 / P50 / P90 revenue loss projections over 90 days
- Most probable churn path (the median simulation outcome)
- Key inflection points: "Day 18 — high probability of FD liquidation if no intervention"

**Campaign ROI Calculator (integrated):**
- Inputs: Estimated intervention cost (RM time + incentive budget)
- Output: Expected net return if intervention converts at historical rate
- Decision: System recommends "Intervene / Monitor / Suppress" with justification

### 8.4 Network Contagion View

Visual representation of customer relationship networks within a branch:
- Graph nodes = customer accounts
- Edge weight = relationship strength (joint accounts, family transfers, referral links)
- Color = risk score
- When a high-risk node is identified, immediately shows all connected nodes with their own risk scores
- Allows branch manager to identify "cluster churn risk" — when one departure threatens a family network

---

## 9. PULSE Feedback Loop Operations

### 9.1 PULSE Admin Dashboard

The current strategy defines PULSE as a background process. Admin needs operational visibility into the feedback loop.

**PULSE Status Panel:**
```
┌─────────────────────────────────────────────────────────────────┐
│  PULSE LEARNING ENGINE                               [Live]     │
├─────────────────────────────────────────────────────────────────┤
│  Last PPO Run:         3h 42m ago  │  Duration: 18 min          │
│  Next Scheduled Run:   In 20h 18m  │  Status: ✅ Healthy        │
│  Outcomes Ingested:    1,247       │  This 24h cycle            │
│  Reward Signal Quality: 0.74       │  (0.6–0.9 is healthy range)│
│  Policy Improvement:   +1.2%       │  Churn prediction accuracy │
│  Model Version:        v1.47       │                            │
├─────────────────────────────────────────────────────────────────┤
│  GNN Accuracy (Rolling 30d):  87.3%  (↑ from 74% at launch)    │
│  Channel MAB Probabilities:                                     │
│   RM Call: 42% │ WhatsApp: 31% │ In-App: 14% │ SMS: 8% │ ..   │
├─────────────────────────────────────────────────────────────────┤
│  ⚠️ Drift Alert: Email channel accuracy dropped 4.1% (>3% threshold)  │
│  → PPO update paused for Email. Last stable checkpoint restored. │
│  → Data Operations team notified.                               │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Outcome Recording Completeness

A critical operational gap: PULSE is only as good as the outcomes it receives. If RMs don't log call outcomes, PULSE has no reward signal.

**Outcome Recording Rate Tracker:**
- Per RM: % of assigned cases with outcome recorded within 48h of action
- Per Branch: Branch-level outcome recording rate
- Alert threshold: If branch rate falls below 75%, Branch Manager is notified
- Gamification: Weekly RM leaderboard for outcome recording completeness (not just conversions)

### 9.3 Reward Signal Audit

Admin can inspect what reward signals PULSE received in any given period:
- Breakdown: conversions / engagements / ignored / opted-out / churned
- Reward signal health: Is the distribution reasonable? (Too many -1.0 signals = model may over-suppress outreach)
- Manual reward correction: If an RM marked an outcome incorrectly, admin can correct it — change is retroactively applied to the PULSE record

### 9.4 Model Version Management

| Version | Deployed At | Churn Accuracy | Channel Policy | Status |
|---|---|---|---|---|
| v1.47 | 2 days ago | 87.3% | Updated MAB weights | 🟢 Active |
| v1.46 | 9 days ago | 86.1% | Stable | 🔵 Checkpoint |
| v1.45 | 16 days ago | 85.2% | Stable | 🔵 Checkpoint |
| v1.44 | 23 days ago | 83.7% | Pre-email fix | 🔵 Checkpoint |

Admin can: roll back to any checkpoint within 5 minutes, compare model versions side-by-side, lock current version (prevents retraining if system admin is investigating an issue).

---

## 10. Escalation & Approval Workflows

### 10.1 Incentive Approval Workflow

Real banking retention involves offers: rate match, cashback, fee waiver, gift vouchers. These require financial authorization. The approval workflow:

```
RM identifies customer needs incentive to convert
     │
     ├── RM selects incentive from approved catalogue
     │   (e.g., "FD Rate Uplift +0.25%", "₹500 Amazon voucher", "Annual fee waiver")
     │
     ├── System checks: Is this within RM authority limit? 
     │   (Authority limits defined by role in admin settings)
     │
     ├── YES → RM can apply directly. Logged to audit trail.
     │
     └── NO → Approval request auto-routed to Branch Manager
               ├── Branch Manager reviews: customer profile, risk score, expected retention value
               ├── Decision: Approve / Reject / Counter-offer
               └── Outcome notified to RM with reason
```

**Incentive Catalogue Management (Admin):**
- Define available incentives: name, type, value, eligibility criteria
- Set per-incentive authority limits: who can approve what
- Track incentive budget consumption per branch per month
- Alert when branch exhausts > 80% of monthly incentive budget

### 10.2 Campaign Approval Workflow

Already defined in Section 6.1. Additional detail:

**Approval Review Checklist (shown to approver):**
- ✅ Segment correctly defined (no at-risk customers excluded, no stable customers over-targeted)
- ✅ Budget within approved range
- ✅ Frequency cap respected for all customers in segment
- ✅ No customers on do-not-contact list in segment
- ✅ A/B variants are meaningfully different (not near-identical)
- ✅ Fallback channel defined
- ✅ End date set (campaigns cannot be open-ended)
- ⚠️ Translation not available for 34 Hindi-speaking customers in segment [Action required]

### 10.3 Model Intervention Approval

For significant model changes (retraining with new data schema, threshold adjustments, cohort boundary changes):
- System Admin proposes change in AI Governance module
- Change must be reviewed by National Admin + Compliance Officer
- All approvals logged with rationale
- Changes deployed only after dual approval
- Rollback plan must be documented before any change is approved

### 10.4 Escalation Routing Rules

Admin-configurable escalation rules:

| Trigger Condition | Escalation Target | SLA |
|---|---|---|
| Case open > 5 days, no RM action | Branch Manager | Immediate notification |
| Customer complains about unwanted contact | Support Agent + Branch Manager | 2 hours |
| AI score challenge submitted by RM | AI Governance officer | 24 hours |
| SAGE conversation flagged (distress keywords) | Support Agent | Immediate |
| Channel opt-out rate > 2% on active campaign | Campaign owner + Branch Manager | 4 hours |
| PULSE drift detected | System Admin + Data Ops | Immediate |
| Incentive approval pending > 24h | Regional Manager | Immediate |

---

## 11. AI Governance & Explainability Layer

### 11.1 AI Decision Transparency Requirements

Every AI-generated output in TrustEdge must be accompanied by:
1. **Confidence score** (0–100%)
2. **Top 3 contributing factors** (GNN feature attribution)
3. **Similar historical cases count** ("Based on 1,247 similar profiles")
4. **Recommended action with conversion probability estimate**
5. **Uncertainty disclosure**: "Prediction accuracy decreases for customers with < 6 months of data"

### 11.2 AI Governance Dashboard

**Components:**

**Prediction Accuracy Tracker:**
- 30-day rolling accuracy by risk tier: "Were customers predicted Critical (>0.85) actually churning?"
- False positive rate: % of Critical-flagged customers who did NOT churn
- False negative rate: % of customers who churned but were NOT flagged (retrospective)
- Calibration chart: Do predicted probabilities match actual rates? (A model predicting 80% confidence should be right ~80% of the time)

**Override & Challenge Log:**
- All RM score challenges with resolution status
- All admin manual overrides with reason codes
- All cases marked "False Positive" or "False Negative"
- Trend: Is the override rate increasing? (May indicate model drift or RM distrust)

**Model Acceptance Rate:**
- For each AI recommendation type: What % of the time do RMs follow the recommendation?
- If acceptance rate < 50%: review recommendation quality or RM training
- If acceptance rate > 95%: risk of automation bias — ensure RMs are genuinely reviewing

**Explainability Audit Log:**
- Every case where admin or RM accessed the score explanation view
- Ensures AI transparency features are actually being used (not just available)

### 11.3 Responsible AI Controls

**Bias Monitoring:**
- Monthly automated checks: Are customers of a particular age, gender-inferred group, or geographic area disproportionately flagged as high-risk?
- Disparate impact report: available to Compliance Officer on demand
- Alert threshold: If any demographic segment is > 1.5x over-represented in Critical cohort relative to their portfolio share, flag for review

**Data Lineage:**
- Every feature used in a specific customer's churn score is traceable to its source transaction or event
- Admin can view: "This customer's 'SIP cancellation' signal was sourced from transaction ID #TX-847291 on 2026-04-15"

**Consent & Data Usage Compliance:**
- Tracking which customer data fields are used in AI modeling
- Audit trail for all data accesses by model training processes
- Customer data used for external translation API calls: PII scrubbed before transmission (logged)

---

## 12. Audit, Compliance & Reporting

### 12.1 Immutable Audit Log Architecture

Every action in the system creates an immutable audit entry containing:
- **Who**: Actor ID, role, branch, session ID
- **What**: Action type, affected entity (customer/campaign/case), before state, after state
- **When**: UTC timestamp, local time, system clock verification hash
- **Why**: Mandatory reason field for sensitive actions (overrides, rejections, data reveals)
- **How**: API endpoint called, source IP, device fingerprint

Audit log entries are:
- Written to append-only WORM storage (Write Once Read Many)
- Cryptographically signed (SHA-256 per entry, Merkle root per daily batch)
- Indexed by: actor, customer ID, action type, timestamp, branch
- Exportable in formats: PDF (RBI-formatted), CSV, JSON

### 12.2 Compliance Reports

**RBI-Aligned Reports (one-click generation):**

| Report | Frequency | Content |
|---|---|---|
| Customer Data Access Log | Monthly | All customer profile accesses, by whom, for what purpose |
| AI Decision Impact Report | Quarterly | Demographic analysis of AI-driven outreach and retention outcomes |
| Incentive Disbursement Audit | Monthly | All incentives offered, approved, disbursed, with ROI |
| Campaign Targeting Report | Per campaign | Targeting criteria, reach, frequency, opt-out rates |
| Complaint Resolution Report | Monthly | Complaint types, resolution times, escalation rates |
| Model Governance Report | Quarterly | Model versions, retraining events, drift alerts, overrides |
| Data Breach / Anomaly Report | As-needed | Any unauthorized access attempt or anomalous API usage |

### 12.3 RBAC Audit Trail

Dedicated view for:
- All role assignments and changes (who granted whom what access)
- All permission escalation events (temporary elevated access)
- All login events with success/failure
- All MFA bypass events (should be near-zero; alerts if not)
- All session anomalies (unusual IP, unusual access time, bulk data export)

---

## 13. Alert & Notification Management

### 13.1 Alert Types & Priorities

Alerts in TrustEdge are classified across four dimensions:
- **Source**: AI Engine / Operational / System / Compliance
- **Priority**: P1 Critical (immediate action) / P2 High (action within 4h) / P3 Medium (action within 24h) / P4 Low (informational)
- **Target Role**: determines who receives the alert
- **Channel**: In-portal notification / Email / SMS (for P1 only)

**Alert Catalogue:**

| Alert | Source | Priority | Target |
|---|---|---|---|
| Customer risk crosses 0.85 threshold | AI Engine | P1 | RM + Branch Manager |
| Case SLA breached | Operational | P1 | Branch Manager + Regional Manager |
| SAGE distress keyword detected | AI Engine | P1 | Support Agent + RM |
| PULSE drift detected | System | P1 | System Admin + Data Ops |
| Campaign opt-out rate > 2% | AI Engine | P2 | Campaign owner + Branch Manager |
| RM call outcome not recorded 48h | Operational | P2 | RM + Branch Manager |
| Translation API degraded | System | P2 | System Admin |
| Incentive approval pending > 24h | Operational | P2 | Regional Manager |
| New case assigned | Operational | P3 | RM |
| Monthly incentive budget > 80% | Operational | P3 | Branch Manager |
| Model accuracy below 85% | AI Engine | P3 | System Admin |
| SAGE low-confidence response flagged | AI Engine | P3 | AI Governance officer |

### 13.2 Alert Center UI

**Consolidated Alert Center** (accessible from persistent notification bell icon):

- **Inbox view**: All alerts across all sources, sorted by priority + age
- **Filter**: By source type / priority / branch / status (unacknowledged / acknowledged / resolved)
- **Bulk actions**: Acknowledge all P3 alerts, assign all unassigned alerts to specific RM
- **Alert history**: 90-day searchable alert history with resolution records

**Alert Suppression Rules (Admin-configurable):**
- Suppress duplicate alerts: If same customer has received 3+ alerts in 7 days, consolidate into single "persistent risk" alert
- Maintenance windows: Admin can set time windows during which system alerts are suppressed (e.g., planned batch job runs)
- Silence rules: Individual RMs can silence P4 alerts for up to 24h (audit-logged)

### 13.3 Notification Preferences

Each user can configure (within role-permitted limits):
- Which alert types to receive via email vs. SMS vs. in-portal only
- Frequency digest option: receive P3/P4 alerts as daily digest rather than real-time
- Emergency contact: secondary email/phone for P1 alerts if primary is unresponsive

---

## 14. Performance & RM Operations

### 14.1 RM Performance Dashboard (Branch Manager View)

The current strategy mentions RM performance scorecards briefly. Full specification:

**RM Scorecard Metrics:**

| Metric | Definition | Target | Alert Threshold |
|---|---|---|---|
| Case Resolution Rate | % of cases resolved within SLA | > 75% | < 60% |
| Conversion Rate | % of contacted at-risk customers retained | > 40% | < 25% |
| Outcome Recording Rate | % of cases with outcome logged within 48h | > 90% | < 75% |
| AI Recommendation Acceptance | % of AI suggestions followed | 50–85% | < 30% or > 90% |
| SAGE Handoff Follow-through | % of SAGE-flagged cases contacted within 24h | > 80% | < 65% |
| Call Attempt Rate | % of assigned cases with ≥ 1 call attempt | > 95% | < 80% |
| Average Case Age at Resolution | Days from case creation to resolution | < 4 days | > 7 days |

**Note on AI Recommendation Acceptance**: Both very low (<30%) and very high (>90%) rates are flagged. Very low suggests model distrust or RM disagreement. Very high suggests automation bias — RM may be accepting without genuine review. Both need manager attention.

### 14.2 Portfolio Health Summary (RM Self-View)

Every RM has a personal Portfolio Health page:
- Total portfolio size (# customers, total AUM)
- Risk distribution within their portfolio (how many Critical / High / Moderate)
- AUM at risk this month
- Customers with no contact in > 30 days (engagement gap list)
- Upcoming FD maturities in next 30 days (proactive engagement opportunities)
- Upcoming SIP review dates

### 14.3 Talk Track Library

SAGE generates personalized talk tracks for each case. The Talk Track Library is a central repository:
- All generated talk tracks, searchable by customer segment type and offer category
- RM can save effective talk tracks as personal templates
- Branch Manager can promote specific talk tracks to "Branch Standard" — visible to all RMs
- Admin can create regulatory-compliant mandated language snippets (e.g., required disclosures) that auto-append to relevant talk tracks

### 14.4 Training & Onboarding Integration

For new RMs onboarding to TrustEdge:
- Interactive walkthrough: First 3 case assignments come with guided tooltips
- Simulated practice cases: AI-generated fictional customer scenarios for RMs to practice before live portfolio access
- Progress tracker: Onboarding milestones with estimated time to full portfolio access

---

## 15. System Health & Infrastructure Monitoring

### 15.1 System Admin Dashboard

Visible only to System Admin role:

**Service Health Matrix:**
```
┌────────────────────────────────────────────────────────────────────┐
│  TRUSTEDGE SYSTEM HEALTH                            [Real-Time]    │
├───────────────────────┬──────────────┬───────────────┬────────────┤
│ Service               │ Status       │ Latency (p99) │ Uptime     │
├───────────────────────┼──────────────┼───────────────┼────────────┤
│ TGN Scoring Engine    │ ✅ Healthy   │ 142ms         │ 99.91%     │
│ SAGE LLM API          │ ✅ Healthy   │ 2.1s          │ 99.87%     │
│ Translation API       │ ⚠️ Degraded │ 8.4s          │ 98.2%      │
│ PULSE PPO Service     │ ✅ Healthy   │ Background    │ 100%       │
│ Kafka Event Bus       │ ✅ Healthy   │ 0.18s lag     │ 99.99%     │
│ Redis Cache           │ ✅ Healthy   │ 0.8ms         │ 99.99%     │
│ PostgreSQL Primary    │ ✅ Healthy   │ 12ms          │ 100%       │
│ Milvus Vector Store   │ ✅ Healthy   │ 45ms          │ 99.94%     │
│ CDC Debezium Pipeline │ ✅ Healthy   │ 0.6s lag      │ 99.97%     │
│ WORM Audit Logger     │ ✅ Healthy   │ 3ms           │ 100%       │
└───────────────────────┴──────────────┴───────────────┴────────────┘
```

**Kafka Topic Monitoring:**
- Consumer lag per topic: transactions, CRM events, mobile events
- Dead letter queue size (messages that failed processing)
- Throughput: events/sec per topic

**Model Serving Monitoring:**
- Requests/sec to TGN scoring endpoint
- Cache hit rate for Redis Churn DNA vectors
- GNN inference queue depth (are requests backing up?)
- PULSE PPO last run duration and CPU/GPU utilization

**Database Monitoring:**
- Query latency percentiles (p50 / p95 / p99)
- Active connections vs. pool limit
- Slow query log (queries > 500ms)
- Replication lag (primary → replica)

### 15.2 Incident Management Integration

When a P1 system alert fires:
- Auto-creates an incident record with: start time, affected services, initial impact assessment
- Pages on-call System Admin via configured alerting channel (PagerDuty / OpsGenie compatible webhook)
- All incident-related audit actions are linked to the incident record
- Post-incident: system generates auto-report template (incident timeline, root cause, affected records, remediation steps)

---

## 16. Feature Rationalization Matrix

Full analysis of all features — what to keep, merge, remove, and add:

### 16.1 Keep (Core Value — Do Not Change)

| Feature | Reason |
|---|---|
| Temporal GNN for Churn DNA | Technically sound, genuine differentiator |
| Monte Carlo Ghost Journey simulation | Quantifiable ROI for executive decisions |
| PULSE Online RL with PPO | Creates compounding accuracy improvements |
| Isolated inline translation (bubble-level) | Correct UX pattern — avoids global state corruption |
| 7-day frequency capping | Protects customer experience, reduces opt-out risk |
| Glassmorphic dark theme | Appropriate for financial operations environments |
| Browser-native Speech-to-Text | Privacy-preserving, no audio transmitted |

### 16.2 Merge (Reduce Duplication)

| Feature A | Feature B | Merged Into |
|---|---|---|
| Stress Alert System | Churn Risk Scoring | Unified Risk Signal Pipeline → both feed same Case creation system |
| Complaint Sentiment Logs | SAGE Conversation History | Unified Customer Sentiment Timeline in Customer 360 view |
| RM Performance Scorecards | Branch Analytics | Nested: Branch view contains RM scorecards as drill-down |
| A/B Testing Module (TRUTH) | PULSE Feedback Ingestion | PULSE owns variant performance — TRUTH reads PULSE output to determine winner |
| Offline Translation Dictionary | LLM Translation API | Unified Translation Service with fallback routing built in — single API, not two separate systems |

### 16.3 Remove (Unrealistic or Counterproductive)

| Feature | Reason to Remove |
|---|---|
| Generic broadcast SMS campaigns | Contradicts core premise; replaced by behavioral triggers |
| Static SQL-based monthly batch risk scoring | Replaced by continuous TGN streaming scores |
| Legacy linear anomaly threshold rules | Creates false positives; fully replaced by GNN |
| Manual RM "browsing" of transaction sheets | Replaced by AI-surfaced priority queue in Workspace |
| Static "AUM Protected" headline metric without drill-down | Vanity metric; replaced by actionable risk exposure panels |
| Real-time bell curve visualization (without interaction) | Decorative; replaced by operational cohort management |
| Admin launching campaigns without approval workflow | Bypasses financial governance; approval workflow is mandatory |

### 16.4 Add (Missing for Enterprise Readiness)

| Feature | Reason / Impact |
|---|---|
| My Workspace (role-adaptive action inbox) | Most important missing piece — drives daily operational behavior |
| Retention Case Management System | Core operational workflow missing entirely |
| Incentive Approval Workflow | Financial governance requirement for banking |
| Customer 360 View | No ability to track individual customer journey |
| AI Explainability Panel (per score) | Required for RM trust and AI governance |
| Score Challenge / Override System | Human-in-the-loop control for AI recommendations |
| Campaign Creation with AI Segment Builder | Makes campaign creation practical rather than technical |
| SLA Management & Breach Tracking | Operational accountability |
| SAGE Flagging & Human Handoff | Required for distress detection and responsible AI |
| Translation Quality Audit | Required for regional language program quality control |
| Network Contagion Visualization | Key GNN advantage not surfaced to operators |
| Model Version Management Console | Required for production ML governance |
| PULSE Outcome Recording Completeness Tracker | Data quality requirement for feedback loop |
| Notification Preference Management | Reduces alert fatigue for operational users |
| Compliance Report Generator (RBI-format) | Regulatory requirement |
| Bias Monitoring for AI Outputs | Responsible AI and regulatory compliance |
| Talk Track Library | Operationalizes SAGE output for RM daily work |
| Branch Hierarchy Scoping for all views | Multi-branch scalability requirement |

---

## 17. Enterprise UX Principles

### 17.1 Navigation Design

**Primary rule**: Navigation hierarchy must match operational priority, not system architecture.

- **Persistent left sidebar**: Always visible. Module names reflect what users DO, not what the system IS.
  - ❌ "TRUTH Module" → ✅ "Outreach Manager"
  - ❌ "PULSE Engine" → ✅ "Learning & Feedback"
  - ❌ "CommandCenter" → ✅ "Operations Dashboard"
- **Breadcrumb trail**: Every page shows where you are and how you got there
- **Context-sensitive help**: Every module has a "?" icon that opens a brief operational guide (not technical documentation)
- **Keyboard shortcuts**: Power users (RMs doing 50+ interactions/day) need keyboard navigation for case queue, call logging, and outcome recording

### 17.2 Data Density vs. Clarity

**Principle**: Show the right amount of information for the task — not the maximum possible.

- **Summary view** (Workspace, Dashboard): High-level status, single action per item, no raw data
- **List view** (Case Queue, Alert Center): Medium density, sortable, filterable, bulk actions
- **Detail view** (Case Detail, Customer 360): Full data, tabbed navigation, all context available

Avoid: Data tables with > 8 columns visible by default. Use progressive disclosure — show 5 columns by default, allow user to expand or configure.

### 17.3 Action Design

Every page must answer: **What do I do next?**

- **Primary action button**: One per page, visually dominant, context-appropriate
  - Case detail page: "Log Outcome" or "Send Outreach" (whichever is the next step in case lifecycle)
  - Campaign detail: "View Performance" or "Approve Campaign" (role-appropriate)
  - Risk profile: "Create Retention Case" or "Open Existing Case"
- **Inline actions**: For list views, allow most common actions without navigating to detail page
- **Action confirmation**: Destructive or irreversible actions (pausing campaign, rejecting incentive) require a confirmation dialog with consequence preview

### 17.4 Loading & Performance

- **Optimistic UI**: For low-risk actions (logging call outcome), update UI immediately and sync to backend asynchronously
- **Skeleton screens**: Never show blank pages or loading spinners for > 300ms — use skeleton placeholders that match the expected layout
- **Pagination over infinite scroll**: For audit logs and transaction history — predictable performance under large datasets
- **Lazy loading**: Tab content in Case Detail loads when tab is selected, not on initial page load

### 17.5 Error Handling & Recovery

- **Inline validation**: Form fields validate as user types, not on submission
- **Descriptive error messages**: "Translation API is temporarily unavailable. Using offline dictionary for this translation. [View Status]" — not "Error 503"
- **State preservation**: If a session expires mid-form, draft is saved to local storage and restored on re-login
- **Conflict resolution**: If two users edit the same case simultaneously, show a conflict notification with diff view and let the second editor choose to merge or overwrite

---

## 18. Scalability & Integration Roadmap

### 18.1 Multi-Tenant Architecture

Phase 3 expansion to multiple PSBs requires tenant isolation:

- **Data isolation**: Each bank's data in separate PostgreSQL schema (or separate database cluster for large banks)
- **Config isolation**: Each tenant has independent cohort thresholds, authority limits, campaign templates, and translation dictionaries
- **UI isolation**: Each tenant can apply their own branding (logo, colors) to the portal
- **Model isolation**: Option for bank-specific GNN model training (federated or isolated) vs. shared model (cross-bank pre-training, fine-tuned per institution)
- **Audit isolation**: Compliance officer of Bank A cannot access Bank B's audit logs under any circumstance

### 18.2 Horizontal Scaling Design

| Component | Scaling Approach |
|---|---|
| TGN Scoring Engine | Stateless pods behind load balancer; Redis cache ensures hot profiles are available across pods |
| SAGE LLM API | Rate-limited per-customer; LLM inference can be horizontally scaled via Anthropic/Bedrock API quotas |
| PULSE PPO Service | Single-writer per model version; PPO update jobs run on dedicated GPU nodes via Ray cluster |
| Kafka Event Bus | Partition by customer shard key for ordered processing; add partitions as message volume grows |
| PostgreSQL | Read replicas for dashboard queries; primary for writes; pgBouncer connection pooling |
| Redis Cache | Redis Cluster mode for horizontal sharding of Churn DNA vectors |
| Admin Portal Frontend | Static assets on CDN; API gateway with auto-scaling backend pods |

### 18.3 Integration Readiness

**Planned integrations (design for now, implement in phases):**

| Integration | Purpose | Phase |
|---|---|---|
| India Account Aggregator Framework | Ingest consented multi-bank financial data | Phase 3 |
| CBS (Finacle / Temenos / BaNCS) | Real-time transaction streaming via certified connectors | Phase 1 |
| CRM (Salesforce / Dynamics) | Bi-directional case and contact sync | Phase 2 |
| WhatsApp Business API | Direct message delivery without third-party middleware | Phase 1 |
| Twilio (SMS / Voice) | SMS fallback and RM call initiation | Phase 1 |
| Email Service Provider (SendGrid / AWS SES) | Campaign email delivery | Phase 1 |
| PagerDuty / OpsGenie | P1 incident alerting for System Admin | Phase 1 |
| MLflow | Model registry and experiment tracking | Phase 1 |
| NVIDIA RAPIDS | GPU-accelerated GNN inference for high-volume branches | Phase 2 |
| RBI CRILC | Credit information cross-reference for NPA early warning | Phase 3 |

**API-First Design Principle**: Every internal module communicates via documented REST or gRPC APIs. No direct database joins across module boundaries. This ensures any module can be replaced or extended without system-wide changes.

### 18.4 Event-Driven Workflow Improvements

Replace all polling-based checks with event-driven triggers:

| Current (Polling) | Improved (Event-Driven) |
|---|---|
| Nightly batch: check which customers crossed risk threshold | Kafka event emitted immediately when TGN score update crosses threshold |
| Daily scheduled outreach queue generation | TRUTH subscribes to risk-threshold-crossed events and immediately queues outreach |
| Manual RM check of new case assignments | WebSocket push notification to RM portal session on case assignment |
| Hourly PULSE outcome collection | Outcome events emitted immediately on RM action; PULSE buffers and applies to next PPO cycle |

---

## 19. Data Architecture Improvements

### 19.1 Schema Additions Required

The existing Prisma schema covers core entities well. Additions needed for enterprise operations:

```prisma
model RetentionCase {
  id              String    @id @default(uuid())
  userId          String
  caseType        String    // CHURN_RISK, STRESS_ALERT, NPA_RISK, COMPLAINT_ESCALATION
  priority        String    // CRITICAL, HIGH, MODERATE
  status          String    // OPEN, TRIAGED, IN_PROGRESS, ESCALATED, RESOLVED, CLOSED
  resolutionType  String?   // RETAINED, PARTIAL, LOST, MONITORING, FALSE_POSITIVE
  assignedRmId    String
  slaDeadline     DateTime
  slaBreach       Boolean   @default(false)
  riskScoreAtOpen Float
  aumAtRisk       Float?
  aiActionPlan    String?   // JSON: SAGE-generated recommendation
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  resolvedAt      DateTime?
  
  user            User      @relation(fields: [userId], references: [id])
  rm              User      @relation("RMCases", fields: [assignedRmId], references: [id])
  interventions   CaseIntervention[]
  approvalRequests ApprovalRequest[]
}

model CaseIntervention {
  id             String   @id @default(uuid())
  caseId         String
  actorId        String
  actionType     String   // CALL_ATTEMPT, OUTREACH_SENT, OUTCOME_RECORDED, ESCALATED, NOTE_ADDED, AI_OVERRIDE
  outcome        String?  // REACHED, NO_ANSWER, CALLBACK_SCHEDULED, CONVERTED, DECLINED, IGNORED
  sentimentScore Float?   // -1.0 to 1.0 if voice analytics active
  aiRecommFollowed Boolean?
  notes          String?
  createdAt      DateTime @default(now())

  case           RetentionCase @relation(fields: [caseId], references: [id])
  actor          User          @relation(fields: [actorId], references: [id])
}

model ApprovalRequest {
  id             String    @id @default(uuid())
  caseId         String?
  campaignId     String?
  requestType    String    // INCENTIVE, CAMPAIGN_LAUNCH, MODEL_CHANGE, OVERRIDE
  requesterId    String
  approverId     String?
  status         String    @default("PENDING") // PENDING, APPROVED, REJECTED, EXPIRED
  requestDetails String    // JSON: what is being approved
  approverNotes  String?
  requestedAt    DateTime  @default(now())
  decidedAt      DateTime?
  slaDeadline    DateTime

  case           RetentionCase? @relation(fields: [caseId], references: [id])
  requester      User           @relation("ApprovalRequests", fields: [requesterId], references: [id])
  approver       User?          @relation("ApprovalDecisions", fields: [approverId], references: [id])
}

model AiScoreExplanation {
  id              String   @id @default(uuid())
  userId          String
  riskScore       Float
  confidenceScore Float
  topSignals      String   // JSON array: [{signal, weight, sourceTransactionId}]
  similarCases    Int
  modelVersion    String
  computedAt      DateTime @default(now())

  user            User     @relation(fields: [userId], references: [id])
}

model ScoreChallenge {
  id             String   @id @default(uuid())
  userId         String
  challengerId   String
  originalScore  Float
  challengeReason String
  additionalContext String?
  status         String   @default("OPEN") // OPEN, REVIEWED, UPHELD, OVERRIDDEN
  reviewedBy     String?
  reviewNotes    String?
  adjustedScore  Float?
  createdAt      DateTime @default(now())
  resolvedAt     DateTime?
}

model AuditLog {
  id          String   @id @default(uuid())
  actorId     String
  actorRole   String
  branchCode  String?
  actionType  String
  entityType  String   // USER, CASE, CAMPAIGN, OUTREACH, MODEL, SYSTEM
  entityId    String
  beforeState String?  // JSON snapshot
  afterState  String?  // JSON snapshot
  reason      String?
  ipAddress   String
  sessionId   String
  integrityHash String // SHA-256 of this record's content
  createdAt   DateTime @default(now())
}
```

### 19.2 Data Retention Policy

| Data Type | Retention Period | Archive Strategy |
|---|---|---|
| Transaction data | 7 years (RBI requirement) | Cold archive after 2 years |
| Audit logs | 7 years | WORM storage, never deleted |
| SAGE conversations | 3 years | Anonymized after 1 year |
| Outreach logs | 3 years | Summarized after 1 year |
| Risk scores & explanations | 3 years | Raw scores archived after 1 year |
| Model checkpoints | 12 months rolling | Last 5 major versions always retained |
| Session logs | 90 days | Security review then purge |

---

## 20. Implementation Phasing

### Phase 1: Core Operational Foundation (Months 1–3)
**Goal**: Make the portal operationally functional for a single branch pilot

Deliverables:
- [ ] My Workspace (role-adaptive action inbox) for RM and Branch Manager roles
- [ ] Retention Case Management System (create, assign, track, resolve)
- [ ] AI Score Explainability Panel (top signals, confidence score)
- [ ] Customer 360 View (basic: transactions, products, outreach history, case history)
- [ ] Alert Center with priority routing
- [ ] SLA tracking with breach notifications
- [ ] Immutable Audit Log (all actions)
- [ ] Incentive Approval Workflow (RM → Branch Manager)
- [ ] Campaign management with approval workflow
- [ ] SAGE conversation flagging and human handoff
- [ ] RM Performance Scorecards (basic: case resolution rate, conversion rate, recording rate)
- [ ] Role-Based Access Control (5-tier hierarchy)

### Phase 2: Intelligence & Quality (Months 4–6)
**Goal**: Activate learning loops and quality oversight

Deliverables:
- [ ] AI Governance Dashboard (prediction accuracy, override tracking, bias monitoring)
- [ ] PULSE Admin Dashboard with model version management
- [ ] Network Contagion Visualization
- [ ] Monte Carlo Results Viewer with Campaign ROI Calculator
- [ ] Score Challenge / Override System
- [ ] SAGE Quality Metrics and Translation Audit
- [ ] Campaign AI-Assisted Segment Builder
- [ ] Talk Track Library with Branch Standard templates
- [ ] Outcome Recording Completeness Tracker
- [ ] Regional Manager hierarchy views

### Phase 3: Scale & Compliance (Months 7–12)
**Goal**: Enterprise-grade deployment readiness

Deliverables:
- [ ] Multi-branch and multi-region scoping for all views
- [ ] RBI-aligned Compliance Report Generator (full suite)
- [ ] National Admin aggregated dashboard
- [ ] Multi-tenant architecture for additional PSB onboarding
- [ ] Account Aggregator Framework integration
- [ ] Live RM Call Coaching (voice analytics overlay)
- [ ] NPA Default Modeling (180-day early warning)
- [ ] Federated Learning across regional branch nodes
- [ ] Open Banking API connectivity
- [ ] Full System Health & Infrastructure monitoring console

---

## Appendix A: Key Terminology Reference

| Term | Definition |
|---|---|
| AUM | Assets Under Management — total deposit and investment value a customer holds |
| Churn DNA | Compressed customer behavioral vector produced by the TGN — powers all AI decisions |
| Ghost Journey | Monte Carlo simulation projecting customer's likely financial trajectory if bank takes no action |
| MAB | Multi-Armed Bandit — probabilistic channel selector using Thompson Sampling |
| NPA | Non-Performing Asset — loan where repayment is overdue |
| PPO | Proximal Policy Optimization — RL algorithm used by PULSE for online learning |
| PSB | Public Sector Bank — government-owned bank in India |
| PULSE | Feedback intelligence engine — ingests outcomes and retrains prediction models |
| RM | Relationship Manager — bank employee responsible for a portfolio of customers |
| SAGE | TRUSTEDGE's conversational AI assistant — customer-facing and RM-assisting |
| SLA | Service Level Agreement — time window within which a case action must occur |
| TGN | Temporal Graph Network — core ML model that processes customer behavioral graphs |
| TRUTH | Multi-channel outreach orchestrator — delivers personalized campaigns |
| WORM | Write Once Read Many — storage policy ensuring audit logs cannot be modified |

---

*TrustEdge Admin Portal Strategy v4.0*
*Prepared for: Team Tech Bugs!! — Engineering & Product Implementation*
*Classification: Internal Engineering Reference*
