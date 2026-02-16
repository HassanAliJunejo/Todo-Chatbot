"""
Tests for audit logging functionality.
"""

import json
import logging
import pytest
from ai_chatbot.middleware.audit_logger import AuditLogger


@pytest.fixture
def log_capture(caplog):
    """Capture audit log output."""
    with caplog.at_level(logging.INFO, logger="ai_chatbot.audit"):
        yield caplog


class TestAuditLogger:

    def test_log_chat_request(self, log_capture):
        AuditLogger.log_chat_request(1, "Hello world", conversation_id=5)
        assert len(log_capture.records) == 1
        record = json.loads(log_capture.records[0].message)
        assert record["event"] == "chat_request"
        assert record["user_id"] == 1
        assert record["message_length"] == 11
        assert record["conversation_id"] == 5

    def test_log_chat_response(self, log_capture):
        AuditLogger.log_chat_response(
            user_id=1,
            conversation_id=5,
            response_length=100,
            tools_executed=["add_task", "list_tasks"],
            duration_ms=150.5
        )
        assert len(log_capture.records) == 1
        record = json.loads(log_capture.records[0].message)
        assert record["event"] == "chat_response"
        assert record["tool_count"] == 2

    def test_log_tool_execution(self, log_capture):
        AuditLogger.log_tool_execution(
            user_id=1,
            tool_name="add_task",
            success=True,
            duration_ms=50.0
        )
        assert len(log_capture.records) == 1
        record = json.loads(log_capture.records[0].message)
        assert record["event"] == "tool_execution"
        assert record["tool_name"] == "add_task"
        assert record["success"] is True

    def test_log_auth_failure(self, log_capture):
        AuditLogger.log_auth_failure(1, "token expired")
        record = json.loads(log_capture.records[0].message)
        assert record["event"] == "auth_failure"

    def test_log_rate_limit(self, log_capture):
        AuditLogger.log_rate_limit(1)
        record = json.loads(log_capture.records[0].message)
        assert record["event"] == "rate_limit_exceeded"

    def test_log_error(self, log_capture):
        AuditLogger.log_error(1, "Connection timeout", context="chat_endpoint")
        record = json.loads(log_capture.records[0].message)
        assert record["event"] == "chat_error"
        assert record["context"] == "chat_endpoint"
