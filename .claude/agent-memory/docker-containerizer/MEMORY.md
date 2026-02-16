# Docker Containerization Memory

## Project: Todo-Chatbot

### Stack Configuration
- **Backend**: Python 3.11 + FastAPI + SQLModel + Cohere AI
- **Frontend**: Next.js 15.5.12 + React 18 + TypeScript + Tailwind
- **Package Manager**: npm (frontend), pip (backend)

### Base Images Selected
- Backend: `python:3.11-slim` - Good balance of size (~130MB) and compatibility
- Frontend: `node:18-alpine` - Minimal size (~110MB), works well with Next.js 15

### Key Dependencies
- Backend requires: PostgreSQL client libs (libpq5), gcc for building (build stage only)
- Frontend: libc6-compat needed for Alpine compatibility with Next.js

### Health Endpoints
- Backend: `/health` (already existed in ai_chatbot/main.py)
- Frontend: `/api/health` (created new route.ts)

### Next.js Configuration
- Required `output: 'standalone'` in next.config.ts for optimized Docker builds
- Standalone output reduces runtime from ~400MB to ~40MB
- Must copy: public/, .next/standalone/, .next/static/

### Entry Points
- Backend: `uvicorn main:app --host 0.0.0.0 --port 8000`
- Frontend: `node server.js` (from standalone output)

### Security Patterns Applied
- Non-root users: appuser (UID 1000), nextjs (UID 1001)
- No secrets in images (all via runtime env vars)
- Minimal package installation with --no-cache-dir, --no-install-recommends

### Image Size Targets Achieved
- Backend: ~150-180MB (vs ~500MB+ without multi-stage)
- Frontend: ~120-150MB (vs ~800MB+ without standalone)

### Common Pitfalls Avoided
- ✓ Added .dockerignore to prevent .env, node_modules, __pycache__ inclusion
- ✓ Separated dependency installation from source code for better caching
- ✓ Used COPY --chown to avoid permission issues
- ✓ Pinned base image versions (not :latest)
- ✓ Disabled Next.js telemetry in Docker builds

### Project-Specific Notes
- Backend has dual structure: app/ (todo API) + ai_chatbot/ (chat API)
- Main entry is backend/main.py which imports from app/main.py
- Frontend uses App Router (not Pages Router)
- CORS configured in both services for cross-origin requests
