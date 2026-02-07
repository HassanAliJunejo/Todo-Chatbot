# Frontend (Next.js App Router)

## Scope
- Frontend-only implementation for Phase II Todo App.
- Do not implement backend/database/infra.

## Tech constraints
- Next.js App Router + TypeScript + Tailwind.
- Server Components by default; Client Components only where interactivity is required.

## Conventions
- Centralize API calls in `frontend/lib/api.ts`.
- Centralize session/token handling in `frontend/lib/auth.ts`.
- Keep UI reusable components in `frontend/components/`.
- Avoid hardcoding user IDs; derive auth context from session/token.
