import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_cases_me_unauthorized(async_client: AsyncClient):
    response = await async_client.get("/api/v1/cases/me")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_clusters_list_unauthorized(async_client: AsyncClient):
    response = await async_client.get("/api/v1/clusters/")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_cluster_detail_unauthorized(async_client: AsyncClient):
    response = await async_client.get("/api/v1/clusters/123e4567-e89b-12d3-a456-426614174000")
    assert response.status_code == 401
