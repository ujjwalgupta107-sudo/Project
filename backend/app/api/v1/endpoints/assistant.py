from typing import Annotated
from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.assistant import ChatRequest, ChatResponse
from app.services.assistant_service import AIAssistantService
from app.api.deps import require_investigator

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    request: ChatRequest,
    current_user: Annotated[User, Depends(require_investigator)]
):
    """
    Mock endpoint for the Investigator AI Assistant.
    """
    service = AIAssistantService()
    return await service.chat(request)
