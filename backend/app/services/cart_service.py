from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session, select
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.user import User


class CartService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_user_cart(self, user_id: int) -> Cart:
        cart = self.db.exec(select(Cart).where(Cart.user_id == user_id)).first()
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)
        return cart

    def get_or_create_guest_cart(self, session_id: str) -> Cart:
        cart = self.db.exec(select(Cart).where(Cart.session_id == session_id)).first()
        if not cart:
            cart = Cart(session_id=session_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)
        return cart

    def get_cart(self, user: Optional[User], session_id: Optional[str]) -> Cart:
        if user:
            return self.get_or_create_user_cart(user.id)
        if session_id:
            return self.get_or_create_guest_cart(session_id)
        raise HTTPException(status_code=400, detail="Provide session_id for guest cart")

    def add_item(self, cart: Cart, product_id: int, quantity: int) -> Cart:
        product = self.db.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        existing = self.db.exec(
            select(CartItem).where(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
        ).first()

        if existing:
            existing.quantity += quantity
        else:
            item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
            self.db.add(item)

        self.db.commit()
        self.db.refresh(cart)
        return cart

    def update_item(self, cart: Cart, item_id: int, quantity: int) -> Cart:
        item = self.db.exec(
            select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
        ).first()
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        item.quantity = quantity
        self.db.commit()
        self.db.refresh(cart)
        return cart

    def remove_item(self, cart: Cart, item_id: int) -> Cart:
        item = self.db.exec(
            select(CartItem).where(CartItem.id == item_id, CartItem.cart_id == cart.id)
        ).first()
        if not item:
            raise HTTPException(status_code=404, detail="Cart item not found")
        self.db.delete(item)
        self.db.commit()
        self.db.refresh(cart)
        return cart

    def clear_cart(self, cart: Cart) -> Cart:
        for item in cart.items:
            self.db.delete(item)
        self.db.commit()
        self.db.refresh(cart)
        return cart

    def merge_guest_cart(self, user: User, session_id: str) -> Cart:
        user_cart = self.get_or_create_user_cart(user.id)
        guest_cart = self.db.exec(select(Cart).where(Cart.session_id == session_id)).first()

        if not guest_cart:
            return user_cart

        for guest_item in guest_cart.items:
            existing = self.db.exec(
                select(CartItem).where(
                    CartItem.cart_id == user_cart.id,
                    CartItem.product_id == guest_item.product_id,
                )
            ).first()
            if existing:
                existing.quantity += guest_item.quantity
            else:
                new_item = CartItem(
                    cart_id=user_cart.id,
                    product_id=guest_item.product_id,
                    quantity=guest_item.quantity,
                )
                self.db.add(new_item)

        self.db.delete(guest_cart)
        self.db.commit()
        self.db.refresh(user_cart)
        return user_cart
