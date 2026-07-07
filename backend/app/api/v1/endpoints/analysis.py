from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.analysis import AnalysisRequest, AnalysisResultResponse
from app.services.analysis_service import AnalysisService
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResultResponse)
async def analyze_fraud_text(
    request: AnalysisRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    """
    Simulates the AI risk engine. Processes suspicious text and returns a deterministic risk score,
    scam classification, and recommended actions.
    """
    service = AnalysisService(db)
    return await service.analyze_text(request)
