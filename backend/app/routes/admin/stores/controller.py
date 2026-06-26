from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import Optional
from datetime import datetime

from ....utilities.db import get_session
from ....utilities.tags import Tags
from ....utilities.auth import require_admin
from ....models.user import User
from ....models.store import Store, StoreRead, StoreUpdate
from ....models.product import Product
from ....models.conversation import Conversation

admin_stores_router = APIRouter(prefix="/stores", tags=[Tags.admin])


@admin_stores_router.get("/", response_model=dict)
def list_stores(
    q: Optional[str] = None,
    status: Optional[str] = None,
    plan: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    query = select(Store)
    count_query = select(func.count()).select_from(Store)

    if q:
        query = query.where(
            (Store.name.ilike(f"%{q}%")) | (Store.id.ilike(f"%{q}%"))
        )
        count_query = count_query.where(
            (Store.name.ilike(f"%{q}%")) | (Store.id.ilike(f"%{q}%"))
        )
    if status:
        query = query.where(Store.status == status)
        count_query = count_query.where(Store.status == status)
    if plan:
        query = query.where(Store.plan == plan)
        count_query = count_query.where(Store.plan == plan)

    total = session.exec(count_query).one()
    offset = (page - 1) * page_size
    query = query.order_by(Store.created_at.desc()).offset(offset).limit(page_size)
    stores = session.exec(query).all()

    items = []
    for store in stores:
        user_count = session.exec(
            select(func.count()).select_from(User).where(User.store_id == store.id)
        ).one()
        product_count = session.exec(
            select(func.count()).select_from(Product).where(Product.store_id == store.id)
        ).one()
        conversation_count = session.exec(
            select(func.count()).select_from(Conversation).where(Conversation.store_id == store.id)
        ).one()
        items.append({
            **StoreRead.model_validate(store).model_dump(),
            "user_count": user_count,
            "product_count": product_count,
            "conversation_count": conversation_count,
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@admin_stores_router.get("/stats")
def store_stats(
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    total = session.exec(select(func.count()).select_from(Store)).one()
    active = session.exec(
        select(func.count()).select_from(Store).where(Store.status == "active")
    ).one()
    suspended = session.exec(
        select(func.count()).select_from(Store).where(Store.status == "suspended")
    ).one()
    trial = session.exec(
        select(func.count()).select_from(Store).where(Store.status == "trial")
    ).one()

    by_plan = {}
    for p in ("free", "starter", "pro", "enterprise"):
        count = session.exec(
            select(func.count()).select_from(Store).where(Store.plan == p)
        ).one()
        by_plan[p] = count

    return {
        "total": total,
        "by_status": {"active": active, "suspended": suspended, "trial": trial},
        "by_plan": by_plan,
    }


@admin_stores_router.get("/{store_id}", response_model=dict)
def get_store(
    store_id: str,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    store = session.exec(select(Store).where(Store.id == store_id)).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    user_count = session.exec(
        select(func.count()).select_from(User).where(User.store_id == store_id)
    ).one()
    product_count = session.exec(
        select(func.count()).select_from(Product).where(Product.store_id == store_id)
    ).one()
    conversation_count = session.exec(
        select(func.count()).select_from(Conversation).where(Conversation.store_id == store_id)
    ).one()

    return {
        **StoreRead.model_validate(store).model_dump(),
        "user_count": user_count,
        "product_count": product_count,
        "conversation_count": conversation_count,
    }


@admin_stores_router.patch("/{store_id}", response_model=StoreRead)
def update_store(
    store_id: str,
    update: StoreUpdate,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    store = session.exec(select(Store).where(Store.id == store_id)).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(store, key, value)
    store.updated_at = datetime.utcnow()

    session.add(store)
    session.commit()
    session.refresh(store)
    return StoreRead.model_validate(store)
