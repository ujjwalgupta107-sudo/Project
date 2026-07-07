import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.models.entity import EntityType

class EntityBase(BaseModel):
    type: EntityType
    value: str

class EntityCreate(EntityBase):
    pass

class EntityResponse(EntityBase):
    id: uuid.UUID
    masked_value: Optional[str] = None
    risk_score: float
    cluster_id: Optional[uuid.UUID] = None
    first_seen: datetime
    last_seen: datetime

    model_config = ConfigDict(from_attributes=True)

class GraphNode(BaseModel):
    data: Dict[str, Any]

class GraphEdge(BaseModel):
    data: Dict[str, Any]

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
