from ...models.user import User, UserLogin, ForgotPasswordRequest
from fastapi import status, HTTPException
from sqlmodel import select, Session
from ...utilities.auth import get_password_hash, verify_password, create_access_token
from ...settings import settings
from datetime import timedelta


def register(user: UserLogin, session: Session):
    existing_user = session.exec(select(User).where(
        User.email == user.email
    )).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password),
        full_name=user.full_name,
        isActive=True
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {
        "id": new_user.id,
        "email": new_user.email,
        "full_name": new_user.full_name,
        "message": "User registered successfully"
    }


def protected(user: User):
    return {"message": "Protected route accessed", "user": user.model_dump(exclude="hashed_password")}


def login(user: UserLogin, session: Session):
    user_data = session.exec(select(User).where(
        User.email == user.email,
        User.isActive == True
    )).first()

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    does_pass_match = verify_password(user.password, user_data.hashed_password)
    if not does_pass_match:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


def forgot_password(data: ForgotPasswordRequest, session: Session):
    user = session.exec(select(User).where(User.email == data.email)).first()

    if not user:
        # Return a generic message to avoid email enumeration
        return {
            "message": "If an account with that email exists, password reset instructions have been sent."
        }

    # TODO: Generate a secure reset token, store it, and send an email via SMTP.
    # For now this endpoint returns a success message so the frontend flow can be wired up.
    return {
        "message": "If an account with that email exists, password reset instructions have been sent."
    }
