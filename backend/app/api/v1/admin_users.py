from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session, select, func, or_
from app.database import get_db
from app.dependencies.auth import require_admin, require_superuser
from app.models.user import User
from app.core.security import get_password_hash
from app.schemas.admin_user import (
    AdminUserRead, AdminUserCreate, AdminUserUpdate, AdminUserList,
)

router = APIRouter(prefix="/admin/users", tags=["admin-users"])


@router.get("", response_model=AdminUserList)
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = select(User).order_by(User.created_at.desc())
    if search:
        like = f"%{search}%"
        query = query.where(or_(User.email.ilike(like), User.full_name.ilike(like)))
    total = db.exec(select(func.count()).select_from(query.subquery())).one()
    items = db.exec(query.offset((page - 1) * page_size).limit(page_size)).all()
    return AdminUserList(items=items, total=total, page=page, page_size=page_size)


@router.post("", response_model=AdminUserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: AdminUserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_superuser),
):
    if db.exec(select(User).where(User.email == payload.email)).first():
        raise HTTPException(status_code=400, detail="Email already in use")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        is_admin=payload.is_admin,
        is_superuser=payload.is_superuser,
        is_active=payload.is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}", response_model=AdminUserRead)
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    db: Session = Depends(get_db),
    current: User = Depends(require_superuser),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"] != user.email:
        if db.exec(select(User).where(User.email == data["email"])).first():
            raise HTTPException(status_code=400, detail="Email already in use")
    if "is_superuser" in data and user.id == current.id and data["is_superuser"] is False:
        raise HTTPException(status_code=400, detail="You cannot demote yourself")
    if "is_active" in data and user.id == current.id and data["is_active"] is False:
        raise HTTPException(status_code=400, detail="You cannot deactivate yourself")
    if "password" in data and data["password"]:
        user.hashed_password = get_password_hash(data.pop("password"))
    elif "password" in data:
        data.pop("password")
    for k, v in data.items():
        setattr(user, k, v)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current: User = Depends(require_superuser),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current.id:
        raise HTTPException(status_code=400, detail="You cannot delete yourself")
    db.delete(user)
    db.commit()
