from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime

from ....utilities.db import get_session
from ....utilities.tags import Tags
from ....utilities.auth import require_superuser
from ....models.user import User
from ....models.system_setting import (
    SystemSetting,
    SystemSettingCreate,
    SystemSettingUpdate,
    SystemSettingRead,
)

admin_settings_router = APIRouter(prefix="/settings", tags=[Tags.admin])


@admin_settings_router.get("/", response_model=List[SystemSettingRead])
def list_settings(
    admin: User = Depends(require_superuser),
    session: Session = Depends(get_session),
):
    settings = session.exec(select(SystemSetting).order_by(SystemSetting.key)).all()
    return [SystemSettingRead.model_validate(s) for s in settings]


@admin_settings_router.post("/", response_model=SystemSettingRead)
def create_setting(
    data: SystemSettingCreate,
    admin: User = Depends(require_superuser),
    session: Session = Depends(get_session),
):
    existing = session.exec(
        select(SystemSetting).where(SystemSetting.key == data.key)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Setting already exists")

    setting = SystemSetting(**data.model_dump())
    session.add(setting)
    session.commit()
    session.refresh(setting)
    return SystemSettingRead.model_validate(setting)


@admin_settings_router.put("/{key}", response_model=SystemSettingRead)
def update_setting(
    key: str,
    update: SystemSettingUpdate,
    admin: User = Depends(require_superuser),
    session: Session = Depends(get_session),
):
    setting = session.exec(
        select(SystemSetting).where(SystemSetting.key == key)
    ).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")

    update_data = update.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(setting, k, v)
    setting.updated_at = datetime.utcnow()

    session.add(setting)
    session.commit()
    session.refresh(setting)
    return SystemSettingRead.model_validate(setting)


@admin_settings_router.delete("/{key}")
def delete_setting(
    key: str,
    admin: User = Depends(require_superuser),
    session: Session = Depends(get_session),
):
    setting = session.exec(
        select(SystemSetting).where(SystemSetting.key == key)
    ).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")

    session.delete(setting)
    session.commit()
    return {"message": f"Setting '{key}' deleted"}
