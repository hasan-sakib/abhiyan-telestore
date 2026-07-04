from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field
from app.models.order import OrderStatus


class ShippingAddress(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str = "Bangladesh"


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    shipping_address: ShippingAddress


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: float


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    status: OrderStatus
    total_amount: float
    shipping_address: Dict[str, Any]
    created_at: datetime
    items: List[OrderItemRead] = []


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderListResponse(BaseModel):
    items: List[OrderRead]
    total: int
    page: int
    page_size: int
