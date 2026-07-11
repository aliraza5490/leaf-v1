import json
from datetime import datetime
from sqlmodel import Session, select
from ...models.conversation import Conversation, ChatMessage


def create_conversation(
    store_id: int,
    session: Session,
    visitor_name: str | None = None,
    visitor_email: str | None = None,
    visitor_id: str | None = None,
    channel: str = "chat",
) -> Conversation:
    conversation = Conversation(
        store_id=store_id,
        visitor_name=visitor_name,
        visitor_email=visitor_email,
        visitor_id=visitor_id,
        channel=channel,
    )
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def get_conversation(conversation_id: int, session: Session) -> Conversation:
    conversation = session.exec(
        select(Conversation).where(Conversation.id == conversation_id)
    ).first()
    if not conversation:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


def get_conversation_messages(conversation_id: int, session: Session) -> list[dict]:
    messages = session.exec(
        select(ChatMessage)
        .where(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.created_at)
    ).all()
    result = []
    for msg in messages:
        products = json.loads(msg.products_json) if msg.products_json else []
        result.append({
            "id": msg.id,
            "role": msg.role,
            "sender": msg.sender,
            "content": msg.content,
            "products": products,
            "timestamp": msg.created_at.isoformat(),
        })
    return result
