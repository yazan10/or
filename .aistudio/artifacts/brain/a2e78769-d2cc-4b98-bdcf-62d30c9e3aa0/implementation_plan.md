# ORVEX AI — Social Marketing Intelligence & 30-Day Content Planner

A production-grade, bilingual (Arabic RTL default & English LTR) SaaS web platform designed for social media creators, marketing agencies, and businesses. ORVEX AI connects to Instagram and Facebook business accounts via Meta APIs, generates deep diagnostic performance audits and realistic growth scenarios with Google Gemini 3.8 Flash, delivers actionable 30-day content calendars, and supports follow-up consultations backed by an immutable ledger credit system and PayPal payments.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed during the interactive clarification phase:

- **Trial Credit Consumption**: 1 trial credit covers a complete analysis run, which includes the full diagnostic report, 30-day content calendar, follow-up question (up to 500 characters), and consultation chat session (up to 3,000 characters) without recurring deductions.
- **Wallet Architecture**: Two completely segregated, non-expiring credit wallets:
  - **Instagram Wallet**: 1st purchase: 3 trials for 12 ILS; subsequent purchases: 10 trials for 8 ILS.
  - **Facebook Wallet**: 1st purchase: 3 trials for 15 ILS; subsequent purchases: 10 trials for 10 ILS.
- **Currency & PayPal Conversion**: Pricing is displayed natively in Israeli Shekels (ILS) with dynamic real-time USD conversion displayed before PayPal order creation and checkout authorization.
- **Language & Typography**: Arabic (`ar`, `dir="rtl"`) is default, English (`en`, `dir="ltr"`) fully supported. Global font is strictly **Cairo** across all headings, body text, tables, and buttons.
- **Visual Aesthetic**: Warm editorial SaaS inspired by warm cream tones (`#FAF9F5`), charcoal text (`#141413`), warm coral accents (`#CC785C`), and high-contrast dark analytics surfaces (`#181715`).

---

## 1. Overview & Core Concept

### What It Does
ORVEX AI enables users to connect up to 5 Instagram business accounts and 5 Facebook Pages via Meta's Graph API permissions. It ingests official metrics (engagement, reach, video views, post frequency, and audience demographic breakdowns) and triggers a server-side Gemini AI diagnostic engine. 

The output is a comprehensive, objective diagnostic report (with an explainable 0–100 score, SWOT breakdown, top/bottom content postmortem, and realistic scenarios) paired with a structured 30-day day-by-day content strategy.

### Target Audience & Persona
- **E-Commerce & DTC Brands**: Seeking content cadence that drives conversions without burning out.
- **Social Media Managers & Digital Agencies**: Needing data-backed client audits and monthly editorial planning in minutes.
- **Content Creators & Influencers**: Wanting clear, algorithmic-agnostic feedback on what formats (Reels vs Carousels) yield sustainable retention.

### Key Value Proposition
- **Honest Analytics**: Zero hallucinated reach promises or fake "viral guarantees"; clear distinction between Meta API data, derived formulas, and AI hypotheses.
- **Actionable Execution**: A 30-day calendar complete with hooks, marketing objectives, captions, and script outlines.
- **Fair Pricing**: Permanent, non-expiring credits with atomic ledger tracking and zero hidden deductions for follow-up questions.

---

## 2. User Experience & Visual Design

### Aesthetic Direction & Visual Theme
- **Tone**: Warm editorial SaaS, calm, academic yet commercial, precise, and devoid of gimmicky neon gradients or generic AI badges.
- **Color Palette Tokens**:
  - Main Warm Canvas: `#FAF9F5`
  - Secondary Warm Canvas: `#F5F0E8`
  - Structural Surface & Cards: `#EFE9DE`
  - Highlighted Elevation: `#E8E0D2`
  - Primary Brand Coral / Action: `#CC785C` (Hover/Active: `#A9583E`)
  - Deep Neutral Text: `#141413` (Heading) & `#3D3D3A` (Body)
  - Muted Metadata Text: `#6C6A64`
  - Subtle Hairline Borders: `#E6DFD8`
  - Analytics Dark Surface: `#181715` (Elevated: `#252320`)
  - Semantic Status: Teal `#5DB8A6` (Success), Amber `#E8A55A` (Warning), Crimson `#C64545` (Error)
- **Typography**: Google Font **Cairo** (weights 400, 500, 600, 700) loaded globally with `font-variant-numeric: tabular-nums` for all metrics, dates, and tables.
- **RTL & LTR Dual-Direction Layout**: True bidirectional flex and grid alignments, mirrored sidebars, contextual arrows, and localized date/currency formats.

### Key User Flows
1. **Public Explorer**: Home landing page with interactive demo preview, platform comparison (Instagram vs Facebook data differences), pricing matrix, and comprehensive FAQs.
2. **Account Onboarding**: Email/password authentication, profile preferences (Arabic/English, timezone), and privacy consent records.
3. **Channel Integration**: Dedicated Meta OAuth connection center with permission transparency (explaining why `instagram_basic`, `pages_read_engagement`, etc. are requested), listing up to 5 accounts per platform with status and disconnect/data deletion workflows.
4. **Analysis Pipeline & Live Execution**:
   - Platform & account selector with available credit verification.
   - Stepped execution view showing actual sync phases (fetch metrics -> normalize data -> Gemini prompt synthesis -> validation).
   - Instant persistence into user reports history.
5. **Interactive Report & Planner**:
   - **Executive Summary & 0–100 Score**: Explaining weights for engagement, consistency, and content diversity.
   - **Strengths, Weaknesses, Opportunities, Threats (SWOT)**.
   - **Content Format Breakdown**: Reels vs Carousels vs Static images.
   - **30-Day Content Planner**: Calendar & tabular list views, search/filter by objective or format, copy caption/hook, CSV export.
   - **Follow-up Dialogue**: Single follow-up question input (max 500 chars with live counter) + deep advisory consultation chat (max 3,000 chars total session).
6. **Wallet & Checkout**: Transparent balances for Instagram and Facebook, purchasing via PayPal Order API with client-side approval and server-side verification, transaction receipts, and immutable ledger history.
7. **Comprehensive Admin Console**: Super Admin control room with KPI counters (users, analyses, revenue, API tokens used), user management with ledger audit history, pricing editor, prompt template manager, and system settings.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Architecture via Express + Vite**
  - *Chosen Approach*: Node.js Express server running concurrently with Vite dev server middleware in `server.ts`. Server proxies all Gemini API requests and handles PayPal order validation and simulation.
  - *Why*: Strict security requirement—`GEMINI_API_KEY` and payment secrets must never touch the browser bundle.
- **Decision 2: Segregated Credit Wallets**
  - *Chosen Approach*: Distinct `instagram` and `facebook` balance columns and ledger entries.
  - *Why*: Reflects real-world pricing divergence (Facebook requires deeper Page Insights permissions and higher data processing costs: 15 ILS vs 12 ILS for 1st purchase).
- **Decision 3: Inclusive Trial Package (Analysis + Q&A + Chat)**
  - *Chosen Approach*: User uses 1 trial for the full diagnostic lifecycle; follow-up questions and advisory chats are linked to the specific report ID.
  - *Why*: Highest customer satisfaction and trust; removes fear of unexpected micropayments while enforcing character limits (500 and 3,000) to protect token budget.
- **Decision 4: Resilient Server-Side Gemini 3.8 Flash Client**
  - *Chosen Approach*: Using the official `@google/genai` TypeScript SDK with structured JSON schemas (`responseSchema`) for report diagnostics and calendar generation.
  - *Why*: Predictable, typed outputs that seamlessly populate charts, tables, and calendar views without markdown parsing failures.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ORVEX AI Client (React 19)                      │
│                                                                        │
│   ┌────────────────────────┐  ┌────────────────────────────────────┐   │
│   │   Public Marketing     │  │     User Workspace Dashboard       │   │
│   │   - Home / Features    │  │  - Connected Accounts (Meta 5+5)   │   │
│   │   - Pricing / FAQ      │  │  - Analysis Engine & Live Progress │   │
│   │   - Terms & Privacy    │  │  - Interactive Diagnostic Report   │   │
│   └────────────────────────┘  │  - 30-Day Calendar & Export        │   │
│                               │  - Follow-up Q&A (500 chars)       │   │
│   ┌────────────────────────┐  │  - Advisory Chat (3000 chars)      │   │
│   │   Admin Control Room   │  │  - Dual Wallets (IG & FB)          │   │
│   │   - Users & Balances   │  │  - PayPal Checkout Integration     │   │
│   │   - Prompts & Ledgers  │  └────────────────────────────────────┘   │
│   └────────────────────────┘                                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST API (/api/*)
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Full-Stack Server (Express & TSX)                     │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Auth & User Storage   │  │    Wallet & Ledger Subsystem        │  │
│  │   - In-memory / State   │  │    - Atomic Balance Debit / Credit  │  │
│  │   - RBAC (User / Admin) │  │    - Immutable Transaction Logs     │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Meta Integration Hub  │  │    PayPal Checkout Controller       │  │
│  │   - Token Encryption    │  │    - Dynamic ILS <-> USD Conversion │  │
│  │   - Mock / Live Data    │  │    - Webhook Verification           │  │
│  │   - Data Deletion Flow  │  │    - Idempotent Fulfillment         │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 Gemini AI Engine (@google/genai)                 │  │
│  │   - Model: gemini-3.8-flash (Server-Side)                        │  │
│  │   - Prompt Templates: Report Engine, Content Planner, Advisory   │  │
│  │   - Structured JSON validation with fallback safety              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & State Model
- **User**: `id`, `name`, `email`, `role` (`user` | `admin`), `preferredLang` (`ar` | `en`), `createdAt`
- **Wallet**: `userId`, `instagramCredits`, `facebookCredits`, `instagramPurchasesCount`, `facebookPurchasesCount`
- **CreditLedger**: `id`, `userId`, `platform` (`instagram` | `facebook`), `amount`, `type` (`purchase` | `analysis_consumption` | `refund` | `admin_grant`), `reason`, `timestamp`
- **SocialAccount**: `id`, `userId`, `platform` (`instagram` | `facebook`), `accountName`, `accountId`, `avatarUrl`, `accountType`, `permissions`, `status`, `lastSyncedAt`
- **AnalysisReport**: `id`, `userId`, `accountId`, `platform`, `performanceScore`, `executiveSummary`, `swot`, `contentMetrics`, `topPosts`, `bottomPosts`, `recommendations`, `dataLimitations`, `growthScenarios`, `confidenceLevel`, `createdAt`
- **ContentPlan**: `id`, `reportId`, `userId`, `platform`, `month`, `items` (30 daily entries with date, type, hook, marketing goal, script outline, CTA, caption, hashtags)
- **ReportDiscussion**: `id`, `reportId`, `followUpQuestion`, `followUpAnswer`, `chatMessages` (array of role/content pairs up to 3,000 chars limit)
- **PaymentOrder**: `id`, `orderId`, `userId`, `platform`, `packageType`, `credits`, `priceILS`, `amountUSD`, `status` (`created` | `captured` | `failed`), `timestamp`

---

## 5. Execution Stages & Verification Plan

1. **Architecture & Foundation**:
   - Establish Express server (`server.ts`) with Vite middleware, typed REST routes for auth, accounts, analysis, wallet, and admin.
   - Configure Tailwind v4 with Cairo font, `@custom-variant dark`, and RTL/LTR direction wrapper.
   - Set up i18n translation matrix in Arabic and English covering all UI text, marketing pages, and error states.
2. **Design Tokens & Core Components**:
   - Color variables for warm cream, dark slate surfaces, and coral buttons.
   - Nav bar with language switcher, auth modal, responsive drawer, and clean unboxed metadata styling.
3. **Public Website**:
   - Landing page hero with interactive demo report, feature spotlights, pricing calculator, and bilingual legal policies.
4. **Channel Connection Center (Meta Simulation & OAuth)**:
   - Account listing for Instagram and Facebook (up to 5 each).
   - Permission explainer modal, token simulation, disconnect, and data deletion confirmation.
5. **AI Analysis Pipeline & Gemini 3.8 Flash**:
   - Server route `/api/analysis/start` calling `gemini-3.8-flash` with structured diagnostic prompt.
   - Real-time stepped progress display.
   - Full diagnostic dashboard with score calculation breakdown and SWOT cards.
6. **30-Day Content Planner**:
   - Calendar grid view & list view with format badges, copy-to-clipboard, and CSV download.
7. **Follow-up Question & Advisory Chat**:
   - 500-character follow-up input with counter and contextual answer.
   - 3,000-character consultation chat session with token budget indicator.
8. **Dual Wallet & PayPal Billing System**:
   - Local Shekel prices (12/8 ILS for IG, 15/10 ILS for FB) with dynamic USD checkout.
   - Atomic ledger transaction logging and purchase receipts.
9. **Admin Dashboard**:
   - Overview metrics, user credit management with audit trails, pricing controls, prompt templates, and audit logs.
10. **Build Verification**:
    - Run `compile_applet` and test full responsive workflows in both Arabic and English.
