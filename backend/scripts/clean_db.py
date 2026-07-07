import asyncio
import sys
import os
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.db.session import async_session_maker

async def clear():
    async with async_session_maker() as db:
        await db.execute(text('TRUNCATE TABLE cases, entities, fraud_clusters, alerts CASCADE;'))
        await db.commit()
        print('Database application tables cleared successfully.')

if __name__ == '__main__':
    asyncio.run(clear())
