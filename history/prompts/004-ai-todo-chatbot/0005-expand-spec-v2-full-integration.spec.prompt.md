---
id: 0005
title: Expand Spec v2 Full Integration Scope
stage: spec
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: 004-ai-todo-chatbot
branch: master
user: pc
command: /sp.specify
labels: ["spec", "v2", "ai-chatbot", "full-integration", "mcp", "cohere"]
links:
  spec: specs/004-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-ai-todo-chatbot/spec.md
  - specs/004-ai-todo-chatbot/checklists/requirements.md
tests:
  - none
---

## Prompt

/sp.specify

PROJECT CONTEXT
We already have a complete Full-Stack Todo Application:
• Frontend: Next.js App Router (Tasks, Auth, Dashboard)
• Backend: FastAPI + SQLModel + Neon PostgreSQL
• Auth: Better Auth (JWT)
• Infrastructure: Docker, Minikube, Helm
• AI Foundation: Agents, Skills, Constitution already finalized

The goal is to IMPLEMENT and INTEGRATE an AI-powered Todo Chatbot
into the SAME system without breaking existing functionality.

────────────────────────────────────────
PRIMARY OBJECTIVE
────────────────────────────────────────

Implement a production-ready AI Todo Chatbot that:
• Uses Cohere as the LLM
• Uses OpenAI Agents SDK ONLY as orchestration
• Uses MCP server for all task operations
• Is stateless at the server level
• Persists conversations in database
• Fully integrates with existing frontend, backend, and auth

────────────────────────────────────────
IMPLEMENTATION SCOPE
────────────────────────────────────────

BACKEND (FASTAPI)
• Create /api/{user_id}/chat endpoint
• Validate JWT and user identity
• Fetch conversation history from DB
• Store user & assistant messages
• Run agent with MCP tools
• Return assistant response + tool calls

MCP SERVER
• Implement MCP tools: add_task, list_tasks, complete_task, delete_task, update_task
• Tools must: Be stateless, Use SQLModel, Enforce user isolation, Handle errors safely

AI AGENT
• Bind finalized skills to agent
• Follow constitution strictly
• Use Cohere API key
• Never hallucinate task actions
• Confirm every user action

FRONTEND
• Add chatbot floating icon
• Chat panel UI (ChatKit style)
• Secure API calls with JWT
• Show typing, loading,

## Response snapshot

Updated existing spec at `specs/004-ai-todo-chatbot/spec.md` (v1 → v2). Expanded from 3 user stories to 5: (US1) Natural Language Task Management with 6 acceptance scenarios covering all 5 CRUD ops + ambiguity handling, (US2) Multi-Turn Conversations with persistence including browser-close recovery and 50+ message performance, (US3) Secure AI Access with JWT expiry and path-token mismatch scenarios, (US4) Chatbot UI Integration with floating widget, typing indicator, and mobile responsiveness, (US5) Graceful Error Handling with 4 error category scenarios. Expanded from 14 to 23 functional requirements organized into 4 groups (Backend, Agent/LLM, MCP Tools, Frontend, Error Handling). Added 5 edge cases (concurrent modifications, long messages, rate limiting, language support, tool chaining). Expanded from 5 to 7 success criteria. Added Constraints section (non-breaking integration, separate data layer, constitution compliance, no secret exposure). Added Assumptions section with 7 items. Created quality checklist at checklists/requirements.md — all 16 items pass. Zero [NEEDS CLARIFICATION] markers.

## Outcome

- ✅ Impact: Comprehensive v2 spec covering all integration points (backend, frontend, agent, MCP, auth, errors)
- 🧪 Tests: none (spec phase)
- 📁 Files: 2 (spec.md updated, checklists/requirements.md created)
- 🔁 Next prompts: /sp.plan to generate implementation plan, or /sp.clarify if further refinement needed
- 🧠 Reflection: Existing 004 feature already had spec/plan/tasks from v1. Updated in place rather than creating 005 — the feature is the same, just with expanded scope. Translated the user's highly technical description into user-facing requirements while preserving product decisions (Cohere, MCP pattern) as named constraints.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Quality checklist 16/16 PASS, zero NEEDS CLARIFICATION markers
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Run /sp.plan against v2 spec to verify all 23 FRs translate into plannable tasks
