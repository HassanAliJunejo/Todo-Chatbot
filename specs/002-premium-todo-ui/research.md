# Phase 0 Research: Premium Todo Frontend UI

## Unknowns & Resolution

### 1) Referenced UI/task specs are missing from repo
- **Decision**: Treat `specs/002-premium-todo-ui/spec.md` as the authoritative feature requirements for this branch, and reuse established conventions from `specs/001-todo-frontend/*` where compatible.
- **Rationale**: The prompt references `/specs/ui/*` and `/specs/features/*`, but these paths are not present in this repository snapshot. Reusing prior branch conventions minimizes ambiguity and drift.
- **Alternatives considered**:
  - Block planning until missing docs exist: would stall the workflow without clear recovery path.

### 2) Frontend app root location (repo structure)
- **Decision**: Conform to the repository’s existing Next.js layout (detected during repo exploration). If both `/app` and `/frontend/app` exist, prefer the currently active one used by the app build.
- **Rationale**: Prevents duplicating two Next.js apps and avoids mismatched configuration.
- **Alternatives considered**:
  - Introduce a new `frontend/` folder structure: risks fragmentation if an app already exists.

### 3) Auth token/session handling approach in UI
- **Decision**: Follow the established strategy from `specs/001-todo-frontend/research.md`: prefer HTTP-only cookies if backend supports; otherwise fall back to the backend contract (potentially localStorage) with strict error handling and logout/clear behavior.
- **Rationale**: Balances security and feasibility without inventing backend behavior.
- **Alternatives considered**:
  - Enforce localStorage unconditionally: easier, but weaker security posture.

### 4) Error/notification strategy
- **Decision**: Normalize errors centrally in `/lib/api.ts`, and surface user-friendly toasts for global errors + inline field errors for forms.
- **Rationale**: Consistent UX and simpler debugging.
- **Alternatives considered**:
  - Per-component ad-hoc error handling: inconsistent UX and duplicated logic.

### 5) Task list scale behavior
- **Decision**: Assume typical single-user scale and implement list UX that remains usable for “large” lists; prefer pagination if the API supports it (same as 001 plan).
- **Rationale**: Meets edge-case requirements without premature complexity.
- **Alternatives considered**:
  - Virtualized list: better for very large lists, but adds complexity and pushes more to client rendering.
