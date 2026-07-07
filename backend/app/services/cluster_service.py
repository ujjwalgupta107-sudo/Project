from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.entity import Entity, FraudCluster, CaseEntityLink
from app.models.case import Case

class ClusterService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def detect_and_update_clusters(self):
        """
        Scans for meaningful shared infrastructure.
        If an entity is linked to > 1 case, group those cases into a cluster.
        """
        # 1. Find entities that appear in more than 1 case
        stmt = (
            select(CaseEntityLink.entity_id)
            .group_by(CaseEntityLink.entity_id)
            .having(func.count(CaseEntityLink.case_id) > 1)
        )
        result = await self.db.execute(stmt)
        shared_entity_ids = result.scalars().all()

        for eid in shared_entity_ids:
            # Check if this entity already has a cluster
            entity = await self.db.get(Entity, eid)
            if not entity:
                continue
                
            cluster_id = entity.cluster_id
            if not cluster_id:
                # Create new cluster
                cluster = FraudCluster(risk_score=entity.risk_score)
                self.db.add(cluster)
                await self.db.commit()
                await self.db.refresh(cluster)
                cluster_id = cluster.id
                entity.cluster_id = cluster_id
                await self.db.commit()
                
            # Assign all other entities linked to the same cases to this cluster
            # (Basic naive clustering implementation)
            links_stmt = select(CaseEntityLink).where(CaseEntityLink.entity_id == eid)
            case_links = (await self.db.execute(links_stmt)).scalars().all()
            
            for cl in case_links:
                # Get all entities in this case
                sibling_stmt = select(CaseEntityLink).where(CaseEntityLink.case_id == cl.case_id)
                siblings = (await self.db.execute(sibling_stmt)).scalars().all()
                for sib in siblings:
                    sib_ent = await self.db.get(Entity, sib.entity_id)
                    if sib_ent and not sib_ent.cluster_id:
                        sib_ent.cluster_id = cluster_id
                        
            await self.db.commit()
