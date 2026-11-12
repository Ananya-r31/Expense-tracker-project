# Pennywise — Expense Tracker with Analytics

A responsive full-stack expense tracker built to the supplied React + Node.js + Express-only requirements. Users can record income and expenses, categorise and filter transactions, mark recurring entries, set monthly category budgets, see overspending alerts, inspect SVG/CSS analytics, and export filtered transactions to CSV.

> **Storage note:** The server stores data in seeded in-memory arrays. All changes are lost when the Express process restarts. This is intentional and satisfies the no-database requirement. There is no login or authentication.

## 1. Objectives and features

- Transaction CRUD for income and expenses.
- Categories, dates, optional notes, and recurring flags.
- Date-range, category, and transaction-type filters.
- Monthly budget limits by category, progress indicators, and overspend alerts.
- Dashboard totals: income, expenses, balance, and allocated budget.
- Custom CSS bar chart and CSS conic-gradient category chart (no chart library).
- Monthly aggregation and category aggregation on the Express server.
- CSV export endpoint that respects active filters.
- Responsive interface with Overview, Transactions, Budgets, and Analytics views.
- Hand-written request validation, API 404 handling, and central error middleware.
- API integration tests using `node:test` and built-in `fetch`.

## 2. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, CSS, browser `fetch()` |
| Backend | Node.js 20+, Express 5, `express.json()`, `express.static()` |
| Data | In-memory JavaScript arrays and objects, seeded sample records |
| Charts | Hand-built CSS bars and CSS conic-gradient donut |
| Export | Express CSV response with `Content-Disposition` attachment |
| Tests | Node.js built-in test runner and `fetch()` |

No database, ORM, auth library, Axios, React Router, Redux, Recharts, Socket.IO, or extra middleware package is used.

## 3. Architecture and workflow

```text
Browser (React UI, Vite during development)
        | native fetch / JSON
        v
Express API (validation, routes, aggregation, CSV export)
        |
        v
In-memory transactions[] and budgets[] (seeded in server/data.js)

Production: Express serves the Vite dist/ build and the /api endpoints.
```

The browser manages page selection and form/filter state with React hooks. Express owns the source data and performs aggregation. The UI refreshes from the API after successful mutations.

## 4. Folder structure

```text
expense-tracker-analytics/
├── index.html
├── package.json
├── package-lock.json             # created by npm install
├── vite.config.js
├── .env.example
├── .gitignore
├── README.md
├── GITHUB_GUIDE.md
├── DEPLOYMENT_GUIDE.md
├── server/
│   ├── data.js                   # seeded in-memory data and categories
│   └── index.js                  # Express API, validation, CSV, production static hosting
├── src/
│   ├── main.jsx                  # React application and components
│   └── style.css                 # responsive UI and custom charts
└── tests/
    └── api.test.js               # API integration test
```

## 5. Requirements

- Windows 10/11, macOS, or Linux.
- Node.js 20 LTS or newer (includes npm).
- Git for GitHub upload (optional).
- VS Code (recommended).
- Internet access for the initial npm package install. Google Fonts are optional; the app falls back to local system fonts.

Check installations in PowerShell:

```powershell
node --version
npm --version
git --version
```

## 6. Local setup (Windows PowerShell)

1. Extract the ZIP archive.
2. Open VS Code → **File → Open Folder** → select `expense-tracker-analytics`.
3. Open **Terminal → New Terminal**. Confirm the terminal is in the project root (the folder containing `package.json`).
4. Install dependencies:

```powershell
npm install
```

5. Optional: copy `.env.example` to `.env`. The defaults work without an `.env` file.
6. Start the backend in terminal 1:

```powershell
npm run dev:server
```

7. Start the frontend in terminal 2 (open another VS Code terminal):

```powershell
npm run dev:client
```

8. Open **http://localhost:5173**. The Vite development server proxies `/api` calls to Express at port 3001.

Backend health check: **http://localhost:3001/api/health**.

### Production-style local run

Build the frontend, then let Express serve it:

```powershell
npm run build
npm start
```

Open **http://localhost:3001**. Express automatically serves `dist/` when the production build exists.

## 7. Environment variables

| Variable | Default | Purpose |
|---|---:|---|
| `PORT` | `3001` | Express listening port |
| `NODE_ENV` | development | Set to `production` to serve `dist/` from Express |

`.env.example` is a reference only. Node does not automatically load `.env` in this project; set environment variables in the shell or hosting dashboard. No secrets or API keys are required.

## 8. API reference

All endpoints are prefixed with `/api`. JSON request bodies require `Content-Type: application/json`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health and in-memory storage status |
| GET | `/api/categories` | Available category names |
| GET | `/api/transactions` | List transactions; optional `from`, `to`, `category`, `type` query filters |
| POST | `/api/transactions` | Create a transaction |
| PUT | `/api/transactions/:id` | Replace editable fields for a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |
| GET | `/api/budgets` | List category budgets |
| PUT | `/api/budgets/:category` | Create/update a category budget (`{"limit": 350}`) |
| GET | `/api/analytics` | Income, expenses, balance, category and monthly aggregates; same filters as transactions |
| GET | `/api/export` | Download CSV; same filters as transactions |

Example create body:

```json
{
  "title": "Grocery shopping",
  "amount": 45.75,
  "type": "expense",
  "category": "Food",
  "date": "2026-11-12",
  "recurring": false,
  "note": "Weekly groceries"
}
```

Validation requires a non-empty title (max 80 characters), positive finite amount, `income` or `expense` type, a supported category, a `YYYY-MM-DD` date, and a note no longer than 240 characters. Invalid requests return HTTP 400 with an `errors` array; missing transaction IDs return 404.

PowerShell examples:

```powershell
Invoke-RestMethod http://localhost:3001/api/health
Invoke-RestMethod http://localhost:3001/api/transactions
```

## 9. Testing

Run syntax checks and integration tests:

```powershell
npm run check
npm test
```

The integration test starts an isolated Express process on port 3199 and checks health, invalid-input rejection, transaction creation/listing/deletion, analytics, and CSV content type. Do not run another app on port 3199 while tests execute.

Manual checklist:

- [ ] Overview loads seeded transactions and summary cards.
- [ ] Add an income and an expense; confirm the list and totals update.
- [ ] Edit a transaction and confirm the new values appear.
- [ ] Delete a transaction after confirming the prompt.
- [ ] Filter by date, category, and type; clear filters.
- [ ] Set a budget below the category spend and confirm the overspend warning.
- [ ] Export CSV and verify the downloaded rows reflect active filters.
- [ ] Resize the browser to a mobile width and check navigation, filters, charts, and tables.
- [ ] Restart Express and confirm that the in-memory data resets (expected behaviour).

## 10. Common errors

- **`node` or `npm` is not recognised:** install Node.js 20+ from the official Node.js website, close/reopen PowerShell, and retry.
- **Port 3001 is in use:** stop the other process or set `$env:PORT="3002"`; if using Vite, update the proxy target in `vite.config.js` to match.
- **Frontend cannot reach API:** make sure the backend terminal is running on port 3001 and reload `http://localhost:5173`.
- **Blank page after changes:** check the browser developer console and terminal output; confirm `npm install` completed.
- **Changes disappeared:** expected with in-memory storage; restarting the server resets data to the sample seed.
- **CSV did not download:** check that `/api/export` responds and that the browser has not blocked downloads.

## 11. GitHub and deployment

See [REQUIREMENTS_CHECKLIST.md](./REQUIREMENTS_CHECKLIST.md) for requirement-to-file traceability. See [GITHUB_GUIDE.md](./GITHUB_GUIDE.md) for exact PowerShell commands and [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for hosting options, environment variables, build/start commands, and live-site checks.

## 12. Scope and limitations

- The app is intentionally single-process and in-memory. It is a learning/demo project, not durable financial record storage. Every server restart resets transactions and budgets.
- No user accounts, roles, login, or authentication are implemented because the supplied allowed stack explicitly excludes an auth library and the brief does not require multi-user support.
- “Recurring” is a transaction label/flag for identifying repeated payments; the app does not automatically generate future transactions or schedule payments.
- Currency is currently displayed as USD for a consistent demo. Change the `currency` option in `src/main.jsx` if a different display currency is required.
- Sample records are illustrative seeded data, not connected to a bank or real account.
- Deployment requires a Node-capable host. A static-only host cannot run the Express API.
