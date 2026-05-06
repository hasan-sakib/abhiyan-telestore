import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile
from app.config import settings


def configure_cloudinary() -> None:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )


def upload_image(file: UploadFile) -> str:
    configure_cloudinary()
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    result = cloudinary.uploader.upload(
        file.file,
        folder="abiyan-telestore/products",
        transformation=[{"width": 1200, "height": 1200, "crop": "limit"}],
    )
    return result["secure_url"]
