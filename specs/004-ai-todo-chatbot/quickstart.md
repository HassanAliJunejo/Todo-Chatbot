# Quickstart: AI Todo Chatbot

**Feature**: `004-ai-todo-chatbot`
**Date**: 2026-02-14

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (for containerization phases)
- Minikube + kubectl + Helm (for deployment phases)
- Cohere API key ([https://dashboard.cohere.com](https://dashboard.cohere.com))

## 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Linux/Mac
# venv\Scripts\activate       # Windows

pip install -r requirements.txt
```

### Environment Variables

Create `backend/.env`:
```
COHERE_API_KEY=your_cohere_api_key_here
DATABASE_URL=sqlite:///./todo_backend.db
SECRET_KEY=your_jwt_secret_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Run Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API is available at `http://localhost:8000`.
Chat endpoint: `POST http://localhost:8000/api/v1/{user_id}/chat`

## 2. Frontend Setup

```bash
cd frontend
npm install
```

### Environment Variables

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Run Frontend

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

## 3. Verify Setup

1. Register a user: `POST /api/v1/auth/register`
2. Login: `POST /api/v1/auth/login` → get JWT token
3. Open `http://localhost:3000`, log in
4. Click the chatbot icon (bottom-right)
5. Type "Add a task to buy groceries"
6. Verify the task appears in both the chat response and the tasks page

## 4. Docker (Phase 5)

```bash
# Build images
docker build -t todo-backend:latest -f backend/Dockerfile .
docker build -t todo-frontend:latest -f frontend/Dockerfile .

# Run containers
docker run -d --name backend -p 8000:8000 --env-file backend/.env todo-backend:latest
docker run -d --name frontend -p 3000:3000 todo-frontend:latest
```

## 5. Kubernetes (Phase 6)

```bash
# Start Minikube
minikube start

# Deploy with Helm
helm install todo-chatbot ./helm/todo-chatbot

# Verify
kubectl get pods
kubectl get services
```

## Validation Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts and connects to backend
- [ ] User can register and login
- [ ] Chat endpoint returns AI responses
- [ ] All 5 CRUD operations work via chatbot
- [ ] Conversation history persists across page reloads
- [ ] Docker images build successfully
- [ ] Helm deployment succeeds on Minikube
