from fastapi import APIRouter, Depends, UploadFile, File
from app.dependencies.auth import require_admin
from app.services.upload_service import upload_image

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/image")
def upload_product_image(
    file: UploadFile = File(...),
    _=Depends(require_admin),
):
    url = upload_image(file)
    return {"url": url}
