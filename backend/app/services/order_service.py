from fastapi import HTTPException
from sqlmodel import Session, select, func
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product, ProductStatus
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

    def create_order(self, user: User, payload: OrderCreate) -> Order:
        if not payload.items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        products: dict[int, Product] = {}
        for item in payload.items:
            product = self.db.get(Product, item.product_id)
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            if item.quantity > product.stock_quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"'{product.name}' only has {product.stock_quantity} in stock",
                )
            products[item.product_id] = product

        total = sum(
            (products[item.product_id].discount_price or products[item.product_id].price) * item.quantity
            for item in payload.items
        )

        order = Order(
            user_id=user.id,
            total_amount=total,
            shipping_address=payload.shipping_address.model_dump(),
        )
        self.db.add(order)
        self.db.commit()
        self.db.refresh(order)

        for item in payload.items:
            product = products[item.product_id]
            order_item = OrderItem(
                order_id=order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                unit_price=product.discount_price or product.price,
            )
            self.db.add(order_item)
            product.stock_quantity -= item.quantity
            if product.stock_quantity == 0:
                product.status = ProductStatus.out_of_stock
            self.db.add(product)

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
        if not (user.is_superuser or user.is_admin) and order.user_id != user.id:
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
