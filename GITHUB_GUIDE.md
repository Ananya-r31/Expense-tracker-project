# GitHub Upload Guide (Windows PowerShell)

This guide publishes the project source to GitHub. GitHub hosting stores the code; it does not by itself run the Express server.

## 1. Install and sign in

1. Create a GitHub account at https://github.com/ if you do not already have one.
2. Verify your email and sign in.
3. Install Git for Windows from https://git-scm.com/download/win.
4. Open a new PowerShell terminal and verify:

```powershell
git --version
```

## 2. Create an empty GitHub repository

1. On GitHub, click **New repository**.
2. Repository name: `expense-tracker-analytics` (or another name you prefer).
3. Add a short description such as `React and Express expense tracker with in-memory analytics`.
4. Choose **Public** if you want anyone to view the code, or **Private** if you want restricted access.
5. For the easiest first push, do not initialise with a README, `.gitignore`, or licence because this project already contains files for those purposes.
6. Click **Create repository** and keep the repository page open to copy its HTTPS URL.

## 3. Open the project in VS Code

1. Extract the ZIP.
2. Open VS Code → **File → Open Folder** → choose the extracted `expense-tracker-analytics` folder.
3. Choose **Terminal → New Terminal**.
4. Confirm you are in the project root:

```powershell
Get-Location
Get-ChildItem
```

You should see `package.json`, `src`, `server`, and `README.md`.

## 4. Initialise Git and commit

Run these commands in the project root terminal:

```powershell
git init
git add .
git status
git commit -m "Initial commit: Expense Tracker with Analytics"
```

If Git asks for your identity, configure the name and email associated with your GitHub account (use your own details):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Then run the `git commit` command again.

## 5. Connect and push to GitHub

Replace the URL below with the HTTPS URL shown on your newly created GitHub repository page:

```powershell
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/expense-tracker-analytics.git
git remote -v
git push -u origin main
```

Git Credential Manager may open a browser to authenticate. Complete the sign-in in the browser; do not paste a password or personal access token into source code.

## 6. Verify the upload

Refresh the GitHub repository page. Confirm that `src`, `server`, `tests`, `package.json`, `README.md`, `GITHUB_GUIDE.md`, and `DEPLOYMENT_GUIDE.md` are visible. The `node_modules` and `dist` folders should not be uploaded.

## 7. Push future updates

After editing and testing your project, run these commands from the same project root:

```powershell
git status
git add .
git commit -m "Describe your update"
git push
```

If you only want to stage a particular file, use `git add path/to/file` instead of `git add .`.

## 8. Keep secrets and generated files out of Git

The included `.gitignore` excludes `node_modules/`, `dist/`, `.env`, local logs, editor settings, and coverage output. `.env.example` is safe to commit because it contains only non-secret variable names and defaults. Never commit passwords, API keys, credentials, personal financial exports, or real account data.

If a secret is accidentally committed, deleting it in a later commit is not enough: rotate/revoke the exposed credential immediately and clean the repository history if necessary.
