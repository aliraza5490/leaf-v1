from sqlmodel import SQLModel, Field, Relationship
from pydantic import BaseModel, EmailStr, StringConstraints, field_validator
from typing import Optional, Annotated, List
from . import GroupUserLink


VALID_ROLES = ("superadmin", "admin", "user")


class UserBase(SQLModel):
    email: EmailStr = Field(primary_key=True)
    full_name: Optional[Annotated[str, StringConstraints(min_length=6, max_length=64)]] = None
    store_id: str = ""
    role: Annotated[str, StringConstraints(max_length=20)] = "user"

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in VALID_ROLES:
            raise ValueError(f"role must be one of {VALID_ROLES}")
        return v


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
    isActive: bool = False


class UserAdminUpdate(SQLModel):
    full_name: Optional[Annotated[str, StringConstraints(min_length=6, max_length=64)]] = None
    role: Optional[Annotated[str, StringConstraints(max_length=20)]] = None
    isActive: Optional[bool] = None

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_ROLES:
            raise ValueError(f"role must be one of {VALID_ROLES}")
        return v


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class ForgotPasswordRequest(SQLModel):
    email: EmailStr


from .item import Item
from .group import Group
