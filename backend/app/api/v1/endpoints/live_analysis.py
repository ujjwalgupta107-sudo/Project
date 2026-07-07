import uuid
from typing import Annotated, Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db.session import get_db

router = APIRouter()

# In-memory session store for development
# In production, use Redis.
live_sessions: Dict[str, Dict[str, Any]] = {}

class LiveAnalysisStartResponse(BaseModel):
    session_id: str

class LiveAnalysisFinishRequest(BaseModel):
    session_id: str

class LiveAnalysisFinishResponse(BaseModel):
    status: str
    final_risk_score: float

@router.post("/start", response_model=LiveAnalysisStartResponse)
async def start_live_analysis():
    session_id = str(uuid.uuid4())
    live_sessions[session_id] = {
        "transcript": "",
        "risk_score": 0.0,
        "flags": []
    }
    return LiveAnalysisStartResponse(session_id=session_id)

@router.websocket("/{session_id}/ws")
async def live_analysis_ws(websocket: WebSocket, session_id: str):
    await websocket.accept()
    if session_id not in live_sessions:
        await websocket.close(code=1008, reason="Invalid session")
        return
        
    try:
        while True:
            data = await websocket.receive_text()
            # Accumulate transcript
            live_sessions[session_id]["transcript"] += data + " "
            # Mock risk calculation
            current_risk = live_sessions[session_id]["risk_score"] + 0.05
            live_sessions[session_id]["risk_score"] = min(1.0, current_risk)
            
            await websocket.send_json({
                "session_id": session_id,
                "current_risk_score": live_sessions[session_id]["risk_score"],
                "new_flags": [] if current_risk < 0.5 else ["SUSPICIOUS_PATTERN"],
                "timestamp": "now"
            })
    except WebSocketDisconnect:
        pass

@router.post("/finish", response_model=LiveAnalysisFinishResponse)
async def finish_live_analysis(request: LiveAnalysisFinishRequest):
    session = live_sessions.pop(request.session_id, None)
    if not session:
        return LiveAnalysisFinishResponse(status="NOT_FOUND", final_risk_score=0.0)
        
    return LiveAnalysisFinishResponse(status="COMPLETED", final_risk_score=session.get("risk_score", 0.0))
