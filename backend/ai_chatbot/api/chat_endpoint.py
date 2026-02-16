"""
Chat API endpoint for AI Todo Chatbot
Handles POST /api/{user_id}/chat requests
"""

import time
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlmodel import Session
from typing import Optional
from pydantic import BaseModel

from ..database.engine import get_session
from ..middleware.jwt_middleware import JWTService
from ..middleware.rate_limiter import chat_rate_limiter
from ..middleware.audit_logger import AuditLogger
from ..agent.agent import TodoAgent
from ..database.repositories import ConversationRepository, MessageRepository


router = APIRouter()
security = HTTPBearer()


class ChatRequest(BaseModel):
    """Request model for chat endpoint"""
    message: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    """Response model for chat endpoint"""
    conversation_id: int
    response: str
    has_tools_executed: bool
    tool_results: list
    message_id: Optional[int] = None


@router.get("/testchat")
def test_chat():
    return {"message": "chat test"}

@router.post("/{user_id}/chat")
def chat(
    user_id: int,
    request: ChatRequest,
    session: Session = Depends(get_session),
    authenticated_user_id: int = Depends(JWTService.get_current_user_id)
):
    """
    Chat endpoint for AI Todo Chatbot

    Args:
        user_id: ID of the authenticated user (from path)
        request: Chat request containing message and optional conversation_id
        authenticated_user_id: ID of the authenticated user (from JWT token)
        session: Database session

    Returns:
        ChatResponse with AI response and tool execution results
    """
    start_time = time.time()

    try:
        # Verify that the user ID in the token matches the one in the path
        if authenticated_user_id != user_id:
            AuditLogger.log_auth_failure(user_id, "user_id mismatch between path and JWT")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this resource"
            )

        # Rate limiting
        try:
            chat_rate_limiter.check(user_id)
        except HTTPException:
            AuditLogger.log_rate_limit(user_id)
            raise

        # Audit: log incoming request
        AuditLogger.log_chat_request(user_id, request.message, request.conversation_id)

        # Create the AI agent
        agent = TodoAgent(session)

        # Process the message
        result = agent.process_message(
            user_message=request.message,
            user_id=user_id,
            conversation_id=request.conversation_id
        )

        # Ensure conversation_id is never None
        conversation_id = result.get("conversation_id")
        if conversation_id is None:
            try:
                conversation_repo = ConversationRepository(session)
                conversation = conversation_repo.create_conversation(
                    conversation_create={"title": "New Chat"},
                    user_id=user_id
                )
                conversation_id = conversation.id
            except Exception:
                conversation_id = 1

        # Ensure we never return None for conversation_id
        safe_conversation_id = result.get("conversation_id") or conversation_id or 1
        if not isinstance(safe_conversation_id, int):
            try:
                safe_conversation_id = int(safe_conversation_id)
            except (ValueError, TypeError):
                safe_conversation_id = 1

        # Audit: log response
        duration_ms = (time.time() - start_time) * 1000
        tools_executed = [tr["tool_name"] for tr in result.get("tool_results", [])]
        response_text = result.get("response_text", "")
        AuditLogger.log_chat_response(
            user_id=user_id,
            conversation_id=safe_conversation_id,
            response_length=len(response_text),
            tools_executed=tools_executed,
            duration_ms=duration_ms
        )

        from fastapi.responses import JSONResponse
        return JSONResponse(
            content={
                "conversation_id": safe_conversation_id,
                "response": response_text or "I'm sorry, I couldn't process that request.",
                "has_tools_executed": result.get("has_tools_executed", False),
                "tool_results": result.get("tool_results", []),
                "message_id": result.get("message_id", None)
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        AuditLogger.log_error(user_id, str(e), context="chat_endpoint")

        from fastapi.responses import JSONResponse
        return JSONResponse(
            content={
                "conversation_id": 1,
                "response": "I'm sorry, I encountered an error processing your request.",
                "has_tools_executed": False,
                "tool_results": [],
                "message_id": None
            }
        )


# Additional endpoint to create a new conversation
class NewConversationRequest(BaseModel):
    """Request model for creating a new conversation"""
    message: str
    title: Optional[str] = None


@router.post("/{user_id}/new_conversation")
async def new_conversation(
    user_id: int,
    request: NewConversationRequest,
    session: Session = Depends(get_session),
    authenticated_user_id: int = Depends(JWTService.get_current_user_id)
):
    """
    Create a new conversation and process the first message

    Args:
        user_id: ID of the authenticated user
        request: Request containing the initial message and optional title
        authenticated_user_id: ID of the authenticated user (from JWT token)
        session: Database session

    Returns:
        ChatResponse with AI response and tool execution results
    """
    start_time = time.time()

    try:
        # Verify that the user ID in the token matches the one in the path
        if authenticated_user_id != user_id:
            AuditLogger.log_auth_failure(user_id, "user_id mismatch in new_conversation")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this resource"
            )

        # Rate limiting
        try:
            chat_rate_limiter.check(user_id)
        except HTTPException:
            AuditLogger.log_rate_limit(user_id)
            raise

        # Audit: log incoming request
        AuditLogger.log_chat_request(user_id, request.message)

        # Create the AI agent
        agent = TodoAgent(session)

        # Run the conversation
        result = agent.run_conversation(
            user_message=request.message,
            user_id=user_id,
            conversation_title=request.title
        )

        # Ensure conversation_id is valid
        conversation_id = result.get("conversation_id") or 1
        if not isinstance(conversation_id, int):
            conversation_id = 1

        # Audit: log response
        duration_ms = (time.time() - start_time) * 1000
        tools_executed = [tr["tool_name"] for tr in result.get("tool_results", [])]
        AuditLogger.log_chat_response(
            user_id=user_id,
            conversation_id=conversation_id,
            response_length=len(result.get("response_text", "")),
            tools_executed=tools_executed,
            duration_ms=duration_ms
        )

        from fastapi.responses import JSONResponse
        return JSONResponse(
            content={
                "conversation_id": int(conversation_id),
                "response": result.get("response_text", "I'm sorry, I couldn't process that request."),
                "has_tools_executed": result.get("has_tools_executed", False),
                "tool_results": result.get("tool_results", []),
                "message_id": None
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        AuditLogger.log_error(user_id, str(e), context="new_conversation")

        from fastapi.responses import JSONResponse
        return JSONResponse(
            content={
                "conversation_id": 1,
                "response": "I'm sorry, I encountered an error creating the conversation.",
                "has_tools_executed": False,
                "tool_results": [],
                "message_id": None
            }
        )


# Streaming chat endpoint (SSE)
@router.post("/{user_id}/chat/stream")
def chat_stream(
    user_id: int,
    request: ChatRequest,
    session: Session = Depends(get_session),
    authenticated_user_id: int = Depends(JWTService.get_current_user_id)
):
    """
    Streaming chat endpoint using Server-Sent Events.
    Sends the response in chunks for better perceived latency.
    """
    import json
    from fastapi.responses import StreamingResponse

    # Auth check
    if authenticated_user_id != user_id:
        AuditLogger.log_auth_failure(user_id, "user_id mismatch in stream")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this resource"
        )

    # Rate limiting
    try:
        chat_rate_limiter.check(user_id)
    except HTTPException:
        AuditLogger.log_rate_limit(user_id)
        raise

    AuditLogger.log_chat_request(user_id, request.message, request.conversation_id)

    def generate():
        start_time_stream = time.time()
        try:
            agent = TodoAgent(session)
            result = agent.process_message(
                user_message=request.message,
                user_id=user_id,
                conversation_id=request.conversation_id
            )

            conversation_id = result.get("conversation_id") or 1

            # Send tool results first
            if result.get("tool_results"):
                yield f"data: {json.dumps({'type': 'tools', 'tool_results': result['tool_results']})}\n\n"

            # Stream the response text in chunks
            response_text = result.get("response_text", "")
            chunk_size = 20  # characters per chunk
            for i in range(0, len(response_text), chunk_size):
                chunk = response_text[i:i + chunk_size]
                yield f"data: {json.dumps({'type': 'text', 'content': chunk})}\n\n"

            # Send completion event
            yield f"data: {json.dumps({'type': 'done', 'conversation_id': conversation_id})}\n\n"

            # Audit log
            duration_ms = (time.time() - start_time_stream) * 1000
            tools_executed = [tr["tool_name"] for tr in result.get("tool_results", [])]
            AuditLogger.log_chat_response(
                user_id=user_id,
                conversation_id=conversation_id,
                response_length=len(response_text),
                tools_executed=tools_executed,
                duration_ms=duration_ms
            )

        except Exception as e:
            AuditLogger.log_error(user_id, str(e), context="chat_stream")
            yield f"data: {json.dumps({'type': 'error', 'message': 'An error occurred processing your request.'})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


# Endpoint to get conversation history
class ConversationHistoryResponse(BaseModel):
    """Response model for conversation history"""
    conversation_id: int
    title: str
    messages: list


@router.get("/{user_id}/conversations/{conversation_id}", response_model=ConversationHistoryResponse)
async def get_conversation_history(
    user_id: int,
    conversation_id: int,
    session: Session = Depends(get_session),
    authenticated_user_id: int = Depends(JWTService.get_current_user_id)
):
    """
    Get conversation history for a specific conversation

    Args:
        user_id: ID of the authenticated user
        conversation_id: ID of the conversation to retrieve
        authenticated_user_id: ID of the authenticated user (from JWT token)
        session: Database session

    Returns:
        ConversationHistoryResponse with conversation details
    """
    try:
        # Verify that the user ID in the token matches the one in the path
        if authenticated_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to access this resource"
            )

        # Verify user has access to this conversation
        conversation_repo = ConversationRepository(session)
        conversation = conversation_repo.get_conversation_by_id(conversation_id, user_id)

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or you don't have access to it"
            )

        # Get messages for this conversation
        message_repo = MessageRepository(session)
        messages = message_repo.get_messages_by_conversation(conversation_id)

        # Format messages
        formatted_messages = [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at.isoformat()
            }
            for msg in messages
        ]

        return ConversationHistoryResponse(
            conversation_id=conversation.id,
            title=conversation.title,
            messages=formatted_messages
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving conversation: {str(e)}"
        )