---

description: "Frontend-only task list for Phase II Todo Frontend"
---

# Tasks: Phase II Todo Frontend

**Input**: Design documents from `/specs/001-todo-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification; tasks below focus on implementation and manual acceptance checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the required frontend directory structure and baseline Next.js app scaffolding.

- [x] T001 Create required frontend directory skeleton under `frontend/` per `specs/001-todo-frontend/plan.md`
- [x] T002 Initialize Next.js App Router project under `frontend/` (create `frontend/package.json`, `frontend/app/layout.tsx`, `frontend/app/page.tsx`)
- [x] T003 [P] Configure Tailwind CSS and global styles in `frontend/styles/` (wire into `frontend/app/layout.tsx`)
- [x] T004 [P] Define shared TypeScript types in `frontend/types/user.ts` and `frontend/types/task.ts`
- [x] T005 [P] Create placeholder component files in `frontend/components/` (Navbar, TaskList, TaskCard, TaskForm, FilterTabs)
- [x] T006 Add frontend-only CLAUDE instructions file at `frontend/CLAUDE.md` aligned with repo rules

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T007 Implement centralized API client wrapper in `frontend/lib/api.ts` (base URL, JSON handling, normalized errors)
- [x] T008 Implement auth/session utilities in `frontend/lib/auth.ts` (read/write/clear session, attach token to API calls)
- [x] T009 [P] Implement a minimal toast/alert system component in `frontend/components/` (e.g., `frontend/components/ToastHost.tsx`) and a small API for triggering it
- [x] T010 Implement route protection strategy for `/dashboard` and `/tasks` (redirect unauthenticated users to `/login`) in `frontend/middleware.ts` and `frontend/app/(protected)/layout.tsx`
- [x] T011 Ensure root route (`frontend/app/page.tsx`) redirects to `/dashboard` when authenticated else `/login`

**Checkpoint**: Foundation ready — user story implementation can now begin.

---

## Phase 3: User Story 1 — Secure Access & Session Recovery (Priority: P1) 🎯 MVP

**Goal**: Users can register, log in, stay logged in across navigation, and are redirected to `/login` when unauthenticated or when session expires.

**Independent Test**: Clear storage/cookies → register → login → land on `/dashboard` → refresh page → remain logged in; then simulate 401/session expiry and confirm forced redirect to `/login?next=...` with user-facing message.

- [x] T012 [P] [US1] Build `/login` page UI and client form handling in `frontend/app/login/page.tsx`
- [x] T013 [P] [US1] Build `/register` page UI and client form handling in `frontend/app/register/page.tsx`
- [x] T014 [US1] Wire login call to `POST /auth/login` via `frontend/app/api/auth/login/route.ts` from `frontend/app/login/page.tsx`
- [x] T015 [US1] Wire register call to `POST /auth/register` via `frontend/app/api/auth/register/route.ts` from `frontend/app/register/page.tsx`
- [x] T016 [US1] Implement session persistence behavior in `frontend/lib/auth.ts` (HTTP-only cookie session)
- [x] T017 [US1] Implement logout behavior end-to-end via `frontend/app/api/auth/logout/route.ts` and `frontend/components/Navbar.tsx`
- [x] T018 [US1] Add 401/session-expiry policy (server-side redirect + cookie clear) via `frontend/lib/apiServer.ts` + `frontend/middleware.ts`
- [x] T019 [US1] Add UX messaging for auth errors and session expiry (toasts/inline messages) in `frontend/app/login/page.tsx` and `frontend/components/ToastHost.tsx`

**Checkpoint**: User Story 1 fully functional; protected routes cannot be accessed while logged out.

---

## Phase 4: User Story 2 — Manage Personal Tasks End-to-End (Priority: P2)

**Goal**: Authenticated users can view tasks, create tasks, edit tasks, delete tasks, and toggle completion with optimistic UI and rollback on error.

**Independent Test**: From `/tasks`, create a task → see it in list; edit it → see updates; toggle completion → persists after refresh; delete it → removed; simulate API failure and confirm rollback + error toast.

- [x] T020 [P] [US2] Implement `TaskCard` UI + events (toggle/edit/delete) in `frontend/components/TaskCard.tsx`
- [x] T021 [P] [US2] Implement `TaskForm` UI + validation for create/edit in `frontend/components/TaskForm.tsx`
- [x] T022 [US2] Implement `TaskList` state ownership and optimistic mutation patterns in `frontend/components/TaskList.tsx`
- [x] T023 [US2] Build `/tasks` page composition (FilterTabs + TaskForm + TaskList) in `frontend/app/tasks/page.tsx`
- [x] T024 [US2] Implement tasks list fetch `GET /api/{user_id}/tasks` via `frontend/lib/api.ts` in `frontend/app/tasks/page.tsx` (server fetch for initial render if possible)
- [x] T025 [US2] Implement create task call `POST /api/{user_id}/tasks` and optimistic add in `frontend/components/TaskList.tsx`
- [x] T026 [US2] Implement update task call `PUT /api/{user_id}/tasks/{id}` and optimistic patch in `frontend/components/TaskList.tsx`
- [x] T027 [US2] Implement delete task call `DELETE /api/{user_id}/tasks/{id}` and optimistic remove in `frontend/components/TaskList.tsx`
- [x] T028 [US2] Implement completion toggle call `PATCH /api/{user_id}/tasks/{id}/complete` and optimistic toggle in `frontend/components/TaskList.tsx`
- [x] T029 [US2] Implement empty/loading/error states for task list in `frontend/app/tasks/page.tsx` and `frontend/components/TaskList.tsx`

**Checkpoint**: Task CRUD + completion flows work end-to-end for authenticated users.

---

## Phase 5: User Story 3 — Focus Tasks with Filters & Insights (Priority: P3)

**Goal**: Users can filter tasks by status and search keyword with URL-reflected state; dashboard shows accurate counts and shortcuts.

**Independent Test**: Seed tasks across states → switch All/Active/Completed and see list + counts update; set search term and confirm URL query parameters reflect state; reload preserves view.

- [x] T030 [P] [US3] Implement `FilterTabs` UI for All/Active/Completed in `frontend/components/FilterTabs.tsx`
- [x] T031 [US3] Implement URL query parameter integration for filter + search in `frontend/app/tasks/page.tsx`
- [x] T032 [US3] Wire filter/search params into task list fetch call in `frontend/lib/api.ts` and `frontend/app/tasks/page.tsx`
- [x] T033 [US3] Implement `/dashboard` page with metrics + shortcuts in `frontend/app/dashboard/page.tsx`
- [x] T034 [US3] Fetch dashboard counts (total/active/completed) using tasks list endpoint or a summary endpoint if available in `frontend/app/dashboard/page.tsx`
- [x] T035 [US3] Add navigation shortcuts from dashboard to tasks filtered views (e.g., `/tasks?status=completed`) in `frontend/app/dashboard/page.tsx`
- [x] T036 [US3] Implement >50 tasks performance strategy: pagination support first; add virtualization only if API cannot paginate (document choice in `frontend/app/tasks/page.tsx`)

**Checkpoint**: Filtering/search/dashboard insights functional and consistent.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories (responsiveness, a11y, UX consistency).

- [x] T037 [P] Ensure responsive layouts for auth, dashboard, tasks pages (360px–1440px) in `frontend/app/**` and `frontend/components/**`
- [x] T038 [P] Accessibility pass: labels, focus states, keyboard navigation for tabs/forms/toggles in `frontend/components/**`
- [x] T039 Standardize error messages and empty states across pages in `frontend/app/**`
- [x] T040 Add basic loading skeletons for dashboard and task list in `frontend/components/**`
- [x] T041 Final manual acceptance pass against `specs/001-todo-frontend/spec.md` success criteria (SC-001..SC-005) and document results in PR description (later)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
- **Polish (Phase 6)**: Depends on completion of desired user stories

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational; unlocks protected route work
- **US2 (P2)**: Depends on Foundational and typically benefits from US1 completion (auth context), but should be independently testable once logged in
- **US3 (P3)**: Depends on US2 task list foundation (filters/search require list), and dashboard metrics depend on task data availability

### Parallel Opportunities

- Marked [P] tasks are safe to parallelize (distinct files / no blocking dependencies)
- After Phase 2 completes:
  - One dev can implement auth pages (US1) while another builds TaskCard/TaskForm components (US2)

---

## Parallel Example: User Story 1

```bash
# Parallelize page UIs first:
Task: "Build /login page UI in frontend/app/login/page.tsx"
Task: "Build /register page UI in frontend/app/register/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1
4. STOP and validate US1 independent test criteria

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → validate
3. US2 → validate
4. US3 → validate
5. Polish → validate
