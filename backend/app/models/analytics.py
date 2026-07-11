from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class AnalyticsEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    store_id: int = Field(index=True, foreign_key="store.id")
    session_id: str = Field(index=True, max_length=64)
    visitor_id: str = Field(index=True, max_length=64)
    event_type: str = Field(index=True, max_length=50) # e.g. "pageview", "click", "widget_toggle", "chat_start", "chat_message", "voice_start", "voice_end", "product_click", "heartbeat"
    url: Optional[str] = Field(default=None, max_length=512)
    referrer: Optional[str] = Field(default=None, max_length=512)
    user_agent: Optional[str] = Field(default=None, max_length=512)
    device: Optional[str] = Field(default=None, max_length=50) # e.g. "desktop", "mobile", "tablet"
    browser: Optional[str] = Field(default=None, max_length=50)
    os: Optional[str] = Field(default=None, max_length=50)
    country: Optional[str] = Field(default="United States", max_length=100)
    city: Optional[str] = Field(default=None, max_length=100)
    ip_address: Optional[str] = Field(default=None, max_length=45)
    event_data: Optional[str] = Field(default=None) # JSON-stringified event details (e.g. product_id, button_text)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)


class AnalyticsSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(index=True, max_length=64)
    store_id: int = Field(index=True, foreign_key="store.id")
    visitor_id: str = Field(index=True, max_length=64)
    started_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity_at: datetime = Field(default_factory=datetime.utcnow)
    duration_seconds: int = Field(default=0)
    pages_visited: int = Field(default=1)
    device: Optional[str] = Field(default=None, max_length=50)
    browser: Optional[str] = Field(default=None, max_length=50)
    os: Optional[str] = Field(default=None, max_length=50)
    country: Optional[str] = Field(default="United States", max_length=100)
    referrer: Optional[str] = Field(default=None, max_length=512)
    landing_page: Optional[str] = Field(default=None, max_length=512)


class ConversationAssessment(SQLModel, table=True):
    id: int = Field(foreign_key="conversation.id", primary_key=True)
    store_id: int = Field(index=True, foreign_key="store.id")
    resolved: bool = Field(default=False)
    csat_score: float = Field(default=5.0)
    intent_accuracy: float = Field(default=100.0)
    avg_confidence: float = Field(default=100.0)
    response_quality: float = Field(default=5.0)
    multi_language: bool = Field(default=False)
    intent: str = Field(default="faq", max_length=50) # e.g. "order_support", "recommendations", "faq", "returns_refunds", "other"
    assessed_at: datetime = Field(default_factory=datetime.utcnow)
