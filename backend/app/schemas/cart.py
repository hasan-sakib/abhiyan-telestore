from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.product import ProductRead


class CartItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    quantity: int
    product: Optional[ProductRead] = None


class CartRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    items: List[CartItemRead] = []


class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int = 1
    session_id: Optional[str] = None


class UpdateCartItemRequest(BaseModel):
    quantity: int


class MergeCartRequest(BaseModel):
    session_id: str
