# Job Board Features

## Product Overview
Career Radar is a frontend-focused job board built with React + TypeScript.
It combines fast filtering, match scoring, and local persistence to provide a focused job discovery experience.

## Feature List

### 1. Curated job feed
- Uses a typed job model with metadata for role, location, type, salary, experience, and skills.
- Renders featured jobs with higher visual prominence.

### 2. Advanced filtering
- Search by title, company, location, and skill terms.
- Filter by location and job type.
- Remote-only toggle.
- Minimum salary slider.
- Skill chips for targeted matching.

### 3. Smart sorting
- Sort by newest posting date.
- Sort by highest salary.
- Sort by AI match score.

### 4. AI match scoring
- Candidate profile skills are compared to each job's skills.
- Produces a score between 35 and 99 to prioritize relevant roles.

### 5. Saved and applied state
- Save jobs directly from cards.
- Mark jobs as applied with one click.
- Persists both states in localStorage for a smooth revisit experience.

### 6. Progressive loading
- Loads an initial subset of jobs and reveals more with a Load More action.
- Keeps the UI responsive and focused.

### 7. Responsive and expressive UX
- Works on desktop, tablet, and mobile breakpoints.
- Includes intentional typography, rich color direction, and subtle entrance animations.

## Architecture Summary
- UI Layer: React components in App.
- Domain Layer: typed interfaces in src/types.ts.
- Data Layer: mock dataset in src/data/jobs.ts.
- Service Layer: async data simulation and match scoring in src/services/jobService.ts.

## Future Upgrades
- Integrate a real backend API (Node or serverless functions).
- Add auth and personal profile skill editing.
- Add pagination and analytics events.
- Add end-to-end testing with Playwright.
