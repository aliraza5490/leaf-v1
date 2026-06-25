from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ...utilities.db import get_session
from ...utilities.tags import Tags
from ...utilities.auth import get_user_from_token
from ...models.user import User

team_router = APIRouter(prefix="/team", tags=[Tags.users])


@team_router.get("/")
def list_team(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session),
):
    """List team members for the current user's store."""
    users = session.exec(
        select(User).where(User.store_id == user.store_id, User.isActive.is_(True))
    ).all()

    return {
        "team": [
            {
                "id": u.email,
                "name": u.full_name or u.email.split("@")[0],
                "email": u.email,
                "role": "agent",
            }
            for u in users
        ]
    }
