import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.case import Case, CaseTimelineEvent, CaseStatus
from app.models.user import User
from app.schemas.case import CaseCreate, CaseUpdate
from app.repositories.case_repository import CaseRepository
from app.core.exceptions import NotFoundException, ForbiddenException

class CaseService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = CaseRepository(db)

    async def create_case(self, case_in: CaseCreate, reporter: User) -> Case:
        case = Case(
            reporter_id=reporter.id,
            scam_type=case_in.scam_type,
            description=case_in.description,
            lat=case_in.lat,
            lng=case_in.lng,
            city=case_in.city
        )
        created_case = await self.repo.create(case)
        
        # Add timeline event
        event = CaseTimelineEvent(
            case_id=created_case.id,
            actor_id=reporter.id,
            event_type="CASE_CREATED",
            description="Case reported by citizen"
        )
        await self.repo.add_timeline_event(event)
        
        # Trigger full vertical pipeline
        
        # 1. Analyze Text & Extract Entities
        from app.services.analysis_service import AnalysisService
        from app.schemas.analysis import AnalysisRequest
        analysis_service = AnalysisService(self.repo.session)
        analysis_result = await analysis_service.analyze_text(
            AnalysisRequest(text=created_case.description, case_id=created_case.id)
        )
        
        # Update case with risk score from analysis
        created_case.risk_score = analysis_result.risk_score
        created_case.risk_level = analysis_result.risk_level
        # Also, if analysis predicted a different scam type and it's not generic OTHER
        if analysis_result.predicted_type != created_case.scam_type and created_case.scam_type.value == "OTHER":
             created_case.scam_type = analysis_result.predicted_type
        
        await self.repo.update(created_case)
        
        # 2. Evaluate Alerts
        from app.services.alert_service import AlertService
        alert_service = AlertService(self.repo.session)
        await alert_service.evaluate_case_alerts(created_case)
        
        # 3. Dynamic Clustering
        from app.services.cluster_service import ClusterService
        cluster_service = ClusterService(self.repo.session)
        await cluster_service.detect_and_update_clusters()
        
        return await self.repo.get_by_id(created_case.id)

    async def get_case(self, case_id: uuid.UUID, current_user: User) -> Case:
        case = await self.repo.get_by_id(case_id)
        if not case:
            raise NotFoundException("Case not found")
            
        # Security: only reporter or investigator/admin can view
        if current_user.role.value == "CITIZEN" and case.reporter_id != current_user.id:
            raise ForbiddenException("Not authorized to view this case")
            
        return case

    async def update_case_status(self, case_id: uuid.UUID, new_status: CaseStatus, actor: User) -> Case:
        case = await self.repo.get_by_id(case_id)
        if not case:
            raise NotFoundException("Case not found")
            
        old_status = case.status
        case.status = new_status
        updated_case = await self.repo.update(case)
        
        # Timeline event
        event = CaseTimelineEvent(
            case_id=updated_case.id,
            actor_id=actor.id,
            event_type="STATUS_CHANGE",
            description=f"Status changed from {old_status.value} to {new_status.value}"
        )
        await self.repo.add_timeline_event(event)
        
        return await self.repo.get_by_id(updated_case.id)

    async def get_case_intelligence(self, case_id: uuid.UUID, current_user: User) -> dict:
        case = await self.get_case(case_id, current_user)
        
        from sqlalchemy import select
        from sqlalchemy.orm import joinedload
        from app.models.analysis import AnalysisResult
        from app.models.entity import Entity, CaseEntityLink
        
        # Get Analysis
        stmt_analysis = (
            select(AnalysisResult)
            .options(joinedload(AnalysisResult.red_flags), joinedload(AnalysisResult.recommended_actions))
            .where(AnalysisResult.case_id == case_id)
        )
        result_analysis = await self.db.execute(stmt_analysis)
        analysis = result_analysis.unique().scalar_one_or_none()
        
        # Get Entities
        stmt_entities = select(Entity).join(CaseEntityLink).where(CaseEntityLink.case_id == case_id)
        result_entities = await self.db.execute(stmt_entities)
        entities = result_entities.scalars().all()
        
        return {
            "case": case,
            "analysis": analysis,
            "entities": entities
        }
