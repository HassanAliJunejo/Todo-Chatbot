---
id: 0006
title: API_BASE_URL missing on register
stage: red
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-frontend
branch: 001-todo-frontend
user: laiqa94
command: interactive-session
labels: [nextjs,env,api,debugging,register]
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

⨯ Error: API_BASE_URL is not set
    at baseUrl (app\api\auth\register\route.ts:7:19)
    at POST (app\api\auth\register\route.ts:17:30)
   5 | function baseUrl() {
   6 |   const url = process.env.API_BASE_URL;
>  7 |   if (!url) throw new Error("API_BASE_URL is not set");
     |                   ^
   8 |   return url;
   9 | }
  10 |
 POST /api/auth/register 500 in 14.8s (compile: 14.6s, render: 268ms)

## Response snapshot

Confirmed the same root cause applies to the register route handler: API_BASE_URL is unset in the Next.js server runtime. Noted there is currently no frontend/.env.local present, so the most direct fix is to create frontend/.env.local (or set shell env var) and restart next dev.

## Outcome

- ✅ Root cause: API_BASE_URL missing causes register route to throw and return 500.
- 🔧 Next step: Define API_BASE_URL (e.g., http://localhost:<backend-port>) for Next.js runtime.
- 🧪 Tests: none
- 📁 Files: none
- 🔁 Next prompts: confirm backend host/port and whether user prefers .env.local or shell env.
- 🧠 Reflection: Missing env templates/docs can cause repeated runtime failures across multiple routes.

## Evaluation notes (flywheel)

- Failure modes observed: Missing env var causes server route to throw instead of returning a structured error response.
- Next experiment: Add a minimal .env.example and update dev setup steps so required env vars are obvious.
