---
id: "0007"
title: Minikube Kubernetes Deployment
stage: green
date: 2026-02-16
surface: agent
model: claude-opus-4-6
feature: 004-ai-todo-chatbot
branch: master
user: pc
command: /sp.implement
labels: ["deployment", "kubernetes", "minikube", "helm", "docker"]
links:
  spec: specs/004-ai-todo-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/Dockerfile
  - helm/todo-chatbot/values-dev.yaml
tests:
  - kubectl get pods -n todo-chatbot (all Running 1/1)
  - Backend health probe (GET / returns 200)
  - Frontend health probe (GET /api/health returns 200)
  - Cross-service connectivity (frontend -> backend via ClusterIP)
---

## Prompt

/sp.implement

Objective:
Deploy the completed Secure Todo Application (Next.js frontend + FastAPI backend)
on a local Kubernetes cluster using Minikube.

Context:
- Frontend and backend are fully implemented and working locally
- Docker Desktop is installed
- Minikube is not started yet
- No application code changes allowed (deployment only)

Implementation Tasks:
1. Create production-ready Dockerfiles for frontend and backend
2. Build Docker images locally
3. Start Minikube using Docker driver
4. Generate Helm charts for frontend and backend services
5. Configure environment variables via Kubernetes/Helm
6. Deploy both services to Minikube
7. Expose frontend service and verify backend connectivity
8. Use kubectl-ai and kagent for deployment verification and debugging

Rules:
- Do not modify frontend or backend logic
- Follow clean cloud-native and production-grade structure
- Deployment only

## Response snapshot

Successfully deployed the Todo Chatbot to Minikube with the following steps:

1. **Minikube started** with Docker driver (3GB memory, 2 CPUs)
2. **Docker images built** inside Minikube's Docker daemon:
   - `todo-chatbot-backend:latest` (287MB) — Python 3.11-slim multi-stage
   - `todo-chatbot-frontend:latest` (277MB) — Node 18-alpine multi-stage
3. **Fixes applied during deployment**:
   - Frontend Dockerfile: Changed `npm ci --only=production` to `npm ci` (TypeScript needed at build time)
   - values-dev.yaml: Changed DATABASE_URL from PostgreSQL to SQLite (matching dev config)
   - values-dev.yaml: Updated health probes from `/health` to `/` (backend) and `/api/health` (frontend)
4. **Helm deployment** succeeded (revision 1, namespace: todo-chatbot)
5. **Verification passed**:
   - Both pods Running (1/1 ready, 0 restarts)
   - Backend accessible at ClusterIP:8000
   - Frontend accessible at NodePort:30080
   - Cross-service connectivity confirmed (frontend pod -> backend returns JSON)
   - Frontend tunneled at http://127.0.0.1:52175

## Outcome

- ✅ Impact: Full Kubernetes deployment of Todo Chatbot on Minikube — both services healthy and communicating
- 🧪 Tests: All health probes passing, cross-service connectivity verified, no pod restarts
- 📁 Files: 2 files modified (frontend/Dockerfile, helm/todo-chatbot/values-dev.yaml)
- 🔁 Next prompts: Load testing (T075), E2E tests in cluster (T078), production values hardening
- 🧠 Reflection: Key issues were mismatched health probe paths and production-only npm install missing build deps. Both resolved without changing application code.

## Evaluation notes (flywheel)

- Failure modes observed: 1) psycopg2 missing (PostgreSQL URL in dev but no driver), 2) /health 404 (endpoint not in main app), 3) TypeScript missing at build time (--only=production excluded devDeps)
- Graders run and results (PASS/FAIL): Pod health PASS, service connectivity PASS, Helm lint PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Add /health endpoint to main app for production readiness
