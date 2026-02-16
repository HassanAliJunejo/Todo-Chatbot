# ConversationContextSkill

**Skill Name:** `conversation_context`
**Purpose:** Fetch conversation history from the database to maintain multi-turn context in a stateless server architecture, creating a new conversation when none exists.

---

## Agent Instructions

You are an expert conversation management assistant. This skill is an **infrastructure skill** — it runs automatically at the start of every user interaction to provide the agent with conversation history. Follow these steps precisely:

### 1. Intent Detection

This skill is **not triggered by user phrases**. It is invoked automatically by the system before any other skill processes the user's message. It fires in two scenarios:

| Scenario | Trigger |
|----------|---------|
| **Continuing conversation** | A `conversation_id` is present in the incoming request. |
| **New conversation** | No `conversation_id` is provided, or the provided ID is invalid/not found. |

### 2. Parameter Extraction

Extract the following parameters from the request payload and session context:

| Parameter         | Type    | Required | Source                       | Validation                                           |
|-------------------|---------|----------|------------------------------|------------------------------------------------------|
| `user_id`         | string  | Yes      | Session context / auth token | Must be a valid, non-empty user identifier.          |
| `conversation_id` | integer | No       | Request payload              | Positive integer if present. May be `null` or absent.|

**Extraction rules:**
- The **user_id** must come from the authenticated session context. Never ask the user for their user_id.
- The **conversation_id** comes from the client request body (the frontend sends it from its local state after the first message in a session).
- If `conversation_id` is `null`, `0`, absent, or a non-positive integer, treat it as "no conversation" and proceed to create a new one.

### 3. Input Validation

Before fetching or creating, validate all inputs:

1. **Missing user_id:** If user_id is unavailable from context, do NOT proceed. Return an error:
   > "I'm unable to identify your account right now. Please make sure you're logged in and try again."

2. **Invalid conversation_id format:** If `conversation_id` is present but not a valid positive integer, ignore it and treat as a new conversation — do not error.

### 4. Execution Flow

#### Path A — Existing Conversation (`conversation_id` provided)

```
Step 1: Verify ownership
  → Call ConversationRepository.get_conversation_by_id(conversation_id, user_id)
  → If not found or user mismatch → fall through to Path B (create new)

Step 2: Fetch message history
  → Call MessageRepository.get_latest_messages(conversation_id, limit=10)
  → Returns up to 10 most recent messages in descending order
  → Reverse to chronological order for context building

Step 3: Build context array
  → Start with system prompt message
  → Append historical messages in chronological order (role: user | assistant)
  → Append the current user message as the final entry

Step 4: Return context
  → Return the assembled messages array and the validated conversation_id
```

#### Path B — New Conversation (no `conversation_id` or ID invalid/not found)

```
Step 1: Create conversation record
  → Call ConversationRepository.create_conversation(
       conversation_create: { title: "New Conversation" },
       user_id: user_id
     )
  → Receive new conversation object with auto-generated ID

Step 2: Build context array
  → Start with system prompt message
  → No historical messages (fresh conversation)
  → Append the current user message as the only entry

Step 3: Return context
  → Return the assembled messages array and the new conversation_id
```

### 5. Output Format

The skill returns a context object used internally by the agent — it is **never shown directly to the user**.

**On success (existing conversation):**
```json
{
  "success": true,
  "conversation_id": 42,
  "is_new": false,
  "message_count": 7,
  "messages": [
    { "role": "system", "content": "<system_prompt>" },
    { "role": "user", "content": "Add a task to buy groceries" },
    { "role": "assistant", "content": "Got it! Task 'Buy groceries' has been added." },
    { "role": "user", "content": "Now show my tasks" },
    { "role": "assistant", "content": "Here are your tasks: ..." },
    { "role": "user", "content": "<current_message>" }
  ]
}
```

**On success (new conversation):**
```json
{
  "success": true,
  "conversation_id": 43,
  "is_new": true,
  "message_count": 0,
  "messages": [
    { "role": "system", "content": "<system_prompt>" },
    { "role": "user", "content": "<current_message>" }
  ]
}
```

**On failure:**
```json
{
  "success": false,
  "conversation_id": null,
  "error": "<error_detail>",
  "message": "Failed to load conversation context."
}
```

### 6. Stateless Server Contract

This skill enforces the stateless design of the backend:

| Principle | Implementation |
|-----------|----------------|
| **No in-memory state** | The server holds zero conversation state between requests. Every request reconstructs context from the database. |
| **Database as single source of truth** | All messages (user + assistant) are persisted to `ai_messages` table after each turn. |
| **Context window management** | Only the last 10 messages are fetched to keep the LLM context window manageable and latency low. |
| **User isolation** | Conversation ownership is verified via `user_id` on every fetch — a user can never access another user's conversation. |
| **Idempotent reads** | Fetching context is a read-only operation; it never mutates conversation state. |
| **Concurrent safety** | Each request operates on its own DB session. Concurrent requests from different users are isolated by `user_id` + `conversation_id`. |

### 7. Post-Execution: Message Persistence

After the agent processes the user's message and generates a response, the conversation_context skill ensures both messages are stored:

```
Step 1: Store user message
  → MessageRepository.create_message({
       role: "user",
       content: <user_message>,
       conversation_id: <conversation_id>
     })

Step 2: Store assistant response
  → MessageRepository.create_message({
       role: "assistant",
       content: <assistant_response_text>,
       conversation_id: <conversation_id>
     })

Step 3: Return conversation_id in API response
  → The client stores this conversation_id for subsequent requests
```

### 8. Error Handling

| Error Scenario                          | Behavior                                                                                      |
|-----------------------------------------|-----------------------------------------------------------------------------------------------|
| `conversation_id` not found in DB       | Silently create a new conversation (Path B). Do not error to the user.                        |
| `conversation_id` belongs to other user | Silently create a new conversation (Path B). Do not reveal the existence of other conversations.|
| Database connection failure             | Return fallback: process the current message without history. Log the error.                  |
| Message history fetch fails             | Return fallback: process with system prompt + current message only. Log the error.            |
| New conversation creation fails         | Return error to user: "Something went wrong starting a new conversation. Please try again."   |
| Message persistence fails               | Log the error. Do NOT block the response — the user should still see the assistant's reply.   |

Never expose raw error messages, stack traces, or internal details to the user.

---

## Tool Parameters Mapping

This skill does not call a single MCP tool. It orchestrates multiple repository operations:

| Operation                | Repository Method                                        | Input                          | Output                    |
|--------------------------|----------------------------------------------------------|--------------------------------|---------------------------|
| Verify conversation      | `ConversationRepository.get_conversation_by_id`          | `conversation_id`, `user_id`   | `Conversation` or `null`  |
| Create conversation      | `ConversationRepository.create_conversation`             | `{ title }`, `user_id`        | `Conversation`            |
| Fetch history            | `MessageRepository.get_latest_messages`                  | `conversation_id`, `limit=10`  | `List[Message]`           |
| Store user message       | `MessageRepository.create_message`                       | `{ role, content, conversation_id }` | `Message`           |
| Store assistant message  | `MessageRepository.create_message`                       | `{ role, content, conversation_id }` | `Message`           |

**Skill-level parameter mapping:**

| Skill Parameter     | Maps To                              | Type    | Required | Default              |
|---------------------|--------------------------------------|---------|----------|----------------------|
| `user_id`           | All repository calls (`user_id`)     | int     | Yes      | —                    |
| `conversation_id`   | Repository lookup / creation         | int     | No       | New conversation created |

---

## Example Input / Output

### Example 1 — Continuing an existing conversation

**Incoming request:**
```json
{
  "message": "Now show my pending tasks",
  "conversation_id": 42
}
```
Session context: `user_id = 7`

**Skill execution:**
1. Calls `get_conversation_by_id(42, 7)` → found, user matches.
2. Calls `get_latest_messages(42, limit=10)` → returns 4 messages.
3. Builds context array (system + 4 history + current message).

**Skill output (internal):**
```json
{
  "success": true,
  "conversation_id": 42,
  "is_new": false,
  "message_count": 4,
  "messages": [
    { "role": "system", "content": "You are a helpful AI assistant..." },
    { "role": "user", "content": "Add a task to buy groceries" },
    { "role": "assistant", "content": "Got it! Task 'Buy groceries' has been added. (Task ID: 5, Status: Pending)" },
    { "role": "user", "content": "Also add one to call the dentist" },
    { "role": "assistant", "content": "Done! Task 'Call the dentist' has been added. (Task ID: 6, Status: Pending)" },
    { "role": "user", "content": "Now show my pending tasks" }
  ]
}
```

**What the user sees:** Nothing from this skill directly — the agent uses the context to produce a relevant reply that references the tasks just added.

---

### Example 2 — New conversation (no conversation_id)

**Incoming request:**
```json
{
  "message": "Hello! What can you do?"
}
```
Session context: `user_id = 7`

**Skill execution:**
1. No `conversation_id` provided → Path B.
2. Calls `create_conversation({ title: "New Conversation" }, 7)` → returns `{ id: 43 }`.
3. Builds context array (system + current message only).

**Skill output (internal):**
```json
{
  "success": true,
  "conversation_id": 43,
  "is_new": true,
  "message_count": 0,
  "messages": [
    { "role": "system", "content": "You are a helpful AI assistant..." },
    { "role": "user", "content": "Hello! What can you do?" }
  ]
}
```

**API response to frontend** includes `conversation_id: 43` — the client stores this for subsequent messages.

---

### Example 3 — conversation_id not found (belongs to another user)

**Incoming request:**
```json
{
  "message": "What was I working on?",
  "conversation_id": 99
}
```
Session context: `user_id = 7`

**Skill execution:**
1. Calls `get_conversation_by_id(99, 7)` → returns `null` (conversation 99 belongs to user 3).
2. Falls through to Path B — creates new conversation.
3. Calls `create_conversation({ title: "New Conversation" }, 7)` → returns `{ id: 44 }`.
4. Builds context with no history.

**Skill output (internal):**
```json
{
  "success": true,
  "conversation_id": 44,
  "is_new": true,
  "message_count": 0,
  "messages": [
    { "role": "system", "content": "You are a helpful AI assistant..." },
    { "role": "user", "content": "What was I working on?" }
  ]
}
```

**What the user sees:** The agent responds as a fresh conversation — no data leakage from user 3's conversation.

---

### Example 4 — Database failure during history fetch (graceful degradation)

**Incoming request:**
```json
{
  "message": "Show my tasks",
  "conversation_id": 42
}
```
Session context: `user_id = 7`

**Skill execution:**
1. Calls `get_conversation_by_id(42, 7)` → found.
2. Calls `get_latest_messages(42, limit=10)` → **throws database timeout**.
3. Logs error. Falls back to system prompt + current message only.

**Skill output (internal):**
```json
{
  "success": true,
  "conversation_id": 42,
  "is_new": false,
  "message_count": 0,
  "messages": [
    { "role": "system", "content": "You are a helpful AI assistant..." },
    { "role": "user", "content": "Show my tasks" }
  ]
}
```

**What the user sees:** The agent still processes the request (calls `list_tasks` tool) — just without multi-turn context. No error is shown.

---

### Example 5 — Post-execution message persistence

**After the agent responds to Example 1:**

**Persistence step:**
1. Stores user message: `{ role: "user", content: "Now show my pending tasks", conversation_id: 42 }`
2. Stores assistant message: `{ role: "assistant", content: "Here are your pending tasks (2): ...", conversation_id: 42 }`

**Next request** from the same client will include `conversation_id: 42`, and the history will now contain 6 messages (the 4 previous + the 2 just stored).