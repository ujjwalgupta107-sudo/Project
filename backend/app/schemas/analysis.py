import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.models.case import ScamType, RiskLevel

class RedFlagResponse(BaseModel):
    id: uuid.UUID
    description: str

    model_config = ConfigDict(from_attributes=True)

class RecommendedActionResponse(BaseModel):
    id: uuid.UUID
    action: str

    model_config = ConfigDict(from_attributes=True)

class AnalysisResultResponse(BaseModel):
    id: uuid.UUID
    evidence_id: Optional[uuid.UUID] = None
    case_id: Optional[uuid.UUID] = None
    risk_score: float
    risk_level: RiskLevel
    predicted_type: ScamType
    confidence: float
    
    red_flags: List[RedFlagResponse] = []
    recommended_actions: List[RecommendedActionResponse] = []

    model_config = ConfigDict(from_attributes=True)

class AnalysisRequest(BaseModel):
    text: str
    case_id: Optional[uuid.UUID] = None
