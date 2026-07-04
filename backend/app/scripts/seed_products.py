"""Seed the 7 storefront categories with sample products and images.

Usage:
    python -m app.scripts.seed_products
"""
import sys
from sqlmodel import Session, select
from app.database import engine, create_db_and_tables
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryCreate
from app.schemas.product import ProductCreate
from app.services.category_service import CategoryService
from app.services.product_service import ProductService

IMG = "https://images.unsplash.com/photo-{}?w=1200&q=80"

CATALOG = {
    "Smartphones": [
        dict(name="Apple iPhone 15 Pro", brand="Apple", price=149999, stock_quantity=15,
             image=IMG.format("1511707171634-5f897ff02aa9"), is_featured=True),
        dict(name="Apple iPhone 14", brand="Apple", price=89999, stock_quantity=20,
             image=IMG.format("1592750475338-74b7b21085ab")),
        dict(name="Samsung Galaxy S24 Ultra", brand="Samsung", price=134999, stock_quantity=12,
             image=IMG.format("1580910051074-3eb694886505")),
        dict(name="Xiaomi 14 Pro", brand="Xiaomi", price=69999, stock_quantity=25,
             image=IMG.format("1567581935884-3349723552ca")),
        dict(name="Google Pixel 8", brand="Google", price=79999, stock_quantity=18,
             image=IMG.format("1546435770-a3e426bf472b")),
    ],
    "Laptops": [
        dict(name="Apple MacBook Air M3", brand="Apple", price=149999, stock_quantity=10,
             image=IMG.format("1517336714731-489689fd1ca8"), is_featured=True),
        dict(name="Apple MacBook Pro 14", brand="Apple", price=219999, stock_quantity=8,
             image=IMG.format("1531297484001-80022131f5a1")),
        dict(name="Asus ZenBook 14", brand="Asus", price=99999, stock_quantity=15,
             image=IMG.format("1496181133206-80ce9b88a853")),
    ],
    "Tablets": [
        dict(name="Apple iPad Pro 12.9\"", brand="Apple", price=119999, stock_quantity=10,
             image=IMG.format("1544244015-0df4b3ffc6b0"), is_featured=True),
        dict(name="Apple iPad Air", brand="Apple", price=74999, stock_quantity=20,
             image=IMG.format("1561154464-82e9adf32764")),
        dict(name="Samsung Galaxy Tab S9", brand="Samsung", price=89999, stock_quantity=12,
             image=IMG.format("1585790050230-5dd28404ccb9")),
        dict(name="Apple iPad Mini", brand="Apple", price=59999, stock_quantity=15,
             image=IMG.format("1587033411391-5d9e51cce126")),
    ],
    "Smart Watch": [
        dict(name="Apple Watch Series 9", brand="Apple", price=39999, stock_quantity=20,
             image=IMG.format("1523275335684-37898b6baf30"), is_featured=True),
        dict(name="Apple Watch SE", brand="Apple", price=24999, stock_quantity=25,
             image=IMG.format("1434493789847-2f02dc6ca35d")),
    ],
    "Audio": [
        dict(name="Sony WH-1000XM5", brand="Sony", price=34999, stock_quantity=15,
             image=IMG.format("1505740420928-5e560c06d30e"), is_featured=True),
        dict(name="Sony WH-CH720N", brand="Sony", price=12999, stock_quantity=20,
             image=IMG.format("1546868871-7041f2a55e12")),
        dict(name="JBL Flip 6", brand="JBL", price=13999, stock_quantity=18,
             image=IMG.format("1608043152269-423dbba4e7e1")),
        dict(name="Apple AirPods Pro 2", brand="Apple", price=27999, stock_quantity=22,
             image=IMG.format("1592921870789-04563d55041c")),
    ],
    "Accessories": [
        dict(name="Logitech MX Keys Combo", brand="Logitech", price=8999, stock_quantity=30,
             image=IMG.format("1550009158-9ebf69173e03"), is_featured=True),
        dict(name="Apple 67W USB-C Charger", brand="Apple", price=4999, stock_quantity=40,
             image=IMG.format("1583863788434-e58a36330cf0")),
    ],
    "Cameras": [
        dict(name="Canon EOS Rebel T7", brand="Canon", price=54999, stock_quantity=10,
             image=IMG.format("1502920917128-1aa500764cbd"), is_featured=True),
        dict(name="Fujifilm X100 Classic", brand="Fujifilm", price=89999, stock_quantity=6,
             image=IMG.format("1516724562728-afc824a36e84")),
        dict(name="Canon AE-1 Vintage Kit", brand="Canon", price=45999, stock_quantity=8,
             image=IMG.format("1519638831568-d9897f54ed69")),
    ],
}


def main() -> int:
    create_db_and_tables()

    with Session(engine) as db:
        category_service = CategoryService(db)
        product_service = ProductService(db)

        for category_name, products in CATALOG.items():
            category = db.exec(select(Category).where(Category.name == category_name)).first()
            if not category:
                category = category_service.create(CategoryCreate(name=category_name))
                print(f"Created category '{category_name}'.")

            for item in products:
                existing = db.exec(
                    select(Product).where(Product.name == item["name"])
                ).first()
                if existing:
                    print(f"Skipping existing product '{item['name']}'.")
                    continue

                product_service.create(ProductCreate(
                    name=item["name"],
                    brand=item["brand"],
                    price=item["price"],
                    stock_quantity=item["stock_quantity"],
                    is_featured=item.get("is_featured", False),
                    category_id=category.id,
                    image_urls=[item["image"]],
                ))
                print(f"Created product '{item['name']}' in '{category_name}'.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
