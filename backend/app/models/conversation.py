from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
import uuid


class Conversation(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    store_id: str = Field(index=True)
    channel: str = Field(default="chat", max_length=20)
    status: str = Field(default="active", max_length=20, index=True)
    assigned_to: Optional[str] = Field(default=None, foreign_key="user.email")
    visitor_name: Optional[str] = Field(default=None, max_length=128)
    visitor_email: Optional[str] = Field(default=None, max_length=255)
    visitor_id: Optional[str] = Field(default=None, max_length=128)
    tags: str = Field(default="")
    source: str = Field(default="Chat widget", max_length=128)
    pages_visited: int = Field(default=0)
    audio_recording_url: Optional[str] = Field(default=None, max_length=512)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    messages: List["ChatMessage"] = Relationship(back_populates="conversation")


class ChatMessage(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    conversation_id: str = Field(foreign_key="conversation.id", index=True)
    role: str = Field(max_length=20)
    sender: str = Field(default="visitor", max_length=20)
    content: str
    products_json: str = ""
    read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    conversation: Optional[Conversation] = Relationship(back_populates="messages")
