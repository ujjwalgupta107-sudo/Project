import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.models.analysis import AnalysisResult, RedFlag, RecommendedAction
from app.models.case import Case, ScamType, RiskLevel
from app.schemas.analysis import AnalysisRequest
from app.services.entity_service import EntityService

class AnalysisService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def analyze_text(self, request: AnalysisRequest) -> AnalysisResult:
        """
        Mock deterministic risk scoring engine to replace the frontend AI calls.
        In a real scenario, this connects to an LLM provider.
        """
        text = request.text.lower()
        score = 0.1
        flags = []
        actions = []
        scam = ScamType.OTHER
        
        # Comprehensive deterministic heuristics
        
        # Digital Arrest / Law Enforcement Impersonation
        if any(x in text for x in ["cbi", "police", "arrest", "ed", "enforcement directorate", "customs", "trai", "telecom", "supreme court", "high court"]):
            score += 0.4
            flags.append("Impersonation of law enforcement or government authority.")
            if scam == ScamType.OTHER:
                scam = ScamType.DIGITAL_ARREST

        # Drugs / Illegal substances in parcel
        if any(x in text for x in ["illegal", "substance", "drugs", "mdma", "narcotics", "contraband"]) and ("parcel" in text or "courier" in text):
            score += 0.3
            flags.append("Accusation of illegal substances in a parcel.")
            scam = ScamType.DIGITAL_ARREST # Can also be courier, but DA is higher priority

        # Account freeze / legal threats
        if any(x in text for x in ["freeze", "suspended", "blocked", "deactivated"]) and any(x in text for x in ["account", "card", "aadhaar", "pan"]):
            score += 0.3
            flags.append("Threat of account freeze or suspension.")
            if scam == ScamType.OTHER:
                scam = ScamType.PHISHING

        # Urgency
        if any(x in text for x in ["urgent", "immediately", "within 24 hours", "action required", "act now"]):
            score += 0.2
            flags.append("High sense of urgency to bypass critical thinking.")

        # Secrecy / Isolation
        if any(x in text for x in ["do not tell", "secret", "alone", "confidential", "isolate"]):
            score += 0.3
            flags.append("Instruction to maintain secrecy or isolate the victim.")
            if scam == ScamType.OTHER:
                scam = ScamType.DIGITAL_ARREST

        # Financial Demands
        if any(x in text for x in ["transfer", "pay", "deposit", "send money", "rs", "rupees", "amount"]):
            score += 0.3
            flags.append("Explicit demand for money transfer.")

        # OTP / PIN / Passwords
        if any(x in text for x in ["otp", "pin", "password", "cvv", "verification code"]):
            score += 0.4
            flags.append("Request for sensitive authentication details (OTP/PIN).")
            if scam == ScamType.OTHER:
                scam = ScamType.OTP_THEFT

        # Remote Access Apps
        if any(x in text for x in ["anydesk", "teamviewer", "rustdesk", "quicksupport", "screen share"]):
            score += 0.5
            flags.append("Request to install remote access applications.")
            scam = ScamType.OTHER # Typically tech support or DA

        # Crypto
        if any(x in text for x in ["crypto", "bitcoin", "usdt", "wallet", "binance", "investment"]):
            score += 0.3
            flags.append("Demand for cryptocurrency payment or investment.")
            if scam == ScamType.OTHER:
                scam = ScamType.INVESTMENT_SCAM

        # URLs / Links
        if "http" in text or "www." in text or ".com" in text or ".in" in text or ".org" in text:
            if "update" in text or "kyc" in text or "verify" in text:
                score += 0.3
                flags.append("Suspicious link prompting for KYC or verification.")
                if scam == ScamType.OTHER:
                    scam = ScamType.PHISHING
            
        # Bound score
        score = min(max(score, 0.0), 1.0)
        
        # Map to Risk Level
        if score > 0.8:
            level = RiskLevel.CRITICAL
        elif score > 0.6:
            level = RiskLevel.HIGH
        elif score > 0.3:
            level = RiskLevel.MEDIUM
        else:
            level = RiskLevel.LOW
            
        actions = [
            "Do not share any further personal information.",
            "Report the phone number or UPI ID to your bank immediately.",
            "Save screenshots of all communications."
        ]
        
        # Create DB records
        analysis = AnalysisResult(
            case_id=request.case_id,
            risk_score=score,
            risk_level=level,
            predicted_type=scam,
            confidence=0.85
        )
        self.db.add(analysis)
        await self.db.commit()
        await self.db.refresh(analysis)
        
        for f in flags:
            rf = RedFlag(analysis_id=analysis.id, description=f)
            self.db.add(rf)
            
        for a in actions:
            ra = RecommendedAction(analysis_id=analysis.id, action=a)
            self.db.add(ra)
            
        await self.db.commit()
        
        # Extract and Upsert Entities
        entity_service = EntityService(self.db)
        extracted = entity_service.extract_entities_from_text(text)
        
        for e_type, val in extracted:
            entity = await entity_service.upsert_entity(e_type, val, risk_score=score)
            if request.case_id:
                await entity_service.link_case_to_entity(request.case_id, entity.id)

        # Return fully loaded object
        stmt = select(AnalysisResult).where(AnalysisResult.id == analysis.id).options(
            selectinload(AnalysisResult.red_flags),
            selectinload(AnalysisResult.recommended_actions)
        )
        res = await self.db.execute(stmt)
        return res.scalar_one()
