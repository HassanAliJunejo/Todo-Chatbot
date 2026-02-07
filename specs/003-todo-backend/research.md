# Research: Phase II Todo App – Backend

## Decisions

- **Framework**: FastAPI (mandated by spec) for its high performance, asynchronous support, and native OpenAPI generation.
- **Authentication**: JWT-based auth compatible with "Better Auth". The frontend expects standard Bearer tokens. We will implement middleware to verify tokens and extract `user_id`.
- **Database**: Neon PostgreSQL with SQLModel. SQLModel combines SQLAlchemy and Pydantic for a seamless developer experience in FastAPI.
- **Data Isolation**: Every database query will include a `where` clause for `owner_id == current_user.id`.

## Rationale

- **Better Auth Compatibility**: By investigating the frontend, we determined that it uses standard JWT headers. Implementing a compatible backend ensures the "Frontend is FINAL" constraint is met.
- **SQLModel**: Since the project requires both Pydantic (for API schemas) and SQLAlchemy (for DB models), SQLModel is the optimal choice to reduce boilerplate and maintain single-source-of-truth models.

## Alternatives Considered

- **Django Ninja**: Considered for its speed, but FastAPI was explicitly requested in the tech stack.
- **Prisma**: Evaluation of Prisma for Python showed it's less mature for this specific ecosystem compared to the SQLAlchemy/SQLModel stack.
