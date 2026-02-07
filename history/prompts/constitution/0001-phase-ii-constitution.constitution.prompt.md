---
id: 0001
title: Phase II Constitution
stage: constitution
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: unknown
command: /sp.constitution
labels: [constitution,governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - history/prompts/constitution/0001-phase-ii-constitution.constitution.prompt.md
tests:
 - None
---

## Prompt

```
Phase II Todo Full-Stack Web Application Construction

Objective:
Using Claude Code + Spec-Kit Plus, fully implement the Phase II Todo App
from console to full-stack web application with authentication,
persistent storage, and responsive frontend.

Project Overview:
- Multi-user Todo application
- Backend: FastAPI + SQLModel + Neon PostgreSQL
- Frontend: Next.js 16+ (App Router) + TypeScript + Tailwind CSS
- Authentication: Better Auth with JWT
- Monorepo structure using Spec-Kit Plus

Instructions for Claude Code:

1. *Read Specs*
   - Analyze all spec files under /specs:
     - /specs/overview.md
     - /specs/features/*
     - /specs/api/*
     - /specs/database/schema.md
     - /specs/ui/*
   - Extract all functional requirements, acceptance criteria, and constraints.

2. *Project Architecture*
   - Follow /specs/architecture.md
   - Design frontend → backend → DB flow
   - Ensure JWT authentication flow is correctly integrated
   - Maintain monorepo organization

3. *Agents Execution*
   - Assign agents for specific tasks:
     - SpecAnalyzerAgent → Analyze all specs
     - ArchitecturePlannerAgent → Plan full system architecture
     - DatabaseSchemaAgent → Design database
     - AuthIntegrationAgent → JWT + Better Auth integration
     - BackendAPIAgent → CRUD endpoints
     - FrontendAPIAgent → API client
     - FrontendUIAgent → Build UI
     - TaskStateAgent → Task state management
     - TestingAgent → Test all functionality
     - DocumentationAgent → Update project docs
   - Ensure each agent only performs its role
   - Orchestrate agents using ProjectOrchestratorAgent

4. *Backend Implementation*
   - Follow /backend/CLAUDE.md patterns
   - Use SQLModel for DB operations
   - CRUD endpoints:
     - GET /api/{user_id}/tasks
     - POST /api/{user_id}/tasks
     - GET /api/{user_id}/tasks/{id}
     - PUT /api/{user_id}/tasks/{id}
     - DELETE /api/{user_id}/tasks/{id}
     - PATCH /api/{user_id}/tasks/{id}/complete
   - Protect all endpoints with JWT token
   - Filter data by authenticated user

5. *Frontend Implementation*
   - Follow /frontend/CLAUDE.md patterns
   - API calls via /lib/api.ts with JWT in headers
   - UI components:
     - Task list page
     - Create / Edit Task forms
     - Status filter
     - Completion toggle
   - Responsive design using Tailwind CSS
   - Server components by default; client components for interactivity

6. *Database Implementation*
   - Follow /specs/database/schema.md
   - Tables: users (Better Auth), tasks
   - Foreign key: tasks.user_id → users.id
   - Indexes:
```

## Response snapshot

Updated `.specify/memory/constitution.md` to version 1.0.0 with six concrete principles (spec-driven delivery, agent orchestration, authenticated multi-tenancy, layered architecture, reliability/observability, secure data stewardship), added Platform & System Constraints plus Workflow & Quality Gates sections, documented governance rules, and embedded a Sync Impact Report noting template reviews and required TODOs.

## Outcome

- ✅ Impact: Constitution finalized at v1.0.0 with explicit principles and governance rules for Phase II Todo app.
- 🧪 Tests: None (documentation-only change).
- 📁 Files: Updated constitution file plus corresponding PHR record.
- 🔁 Next prompts: Proceed with Phase II implementation per new constitution once specs directory is populated.
- 🧠 Reflection: Ensure future work begins by generating specs so spec-driven workflow has concrete sources.

## Evaluation notes (flywheel)

- Failure modes observed: None.
- Graders run and results (PASS/FAIL): None.
- Prompt variant (if applicable): None.
- Next experiment (smallest change to try): Automate spec tree bootstrapping to satisfy constitution checks earlier.
