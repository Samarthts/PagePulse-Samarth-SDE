import pytest
from unittest.mock import patch, AsyncMock
import httpx
from fastapi.testclient import TestClient

def test_health_check_endpoint(client: TestClient):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Page Pulse API"

def test_analyze_invalid_url_format(client: TestClient):
    response = client.post("/analyze", json={"url": "not_a_valid_url_@@@"})
    assert response.status_code == 400
    data = response.json()
    assert data["error"] is True
    assert "Invalid URL" in data["message"]

@patch("app.services.analyzer.httpx.AsyncClient.get")
def test_analyze_happy_path(mock_get, client: TestClient, sample_html):
    # Mock httpx response
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.url = "https://example.com"
    mock_response.text = sample_html
    mock_response.headers = {"content-type": "text/html; charset=utf-8", "server": "nginx"}
    mock_get.return_value = mock_response

    response = client.post("/analyze", json={"url": "https://example.com"})
    assert response.status_code == 200
    data = response.json()
    
    assert data["status"] == 200
    assert "ms" in data["response_time"]
    assert data["title"] == "Test Domain - Audit Page"
    assert data["meta_description"] == "This is a comprehensive test meta description for Page Pulse audit testing."
    assert data["h1_count"] == 1
    assert data["missing_alt_images"] == 2  # one empty alt, one missing alt
    assert data["word_count"] > 0
    assert data["seo_score"] > 0
    assert data["favicon"] == "https://example.com/assets/favicon.png"
    assert data["https_status"] is True

@patch("app.services.analyzer.httpx.AsyncClient.get")
def test_analyze_timeout_error(mock_get, client: TestClient):
    mock_get.side_effect = httpx.TimeoutException("Request timed out")

    response = client.post("/analyze", json={"url": "https://slow-website.com"})
    assert response.status_code == 504
    data = response.json()
    assert data["error"] is True
    assert "timed out" in data["detail"].lower()

@patch("app.services.analyzer.httpx.AsyncClient.get")
def test_analyze_non_html_response(mock_get, client: TestClient):
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.url = "https://example.com/document.pdf"
    mock_response.headers = {"content-type": "application/pdf"}
    mock_get.return_value = mock_response

    response = client.post("/analyze", json={"url": "https://example.com/document.pdf"})
    assert response.status_code == 415
    data = response.json()
    assert data["error"] is True
    assert "non-html" in data["detail"].lower()
