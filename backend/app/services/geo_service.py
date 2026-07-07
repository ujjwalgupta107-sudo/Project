from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.models.case import Case, RiskLevel
from app.models.analysis import AnalysisResult
from app.schemas.geo import GeoHotspotResponse

# Approximate city coordinates for Indian cities commonly seen in scam reports
CITY_COORDS: dict = {
    "mumbai": (19.0760, 72.8777),
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "bangalore": (12.9716, 77.5946),
    "bengaluru": (12.9716, 77.5946),
    "hyderabad": (17.3850, 78.4867),
    "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639),
    "pune": (18.5204, 73.8567),
    "ahmedabad": (23.0225, 72.5714),
    "jaipur": (26.9124, 75.7873),
    "lucknow": (26.8467, 80.9462),
    "patna": (25.5941, 85.1376),
    "bhopal": (23.2599, 77.4126),
    "indore": (22.7196, 75.8577),
    "nagpur": (21.1458, 79.0882),
    "surat": (21.1702, 72.8311),
    "kanpur": (26.4499, 80.3319),
    "agra": (27.1767, 78.0081),
    "varanasi": (25.3176, 82.9739),
    "amritsar": (31.6340, 74.8723),
    "chandigarh": (30.7333, 76.7794),
    "coimbatore": (11.0168, 76.9558),
    "kochi": (9.9312, 76.2673),
    "visakhapatnam": (17.6868, 83.2185),
    "noida": (28.5355, 77.3910),
    "gurgaon": (28.4595, 77.0266),
    "gurugram": (28.4595, 77.0266),
    "ranchi": (23.3441, 85.3096),
    "bhubaneswar": (20.2961, 85.8245),
}


def _city_to_coords(city: str) -> Optional[tuple]:
    """Returns (lat, lng) for a known Indian city, else None."""
    if not city:
        return None
    key = city.lower().strip()
    # Exact match
    if key in CITY_COORDS:
        return CITY_COORDS[key]
    # Partial match (e.g. "Mumbai Maharashtra")
    for k, v in CITY_COORDS.items():
        if k in key or key in k:
            return v
    return None


class GeoService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_hotspots(self) -> List[GeoHotspotResponse]:
        """
        Groups active cases by city to find hotspots.
        Returns at most 10 cities with case counts and average risk.
        Hotspots without known coordinates are still returned — the
        frontend can render them in the sidebar even if not on the map.
        """
        stmt = (
            select(
                Case.city.label("city"),
                func.count(Case.id).label("case_count"),
                func.avg(AnalysisResult.risk_score).label("avg_risk")
            )
            .outerjoin(AnalysisResult, AnalysisResult.case_id == Case.id)
            .where(Case.city != None)
            .group_by(Case.city)
            .order_by(desc("case_count"))
            .limit(10)
        )

        result = await self.db.execute(stmt)

        hotspots = []
        for row in result:
            avg_risk = row.avg_risk or 0.0
            coords = _city_to_coords(row.city)
            
            if avg_risk > 0.8:
                risk_level = "CRITICAL"
            elif avg_risk > 0.6:
                risk_level = "HIGH"
            elif avg_risk > 0.3:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"

            hotspots.append(GeoHotspotResponse(
                city=row.city,
                case_count=row.case_count,
                avg_risk=avg_risk,
                lat=coords[0] if coords else None,
                lng=coords[1] if coords else None,
                risk_level=risk_level,
            ))

        # If cases have report_location but not city, also try report_location
        if not hotspots:
            stmt2 = (
                select(
                    Case.report_location.label("city"),
                    func.count(Case.id).label("case_count"),
                    func.avg(AnalysisResult.risk_score).label("avg_risk")
                )
                .outerjoin(AnalysisResult, AnalysisResult.case_id == Case.id)
                .where(Case.report_location != None)
                .group_by(Case.report_location)
                .order_by(desc("case_count"))
                .limit(10)
            )
            result2 = await self.db.execute(stmt2)
            for row in result2:
                avg_risk = row.avg_risk or 0.0
                coords = _city_to_coords(row.city or "")
                if avg_risk > 0.8:
                    risk_level = "CRITICAL"
                elif avg_risk > 0.6:
                    risk_level = "HIGH"
                elif avg_risk > 0.3:
                    risk_level = "MEDIUM"
                else:
                    risk_level = "LOW"
                hotspots.append(GeoHotspotResponse(
                    city=row.city or "Unknown",
                    case_count=row.case_count,
                    avg_risk=avg_risk,
                    lat=coords[0] if coords else None,
                    lng=coords[1] if coords else None,
                    risk_level=risk_level,
                ))

        return hotspots
