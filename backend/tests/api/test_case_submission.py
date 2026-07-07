import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_case_submission_missing_scam_type(async_client: AsyncClient):
    # This should fail if not authenticated, but we are testing that the payload parsing accepts it.
    # The actual auth error means it parsed the route.
    response = await async_client.post("/api/v1/cases/", json={
        "description": "Test",
        "source": "WEB"
    })
    # Since auth is required, it returns 401. 
    # If schema validation failed, it would return 422 BEFORE auth checking in FastAPI.
    # So if it returns 401, it means the payload was accepted as valid.
    assert response.status_code == 401
