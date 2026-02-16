# API Contracts: AI Todo Chatbot

**Feature**: `004-ai-todo-chatbot`
**Date**: 2026-02-14

## Chat Endpoint

### POST `/api/v1/{user_id}/chat`

Process a user message and return AI response with tool results.

**Auth**: Bearer JWT (required)
**Security**: `user_id` in path MUST match JWT `sub` claim.

**Request**:
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": 42
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| message | string | Yes | User's natural language input |
| conversation_id | int | No | Omit for new conversation |

**Response (200)**:
```json
{
  "conversation_id": 42,
  "response": "Got it! Task 'Buy groceries' has been added. (Task ID: 7)",
  "has_tools_executed": true,
  "tool_results": [
    {
      "tool_name": "add_task",
      "result": { "success": true, "task_id": 7, "title": "Buy groceries" },
      "arguments": { "user_id": 1, "title": "Buy groceries" }
    }
  ],
  "message_id": null
}
```

**Error Responses**:
- `401 Unauthorized` — Missing or invalid JWT token
- `403 Forbidden` — user_id mismatch between path and token
- `500 Internal Server Error` — Fallback with safe error message

---

### POST `/api/v1/{user_id}/new_conversation`

Create a new conversation and process the first message.

**Auth**: Bearer JWT (required)

**Request**:
```json
{
  "message": "Hello! What can you do?",
  "title": "Getting Started"
}
```

**Response (200)**: Same structure as `/chat` response.

---

### GET `/api/v1/{user_id}/conversations/{conversation_id}`

Retrieve conversation history.

**Auth**: Bearer JWT (required)

**Response (200)**:
```json
{
  "conversation_id": 42,
  "title": "New Conversation",
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "Add a task to buy groceries",
      "timestamp": "2026-02-14T10:00:00"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "Got it! Task 'Buy groceries' has been added.",
      "timestamp": "2026-02-14T10:00:01"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found` — Conversation not found or belongs to other user

## MCP Tool Contracts

### add_task

**Input**:
```json
{
  "user_id": 1,
  "title": "Buy groceries",
  "description": "",
  "priority": "medium",
  "due_date": ""
}
```

**Output (success)**:
```json
{ "success": true, "task_id": 7, "title": "Buy groceries", "message": "Task 'Buy groceries' has been added successfully" }
```

**Output (failure)**:
```json
{ "success": false, "error": "<detail>", "message": "Failed to add task: <reason>" }
```

### list_tasks

**Input**: `{ "user_id": 1, "status": "all" | "pending" | "completed" }`

**Output (success)**:
```json
{
  "success": true,
  "task_count": 2,
  "status_filter": "all",
  "tasks": [
    { "id": 1, "title": "Buy groceries", "completed": false, "priority": "medium", "created_at": "2026-02-14T10:00:00" }
  ],
  "message": "Found 2 all tasks"
}
```

### complete_task

**Input**: `{ "user_id": 1, "task_id": 5, "completed": true }`

**Output (success)**:
```json
{ "success": true, "task_id": 5, "title": "Buy groceries", "completed": true, "message": "Task 'Buy groceries' has been marked as completed" }
```

### update_task

**Input**: `{ "user_id": 1, "task_id": 5, "title": "Weekly shopping" }`

**Output (success)**:
```json
{ "success": true, "task_id": 5, "title": "Weekly shopping", "updated_fields": ["title"], "message": "Task 'Weekly shopping' has been updated successfully" }
```

### delete_task

**Input**: `{ "user_id": 1, "task_id": 5 }`

**Output (success)**:
```json
{ "success": true, "task_id": 5, "message": "Task with ID 5 has been deleted successfully" }
```

**Output (not found)**:
```json
{ "success": false, "message": "Task with ID 5 not found or you don't have permission to delete it" }
```
