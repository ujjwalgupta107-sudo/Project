import os
import shutil
import uuid
from pathlib import Path
from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import ValidationException
from app.models.case import EvidenceType

from abc import ABC, abstractmethod

class StorageService(ABC):
    @abstractmethod
    async def save_upload_file(self, file: UploadFile) -> str:
        pass
        
    @abstractmethod
    async def get_file_path(self, file_url: str) -> str:
        pass
        
    def determine_evidence_type(self, mime_type: str) -> EvidenceType:
        if mime_type.startswith("image/"):
            return EvidenceType.IMAGE
        elif mime_type.startswith("audio/"):
            return EvidenceType.AUDIO
        elif mime_type.startswith("text/"):
            return EvidenceType.TEXT
        else:
            return EvidenceType.DOCUMENT

class LocalStorageService(StorageService):
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIRECTORY)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.max_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    async def save_upload_file(self, file: UploadFile) -> str:
        """
        Saves a FastAPI UploadFile to the local filesystem and returns the relative URL path.
        In production, this would be swapped out for an S3/Azure Blob Storage implementation.
        """
        # Read a chunk to get size (FastAPI doesn't always provide it reliably)
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > self.max_size:
            raise ValidationException(f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_MB}MB")

        # Generate unique filename
        ext = os.path.splitext(file.filename)[1] if file.filename else ""
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        
        file_path = self.upload_dir / unique_filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Return the public URL path
        return f"/uploads/{unique_filename}"
        
    async def get_file_path(self, file_url: str) -> str:
        # Extract filename from url
        filename = file_url.split("/")[-1]
        return str(self.upload_dir / filename)
