from fastapi import APIRouter
from app.api.v1 import auth, users, categories, products, cart, orders, upload, admin

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(cart.router)
api_router.include_router(orders.router)
api_router.include_router(upload.router)
api_router.include_router(admin.router)
