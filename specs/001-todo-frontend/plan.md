# Implementation Plan: Phase II Todo Frontend

**Branch**: `001-todo-frontend` | **Date**: 2026-01-06 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/001-todo-frontend/spec.md`

## Summary

Deliver a complete, responsive Todo App **frontend-only** experience including authentication (login/register/logout + route protection), task CRUD (create/edit/delete), completion toggle, and filtering/search with consistent loading/empty/error states. Backend APIs are assumed to exist; the plan focuses on Next.js App Router structure, component boundaries, and API integration sequencing.

---

## Technical Context

**Language/Version**: TypeScript (Next.js 16+ App Router)
**Primary Dependencies**: Next.js, React, Tailwind CSS (no additional UI libraries assumed)
**Storage**: Browser-managed auth storage (prefer HTTP-only cookies; fallback per backend contract)
**Testing**: Frontend unit + integration testing (framework TBD; align with repo conventions when code exists)
**Target Platform**: Web (evergreen Chrome/Edge/Firefox/Safari)
**Project Type**: Web application (frontend-only scope for this feature)
**Performance Goals**: Task list interactions feel immediate; filtering/search updates within 1s for up to ~200 tasks (from spec SC-003)
**Constraints**:
- Server Components by default; Client Components only for interactivity (forms, toggles, filters)
- Must not implement or modify backend/database/infra
- Must not hardcode user IDs
- Must attach auth token automatically for API calls
**Scale/Scope**: Single frontend app, key pages: login, register, dashboard, tasks

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Spec-driven delivery: plan references `specs/001-todo-frontend/spec.md`.
- [x] Agent scope: this plan covers **frontend only**; backend/database explicitly out of scope.
- [x] Authenticated multi-tenancy invariant respected: frontend never assumes a user_id; always derives identity from auth context and backend.
- [x] Layered architecture respected: UI → frontend API layer (`frontend/lib/api.ts`) → backend endpoints.
- [x] Reliability expectations acknowledged: plan includes error states, retries/rollback behavior, and route protection.
- [x] Secure data stewardship: prefer HTTP-only cookie token storage; never log tokens.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-frontend/
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
│   ├── page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/page.tsx
│   └── tasks/page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── TaskList.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   └── FilterTabs.tsx
├── lib/
│   ├── api.ts
│   └── auth.ts
├── types/
│   ├── task.ts
│   └── user.ts
├── styles/
└── CLAUDE.md
```

**Structure Decision**: Use a dedicated `frontend/` app-root to match the required structure in the feature description. App Router pages live under `frontend/app/`, with shared UI in `frontend/components/` and a centralized API/auth layer in `frontend/lib/`.

---

## Phase 0: Spec Review Phase (planning-only)

### 1) Identify frontend requirements
From `specs/001-todo-frontend/spec.md`:
- Auth UI: login/register pages, validated fields, clear errors (FR-001)
- JWT/session handling: storage + attach on requests (FR-002)
- Protected routes: redirect unauthenticated to /login, preserve destination (FR-003)
- Dashboard: counts + quick links (FR-004)
- Task CRUD + completion: optimistic updates, rollback on error (FR-005)
- Filtering/search: All/Active/Completed, keyword search, URL-reflected state (FR-006)
- Performance: pagination/virtualization >50 tasks (FR-007)
- Navbar: identity + logout (FR-008)
- Responsive design: 360px→1440px (FR-009)
- UX feedback: toasts/alerts, no browser dialogs (FR-010)

From `specs/overview.md`:
- Server components for data fetching routes; client components for interactive islands
- `/lib/api.ts` centralizes fetch, bearer token, error normalization
- Empty states + loading skeletons + optimistic UI updates

**Spec gap noted**: The referenced files under `/specs/ui/*` and `/specs/features/*` are not present in this repo snapshot; therefore, this plan treats `specs/001-todo-frontend/spec.md` and `specs/overview.md` as the authoritative minimum.

### 2) List pages, components, flows
Pages (required):
- `/` (landing / redirect)
- `/login`
- `/register`
- `/dashboard`
- `/tasks`

Core flows:
- Unauthenticated → login/register → authenticated → dashboard → tasks list → CRUD + completion → filter/search
- Session expiry/401 → refresh if supported else force login

### 3) Extract acceptance criteria (planning)
- User can log in and is redirected to dashboard; token persists and is used for API calls (User Story 1)
- User can create/edit/delete tasks and completion persists after refresh (User Story 2)
- User can filter/search tasks and counts update correctly (User Story 3)

---

## Phase 1: Frontend Architecture Planning

### App Router page structure
- `frontend/app/layout.tsx`: shared shell (Navbar slot), global styles
- `frontend/app/page.tsx`: minimal entry that redirects based on auth state
- `frontend/app/(auth)/login/page.tsx` and `frontend/app/(auth)/register/page.tsx` (or direct /login, /register)
- `frontend/app/(protected)/dashboard/page.tsx`
- `frontend/app/(protected)/tasks/page.tsx`

### Shared layouts
- Public layout: auth pages without task navigation
- Protected layout: includes Navbar and route guard

### Server vs Client component decisions
Server Components (default):
- Route-level pages that fetch initial data (dashboard metrics, initial task list)

Client Components (only when needed):
- Auth forms (login/register)
- TaskForm (create/edit)
- Task completion toggle
- FilterTabs and search input
- Toast system / notification UI

### State boundaries
- Auth state boundary: `frontend/lib/auth.ts` (session retrieval, set/clear, redirect helpers)
- API boundary: `frontend/lib/api.ts` (token attachment + error normalization)
- Task state boundary: `frontend/components/TaskList.tsx` manages local optimistic state; server components provide initial list snapshot.
- URL state boundary: filters/search persisted via query parameters.

---

## Phase 2: Authentication Flow Planning (Frontend)

### Login / Register page flow
- `/register`: create account → on success, either auto-login (if backend returns token) or route to `/login` with success message
- `/login`: submit → store session → redirect to `next` destination (default `/dashboard`)

### Token storage strategy
- Primary: HTTP-only secure cookies (if backend sets them)
- Secondary: store access token in memory; on refresh, call refresh endpoint to rehydrate
- Last resort: localStorage/sessionStorage only if backend contract requires client-managed tokens

### Protected route strategy
- On server (preferred): check auth (via cookies) and redirect to `/login?next=...`
- On client: during navigation or API 401 handling, route to login and clear auth state

### Logout behavior
- Clear auth state (cookies if applicable via logout endpoint + clear client state)
- Redirect to `/login`

---

## Phase 3: UI Components Planning

Reusable components (required by prompt):

1) `Navbar`
- **Responsibility**: show app name, user identity, navigation links, logout action
- **State ownership**: receives session/user via props or reads via auth hook if client
- **Props**: user displayName/email, onLogout

2) `TaskList`
- **Responsibility**: render list, handle optimistic updates for create/edit/delete/toggle
- **State ownership**: owns list state and pending mutations; accepts initial tasks from server page
- **Props**: initialTasks, filterState, callbacks for mutations (or uses api layer directly)

3) `TaskCard`
- **Responsibility**: display task; completion toggle; edit/delete affordances
- **State ownership**: stateless where possible; emits events upward
- **Props**: task, onToggleComplete, onEdit, onDelete

4) `TaskForm`
- **Responsibility**: create/edit UI with validation and submit
- **State ownership**: local form state; emits onSubmit
- **Props**: mode(create/edit), initialValues, onSubmit, onCancel

5) `FilterTabs`
- **Responsibility**: All/Active/Completed tabs; optionally search input control
- **State ownership**: URL-driven state; emits onChange that updates router query
- **Props**: currentFilter, counts, onChange

---

## Phase 4: Pages Planning

### `/login`
- Purpose: authenticate and create session
- Uses: auth form + api/auth helpers
- Next step: redirects to `/dashboard` or `next`

### `/register`
- Purpose: create account
- Uses: register form + api/auth helpers
- Next step: `/dashboard` (if auto-login) or `/login` with success message

### `/dashboard`
- Purpose: show metrics (total/active/completed), shortcuts to tasks
- Uses: Navbar, server-side fetch of summary, links to tasks page with preselected filter

### `/tasks`
- Purpose: manage tasks end-to-end
- Uses: FilterTabs, TaskForm, TaskList
- Navigation: supports URL query params for filter/search

---

## Phase 5: API Integration Planning

### Required API calls
Auth:
- login
- register
- logout
- refresh (optional)

Tasks:
- list tasks (with optional status filter + search + pagination)
- create task
- update task
- delete task
- toggle completion

### Map API calls to UI actions
- Login form submit → auth/login
- Register form submit → auth/register
- Logout click → auth/logout + clear session
- Tasks page load → list tasks
- Create submit → create task + optimistic add
- Edit submit → update task + optimistic patch
- Delete click → delete task + optimistic remove
- Toggle complete → patch complete + optimistic flip

### Loading / error / empty states
- Auth forms: inline field errors + top-level message
- Dashboard/tasks: skeleton while loading; empty state CTA when no tasks
- Mutations: optimistic UI with rollback on error and toast notification
- 401 handling: attempt refresh once if supported; else clear session and redirect to login

---

## Phase 6: UX & Responsiveness Planning

### Mobile vs desktop layout
- Mobile-first layout (360px), stacked controls
- Desktop: split header (filters left, CTA right), table/list density improvements

### Accessibility considerations
- Keyboard navigable tabs and buttons
- Focus management for modals/forms
- Proper form labels, aria attributes for toggles

### User feedback (toasts, loaders)
- Consistent toast system for success/error
- Inline validation errors on forms
- Loading skeletons for task list + dashboard cards

---

## Phase 7: Phase ordering / dependencies (execution sequencing)

1. Create `frontend/` scaffolding + base routes (unblocked)
2. Build auth pages + auth storage + route guard (blocks protected pages)
3. Build tasks UI components (TaskCard/List/Form/FilterTabs) without API wiring (unblocked)
4. Implement `frontend/lib/api.ts` and `frontend/lib/auth.ts` (blocks full integration)
5. Wire dashboard + tasks pages to API layer, add optimistic updates + error handling
6. Add URL-reflected filters/search and pagination/virtualization strategy
7. Responsiveness + accessibility polish + acceptance checks per user stories

