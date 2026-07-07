import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.alert import AlertType, AlertSeverity

class AlertBase(BaseModel):
    alert_type: AlertType
    severity: AlertSeverity
    title: str
    description: str
    case_id: Optional[uuid.UUID] = None
    entity_id: Optional[uuid.UUID] = None
    cluster_id: Optional[uuid.UUID] = None

class AlertResponse(AlertBase):
    id: uuid.UUID
    is_acknowledged: bool
    acknowledged_by: Optional[uuid.UUID] = None
    acknowledged_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AlertAcknowledgeRequest(BaseModel):
    is_acknowledged: bool = True
