import pytest
from unittest.mock import patch, AsyncMock
import httpx
from fastapi.testclient import TestClient

@pytest.mark.unit
def test_successful_website_analysis(client: TestClient, sample_html: str):
    """
    Test POST /analyze happy path with mocked httpx async response.
    Verifies 200 OK payload, DOM extraction, latency, headers, and SEO score.
    Follows Arrange-Act-Assert (AAA) pattern.
    """
    # ARRANGE
    mock_response = AsyncMock(spec=httpx.Response)
    mock_response.status_code = 200
    mock_response.url = "https://example.com"
    mock_response.headers = {
        "content-type": "text/html; charset=utf-8",
        "server": "nginx/1.24.0",
        "cache-control": "max-age=3600",
        "strict-transport-security": "max-age=31536000"
    }
    mock_response.text = sample_html

    # ACT
    with patch("httpx.AsyncClient.get", return_value=mock_response):
        response = client.post("/analyze", json={"url": "https://example.com"})

    # ASSERT
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == 200
    assert "ms" in data["response_time"]
    assert data["title"] == "Test Domain - Audit Page"
    assert data["meta_description"] == "This is a comprehensive test meta description for Page Pulse audit testing."
    assert data["h1_count"] == 1
    assert data["missing_alt_images"] == 2  # 1 missing alt attribute + 1 empty alt attribute
    assert data["word_count"] > 10
    assert data["https_status"] is True
    assert "content-type" in data["response_headers"]
    assert "strict-transport-security" in data["response_headers"]
    assert isinstance(data["seo_score"], int)
    assert 0 <= data["seo_score"] <= 100
    assert "timestamp" in data

@pytest.mark.parametrize("html_snippet, expected_title, expected_h1", [
    ("<html><head><title>Custom Title</title></head><body><h1>Main Title</h1></body></html>", "Custom Title", 1),
    ("<html><head></head><body><h1>First H1</h1><h1>Second H1</h1></body></html>", None, 2),
    ("<html><head><title>  Spaced Title  </title></head><body></body></html>", "Spaced Title", 0),
])
@pytest.mark.unit
def test_successful_analysis_dom_variants(client: TestClient, html_snippet: str, expected_title: str, expected_h1: int):
    """
    Parametrized test for HTML DOM structural variants (missing titles, multiple H1s, whitespace).
    """
    # ARRANGE
    mock_response = AsyncMock(spec=httpx.Response)
    mock_response.status_code = 200
    mock_response.url = "https://testdomain.org"
    mock_response.headers = {"content-type": "text/html"}
    mock_response.text = html_snippet

    # ACT
    with patch("httpx.AsyncClient.get", return_value=mock_response):
        response = client.post("/analyze", json={"url": "https://testdomain.org"})

    # ASSERT
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == expected_title
    assert data["h1_count"] == expected_h1
