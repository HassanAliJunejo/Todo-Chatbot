"""
T074: Security tests for user isolation.
T077: Error handling validation.
"""

import pytest
from ai_chatbot.tools.add_task import AddTaskTool
from ai_chatbot.tools.list_tasks import ListTasksTool
from ai_chatbot.tools.complete_task import CompleteTaskTool
from ai_chatbot.tools.delete_task import DeleteTaskTool
from ai_chatbot.tools.update_task import UpdateTaskTool
from ai_chatbot.middleware.rate_limiter import RateLimiter


class TestUserIsolation:
    """Verify that all tools enforce user isolation."""

    def test_cannot_list_other_users_tasks(self, session, sample_user, sample_tasks):
        result = ListTasksTool.execute(
            {"user_id": sample_user.id + 1, "status": "all"},
            session
        )
        assert result["success"] is True
        assert result["task_count"] == 0

    def test_cannot_complete_other_users_task(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = CompleteTaskTool.execute(
            {"user_id": sample_user.id + 1, "task_id": task_id, "completed": True},
            session
        )
        assert result["success"] is False

    def test_cannot_delete_other_users_task(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = DeleteTaskTool.execute(
            {"user_id": sample_user.id + 1, "task_id": task_id},
            session
        )
        assert result["success"] is False

    def test_cannot_update_other_users_task(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = UpdateTaskTool.execute(
            {"user_id": sample_user.id + 1, "task_id": task_id, "title": "Hacked"},
            session
        )
        assert result["success"] is False


class TestRateLimiter:
    """Test rate limiting functionality."""

    def test_allows_requests_within_limit(self):
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        for _ in range(5):
            limiter.check(1)  # Should not raise

    def test_blocks_requests_over_limit(self):
        from fastapi import HTTPException
        limiter = RateLimiter(max_requests=3, window_seconds=60)
        for _ in range(3):
            limiter.check(1)
        with pytest.raises(HTTPException) as exc_info:
            limiter.check(1)
        assert exc_info.value.status_code == 429

    def test_rate_limit_per_user(self):
        limiter = RateLimiter(max_requests=2, window_seconds=60)
        limiter.check(1)
        limiter.check(1)
        # User 2 should still have capacity
        limiter.check(2)

    def test_remaining_count(self):
        limiter = RateLimiter(max_requests=5, window_seconds=60)
        assert limiter.remaining(1) == 5
        limiter.check(1)
        assert limiter.remaining(1) == 4


class TestErrorHandling:
    """T077: Validate error handling scenarios."""

    def test_add_task_invalid_input(self, session, sample_user):
        result = AddTaskTool.execute({}, session)
        assert result["success"] is False

    def test_complete_task_invalid_id(self, session, sample_user):
        result = CompleteTaskTool.execute(
            {"user_id": sample_user.id, "task_id": -1, "completed": True},
            session
        )
        assert result["success"] is False

    def test_delete_task_invalid_id(self, session, sample_user):
        result = DeleteTaskTool.execute(
            {"user_id": sample_user.id, "task_id": -1},
            session
        )
        assert result["success"] is False

    def test_list_tasks_invalid_status(self, session, sample_user):
        """Invalid status should default to 'all'."""
        result = ListTasksTool.execute(
            {"user_id": sample_user.id, "status": "invalid_status"},
            session
        )
        assert result["success"] is True
