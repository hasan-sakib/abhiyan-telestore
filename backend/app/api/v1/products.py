from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session
from app.database import get_db
from app.dependencies.auth import require_admin
from app.schemas.product import ProductCreate, ProductRead, ProductUpdate, ProductListResponse
from app.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    category_slug: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    brand: Optional[str] = None,
    is_featured: Optional[bool] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return ProductService(db).list_products(
        page=page,
        page_size=page_size,
        category_slug=category_slug,
        search=search,
        min_price=min_price,
        max_price=max_price,
        brand=brand,
        is_featured=is_featured,
        status=status,
    )


@router.get("/{slug}", response_model=ProductRead)
def get_product(slug: str, db: Session = Depends(get_db)):
    return ProductService(db).get_by_slug(slug)


@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    return ProductService(db).create(payload)


@router.put("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    return ProductService(db).update(product_id, payload)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    ProductService(db).delete(product_id)
