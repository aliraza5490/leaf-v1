import json
from datetime import datetime
from sqlmodel import Session, select
from ...models.conversation import Conversation, ChatMessage


def create_conversation(store_id: str, session: Session) -> Conversation:
    conversation = Conversation(store_id=store_id)
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def get_conversation(conversation_id: str, session: Session) -> Conversation:
    conversation = session.exec(
        select(Conversation).where(Conversation.id == conversation_id)
    ).first()
    if not conversation:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


def get_conversation_messages(conversation_id: str, session: Session) -> list[dict]:
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
            "content": msg.content,
            "products": products,
            "timestamp": msg.created_at.isoformat(),
        })
    return result
