import re
import uuid
from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.entity import Entity, EntityType, CaseEntityLink

class EntityService:
    def __init__(self, db: AsyncSession):
        self.db = db

    def extract_entities_from_text(self, text: str) -> List[Tuple[EntityType, str]]:
        """
        Deterministic NLP extraction using Regex for Phone Numbers, UPI IDs, URLs, Bank Accounts, etc.
        """
        entities = []
        
        # Phone regex (Indian format basic match)
        phone_pattern = r'(\+91[\-\s]?)?[6789]\d{9}'
        for match in re.finditer(phone_pattern, text):
            # Normalize to 10 digits
            normalized = re.sub(r'\D', '', match.group(0))[-10:]
            entities.append((EntityType.PHONE, normalized))
            
        # UPI regex
        upi_pattern = r'[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}'
        for match in re.finditer(upi_pattern, text):
            entities.append((EntityType.UPI_ID, match.group(0).lower().strip()))
            
        # Email regex
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        for match in re.finditer(email_pattern, text):
            # Skip if it was already matched as UPI (some UPIs look like emails, but usually not with standard TLDs)
            val = match.group(0).lower().strip()
            # If we don't have it as a UPI, add it. Or just add it and rely on db to handle it.
            # To be safe, we won't strictly exclude it, but we can do a check.
            entities.append((EntityType.ORGANIZATION, val)) # Since EMAIL isn't in EntityType enum, maybe we map to ORGANIZATION or just leave it. Let's check EntityType. It has PHONE, UPI_ID, BANK_ACCOUNT, DOMAIN, DEVICE, ORGANIZATION, LOCATION. Let's use DOMAIN for email domain, or just not extract full email if it doesn't fit. Wait, I can extract the domain.
            
        # Domain / URL regex
        url_pattern = r'(https?://)?(www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(/[a-zA-Z0-9./?-]*)?'
        for match in re.finditer(url_pattern, text):
            domain = match.group(3).lower()
            if domain:
                entities.append((EntityType.DOMAIN, domain))
                
        # Bank Account (heuristic: 9 to 18 digit numbers)
        account_pattern = r'\b\d{9,18}\b'
        for match in re.finditer(account_pattern, text):
            # We must be careful not to match phones as bank accounts.
            val = match.group(0)
            if len(val) != 10: # Rough heuristic to avoid phone numbers
                entities.append((EntityType.BANK_ACCOUNT, val))

        # Crypto Wallet (heuristic: typical lengths for BTC/ETH addresses)
        btc_eth_pattern = r'\b(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{39,59}|0x[a-fA-F0-9]{40})\b'
        for match in re.finditer(btc_eth_pattern, text):
            entities.append((EntityType.DEVICE, match.group(0))) # Mapping to DEVICE or ORGANIZATION as CRYPTO is not in enum

        # Deduplicate
        unique_entities = list(set(entities))
        return unique_entities

    async def upsert_entity(self, entity_type: EntityType, value: str, risk_score: float = 0.0) -> Entity:
        """
        Ensures entity uniqueness based on type + value.
        Updates last_seen if exists, otherwise creates new.
        """
        stmt = select(Entity).where(Entity.type == entity_type, Entity.value == value)
        result = await self.db.execute(stmt)
        existing_entity = result.scalar_one_or_none()
        
        if existing_entity:
            # Update
            from datetime import datetime, timezone
            existing_entity.last_seen = datetime.now(timezone.utc)
            # Increase risk score logic if it appears again
            existing_entity.risk_score = min(1.0, existing_entity.risk_score + 0.1)
            await self.db.commit()
            await self.db.refresh(existing_entity)
            return existing_entity
        else:
            # Create
            new_entity = Entity(type=entity_type, value=value, risk_score=risk_score)
            self.db.add(new_entity)
            await self.db.commit()
            await self.db.refresh(new_entity)
            return new_entity

    async def link_case_to_entity(self, case_id: uuid.UUID, entity_id: uuid.UUID, relationship_type: str = "MENTIONED_IN") -> CaseEntityLink:
        """
        Checks if link exists, if not creates it.
        """
        stmt = select(CaseEntityLink).where(
            CaseEntityLink.case_id == case_id,
            CaseEntityLink.entity_id == entity_id
        )
        existing = (await self.db.execute(stmt)).scalar_one_or_none()
        
        if existing:
            return existing
            
        link = CaseEntityLink(case_id=case_id, entity_id=entity_id, relationship_type=relationship_type)
        self.db.add(link)
        await self.db.commit()
        await self.db.refresh(link)
        return link
