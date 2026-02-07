# Tasks: Phase II Todo App – Backend

**Input**: Design documents from `/specs/003-todo-backend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/`, `backend/tests/` (per plan.md structure)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize FastAPI backend project structure in `backend/`
- [ ] T002 Configure Python dependencies in `backend/requirements.txt` or `pyproject.toml`
- [ ] T003 [P] Configure environment variables template in `backend/.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Setup SQLModel engine and Neon PostgreSQL connection in `backend/app/core/db.py`
- [ ] T005 [P] Implement password hashing and JWT security utilities in `backend/app/core/security.py`
- [ ] T006 [P] Configure API router and basic middleware in `backend/app/main.py`
- [ ] T007 Setup Alembic for database migrations in `backend/alembic/`
- [ ] T008 [P] Implement global error handling and standard response formatters in `backend/app/core/errors.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure Personal Task Management (Priority: P1) 🎯 MVP

**Goal**: Allow users to register and login securely to manage private task lists.

**Independent Test**: Successfully register a user and obtain a JWT token via login endpoint.

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create User model in `backend/app/models/user.py`
- [ ] T010 [P] [US1] Create User schemas (Create, Read) in `backend/app/schemas/user.py`
- [ ] T011 [US1] Implement User registration service and endpoint in `backend/app/api/v1/auth.py`
- [ ] T012 [US1] Implement Login endpoint with JWT issuance in `backend/app/api/v1/auth.py`
- [ ] T013 [US1] Implement `get_current_user` dependency in `backend/app/api/deps.py`

**Checkpoint**: User Story 1 (Auth) functional.

---

## Phase 4: User Story 2 - Task CRUD Operations (Priority: P1)

**Goal**: Enable authenticated users to manage the full lifecycle of their personal tasks.

**Independent Test**: Create a task and retrieve it via the GET endpoint, ensuring it belongs to the logged-in user.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Create Task model with owner relationship in `backend/app/models/task.py`
- [ ] T015 [P] [US2] Create Task schemas (Create, Update, Read) in `backend/app/schemas/task.py`
- [ ] T016 [US2] Implement Task CRUD service in `backend/app/services/task.py`
- [ ] T017 [US2] Implement Task API routes with user isolation in `backend/app/api/v1/tasks.py`

**Checkpoint**: User Story 2 (CRUD) functional.

---

## Phase 5: User Story 3 - Task Completion and Filtering (Priority: P2)

**Goal**: Allow users to toggle completion status and filter task lists by status.

**Independent Test**: Update a task to "completed" and verify the filter returns only that task.

### Implementation for User Story 3

- [ ] T018 [US3] Implement completion toggle logic in task service `backend/app/services/task.py`
- [ ] T019 [US3] Add status filtering (all/completed/pending) to GET tasks endpoint in `backend/app/api/v1/tasks.py`

**Checkpoint**: All user stories functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T020 [P] Generate final OpenAPI documentation (`openapi.json`) in `backend/docs/`
- [ ] T021 [P] Ensure all endpoints return consistent error responses (401, 404, 422)
- [ ] T022 Update `backend/README.md` with instructions for frontend integration
- [ ] T023 Final validation of `created_at` and `updated_at` triggers in DB models

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Prerequisite for US2 and US3 (authentication is mandatory).
- **User Story 2 (P1)**: Prerequisite for US3 (cannot toggle or filter without tasks).

### Parallel Opportunities

- T002, T003 (Setup)
- T005, T006, T008 (Foundational)
- T009, T010 (US1 Models/Schemas)
- T014, T015 (US2 Models/Schemas)

---

## Implementation Strategy

### MVP First (User Story 1 & 2 Core)

1. Complete Setup & Foundation.
2. Implement Auth (US1).
3. Implement basic CRUD (US2).
4. **STOP and VALIDATE**: Verify frontend can authenticate and see a task list.

### Incremental Delivery

1. Foundation ready.
2. Add Auth (US1).
3. Add CRUD (US2).
4. Add Toggles & Filtering (US3).
5. Final Polish.
