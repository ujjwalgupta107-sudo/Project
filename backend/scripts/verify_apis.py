import asyncio
import httpx
import json

async def verify_apis():
    out_file = open("api_verify.log", "w", encoding="utf-8")
    
    def log(s):
        out_file.write(str(s) + "\n")
        print(s)

    async with httpx.AsyncClient(base_url="http://localhost:8000") as client:
        # Get Auth Token
        auth_resp = await client.post("/api/v1/auth/login", data={"username": "importer@kavach.ai", "password": "importer_hash"})
        if auth_resp.status_code == 200:
            token = auth_resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
        else:
            log(f"Auth failed: {auth_resp.status_code} {auth_resp.text}")
            return
            
        # Graph API
        log("\n=== GRAPH API VERIFICATION ===")
        graph_resp = await client.get("/api/v1/clusters/graph", headers=headers)
        log(f"HTTP Status: {graph_resp.status_code}")
        if graph_resp.status_code == 200:
            g = graph_resp.json()
            nodes = g.get("nodes", [])
            edges = g.get("edges", [])
            case_nodes = [n for n in nodes if n["type"] == "CASE"]
            entity_nodes = [n for n in nodes if n["type"] == "ENTITY"]
            log(f"Node count: {len(nodes)}")
            log(f"Edge count: {len(edges)}")
            log(f"Case-node count: {len(case_nodes)}")
            log(f"Entity-node count: {len(entity_nodes)}")
            
            # Identify shared entities and connected cases
            shared = sorted([n for n in entity_nodes if n.get("degree", 0) > 1], key=lambda x: x.get("degree", 0), reverse=True)
            for n in shared[:3]:
                log(f"Shared Entity Node: {n['label']} (ID: {n['id']}, Degree: {n.get('degree')})")
                
                # Prove edges exist
                n_edges = [e for e in edges if e["target"] == n["id"] or e["source"] == n["id"]]
                log(f"  Edges linked to this entity: {len(n_edges)}")

        # Cluster API
        log("\n=== CLUSTER API VERIFICATION ===")
        cluster_resp = await client.get("/api/v1/clusters/", headers=headers)
        log(f"HTTP Status: {cluster_resp.status_code}")
        if cluster_resp.status_code == 200:
            clusters = cluster_resp.json()
            log(f"Total dynamic clusters: {len(clusters)}")
            for c in clusters[:5]:
                log(f"Cluster {c['id']}: Size={c['case_count']} cases, Entity Types={c['entity_types']}")

        # Dashboard / Geo API (Assuming endpoints exist based on standard project structure, e.g. /api/v1/analytics/dashboard)
        log("\n=== DASHBOARD API VERIFICATION ===")
        dash_resp = await client.get("/api/v1/analytics/dashboard", headers=headers)
        if dash_resp.status_code == 200:
            log(f"HTTP Status: {dash_resp.status_code}")
            d = dash_resp.json()
            log(f"Total cases: {d.get('total_cases')}")
            log(f"Alert count: {d.get('active_alerts')}")
        else:
            log(f"Dashboard endpoint not available: {dash_resp.status_code}")

    out_file.close()

if __name__ == "__main__":
    asyncio.run(verify_apis())
