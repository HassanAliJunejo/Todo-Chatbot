---
id: 0013
title: Create delete_task Skill for Todo AI Chatbot
stage: general
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: none
labels: ["skill", "delete_task", "chatbot", "mcp-tool"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/delete_task/skills.md
tests:
  - none
---

## Prompt

create a one skills named "delete_task" for the Todo AI Chatbot agent.

Requirements:
- Input: user_id (string), task_id (integer)
- Action: Delete task using MCP tool
- Output: task_id, status, title
- Response: Confirm deletion
- Handle errors (task not found) gracefully

Output format:
- Skill Name: delete_task
- Instructions for agent
- Tool parameters mapping
- Example input/output

## Response snapshot

Rewrote `.claude/skills/delete_task/skills.md` with a comprehensive skill definition covering: intent detection (8 trigger phrases), parameter extraction table (user_id from session, task_id from message) with title-to-ID resolution via list_tasks lookup, 3 pre-call validation checks, a dedicated confirmation step before deletion (permanent action warning, skip rules for explicit certainty language, abort flow for declines), exact MCP tool invocation payload, output handling noting that the tool does NOT return task title on success (requiring pre-fetch), user-facing success response with title when available and fallback without, error response table mapping 5 error scenarios, tool parameters mapping table, and 6 worked examples (delete with confirmation, delete with explicit certainty, user cancels, task not found, missing task_id, tool failure).

## Outcome

- ✅ Impact: Complete skill definition for delete_task, ready for agent use
- 🧪 Tests: none
- 📁 Files: 1 modified (.claude/skills/delete_task/skills.md)
- 🔁 Next prompts: Create update_task skill to complete the CRUD set
- 🧠 Reflection: Key differentiator from other skills is the mandatory confirmation step — deletion is irreversible. Also documented that the MCP tool does not return the title on success, so the agent must pre-fetch it if a friendly response is desired.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test confirmation flow with live agent to verify skip-confirmation heuristics work for phrases like "definitely delete" vs "remove"
