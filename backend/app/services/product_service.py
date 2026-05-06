from datetime import datetime, timezone
from typing import Optional
from fastapi import HTTPException
from sqlmodel import Session, select, func
from slugify import slugify
from app.models.product import Product, ProductImage, ProductStatus
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductListResponse


class ProductService:
    def __init__(self, db: Session):
        self.db = db

    def get_by_slug(self, slug: str) -> Product:
        product = self.db.exec(select(Product).where(Product.slug == slug)).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def get_by_id(self, product_id: int) -> Product:
        product = self.db.get(Product, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    def list_products(
        self,
        page: int,
        page_size: int,
        category_slug: Optional[str] = None,
        search: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        brand: Optional[str] = None,
        is_featured: Optional[bool] = None,
        status: Optional[str] = None,
    ) -> ProductListResponse:
        query = select(Product)

        if search:
            query = query.where(Product.name.ilike(f"%{search}%"))
        if category_slug:
            query = query.join(Category).where(Category.slug == category_slug)
        if min_price is not None:
            query = query.where(Product.price >= min_price)
        if max_price is not None:
            query = query.where(Product.price <= max_price)
        if brand:
            query = query.where(Product.brand == brand)
        if is_featured is not None:
            query = query.where(Product.is_featured == is_featured)
        if status:
            query = query.where(Product.status == status)

        count_query = select(func.count()).select_from(query.subquery())
        total = self.db.exec(count_query).one()
        items = self.db.exec(query.offset((page - 1) * page_size).limit(page_size)).all()

        return ProductListResponse(items=items, total=total, page=page, page_size=page_size)

    def create(self, payload: ProductCreate) -> Product:
        image_urls = payload.image_urls or []
        data = payload.model_dump(exclude={"image_urls"})
        data["slug"] = self._unique_slug(payload.name)
        product = Product(**data)
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        self._sync_images(product, image_urls)
        return product

    def update(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_by_id(product_id)
        image_urls = payload.image_urls
        data = payload.model_dump(exclude_unset=True, exclude={"image_urls"})
        if "name" in data:
            data["slug"] = self._unique_slug(data["name"], exclude_id=product_id)
        data["updated_at"] = datetime.now(timezone.utc)
        for key, value in data.items():
            setattr(product, key, value)
        self.db.commit()
        self.db.refresh(product)
        if image_urls is not None:
            self._sync_images(product, image_urls)
        return product

    def delete(self, product_id: int) -> None:
        product = self.get_by_id(product_id)
        self.db.delete(product)
        self.db.commit()

    def _sync_images(self, product: Product, urls: list[str]) -> None:
        existing = self.db.exec(
            select(ProductImage).where(ProductImage.product_id == product.id)
        ).all()
        for img in existing:
            self.db.delete(img)
        for i, url in enumerate(urls):
            img = ProductImage(
                product_id=product.id,
                url=url,
                is_primary=(i == 0),
                display_order=i,
            )
            self.db.add(img)
        self.db.commit()
        self.db.refresh(product)

    def _unique_slug(self, name: str, exclude_id: int | None = None) -> str:
        base = slugify(name)
        slug = base
        counter = 1
        while True:
            query = select(Product).where(Product.slug == slug)
            if exclude_id:
                query = query.where(Product.id != exclude_id)
            if not self.db.exec(query).first():
                return slug
            slug = f"{base}-{counter}"
            counter += 1
