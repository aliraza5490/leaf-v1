from datetime import datetime
from typing import Optional
from pydantic import StringConstraints
from sqlmodel import SQLModel, Field
from typing_extensions import Annotated


class SystemSettingBase(SQLModel):
    key: Annotated[str, StringConstraints(max_length=100)] = Field(unique=True, index=True)
    value: str = ""
    description: str = ""


class SystemSetting(SystemSettingBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SystemSettingCreate(SystemSettingBase):
    pass


class SystemSettingUpdate(SQLModel):
    value: Optional[str] = None
    description: Optional[str] = None


class SystemSettingRead(SystemSettingBase):
    id: int
    updated_at: datetime
