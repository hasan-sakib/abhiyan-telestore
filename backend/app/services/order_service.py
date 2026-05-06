from fastapi import HTTPException
from sqlmodel import Session, select, func
from app.models.order import Order, OrderItem, OrderStatus
from app.models.cart import Cart, CartItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderListResponse

VALID_TRANSITIONS: dict[str, list[str]] = {
    "pending":   ["confirmed", "cancelled"],
    "confirmed": ["shipped", "cancelled"],
    "shipped":   ["delivered"],
    "delivered": [],
    "cancelled": [],
}


class OrderService:
    def __init__(self, db: Session):
        self.db = db

    def create_from_cart(self, user: User, payload: OrderCreate) -> Order:
        cart = self.db.exec(select(Cart).where(Cart.user_id == user.id)).first()
        if not cart or not cart.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        total = sum(
            (item.product.discount_price or item.product.price) * item.quantity
            for item in cart.items
            if item.product
        )

        order = Order(
            user_id=user.id,
            total_amount=total,
            shipping_address=payload.shipping_address.model_dump(),
        )
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)

        for item in cart.items:
            if not item.product:
                continue
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=item.product.discount_price or item.product.price,
            )
            self.db.add(order_item)

        # Clear the cart after order
        for item in cart.items:
            self.db.delete(item)

        self.db.commit()
        self.db.refresh(order)
        return order

    def get_user_orders(self, user: User, page: int, page_size: int) -> OrderListResponse:
        query = select(Order).where(Order.user_id == user.id).order_by(Order.created_at.desc())
        total = self.db.exec(select(func.count()).select_from(query.subquery())).one()
        items = self.db.exec(query.offset((page - 1) * page_size).limit(page_size)).all()
        return OrderListResponse(items=items, total=total, page=page, page_size=page_size)

    def get_all_orders(self, page: int, page_size: int, status: str | None = None) -> OrderListResponse:
        query = select(Order).order_by(Order.created_at.desc())
        if status:
            query = query.where(Order.status == status)
        total = self.db.exec(select(func.count()).select_from(query.subquery())).one()
        items = self.db.exec(query.offset((page - 1) * page_size).limit(page_size)).all()
        return OrderListResponse(items=items, total=total, page=page, page_size=page_size)

    def get_order(self, order_id: int, user: User) -> Order:
        order = self.db.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        if not user.is_superuser and order.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        return order

    def update_status(self, order_id: int, new_status: str) -> Order:
        order = self.db.get(Order, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        allowed = VALID_TRANSITIONS.get(order.status.value, [])
        if new_status not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot transition from '{order.status.value}' to '{new_status}'",
            )
        order.status = OrderStatus(new_status)
        self.db.commit()
        self.db.refresh(order)
        return order

    def get_admin_stats(self) -> dict:
        total_products = self.db.exec(
            select(func.count()).select_from(__import__("app.models.product", fromlist=["Product"]).Product)
        ).one()
        total_orders = self.db.exec(select(func.count()).select_from(Order)).one()
        total_revenue = self.db.exec(select(func.sum(Order.total_amount))).one() or 0
        pending_orders = self.db.exec(
            select(func.count()).select_from(Order).where(Order.status == OrderStatus.pending)
        ).one()
        return {
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "pending_orders": pending_orders,
        }
