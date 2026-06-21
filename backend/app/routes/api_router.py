from fastapi import APIRouter
from .item.controller import items_router 
from .auth.controller import auth_router
from .group.controller import group_router
from .product.controller import products_router
from .chat.controller import chat_router
from .voice.controller import voice_router
from ..settings import settings

api_router = APIRouter(prefix=settings.API_V1_STR)

api_router.include_router(auth_router)
api_router.include_router(items_router)
api_router.include_router(group_router)
api_router.include_router(products_router)
api_router.include_router(chat_router)
api_router.include_router(voice_router)