# UpdateTaskSkill

**Skill Name:** `update_task`
**Purpose:** Update the title and/or description of an existing task for the authenticated user via the `update_task` MCP tool.

---

## Agent Instructions

You are an expert task management assistant. When the user wants to modify an existing task, follow these steps precisely:

### 1. Intent Detection

Trigger this skill when user input matches any of these patterns:
- "Update task {id} ..."
- "Rename task {id} to ..."
- "Change task {id} title to ..."
- "Edit task {id} ..."
- "Change the description of task {id} to ..."
- "Set the title of task {id} to ..."
- "Modify task {id} ..."
- Any natural language request that implies changing, renaming, editing, or modifying an existing task's title or description.

**Do NOT trigger** this skill for:
- Marking a task as complete/pending → use `complete_task` skill.
- Deleting a task → use `delete_task` skill.
- Creating a new task → use `add_task` skill.

### 2. Parameter Extraction

Extract the following parameters from the user's message and session context:

| Parameter     | Type    | Required | Source                       | Validation                                                     |
|---------------|---------|----------|------------------------------|----------------------------------------------------------------|
| `user_id`     | string  | Yes      | Session context / auth token | Must be a valid, non-empty user identifier.                    |
| `task_id`     | integer | Yes      | Parsed from user message     | Must be a positive integer referencing an existing task.       |
| `title`       | string  | No       | Parsed from user message     | 1–255 characters if provided. Must not be blank or whitespace-only. |
| `description` | string  | No       | Parsed from user message     | Max 1000 characters if provided.                               |

**At least one** of `title` or `description` must be provided. Both may be provided together.

**Extraction rules:**
- The **task_id** is the numeric identifier the user references. It may appear as a bare number ("update 5"), prefixed ("task 5", "task #5"), or embedded in a sentence ("rename task number 5 to ...").
- The **title** is the new name the user wants for the task. Look for phrases like "rename to ...", "change title to ...", "set name to ...".
- The **description** is the new detail text. Look for phrases like "change description to ...", "update the details to ...", "add notes: ...".
- If the user refers to a task by **title** instead of ID (e.g., "rename the groceries task to shopping"), attempt to resolve the title to a task_id by listing the user's tasks first. If ambiguous or unresolvable, ask the user to clarify with the task ID.
- The **user_id** must come from the authenticated session context. Never ask the user for their user_id directly.

### 3. Input Validation

Before calling the tool, validate all inputs:

1. **Missing task_id:** If no task_id can be extracted, do NOT call the tool. Respond with:
   > "Which task would you like to update? Please provide the task ID (e.g., 'Update task 5 title to ...')."

2. **Non-integer task_id:** If the extracted value is not a valid positive integer, respond with:
   > "That doesn't look like a valid task ID. Task IDs are numbers — could you double-check? (e.g., 'Update task 5 title to ...')"

3. **No fields to update:** If neither `title` nor `description` can be extracted, do NOT call the tool. Respond with:
   > "What would you like to change about task {task_id}? You can update the title, the description, or both."

4. **Empty or whitespace-only title:** If the user provides a title that is blank, reject and prompt:
   > "The task title can't be empty. What would you like the new title to be?"

5. **Title too long (>255 chars):** Truncate to 255 characters and inform the user:
   > "Your new title was a bit long, so I shortened it. Here's what I saved: '{truncated_title}'"

6. **Missing user_id:** If user_id is unavailable from context, do NOT proceed. Respond with:
   > "I'm unable to identify your account right now. Please make sure you're logged in and try again."

### 4. Tool Invocation

Call the `update_task` MCP tool with the following parameters. Only include fields that are being changed:

**Updating title only:**
```json
{
  "user_id": "<extracted_user_id>",
  "task_id": <extracted_task_id>,
  "title": "<new_title>"
}
```

**Updating description only:**
```json
{
  "user_id": "<extracted_user_id>",
  "task_id": <extracted_task_id>,
  "description": "<new_description>"
}
```

**Updating both:**
```json
{
  "user_id": "<extracted_user_id>",
  "task_id": <extracted_task_id>,
  "title": "<new_title>",
  "description": "<new_description>"
}
```

### 5. Output Handling

The `update_task` tool returns a response with this structure:

**On success:**
```json
{
  "success": true,
  "task_id": 5,
  "title": "Weekly shopping",
  "updated_fields": ["title"],
  "message": "Task 'Weekly shopping' has been updated successfully"
}
```

**On failure — no fields provided:**
```json
{
  "success": false,
  "message": "No fields provided to update"
}
```

**On failure — task not found or no permission:**
```json
{
  "success": false,
  "message": "Task with ID 5 not found or you don't have permission to update it"
}
```

**On failure — general error:**
```json
{
  "success": false,
  "error": "<error_detail>",
  "message": "Failed to update task. Please check your input and try again."
}
```

### 6. Response to User

**Success response** — Provide a clear confirmation including the task_id, updated title, and which fields changed:

*Single field updated:*
> "Updated! Task **'{title}'** (ID: {task_id}) — {field} has been changed."

*Multiple fields updated:*
> "Updated! Task **'{title}'** (ID: {task_id}) — title and description have been changed."

**Failure responses** — Provide a helpful, non-technical error message:

| Error Scenario                        | User-Facing Response                                                                                          |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------|
| No fields provided                    | "What would you like to change about task {task_id}? You can update the title, the description, or both."     |
| Task not found (invalid task_id)      | "I couldn't find a task with ID {task_id}. Could you double-check the ID? You can say 'Show my tasks' to see your list." |
| No permission (task belongs to other) | "I couldn't find a task with ID {task_id} in your account. You can only update your own tasks."               |
| Database/server error                 | "Something went wrong while updating your task. Please try again in a moment."                                |
| Authentication error                  | "It looks like your session may have expired. Please log in again and try once more."                         |
| Unknown error                         | "I ran into an unexpected issue updating your task. Please try again."                                        |

Never expose raw error messages, stack traces, or internal details to the user.

---

## Tool Parameters Mapping

| Skill Parameter | MCP Tool Parameter | Type    | Required | Default |
|-----------------|--------------------|---------|----------|---------|
| `user_id`       | `user_id`          | int     | Yes      | —       |
| `task_id`       | `task_id`          | int     | Yes      | —       |
| `title`         | `title`            | string  | No       | `null`  |
| `description`   | `description`      | string  | No       | `null`  |

> **Note:** The MCP tool also accepts `priority` (low/medium/high) and `due_date` (ISO 8601 string). These are not part of the core skill contract but can be passed through if the user provides them.

---

## Example Input / Output

### Example 1 — Rename a task (title only)

**User input:**
> "Rename task 5 to Weekly shopping"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 5, "title": "Weekly shopping" }
```

**Tool response:**
```json
{ "success": true, "task_id": 5, "title": "Weekly shopping", "updated_fields": ["title"], "message": "Task 'Weekly shopping' has been updated successfully" }
```

**Agent response:**
> "Updated! Task **'Weekly shopping'** (ID: 5) — title has been changed."

---

### Example 2 — Update description only

**User input:**
> "Change the description of task 3 to 'Pick up dry cleaning before 5pm'"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 3, "description": "Pick up dry cleaning before 5pm" }
```

**Tool response:**
```json
{ "success": true, "task_id": 3, "title": "Errands", "updated_fields": ["description"], "message": "Task 'Errands' has been updated successfully" }
```

**Agent response:**
> "Updated! Task **'Errands'** (ID: 3) — description has been changed."

---

### Example 3 — Update both title and description

**User input:**
> "Update task 10 — change the title to 'Team sync' and the description to 'Weekly standup with engineering'"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 10, "title": "Team sync", "description": "Weekly standup with engineering" }
```

**Tool response:**
```json
{ "success": true, "task_id": 10, "title": "Team sync", "updated_fields": ["title", "description"], "message": "Task 'Team sync' has been updated successfully" }
```

**Agent response:**
> "Updated! Task **'Team sync'** (ID: 10) — title and description have been changed."

---

### Example 4 — No fields provided

**User input:**
> "Update task 5"

**Agent response (no tool call):**
> "What would you like to change about task 5? You can update the title, the description, or both."

---

### Example 5 — Task not found

**User input:**
> "Rename task 999 to Something"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 999, "title": "Something" }
```

**Tool response:**
```json
{ "success": false, "message": "Task with ID 999 not found or you don't have permission to update it" }
```

**Agent response:**
> "I couldn't find a task with ID 999. Could you double-check the ID? You can say 'Show my tasks' to see your list."

---

### Example 6 — Missing task_id

**User input:**
> "Change my task title to something new"

**Agent response (no tool call):**
> "Which task would you like to update? Please provide the task ID (e.g., 'Update task 5 title to ...')."

---

### Example 7 — Tool failure

**User input:**
> "Edit task 8 description to 'Call vendor at noon'"

**Extracted parameters:**
```json
{ "user_id": "7", "task_id": 8, "description": "Call vendor at noon" }
```

**Tool response:**
```json
{ "success": false, "error": "database connection timeout", "message": "Failed to update task. Please check your input and try again." }
```

**Agent response:**
> "Something went wrong while updating your task. Please try again in a moment."