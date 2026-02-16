---
id: 0003
title: Ratify AI Todo Chatbot Constitution v1.0.0
stage: constitution
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: /sp.constitution
labels: ["constitution", "principles", "governance", "v1.0.0"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

/sp.constitution

SYSTEM PURPOSE
You are an AI Todo Chatbot integrated into a full-stack Todo application.
You operate inside a stateless FastAPI backend using MCP tools and database-persisted context.
You must manage tasks strictly for the authenticated user only.

────────────────────────────────────────
CORE PRINCIPLES
────────────────────────────────────────

1. User Safety & Isolation
• Never access or modify another user's data
• Every tool call MUST include user_id
• Trust only backend-validated user identity

2. Stateless Architecture
• Assume no memory between requests
• Always reconstruct context from database
• Never rely on in-process memory

3. Tool-First Execution
• Never simulate task operations
• All task operations MUST go through MCP tools
• If unsure, ask clarifying questions before acting

4. Deterministic Behavior

## Response snapshot

Ratified the first constitution (v1.0.0) for the AI Todo Chatbot project at `.specify/memory/constitution.md`. Replaced all template placeholders with concrete content. 4 core principles defined: (I) User Safety & Isolation — user_id required on every tool call, JWT-only identity, repository-level WHERE filtering; (II) Stateless Architecture — zero in-memory state, DB as single source of truth, 10-message context cap, graceful degradation; (III) Tool-First Execution — all task ops through MCP tools, no fabricated data, clarify before acting, success/false routing to error_handling; (IV) Deterministic Behavior — same input → same tool call, no proactive actions, error mapping from skill, capabilities summary for unknowns. Added Security & Authentication section (JWT, path-token match, bcrypt, secret management, CORS, error sanitization). Added Development Workflow & Quality Gates (smallest diff, clarify-first, skill-driven behavior, MCP contract, error path coverage, constitution compliance). Added Governance (amendments, semver, compliance review gate, ADR escalation). Sync impact report embedded as HTML comment. All 5 dependent templates validated — no updates needed.

## Outcome

- ✅ Impact: First ratified project constitution establishing 4 core principles + security + workflow + governance
- 🧪 Tests: none
- 📁 Files: 1 modified (.specify/memory/constitution.md)
- 🔁 Next prompts: Use /sp.plan to verify Constitution Check gates work against the new principles
- 🧠 Reflection: User provided 4 principles (4th had title only — "Deterministic Behavior"). Inferred description from project context: same input → same tool pattern, no proactive actions, deterministic error mapping. Template had 6 principle slots; respected user's count of 4. Derived two additional sections (Security, Workflow) from codebase patterns already in place.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Placeholder validation PASS (grep for [A-Z_] returned 0 matches), date format PASS (ISO 8601), version line matches report PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run /sp.plan on a feature to verify Constitution Check gate dynamically reads the new principles
