# Implementation Plan: Phase II Todo App – Backend

**Branch**: `003-todo-backend` | **Date**: 2026-01-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-todo-backend/spec.md`

## Summary

Build a secure, production-ready FastAPI backend for the Todo application. The backend will provide JWT-based authentication compatible with the existing frontend and full CRUD capabilities for tasks, backed by Neon PostgreSQL and SQLModel.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**: FastAPI, SQLModel, Pydantic, Passlib (bcrypt), PyJWT, Postgres (Neon)
**Storage**: Neon PostgreSQL
**Testing**: pytest
**Target Platform**: Dockerized Linux Server / Vercel-compatible
**Project Type**: Backend API
**Performance Goals**: < 200ms p95 latency for task operations
**Constraints**: Zero frontend modifications; Strict user isolation; No hardcoded secrets
**Scale/Scope**: Multi-user support with personal task lists

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Spec-Driven**: Origins from `spec.md`? Yes.
- [x] **AuthN/AuthZ**: Better Auth compatible JWT? Yes.
- [x] **Isolation**: Every query scoped by user ID? Yes.
- [x] **Stack**: FastAPI + SQLModel + Neon? Yes.
- [x] **Security**: Bcrypt hashing & env-based secrets? Yes.

## Project Structure

### Documentation (this feature)

```text
specs/003-todo-backend/
├── spec.md              # Requirements
├── plan.md              # This file
├── research.md          # Tech decisions
├── data-model.md        # Database schema
├── quickstart.md        # Development setup
└── contracts/           # API Contract definitions
    └── openapi.json
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py          # Entry point
│   ├── api/             # Routes
│   ├── core/            # Config & Security
│   ├── models/          # SQLModel classes
│   └── services/        # Business logic
├── alembic/             # Migrations
├── tests/               # Pytest suite
├── .env.example         # Template for secrets
└── pyproject.toml       # Dependencies (Poetry/Pip)
```

**Structure Decision**: Standard FastAPI modular layout under `backend/` directory to keep codebase clean and scalable.

## Complexity Tracking

*No current violations.*

## Execution Phases

### Phase 2: Implementation (Tasks for /sp.tasks)

#### Step 1: Core Scaffolding
- Initialize FastAPI app and configuration.
- Setup SQLModel engine and session management for Neon.

#### Step 2: Authentication Layer
- Implement `User` model and registration endpoint with password hashing.
- Implement login endpoint returning JWT.
- Implement `get_current_user` dependency for protected routes.

#### Step 3: Task Management
- Implement `Task` model with relationship to `User`.
- Implement CRUD endpoints: POST, GET, PUT, DELETE.
- Apply `current_user.id` filter to all task queries.

#### Step 4: Verification & Integration
- Run `pytest` suite for all functional requirements.
- Verify frontend ↔ backend communication using local proxy or CORS config.

## Success Metrics Verification
- [ ] Registered user can login and get token.
- [ ] User A cannot see User B's tasks.
- [ ] Tasks persist across server restarts.
- [ ] All API responses match frontend types.
