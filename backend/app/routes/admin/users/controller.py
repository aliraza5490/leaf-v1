from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from typing import Optional
from datetime import datetime, timedelta

from ....utilities.db import get_session
from ....utilities.tags import Tags
from ....utilities.auth import require_admin
from ....models.user import User, UserRead, UserAdminUpdate

admin_users_router = APIRouter(prefix="/users", tags=[Tags.admin])


@admin_users_router.get("/", response_model=dict)
def list_users(
    q: Optional[str] = None,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    page: int = 1,
    page_size: int = 20,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    query = select(User)
    count_query = select(func.count()).select_from(User)

    if q:
        query = query.where(
            (User.email.ilike(f"%{q}%")) | (User.full_name.ilike(f"%{q}%"))
        )
        count_query = count_query.where(
            (User.email.ilike(f"%{q}%")) | (User.full_name.ilike(f"%{q}%"))
        )
    if role:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)
    if is_active is not None:
        query = query.where(User.isActive == is_active)
        count_query = count_query.where(User.isActive == is_active)

    total = session.exec(count_query).one()
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)
    users = session.exec(query).all()

    return {
        "items": [UserRead.model_validate(u) for u in users],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@admin_users_router.get("/stats")
def user_stats(
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    total = session.exec(select(func.count()).select_from(User)).one()
    active = session.exec(
        select(func.count()).select_from(User).where(User.isActive == True)
    ).one()
    superadmins = session.exec(
        select(func.count()).select_from(User).where(User.role == "superadmin")
    ).one()
    admins = session.exec(
        select(func.count()).select_from(User).where(User.role == "admin")
    ).one()
    users = session.exec(
        select(func.count()).select_from(User).where(User.role == "user")
    ).one()

    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_last_30 = session.exec(
        select(func.count())
        .select_from(User)
        .where(User.store_id.is_not(None))
    ).one()

    return {
        "total": total,
        "active": active,
        "by_role": {"superadmin": superadmins, "admin": admins, "user": users},
        "new_last_30_days": new_last_30,
    }


@admin_users_router.get("/{email}", response_model=UserRead)
def get_user(
    email: str,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserRead.model_validate(user)


@admin_users_router.patch("/{email}", response_model=UserRead)
def update_user(
    email: str,
    update: UserAdminUpdate,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if admin.role != "superadmin" and update.role == "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmins can assign superadmin role",
        )

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    session.add(user)
    session.commit()
    session.refresh(user)
    return UserRead.model_validate(user)


@admin_users_router.delete("/{email}")
def deactivate_user(
    email: str,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session),
):
    if email == admin.email:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "superadmin" and admin.role != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmins can deactivate superadmin accounts",
        )

    user.isActive = False
    session.add(user)
    session.commit()
    return {"message": f"User {email} deactivated"}
