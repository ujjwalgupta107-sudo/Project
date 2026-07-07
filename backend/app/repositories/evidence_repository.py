import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.case import Evidence

class EvidenceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, evidence: Evidence) -> Evidence:
        self.session.add(evidence)
        await self.session.commit()
        await self.session.refresh(evidence)
        return evidence

    async def get_by_case(self, case_id: uuid.UUID) -> List[Evidence]:
        stmt = select(Evidence).where(Evidence.case_id == case_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
