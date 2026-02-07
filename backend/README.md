# Todo Backend API

This is the backend for the Todo application, built with FastAPI and SQLModel.

## Features

- User registration and authentication with JWT tokens
- Task management (CRUD operations)
- User isolation (each user can only access their own tasks)
- Task completion toggling
- Task filtering by status

## Installation

1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and update the values
6. Run the application: `uvicorn app.main:app --reload`

## API Documentation

API documentation is available at `/docs` when the server is running.

## Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/tasks/` - Get all tasks for the authenticated user
- `POST /api/v1/tasks/` - Create a new task
- `GET /api/v1/tasks/{task_id}` - Get a specific task
- `PUT /api/v1/tasks/{task_id}` - Update a specific task
- `DELETE /api/v1/tasks/{task_id}` - Delete a specific task
- `PATCH /api/v1/tasks/{task_id}/toggle` - Toggle task completion status

## Frontend Integration

This backend is designed to work seamlessly with the frontend of the Todo application. The authentication system is compatible with "Better Auth" expectations.