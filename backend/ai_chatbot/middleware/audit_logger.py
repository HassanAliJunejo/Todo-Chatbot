"""
Audit logging for AI interactions.
Provides structured logging of all chat requests, tool executions, and errors.
"""

import logging
import json
from datetime import datetime
from typing import Any, Dict, List, Optional


# Configure audit logger
audit_logger = logging.getLogger("ai_chatbot.audit")
audit_logger.setLevel(logging.INFO)

# Create handler if none exists
if not audit_logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter(
            '%(asctime)s | %(levelname)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
    )
    audit_logger.addHandler(handler)


class AuditLogger:
    """Structured audit logger for AI chatbot interactions."""

    @staticmethod
    def log_chat_request(user_id: int, message: str, conversation_id: Optional[int] = None) -> None:
        """Log an incoming chat request."""
        audit_logger.info(json.dumps({
            "event": "chat_request",
            "user_id": user_id,
            "conversation_id": conversation_id,
            "message_length": len(message),
            "timestamp": datetime.utcnow().isoformat()
        }))

    @staticmethod
    def log_chat_response(
        user_id: int,
        conversation_id: int,
        response_length: int,
        tools_executed: List[str],
        duration_ms: float
    ) -> None:
        """Log a chat response."""
        audit_logger.info(json.dumps({
            "event": "chat_response",
            "user_id": user_id,
            "conversation_id": conversation_id,
            "response_length": response_length,
            "tools_executed": tools_executed,
            "tool_count": len(tools_executed),
            "duration_ms": round(duration_ms, 2),
            "timestamp": datetime.utcnow().isoformat()
        }))

    @staticmethod
    def log_tool_execution(
        user_id: int,
        tool_name: str,
        success: bool,
        duration_ms: float
    ) -> None:
        """Log a tool execution."""
        audit_logger.info(json.dumps({
            "event": "tool_execution",
            "user_id": user_id,
            "tool_name": tool_name,
            "success": success,
            "duration_ms": round(duration_ms, 2),
            "timestamp": datetime.utcnow().isoformat()
        }))

    @staticmethod
    def log_auth_failure(user_id: int, reason: str) -> None:
        """Log an authentication/authorization failure."""
        audit_logger.warning(json.dumps({
            "event": "auth_failure",
            "user_id": user_id,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat()
        }))

    @staticmethod
    def log_rate_limit(user_id: int) -> None:
        """Log a rate limit hit."""
        audit_logger.warning(json.dumps({
            "event": "rate_limit_exceeded",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        }))

    @staticmethod
    def log_error(user_id: int, error: str, context: Optional[str] = None) -> None:
        """Log an error during AI interaction."""
        audit_logger.error(json.dumps({
            "event": "chat_error",
            "user_id": user_id,
            "error": error,
            "context": context,
            "timestamp": datetime.utcnow().isoformat()
        }))
