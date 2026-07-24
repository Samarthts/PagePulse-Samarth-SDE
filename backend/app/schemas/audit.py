from typing import Dict, Optional
from pydantic import BaseModel, Field, field_validator
import re

class AuditRequest(BaseModel):
    url: str = Field(
        ...,
        description="The full target website URL to audit (must start with http:// or https://)",
        json_schema_extra={"example": "https://example.com"}
    )

    @field_validator("url")
    @classmethod
    def validate_url_format(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("URL cannot be empty.")
        if not re.match(r"^https?://", v, re.IGNORECASE):
            v = "https://" + v
        
        url_regex = re.compile(
            r"^https?://"
            r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"
            r"localhost|"
            r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"
            r"(?::\d+)?"
            r"(?:/?|[/?]\S+)$", re.IGNORECASE
        )
        if not url_regex.match(v):
            raise ValueError("Invalid URL structure. Example: https://example.com")
        return v

class AuditResponse(BaseModel):
    status: int = Field(..., description="HTTP response status code", json_schema_extra={"example": 200})
    response_time: str = Field(..., description="Webpage response time in milliseconds", json_schema_extra={"example": "245 ms"})
    title: Optional[str] = Field(None, description="Page title tag text", json_schema_extra={"example": "Example Domain"})
    meta_description: Optional[str] = Field(None, description="Meta description tag content", json_schema_extra={"example": "Example Description"})
    h1_count: int = Field(0, description="Total number of H1 tags on page", json_schema_extra={"example": 1})
    missing_alt_images: int = Field(0, description="Number of img tags missing non-empty alt text", json_schema_extra={"example": 4})
    word_count: int = Field(0, description="Approximate word count of page body text", json_schema_extra={"example": 1256})
    
    # Bonus Fields
    favicon: Optional[str] = Field(None, description="Extracted website favicon URL", json_schema_extra={"example": "https://example.com/favicon.ico"})
    https_status: bool = Field(True, description="Whether target URL uses secure HTTPS protocol", json_schema_extra={"example": True})
    response_headers: Dict[str, str] = Field(default_factory=dict, description="Key response HTTP headers")
    seo_score: int = Field(0, description="Calculated basic SEO health score (0-100)", json_schema_extra={"example": 85})
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of audit execution", json_schema_extra={"example": "2026-07-24T19:12:17Z"})

class ErrorResponse(BaseModel):
    error: bool = True
    status_code: int = Field(..., json_schema_extra={"example": 400})
    message: str = Field(..., json_schema_extra={"example": "Invalid URL"})
    detail: Optional[str] = Field(None, json_schema_extra={"example": "The provided URL could not be resolved."})
