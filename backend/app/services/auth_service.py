from fastapi import HTTPException, status, BackgroundTasks
from sqlmodel import Session, select
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token,
    decode_token, create_password_reset_token, verify_password_reset_token,
)
from app.core.email import send_password_reset_email


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, payload: RegisterRequest) -> TokenResponse:
        existing = self.db.exec(select(User).where(User.email == payload.email)).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        user = User(
            email=payload.email,
            hashed_password=get_password_hash(payload.password),
            full_name=payload.full_name,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return self._build_tokens(user)

    def login(self, payload: LoginRequest) -> TokenResponse:
        user = self.db.exec(select(User).where(User.email == payload.email)).first()
        if not user or not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")
        return self._build_tokens(user)

    def refresh(self, refresh_token: str) -> TokenResponse:
        user_id = decode_token(refresh_token, "refresh")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        user = self.db.get(User, int(user_id))
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return self._build_tokens(user)

    def send_password_reset_email(self, email: str, background_tasks: BackgroundTasks) -> None:
        user = self.db.exec(select(User).where(User.email == email)).first()
        if not user:
            # Don't reveal whether email exists
            return
        token = create_password_reset_token(email)
        background_tasks.add_task(send_password_reset_email, email, token)

    def reset_password(self, token: str, new_password: str) -> None:
        email = verify_password_reset_token(token)
        if not email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
        user = self.db.exec(select(User).where(User.email == email)).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        user.hashed_password = get_password_hash(new_password)
        self.db.commit()

    def _build_tokens(self, user: User) -> TokenResponse:
        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )
