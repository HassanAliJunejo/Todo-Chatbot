---
id: 0015
title: Create conversation_context Skill for Todo AI Chatbot
stage: general
date: 2026-02-14
surface: agent
model: claude-opus-4-6
feature: none
branch: master
user: pc
command: none
labels: ["skill", "conversation_context", "chatbot", "multi-turn", "stateless"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .claude/skills/conversation_context/skills.md
tests:
  - none
---

## Prompt

create a one skills named "conversation_context" for the Todo AI Chatbot agent.

Requirements:
- Input: user_id (string), conversation_id (optional)
- Action: Fetch conversation history from database
- Output: Conversation messages array
- Response: Use history to maintain multi-turn conversation
- Server must remain stateless
- Handle new conversation creation if conversation_id missing

Output format:
- Skill Name: conversation_context
- Instructions for agent
- Tool parameters mapping
- Example input/output

## Response snapshot

Created `.claude/skills/conversation_context/skills.md` — a new infrastructure skill (not user-triggered) that runs automatically before every interaction. Covers: two execution paths (Path A: existing conversation with ownership verification + history fetch + context building; Path B: new conversation creation), parameter extraction table (user_id from session, conversation_id from request payload), 2 pre-call validation checks, stateless server contract table (6 principles: no in-memory state, DB as single source of truth, context window capping at 10 messages, user isolation, idempotent reads, concurrent safety), post-execution message persistence flow (store user + assistant messages), error handling table (6 scenarios including silent fallthrough for not-found/wrong-user, graceful degradation on DB failure, non-blocking persistence failures), repository operations mapping table (5 operations across ConversationRepository and MessageRepository), and 5 worked examples (continuing conversation, new conversation, conversation_id belongs to another user, database failure with graceful degradation, post-execution persistence).

## Outcome

- ✅ Impact: Complete infrastructure skill for stateless conversation context management
- 🧪 Tests: none
- 📁 Files: 1 created (.claude/skills/conversation_context/skills.md)
- 🔁 Next prompts: Consider creating a user_info skill with the same level of detail
- 🧠 Reflection: Unlike the CRUD skills, this is not MCP-tool-based but repository-based. Documented the dual-path execution (existing vs new conversation) to match the actual agent.py process_message and chat_endpoint.py flows. Key insight: the tool does NOT return title on success for deleted conversations, requiring pre-fetch.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Verify context window limit of 10 messages is sufficient for typical multi-turn interactions
