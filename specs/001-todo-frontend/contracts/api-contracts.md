# Phase 1 Contracts (Assumed APIs): Phase II Todo Frontend

> Source: `specs/overview.md` and `specs/001-todo-frontend/spec.md`.
> Backend is assumed to exist; these contracts are recorded to drive frontend integration planning.

## Authentication

### POST /auth/login
- **UI action**: Login form submit
- **Request**: { email, password }
- **Response (200)**: { accessToken, expiresAt, user: { id, email, displayName } }
- **Errors**:
  - 400 invalid input
  - 401 invalid credentials
  - 429 rate limited

### POST /auth/register
- **UI action**: Register form submit
- **Request**: { email, password, displayName? }
- **Response (201)**: same shape as login OR { user } with follow-up login (implementation-dependent)
- **Errors**:
  - 400 invalid input
  - 409 email already in use

### POST /auth/logout
- **UI action**: Logout click
- **Response (204)**

### POST /auth/refresh (if supported)
- **UI action**: Automatic on 401
- **Response (200)**: { accessToken, expiresAt }

## Tasks (from overview)

### GET /api/{user_id}/tasks
- **UI action**: Load task list, apply filters/search/pagination
- **Query**:
  - status=all|pending|completed (optional)
  - q=keyword (optional)
  - page/cursor (optional)
- **Response (200)**: { items: Task[], nextCursor? , total? }

### POST /api/{user_id}/tasks
- **UI action**: Create task
- **Request**: { title, description?, dueDate?, metadata?, priority? }
- **Response (201)**: Task

### GET /api/{user_id}/tasks/{id}
- **UI action**: Edit page load (if implemented as separate page)
- **Response (200)**: Task

### PUT /api/{user_id}/tasks/{id}
- **UI action**: Save edits
- **Request**: full editable Task fields
- **Response (200)**: Task

### DELETE /api/{user_id}/tasks/{id}
- **UI action**: Delete task
- **Response (204)**

### PATCH /api/{user_id}/tasks/{id}/complete
- **UI action**: Toggle completion
- **Request**: { completed: boolean } OR empty body (implementation-dependent)
- **Response (200)**: Task

## Common error handling
- **401**: session expired → attempt refresh (if supported), else redirect to /login
- **403**: insufficient privileges → show error and redirect to /login
- **409**: concurrent update conflict → prompt refresh
- **5xx**: show toast "Something went wrong" with retry affordance
