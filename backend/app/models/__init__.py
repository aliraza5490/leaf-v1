from pydantic import EmailStr
from sqlmodel import SQLModel, Field


class GroupUserLink(SQLModel, table=True):
    group_id: int | None = Field(default=None, foreign_key="group.id", primary_key=True)
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)


from .product import Product, ProductBase, ProductCreate, ProductUpdate, ProductRead
from .conversation import Conversation, ChatMessage
from .store import Store, StoreBase, StoreUpdate, StoreRead
from .system_setting import SystemSetting, SystemSettingBase, SystemSettingCreate, SystemSettingUpdate, SystemSettingRead

