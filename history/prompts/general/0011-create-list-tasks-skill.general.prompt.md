---
id: 0011
title: Create list_tasks Skill for Todo AI Chatbot
stage: general
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: none
labels: ["skill", "list_tasks", "chatbot", "mcp-tool"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/list_tasks/skills.md
tests:
  - none
---

## Prompt

create a one skills named "list_tasks" for the Todo AI Chatbot agent.

Requirements:
- Input: user_id (string), status (optional: all, pending, completed)
- Action: Retrieve tasks from database via MCP tool
- Output: Array of tasks with id, title, completed
- Response: Present tasks in readable form
- Handle empty list gracefully

Output format:
- Skill Name: list_tasks
- Instructions for agent
- Tool parameters mapping
- Example input/output

## Response snapshot

Rewrote `.claude/skills/list_tasks/skills.md` with a comprehensive skill definition covering: intent detection (8 trigger phrases), parameter extraction table (user_id, status with source and validation), status detection mapping table (user phrases → resolved status values), 2 pre-call validation checks, exact MCP tool invocation payload, success/failure output schemas with per-field type table, user-facing response formatting rules (numbered bold list with ID and status), 3 tailored empty-list messages per status filter, error response table mapping 3 error types, tool parameters mapping table, and 4 worked examples (all tasks, pending only, empty completed list, tool failure).

## Outcome

- ✅ Impact: Complete skill definition for list_tasks, ready for agent use
- 🧪 Tests: none
- 📁 Files: 1 modified (.claude/skills/list_tasks/skills.md)
- 🔁 Next prompts: Create remaining skills (complete_task, update_task, delete_task) with same level of detail
- 🧠 Reflection: Consistent structure with add_task skill. Status detection table helps agent resolve ambiguous phrases like "what's left" to the correct filter.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test skill with live agent to verify status detection accuracy across varied phrasings
