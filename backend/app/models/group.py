from pydantic import EmailStr
from sqlmodel import SQLModel
from typing import Optional, List
from sqlmodel import Relationship, Field
from . import GroupUserLink

class GroupBase(SQLModel):
    name: str
    description: Optional[str] = None


class GroupInvite(SQLModel):
    email: EmailStr
    message: Optional[str] = None


class Group(GroupBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    admin: EmailStr = Field(foreign_key="user.email")
    users: List["User"] = Relationship(back_populates='groups', link_model=GroupUserLink)


from .user import User
