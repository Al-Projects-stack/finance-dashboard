# FinanceOS

A personal finance dashboard for tracking income, expenses, and cash flow. Built with React + Node.js + PostgreSQL.

## Features

- JWT authentication (register / login)
- Add, edit, and delete transactions (income & expense)
- Filter transactions by type, category, and date range
- Dashboard with KPI cards: balance, total income, total expenses, savings rate
- Charts: cash flow over time, income vs expenses (last 6 months), expense breakdown by category
- Currency: South African Rand (ZAR)

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Chart.js            |
| Backend  | Node.js, Express                    |
| Database | PostgreSQL                          |
| Auth     | JWT (jsonwebtoken) + bcrypt         |
| Validation | Zod                               |

## Prerequisites

- Node.js
- PostgreSQL

## Setup

### 1. Environment

Create `server/.env`:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/finance_dashboard
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 2. Database

```bash
psql -U postgres -c "CREATE DATABASE finance_dashboard;"
psql -U postgres -d finance_dashboard -f server/schema.sql
```

### 3. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 4. Seed demo data (optional)

```bash
cd server && npm run seed
```

Demo account: `demo@example.com` / `password123`

### 5. Run

```bash
# Terminal 1 — API on http://localhost:5000
cd server && npm run dev

# Terminal 2 — UI on http://localhost:5173
cd client && npm run dev
```

## Project Structure

```
finance-dashboard/
├── client/                   # React frontend
│   └── src/
│       ├── components/       # Dashboard charts, transaction table/form, sidebar
│       ├── context/          # AuthContext, TransactionContext
│       ├── pages/            # DashboardPage, TransactionsPage, LoginPage, RegisterPage
│       ├── services/api.js   # Axios instance with JWT interceptors
│       └── styles/           # Global CSS and design tokens
└── server/                   # Express backend
    ├── src/
    │   ├── controllers/      # authController, transactionController
    │   ├── middleware/        # JWT auth, error handler
    │   ├── routes/           # /api/auth, /api/transactions
    │   └── schemas/          # Zod validation schemas
    ├── schema.sql            # Database schema
    └── seed.js               # Demo data seeder
```

## API Endpoints

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/auth/register          | Register a new user      |
| POST   | /api/auth/login             | Login                    |
| GET    | /api/auth/me                | Get current user         |
| GET    | /api/transactions           | List transactions        |
| POST   | /api/transactions           | Create transaction       |
| PUT    | /api/transactions/:id       | Update transaction       |
| DELETE | /api/transactions/:id       | Delete transaction       |
| GET    | /api/transactions/summary   | Dashboard summary data   |
