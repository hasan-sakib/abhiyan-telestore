from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.models.product import ProductStatus


class ProductImageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    alt_text: Optional[str] = None
    is_primary: bool
    display_order: int


class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    stock_quantity: int = 0
    status: ProductStatus = ProductStatus.in_stock
    is_featured: bool = False
    brand: Optional[str] = None
    model: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None
    category_id: Optional[int] = None
    image_urls: Optional[List[str]] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    status: Optional[ProductStatus] = None
    is_featured: Optional[bool] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None
    category_id: Optional[int] = None
    image_urls: Optional[List[str]] = None


class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    stock_quantity: int
    status: ProductStatus
    is_featured: bool
    brand: Optional[str] = None
    model: Optional[str] = None
    specs: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    category_id: Optional[int] = None
    images: List[ProductImageRead] = []


class ProductListResponse(BaseModel):
    items: List[ProductRead]
    total: int
    page: int
    page_size: int
