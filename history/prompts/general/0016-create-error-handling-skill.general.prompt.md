---
id: 0016
title: Create error_handling Skill for Todo AI Chatbot
stage: general
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: none
labels: ["skill", "error_handling", "chatbot", "infrastructure"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/error_handler/skills.md
tests:
  - none
---

## Prompt

create a one skills named "error_handling" for the Todo AI Chatbot agent.

Requirements:
- Capture all tool failures
- Provide user-friendly response
- Log errors for debugging
- Handle unknown commands gracefully
- Suggest corrective actions to user

Output format:
- Skill Name: error_handling
- Instructions for agent
- Example input/output

## Response snapshot

Rewrote `.claude/skills/error_handler/skills.md` with a comprehensive cross-cutting infrastructure skill covering: 9 error categories (tool failure, unknown tool, LLM error, DB error, auth failure, validation error, unknown command, empty input, conversation error), 3-stage processing pipeline (Classify with severity levels → Log with structured JSON entries → Respond with sanitized message + corrective action), 3 authoritative error-to-response mapping tables (tool failures with 7 entries, system errors with 5 entries, auth errors with 3 entries, input errors with 5 entries), unknown command handler with capabilities summary, 5 response formatting rules, escalation rules for repeated/persistent failures, and 8 worked examples (tool DB error, task not found, unknown command, expired JWT, empty message, LLM timeout, repeated failure escalation, validation error).

## Outcome

- ✅ Impact: Complete error handling infrastructure skill ready for agent use
- 🧪 Tests: none
- 📁 Files: 1 modified (.claude/skills/error_handler/skills.md)
- 🔁 Next prompts: All 7 core skills now complete (add, list, complete, delete, update, conversation_context, error_handling)
- 🧠 Reflection: Mapped every error path in the actual codebase (agent.py _execute_tool, process_message catch-all, chat_endpoint.py exception handlers, each tool's failure returns) into the skill's lookup tables. Key design: every error response always ends with a corrective action so the user is never left at a dead end.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Trigger each error category with live agent to verify correct classification and response selection
