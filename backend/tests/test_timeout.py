import pytest
from unittest.mock import patch
import httpx
from fastapi.testclient import TestClient

@pytest.mark.parametrize("timeout_exception, expected_status, expected_msg_keyword", [
    (httpx.TimeoutException("Generic timeout"), 504, "timed out"),
    (httpx.ReadTimeout("Read socket timeout"), 504, "timed out"),
    (httpx.WriteTimeout("Write socket timeout"), 504, "timed out"),
])
@pytest.mark.unit
def test_analyze_target_server_timeouts(client: TestClient, timeout_exception: Exception, expected_status: int, expected_msg_keyword: str):
    """
    Parametrized test for target server timeouts (httpx.TimeoutException, ReadTimeout, WriteTimeout).
    Verifies API returns HTTP 504 Gateway Timeout with detailed error payload.
    """
    # ACT
    with patch("httpx.AsyncClient.get", side_effect=timeout_exception):
        response = client.post("/analyze", json={"url": "https://slow-unresponsive-site.com"})
        
    # ASSERT
    assert response.status_code == expected_status
    data = response.json()
    assert data["error"] is True
    assert data["status_code"] == 504
    assert data["message"] == "Gateway Timeout"
    assert expected_msg_keyword in data["detail"].lower()

@pytest.mark.parametrize("connect_exception, expected_status", [
    (httpx.ConnectTimeout("TCP Connection timeout"), 502),
    (httpx.ConnectError("DNS resolution failed"), 502),
])
@pytest.mark.unit
def test_analyze_connection_failures(client: TestClient, connect_exception: Exception, expected_status: int):
    """
    Parametrized test for network connectivity failures (httpx.ConnectTimeout, httpx.ConnectError).
    Verifies API returns HTTP 502 Bad Gateway.
    """
    # ACT
    with patch("httpx.AsyncClient.get", side_effect=connect_exception):
        response = client.post("/analyze", json={"url": "https://unreachable-host-domain.com"})
        
    # ASSERT
    assert response.status_code == expected_status
    data = response.json()
    assert data["error"] is True
    assert data["status_code"] == 502
    assert "connection" in data["detail"].lower() or "host" in data["detail"].lower()
