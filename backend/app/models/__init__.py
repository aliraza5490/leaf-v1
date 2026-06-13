from pydantic import EmailStr
from sqlmodel import SQLModel, Field


class GroupUserLink(SQLModel, table=True):
    group_id: int | None = Field(default=None, foreign_key="group.id", primary_key=True)
    user_id: EmailStr = Field(foreign_key="user.email", primary_key=True)
