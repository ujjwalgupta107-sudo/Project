import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.models.case import ScamType, CaseStatus, RiskLevel, EvidenceType
from app.schemas.audit import InvestigatorNoteResponse
from app.schemas.analysis import AnalysisResultResponse
from app.schemas.entity import EntityResponse

class EvidenceBase(BaseModel):
    evidence_type: EvidenceType
    file_url: str
    file_name: str
    file_size_bytes: int
    mime_type: str

class EvidenceCreate(EvidenceBase):
    pass

class EvidenceResponse(EvidenceBase):
    id: uuid.UUID
    case_id: uuid.UUID
    uploader_id: uuid.UUID
    is_processed: bool
    processing_error: Optional[str] = None
    extracted_text: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CaseTimelineEventResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    actor_id: Optional[uuid.UUID] = None
    event_type: str
    description: str
    event_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CaseBase(BaseModel):
    scam_type: ScamType
    description: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    city: Optional[str] = None

class CaseCreate(CaseBase):
    scam_type: Optional[ScamType] = ScamType.OTHER

class CaseUpdate(BaseModel):
    status: Optional[CaseStatus] = None
    risk_score: Optional[float] = None
    risk_level: Optional[RiskLevel] = None
    cluster_id: Optional[uuid.UUID] = None

class CaseResponse(CaseBase):
    id: uuid.UUID
    reporter_id: uuid.UUID
    status: CaseStatus
    risk_score: float
    risk_level: RiskLevel
    cluster_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PaginatedCaseResponse(BaseModel):
    items: List[CaseResponse]
    total: int

class CaseDetailResponse(CaseResponse):
    evidence: List[EvidenceResponse] = []
    timeline: List[CaseTimelineEventResponse] = []
    notes: List[InvestigatorNoteResponse] = []

class CaseIntelligenceResponse(BaseModel):
    case: CaseDetailResponse
    analysis: Optional[AnalysisResultResponse] = None
    entities: List[EntityResponse] = []
