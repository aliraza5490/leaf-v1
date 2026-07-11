import secrets
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
    client_token: Optional[str] = Field(default_factory=lambda: secrets.token_hex(32), max_length=128)
    allowed_origins: Optional[str] = Field(default="*", max_length=512)


class Store(StoreBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)



class StoreUpdate(SQLModel):
    name: Optional[Annotated[str, StringConstraints(min_length=1, max_length=200)]] = None
    status: Optional[Annotated[str, StringConstraints(max_length=20)]] = None
    plan: Optional[Annotated[str, StringConstraints(max_length=20)]] = None


class StoreRead(StoreBase):
    id: int
    created_at: datetime
    updated_at: datetime
