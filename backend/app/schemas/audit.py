import uuid
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class InvestigatorNoteResponse(BaseModel):
    id: uuid.UUID
    case_id: uuid.UUID
    author_id: uuid.UUID
    content: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
