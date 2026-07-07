import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.entity import Entity, CaseEntityLink, FraudCluster
from app.models.case import Case

class EntityRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, entity_id: uuid.UUID) -> Optional[Entity]:
        result = await self.session.execute(select(Entity).where(Entity.id == entity_id))
        return result.scalar_one_or_none()
        
    async def get_by_value(self, value: str) -> Optional[Entity]:
        result = await self.session.execute(select(Entity).where(Entity.value == value))
        return result.scalar_one_or_none()

    async def create(self, entity: Entity) -> Entity:
        self.session.add(entity)
        await self.session.commit()
        await self.session.refresh(entity)
        return entity
        
    async def link_to_case(self, case_id: uuid.UUID, entity_id: uuid.UUID, relationship_type: str = "MENTIONED_IN") -> CaseEntityLink:
        link = CaseEntityLink(case_id=case_id, entity_id=entity_id, relationship_type=relationship_type)
        self.session.add(link)
        await self.session.commit()
        await self.session.refresh(link)
        return link

    async def get_all_entities(self, limit: int = 100) -> List[Entity]:
        result = await self.session.execute(select(Entity).limit(limit))
        return list(result.scalars().all())
        
    async def get_all_links(self) -> List[CaseEntityLink]:
        result = await self.session.execute(select(CaseEntityLink))
        return list(result.scalars().all())

    async def get_all_cases_with_links(self) -> List[Case]:
        stmt = select(Case).options(selectinload(Case.entity_links))
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
