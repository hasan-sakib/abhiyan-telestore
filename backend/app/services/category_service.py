from typing import List
from fastapi import HTTPException
from sqlmodel import Session, select
from slugify import slugify
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: Session):
        self.db = db

    def list_all(self) -> List[Category]:
        return self.db.exec(select(Category)).all()

    def get_by_id(self, category_id: int) -> Category:
        cat = self.db.get(Category, category_id)
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        return cat

    def get_by_slug(self, slug: str) -> Category:
        cat = self.db.exec(select(Category).where(Category.slug == slug)).first()
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")
        return cat

    def create(self, payload: CategoryCreate) -> Category:
        slug = self._unique_slug(payload.name)
        category = Category(**payload.model_dump(), slug=slug)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update(self, category_id: int, payload: CategoryUpdate) -> Category:
        cat = self.get_by_id(category_id)
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(cat, key, value)
        if payload.name:
            cat.slug = self._unique_slug(payload.name, exclude_id=category_id)
        self.db.commit()
        self.db.refresh(cat)
        return cat

    def delete(self, category_id: int) -> None:
        cat = self.get_by_id(category_id)
        self.db.delete(cat)
        self.db.commit()

    def _unique_slug(self, name: str, exclude_id: int | None = None) -> str:
        base = slugify(name)
        slug = base
        counter = 1
        while True:
            query = select(Category).where(Category.slug == slug)
            if exclude_id:
                query = query.where(Category.id != exclude_id)
            existing = self.db.exec(query).first()
            if not existing:
                return slug
            slug = f"{base}-{counter}"
            counter += 1
