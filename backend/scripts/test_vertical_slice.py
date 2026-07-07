import asyncio
import sys
import os
from datetime import datetime, timezone
from sqlalchemy import select, func

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import async_session_maker
from app.models.user import User, UserRole
from app.models.case import Case, ScamType
from app.models.entity import Entity, CaseEntityLink, FraudCluster
from app.models.alert import Alert
from app.models.analysis import AnalysisResult, RedFlag
from app.schemas.case import CaseCreate
from app.services.case_service import CaseService

async def main():
    async with async_session_maker() as db:
        # Create a test citizen
        test_user = User(email=f"citizen_{datetime.now().timestamp()}@test.com", full_name="Test Citizen", password_hash="pw", role=UserRole.CITIZEN)
        db.add(test_user)
        await db.commit()
        await db.refresh(test_user)

        case_service = CaseService(db)

        print("\n--- TEST A: HIGH-RISK DIGITAL ARREST ---")
        msg_a = "This is CBI. A parcel linked to your Aadhaar contains illegal substances. Do not tell your family. Transfer Rs 50,000 to secureverify@upi for verification or you will be arrested."
        case_a_in = CaseCreate(scam_type=ScamType.OTHER, description=msg_a)
        case_a = await case_service.create_case(case_a_in, test_user)
        print(f"Case A created: {case_a.id}")
        print(f"Risk Score: {case_a.risk_score}, Level: {case_a.risk_level}, Scam Type: {case_a.scam_type.value}")

        print("\n--- TEST B: SECOND CASE WITH SHARED INFRASTRUCTURE ---")
        msg_b = "Urgent! Pay your electricity bill to secureverify@upi immediately or we will cut power."
        case_b_in = CaseCreate(scam_type=ScamType.OTHER, description=msg_b)
        case_b = await case_service.create_case(case_b_in, test_user)
        print(f"Case B created: {case_b.id}")
        print(f"Risk Score: {case_b.risk_score}, Level: {case_b.risk_level}, Scam Type: {case_b.scam_type.value}")

        print("\n--- TEST C: BENIGN MESSAGE ---")
        msg_c = "Hey, just checking in to see if you want to get lunch later today."
        case_c_in = CaseCreate(scam_type=ScamType.OTHER, description=msg_c)
        case_c = await case_service.create_case(case_c_in, test_user)
        print(f"Case C created: {case_c.id}")
        print(f"Risk Score: {case_c.risk_score}, Level: {case_c.risk_level}, Scam Type: {case_c.scam_type.value}")

        print("\n--- TEST D: FORMATTING NORMALIZATION ---")
        msg_d = "Send funds to SeCuReVeRiFy@UPI now or face consequences."
        case_d_in = CaseCreate(scam_type=ScamType.OTHER, description=msg_d)
        case_d = await case_service.create_case(case_d_in, test_user)
        print(f"Case D created: {case_d.id}")
        print(f"Risk Score: {case_d.risk_score}, Level: {case_d.risk_level}, Scam Type: {case_d.scam_type.value}")

        print("\n=== DATABASE EVIDENCE ===")
        cases = (await db.execute(select(func.count(Case.id)))).scalar()
        print(f"Total Cases: {cases}")

        analysis = (await db.execute(select(func.count(AnalysisResult.id)))).scalar()
        print(f"Total Analysis Results: {analysis}")

        flags = (await db.execute(select(func.count(RedFlag.id)))).scalar()
        print(f"Total Red Flags: {flags}")

        entities = (await db.execute(select(func.count(Entity.id)))).scalar()
        print(f"Total Entities: {entities}")

        links = (await db.execute(select(func.count(CaseEntityLink.id)))).scalar()
        print(f"Total CaseEntityLinks: {links}")

        alerts = (await db.execute(select(func.count(Alert.id)))).scalar()
        print(f"Total Alerts: {alerts}")
        
        clusters = (await db.execute(select(func.count(FraudCluster.id)))).scalar()
        print(f"Total Fraud Clusters: {clusters}")

        print("\n--- SPECIFIC SHARED ENTITY CHECK ---")
        stmt = select(Entity).where(Entity.value == "secureverify@upi")
        shared_entity = (await db.execute(stmt)).scalar_one_or_none()
        if shared_entity:
            print(f"Shared Entity found: {shared_entity.value} (ID: {shared_entity.id})")
            link_count = (await db.execute(select(func.count(CaseEntityLink.id)).where(CaseEntityLink.entity_id == shared_entity.id))).scalar()
            print(f"Number of linked cases to this entity: {link_count}")
        else:
            print("Shared Entity secureverify@upi NOT FOUND!")
            
        print("\n--- ALERT TRIGGERS ---")
        stmt = select(Alert).order_by(Alert.created_at.desc()).limit(10)
        alerts_list = (await db.execute(stmt)).scalars().all()
        for a in alerts_list:
            print(f"Alert: {a.alert_type.value} | {a.title} | {a.description}")

if __name__ == "__main__":
    asyncio.run(main())
