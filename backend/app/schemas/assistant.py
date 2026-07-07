from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    context: str = "" # e.g. case details to give AI context

class ChatResponse(BaseModel):
    reply: str
