# Implementation Plan: Premium Todo Frontend UI

**Branch**: `002-premium-todo-ui` | **Date**: 2026-01-07 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/002-premium-todo-ui/spec.md`

## Summary

Deliver a production-ready, dashboard-style **frontend-only** Todo experience that: (1) enforces authentication at the UI boundary, (2) supports task CRUD + completion toggle, and (3) provides consistent loading/empty/error states with strong accessibility and responsive design. This plan executes within the existing Next.js App Router project under `frontend/`, using centralized API/auth utilities.

---

## Technical Context

**Language/Version**: TypeScript (strict) + Next.js 16.1.1 App Router (`frontend/package.json:11`)
**Primary Dependencies**: Next.js, React, Tailwind CSS v4 (`frontend/package.json:11-23`)
**Storage**: Auth session stored server-side in an HTTP-only cookie (`frontend/lib/auth.ts:4-33`)
**Testing**: No frontend test framework configured in this repo snapshot; use repo conventions when adding tests in `/sp.tasks` phase
**Target Platform**: Web (evergreen Chrome/Edge/Firefox/Safari)
**Project Type**: Web application (frontend-only scope for this feature)
**Performance Goals**: Task list interactions feel immediate; completion toggles and form submits provide instant feedback (see `spec.md` SC-002)
**Constraints**:
- Server Components by default; Client Components only for interactive UI (forms, toggles, filters)
- Do not implement backend/database/infra
- Do not hardcode user IDs; rely on authenticated session
- Centralize HTTP calls in `frontend/lib/api.ts` and `frontend/lib/apiServer.ts`
**Scale/Scope**: Premium UI/UX polish over core flows (dashboard → tasks list → create/edit/delete → toggle completion)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Spec-driven delivery**: Plan references `specs/002-premium-todo-ui/spec.md` and produces required artifacts under `specs/002-premium-todo-ui/`.
- [x] **Agent scope**: Frontend-only planning; backend/database explicitly out of scope.
- [x] **Authenticated multi-tenancy**: UI gates protected routes via middleware + protected layout; no cross-user assumptions.
- [x] **Layered web architecture**: UI → centralized API client (`frontend/lib/api*.ts`) → backend.
- [x] **Reliability & observability expectations**: Plan includes consistent loading/empty/error states and failure handling for mutations (rollback UX for completion toggle).
- [x] **Secure data stewardship**: Uses HTTP-only cookie session storage; no token logging.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-premium-todo-ui/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/
│   └── api-contracts.md # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── login/
│   ├── register/
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   └── tasks/
│   └── api/                 # Next.js route handlers (same-origin API façade)
├── components/
├── lib/
│   ├── api.ts               # client-side fetch helper (same-origin)
│   ├── apiServer.ts         # server-only fetch helper (API_BASE_URL + Bearer)
│   ├── apiTypes.ts
│   └── auth.ts              # cookie-based session helpers
├── middleware.ts
├── styles/
└── types/
    ├── task.ts
    └── user.ts
```

**Structure Decision**: Use the existing `frontend/` Next.js App Router application as the sole frontend. Extend it for “premium” UI/UX rather than creating a second app root.

---

## Phase 0: Outline & Research (planning-only)

**Inputs**:
- Feature requirements: `specs/002-premium-todo-ui/spec.md`
- Existing app conventions: `frontend/CLAUDE.md`, `frontend/lib/*`, `frontend/app/*`

**Outputs**:
- `specs/002-premium-todo-ui/research.md` (created)

Research decisions captured:
- Missing referenced `/specs/ui/*` and `/specs/features/*` are treated as non-authoritative for this repo snapshot; reuse existing conventions.
- Session handling uses cookie-based `todo_session`.
- Server-side API wrapper uses `API_BASE_URL` and bearer injection.

---

## Phase 1: Design & Contracts

### 1) Types (confirm / extend)

- Use the existing types:
  - User/Session: `frontend/types/user.ts:0-10`
  - Task: `frontend/types/task.ts:0-13`
- Confirm UI expectations in tasks UI align with `Task.status` values (`pending` vs `completed`) and map UI labels accordingly.

### 2) API contracts (frontend expectations)

- Documented in: `specs/002-premium-todo-ui/contracts/api-contracts.md`
- Key enforcement points already exist:
  - Server-side fetch with auth + redirect on 401: `frontend/lib/apiServer.ts:19-58`
  - Client-side fetch helper for same-origin route handlers: `frontend/lib/api.ts:22-59`

### 3) Auth route protection strategy

- Middleware protects `/dashboard` and `/tasks`: `frontend/middleware.ts:15-17`
- Protected layout server-redirects to `/login` if session missing: `frontend/app/(protected)/layout.tsx:5-13`

This provides a defense-in-depth approach:
- middleware prevents unauthenticated entry
- protected layout prevents SSR rendering without session

---

## Phase 2: Frontend Execution Plan (implementation sequencing)

This is the step-by-step plan a frontend engineer can follow to implement premium UI/UX while staying within existing structure.

### Step 1 — Verify Next.js App Router structure

- Confirm these are present and are the single source of routing:
  - Root redirect: `frontend/app/page.tsx:4-7`
  - Global layout: `frontend/app/layout.tsx:22-34`
  - Protected route group: `frontend/app/(protected)/*`
  - Route handlers under `frontend/app/api/*`

### Step 2 — Configure Tailwind CSS

- Tailwind v4 is configured via PostCSS plugin: `frontend/postcss.config.mjs:0-6`
- Global CSS imports Tailwind with `@import "tailwindcss";`: `frontend/app/globals.css:0-25`
- Ensure there is exactly one global stylesheet used by the App Router layout: `frontend/app/layout.tsx:3`

### Step 3 — Define global layout (`layout.tsx`)

- Root layout responsibilities:
  - Font setup (already uses Geist): `frontend/app/layout.tsx:7-15`
  - Global providers (ToastProvider exists): `frontend/app/layout.tsx:29-31`
  - Metadata baseline (already present): `frontend/app/layout.tsx:17-20`
- Premium UI/UX work should primarily be:
  - consistent page container widths
  - accessible focus styles
  - consistent background and typography

### Step 4 — Setup global styles and typography

- Use `frontend/app/globals.css` as the canonical global stylesheet.
- Confirm and align variables for background/foreground and dark mode behavior:
  - `frontend/app/globals.css:2-25`
- Ensure typography is consistent with font variables attached to `<body>`:
  - `frontend/app/layout.tsx:29-31`

### Step 5 — Prepare CLAUDE.md with project rules

- Frontend-specific rules already exist:
  - `frontend/CLAUDE.md` (scope + conventions)
- Ensure engineers follow:
  - central API calls in `frontend/lib/api.ts` / `apiServer.ts`
  - session handling in `frontend/lib/auth.ts`
  - server components by default

---

## Phase 3: Core Utilities (per prompt “PHASE 1 – TYPES & CORE UTILITIES”)

### 3.1 Types

- Validate that `frontend/types/user.ts` and `frontend/types/task.ts` cover all fields required by UI.
- Add only fields that are clearly used by the UI and already available from API responses.

### 3.2 API client (`/lib/api.ts` + `/lib/apiServer.ts`)

- Client-side API helper (same-origin): `frontend/lib/api.ts:22-59`
  - Sets JSON headers
  - Normalizes non-OK responses into `ApiError`
- Server-side API helper: `frontend/lib/apiServer.ts:19-58`
  - Reads `API_BASE_URL` env var
  - Injects `Authorization: Bearer <token>` from session
  - Redirects to login on missing session or 401

### 3.3 Auth utility (`/lib/auth.ts`)

- Cookie-based session is already implemented:
  - `frontend/lib/auth.ts:4-33`
- Helpers available:
  - `getSession()`
  - `setSession(session)`
  - `clearSession()`

---

## Phase 4: UI/UX Implementation Workstreams

### 4.1 Dashboard UX

- Ensure dashboard page provides:
  - quick overview of task counts
  - primary CTA to create a task
  - link to tasks list

### 4.2 Tasks UX (CRUD + completion)

- Tasks list must provide:
  - loading skeleton state
  - empty state with CTA
  - error state with retry
  - per-task actions: edit, delete (with confirmation), toggle completion
  - optimistic completion toggle with rollback on failure (FR-007)

### 4.3 Accessibility

- Keyboard navigable:
  - all buttons/inputs reachable
  - visible focus
  - dialogs trap focus and restore on close (delete confirm)
- Meaningful ARIA for:
  - toasts
  - dialogs
  - form field errors

### 4.4 Responsive design

- Validate layout at:
  - small mobile (≈360px)
  - tablet
  - desktop (≈1440px)

---

## Phase 5: Validation & Acceptance

Map directly to `spec.md`:
- User Story 1: Dashboard + tasks list present with states.
- User Story 2: Create/edit form validates + persists.
- User Story 3: Completion toggle is fast, reliable, rollback-safe.

---

## Complexity Tracking

No constitution violations identified that require justification.
