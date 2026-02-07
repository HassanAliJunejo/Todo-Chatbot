# Phase II Todo Application — Overview

## Context
- Transitioning the v1 console todo tool into a multi-user, full-stack web application with persistent storage and responsive UX.
- Stack is mandated by project brief and constitution: Next.js 16+ (App Router, TS, Tailwind) frontend, FastAPI backend, SQLModel + Neon PostgreSQL persistence, Better Auth with JWT for authentication.
- Spec-driven delivery is required: every downstream feature spec references this overview to ensure consistent scope, terminology, and acceptance criteria.

## Objectives
1. Provide authenticated users with CRUD task management tied to their Better Auth identity.
2. Guarantee persistent, multi-tenant storage with zero cross-user data exposure.
3. Deliver responsive web UX (desktop + mobile) with intuitive task views, filters, and completion toggles.
4. Establish observability, automated testing, and governance gates so future features ship safely.

## Scope
### In Scope
- Core todo task lifecycle (create, read, update, delete, complete toggle).
- JWT-protected REST API under `/api/{user_id}/tasks*` with SQLModel models and Neon migrations.
- Frontend task pages (list, create/edit form, status filter) implemented as Next.js server components with client islands where interactive state is required.
- Agent-driven workflow (SpecAnalyzer → ArchitecturePlanner → DatabaseSchema → AuthIntegration → BackendAPI → FrontendAPI → FrontendUI → TaskState → Testing → Documentation) coordinated by ProjectOrchestrator.
- Prompt History Records and ADR suggestions for every substantive change.

### Out of Scope
- Real-time collaboration, shared lists, or task assignment to other users.
- Native mobile apps (web-only responsive UI).
- Third-party integrations (calendars, notifications) beyond what specs explicitly add later.
- Non-JWT auth mechanisms (Better Auth is authoritative).

## Architecture Overview
| Layer | Technology | Responsibilities |
| --- | --- | --- |
| Frontend | Next.js 16 App Router, TypeScript, Tailwind CSS | Render task UI, call frontend API client, manage filters/toggles, ensure responsive design. |
| API | FastAPI, SQLModel | JWT validation, user-scoped CRUD endpoints, invariants enforcement, logging. |
| Persistence | Neon PostgreSQL | `users` (Better Auth) and `tasks` tables with FK constraints, indexes, migrations. |
| Auth | Better Auth + JWT | Issue/verify tokens, attach user context to every request. |

## Functional Requirements
1. **FR-001**: Users MUST authenticate via Better Auth and receive a JWT for subsequent API access.
2. **FR-002**: `/api/{user_id}/tasks` MUST return only the requesting user’s tasks, support filtering by status, and paginate if needed.
3. **FR-003**: Users MUST create tasks with title, optional description, status (default "pending"), due date, and metadata persisted in PostgreSQL.
4. **FR-004**: Users MUST edit any mutable task fields while maintaining auditability (timestamps).
5. **FR-005**: Users MUST delete tasks, with backend ensuring hard delete scoped to the authenticated user.
6. **FR-006**: Users MUST toggle completion state via PATCH `/api/{user_id}/tasks/{id}/complete` with optimistic UI updates guarded by task-state agent rules.
7. **FR-007**: Frontend MUST expose filters (all, pending, completed) and search or sort as defined in downstream specs.
8. **FR-008**: All operations MUST emit structured logs containing request ID, user ID, endpoint, and result for observability.

## Non-Functional Requirements
- **Performance**: p95 backend latency < 200ms for CRUD calls under standard load; frontend interactions should render within 100ms after data arrives.
- **Reliability**: API error budget <1% for authenticated CRUD calls; retries for transient DB errors with idempotent semantics.
- **Security**: Mandatory HTTPS, JWT validation middleware, no plaintext PII in logs, principle of least privilege for DB access.
- **Compliance/Governance**: Constitution checks enforced at `/sp.plan`; every user instruction recorded in PHR; ADR suggestions for cross-cutting architectural changes.

## User Journeys (High-Level)
1. **P1 – Manage Tasks**: Authenticated user views their dashboard, filters tasks, edits details, toggles completion, deletes tasks. Independent test: run through full CRUD flow with JWT for a single user; verify no other users’ data is visible.
2. **P2 – Create Tasks on Mobile**: Authenticated user on mobile creates tasks via responsive UI, sees validation errors inline, and sees the new task appear in the list without reload.
3. **P3 – Maintain Productivity**: User keeps a list clean by filtering completed tasks, sorting by due date, and confirming state persists after refresh.

## Data Model Summary
- **users**: Managed by Better Auth; referenced but not mutated by app code.
- **tasks**:
  - `id` (UUID/serial), `user_id` (FK → users.id), `title`, `description`, `status` (enum pending/completed), `due_date`, `metadata` (JSON), timestamps, indexes on `(user_id, status)` and `(user_id, due_date)`.

## API Summary
| Method & Path | Purpose |
| --- | --- |
| GET `/api/{user_id}/tasks` | List authenticated user’s tasks with optional status filter |
| POST `/api/{user_id}/tasks` | Create task for authenticated user |
| GET `/api/{user_id}/tasks/{id}` | Fetch specific task owned by user |
| PUT `/api/{user_id}/tasks/{id}` | Update all editable fields |
| DELETE `/api/{user_id}/tasks/{id}` | Permanently delete task |
| PATCH `/api/{user_id}/tasks/{id}/complete` | Toggle completion status |

All endpoints require Authorization header `Bearer <JWT>`; backend rejects mismatched `{user_id}` vs token subject.

## Frontend UX Requirements
- Server components for data-fetching routes; client components only for forms, filters, completion toggles.
- Tailwind-based responsive layout with accessible form controls, error messages, and keyboard navigation.
- Task list supports empty states, loading skeletons, and optimistic UI updates.
- `/lib/api.ts` centralizes fetch logic, automatically attaching JWT and normalizing errors for UI consumption.

## Agent Workflow Alignment
- Before coding, run SpecAnalyzer over this overview plus future specs.
- ArchitecturePlanner derives system plan referencing the mandated stack.
- DatabaseSchema agent codifies SQLModel models and migrations consistent with the data model summary.
- AuthIntegration ensures Better Auth + JWT wiring across backend/frontend.
- BackendAPI + FrontendAPI + FrontendUI implement endpoints and UI sequentially, while TaskState agent enforces UI data integrity.
- Testing agent validates unit/integration/contract coverage; Documentation agent updates README/quickstarts.

## Risks & Assumptions
- **R1**: Missing specs for features/api/ui could stall agents; assume they will be authored immediately after this overview.
- **R2**: Neon provisioning or networking delays could block migrations; plan for mock/test DB fallback.
- **R3**: Better Auth configuration errors could prevent JWT issuance; require sandbox credentials for development.

## Acceptance Criteria
- Overview file exists at `specs/overview.md` with clear context, objectives, requirements, and governance alignment.
- Content mirrors constitution mandates (spec-driven workflow, agent sequencing, stack constraints, observability/testing requirements).
- Provides actionable references for downstream spec, plan, and tasks templates to derive feature-level details.
- Identifies scope boundaries, data/API summaries, and risks so agents have authoritative guidance before implementation.
