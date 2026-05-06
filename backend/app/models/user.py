from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str
    full_name: str = Field(max_length=255)
    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)
    is_superuser: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    orders: List["Order"] = Relationship(back_populates="user")
    carts: List["Cart"] = Relationship(back_populates="user")
