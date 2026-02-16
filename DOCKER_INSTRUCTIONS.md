# Docker Build & Run Instructions

## Backend (FastAPI)

### Build the image
```bash
docker build -t todo-backend:latest -f backend/Dockerfile ./backend
```

### Run the container
```bash
# Basic run
docker run -d -p 8000:8000 --name todo-backend todo-backend:latest

# With environment variables
docker run -d -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/dbname" \
  -e SECRET_KEY="your-secret-key" \
  -e COHERE_API_KEY="your-cohere-key" \
  --name todo-backend \
  todo-backend:latest

# With .env file (recommended)
docker run -d -p 8000:8000 \
  --env-file backend/.env \
  --name todo-backend \
  todo-backend:latest
```

### Expected Image Size
- **Target**: ~150-180MB
- Base python:3.11-slim: ~130MB
- Dependencies: ~30-50MB

---

## Frontend (Next.js)

### Build the image
```bash
docker build -t todo-frontend:latest -f frontend/Dockerfile ./frontend
```

### Run the container
```bash
# Basic run
docker run -d -p 3000:3000 --name todo-frontend todo-frontend:latest

# With environment variables
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://localhost:8000" \
  --name todo-frontend \
  todo-frontend:latest

# With .env file (recommended)
docker run -d -p 3000:3000 \
  --env-file frontend/.env.local \
  --name todo-frontend \
  todo-frontend:latest
```

### Expected Image Size
- **Target**: ~120-150MB
- Base node:18-alpine: ~110MB
- Standalone output: ~10-40MB

---

## Running Both Services Together

### Option 1: Separate containers with network
```bash
# Create a network
docker network create todo-network

# Run backend
docker run -d \
  --network todo-network \
  --name todo-backend \
  -p 8000:8000 \
  --env-file backend/.env \
  todo-backend:latest

# Run frontend
docker run -d \
  --network todo-network \
  --name todo-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL="http://todo-backend:8000" \
  todo-frontend:latest
```

### Option 2: Using host network (simpler for local development)
```bash
# Run backend
docker run -d -p 8000:8000 --name todo-backend --env-file backend/.env todo-backend:latest

# Run frontend
docker run -d -p 3000:3000 --name todo-frontend -e NEXT_PUBLIC_API_URL="http://localhost:8000" todo-frontend:latest
```

---

## Useful Commands

### View logs
```bash
docker logs todo-backend
docker logs todo-frontend
docker logs -f todo-backend  # Follow logs
```

### Stop containers
```bash
docker stop todo-backend todo-frontend
```

### Remove containers
```bash
docker rm todo-backend todo-frontend
```

### Remove images
```bash
docker rmi todo-backend:latest todo-frontend:latest
```

### Rebuild without cache
```bash
docker build --no-cache -t todo-backend:latest -f backend/Dockerfile ./backend
docker build --no-cache -t todo-frontend:latest -f frontend/Dockerfile ./frontend
```

### Check container health
```bash
docker inspect --format='{{.State.Health.Status}}' todo-backend
docker inspect --format='{{.State.Health.Status}}' todo-frontend
```

---

## Environment Variables

### Backend Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret key
- `COHERE_API_KEY` - Cohere API key for AI chatbot

### Frontend Required Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (must be accessible from browser)

### Example .env files

**backend/.env**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
SECRET_KEY=your-super-secret-key-change-in-production
COHERE_API_KEY=your-cohere-api-key
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Security Notes

1. **Never commit .env files** - They are excluded via .dockerignore
2. **Change default secrets** - Use strong, unique values in production
3. **Non-root users** - Both containers run as non-root users (appuser/nextjs)
4. **Minimal base images** - Using slim/alpine variants
5. **No secrets in images** - Environment variables passed at runtime only

---

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct and database is accessible
- Verify all required environment variables are set
- Check logs: `docker logs todo-backend`

### Frontend can't connect to backend
- Ensure NEXT_PUBLIC_API_URL is correct
- If using Docker network, use container name (todo-backend) not localhost
- Check CORS settings in backend

### Image size too large
- Verify .dockerignore files are in place
- Check that node_modules and .next are excluded
- Use `docker images` to see actual sizes

### Build fails
- Ensure you're building from the correct directory
- Check that all dependencies are in requirements.txt / package.json
- Try building without cache: `--no-cache`
