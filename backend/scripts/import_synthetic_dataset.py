import asyncio
import sys
import os
import json
import time
from datetime import datetime, timezone

from sqlalchemy import select, update

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.session import async_session_maker
from app.models.case import Case, ScamType, CaseTimelineEvent
from app.models.user import User, UserRole
from app.schemas.case import CaseCreate
from app.services.case_service import CaseService
from app.repositories.user_repository import UserRepository

async def get_or_create_system_user(db):
    user_repo = UserRepository(db)
    user = await user_repo.get_by_email("importer@kavach.ai")
    if not user:
        user = User(
            email="importer@kavach.ai",
            full_name="System Importer",
            password_hash="importer_hash",
            role=UserRole.CITIZEN
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user

async def import_dataset():
    filepath = "kavach_synthetic_cases.jsonl"
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        return

    start_time = time.time()
    
    async with async_session_maker() as db:
        reporter = await get_or_create_system_user(db)
        case_service = CaseService(db)
        
        # 1. Check idempotency
        stmt = select(Case.report_location).where(Case.report_location.startswith("SYNTHETIC:"))
        result = await db.execute(stmt)
        existing_ids = {row[0].replace("SYNTHETIC:", "") for row in result.all() if row[0]}
        
        successful = 0
        skipped = 0
        failed = 0
        
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
            
        total_records = len(lines)
        print(f"Starting import of {total_records} records...")
        
        for idx, line in enumerate(lines, 1):
            if not line.strip():
                continue
            
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                failed += 1
                continue
                
            ext_id = record.get("external_id")
            if ext_id in existing_ids:
                skipped += 1
                continue
                
            # Create Case
            # Default to OTHER if mapping fails, though heuristics will overwrite
            scam_type_val = record.get("ground_truth_category", "OTHER")
            # Map known categories to ScamType enum where possible
            if scam_type_val == "DIGITAL_ARREST":
                mapped_scam_type = ScamType.DIGITAL_ARREST
            elif scam_type_val == "UPI_PAYMENT":
                mapped_scam_type = ScamType.UPI_FRAUD
            elif scam_type_val == "INVESTMENT":
                mapped_scam_type = ScamType.INVESTMENT_SCAM
            elif scam_type_val == "COURIER_CUSTOMS":
                mapped_scam_type = ScamType.COURIER_CUSTOMS_SCAM
            elif scam_type_val == "JOB_TASK":
                mapped_scam_type = ScamType.JOB_SCAM
            else:
                mapped_scam_type = ScamType.OTHER

            case_in = CaseCreate(
                scam_type=mapped_scam_type,
                description=record.get("message_text", ""),
                city=record.get("city")
            )
            
            try:
                # This executes the entire pipeline
                case = await case_service.create_case(case_in, reporter)
                
                # Backdate and tag as synthetic
                # Fix timestamp format for Python <= 3.10 if needed, but 3.11+ supports Z
                reported_at_str = record["reported_at"].replace("Z", "+00:00")
                reported_at = datetime.fromisoformat(reported_at_str)
                
                case.report_location = f"SYNTHETIC:{ext_id}"
                case.created_at = reported_at
                case.updated_at = reported_at
                
                db.add(case)
                
                # Update timeline events
                await db.execute(
                    update(CaseTimelineEvent)
                    .where(CaseTimelineEvent.case_id == case.id)
                    .values(created_at=reported_at)
                )
                
                await db.commit()
                successful += 1
            except Exception as e:
                print(f"Failed to import {ext_id}: {str(e)}")
                await db.rollback()
                failed += 1
                
            if idx % 50 == 0 or idx == total_records:
                print(f"Imported {successful}/{total_records} (Skipped: {skipped}, Failed: {failed})")

        duration = time.time() - start_time
        print("\n=== IMPORT COMPLETE ===")
        print(f"Total processed: {total_records}")
        print(f"Successful: {successful}")
        print(f"Skipped: {skipped}")
        print(f"Failed: {failed}")
        print(f"Duration: {duration:.2f} seconds")
        if successful > 0:
            print(f"Avg time per record: {duration/successful:.2f} seconds")

if __name__ == "__main__":
    asyncio.run(import_dataset())
