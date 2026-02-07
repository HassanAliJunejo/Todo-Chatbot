import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_read_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()