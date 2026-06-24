from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel, EmailStr, StringConstraints
from typing import Optional, Annotated, List
from . import GroupUserLink


class UserBase(SQLModel):
    email: EmailStr = Field(primary_key=True)
    full_name: Optional[Annotated[str, StringConstraints(min_length=6, max_length=64)]] = None
    store_id: str = ""

class UserLogin(SQLModel):
    email: EmailStr
    password: Annotated[str, StringConstraints(min_length=8, max_length=64)]

class User(UserBase, table=True):
    isActive: bool = False
    hashed_password: str = Field()
    items: List["Item"] = Relationship(back_populates='user')
    groups: List["Group"] = Relationship(back_populates='users', link_model=GroupUserLink)

class UserCreate(UserBase):
    password: Annotated[str, StringConstraints(min_length=8, max_length=64)]

class UserRead(UserBase):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(SQLModel):
    email: EmailStr

from .item import Item
from .group import Group
