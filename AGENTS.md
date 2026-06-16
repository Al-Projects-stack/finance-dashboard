# AGENTS.md — FinanceOS Agent Log

## Project Overview
**FinanceOS** — A personal finance dashboard for tracking income, expenses, and cash flow.  
**Stack**: React 18 (Vite) + Node.js (Express) + PostgreSQL + JWT auth + Zod validation  
**Deploy**: Render.com  
**Demo**: https://finance-dashboard-xu3i.onrender.com (`demo@example.com` / `password123`)

---

## Session: Initial Audit (16 Jun 2026)

### What was done
1. Read **all project files** — full structure understood:
   - **Client** (`client/`): React app with Vite, Chart.js, React Router, Axios. CSS modules + dark theme (purple/cyan design system). Pages: Landing, Login, Register, Dashboard, Transactions. Context: Auth, Transaction. Components: Sidebar, KPICard, CashFlowChart, IncomeExpenseChart, ExpenseCategoryChart, TransactionTable, TransactionForm, TransactionFilters.
   - **Server** (`server/`): Express API with JWT auth, bcrypt, Zod validation, PostgreSQL (pg). Routes: auth (register/login/me), transactions (CRUD + summary). Middleware: JWT auth, error handler, rate limiting, helmet, CORS. DB schema: users + transactions with UUIDs, indexes, auto-updating timestamps.
   - **Config**: Vite proxy, render.yaml for deploy, .env.example, .claude settings.

2. **Git status checked**: Branch `master`, up to date with `origin/master`. Working tree clean — no local uncommitted changes. **Local = git (in sync).**

3. **Created this AGENTS.md** to track all work going forward.

### Key files
| Path | Purpose |
|------|---------|
| `client/src/App.jsx` | Root component with routing |
| `client/src/main.jsx` | Entry point |
| `client/src/pages/LandingPage.jsx` | Landing (ParticleCanvas, CursorAurora, WordCycle, MockCard, DonutChart) |
| `client/src/pages/DashboardPage.jsx` | Dashboard with KPI cards + charts |
| `client/src/pages/TransactionsPage.jsx` | Transactions table + form + filters |
| `client/src/components/dashboard/KPICard.jsx` | KPI metric card component |
| `client/src/components/dashboard/CashFlowChart.jsx` | Cash flow line chart |
| `client/src/components/dashboard/IncomeExpenseChart.jsx` | Income vs expense bar chart |
| `client/src/components/dashboard/ExpenseCategoryChart.jsx` | Donut expense breakdown |
| `client/src/components/transactions/TransactionTable.jsx` | Transaction rows with edit/delete |
| `client/src/components/transactions/TransactionForm.jsx` | Add/edit transaction modal |
| `client/src/context/AuthContext.jsx` | Auth state + login/register/logout |
| `client/src/context/TransactionContext.jsx` | Transaction state + CRUD + summary |
| `client/src/services/api.js` | Axios instance with JWT interceptor |
| `client/src/styles/variables.css` | Design tokens (colors, shadows, radii) |
| `server/index.js` | Express app entry with middleware |
| `server/src/controllers/authController.js` | Register/login/me handlers |
| `server/src/controllers/transactionController.js` | Transaction CRUD + summary |
| `server/src/schemas/validation.js` | Zod schemas for all inputs |
| `server/src/middleware/auth.js` | JWT verification middleware |
| `server/src/middleware/errorHandler.js` | Global error handler |
| `server/schema.sql` | DB schema (users + transactions) |
| `server/seed.js` | Demo data seeder |
| `render.yaml` | Render deployment config |

---

## Session: Fix Landing Page Char Animations (16 Jun 2026)

### Problem
The `Split` (Finances) and `WordCycle` (cycling words) characters animations weren't firing. Root cause: CSS modules scope `@keyframes` names, so the `animation` property in the module CSS referenced a scoped name that didn't match the actual hashed keyframe name.

### Fix applied
1. **`client/src/styles/global.css`** — Added `@keyframes charUp`, `@keyframes charUpClip`, `@keyframes charBubble`, `@keyframes blink` globally (no scoping).
2. **`client/src/pages/LandingPage.module.css`** — Removed animation declarations and `@keyframes` blocks from `.ch`, `.cycleChar`, `.cycleWordExit .cycleChar` rules. Added `.cursor` style.
3. **`client/src/pages/LandingPage.jsx`** — `Split` now applies the `charUp` animation via inline `style`. `WordCycle` was rewritten as a typewriter: types chars one-by-one (55ms each), pauses 1.8s, erases chars one-by-one (30ms each), then types the next word. Includes a blinking cursor.

### WordCycle rewrite (typewriter)
- **Before**: Char spring-up entrance + bubble exit, cycling every 3s
- **After**: Typewriter effect — chars appear/disappear one at a time with a blinking `|` cursor. Word list unchanged: reimagined, simplified, unlocked, redefined, elevated, visualised, transformed.
