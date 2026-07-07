import pytest
from datetime import datetime, timezone
from app.models.user import User, UserRole
from app.models.case import ScamType, RiskLevel
from app.schemas.case import CaseCreate
from app.services.case_service import CaseService
from sqlalchemy import select, func
from app.models.entity import Entity, CaseEntityLink
from app.models.alert import Alert

@pytest.mark.asyncio
async def test_vertical_pipeline(db_session):
    # db_session fixture provided by conftest.py
    
    test_user = User(email=f"citizen_{datetime.now().timestamp()}@test.com", full_name="Test Citizen", password_hash="pw", role=UserRole.CITIZEN)
    db_session.add(test_user)
    await db_session.commit()
    await db_session.refresh(test_user)

    case_service = CaseService(db_session)

    # TEST A: High Risk
    msg_a = "This is CBI. A parcel linked to your Aadhaar contains illegal substances. Do not tell your family. Transfer Rs 50,000 to secureverify@upi for verification or you will be arrested."
    case_a_in = CaseCreate(scam_type=ScamType.OTHER, description=msg_a)
    case_a = await case_service.create_case(case_a_in, test_user)
    
    assert case_a.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]
    assert case_a.scam_type == ScamType.DIGITAL_ARREST
    
    # TEST B: Shared infrastructure
    msg_b = "Urgent! Pay your electricity bill to secureverify@upi immediately or we will cut power."
    case_b_in = CaseCreate(scam_type=ScamType.OTHER, description=msg_b)
    case_b = await case_service.create_case(case_b_in, test_user)
    
    # Assert entity reuse
    stmt = select(Entity).where(Entity.value == "secureverify@upi")
    shared_entity = (await db_session.execute(stmt)).scalar_one_or_none()
    assert shared_entity is not None
    
    link_count = (await db_session.execute(select(func.count(CaseEntityLink.id)).where(CaseEntityLink.entity_id == shared_entity.id))).scalar()
    assert link_count == 2
    
    # Assert alert
    alert_stmt = select(Alert).where(Alert.entity_id == shared_entity.id)
    alert = (await db_session.execute(alert_stmt)).scalars().first()
    assert alert is not None
    assert alert.alert_type.value == "PAYMENT_ENDPOINT_REUSED"
