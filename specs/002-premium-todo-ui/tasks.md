---

description: "Tasks for implementing Premium Todo Frontend UI"
---

# Tasks: Premium Todo Frontend UI

**Input**: Design documents from `/specs/002-premium-todo-ui/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in the feature specification. This task list focuses on implementation + manual verification per `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm repo structure and baseline configuration for premium UI work

- [ ] T001 Verify Next.js App Router structure exists under `frontend/app/` (paths: `frontend/app/layout.tsx`, `frontend/app/(protected)/layout.tsx`)
- [ ] T002 Verify Tailwind v4 is wired via PostCSS and globals import (paths: `frontend/postcss.config.mjs`, `frontend/app/globals.css`)
- [ ] T003 [P] Verify environment variable contract for server API wrapper (path: `frontend/lib/apiServer.ts`) and document required `API_BASE_URL` in `frontend/README.md`
- [ ] T004 [P] Audit duplicate global stylesheets and confirm canonical stylesheet is `frontend/app/globals.css` (paths: `frontend/app/globals.css`, `frontend/styles/globals.css`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Confirm auth gating works for protected pages via middleware and protected layout (paths: `frontend/middleware.ts`, `frontend/app/(protected)/layout.tsx`)
- [ ] T006 Confirm session storage helpers are used consistently (paths: `frontend/lib/auth.ts`, `frontend/app/login/page.tsx`, `frontend/app/register/page.tsx`)
- [ ] T007 [P] Confirm centralized API helpers are used consistently (paths: `frontend/lib/api.ts`, `frontend/lib/apiServer.ts`, `frontend/app/api/**`)
- [ ] T008 Define and document frontend error taxonomy and UX mapping (toast vs inline vs redirect) (paths: `frontend/components/ToastHost.tsx`, `frontend/lib/api.ts`, `frontend/lib/apiServer.ts`)

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 — Manage tasks from a dashboard (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can view a dashboard-style tasks experience with clear list presentation and robust loading/empty/error states.

**Independent Test**: With an authenticated session cookie, open `/dashboard` and `/tasks` and verify:
- tasks render with active vs completed distinction
- loading state appears during fetch
- empty state appears when no tasks
- error state appears on fetch failure and provides retry

### Implementation for User Story 1

- [ ] T009 [US1] Implement/verify dashboard page layout and content (path: `frontend/app/(protected)/dashboard/page.tsx`)
- [ ] T010 [P] [US1] Implement/verify tasks page route shell and initial server fetch (path: `frontend/app/(protected)/tasks/page.tsx`)
- [ ] T011 [P] [US1] Implement premium empty/loading/error state components for tasks list (paths: `frontend/components/TaskListEmpty.tsx`, `frontend/components/TaskListSkeleton.tsx`, `frontend/components/TaskListError.tsx`)
- [ ] T012 [US1] Implement/upgrade TaskList rendering with completed vs active visual distinction (path: `frontend/components/TaskList.tsx`)
- [ ] T013 [P] [US1] Implement/upgrade TaskCard visual design (read-only for US1) (path: `frontend/components/TaskCard.tsx`)
- [ ] T014 [US1] Wire tasks list fetch to centralized API layer (prefer server fetch -> route handler -> client fetch) (paths: `frontend/app/api/tasks/route.ts`, `frontend/lib/apiServer.ts`, `frontend/lib/api.ts`)
- [ ] T015 [US1] Add retry behavior for task list fetch failures (path: `frontend/components/TaskListError.tsx`)

**Checkpoint**: User Story 1 is functional and independently verifiable.

---

## Phase 4: User Story 2 — Create and edit tasks with a polished form (Priority: P2)

**Goal**: Authenticated users can create a new task and edit an existing task using an accessible form with validation and success/error feedback.

**Independent Test**: On `/tasks`, create a task, confirm it appears; edit it, confirm updates persist and reflect in UI.

### Implementation for User Story 2

- [ ] T016 [US2] Implement/upgrade TaskForm component with field validation and inline errors (path: `frontend/components/TaskForm.tsx`)
- [ ] T017 [US2] Add “Create task” UI entry point and form presentation (modal/drawer/inline per existing patterns) (path: `frontend/app/(protected)/tasks/page.tsx`)
- [ ] T018 [US2] Implement create-task API route handler (server -> backend) (path: `frontend/app/api/tasks/route.ts`)
- [ ] T019 [US2] Implement edit-task API route handler (server -> backend) (path: `frontend/app/api/tasks/[taskId]/route.ts`)
- [ ] T020 [US2] Wire create flow with optimistic UI add + error toast on failure (paths: `frontend/components/TaskList.tsx`, `frontend/components/ToastHost.tsx`)
- [ ] T021 [US2] Wire edit flow with optimistic UI patch + rollback on failure (paths: `frontend/components/TaskList.tsx`, `frontend/components/TaskForm.tsx`)
- [ ] T022 [US2] Ensure keyboard/focus management for opening/closing the form (paths: `frontend/components/TaskForm.tsx`, `frontend/app/(protected)/tasks/page.tsx`)

**Checkpoint**: User Stories 1 and 2 both work; forms are accessible and provide clear feedback.

---

## Phase 5: User Story 3 — Mark tasks complete/incomplete quickly (Priority: P3)

**Goal**: Users can toggle completion from the list, with instant feedback and rollback on failure.

**Independent Test**: Toggle completion on a task, confirm UI updates immediately and state is correct after refresh; simulate failure and confirm rollback + error shown.

### Implementation for User Story 3

- [ ] T023 [US3] Add completion toggle control to TaskCard with accessible labeling (path: `frontend/components/TaskCard.tsx`)
- [ ] T024 [US3] Implement completion update API route handler (server -> backend) (path: `frontend/app/api/tasks/[taskId]/complete/route.ts` or `frontend/app/api/tasks/[taskId]/route.ts`)
- [ ] T025 [US3] Wire optimistic completion toggle + rollback on failure (path: `frontend/components/TaskList.tsx`)
- [ ] T026 [US3] Prevent duplicate in-flight toggles per task (disable control + show pending state) (paths: `frontend/components/TaskCard.tsx`, `frontend/components/TaskList.tsx`)

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T027 [P] Standardize page containers, spacing scale, and typography for “premium SaaS” feel (paths: `frontend/app/layout.tsx`, `frontend/app/(protected)/layout.tsx`, `frontend/app/globals.css`)
- [ ] T028 Improve navigation UX (active nav, breadcrumbs if needed) (path: `frontend/components/Navbar.tsx`)
- [ ] T029 Add delete confirmation dialog and wire delete flow (paths: `frontend/components/ConfirmDialog.tsx`, `frontend/components/TaskCard.tsx`, `frontend/app/api/tasks/[taskId]/route.ts`)
- [ ] T030 [P] Audit accessibility across flows (keyboard nav, focus rings, aria-live toasts) (paths: `frontend/components/**`, `frontend/app/**`)
- [ ] T031 [P] Ensure error copy is non-technical and actionable across all API failures (paths: `frontend/lib/api.ts`, `frontend/lib/apiServer.ts`, `frontend/components/ToastHost.tsx`)
- [ ] T032 Run the manual verification checklist in `specs/002-premium-todo-ui/quickstart.md` and update any gaps (path: `specs/002-premium-todo-ui/quickstart.md`)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–5)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational (Phase 2)
- **US2 (P2)**: Starts after Foundational (Phase 2); relies on task list surface from US1
- **US3 (P3)**: Starts after Foundational (Phase 2); relies on task list surface from US1

### Parallel Opportunities

- Phase 1: T003 + T004 can run in parallel.
- US1: T010 + T011 + T013 can run in parallel.
- Phase 6: T027, T030, T031 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Parallelizable tasks for US1
Task: "Implement tasks page route shell and initial server fetch (frontend/app/(protected)/tasks/page.tsx)"
Task: "Implement premium empty/loading/error state components (frontend/components/TaskListEmpty.tsx, frontend/components/TaskListSkeleton.tsx, frontend/components/TaskListError.tsx)"
Task: "Implement TaskCard visual design (frontend/components/TaskCard.tsx)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1
4. **STOP and VALIDATE**: Run US1 independent test criteria

### Incremental Delivery

1. US1 (dashboard + list states)
2. US2 (create/edit)
3. US3 (completion toggle)
4. Phase 6 (polish + accessibility + delete)

---

## Notes

- All tasks follow required checklist format: `- [ ] T### [P?] [US?] Description (path: ...)`.
- Where endpoint paths are unknown, tasks target Next.js route handlers under `frontend/app/api/**` to preserve same-origin auth handling; backend paths are delegated to the existing server wrapper (`frontend/lib/apiServer.ts`).
