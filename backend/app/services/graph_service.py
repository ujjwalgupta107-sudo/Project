from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.entity_repository import EntityRepository
from app.schemas.entity import GraphResponse, GraphNode, GraphEdge

class GraphService:
    def __init__(self, db: AsyncSession):
        self.repo = EntityRepository(db)

    async def get_cytoscape_graph(self) -> GraphResponse:
        """
        Maps the relational DB tables (Cases and Entities) into a generic Graph payload
        formatted for Cytoscape.js.
        """
        nodes = []
        edges = []
        
        # 1. Fetch entities
        entities = await self.repo.get_all_entities(limit=200)
        for e in entities:
            nodes.append(GraphNode(
                data={
                    "id": f"entity_{e.id}",
                    "label": e.value, # In production, mask if sensitive
                    "type": e.type.value,
                    "riskScore": e.risk_score
                }
            ))
            
        # 2. Fetch cases
        cases = await self.repo.get_all_cases_with_links()
        for c in cases:
            nodes.append(GraphNode(
                data={
                    "id": f"case_{c.id}",
                    "label": f"Case {str(c.id)[:6]}",
                    "type": "CASE",
                    "riskScore": c.risk_score
                }
            ))
            
            # 3. Create Edges
            for link in c.entity_links:
                edges.append(GraphEdge(
                    data={
                        "id": f"edge_{link.id}",
                        "source": f"case_{c.id}",
                        "target": f"entity_{link.entity_id}",
                        "label": link.relationship_type
                    }
                ))
                
        return GraphResponse(nodes=nodes, edges=edges)
