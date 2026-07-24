from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from typing import Optional

def calculate_seo_score(
    status_code: int,
    is_https: bool,
    title: Optional[str],
    meta_desc: Optional[str],
    h1_count: int,
    missing_alt_images: int,
    word_count: int
) -> int:
    """
    Computes a deterministic basic SEO health score out of 100 based on core page metrics.
    """
    score = 0

    # 1. HTTP Status Code (Max 20 pts)
    if status_code == 200:
        score += 20
    elif status_code < 400:
        score += 10

    # 2. HTTPS Security (Max 15 pts)
    if is_https:
        score += 15

    # 3. Title Tag Quality (Max 15 pts)
    if title:
        title_len = len(title.strip())
        if 10 <= title_len <= 70:
            score += 15
        elif title_len > 0:
            score += 8

    # 4. Meta Description Quality (Max 15 pts)
    if meta_desc:
        desc_len = len(meta_desc.strip())
        if 50 <= desc_len <= 160:
            score += 15
        elif desc_len > 0:
            score += 8

    # 5. H1 Structure (Max 15 pts)
    if h1_count == 1:
        score += 15
    elif h1_count > 1:
        score += 8

    # 6. Image Accessibility / Alt Tags (Max 10 pts)
    if missing_alt_images == 0:
        score += 10
    else:
        score += max(0, 10 - (missing_alt_images * 2))

    # 7. Content Depth / Word Count (Max 10 pts)
    if word_count >= 300:
        score += 10
    elif word_count >= 100:
        score += 5

    return min(100, max(0, score))


def extract_favicon_url(soup: BeautifulSoup, base_url: str) -> str:
    """
    Extracts favicon URL from HTML meta/link tags or falls back to domain standard /favicon.ico.
    """
    parsed = urlparse(base_url)
    default_favicon = f"{parsed.scheme}://{parsed.netloc}/favicon.ico"

    if not soup:
        return default_favicon

    icon_link = soup.find("link", rel=lambda x: x and "icon" in x.lower())
    if icon_link and icon_link.get("href"):
        href = icon_link["href"].strip()
        return urljoin(base_url, href)

    return default_favicon


def extract_body_word_count(soup: BeautifulSoup) -> int:
    """
    Strips script, style, header, footer elements and calculates clean body text word count.
    """
    if not soup:
        return 0

    soup_copy = BeautifulSoup(str(soup), "html.parser")
    for element in soup_copy(["script", "style", "nav", "noscript", "svg", "header", "footer"]):
        element.extract()

    text = soup_copy.get_text(separator=" ")
    words = text.split()
    return len(words)
