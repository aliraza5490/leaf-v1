from fastapi import APIRouter
from .users.controller import admin_users_router
from .stores.controller import admin_stores_router
from .analytics.controller import admin_analytics_router
from .settings.controller import admin_settings_router

admin_router = APIRouter(prefix="/admin")

admin_router.include_router(admin_users_router)
admin_router.include_router(admin_stores_router)
admin_router.include_router(admin_analytics_router)
admin_router.include_router(admin_settings_router)
