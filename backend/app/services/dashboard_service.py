from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.models.case import Case, CaseStatus, RiskLevel
from app.models.entity import Entity, FraudCluster
from app.models.analysis import AnalysisResult
from app.schemas.dashboard import DashboardMetricsResponse, DashboardChartDataResponse

class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_metrics(self) -> DashboardMetricsResponse:
        today = datetime.now(timezone.utc).date()
        
        # 1. Active High Risk Cases
        stmt_high_risk = select(func.count()).select_from(Case).where(
            Case.status.in_([CaseStatus.OPEN, CaseStatus.INVESTIGATING])
        ).join(AnalysisResult, AnalysisResult.case_id == Case.id).where(
            AnalysisResult.risk_level.in_([RiskLevel.HIGH, RiskLevel.CRITICAL])
        )
        active_high_risk = (await self.db.execute(stmt_high_risk)).scalar() or 0
        
        # 2. Reports Today
        stmt_today = select(func.count()).select_from(Case).where(
            func.date(Case.created_at) == today
        )
        reports_today = (await self.db.execute(stmt_today)).scalar() or 0
        
        # 3. Suspicious Entities Tracked
        stmt_entities = select(func.count()).select_from(Entity).where(
            Entity.risk_score > 0.5
        )
        entities_tracked = (await self.db.execute(stmt_entities)).scalar() or 0
        
        # 4. Emerging Clusters
        stmt_clusters = select(func.count()).select_from(FraudCluster)
        clusters = (await self.db.execute(stmt_clusters)).scalar() or 0
        
        # 5. Critical Alerts (Mocked for now since Alert model is missing)
        critical_alerts = 0
        
        # 6. Avg Risk Score
        stmt_avg_risk = select(func.avg(AnalysisResult.risk_score))
        avg_risk = (await self.db.execute(stmt_avg_risk)).scalar() or 0.0
        
        return DashboardMetricsResponse(
            active_high_risk_cases=active_high_risk,
            reports_today=reports_today,
            suspicious_entities_tracked=entities_tracked,
            emerging_clusters=clusters,
            critical_alerts=critical_alerts,
            average_risk_score=round(avg_risk * 100, 2)
        )

    async def get_chart_data(self) -> DashboardChartDataResponse:
        # Group by Scam Type
        stmt_scam = select(Case.scam_type, func.count(Case.id).label("count")).group_by(Case.scam_type)
        scam_results = await self.db.execute(stmt_scam)
        scam_dist = [{"type": row.scam_type.value, "count": row.count} for row in scam_results]
        
        # Dummy over time (PostgreSQL group by date requires cast)
        # Using basic SQLite/Postgres compatible date extraction for simplicity
        stmt_time = select(func.date(Case.created_at).label("d"), func.count(Case.id).label("c")).group_by(func.date(Case.created_at)).order_by(desc("d")).limit(30)
        time_results = await self.db.execute(stmt_time)
        time_dist = [{"date": str(row.d), "count": row.c} for row in time_results]
        
        # Top locations (Currently Case lacks a direct location field, mock return)
        loc_dist = [{"city": "Mumbai", "count": 120}, {"city": "Delhi", "count": 85}]
        
        return DashboardChartDataResponse(
            reports_over_time=time_dist,
            scam_type_distribution=scam_dist,
            top_locations=loc_dist
        )
