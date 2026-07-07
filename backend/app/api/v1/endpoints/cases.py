import uuid
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.models.case import CaseStatus, ScamType
from app.schemas.case import CaseCreate, CaseDetailResponse, CaseResponse, CaseUpdate, EvidenceResponse, CaseTimelineEventResponse, PaginatedCaseResponse
from app.services.case_service import CaseService
from app.api.deps import get_current_user, require_investigator
from app.repositories.case_repository import CaseRepository

router = APIRouter()

@router.post("/", response_model=CaseDetailResponse)
async def create_case(
    case_in: CaseCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Citizen creates a new fraud report case."""
    service = CaseService(db)
    return await service.create_case(case_in, current_user)

@router.get("/me", response_model=PaginatedCaseResponse)
async def list_my_cases(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = 0,
    limit: int = 100,
):
    """List cases submitted by the current citizen."""
    repo = CaseRepository(db)
    cases, total = await repo.get_multi_by_reporter(reporter_id=current_user.id, skip=skip, limit=limit)
    return PaginatedCaseResponse(items=cases, total=total)

@router.get("/", response_model=PaginatedCaseResponse)
async def list_cases(
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: int = 0,
    limit: int = 100,
    status: Optional[CaseStatus] = None,
    scam_type: Optional[ScamType] = None
):
    repo = CaseRepository(db)
    cases, total = await repo.get_multi(skip=skip, limit=limit, status=status, scam_type=scam_type)
    return PaginatedCaseResponse(items=cases, total=total)

@router.get("/{case_id}", response_model=CaseDetailResponse)
async def get_case(
    case_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Get a specific case by ID."""
    service = CaseService(db)
    return await service.get_case(case_id, current_user)

@router.put("/{case_id}/status", response_model=CaseDetailResponse)
async def update_status(
    case_id: uuid.UUID,
    status: CaseStatus,
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Investigator updates case status."""
    service = CaseService(db)
    return await service.update_case_status(case_id, status, current_user)

from app.schemas.case import CaseIntelligenceResponse

@router.get("/{case_id}/intelligence", response_model=CaseIntelligenceResponse)
async def get_case_intelligence(
    case_id: uuid.UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """Get full case intelligence including analysis and entities."""
    service = CaseService(db)
    return await service.get_case_intelligence(case_id, current_user)
