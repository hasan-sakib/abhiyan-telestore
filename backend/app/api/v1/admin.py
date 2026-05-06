from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.database import get_db
from app.dependencies.auth import require_admin
from app.services.order_service import OrderService

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    return OrderService(db).get_admin_stats()
