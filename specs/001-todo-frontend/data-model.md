# Phase 1 Data Model (Frontend View): Phase II Todo Frontend

> Note: Backend and DB are out of scope. This document captures *frontend-facing* entity shapes and state transitions derived from the feature spec and overview.

## Entities

### 1) UserSession
**Purpose**: Represents authenticated state used for guarding routes and attaching authorization to API requests.

**Key fields**:
- accessToken (JWT)
- expiresAt (timestamp)
- user: { id, email, displayName }

**State transitions**:
- LoggedOut → LoggedIn (after successful login)
- LoggedIn → LoggedOut (explicit logout)
- LoggedIn → SessionExpired → LoggedOut (401/expiry detected)

### 2) Task
**Purpose**: Represents a todo item displayed and mutated by the UI.

**Key fields**:
- id
- title
- description? (optional)
- status (pending | completed)
- dueDate? (optional)
- priority? (optional; if supported by backend)
- createdAt / updatedAt
- metadata? / labels? (optional)

**State transitions**:
- pending ↔ completed (toggle completion)
- created → updated (edit fields)
- any → deleted (delete action)

### 3) FilterState
**Purpose**: Captures list view selection and ensures deterministic navigation.

**Key fields**:
- statusFilter: all | pending | completed
- query: string (search keyword)
- sort: dueDateAsc | dueDateDesc | createdAtDesc (defaults assumed)
- page/cursor: pagination pointer (if backend supports)

## Validation Rules (UI-level)
- Task title required, reasonable max length enforced by UI.
- Due date must be valid date and optionally not in the past (assumption; confirm with UI specs when present).
- Email format validation on auth forms.
- Password minimum length enforced (exact rule depends on backend; default to "at least 8 characters").
