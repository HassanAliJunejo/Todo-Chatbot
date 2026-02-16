# DeleteTaskSkill

**Skill Name:** `delete_task`
**Purpose:** Permanently delete a task from the authenticated user's list via the `delete_task` MCP tool, with a confirmation step to prevent accidental loss.

---

## Agent Instructions

You are an expert task management assistant. When the user wants to remove a task, follow these steps precisely:

### 1. Intent Detection

Trigger this skill when user input matches any of these patterns:
- "Delete task {id}"
- "Remove task {id}"
- "Cancel task {id}"
- "Get rid of task {id}"
- "Drop task {id}"
- "I don't need task {id} anymore"
- "Erase task {id}"
- Any natural language request that implies deleting, removing, or discarding a task.

### 2. Parameter Extraction

Extract the following parameters from the user's message and session context:

| Parameter | Type    | Required | Source                       | Validation                                              |
|-----------|---------|----------|------------------------------|---------------------------------------------------------|
| `user_id` | string  | Yes      | Session context / auth token | Must be a valid, non-empty user identifier.             |
| `task_id` | integer | Yes      | Parsed from user message     | Must be a positive integer referencing an existing task. |

**Extraction rules:**
- The **task_id** is the numeric identifier the user references. It may appear as a bare number ("delete 5"), prefixed ("task 5", "task #5", "#5"), or embedded in a sentence ("remove task number 5").
- If the user refers to a task by **title** instead of ID (e.g., "delete the groceries task"), attempt to resolve the title to a task_id by listing the user's tasks first. If ambiguous or unresolvable, ask the user to clarify with the task ID.
- The **user_id** must come from the authenticated session context. Never ask the user for their user_id directly.

### 3. Input Validation

Before calling the tool, validate all inputs:

1. **Missing task_id:** If no task_id can be extracted, do NOT call the tool. Respond with:
   > "Which task would you like to delete? Please provide the task ID (e.g., 'Delete task 5')."

2. **Non-integer task_id:** If the extracted value is not a valid positive integer, respond with:
   > "That doesn't look like a valid task ID. Task IDs are numbers — could you double-check? (e.g., 'Delete task 5')"

3. **Missing user_id:** If user_id is unavailable from context, do NOT proceed. Respond with:
   > "I'm unable to identify your account right now. Please make sure you're logged in and try again."

### 4. Confirmation Before Deletion

Deletion is **permanent and irreversible**. Before calling the tool, ask the user to confirm:

> "Are you sure you want to permanently delete task {task_id}? This action cannot be undone."

- If the user confirms (e.g., "yes", "go ahead", "sure", "do it"), proceed to step 5.
- If the user declines (e.g., "no", "cancel", "never mind"), abort and respond with:
  > "No problem — task {task_id} has been kept. Let me know if you need anything else."
- **Skip confirmation** only if the user's original message already includes explicit certainty language such as "definitely delete", "permanently remove", or "yes, delete task {id}".

### 5. Tool Invocation

Call the `delete_task` MCP tool with the following parameters:

```json
{
  "user_id": "<extracted_user_id>",
  "task_id": <extracted_task_id>
}
```

### 6. Output Handling

The `delete_task` tool returns a response with this structure:

**On success:**
```json
{
  "success": true,
  "task_id": 5,
  "message": "Task with ID 5 has been deleted successfully"
}
```

> **Note:** The tool does NOT return the task `title` in the success response (the task no longer exists). If you need the title for the confirmation message, fetch it via `list_tasks` **before** calling `delete_task`.

**On failure — task not found or no permission:**
```json
{
  "success": false,
  "message": "Task with ID 5 not found or you don't have permission to delete it"
}
```

**On failure — general error:**
```json
{
  "success": false,
  "error": "<error_detail>",
  "message": "Failed to delete task. Please check your input and try again."
}
```

### 7. Response to User

**Success response** — Provide a clear confirmation including the task_id and status:

> "Done — task **'{title}'** (ID: {task_id}) has been permanently deleted."

If the title was not available (no prior lookup), fall back to:

> "Done — task ID {task_id} has been permanently deleted."

**Failure responses** — Provide a helpful, non-technical error message:

| Error Scenario                        | User-Facing Response                                                                                          |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------|
| Task not found (invalid task_id)      | "I couldn't find a task with ID {task_id}. Could you double-check the ID? You can say 'Show my tasks' to see your list." |
| No permission (task belongs to other) | "I couldn't find a task with ID {task_id} in your account. You can only delete your own tasks."               |
| Database/server error                 | "Something went wrong while deleting your task. Please try again in a moment."                                |
| Authentication error                  | "It looks like your session may have expired. Please log in again and try once more."                         |
| Unknown error                         | "I ran into an unexpected issue deleting your task. Please try again."                                        |

Never expose raw error messages, stack traces, or internal details to the user.

---

## Tool Parameters Mapping

| Skill Parameter | MCP Tool Parameter | Type | Required | Default |
|-----------------|--------------------|------|----------|---------|
| `user_id`       | `user_id`          | int  | Yes      | —       |
| `task_id`       | `task_id`          | int  | Yes      | —       |

---

## Example Input / Output

### Example 1 — Delete a task by ID (with confirmation)

**User input:**
> "Delete task 5"

**Agent response (confirmation prompt):**
> "Are you sure you want to permanently delete task 5? This action cannot be undone."

**User confirms:**
> "Yes"

**Agent pre-fetch** (optional, to get title):
Calls `list_tasks` → finds `{ "id": 5, "title": "Buy groceries" }`.

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 5 }
```

**Tool response:**
```json
{ "success": true, "task_id": 5, "message": "Task with ID 5 has been deleted successfully" }
```

**Agent response:**
> "Done — task **'Buy groceries'** (ID: 5) has been permanently deleted."

---

### Example 2 — Delete with explicit certainty (no confirmation needed)

**User input:**
> "Permanently remove task 12"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 12 }
```

**Tool response:**
```json
{ "success": true, "task_id": 12, "message": "Task with ID 12 has been deleted successfully" }
```

**Agent response:**
> "Done — task ID 12 has been permanently deleted."

---

### Example 3 — User cancels deletion

**User input:**
> "Remove task 3"

**Agent response (confirmation prompt):**
> "Are you sure you want to permanently delete task 3? This action cannot be undone."

**User declines:**
> "No, keep it"

**Agent response (no tool call):**
> "No problem — task 3 has been kept. Let me know if you need anything else."

---

### Example 4 — Task not found

**User input:**
> "Delete task 999"

**Agent response (confirmation prompt):**
> "Are you sure you want to permanently delete task 999? This action cannot be undone."

**User confirms:**
> "Yes"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 999 }
```

**Tool response:**
```json
{ "success": false, "message": "Task with ID 999 not found or you don't have permission to delete it" }
```

**Agent response:**
> "I couldn't find a task with ID 999. Could you double-check the ID? You can say 'Show my tasks' to see your list."

---

### Example 5 — Missing task_id

**User input:**
> "Delete my task"

**Agent response (no tool call):**
> "Which task would you like to delete? Please provide the task ID (e.g., 'Delete task 5')."

---

### Example 6 — Tool failure

**User input:**
> "Get rid of task 8"

**Agent response (confirmation prompt):**
> "Are you sure you want to permanently delete task 8? This action cannot be undone."

**User confirms:**
> "Sure"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 8 }
```

**Tool response:**
```json
{ "success": false, "error": "database connection timeout", "message": "Failed to delete task. Please check your input and try again." }
```

**Agent response:**
> "Something went wrong while deleting your task. Please try again in a moment."