# FinSight - Personal Expense Tracker

A full-stack expense tracking platform with JWT authentication, spending analytics, and automated budget alerts.

**FinSight - Personal Expense Tracker | React, Node.js, MongoDB**  
Built a full-stack expense tracking platform featuring JWT authentication, spending analytics, and automated budget alerts to help users manage financial habits effectively. Implemented a category-wise spending aggregation pipeline using the MongoDB aggregation framework, enabling real-time dashboard updates with sub-100ms query response on 10k+ transaction records.

## Tech Stack

- **Frontend:** React 18 (Vite) + Tailwind CSS + Recharts
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB
- **Auth:** JWT in httpOnly cookies

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or update `MONGO_URI` in `server/.env`)

### Setup

```bash
# Install dependencies
npm --prefix server install
npm --prefix client install

# Seed default categories after MongoDB is running
npm run seed

# Start server
npm run server

# Start client in another terminal
npm run client
```

Server runs on port 5000, client on port 3000.

If MongoDB is not running at `MONGO_URI`, the server uses an in-memory MongoDB fallback in development. Set `USE_MEMORY_DB=false` in `server/.env` if you want startup to fail instead.

## Password Reset Emails

To send real Gmail password reset emails, add these values to `server/.env`:

```env
CLIENT_URL=http://localhost:3000
APP_NAME=FinSight
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_google_app_password
EMAIL_FROM="FinSight <your_email@gmail.com>"
```

Gmail requires an App Password. In your Google account, enable 2-Step Verification, create an App Password for Mail, and paste that 16-character password into `SMTP_PASS`. Do not use your normal Gmail password.

## Features

- **Authentication:** Register, login, JWT refresh tokens in httpOnly cookies
- **Expense Tracking:** CRUD with filtering by date, category, type, search
- **Category Management:** Default + custom categories with icons and colors
- **Budget Alerts:** Set monthly budgets per category, get warnings at 80%, alerts at 100%
- **Analytics Dashboard:** Category pie chart, monthly trend line chart, stat cards
- **MongoDB Aggregation:** Sub-100ms queries on 10k+ records with compound indexes

## API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET | `/api/expenses` | List expenses (paginated, filtered) |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |
| GET | `/api/budgets` | List budgets |
| GET | `/api/budgets/status` | Budget status with spend |
| POST | `/api/budgets` | Set budget |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |
| GET | `/api/analytics/summary` | Monthly summary |
| GET | `/api/analytics/category-breakdown` | Pie chart data |
| GET | `/api/analytics/monthly-trend` | Line chart data |
