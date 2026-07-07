from typing import List, Dict, Any
from pydantic import BaseModel

class DashboardMetricsResponse(BaseModel):
    active_high_risk_cases: int
    reports_today: int
    suspicious_entities_tracked: int
    emerging_clusters: int
    critical_alerts: int
    average_risk_score: float

class DashboardChartDataResponse(BaseModel):
    reports_over_time: List[Dict[str, Any]] # e.g. {"date": "2023-10-01", "count": 15}
    scam_type_distribution: List[Dict[str, Any]] # e.g. {"type": "DIGITAL_ARREST", "count": 42}
    top_locations: List[Dict[str, Any]] # e.g. {"city": "Mumbai", "count": 120}
