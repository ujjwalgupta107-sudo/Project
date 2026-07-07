import asyncio, json
from app.db.session import async_session_maker
from app.models.user import User
from sqlalchemy import select

async def run():
    async with async_session_maker() as db:
        res = await db.execute(select(User))
        users = res.scalars().all()
        print(json.dumps([{ 'email': u.email, 'hash': u.password_hash } for u in users], indent=2))

asyncio.run(run())
