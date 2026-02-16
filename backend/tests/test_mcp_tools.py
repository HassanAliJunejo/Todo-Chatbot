"""
T070: Unit tests for MCP tools with mocked database calls.
Tests all 5 MCP tools: add_task, list_tasks, complete_task, update_task, delete_task.
"""

import pytest
from ai_chatbot.tools.add_task import AddTaskTool
from ai_chatbot.tools.list_tasks import ListTasksTool
from ai_chatbot.tools.complete_task import CompleteTaskTool
from ai_chatbot.tools.update_task import UpdateTaskTool
from ai_chatbot.tools.delete_task import DeleteTaskTool
from ai_chatbot.tools import TOOLS_REGISTRY


class TestToolsRegistry:
    """Test that all tools are properly registered."""

    def test_registry_contains_all_tools(self):
        assert "add_task" in TOOLS_REGISTRY
        assert "list_tasks" in TOOLS_REGISTRY
        assert "complete_task" in TOOLS_REGISTRY
        assert "update_task" in TOOLS_REGISTRY
        assert "delete_task" in TOOLS_REGISTRY

    def test_registry_has_exactly_five_tools(self):
        assert len(TOOLS_REGISTRY) == 5

    def test_all_tools_have_name(self):
        for tool_class in TOOLS_REGISTRY.values():
            assert tool_class.name() is not None
            assert len(tool_class.name()) > 0

    def test_all_tools_have_description(self):
        for tool_class in TOOLS_REGISTRY.values():
            assert tool_class.description() is not None
            assert len(tool_class.description()) > 0

    def test_all_tools_have_parameters(self):
        for tool_class in TOOLS_REGISTRY.values():
            params = tool_class.parameters()
            assert isinstance(params, dict)
            assert "properties" in params


class TestAddTaskTool:
    """Tests for the add_task MCP tool."""

    def test_add_task_success(self, session, sample_user):
        result = AddTaskTool.execute(
            {"user_id": sample_user.id, "title": "Buy groceries"},
            session
        )
        assert result["success"] is True
        assert result["title"] == "Buy groceries"
        assert "task_id" in result

    def test_add_task_with_priority(self, session, sample_user):
        result = AddTaskTool.execute(
            {"user_id": sample_user.id, "title": "Urgent meeting", "priority": "high"},
            session
        )
        assert result["success"] is True

    def test_add_task_with_description(self, session, sample_user):
        result = AddTaskTool.execute(
            {"user_id": sample_user.id, "title": "Read book", "description": "Chapter 5"},
            session
        )
        assert result["success"] is True

    def test_add_task_missing_title(self, session, sample_user):
        result = AddTaskTool.execute(
            {"user_id": sample_user.id},
            session
        )
        assert result["success"] is False

    def test_add_task_requires_user_id(self, session):
        result = AddTaskTool.execute(
            {"title": "No user task"},
            session
        )
        assert result["success"] is False


class TestListTasksTool:
    """Tests for the list_tasks MCP tool."""

    def test_list_all_tasks(self, session, sample_user, sample_tasks):
        result = ListTasksTool.execute(
            {"user_id": sample_user.id, "status": "all"},
            session
        )
        assert result["success"] is True
        assert result["task_count"] == 3

    def test_list_pending_tasks(self, session, sample_user, sample_tasks):
        result = ListTasksTool.execute(
            {"user_id": sample_user.id, "status": "pending"},
            session
        )
        assert result["success"] is True
        assert result["task_count"] == 2

    def test_list_completed_tasks(self, session, sample_user, sample_tasks):
        result = ListTasksTool.execute(
            {"user_id": sample_user.id, "status": "completed"},
            session
        )
        assert result["success"] is True
        assert result["task_count"] == 1

    def test_list_empty_tasks(self, session, sample_user):
        result = ListTasksTool.execute(
            {"user_id": sample_user.id, "status": "all"},
            session
        )
        assert result["success"] is True
        assert result["task_count"] == 0

    def test_list_tasks_user_isolation(self, session, sample_user, sample_tasks):
        """Verify tasks are isolated per user - non-existent user gets 0 tasks."""
        result = ListTasksTool.execute(
            {"user_id": 99999, "status": "all"},
            session
        )
        assert result["success"] is True
        assert result["task_count"] == 0


class TestCompleteTaskTool:
    """Tests for the complete_task MCP tool."""

    def test_complete_task_success(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = CompleteTaskTool.execute(
            {"user_id": sample_user.id, "task_id": task_id, "completed": True},
            session
        )
        assert result["success"] is True

    def test_complete_nonexistent_task(self, session, sample_user):
        result = CompleteTaskTool.execute(
            {"user_id": sample_user.id, "task_id": 99999, "completed": True},
            session
        )
        assert result["success"] is False

    def test_complete_task_wrong_user(self, session, sample_user, sample_tasks):
        """Task belonging to user 1 should not be completable by user 99999."""
        task_id = sample_tasks[0].id
        result = CompleteTaskTool.execute(
            {"user_id": 99999, "task_id": task_id, "completed": True},
            session
        )
        assert result["success"] is False


class TestDeleteTaskTool:
    """Tests for the delete_task MCP tool."""

    def test_delete_task_success(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = DeleteTaskTool.execute(
            {"user_id": sample_user.id, "task_id": task_id},
            session
        )
        assert result["success"] is True

    def test_delete_nonexistent_task(self, session, sample_user):
        result = DeleteTaskTool.execute(
            {"user_id": sample_user.id, "task_id": 99999},
            session
        )
        assert result["success"] is False

    def test_delete_task_wrong_user(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = DeleteTaskTool.execute(
            {"user_id": 99999, "task_id": task_id},
            session
        )
        assert result["success"] is False


class TestUpdateTaskTool:
    """Tests for the update_task MCP tool."""

    def test_update_task_title(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = UpdateTaskTool.execute(
            {"user_id": sample_user.id, "task_id": task_id, "title": "Updated Title"},
            session
        )
        assert result["success"] is True

    def test_update_nonexistent_task(self, session, sample_user):
        result = UpdateTaskTool.execute(
            {"user_id": sample_user.id, "task_id": 99999, "title": "No Task"},
            session
        )
        assert result["success"] is False

    def test_update_task_wrong_user(self, session, sample_user, sample_tasks):
        task_id = sample_tasks[0].id
        result = UpdateTaskTool.execute(
            {"user_id": 99999, "task_id": task_id, "title": "Hacked"},
            session
        )
        assert result["success"] is False
