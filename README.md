# Career Radar Job Board

Career Radar is an AI-assisted frontend job board built with React, TypeScript, and Vite.
It focuses on high-signal browsing with strong filters, skill-based match scoring, and practical UX details.

## Tech Stack
- React 19
- TypeScript
- Vite
- ESLint
- GitHub Actions
- Vercel (deployment target)

## Features
- Curated role cards with salary, experience level, role type, and skills.
- Search and multi-criteria filtering (location, type, remote, salary threshold, skills).
- Sort by newest, salary, or AI match score.
- Save and applied toggles persisted in localStorage.
- Responsive layout for desktop and mobile.

Detailed documentation:
- Product features: docs/FEATURES.md
- Architecture choices: docs/ARCHITECTURE.md
- Submission checklist: docs/DELIVERY_CHECKLIST.md

## Local Setup

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## CI/CD Pipeline

Workflow file:
- .github/workflows/ci-cd.yml

Behavior:
- On pull request to main: installs dependencies, runs lint, runs build.
- On push to main: runs CI and then deploys to Vercel when required secrets are present.

Required GitHub repository secrets for deployment job:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID

## Manual Steps You Need To Do

### 1. Push code to GitHub

```bash
git init
git add .
git commit -m "feat: build career radar job board"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

### 2. Connect project to Vercel once
- Create/import this repository in Vercel.
- In Vercel project settings, copy values for Org ID and Project ID.
- Create a Vercel token from account settings.

### 3. Configure GitHub secrets
- In your GitHub repo, go to Settings > Secrets and variables > Actions.
- Add:
  - VERCEL_TOKEN
  - VERCEL_ORG_ID
  - VERCEL_PROJECT_ID

### 4. Trigger production deployment
- Push to main again, or run the CI-CD workflow manually from GitHub Actions.
- The deploy-vercel job will publish the app.

## Final Links To Submit
- GitHub repository URL
- Vercel production URL

You can use docs/DELIVERY_CHECKLIST.md to track completion before submission.
