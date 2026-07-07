import asyncio
import sys
import os
from fastapi import Request

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import async_session_maker
from app.models.user import User, UserRole
from app.api.v1.endpoints.clusters import list_clusters
from app.api.v1.endpoints.intelligence import get_fraud_network_graph
from app.api.v1.endpoints.dashboard import get_dashboard_metrics

async def verify_apis():
    out_file = open("api_verify.log", "w", encoding="utf-8")
    def log(s):
        out_file.write(str(s) + "\n")
        print(s)

    async with async_session_maker() as db:
        user = User(id="00000000-0000-0000-0000-000000000000", email="test", role=UserRole.INVESTIGATOR)
        
        log("\n=== GRAPH API VERIFICATION ===")
        try:
            g_resp = await get_fraud_network_graph(current_user=user, db=db)
            g = g_resp.model_dump()
            nodes = g.get("nodes", [])
            edges = g.get("edges", [])
            case_nodes = [n for n in nodes if n["type"] == "CASE"]
            entity_nodes = [n for n in nodes if n["type"] == "ENTITY"]
            log(f"HTTP Status: 200 (Mocked)")
            log(f"Node count: {len(nodes)}")
            log(f"Edge count: {len(edges)}")
            log(f"Case-node count: {len(case_nodes)}")
            log(f"Entity-node count: {len(entity_nodes)}")
            
            shared = sorted([n for n in entity_nodes if n.get("degree", 0) > 1], key=lambda x: x.get("degree", 0), reverse=True)
            for n in shared[:3]:
                log(f"Shared Entity Node: {n['label']} (ID: {n['id']}, Degree: {n.get('degree')})")
                n_edges = [e for e in edges if e["target"] == n["id"] or e["source"] == n["id"]]
                log(f"  Edges linked to this entity: {len(n_edges)}")
        except Exception as e:
            log(f"Graph API Error: {e}")

        log("\n=== CLUSTER API VERIFICATION ===")
        try:
            clusters = await list_clusters(current_user=user, db=db)
            log(f"HTTP Status: 200 (Mocked)")
            log(f"Total dynamic clusters: {len(clusters)}")
            for c in clusters[:5]:
                log(f"Cluster {c.id}: Size={getattr(c, 'case_count', 'N/A')} cases, Risk Score={c.risk_score}")
        except Exception as e:
            log(f"Cluster API Error: {e}")

        log("\n=== DASHBOARD API VERIFICATION ===")
        try:
            dash = await get_dashboard_metrics(current_user=user, db=db)
            log(f"HTTP Status: 200 (Mocked)")
            log(f"Total cases: {dash.total_cases}")
            log(f"Alert count: {dash.active_alerts}")
            log(f"Cluster count: {dash.active_clusters}")
            log(f"Risk distribution: LOW={dash.risk_distribution.get('LOW')}, CRITICAL={dash.risk_distribution.get('CRITICAL')}")
        except Exception as e:
            log(f"Dashboard API Error: {e}")

    out_file.close()

if __name__ == "__main__":
    asyncio.run(verify_apis())
