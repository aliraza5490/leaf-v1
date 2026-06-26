from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from datetime import datetime, timedelta

from ....utilities.db import get_session
from ....utilities.tags import Tags
from ....utilities.auth import require_admin
from ....models.user import User
from ....models.store import Store
from ....models.product import Product
from ....models.conversation import Conversation, ChatMessage

admin_analytics_router = APIRouter(prefix="/analytics", tags=[Tags.admin])


@admin_analytics_router.get("/overview")
def overview(
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    total_users = session.exec(select(func.count()).select_from(User)).one()
    total_stores = session.exec(select(func.count()).select_from(Store)).one()
    total_products = session.exec(select(func.count()).select_from(Product)).one()
    total_conversations = session.exec(
        select(func.count()).select_from(Conversation)
    ).one()
    total_messages = session.exec(
        select(func.count()).select_from(ChatMessage)
    ).one()
    active_stores = session.exec(
        select(func.count()).select_from(Store).where(Store.status == "active")
    ).one()

    return {
        "total_users": total_users,
        "total_stores": total_stores,
        "total_products": total_products,
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "active_stores": active_stores,
    }


@admin_analytics_router.get("/trends")
def trends(
    range_days: int = 30,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    since = datetime.utcnow() - timedelta(days=range_days)

    daily_data = []
    for i in range(range_days):
        day = (datetime.utcnow() - timedelta(days=range_days - 1 - i)).date()
        day_start = datetime.combine(day, datetime.min.time())
        day_end = datetime.combine(day, datetime.max.time())

        users = session.exec(
            select(func.count())
            .select_from(User)
            .where(User.store_id != "")
        ).one()

        stores = session.exec(
            select(func.count())
            .select_from(Store)
            .where(Store.created_at >= day_start)
            .where(Store.created_at <= day_end)
        ).one()

        conversations = session.exec(
            select(func.count())
            .select_from(Conversation)
            .where(Conversation.created_at >= day_start)
            .where(Conversation.created_at <= day_end)
        ).one()

        daily_data.append({
            "date": day.isoformat(),
            "stores": stores,
            "conversations": conversations,
        })

    return {"range_days": range_days, "daily": daily_data}


@admin_analytics_router.get("/top-stores")
def top_stores(
    limit: int = 10,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    stores = session.exec(
        select(Store).order_by(Store.created_at.desc()).limit(limit)
    ).all()

    results = []
    for store in stores:
        conv_count = session.exec(
            select(func.count())
            .select_from(Conversation)
            .where(Conversation.store_id == store.id)
        ).one()
        prod_count = session.exec(
            select(func.count())
            .select_from(Product)
            .where(Product.store_id == store.id)
        ).one()
        results.append({
            "id": store.id,
            "name": store.name,
            "status": store.status,
            "plan": store.plan,
            "conversation_count": conv_count,
            "product_count": prod_count,
        })

    return {"items": results}
