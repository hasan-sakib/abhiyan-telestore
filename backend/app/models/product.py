from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from enum import Enum
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy import JSON


class ProductStatus(str, Enum):
    in_stock = "in_stock"
    out_of_stock = "out_of_stock"
    upcoming = "upcoming"


class Product(SQLModel, table=True):
    __tablename__ = "products"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=255, index=True)
    slug: str = Field(unique=True, max_length=280, index=True)
    description: Optional[str] = None
    price: float = Field(gt=0)
    discount_price: Optional[float] = Field(default=None, gt=0)
    stock_quantity: int = Field(default=0, ge=0)
    status: ProductStatus = Field(default=ProductStatus.in_stock)
    is_featured: bool = Field(default=False)
    brand: Optional[str] = Field(default=None, max_length=100)
    model: Optional[str] = Field(default=None, max_length=100)
    specs: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    category_id: Optional[int] = Field(default=None, foreign_key="categories.id")

    category: Optional["Category"] = Relationship(back_populates="products")
    images: List["ProductImage"] = Relationship(back_populates="product")
    order_items: List["OrderItem"] = Relationship(back_populates="product")
    cart_items: List["CartItem"] = Relationship(back_populates="product")


class ProductImage(SQLModel, table=True):
    __tablename__ = "product_images"

    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="products.id", ondelete="CASCADE")
    url: str
    alt_text: Optional[str] = None
    is_primary: bool = Field(default=False)
    display_order: int = Field(default=0)

    product: Optional[Product] = Relationship(back_populates="images")
