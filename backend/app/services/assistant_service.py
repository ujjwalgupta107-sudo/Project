from app.schemas.assistant import ChatRequest, ChatResponse

class AIAssistantService:
    async def chat(self, request: ChatRequest) -> ChatResponse:
        """
        Mock Chatbot response. Connects to LLM in production.
        """
        query = request.message.lower()
        reply = "I'm KAVACH AI, your investigation assistant. How can I help you analyze this case?"
        
        if "summary" in query or "summarize" in query:
            reply = "Based on the case details, this appears to be a coordinated financial fraud involving unauthorized UPI transfers. The suspect entity has been flagged in 3 other jurisdictions."
        elif "entity" in query or "entities" in query:
            reply = "I've extracted 2 phone numbers and 1 UPI ID from the evidence. They are linked to a high-risk cluster."
        elif "action" in query or "next" in query:
            reply = "I recommend freezing the associated bank accounts and generating a subpoena request for the telecom operator."
            
        return ChatResponse(reply=reply)
