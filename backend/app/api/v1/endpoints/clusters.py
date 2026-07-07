import uuid
from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.user import User
from app.models.entity import FraudCluster
from app.schemas.entity import GraphResponse # Assuming cluster detail schema would live here
from app.api.deps import require_investigator
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from sqlalchemy import func
from app.models.case import Case
from app.models.entity import Entity
from typing import Optional

class FraudClusterResponse(BaseModel):
    id: uuid.UUID
    risk_score: float
    created_at: datetime
    case_count: int = 0
    entity_count: int = 0
    model_config = ConfigDict(from_attributes=True)

class ClusterDetailResponse(BaseModel):
    cluster: FraudClusterResponse
    cases: List[dict] = []
    entities: List[dict] = []
    explanation: str

router = APIRouter()

@router.get("/", response_model=List[FraudClusterResponse])
async def list_clusters(
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    # Get basic clusters
    stmt = select(FraudCluster).order_by(FraudCluster.risk_score.desc())
    result = await db.execute(stmt)
    clusters = list(result.scalars().all())
    
    response = []
    for c in clusters:
        # get case count
        c_count = await db.execute(select(func.count()).select_from(Case).where(Case.cluster_id == c.id))
        # get entity count
        e_count = await db.execute(select(func.count()).select_from(Entity).where(Entity.cluster_id == c.id))
        
        response.append(FraudClusterResponse(
            id=c.id,
            risk_score=c.risk_score,
            created_at=c.created_at,
            case_count=c_count.scalar() or 0,
            entity_count=e_count.scalar() or 0
        ))
    return response

@router.get("/{cluster_id}", response_model=ClusterDetailResponse)
async def get_cluster_detail(
    cluster_id: uuid.UUID,
    current_user: Annotated[User, Depends(require_investigator)],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    stmt = select(FraudCluster).where(FraudCluster.id == cluster_id)
    result = await db.execute(stmt)
    cluster = result.scalar_one_or_none()
    if not cluster:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Cluster not found")
        
    c_count = await db.execute(select(func.count()).select_from(Case).where(Case.cluster_id == cluster.id))
    e_count = await db.execute(select(func.count()).select_from(Entity).where(Entity.cluster_id == cluster.id))
    
    c_res = FraudClusterResponse(
        id=cluster.id,
        risk_score=cluster.risk_score,
        created_at=cluster.created_at,
        case_count=c_count.scalar() or 0,
        entity_count=e_count.scalar() or 0
    )
    
    cases_stmt = select(Case).where(Case.cluster_id == cluster.id)
    cases_result = await db.execute(cases_stmt)
    cases = cases_result.scalars().all()
    
    entities_stmt = select(Entity).where(Entity.cluster_id == cluster.id)
    entities_result = await db.execute(entities_stmt)
    entities = entities_result.scalars().all()
    
    cases_list = [{"id": str(c.id), "scam_type": c.scam_type.value, "risk_level": c.risk_level.value, "city": c.city or "Unknown"} for c in cases]
    entities_list = [{"id": str(e.id), "type": e.type.value, "value": e.value} for e in entities]
    
    unique_cities = len(set(c["city"] for c in cases_list if c["city"] != "Unknown"))
    
    explanation = f"{len(cases)} cases are connected through {len(entities)} shared entities across {unique_cities} known cities."
    
    return ClusterDetailResponse(
        cluster=c_res,
        cases=cases_list,
        entities=entities_list,
        explanation=explanation
    )
