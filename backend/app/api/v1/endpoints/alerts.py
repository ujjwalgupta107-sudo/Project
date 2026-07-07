import uuid
from typing import Annotated, List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.alert import AlertResponse, AlertAcknowledgeRequest
from app.services.alert_service import AlertService
from app.api.deps import require_investigator

router = APIRouter()

@router.get("/", response_model=List[AlertResponse])
async def list_alerts(
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: int = 50,
    acknowledged: Optional[bool] = None
):
    service = AlertService(db)
    return await service.get_alerts(limit=limit, acknowledged=acknowledged)

@router.post("/{alert_id}/acknowledge", response_model=AlertResponse)
async def acknowledge_alert(
    alert_id: uuid.UUID,
    request: AlertAcknowledgeRequest,
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    service = AlertService(db)
    alert = await service.acknowledge_alert(alert_id, current_user.id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert
