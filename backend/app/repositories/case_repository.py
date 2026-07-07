import uuid
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.models.case import Case, Evidence, CaseTimelineEvent

class CaseRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, case_id: uuid.UUID) -> Optional[Case]:
        stmt = select(Case).where(Case.id == case_id).options(
            selectinload(Case.evidence),
            selectinload(Case.timeline)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_multi_by_reporter(self, reporter_id: uuid.UUID, skip: int = 0, limit: int = 100) -> Tuple[List[Case], int]:
        stmt = select(Case).where(Case.reporter_id == reporter_id).order_by(Case.created_at.desc()).offset(skip).limit(limit)
        count_stmt = select(func.count()).select_from(Case).where(Case.reporter_id == reporter_id)
        result = await self.session.execute(stmt)
        total = await self.session.execute(count_stmt)
        return list(result.scalars().all()), total.scalar() or 0
        
    async def get_multi(
        self, skip: int = 0, limit: int = 100,
        status: Optional[str] = None,
        scam_type: Optional[str] = None
    ) -> Tuple[List[Case], int]:
        stmt = select(Case)
        count_stmt = select(func.count()).select_from(Case)
        
        if status:
            stmt = stmt.where(Case.status == status)
            count_stmt = count_stmt.where(Case.status == status)
        if scam_type:
            stmt = stmt.where(Case.scam_type == scam_type)
            count_stmt = count_stmt.where(Case.scam_type == scam_type)
            
        stmt = stmt.order_by(Case.created_at.desc()).offset(skip).limit(limit)
        
        result = await self.session.execute(stmt)
        total = await self.session.execute(count_stmt)
        
        return list(result.scalars().all()), total.scalar() or 0

    async def create(self, case: Case) -> Case:
        self.session.add(case)
        await self.session.commit()
        await self.session.refresh(case)
        return case

    async def update(self, case: Case) -> Case:
        await self.session.commit()
        await self.session.refresh(case)
        return case

    async def add_timeline_event(self, event: CaseTimelineEvent) -> CaseTimelineEvent:
        self.session.add(event)
        await self.session.commit()
        await self.session.refresh(event)
        return event

    async def add_evidence(self, evidence: Evidence) -> Evidence:
        self.session.add(evidence)
        await self.session.commit()
        await self.session.refresh(evidence)
        return evidence
