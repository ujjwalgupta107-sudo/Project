import asyncio
import asyncpg
import json

async def verify_db():
    conn = await asyncpg.connect("postgresql://postgres:postgres@localhost:5432/kavach_dev")
    users = await conn.fetch("SELECT id, email, role FROM users")
    print(json.dumps([dict(u) for u in users], indent=2, default=str))
    await conn.close()

if __name__ == "__main__":
    asyncio.run(verify_db())
