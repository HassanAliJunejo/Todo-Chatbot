# Phase 0 Research: Phase II Todo Frontend

## Unknowns & Resolution

### 1) Token storage strategy for web frontend
- **Decision**: Prefer HTTP-only, secure cookies for session/JWT storage when supported by the backend; otherwise fall back to in-memory + refresh on reload (and only use localStorage if the backend contract forces it).
- **Rationale**: Minimizes XSS token theft risk while still supporting App Router SSR/Server Components where applicable.
- **Alternatives considered**:
  - localStorage/sessionStorage: simplest but higher XSS risk
  - purely in-memory: most secure but loses session on refresh without a refresh-token endpoint

### 2) Protected route strategy in Next.js App Router
- **Decision**: Use route-group layout guards and server-side redirects where possible; use client-side guard only for interactive transitions.
- **Rationale**: Enforces auth before rendering protected content and avoids flicker.
- **Alternatives considered**:
  - client-only guards: simpler but can flash protected UI and complicate SSR

### 3) Task list performance for >50 items
- **Decision**: Start with pagination in API calls and UI; consider virtualization only if pagination is not supported by the existing API.
- **Rationale**: Pagination is simpler, predictable for URL state, and aligns with REST listing patterns.
- **Alternatives considered**:
  - virtualization (react-window): great UX for long lists but adds complexity and client-side rendering constraints

### 4) Error + toast strategy
- **Decision**: Centralize API error normalization in `frontend/lib/api.ts` and surface user-friendly messages via a single toast system; inline errors for forms.
- **Rationale**: Consistent UX and easier testing.
- **Alternatives considered**:
  - ad-hoc error handling per component: faster initially but inconsistent and hard to maintain
