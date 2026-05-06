from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100, index=True)
    slug: str = Field(unique=True, max_length=120, index=True)
    description: Optional[str] = None
    image_url: Optional[str] = None
    parent_id: Optional[int] = Field(default=None, foreign_key="categories.id")

    products: List["Product"] = Relationship(back_populates="category")
