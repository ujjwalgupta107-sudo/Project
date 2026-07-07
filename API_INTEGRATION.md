# KAVACH AI: API Integration Contract

This document maps the real KAVACH FastAPI backend to the frontend web application.

## 1. Authentication (`/api/v1/auth`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/register` | POST | Register new user | None | Any | `Register.tsx` |
| `/login` | POST | Authenticate & get token | None | Any | `Login.tsx` |
| `/me` | GET | Get current profile | Bearer | Any | Auth Context / Navbar |

*Note: Refresh token endpoints are currently handled intrinsically or are missing from the local auth implementation. If absent, frontend should force re-login on 401.*

## 2. Cases & Citizen Reports (`/api/v1/cases`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/` | POST | Submit a new citizen report | Bearer | Any | `ShieldHome.tsx` (Submission Form) |
| `/me` | GET | List citizen's own cases (paginated) | Bearer | Citizen/Any | `ReportHistory.tsx` |
| `/` | GET | List cases (paginated) | Bearer | Investigator | `CaseList.tsx` |
| `/{id}` | GET | Get case details & intel | Bearer | Any (Owner) | `AnalyzeResult.tsx`, `CaseDetail.tsx` |
| `/{id}/status`| PUT | Update case investigation status | Bearer | Investigator | `CaseDetail.tsx` (Status Editor) |

## 3. Analysis (`/api/v1/analysis`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/analyze` | POST | Direct text analysis (bypasses Case) | Bearer | Investigator | (Not heavily used in Phase 3A citizen flow, uses cases POST instead) |

## 4. Dashboard (`/api/v1/dashboard`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/metrics` | GET | Top-level counts and risks | Bearer | Investigator | `Dashboard.tsx` (KPI Cards) |
| `/charts` | GET | Time series and distributions | Bearer | Investigator | `Dashboard.tsx` (Charts) |

## 5. Alerts (`/api/v1/alerts`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/` | GET | List all active/historical alerts | Bearer | Investigator | `Alerts.tsx`, `Dashboard.tsx` |
| `/{id}/acknowledge` | POST | Acknowledge alert | Bearer | Investigator | `Alerts.tsx` (Action Button) |

## 6. Graph Intelligence (`/api/v1/intelligence`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/graph` | GET | Get Cytoscape node/edge array | Bearer | Investigator | `FraudNetwork.tsx` |
| `/entities` | GET | List all extracted entities | Bearer | Investigator | `EntityList.tsx` |

## 7. Clusters (`/api/v1/clusters`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/` | GET | List dynamic fraud clusters | Bearer | Investigator | `Clusters.tsx` |
| `/{id}` | GET | Get cluster details (cases/entities) | Bearer | Investigator | `ClusterDetail.tsx` |

## 8. Geographic Intelligence (`/api/v1/geo`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/hotspots` | GET | Get map coordinates and intensity | Bearer | Investigator | `GeospatialMap.tsx` |

## 9. Evidence (`/api/v1/evidence`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/upload` | POST | Upload file (multipart) | Bearer | Any | `ShieldHome.tsx` (File input) |
| `/{id}/download`| GET | Download file binary | Bearer | Any | `CaseDetail.tsx` |

## 10. Health & Readiness (`/health`, `/ready`)

| Endpoint | Method | Purpose | Auth | Role | Component Consumer |
|----------|--------|---------|------|------|---------------------|
| `/health` | GET | API Liveness | None | Any | Status indicator |
| `/ready` | GET | DB Readiness | None | Any | Status indicator |

---

## Frontend Mock Data Audit (Current State)

| Page / Component | Current Data Source | Real API Available? | Action Required (Phase 3A/3B) |
|------------------|---------------------|---------------------|-------------------------------|
| `ShieldHome.tsx` | `mock/analysisService.ts` | **YES** (`/cases/` POST) | Switch to POST `/cases/`, await processing. |
| `AnalyzeResult.tsx` | `mock/analysisService.ts` | **YES** (`/cases/{id}`) | Fetch by Case ID returned from `ShieldHome`. |
| `CaseList.tsx` | `mock/caseService.ts` | **YES** (`/cases/` GET) | Phase 3B Integration. |
| `CaseDetail.tsx` | `mock/caseService.ts` | **YES** (`/cases/{id}`) | Phase 3B Integration. |
| `FraudNetwork.tsx` | `mock/mockGraphData.ts` | **YES** (`/intelligence/graph`) | Phase 3B Integration. |

## Backend Gaps for Frontend
- **Pagination parameters** are not uniformly implemented across all GET lists (e.g. `alerts` might return all alerts instead of page slices).
- **Cluster detail** endpoint (`/clusters/{id}`) now exists and returns detailed connected cases and shared entities.
- **Citizen Case History** endpoint now exists as `/api/v1/cases/me`, enforcing ownership.
