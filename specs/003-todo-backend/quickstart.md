# Quickstart: Phase II Todo App – Backend

## Prerequisites

- Python 3.12+
- Docker (optional)
- Neon PostgreSQL connection string

## Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install fastapi sqlmodel uvicorn passlib[bcrypt] pyjwt python-multipart psycopg2-binary
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env` and fill:
   - `DATABASE_URL`: Your Neon connection string
   - `SECRET_KEY`: Random string for JWT signing

5. **Run Migrations**:
   ```bash
   alembic upgrade head
   ```

6. **Start Application**:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Access

- **Docs**: `http://localhost:8000/docs`
- **Base URL**: `http://localhost:8000/api/v1`
