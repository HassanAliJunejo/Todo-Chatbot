---
id: 0010
title: Create add_task Skill for Todo AI Chatbot
stage: general
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: none
labels: ["skill", "add_task", "chatbot", "mcp-tool"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/add_task/skills.md
tests:
  - none
---

## Prompt

create a one skills named "add_task" for the Todo AI Chatbot agent.

Requirements:
- Input: user_id (string), title (string, required), description (string, optional)
- Action: Add a new task in the database using MCP tool
- Output: task_id, status, title
- Response: Friendly confirmation to user
- Validate required fields
- Handle errors gracefully (e.g., missing title)

Output format:
- Skill Name: add_task
- Instructions for agent
- Tool parameters mapping
- Example input/output

## Response snapshot

Rewrote `.claude/skills/add_task/skills.md` with a comprehensive skill definition covering: intent detection (6 trigger phrases), parameter extraction table (user_id, title, description with source and validation), 4 pre-call validation checks with scripted fallback responses, exact MCP tool invocation payload, success/failure output schemas, user-facing response templates (success confirmation with task_id/status/title, and error table mapping 4 error types), tool parameters mapping table, and 4 worked examples (simple task, task with description, missing title, tool failure).

## Outcome

- ✅ Impact: Complete skill definition for add_task, ready for agent use
- 🧪 Tests: none
- 📁 Files: 1 modified (.claude/skills/add_task/skills.md)
- 🔁 Next prompts: Create remaining skills (list_tasks, complete_task, update_task, delete_task) with same level of detail
- 🧠 Reflection: Existing skill was minimal (8 lines). New version is structured with tables, validation rules, and examples to reduce agent ambiguity.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test skill with live agent to verify intent detection and parameter extraction accuracy
