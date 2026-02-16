---
id: 0012
title: Create complete_task Skill for Todo AI Chatbot
stage: general
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: none
labels: ["skill", "complete_task", "chatbot", "mcp-tool"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/complete_task/skills.md
tests:
  - none
---

## Prompt

create a one skills named "complete_task" for the Todo AI Chatbot agent.

Requirements:
- Input: user_id (string), task_id (integer)
- Action: Mark task complete via MCP tool
- Output: task_id, status, title
- Response: Confirm completion in friendly language
- Handle invalid task_id gracefully

Output format:
- Skill Name: complete_task
- Instructions for agent
- Tool parameters mapping
- Example input/output

## Response snapshot

Rewrote `.claude/skills/complete_task/skills.md` with a comprehensive skill definition covering: intent detection (8 trigger phrases), parameter extraction table (user_id from session, task_id from message), extraction rules for resolving task references by title via list_tasks lookup, 3 pre-call validation checks (missing task_id, non-integer task_id, missing user_id), exact MCP tool invocation payload, success/failure output schemas (including task-not-found and permission-denied cases), user-facing success response with rotating encouragement phrases, error response table mapping 6 error scenarios (not found, no permission, already completed, db error, auth error, unknown), tool parameters mapping table with note on `completed` boolean, and 5 worked examples (complete by ID, resolve by title, invalid task_id, missing task_id, tool failure).

## Outcome

- ✅ Impact: Complete skill definition for complete_task, ready for agent use
- 🧪 Tests: none
- 📁 Files: 1 modified (.claude/skills/complete_task/skills.md)
- 🔁 Next prompts: Create remaining skills (update_task, delete_task) with same level of detail
- 🧠 Reflection: Added title-to-ID resolution flow (Example 2) since users often say "I finished X" without knowing the numeric ID. Also distinguished task-not-found from no-permission in error table even though the MCP tool returns a combined message.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test title-based resolution with live agent to verify fuzzy matching works correctly
