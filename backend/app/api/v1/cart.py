from typing import Optional
from fastapi import APIRouter, Depends, Header
from sqlmodel import Session
from app.database import get_db
from app.dependencies.auth import get_current_user, optional_user
from app.models.user import User
from app.schemas.cart import CartRead, AddToCartRequest, UpdateCartItemRequest, MergeCartRequest
from app.services.cart_service import CartService

router = APIRouter(prefix="/cart", tags=["cart"])


def _session_id_header(x_session_id: Optional[str] = Header(default=None)) -> Optional[str]:
    return x_session_id


@router.get("/", response_model=CartRead)
def get_cart(
    user: Optional[User] = Depends(optional_user),
    session_id: Optional[str] = Depends(_session_id_header),
    db: Session = Depends(get_db),
):
    cart = CartService(db).get_cart(user, session_id)
    return cart


@router.post("/items", response_model=CartRead)
def add_item(
    payload: AddToCartRequest,
    user: Optional[User] = Depends(optional_user),
    session_id: Optional[str] = Depends(_session_id_header),
    db: Session = Depends(get_db),
):
    effective_session = payload.session_id or session_id
    cart = CartService(db).get_cart(user, effective_session)
    return CartService(db).add_item(cart, payload.product_id, payload.quantity)


@router.patch("/items/{item_id}", response_model=CartRead)
def update_item(
    item_id: int,
    payload: UpdateCartItemRequest,
    user: Optional[User] = Depends(optional_user),
    session_id: Optional[str] = Depends(_session_id_header),
    db: Session = Depends(get_db),
):
    cart = CartService(db).get_cart(user, session_id)
    return CartService(db).update_item(cart, item_id, payload.quantity)


@router.delete("/items/{item_id}", response_model=CartRead)
def remove_item(
    item_id: int,
    user: Optional[User] = Depends(optional_user),
    session_id: Optional[str] = Depends(_session_id_header),
    db: Session = Depends(get_db),
):
    cart = CartService(db).get_cart(user, session_id)
    return CartService(db).remove_item(cart, item_id)


@router.delete("/", response_model=CartRead)
def clear_cart(
    user: Optional[User] = Depends(optional_user),
    session_id: Optional[str] = Depends(_session_id_header),
    db: Session = Depends(get_db),
):
    cart = CartService(db).get_cart(user, session_id)
    return CartService(db).clear_cart(cart)


@router.post("/merge", response_model=CartRead)
def merge_cart(
    payload: MergeCartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return CartService(db).merge_guest_cart(current_user, payload.session_id)
