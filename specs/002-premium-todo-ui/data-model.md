# Data Model: Premium Todo Frontend UI

This document captures the **frontend-facing** entities and validation/state rules implied by `spec.md`. It is not a database schema.

## Entities

### Task

**Description**: A user-owned item representing a unit of work.

**Key fields (frontend-facing)**
- `id`: unique identifier (opaque string/number provided by backend)
- `title`: short text; required
- `description`: optional longer text
- `completed`: boolean status (active vs completed)
- `createdAt`: timestamp (display)
- `updatedAt`: timestamp (display)
- `dueAt`: optional timestamp (if supported by backend)

**Validation rules (UI)**
- Title is required.
- Title has a reasonable maximum length enforced by UI (to prevent unusable layouts).

**State transitions**
- Active → Completed (toggle)
- Completed → Active (toggle)

**Derived presentation**
- Completed tasks must be visually distinct from active tasks.
- Tasks in “pending mutation” state should show a subtle progress/disabled affordance.

### User Session

**Description**: The user’s authenticated state used by the UI to gate routes and authorize requests.

**Key fields (frontend-facing)**
- `accessToken`: opaque token if client-managed
- `user`: minimal identity claims for display (e.g., email, name) if available

**State transitions**
- Unauthenticated → Authenticated (login)
- Authenticated → Unauthenticated (logout, session expiry)
