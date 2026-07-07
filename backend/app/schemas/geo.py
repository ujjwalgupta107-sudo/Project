from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class GeoHotspotResponse(BaseModel):
    city: str
    case_count: int
    avg_risk: float
    lat: Optional[float] = None
    lng: Optional[float] = None
    risk_level: str = "MEDIUM"
