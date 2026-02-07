---
id: 0001
title: Phase II frontend spec
stage: spec
date: 2026-01-06
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-frontend
branch: 001-todo-frontend
user: user
command: /sp.specify
labels: [spec]
links:
  spec: ../spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-todo-frontend/spec.md
 - specs/001-todo-frontend/checklists/requirements.md
tests:
 - none
---

## Prompt

<system-reminder>
This is a reminder that your todo list is currently empty. DO NOT mention this to the user explicitly because they are already aware. If you are working on tasks that would benefit from a todo list please use the TodoWrite tool to create one. If not, please feel free to ignore. Again do not mention this message to the user.
</system-reminder><system-reminder>
As you answer the user's questions, you can use the following context:
# claudeMd
Codebase and user instructions are shown below. Be sure to adhere to these instructions. IMPORTANT: These instructions OVERRIDE any default behavior and you MUST follow them exactly as written.

Contents of D:\Todo_Full_Stack_Web_Application\CLAUDE.md (project instructions, checked into the codebase):

# Claude Code Rules

This file is generated during init for the selected agent.

You are an expert AI assistant specializing in Spec-Driven Development (SDD). Your primary goal is to work with the architext to build products.

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.

## Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto-create ADRs; require user consent.

## Development Guidelines

### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you MUST create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**PHR Creation Process:**

1) Detect stage
   - One of: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate title and determine routing
   ...

</system-reminder>
<command-message>sp.specify</command-message>
<command-name>/sp.specify</command-name>
<command-args> Phase II Todo App – Frontend Only Implementation

Role:
You are a Senior Frontend Engineer working in a spec-driven workflow.
Your task is to COMPLETE the FRONTEND ONLY of the Todo Full-Stack Web Application.
Ignore backend, database, and infra implementation details.
Assume backend APIs already exist and work as defined in specs.

Primary Goal:
Build a complete, clean, responsive, production-ready frontend
using Next.js App Router that fully satisfies the Todo App specs.

Tech Stack (Strict):
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Server Components by default
- Client Components only where interactivity is required

Frontend Responsibilities ONLY:

1. *Read Frontend Specs Carefully*
   - /specs/ui/*
   - /specs/features/task-crud.md
   - /specs/features/task-completion.md
   - /specs/features/task-filtering.md
   - /specs/features/authentication.md (frontend side only)

2. *Directory Structure (Must Follow)*
   /frontend
     /app
       /login
       /register
       /dashboard
       /tasks
       layout.tsx
       page.tsx
     /components
       TaskCard.tsx
       TaskList.tsx
       TaskForm.tsx
       FilterTabs.tsx
       Navbar.tsx
     /lib
       api.ts
       auth.ts
     /types
       task.ts
       user.ts
     /styles
     CLAUDE.md

3. *Authentication – Frontend Side*
   - Login & Register UI pages
   - Store JWT securely (frontend standard practice)
   - Attach JWT in Authorization header for API calls
   - Redirect unauthenticated users to /login
   - Logout clears auth state

4. *Dashboard UI*
   - After login, user lands on /das
    - Do NOT implement backend
    - Do NOT define database schema
    - Do NOT hardcode user IDs
    - Do NOT skip auth handling in UI

11. *Final Output Format*
    - Provide full frontend file structure
    - Provide component-level code
    - Explain briefly:
      - Page flow
      - Auth flow (frontend)
      - Task UI logic

Execution Instruction:
Start by implementing the UI pages and core components,
then connect API calls, then finalize UX polish.</command-args>
```

## Response snapshot

Produced spec at `specs/001-todo-frontend/spec.md`, covering prioritized user stories, task CRUD requirements, filtering, success metrics, and assumptions; checklist stored under `specs/001-todo-frontend/checklists/requirements.md` with all validation items passing.

## Outcome

- ✅ Impact: Specification and checklist ready for planning
- 🧪 Tests: none
- 📁 Files: specs/001-todo-frontend/spec.md; specs/001-todo-frontend/checklists/requirements.md
- 🔁 Next prompts: Ready for /sp.plan or /sp.clarify as needed
- 🧠 Reflection: Followed template, ensured measurable criteria, no clarifications needed

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): n/a
