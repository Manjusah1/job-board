# Architecture Decisions

## Why React + TypeScript + Vite
- React provides a fast way to build interactive UI with reusable patterns.
- TypeScript protects data model changes and prevents runtime bugs in filtering logic.
- Vite provides fast local development and lightweight static deployment.

## Layered Design

### Data model
- A strict Job interface keeps all job records consistent.
- SortBy and union types reduce invalid state values.

### Service layer
- fetchJobs simulates backend behavior with async calls.
- calculateMatchScore centralizes business logic so it can move to backend later without rewriting UI.

### Presentation layer
- App composes hero, filter controls, and job cards.
- Derived collections use useMemo to avoid expensive recomputation.
- UI state and persistence are intentionally separated from domain objects.

## State Management Choices
- Local component state is enough for this project size.
- localStorage persists saved and applied jobs without needing backend auth.
- Derived lists (filtered, sorted, paginated) are computed from a single source of truth.

## CI/CD Strategy
- Pull requests and pushes run lint + build.
- Main branch additionally deploys to Vercel when required secrets are available.
- Deployment uses Vercel CLI with prebuilt artifacts for predictable production output.
