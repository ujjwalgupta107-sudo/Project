import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_cases_unauthorized(async_client: AsyncClient):
    # Without auth token, this should fail with 401
    response = await async_client.get("/api/v1/cases/")
    assert response.status_code == 401
    
# More tests would follow when auth fixtures are injected
