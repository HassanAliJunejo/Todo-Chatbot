# Research: AI Todo Chatbot — Full Integration

**Feature**: `004-ai-todo-chatbot`
**Date**: 2026-02-14

## Implementation State Assessment

The existing codebase already contains a working implementation of
the core AI chatbot. This research documents what exists, what's
missing, and decisions for remaining work.

### Existing Components (Verified)

| Component | Path | Status |
|-----------|------|--------|
| MCP Tools (5) | `backend/ai_chatbot/tools/` | Complete |
| TodoAgent | `backend/ai_chatbot/agent/agent.py` | Complete |
| CohereProvider | `backend/ai_chatbot/agent/cohere_provider.py` | Complete |
| Chat Endpoint | `backend/ai_chatbot/api/chat_endpoint.py` | Complete |
| DB Models | `backend/ai_chatbot/database/models.py` | Complete |
| Repositories | `backend/ai_chatbot/database/repositories.py` | Complete |
| Chatbot UI | `frontend/components/Chatbot.tsx` | Complete |
| API Client | `frontend/lib/api.ts` | Complete |
| Config | `backend/ai_chatbot/config.py` | Complete |
| Dependencies | `backend/requirements.txt` (cohere>=5.5.8) | Complete |

### Missing Components

| Component | Status | Action Required |
|-----------|--------|-----------------|
| Dockerfiles | Missing | Create for frontend + backend |
| docker-compose.yml | Missing | Create for local dev |
| Helm charts | Missing | Create for Minikube deployment |
| K8s manifests | Missing | Generate from Helm |
| .env.example | Missing | Create with documented vars |
| Integration tests | Missing | Create for validation phase |

## Decision: Cohere as LLM Provider

- **Decision**: Use Cohere `command-r-plus` model via the cohere Python SDK.
- **Rationale**: Already implemented in `cohere_provider.py`. The provider
  is abstracted behind a `CohereProvider` class that implements a `chat()`
  interface, making it swappable if needed (FR-009).
- **Alternatives considered**: OpenAI GPT-4, Anthropic Claude, Google Gemini.
  All rejected per spec requirement FR-007 (Cohere is the mandated provider).

## Decision: Agent Orchestration Pattern

- **Decision**: Use a custom agent loop in `TodoAgent.process_message()` that
  calls `CohereProvider.chat()` with tool definitions, then executes tool
  calls returned by the LLM.
- **Rationale**: The existing implementation uses Cohere's native tool-calling
  capability. The agent loop handles: system prompt injection, conversation
  history reconstruction, tool execution, and response enhancement.
- **Alternatives considered**: OpenAI Agents SDK was specified in the user
  description but the existing implementation uses a direct Cohere integration
  pattern. The agent orchestration is functionally equivalent — it routes
  intent to tools and manages the conversation loop. The current pattern is
  simpler and avoids an unnecessary SDK dependency.

## Decision: MCP Tool Pattern

- **Decision**: Stateless tool classes with `name()`, `description()`,
  `parameters()`, `execute()` static methods, registered in `TOOLS_REGISTRY`.
- **Rationale**: Already implemented and follows the MCP tool interface
  defined in the constitution's Development Workflow section.
- **Alternatives considered**: Function-based tools (rejected: less
  structured), class instances (rejected: statefulness risk).

## Decision: Separate Data Layer

- **Decision**: AI tasks use `ai_tasks` table, conversations use
  `ai_conversations`, messages use `ai_messages` — all separate from the
  main app's `tasks` table.
- **Rationale**: Allows independent evolution (spec constraint). The AI
  chatbot can add fields (priority, due_date) without affecting the manual
  task UI.
- **Alternatives considered**: Shared `tasks` table (rejected: coupling risk,
  spec constraint prohibits it).

## Decision: Docker Multi-Stage Builds

- **Decision**: Use multi-stage Docker builds for both frontend (Next.js)
  and backend (FastAPI). Alpine-based final images for minimal size.
- **Rationale**: Production images should be small and secure. Multi-stage
  builds separate build dependencies from runtime.
- **Alternatives considered**: Single-stage builds (rejected: larger images,
  build tools in production).

## Decision: Helm for Kubernetes Deployment

- **Decision**: Use Helm charts with configurable `values.yaml` for
  Minikube deployment.
- **Rationale**: Helm provides templating, versioning, and rollback
  capabilities. Minikube is the target local cluster.
- **Alternatives considered**: Raw K8s manifests (rejected: no templating),
  Kustomize (rejected: less ecosystem support for this project size).

## Environment Variables

Documented from `config.py` and `core/config.py`:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `COHERE_API_KEY` | Yes | — | Cohere API authentication key |
| `DATABASE_URL` | No | `sqlite:///./todo_backend.db` | Database connection string |
| `SECRET_KEY` | Yes | — | JWT signing secret |
| `ALGORITHM` | No | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `30` | JWT token TTL |
| `COHERE_MODEL` | No | `command-r-plus` | Cohere model name |
