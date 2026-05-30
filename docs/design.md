# TrustEdge — Design Specification for Stitch AI

## App Overview
**TrustEdge** is a premium dark-mode banking platform that combines financial stress detection, AI-powered financial education, product comparison, and complaint management into a single unified dashboard. The visual identity is sophisticated, data-dense, and modern — inspired by Bloomberg Terminal meets Revolut.

---

## Design System

### Color Palette
- **Background Primary**: `#0a0e1a` (near-black navy)
- **Background Secondary**: `#111827` (sidebar, panels)
- **Background Card**: `#1a2035` (cards, modals)
- **Background Input**: `#162032`
- **Text Primary**: `#f0f4ff`
- **Text Secondary**: `#94a3b8`
- **Text Muted**: `#64748b`
- **Accent Blue**: `#3b82f6`
- **Accent Purple**: `#8b5cf6`
- **Accent Green**: `#10b981`
- **Accent Red**: `#ef4444`
- **Accent Yellow**: `#f59e0b`
- **Accent Orange**: `#f97316`
- **Accent Cyan**: `#06b6d4`
- **Indigo**: `#6366f1`
- **Border Subtle**: `rgba(148,163,184,0.1)`

### Typography
- **Font**: Inter (Google Fonts)
- **Heading XL**: 1.8rem / 800 weight
- **Heading L**: 1.5rem / 800 weight
- **Heading M**: 1.1rem / 700 weight
- **Body**: 0.9rem / 400 weight
- **Label**: 0.75rem / 600 weight / uppercase / letter-spacing 0.5px
- **Monospace**: ticket numbers, IDs, codes

### Spacing & Shape
- Border radius: 8px (sm), 12px (md), 16px (lg), 24px (xl)
- Card padding: 24px
- Gap between cards: 20px
- Sidebar width: 260px fixed

### Elevation
- Cards: `0 4px 16px rgba(0,0,0,0.4)`
- Modals: `0 8px 32px rgba(0,0,0,0.5)`
- Glow Blue: `0 0 20px rgba(59,130,246,0.3)`
- Glow Purple: `0 0 20px rgba(139,92,246,0.4)`

### Animations
- All state transitions: 200ms ease
- Card hover: `translateY(-2px)` + stronger shadow
- Button hover: `translateY(-1px)` + glow
- Fade-in page entry: `opacity 0 → 1, translateY 8px → 0` over 400ms
- Typewriter cursor: blinking `▌` at 700ms step-end

---

## Layout

### Shell
- Fixed left sidebar (260px) with logo, nav sections, user badge, logout
- Main content area: `margin-left: 260px`, `padding: 32px`
- Sidebar sections: "Overview", "Tools", "Administration"
- Active nav item: left blue 3px border + blue text + subtle blue background

### Sidebar Logo
- 40×40 rounded icon with blue-to-purple gradient
- "TrustEdge" in gradient blue-cyan text (800 weight)
- "Human Banking" subtitle in muted text

### User Badge (sidebar bottom)
- 36×36 circular avatar with gradient, shows initials
- Name + role badge stacked below avatar

---

## Pages

---

### 1. Login Page

**Layout**: Full-screen centered, dark background
**Card**: 440px wide, 40px padding, rounded-xl, subtle border

**Elements**:
- TrustEdge logo centered at top (gradient text, large)
- Subtitle: "Secure Banking Intelligence"
- Email input field (full width)
- Password input with show/hide toggle
- "Sign In" button: full-width gradient blue, large
- Error state: red soft background banner above button
- Link: "Don't have an account? Register"

**Visual details**:
- Subtle background grid or radial gradient behind the card
- Card has glass-morphism feel with border glow on focus

---

### 2. Customer Dashboard

**Layout**: 2-column grid top, charts below

**Top Stats Row** (4 cards):
1. **Current Balance** — blue accent, ₹ value large, trend arrow
2. **Monthly Income** — green accent, ₹ value
3. **Monthly Expenses** — yellow accent, ₹ value
4. **Risk Score** — red/green depending on level, percentage

Each stat card has:
- Colored 3px top border
- Icon badge (44×44 rounded, soft color background)
- Large number (1.8rem, 800 weight)
- Small label below

**Middle Row** (2 columns):
- Left: Line chart — "Balance Trend (6 months)" with smooth curve, blue fill
- Right: Donut chart — "Spending by Category" with legend

**Bottom Row**:
- "Recent Transactions" table: date, description, category badge, amount (green credit / red debit)
- "Active Alerts" list: severity badge, message, status

**SAGE Suggestions Widget**:
- Purple gradient header "🤖 Smart Suggestions"
- 3 suggestion cards with icons, each showing a personalized tip
- "Powered by AI" badge bottom right

---

### 3. Transactions Page

**Header**: Page title + filter controls in one row
**Filters**: Category dropdown, Type (Credit/Debit), Date range picker, Search input

**Table**:
| Date | Description | Category | Type | Amount | Balance |
|---|---|---|---|---|---|

- Credit rows: amount in green
- Debit rows: amount in red
- Category: colored pill badge (SALARY=green, FOOD=yellow, EMERGENCY=red, RENT=blue)
- Pagination at bottom

---

### 4. Alerts Page

**Header**: "Financial Stress Alerts" + analyze button (employee/admin only)

**Alert Cards** (stacked list):
- Left colored border by severity: CRITICAL=red, HIGH=orange, MODERATE=yellow, LOW=green
- Alert type icon + type label
- Message text
- Status badge: OPEN (blue), ACKNOWLEDGED (yellow), RESOLVED (green), DISMISSED (gray)
- Timestamp
- Action buttons (employee/admin): "Acknowledge", "Resolve", "Dismiss"

**Empty state**: Shield icon + "No active alerts" message

---

### 5. SAGE Chat Page

**Layout**: Full-height flex column

**Header**:
- 46×46 purple gradient icon (Sparkles)
- "SAGE" in purple gradient text
- Subtitle: "Your AI Financial Companion · Powered by AWS Bedrock"
- "Clear Chat" button (red text) far right

**Topic Pills Row**:
- `✨ General` `📊 Budgeting` `💰 Saving` `💳 Debt` `📈 Investing`
- Active pill: purple background + border, purple text
- Pill shape: 100px border-radius

**Chat Window** (flex: 1, scrollable):

*Empty state*:
- Large purple glowing orb icon centered
- "How can I help you today?"
- 4 starter prompt cards in 2×2 grid, hoverable

*SAGE message*:
- Left-aligned row: purple avatar circle (Sparkles icon) + message column
- "SAGE" label in purple uppercase above message
- Message text with typewriter effect (character by character)
- Blinking `▌` cursor while typing
- "Skip" button (pill, subtle) during animation
- "Helpful / Not helpful" thumb buttons after message completes

*User message*:
- Right-aligned row: message bubble + user avatar
- Bubble: blue-to-purple gradient, rounded (18px 18px 4px 18px)
- "You" label in blue uppercase above bubble

*Typing indicator*:
- 3 purple bouncing dots (staggered animation)

**Input Area** (bottom):
- Rounded container with purple focus glow
- Textarea (grows with content, max 160px)
- Purple gradient send button (36×36, glows on hover)
- Disclaimer text below: "SAGE may make mistakes..."

---

### 6. TRUTH Product Comparison Page

**Header**: "TRUTH — Product Comparison Engine"

**Product Type Filters**: LOAN, CREDIT_CARD, SAVINGS, INVESTMENT (tab pills)

**Product Cards Grid** (3 columns):
- Provider name + product name
- Interest rate (large, colored)
- Fees row
- "Compare" button

**Comparison Result Panel** (appears after analysis):
- Verdict badge: RECOMMENDED (green), CAUTION (yellow), AVOID (red)
- Cost breakdown
- Hidden fees total (highlighted)
- "Better Alternative" card if available
- AI reasoning paragraph

---

### 7. Complaints & Support Page (Customer)

**Header**: "🗂️ Complaints & Support" + "New Complaint" button (blue)

**Stats Row** (4 cards):
- Total Tickets, Open (blue), In Progress (yellow), Resolved (green)

**RBI Notice Banner**:
- Blue soft background
- ℹ️ icon + "RBI Grievance Redressal" text
- 30-day resolution policy + toll-free number

**Filter Pills**: All / Open / In Progress / Resolved / Closed

**Complaint List** (stacked cards):
Each card:
- File icon (40×40 rounded)
- Ticket number (monospace, muted)
- Status badge + Priority dot + color
- Subject (bold)
- Category · Date

**Submit Modal**:
- Category dropdown + Priority dropdown (2-column)
- Subject input
- Description textarea (5 rows)
- Supporting info input
- Cancel + Submit buttons

**Detail Modal**:
- Ticket number + subject header
- Status + Priority + Category badges
- "Your Description" block (dark background)
- Timeline grid: Submitted, Assigned To, Channel, Last Updated
- Resolution block (green tinted) when resolved
- "Withdraw Complaint" button (red outline) if still open

---

### 8. Employee Complaints Queue Page

**Header**: "🎯 My Complaints Queue"
**Subtitle**: "Tier 1 — Customer Support. SLA: 2 business days."

**Stats Row**: Open / In Progress / SLA Breached (red) / Total

**SLA Warning Banner**: Yellow tinted with timer icon

**Complaint Cards**:
- Red border if SLA breached
- Ticket number + Status + Priority + SLA countdown badge
- Subject (bold) + Customer name + Category + Date
- Previous response preview (if responded)
- "Take Action" button (blue, right aligned)

**Action Modal** (3 tabs):
- **💬 Respond** — textarea, sends reply without closing ticket
- **✅ Resolve** — textarea, marks as resolved
- **⬆️ Escalate** — with reason, sends to Tier 2

SLA countdown badges:
- Green: `🕐 Xd left`
- Orange: `⚠️ Due today`
- Red: `⚠️ Xd overdue`

---

### 9. Admin Complaints Management Page

**Header**: "🏦 Complaints Management"

**Stats Grid** (9 stat cards, auto-fit):
Total / Open / In Progress / Resolved / Tier 1 / Tier 2 / Tier 3 / ⚠️ SLA Breached / 🚨 RBI Flagged

**Filter Pills (2 rows)**:
- Row 1: TIER_1 (blue), TIER_2 (yellow), TIER_3 (red)
- Row 2: OPEN, IN PROGRESS, RESOLVED + Clear button

**Complaint Cards**:
- Red border for TIER_3 or RBI flagged
- Tier badge + Status badge + Priority dot
- "🚨 RBI FLAGGED" red badge if applicable
- Subject + Customer name + Category + Assigned to
- SLA progress bar (green→orange→red as deadline approaches)
- "Manage" button

**Admin Action Modal** (tabs by tier):
- **👤 Assign** — employee dropdown (fetched from DB), assign button
- **✅ Resolve** — resolution textarea, green resolve button
- **🚨 Escalate T3** — warning screen with confirm button (TIER_2 only)

---

### 10. SHIELD Employee Well-being Page

**Header**: "SHIELD — Private Well-being Check-in"
**Privacy notice**: "This data is private. Management cannot see your responses."

**Check-in Form**:
- Stress score slider (1–10) with emoji feedback
- Mood selector: GOOD 😊 / OKAY 😐 / STRUGGLING 😔 / OVERWHELMED 😰
- "Number of difficult cases today" number input
- "Request peer support" toggle
- Private notes textarea
- Submit button

**History Page**:
- Weekly stress score chart (line)
- Mood distribution donut
- Recent check-in cards

---

### 11. Admin Dashboard

**Stats Grid**:
- Total Users / Active Customers / Employees / Admins
- Total Transactions / Total Alerts / Critical Alerts

**User Management Table**:
- Name / Email / Role badge / Status / Last Active / Actions
- Role badges: CUSTOMER (blue), EMPLOYEE (green), ADMIN (purple)
- Toggle active/inactive

**Audit Logs Table**:
- Timestamp / User / Action / Entity / IP Address
- Monospace timestamp
- Action type colored (LOGIN=blue, ALERT=red, etc.)

---

## Common Components

### Badges
- Rounded pill, 100px border-radius
- Soft background (15% opacity of color)
- Matching colored text
- Uppercase, 0.75rem, 600 weight

### Buttons
- **Primary**: Blue gradient, white text, glow on hover
- **Secondary**: Card background, border, hover darken
- **Danger**: Red background
- **Small**: 6px 14px padding, 0.8rem

### Empty States
- Centered icon (48px, low opacity)
- Heading + description text
- Optional CTA button

### Modals
- Fixed overlay: `rgba(0,0,0,0.65)` backdrop
- Card: 20px border-radius, 28-32px padding
- Max-width: 520–580px
- Close X button top right
- Smooth fade-in animation

### Tables
- Dark header row with muted uppercase labels
- Subtle row dividers
- Hover: slightly lighter row background
- Sticky header on scroll

### Form Inputs
- Dark input background `#162032`
- Subtle border, blue glow on focus
- Placeholder in muted color
- Error state: red border + red message below

---

## Micro-interactions

- **Sidebar nav hover**: background lightens + text brightens
- **Card hover**: lifts 2px + shadow deepens
- **Button hover**: lifts 1px + glow appears
- **Badge**: no hover (static)
- **Stat card**: hover lifts + shadow
- **Chat bubble entry**: fade up from 8px below
- **Topic pill**: background fills on click with transition
- **SLA bar**: smooth width transition
- **Typing dots**: staggered bounce (0s, 0.2s, 0.4s delay)
- **Typewriter**: character reveal at ~14ms/char
- **Modal open**: fade + scale from 0.95 to 1

---

## Responsive Notes
- Mobile (< 768px): sidebar collapses, hamburger menu
- Tablet: single column grid for stats
- Desktop: full 2–3 column grids

---

## Brand Voice in UI Copy
- Friendly but professional
- Use ₹ for Indian Rupee formatting (₹1,00,000)
- Avoid jargon — explain in plain language
- Alerts: clear severity + actionable message
- SAGE: conversational, empathetic, never preachy
