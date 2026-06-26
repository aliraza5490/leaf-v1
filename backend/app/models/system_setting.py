from datetime import datetime
from typing import Optional
from pydantic import StringConstraints
from sqlmodel import SQLModel, Field
from typing_extensions import Annotated


class SystemSettingBase(SQLModel):
    key: Annotated[str, StringConstraints(max_length=100)] = Field(primary_key=True)
    value: str = ""
    description: str = ""


class SystemSetting(SystemSettingBase, table=True):
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class SystemSettingCreate(SystemSettingBase):
    pass


class SystemSettingUpdate(SQLModel):
    value: Optional[str] = None
    description: Optional[str] = None


class SystemSettingRead(SystemSettingBase):
    updated_at: datetime
