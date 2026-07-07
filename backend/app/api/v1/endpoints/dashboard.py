from typing import Annotated
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardMetricsResponse, DashboardChartDataResponse
from app.services.dashboard_service import DashboardService
from app.api.deps import require_investigator

router = APIRouter()

@router.get("/metrics", response_model=DashboardMetricsResponse)
async def get_dashboard_metrics(
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    service = DashboardService(db)
    return await service.get_metrics()
    
@router.get("/charts", response_model=DashboardChartDataResponse)
async def get_dashboard_charts(
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    service = DashboardService(db)
    return await service.get_chart_data()
