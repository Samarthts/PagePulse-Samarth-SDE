import pytest
from bs4 import BeautifulSoup
from app.utils.helpers import calculate_seo_score, extract_favicon_url, extract_body_word_count

def test_calculate_seo_score_perfect():
    score = calculate_seo_score(
        status_code=200,
        is_https=True,
        title="Optimal Page Title For SEO Testing Purposes",
        meta_desc="This is an optimal meta description that falls right in the sweet spot between 50 and 160 characters long.",
        h1_count=1,
        missing_alt_images=0,
        word_count=450
    )
    assert score == 100

def test_calculate_seo_score_suboptimal():
    score = calculate_seo_score(
        status_code=404,
        is_https=False,
        title="",
        meta_desc=None,
        h1_count=0,
        missing_alt_images=5,
        word_count=50
    )
    assert score < 30

def test_extract_favicon_url_from_html(sample_html):
    soup = BeautifulSoup(sample_html, "html.parser")
    base_url = "https://example.com/subpath"
    favicon = extract_favicon_url(soup, base_url)
    assert favicon == "https://example.com/assets/favicon.png"

def test_extract_favicon_url_fallback():
    soup = BeautifulSoup("<html><head></head><body></body></html>", "html.parser")
    base_url = "https://example.com"
    favicon = extract_favicon_url(soup, base_url)
    assert favicon == "https://example.com/favicon.ico"

def test_extract_body_word_count(sample_html):
    soup = BeautifulSoup(sample_html, "html.parser")
    count = extract_body_word_count(soup)
    # Nav/header words stripped, body words counted
    assert count > 5
