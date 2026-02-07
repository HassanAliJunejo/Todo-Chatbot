# Quickstart: Premium Todo Frontend UI (Frontend-only)

## Purpose
This quickstart supports building and verifying the **frontend-only** experience for the premium todo UI.

## Prerequisites
- Node.js and package manager as defined by the repository.
- Backend API available and configured (URLs/keys provided out-of-band).

## Local development
1. Install dependencies (repo standard).
2. Configure environment variables required by the frontend (API base URL, auth-related settings).
3. Start the dev server.
4. Open the app in browser.

## Manual verification checklist
- Unauthenticated users are redirected to sign-in when accessing protected pages.
- Authenticated users can:
  - View tasks list (loading/empty/error states)
  - Create a task (validation + success feedback)
  - Edit a task
  - Delete a task (confirmation required)
  - Toggle completion (rollback on failure)

## Notes
- This feature’s authoritative requirements are in `spec.md`.
- Exact endpoint paths are defined by the backend; see `contracts/api-contracts.md` for interaction-level expectations.
