import time
import datetime
import ssl
import httpx
from bs4 import BeautifulSoup
from fastapi import HTTPException, status
from app.config.config import settings
from app.schemas.audit import AuditResponse
from app.utils.helpers import calculate_seo_score, extract_favicon_url, extract_body_word_count

class WebsiteAnalyzerService:
    """
    Core service responsible for fetching, timing, and parsing target URLs.
    Handles network errors, SSL errors, timeouts, non-HTML responses, and missing metadata.
    """

    async def analyze_url(self, target_url: str) -> AuditResponse:
        start_time = time.perf_counter()
        
        headers = {
            "User-Agent": settings.USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }

        try:
            async with httpx.AsyncClient(
                follow_redirects=True,
                max_redirects=settings.MAX_REDIRECTS,
                verify=True,
                timeout=httpx.Timeout(settings.HTTP_TIMEOUT_SECONDS)
            ) as client:
                response = await client.get(target_url, headers=headers)
                elapsed_ms = round((time.perf_counter() - start_time) * 1000)

        except (httpx.ConnectError, httpx.ConnectTimeout):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Unable to establish connection to host. Check if the URL domain is correct and active."
            )
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Request timed out while connecting to target URL. The server took too long to respond."
            )
        except (httpx.SSLError, ssl.SSLError):
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="SSL certificate error. Target website has invalid or untrusted SSL configuration."
            )
        except httpx.HTTPError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Network error occurred while fetching target URL: {str(exc)}"
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected server error during website fetch: {str(exc)}"
            )

        # Validate Content-Type
        content_type = response.headers.get("content-type", "").lower()
        if content_type and "text/html" not in content_type and "application/xhtml+xml" not in content_type:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"The URL returned a non-HTML response ({content_type.split(';')[0]}). Page Pulse can only audit HTML web pages."
            )

        # Parse HTML content
        html_content = response.text or ""
        soup = BeautifulSoup(html_content, "html.parser")

        # 1. Page Title
        title_tag = soup.find("title")
        title = title_tag.get_text().strip() if title_tag and title_tag.get_text() else None

        # 2. Meta Description
        meta_desc = None
        meta_desc_tag = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
        if meta_desc_tag and meta_desc_tag.get("content"):
            meta_desc = meta_desc_tag["content"].strip()

        # 3. H1 Count
        h1_tags = soup.find_all("h1")
        h1_count = len(h1_tags)

        # 4. Images missing alt text
        images = soup.find_all("img")
        missing_alt_images = 0
        for img in images:
            alt = img.get("alt")
            if alt is None or not str(alt).strip():
                missing_alt_images += 1

        # 5. Word Count
        word_count = extract_body_word_count(soup)

        # 6. Favicon URL
        favicon_url = extract_favicon_url(soup, str(response.url))

        # 7. HTTPS Status
        is_https = str(response.url).startswith("https://")

        # 8. Key Response Headers
        important_headers = [
            "content-type", "server", "cache-control", "strict-transport-security",
            "x-frame-options", "x-content-type-options", "content-encoding"
        ]
        headers_dict = {
            k: v for k, v in response.headers.items() if k.lower() in important_headers
        }

        # 9. Calculate SEO score
        seo_score = calculate_seo_score(
            status_code=response.status_code,
            is_https=is_https,
            title=title,
            meta_desc=meta_desc,
            h1_count=h1_count,
            missing_alt_images=missing_alt_images,
            word_count=word_count
        )

        timestamp_iso = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        return AuditResponse(
            status=response.status_code,
            response_time=f"{elapsed_ms} ms",
            title=title,
            meta_description=meta_desc,
            h1_count=h1_count,
            missing_alt_images=missing_alt_images,
            word_count=word_count,
            favicon=favicon_url,
            https_status=is_https,
            response_headers=headers_dict,
            seo_score=seo_score,
            timestamp=timestamp_iso
        )

analyzer_service = WebsiteAnalyzerService()
