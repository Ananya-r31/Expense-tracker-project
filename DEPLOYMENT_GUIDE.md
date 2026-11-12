# Deployment Guide

## Recommended architecture

This application is a React/Vite frontend plus a Node.js/Express API. For the simplest deployment, build React and serve the generated `dist/` folder from the same Express process. This avoids separate frontend/backend origins and CORS configuration.

**Recommended beginner-friendly option:** Render Web Service connected to the GitHub repository. The free plan availability, sleep behaviour, build limits, and pricing can change; check the provider's current plan details before relying on it. In-memory data is reset whenever the service restarts or redeploys, so this deployment is for demonstration only.

Alternative: use a Node-capable service such as Railway or Fly.io if you prefer their workflow and current pricing. A static-only frontend host (for example, a static site service) cannot run the Express API. No database host is needed or used by this project.

## 1. Prepare and push the project

1. Test locally with `npm install`, `npm test`, and `npm run build`.
2. Push the project to GitHub using [GITHUB_GUIDE.md](./GITHUB_GUIDE.md).
3. Ensure `package.json`, `server/`, `src/`, and `index.html` are in the repository.

## 2. Deploy as one Express web service (Render example)

1. Create/sign in to an account at https://render.com/.
2. Choose **New → Web Service** and connect your GitHub account if asked.
3. Select the `expense-tracker-analytics` repository and the correct branch (usually `main`).
4. Configure:
   - **Runtime:** Node
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Health check path:** `/api/health` (if the dashboard offers this field)
5. Add environment variables:
   - `PORT` is normally assigned by the platform; do not hard-code it. The server reads `process.env.PORT`.
6. Choose an available instance plan. If a free plan is offered for your account/region, review its sleep and usage limitations. A paid plan may be required for always-on service or higher usage.
7. Start deployment and watch the build/runtime logs. The build must complete before the service can serve the React UI.
8. When the provider displays the service URL, open it. The same URL serves the frontend and `/api` endpoints.

## 3. Post-deployment verification

Replace `YOUR-SERVICE` with the actual hostname shown by your hosting provider:

```text
https://YOUR-SERVICE.onrender.com/
https://YOUR-SERVICE.onrender.com/api/health
https://YOUR-SERVICE.onrender.com/api/transactions
https://YOUR-SERVICE.onrender.com/api/analytics
```

Check that:

- The home page loads over HTTPS.
- The health endpoint returns JSON with `status: "ok"`.
- Seeded transactions appear in the UI.
- Add/edit/delete actions work.
- Budget changes and analytics update.
- CSV export downloads a file.
- Browser developer tools show no failed `/api` requests.

## 4. Separate frontend and backend (optional)

A separate deployment is possible but unnecessary for this project. If you choose it:

1. Deploy the Express backend to a Node-capable web service. No `NODE_ENV` setting is required; Express serves the `dist/` build automatically when present. only if the backend should also serve its own `dist` build; for a split deployment it can remain unset.
2. Deploy the Vite frontend to a static host. Set Vite's API base URL to the public backend origin (you would need to change the current relative `/api` calls and configure the backend CORS policy).
3. Configure the backend to allow only the deployed frontend origin. Do not use wildcard CORS for a public production service.
4. Rebuild and redeploy the frontend after changing its API URL.

The current source is intentionally configured for same-origin deployment and Vite's local `/api` proxy. It does not include a separate-origin CORS configuration or an API-base environment variable because the recommended single-service deployment does not need either.

## 5. Common deployment issues

- **Build fails:** inspect the provider build logs; confirm Node 20+ is selected and the build command is `npm install && npm run build`.
- **Service exits on start:** use `npm start`; do not use the Vite dev command as the production start command.
- **Page works but API is 404:** ensure the service root is the repository root and that Express is the deployed start process.
- **Health check fails:** verify the service is listening on `process.env.PORT`; do not set a fixed port in the host dashboard.
- **Data resets:** this is expected for in-memory arrays after restarts/redeploys/instance replacement. Persistent financial records would require changing the original no-database constraint.
- **Free instance sleeps or is unavailable:** review the host's current plan terms. Use a suitable paid Node web-service plan if you need reliable always-on access.
- **Static host displays a 404 or API calls fail:** static hosting alone cannot run this Express backend. Deploy the Node server as a web service or use the combined Express deployment above.

## 6. Deployment scope

The deployment guide describes a supported deployment configuration; it does not mean the project has been published. You must connect your own GitHub/hosting accounts and initiate deployment. No external account, domain, paid plan, or deployment was created as part of this project build.
