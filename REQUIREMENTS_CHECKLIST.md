# Requirements checklist and implementation traceability

This matrix maps the supplied project brief to the actual source files. A checked item means the corresponding implementation is present in this archive; it does not imply an external deployment has occurred.

| Requirement | Implementation | Status / notes |
|---|---|---|
| React frontend with hooks | `src/main.jsx` | Implemented |
| Vite as build tool | `vite.config.js`, `package.json` | Implemented |
| Node.js + Express backend | `server/index.js` | Implemented |
| No database; in-memory seeded data | `server/data.js` | Implemented; resets on server restart |
| No auth library / no authentication requirement | `server/index.js`, `README.md` | No login/authentication included |
| Native fetch for frontend API calls | `src/main.jsx` | Implemented |
| Transaction CRUD | `server/index.js`, `src/main.jsx` | Implemented |
| Categories | `server/data.js`, `src/main.jsx` | Implemented |
| Recurring transaction marker | `server/index.js`, `src/main.jsx` | Implemented as a flag; no automatic scheduler |
| Monthly category budgets | `server/data.js`, `server/index.js`, `src/main.jsx` | Implemented |
| Overspend alerts | `src/main.jsx`, `src/style.css` | Implemented |
| Custom charts, no chart package | `src/main.jsx`, `src/style.css` | Implemented with CSS bars and conic-gradient donut |
| CSV export from Express | `server/index.js`, `src/main.jsx` | Implemented; active filters are applied |
| Date-range filters | `server/index.js`, `src/main.jsx` | Implemented |
| User stories / feature requirements | `README.md`, this file | Documented from supplied brief |
| Data shapes and API endpoint list | `server/data.js`, `README.md` | Implemented/documented |
| Hand-written validation | `server/index.js` | Implemented |
| Error handling | `server/index.js`, `src/main.jsx` | API 404, validation responses, server error middleware and UI messages |
| Loading and error states | `src/main.jsx`, `src/style.css` | Implemented |
| Responsive interface | `src/style.css` | Implemented |
| Node built-in API tests | `tests/api.test.js`, `package.json` | Implemented; requires dependencies installed |
| README and local run instructions | `README.md` | Included |
| Windows GitHub guide | `GITHUB_GUIDE.md` | Included |
| Deployment guide | `DEPLOYMENT_GUIDE.md` | Included; no deployment performed |
| Environment example and Git ignore | `.env.example`, `.gitignore` | Included |
| Production frontend served by Express | `server/index.js`, `package.json` | Implemented when `dist/index.html` exists |

## Common workflow mapping

| Phase | Deliverable | Files |
|---|---|---|
| Plan | Scope, requirements and feature mapping | `README.md`, `REQUIREMENTS_CHECKLIST.md` |
| Design | In-memory data shapes and API contract | `server/data.js`, `README.md` |
| Backend | Express routes, validation, aggregation, CSV | `server/index.js` |
| Frontend | React views, forms, charts, filters | `src/main.jsx`, `src/style.css` |
| Integrate | Native fetch calls and loading/error states | `src/main.jsx`, `vite.config.js` |
| Harden | Validation, 404 and error middleware | `server/index.js` |
| Test | API integration test and manual checklist | `tests/api.test.js`, `README.md` |
| Build and present | Vite build, Express static hosting, documentation | `package.json`, `server/index.js`, `README.md` |

## Deliberate scope clarifications

- The supplied main project description says there is no database and data is kept in memory. Therefore no database configuration, schema, ORM, or persistence layer is included.
- The allowed stack explicitly excludes auth libraries and does not list authentication as an Expense Tracker feature. Therefore there is no login or role system.
- “Recurring transactions” are marked and displayed as recurring. Automatic future transaction creation and payment scheduling were not specified and are not claimed as implemented.
- The project displays USD as a demo currency. It does not connect to bank accounts or financial institutions.
