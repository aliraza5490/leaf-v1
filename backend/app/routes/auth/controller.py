from fastapi import APIRouter, Depends
from .service import register as auth_register, login as auth_login, protected as auth_protected, forgot_password as auth_forgot_password
from ...utilities.tags import Tags
from ...models.user import User, UserLogin, UserCreate, ForgotPasswordRequest
from ...utilities.auth import get_user_from_token
from ...utilities.db import get_session

auth_router = APIRouter(prefix="/auth", tags=[Tags.users])


@auth_router.post("/register")
def register(user: UserCreate, session = Depends(get_session)):
    return auth_register(user, session)


@auth_router.post("/protected")
def protected(user: User = Depends(get_user_from_token)):
    return auth_protected(user)

@auth_router.post("/login")
def login(user: UserLogin, session = Depends(get_session)):
    return auth_login(user, session)


@auth_router.get("/me")
def me(user: User = Depends(get_user_from_token)):
    return {
        "email": user.email,
        "full_name": user.full_name,
        "store_id": user.store_id,
        "role": user.role,
        "isActive": user.isActive,
    }


@auth_router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, session = Depends(get_session)):
    return auth_forgot_password(data, session)

