"""
Test configuration and shared fixtures for AI Todo Chatbot tests.
"""

import pytest
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool


@pytest.fixture(name="session")
def session_fixture():
    """Create an in-memory SQLite database session for testing."""
    # Import all models to register them with SQLModel metadata
    from app.models.user import User  # noqa: F401
    from app.models.task import Task  # noqa: F401
    from ai_chatbot.database.models import (  # noqa: F401
        Task as AITask,
        Conversation,
        Message,
    )

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture
def sample_user(session):
    """Create a sample user for testing."""
    from app.models.user import User
    user = User(
        email="test@example.com",
        full_name="Test User",
        hashed_password="hashed_password_123"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@pytest.fixture
def sample_tasks(session, sample_user):
    """Create sample tasks for testing."""
    from ai_chatbot.database.models import Task
    tasks = []
    for i in range(3):
        task = Task(
            title=f"Test Task {i + 1}",
            description=f"Description for task {i + 1}",
            priority=["low", "medium", "high"][i],
            completed=(i == 2),
            user_id=sample_user.id
        )
        session.add(task)
        tasks.append(task)
    session.commit()
    for task in tasks:
        session.refresh(task)
    return tasks
