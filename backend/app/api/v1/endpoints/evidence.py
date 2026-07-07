import uuid
from typing import Annotated, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import KavachException, ValidationException, NotFoundException, ForbiddenException

from app.db.session import get_db
from app.models.user import User
from app.models.case import Evidence, CaseTimelineEvent
from app.schemas.case import EvidenceResponse
from app.services.storage_service import LocalStorageService
from app.repositories.evidence_repository import EvidenceRepository
from app.repositories.case_repository import CaseRepository
from app.api.deps import get_current_user
from app.core.exceptions import NotFoundException, ForbiddenException

router = APIRouter()

@router.post("/upload", response_model=EvidenceResponse)
async def upload_evidence(
    case_id: Annotated[uuid.UUID, Form()],
    file: Annotated[UploadFile, File()],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    case_repo = CaseRepository(db)
    evidence_repo = EvidenceRepository(db)
    storage = LocalStorageService()

    # 1. Verify case exists and user has access
    case = await case_repo.get_by_id(case_id)
    if not case:
        raise NotFoundException("Case not found")
        
    if current_user.role.value == "CITIZEN" and case.reporter_id != current_user.id:
        raise ForbiddenException("Not authorized to upload evidence to this case")

    # 2. Save file
    file_url = await storage.save_upload_file(file)
    evidence_type = storage.determine_evidence_type(file.content_type or "application/octet-stream")

    # 3. Create DB record
    evidence = Evidence(
        case_id=case_id,
        uploader_id=current_user.id,
        evidence_type=evidence_type,
        file_url=file_url,
        file_name=file.filename or "unknown",
        file_size_bytes=file.size or 0, # Note: size might be 0 here if not read, but StorageService seeks end
        mime_type=file.content_type or "application/octet-stream"
    )
    saved_evidence = await evidence_repo.create(evidence)

    # 4. Add timeline event
    event = CaseTimelineEvent(
        case_id=case_id,
        actor_id=current_user.id,
        event_type="EVIDENCE_ADDED",
        description=f"Uploaded {evidence_type.value} evidence: {file.filename}"
    )
    await case_repo.add_timeline_event(event)

    return saved_evidence

@router.get("/{evidence_id}/download")
async def download_evidence(
    evidence_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    evidence = await db.get(Evidence, evidence_id)
    if not evidence:
        raise NotFoundException("Evidence not found")
        
    case = await db.get(Case, evidence.case_id)
    if current_user.role.value == "CITIZEN" and case.reporter_id != current_user.id:
        raise ForbiddenException("Not authorized to download this evidence")
        
    storage = LocalStorageService()
    file_path = await storage.get_file_path(evidence.file_url)
    
    import os
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found on disk")
        
    return FileResponse(file_path, filename=evidence.file_name)
