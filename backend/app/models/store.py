from datetime import datetime
from typing import Optional
from pydantic import StringConstraints
from sqlmodel import SQLModel, Field
from typing_extensions import Annotated


VALID_STORE_STATUSES = ("active", "suspended", "trial")
VALID_PLANS = ("free", "starter", "pro", "enterprise")


class StoreBase(SQLModel):
    name: Annotated[str, StringConstraints(min_length=1, max_length=200)]
    owner_email: Optional[str] = Field(default=None, foreign_key="user.email")
    status: Annotated[str, StringConstraints(max_length=20)] = "active"
    plan: Annotated[str, StringConstraints(max_length=20)] = "free"


class Store(StoreBase, table=True):
    id: str = Field(primary_key=True, max_length=64)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class StoreUpdate(SQLModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=200)]] = None
    status: Optional[Annotated[str, StringConstraints(max_length=20)]] = None
    plan: Optional[Annotated[str, StringConstraints(max_length=20)]] = None


class StoreRead(StoreBase):
    id: str
    created_at: datetime
    updated_at: datetime
