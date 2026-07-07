import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from app.models.alert import Alert, AlertType, AlertSeverity
from app.models.case import Case, RiskLevel
from app.models.entity import Entity

class AlertService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_alerts(self, limit: int = 50, acknowledged: Optional[bool] = None) -> List[Alert]:
        stmt = select(Alert).order_by(Alert.created_at.desc()).limit(limit)
        if acknowledged is not None:
            stmt = stmt.where(Alert.is_acknowledged == acknowledged)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def acknowledge_alert(self, alert_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Alert]:
        alert = await self.db.get(Alert, alert_id)
        if alert:
            alert.is_acknowledged = True
            alert.acknowledged_by = user_id
            alert.acknowledged_at = datetime.now(timezone.utc)
            await self.db.commit()
            await self.db.refresh(alert)
        return alert

    async def evaluate_case_alerts(self, case: Case):
        """Evaluate alerts related directly to a case."""
        if case.status == "CLOSED":
            return

        # Check HIGH_RISK_CASE
        if case.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL] and case.risk_score >= 0.7:
            # Check if we already alerted for this case to prevent spam
            stmt = select(Alert).where(Alert.case_id == case.id, Alert.alert_type == AlertType.HIGH_RISK_CASE)
            existing = (await self.db.execute(stmt)).scalar_one_or_none()
            if not existing:
                await self.generate_alert(
                    alert_type=AlertType.HIGH_RISK_CASE,
                    severity=AlertSeverity.CRITICAL if case.risk_level == RiskLevel.CRITICAL else AlertSeverity.HIGH,
                    title=f"High Risk Case Detected: {case.scam_type.value}",
                    description=f"Case reported with risk score {case.risk_score:.2f}.",
                    case_id=case.id
                )

        # Check for reappearing entities / reused endpoints
        # We need to look at entities linked to this case
        from app.models.entity import CaseEntityLink
        from sqlalchemy import func

        stmt = select(CaseEntityLink.entity_id).where(CaseEntityLink.case_id == case.id)
        entity_ids = (await self.db.execute(stmt)).scalars().all()

        for eid in entity_ids:
            # Check how many cases this entity is linked to
            count_stmt = select(func.count(CaseEntityLink.id)).where(CaseEntityLink.entity_id == eid)
            count = (await self.db.execute(count_stmt)).scalar()
            
            if count and count > 1:
                entity = await self.db.get(Entity, eid)
                if not entity:
                    continue
                    
                alert_type = AlertType.PAYMENT_ENDPOINT_REUSED if entity.type in [
                    "UPI_ID", "BANK_ACCOUNT"
                ] else AlertType.ENTITY_REAPPEARED
                
                # Check if we already alerted this entity recently (e.g. for this specific case)
                alert_stmt = select(Alert).where(Alert.entity_id == eid, Alert.alert_type == alert_type)
                # To prevent spam, let's only alert if we haven't alerted for this entity in this context.
                # Actually, if we alert once when it crosses >1, that might be enough, but let's alert if it's not already linked to this case's alerts
                existing_alert = (await self.db.execute(alert_stmt)).scalar_one_or_none()
                
                if not existing_alert:
                     await self.generate_alert(
                        alert_type=alert_type,
                        severity=AlertSeverity.HIGH,
                        title=f"{alert_type.value}: {entity.value}",
                        description=f"Entity {entity.value} ({entity.type.value}) appeared in {count} cases.",
                        case_id=case.id,
                        entity_id=eid,
                        cluster_id=entity.cluster_id
                    )

    async def generate_alert(self, alert_type: AlertType, severity: AlertSeverity, title: str, description: str, case_id: Optional[uuid.UUID] = None, entity_id: Optional[uuid.UUID] = None, cluster_id: Optional[uuid.UUID] = None) -> Alert:
        alert = Alert(
            alert_type=alert_type,
            severity=severity,
            title=title,
            description=description,
            case_id=case_id,
            entity_id=entity_id,
            cluster_id=cluster_id
        )
        self.db.add(alert)
        await self.db.commit()
        await self.db.refresh(alert)
        return alert
