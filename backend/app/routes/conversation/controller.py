from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session
from typing import Optional

from ...utilities.db import get_session
from ...utilities.tags import Tags
from ...utilities.auth import get_user_from_token
from ...models.user import User
from .service import (
    list_conversations,
    get_conversation_detail,
    update_conversation,
    delete_conversation,
    bulk_operation,
    send_agent_reply,
    get_stats,
    get_trends,
    get_recent,
    get_analytics_summary,
    get_analytics_volume,
    get_analytics_channels,
    get_analytics_heatmap,
    get_analytics_top_products,
)

conversations_router = APIRouter(prefix="/conversations", tags=[Tags.chat])


class ConversationUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    tags: Optional[str] = None


class BulkOperationRequest(BaseModel):
    action: str
    ids: list[str]
    assigned_to: Optional[str] = None


class AgentReplyRequest(BaseModel):
    content: str


@conversations_router.get("/")
def list_all(
    q: str | None = None,
    status: str | None = None,
    channel: str | None = None,
    sort_field: str = "updated_at",
    sort_dir: str = "desc",
    page: int = 1,
    page_size: int = 20,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return list_conversations(
        session=session,
        store_id=user.store_id,
        q=q,
        status=status,
        channel=channel,
        sort_field=sort_field,
        sort_dir=sort_dir,
        page=page,
        page_size=page_size,
    )


@conversations_router.get("/stats")
def stats(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_stats(user.store_id, session)


@conversations_router.get("/trends")
def trends(
    range_days: int = 7,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_trends(user.store_id, session, range_days)


@conversations_router.get("/recent")
def recent(
    limit: int = 5,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_recent(user.store_id, session, limit)


@conversations_router.get("/analytics/summary")
def analytics_summary(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_analytics_summary(user.store_id, session)


@conversations_router.get("/analytics/volume")
def analytics_volume(
    range_days: int = 30,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_analytics_volume(user.store_id, session, range_days)


@conversations_router.get("/analytics/channels")
def analytics_channels(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_analytics_channels(user.store_id, session)


@conversations_router.get("/analytics/heatmap")
def analytics_heatmap(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_analytics_heatmap(user.store_id, session)


@conversations_router.get("/analytics/top-products")
def analytics_top_products(
    limit: int = 10,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_analytics_top_products(user.store_id, session, limit)


@conversations_router.get("/{conversation_id}")
def get_one(
    conversation_id: str,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return get_conversation_detail(conversation_id, user.store_id, session)


@conversations_router.patch("/{conversation_id}")
def update_one(
    conversation_id: str,
    update: ConversationUpdate,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return update_conversation(
        conversation_id=conversation_id,
        store_id=user.store_id,
        session=session,
        status=update.status,
        assigned_to=update.assigned_to,
        tags=update.tags,
    )


@conversations_router.delete("/{conversation_id}")
def delete_one(
    conversation_id: str,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return delete_conversation(conversation_id, user.store_id, session)


@conversations_router.post("/bulk")
def bulk(
    request: BulkOperationRequest,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return bulk_operation(
        action=request.action,
        ids=request.ids,
        store_id=user.store_id,
        session=session,
        assigned_to=request.assigned_to,
    )


@conversations_router.post("/{conversation_id}/messages")
def agent_reply(
    conversation_id: str,
    request: AgentReplyRequest,
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    return send_agent_reply(
        conversation_id=conversation_id,
        store_id=user.store_id,
        content=request.content,
        session=session,
    )
