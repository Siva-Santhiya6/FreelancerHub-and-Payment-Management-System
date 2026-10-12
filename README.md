# FreelancerHub — Full Stack Platform

## Tech Stack
- **Frontend**: React 18, Redux Toolkit, React Router, Recharts, Vite
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT, bcryptjs
- **AI**: Provider-independent (Demo mode / Claude / OpenAI switchable)
- **Features**: Multilingual (EN/Tamil/Hindi), Dark mode, Voice AI, Escrow, Charts

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
```

### 3. Seed Demo Data
```bash
cd backend
node seed/seed.js
```

### 4. Start Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npx vite
# Runs on http://localhost:5173
```

### 5. Open Browser
Go to: **http://localhost:5173**

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Client | client@freelancerhub.com | Client@123 |
| Freelancer | freelancer@freelancerhub.com | Freelancer@123 |
| Admin | admin@freelancerhub.com | Admin@123 |
| Payment Manager | payment@freelancerhub.com | Payment@123 |

Or use the **Quick Demo Login** buttons on the login page.

---

## Features by Role

### CLIENT
- Post projects with budget, skills, deadline
- View and accept proposals from freelancers
- Fund escrow and release milestone payments
- View project progress and milestones
- Full payment transaction history

### FREELANCER
- Browse marketplace with AI skill-match scores
- Submit proposals with cover letter and bid
- Track proposal status
- View earnings and payment history

### ADMIN
- User management (verify, delete)
- Platform-wide stats dashboard
- Revenue analytics

### PAYMENT MANAGER
- Full transaction history
- Revenue charts and stats

---

## AI Assistant (HubAI)
- Click the **bot icon** (bottom-right corner)
- Supports **English, Tamil, Hindi**
- **Voice input** (click mic button)
- **Text-to-speech** responses
- Can navigate the app via chat commands:
  - "Show my projects"
  - "Open payments"
  - "Switch to dark mode"
  - "Increase font size"

---

## Project Structure
```
freelancerhub/
├── backend/
│   ├── config/       # DB connection
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth, error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   ├── seed/         # Demo data seeder
│   ├── services/     # AI service
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/   # Reusable components
        ├── i18n/         # Translations (EN/TA/HI)
        ├── layouts/      # AppLayout, sidebar
        ├── pages/        # All page components
        └── store/        # Redux slices
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/projects | List all projects |
| POST | /api/projects | Create project |
| GET | /api/projects/:id | Project detail |
| POST | /api/proposals | Submit proposal |
| PUT | /api/proposals/:id/status | Accept/reject |
| POST | /api/payments/escrow/fund | Fund escrow |
| POST | /api/payments/release | Release payment |
| GET | /api/payments/transactions | Transaction history |
| POST | /api/ai/chat | AI chat |
| GET | /api/admin/stats | Admin stats |
| GET | /api/admin/users | All users |
