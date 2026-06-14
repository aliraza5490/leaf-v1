from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
import uuid


class Conversation(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    store_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    messages: List["ChatMessage"] = Relationship(back_populates="conversation")


class ChatMessage(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id", index=True)
    role: str = Field(max_length=20)
    content: str
    products_json: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
