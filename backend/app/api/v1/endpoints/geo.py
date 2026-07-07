from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.geo import GeoHotspotResponse
from app.services.geo_service import GeoService
from app.api.deps import require_investigator

router = APIRouter()

@router.get("/hotspots", response_model=List[GeoHotspotResponse])
async def get_geo_hotspots(
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    service = GeoService(db)
    return await service.get_hotspots()
