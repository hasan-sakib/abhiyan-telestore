from fastapi import HTTPException, status
from sqlmodel import Session, select
from app.models.user import User
from app.schemas.user import UserUpdate, ChangePasswordRequest
from app.core.security import verify_password, get_password_hash


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def update(self, user: User, payload: UserUpdate) -> User:
        if payload.email and payload.email != user.email:
            existing = self.db.exec(select(User).where(User.email == payload.email)).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already in use")
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def change_password(self, user: User, payload: ChangePasswordRequest) -> None:
        if not verify_password(payload.current_password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wrong current password")
        user.hashed_password = get_password_hash(payload.new_password)
        self.db.commit()
