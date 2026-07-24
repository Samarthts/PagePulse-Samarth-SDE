import pytest
from fastapi.testclient import TestClient

@pytest.mark.parametrize("invalid_url, expected_status", [
    ("invalid-url-string-without-domain", 400),
    ("", 400),
    ("   ", 400),
    ("http://", 400),
    ("https://", 400),
    ("ftp://invalid-protocol.com", 400),
    ("http://..com", 400),
    ("javascript:alert(1)", 400),
])
@pytest.mark.unit
def test_analyze_invalid_url_inputs(client: TestClient, invalid_url: str, expected_status: int):
    """
    Parametrized test checking malformed, empty, improper protocol, and script injection URLs.
    Verifies API returns HTTP 400 Bad Request error payload.
    """
    # ACT
    response = client.post("/analyze", json={"url": invalid_url})

    # ASSERT
    assert response.status_code == expected_status
    data = response.json()
    assert data["error"] is True
    assert data["status_code"] == 400
    assert "message" in data or "detail" in data

@pytest.mark.unit
def test_analyze_missing_url_field(client: TestClient):
    """
    Test POST /analyze with missing 'url' key in JSON payload.
    Expect HTTP 400 Bad Request validation error.
    """
    response = client.post("/analyze", json={})
    assert response.status_code == 400
    
    data = response.json()
    assert data["error"] is True
    assert data["status_code"] == 400

@pytest.mark.unit
def test_analyze_non_string_url_types(client: TestClient):
    """
    Test POST /analyze with non-string URL types (integer, boolean, list).
    Expect HTTP 400 Bad Request validation error.
    """
    for invalid_payload in [12345, True, ["https://example.com"]]:
        response = client.post("/analyze", json={"url": invalid_payload})
        assert response.status_code == 400
        data = response.json()
        assert data["error"] is True
