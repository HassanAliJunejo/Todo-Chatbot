---
id: 0005
title: Fix missing API_BASE_URL env
stage: red
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-frontend
branch: 001-todo-frontend
user: laiqa94
command: interactive-session
labels: [nextjs,env,api,debugging]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - none
tests:
 - none
---

## Prompt

[Request interrupted by user for tool use]⨯ Error: API_BASE_URL is not set
    at baseUrl (app\api\auth\login\route.ts:7:19)
    at POST (app\api\auth\login\route.ts:17:30)
   5 | function baseUrl() {
   6 |   const url = process.env.API_BASE_URL;
>  7 |   if (!url) throw new Error("API_BASE_URL is not set");
     |                   ^
   8 |   return url;
   9 | }
  10 |
 POST /api/auth/login 500 in 1231ms (compile: 65ms, render: 1166ms)

## Response snapshot

Identified that the Next.js route handler throws when the server-side environment variable API_BASE_URL is missing. Recommended setting API_BASE_URL in the frontend server runtime (e.g., frontend/.env.local or shell env var) and restarting next dev, and asked for the backend URL/port to provide an exact value.

## Outcome

- ✅ Root cause: API_BASE_URL is required by route handlers (login/register/logout and proxy) and is currently unset in the Next.js runtime.
- 🔧 Resolution path: Set API_BASE_URL appropriately (or adjust handlers to fail gracefully if preferred).
- 🧪 Tests: none
- 📁 Files: none
- 🔁 Next prompts: confirm backend base URL and preferred failure behavior.
- 🧠 Reflection: Env configuration should be documented (e.g., .env.example) to avoid runtime crashes.

## Evaluation notes (flywheel)

- Failure modes observed: Missing environment variable caused a thrown error and 500 response from the Next.js route handler.
- Next experiment: Add an env template and/or preflight checks in dev startup to catch missing required env vars earlier.
