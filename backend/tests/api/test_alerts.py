import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_alerts_unauthorized(async_client: AsyncClient):
    response = await async_client.get("/api/v1/alerts/")
    assert response.status_code == 401
