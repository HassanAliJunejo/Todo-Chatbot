# API Contracts (Frontend Expectations)

**Goal**: Document the frontend’s expectations of backend endpoints needed to satisfy `spec.md`.

> Note: This repo snapshot does not contain the referenced `/specs/features/*` API contract docs. This file captures **required calls** at the interaction level and leaves exact paths/fields to existing backend.

## Auth

### Login
- **Purpose**: Establish authenticated session.
- **Inputs**: credentials (e.g., email + password)
- **Success**: session established (cookie and/or token returned)
- **Errors**:
  - Invalid credentials → user-friendly error (no technical details)
  - Network/server failure → retryable error

### Register
- **Purpose**: Create a new user account.
- **Inputs**: account fields (e.g., name/email/password)
- **Success**: account created; may also establish session
- **Errors**:
  - Validation errors (field-level)
  - Duplicate account → user-friendly error

### Logout
- **Purpose**: Clear session.
- **Success**: UI returns to unauthenticated state

### Session / Me (optional but strongly preferred)
- **Purpose**: Determine current session for route gating and initial render.
- **Success**: returns authenticated identity or “not authenticated”

## Tasks

### List tasks
- **Purpose**: Display user’s tasks.
- **Inputs**:
  - optional filter (all/active/completed)
  - optional search query
  - optional pagination (page/cursor)
- **Success**: returns list of tasks
- **Errors**: unauthorized (requires login), network/server failure (retry)

### Create task
- **Purpose**: Add a new task.
- **Inputs**: title (required), optional description/metadata
- **Success**: returns created task (including id)
- **Errors**: validation errors, unauthorized

### Update task
- **Purpose**: Edit task details.
- **Inputs**: task id, patch/update fields
- **Success**: returns updated task
- **Errors**: not found, validation errors, unauthorized

### Delete task
- **Purpose**: Remove a task.
- **Inputs**: task id
- **Success**: task removed
- **Errors**: not found, unauthorized

### Toggle completion
- **Purpose**: Mark complete/incomplete.
- **Inputs**: task id, completion boolean (or a dedicated toggle endpoint)
- **Success**: returns updated task state
- **Errors**: unauthorized; failure must be rollback-safe for optimistic UI
