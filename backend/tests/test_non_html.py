import pytest
from unittest.mock import patch, AsyncMock
import httpx
from fastapi.testclient import TestClient

@pytest.mark.parametrize("content_type, resource_url", [
    ("application/pdf", "https://example.com/document.pdf"),
    ("image/png", "https://example.com/logo.png"),
    ("image/jpeg", "https://example.com/photo.jpg"),
    ("application/json", "https://example.com/api/v1/data.json"),
    ("video/mp4", "https://example.com/video.mp4"),
    ("text/plain", "https://example.com/notes.txt"),
    ("application/zip", "https://example.com/archive.zip"),
])
@pytest.mark.unit
def test_analyze_non_html_content_types(client: TestClient, content_type: str, resource_url: str):
    """
    Parametrized test verifying HTTP 415 Unsupported Media Type for non-HTML responses.
    Covering PDF, PNG, JPEG, JSON, MP4, Plain Text, and ZIP files.
    """
    # ARRANGE
    mock_response = AsyncMock(spec=httpx.Response)
    mock_response.status_code = 200
    mock_response.url = resource_url
    mock_response.headers = {"content-type": content_type}

    # ACT
    with patch("httpx.AsyncClient.get", return_value=mock_response):
        response = client.post("/analyze", json={"url": resource_url})
        
    # ASSERT
    assert response.status_code == 415
    data = response.json()
    assert data["error"] is True
    assert data["status_code"] == 415
    assert "non-html" in data["detail"].lower()
