---
id: 0014
title: Create update_task Skill for Todo AI Chatbot
stage: general
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: none
labels: ["skill", "update_task", "chatbot", "mcp-tool"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/update_task/skills.md
tests:
  - none
---

## Prompt

create a one skills named "update_task" for the Todo AI Chatbot agent.

Requirements:
- Input: user_id (string), task_id (integer), title (optional), description (optional)
- Action: Update task via MCP tool
- Output: task_id, status, title
- Response: Confirm update
- Validate input, handle errors

Output format:
- Skill Name: update_task
- Instructions for agent
- Tool parameters mapping
- Example input/output

## Response snapshot

Rewrote `.claude/skills/update_task/skills.md` with a comprehensive skill definition covering: intent detection (8 trigger phrases plus negative triggers routing to other skills), parameter extraction table (user_id, task_id, title, description with source and validation), "at least one field required" constraint, extraction rules for title vs description disambiguation, title-to-ID resolution via list_tasks lookup, 6 pre-call validation checks (missing task_id, non-integer task_id, no fields, empty title, title too long, missing user_id), 3 tool invocation payload variants (title only, description only, both), output handling with `updated_fields` array from tool, success response templates for single vs multiple fields, error response table mapping 6 error scenarios, tool parameters mapping table with note on extended fields (priority, due_date), and 7 worked examples (rename title, update description, update both, no fields provided, task not found, missing task_id, tool failure).

## Outcome

- ✅ Impact: Complete skill definition for update_task, completing the full CRUD skill set
- 🧪 Tests: none
- 📁 Files: 1 modified (.claude/skills/update_task/skills.md)
- 🔁 Next prompts: All 5 core CRUD skills are now complete (add, list, complete, delete, update)
- 🧠 Reflection: Key differentiator from other skills is the "at least one field" constraint and the need to distinguish which fields the user wants to change. Added negative triggers to prevent routing complete/delete/add intents here.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test with ambiguous inputs like "change task 5" to verify the no-fields prompt fires correctly
