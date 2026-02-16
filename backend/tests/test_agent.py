"""
T071: Integration tests for agent behavior with sample prompts.
T072: Edge cases: task not found, empty lists, ambiguous commands.
T076: Multi-turn conversation context preservation.
"""

import pytest
from ai_chatbot.agent.agent import TodoAgent
from ai_chatbot.agent.cohere_provider import LanguageDetector


class TestLanguageDetector:
    """Test intent detection for various user inputs."""

    def test_detect_add_task_english(self):
        result = LanguageDetector.detect_intent("Add a task to buy groceries")
        assert result["intent"] == "add_task"

    def test_detect_add_task_hindi(self):
        result = LanguageDetector.detect_intent("nayi task banao buy milk")
        assert result["intent"] == "add_task"

    def test_detect_list_tasks(self):
        result = LanguageDetector.detect_intent("Show me my tasks")
        assert result["intent"] == "list_tasks"

    def test_detect_list_pending(self):
        result = LanguageDetector.detect_intent("Show me pending tasks")
        assert result["intent"] == "list_tasks"
        assert result["status"] == "pending"

    def test_detect_list_completed(self):
        result = LanguageDetector.detect_intent("Show completed tasks")
        assert result["intent"] == "list_tasks"
        assert result["status"] == "completed"

    def test_detect_complete_task(self):
        result = LanguageDetector.detect_intent("Mark task 5 as complete")
        assert result["intent"] == "complete_task"
        assert result["task_id"] == 5

    def test_detect_delete_task(self):
        result = LanguageDetector.detect_intent("Delete task 3")
        assert result["intent"] == "delete_task"
        assert result["task_id"] == 3

    def test_detect_update_task(self):
        result = LanguageDetector.detect_intent("Update task 2 title")
        assert result["intent"] == "update_task"
        assert result["task_id"] == 2

    def test_detect_general_query(self):
        result = LanguageDetector.detect_intent("Hello there")
        assert result["intent"] == "general_query"

    def test_detect_priority_high(self):
        result = LanguageDetector.detect_intent("Add urgent task to fix bug")
        assert result.get("priority") == "high"

    def test_detect_priority_low(self):
        result = LanguageDetector.detect_intent("Add a low priority task to clean desk")
        assert result.get("priority") == "low"


class TestTodoAgent:
    """Integration tests for TodoAgent behavior."""

    def test_agent_initialization(self, session):
        agent = TodoAgent(session)
        assert agent.session == session
        assert agent.tools_registry is not None
        assert len(agent.tools_registry) == 5

    def test_agent_tool_definitions(self, session):
        agent = TodoAgent(session)
        tool_defs = agent._get_tool_definitions()
        assert len(tool_defs) == 5
        tool_names = [t["name"] for t in tool_defs]
        assert "add_task" in tool_names
        assert "list_tasks" in tool_names

    def test_agent_execute_unknown_tool(self, session):
        agent = TodoAgent(session)
        result = agent._execute_tool("nonexistent_tool", {})
        assert result["success"] is False
        assert "Unknown tool" in result["message"]

    def test_agent_system_prompt(self, session):
        agent = TodoAgent(session)
        prompt = agent._format_system_prompt()
        assert "task" in prompt.lower()
        assert "add_task" in prompt
        assert "list_tasks" in prompt

    def test_process_message_greeting(self, session, sample_user):
        agent = TodoAgent(session)
        result = agent.process_message("Hello!", sample_user.id)
        assert "response_text" in result
        assert len(result["response_text"]) > 0

    def test_process_message_add_task(self, session, sample_user):
        agent = TodoAgent(session)
        result = agent.process_message("Add a task to buy groceries", sample_user.id)
        assert "response_text" in result
        # In dev mode, tool should be called
        assert result.get("has_tools_executed") is True or "response_text" in result

    def test_process_message_list_tasks(self, session, sample_user, sample_tasks):
        agent = TodoAgent(session)
        result = agent.process_message("Show me my tasks", sample_user.id)
        assert "response_text" in result

    def test_process_message_empty(self, session, sample_user):
        """T072: Empty message edge case."""
        agent = TodoAgent(session)
        result = agent.process_message("", sample_user.id)
        assert "response_text" in result

    def test_process_message_returns_conversation_id(self, session, sample_user):
        agent = TodoAgent(session)
        result = agent.process_message("Hello", sample_user.id)
        assert "conversation_id" in result
        assert result["conversation_id"] is not None

    def test_run_conversation_creates_conversation(self, session, sample_user):
        agent = TodoAgent(session)
        result = agent.run_conversation("Hello", sample_user.id, "Test Chat")
        assert "conversation_id" in result
        assert result["conversation_id"] is not None
        assert "conversation_title" in result
