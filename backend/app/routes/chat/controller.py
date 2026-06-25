import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session
from ...utilities.db import get_session
from ...utilities.tags import Tags
from .service import create_conversation, get_conversation, get_conversation_messages
from ...agents.chat_agent import run_agent_stream
from .stream import stream_manager

chat_router = APIRouter(prefix="/chat", tags=[Tags.chat])


class CreateConversationRequest(BaseModel):
    store_id: str = ""
    visitor_name: str | None = None
    visitor_email: str | None = None
    visitor_id: str | None = None
    channel: str = "chat"


class SendMessageRequest(BaseModel):
    session_id: str
    message: str
    store_id: str = ""


class ConversationResponse(BaseModel):
    id: str
    store_id: str
    created_at: str
    updated_at: str


@chat_router.post("/conversations")
def create_new_conversation(
    request: CreateConversationRequest,
    session: Session = Depends(get_session),
):
    conversation = create_conversation(
        store_id=request.store_id,
        session=session,
        visitor_name=request.visitor_name,
        visitor_email=request.visitor_email,
        visitor_id=request.visitor_id,
        channel=request.channel,
    )
    return {
        "id": conversation.id,
        "store_id": conversation.store_id,
        "channel": conversation.channel,
        "visitor_name": conversation.visitor_name,
        "visitor_email": conversation.visitor_email,
        "created_at": conversation.created_at.isoformat(),
        "updated_at": conversation.updated_at.isoformat(),
    }


@chat_router.get("/conversations/{conversation_id}")
def read_conversation(conversation_id: str, session: Session = Depends(get_session)):
    conversation = get_conversation(conversation_id, session)
    messages = get_conversation_messages(conversation_id, session)
    return {
        "id": conversation.id,
        "store_id": conversation.store_id,
        "created_at": conversation.created_at.isoformat(),
        "updated_at": conversation.updated_at.isoformat(),
        "messages": messages,
    }


@chat_router.post("/message")
async def send_message(request: SendMessageRequest):
    async def event_generator():
        try:
            async for event in run_agent_stream(
                conversation_id=request.session_id,
                user_message=request.message,
                store_id=request.store_id,
            ):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            error_event = {"type": "error", "content": str(e)}
            yield f"data: {json.dumps(error_event)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@chat_router.get("/conversations/{conversation_id}/stream")
async def stream_conversation(conversation_id: str):
    """SSE stream for live conversation updates (agent messages)."""

    async def event_generator():
        async for event in stream_manager.subscribe(conversation_id):
            yield event

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
