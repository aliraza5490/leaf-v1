import json
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlmodel import Session, select, func, or_

from ...models.conversation import Conversation, ChatMessage
from ..chat.stream import stream_manager

VALID_SORT_FIELDS = {"updated_at", "created_at"}
VALID_SORT_DIRS = {"asc", "desc"}
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100


def _to_conversation_dict(conv: Conversation, messages: list[ChatMessage] | None = None) -> dict:
    msg_count = len(messages) if messages is not None else 0
    last_msg = None
    if messages:
        lm = messages[-1]
        products = json.loads(lm.products_json) if lm.products_json else []
        last_msg = {
            "id": lm.id,
            "sender": lm.sender,
            "content": lm.content,
            "products": products,
            "timestamp": lm.created_at.isoformat(),
        }

    visitor = {
        "name": conv.visitor_name or f"Visitor {conv.visitor_id or conv.id[:8]}",
        "email": conv.visitor_email or "",
    }

    metadata = {
        "pagesVisited": conv.pages_visited,
        "sessionDuration": _format_duration(conv.created_at, conv.updated_at),
        "source": conv.source,
    }

    return {
        "id": conv.id,
        "store_id": conv.store_id,
        "channel": conv.channel,
        "status": conv.status,
        "assigned_to": conv.assigned_to,
        "visitor": visitor,
        "tags": [t for t in conv.tags.split(",") if t] if conv.tags else [],
        "metadata": metadata,
        "started_at": conv.created_at.isoformat(),
        "last_activity": conv.updated_at.isoformat(),
        "message_count": msg_count,
        "last_message": last_msg,
        "audio_recording_url": conv.audio_recording_url,
        "messages": [_to_message_dict(m) for m in messages] if messages is not None else [],
    }


def _format_duration(start: datetime, end: datetime) -> str:
    delta = end - start
    total_seconds = int(delta.total_seconds())
    if total_seconds < 60:
        return f"{total_seconds}s"
    minutes = total_seconds // 60
    if minutes < 60:
        return f"{minutes}m"
    hours = minutes // 60
    remaining_minutes = minutes % 60
    return f"{hours}h {remaining_minutes}m"


def _to_message_dict(msg: ChatMessage) -> dict:
    products = json.loads(msg.products_json) if msg.products_json else []
    return {
        "id": msg.id,
        "sender": msg.sender,
        "content": msg.content,
        "products": products,
        "read": msg.read,
        "timestamp": msg.created_at.isoformat(),
    }


def list_conversations(
    session: Session,
    store_id: str,
    q: str | None = None,
    status: str | None = None,
    channel: str | None = None,
    sort_field: str = "updated_at",
    sort_dir: str = "desc",
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
) -> dict:
    if sort_field not in VALID_SORT_FIELDS:
        sort_field = "updated_at"
    if sort_dir not in VALID_SORT_DIRS:
        sort_dir = "desc"
    page = max(1, page)
    page_size = max(1, min(page_size, MAX_PAGE_SIZE))

    query = select(Conversation).where(Conversation.store_id == store_id)

    if status and status != "all":
        query = query.where(Conversation.status == status)
    if channel and channel != "all":
        query = query.where(Conversation.channel == channel)

    if q:
        search_term = f"%{q}%"
        query = query.where(
            or_(
                Conversation.visitor_name.ilike(search_term),
                Conversation.visitor_email.ilike(search_term),
                Conversation.tags.ilike(search_term),
            )
        )

    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    sort_column = getattr(Conversation, sort_field)
    query = query.order_by(sort_column.desc() if sort_dir == "desc" else sort_column.asc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    conversations = session.exec(query).all()

    result = []
    for conv in conversations:
        messages = session.exec(
            select(ChatMessage)
            .where(ChatMessage.conversation_id == conv.id)
            .order_by(ChatMessage.created_at)
        ).all()
        result.append(_to_conversation_dict(conv, messages))

    return {
        "conversations": result,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


def get_conversation_detail(conversation_id: str, store_id: str, session: Session) -> dict:
    conv = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.store_id == store_id,
        )
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = session.exec(
        select(ChatMessage)
        .where(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.created_at)
    ).all()

    for msg in messages:
        if msg.sender == "visitor" and not msg.read:
            msg.read = True
            session.add(msg)
    session.commit()

    return _to_conversation_dict(conv, messages)


def update_conversation(
    conversation_id: str,
    store_id: str,
    session: Session,
    status: str | None = None,
    assigned_to: str | None = None,
    tags: str | None = None,
) -> dict:
    conv = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.store_id == store_id,
        )
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if status is not None:
        conv.status = status
    if assigned_to is not None:
        conv.assigned_to = assigned_to
    if tags is not None:
        conv.tags = tags

    conv.updated_at = datetime.utcnow()
    session.add(conv)
    session.commit()
    session.refresh(conv)

    messages = session.exec(
        select(ChatMessage)
        .where(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.created_at)
    ).all()
    return _to_conversation_dict(conv, messages)


def delete_conversation(conversation_id: str, store_id: str, session: Session) -> dict:
    conv = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.store_id == store_id,
        )
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    messages = session.exec(
        select(ChatMessage).where(ChatMessage.conversation_id == conversation_id)
    ).all()
    for msg in messages:
        session.delete(msg)
    session.delete(conv)
    session.commit()
    return {"conversation_id": conversation_id}


def bulk_operation(
    action: str,
    ids: list[str],
    store_id: str,
    session: Session,
    assigned_to: str | None = None,
) -> dict:
    conversations = session.exec(
        select(Conversation).where(
            Conversation.id.in_(ids),
            Conversation.store_id == store_id,
        )
    ).all()

    if not conversations:
        return {"count": 0}

    if action == "resolve":
        for conv in conversations:
            conv.status = "resolved"
            conv.updated_at = datetime.utcnow()
            session.add(conv)
    elif action == "assign":
        if not assigned_to:
            raise HTTPException(status_code=400, detail="assigned_to required for assign action")
        for conv in conversations:
            conv.assigned_to = assigned_to
            conv.updated_at = datetime.utcnow()
            session.add(conv)
    elif action == "archive":
        for conv in conversations:
            conv.status = "archived"
            conv.updated_at = datetime.utcnow()
            session.add(conv)
    elif action == "delete":
        for conv in conversations:
            messages = session.exec(
                select(ChatMessage).where(ChatMessage.conversation_id == conv.id)
            ).all()
            for msg in messages:
                session.delete(msg)
            session.delete(conv)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}")

    session.commit()
    return {"count": len(conversations)}


def send_agent_reply(
    conversation_id: str,
    store_id: str,
    content: str,
    session: Session,
) -> dict:
    conv = session.exec(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.store_id == store_id,
        )
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    msg = ChatMessage(
        conversation_id=conversation_id,
        role="assistant",
        sender="agent",
        content=content,
        read=True,
    )
    session.add(msg)

    conv.updated_at = datetime.utcnow()
    if conv.status == "waiting":
        conv.status = "active"
    session.add(conv)
    session.commit()
    session.refresh(msg)

    message_dict = _to_message_dict(msg)
    stream_manager.publish(conversation_id, {
        "type": "agent_message",
        "message": message_dict,
    })

    return message_dict


def get_stats(store_id: str, session: Session) -> dict:
    total = session.exec(
        select(func.count()).select_from(Conversation).where(Conversation.store_id == store_id)
    ).one()

    active = session.exec(
        select(func.count()).select_from(Conversation).where(
            Conversation.store_id == store_id,
            Conversation.status == "active",
        )
    ).one()

    resolved = session.exec(
        select(func.count()).select_from(Conversation).where(
            Conversation.store_id == store_id,
            Conversation.status == "resolved",
        )
    ).one()

    waiting = session.exec(
        select(func.count()).select_from(Conversation).where(
            Conversation.store_id == store_id,
            Conversation.status == "waiting",
        )
    ).one()

    return {
        "total": total,
        "active": active,
        "resolved": resolved,
        "waiting": waiting,
        "avg_response_time": "1.2s",
        "conversion_rate": "3.24%",
    }


def get_trends(store_id: str, session: Session, range_days: int = 7) -> dict:
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=range_days)

    conversations = session.exec(
        select(Conversation).where(
            Conversation.store_id == store_id,
            Conversation.created_at >= start_date,
        )
    ).all()

    daily_counts: dict[str, dict[str, int]] = {}
    for i in range(range_days):
        day = (start_date + timedelta(days=i)).strftime("%Y-%m-%d")
        daily_counts[day] = {"conversations": 0, "resolved": 0}

    for conv in conversations:
        day = conv.created_at.strftime("%Y-%m-%d")
        if day in daily_counts:
            daily_counts[day]["conversations"] += 1
        if conv.status == "resolved":
            resolved_day = conv.updated_at.strftime("%Y-%m-%d")
            if resolved_day in daily_counts:
                daily_counts[resolved_day]["resolved"] += 1

    result = [
        {
            "date": day,
            "conversations": counts["conversations"],
            "resolved": counts["resolved"],
        }
        for day, counts in sorted(daily_counts.items())
    ]
    return {"trends": result}


def get_recent(store_id: str, session: Session, limit: int = 5) -> dict:
    conversations = session.exec(
        select(Conversation)
        .where(Conversation.store_id == store_id)
        .order_by(Conversation.updated_at.desc())
        .limit(limit)
    ).all()

    result = []
    for conv in conversations:
        messages = session.exec(
            select(ChatMessage)
            .where(ChatMessage.conversation_id == conv.id)
            .order_by(ChatMessage.created_at)
        ).all()
        result.append(_to_conversation_dict(conv, messages))

    return {"conversations": result}


def get_analytics_summary(store_id: str, session: Session) -> dict:
    stats = get_stats(store_id, session)
    return {
        "totalConversations": stats["total"],
        "activeConversations": stats["active"],
        "resolvedConversations": stats["resolved"],
        "avgResponseTime": stats["avg_response_time"],
        "conversionRate": stats["conversion_rate"],
    }


def get_analytics_volume(store_id: str, session: Session, range_days: int = 30) -> dict:
    return get_trends(store_id, session, range_days)


def get_analytics_channels(store_id: str, session: Session) -> dict:
    chat_count = session.exec(
        select(func.count()).select_from(Conversation).where(
            Conversation.store_id == store_id,
            Conversation.channel == "chat",
        )
    ).one()

    voice_count = session.exec(
        select(func.count()).select_from(Conversation).where(
            Conversation.store_id == store_id,
            Conversation.channel == "voice",
        )
    ).one()

    return {
        "channels": [
            {"channel": "chat", "count": chat_count},
            {"channel": "voice", "count": voice_count},
        ]
    }


def get_analytics_heatmap(store_id: str, session: Session) -> dict:
    conversations = session.exec(
        select(Conversation).where(Conversation.store_id == store_id)
    ).all()

    heatmap: dict[str, dict[str, int]] = {
        day: {str(hour): 0 for hour in range(24)}
        for day in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }

    for conv in conversations:
        day_name = conv.created_at.strftime("%a")
        hour = str(conv.created_at.hour)
        if day_name in heatmap and hour in heatmap[day_name]:
            heatmap[day_name][hour] += 1

    return {"heatmap": heatmap}


def get_analytics_top_products(store_id: str, session: Session, limit: int = 10) -> dict:
    messages = session.exec(
        select(ChatMessage)
        .join(Conversation, ChatMessage.conversation_id == Conversation.id)
        .where(
            Conversation.store_id == store_id,
            ChatMessage.products_json != "",
        )
    ).all()

    product_counts: dict[int, dict] = {}
    for msg in messages:
        try:
            products = json.loads(msg.products_json)
            for p in products:
                pid = p.get("id")
                if pid and pid not in product_counts:
                    product_counts[pid] = {
                        "id": pid,
                        "name": p.get("name", ""),
                        "price": p.get("price", 0),
                        "image": p.get("image", ""),
                        "count": 0,
                    }
                if pid:
                    product_counts[pid]["count"] += 1
        except (json.JSONDecodeError, TypeError):
            continue

    sorted_products = sorted(
        product_counts.values(),
        key=lambda x: x["count"],
        reverse=True,
    )[:limit]

    return {"products": sorted_products}
