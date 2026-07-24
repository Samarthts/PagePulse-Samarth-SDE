# ⚡ Page Pulse Backend API

Production-grade FastAPI service that audits website URLs for HTTP status, network response latency, HTML DOM hierarchy (H1 tags), missing image alt attributes, meta descriptions, word count, SSL/HTTPS verification, and security headers.

---

## 🚀 Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **HTTP Client**: `httpx` (Async HTTP request handler)
- **HTML Parser**: `BeautifulSoup4`
- **Data Validation**: `Pydantic v2`
- **Testing**: `pytest` & `pytest-asyncio`
- **Server**: `uvicorn`

---

## 📡 API Endpoints

### 1. Website Audit Endpoint

- **URL**: `/analyze` (or `/api/v1/analyze`)
- **Method**: `POST`
- **Header**: `Content-Type: application/json`

#### Request Payload
```json
{
  "url": "https://example.com"
}
```

#### Successful Response (`200 OK`)
```json
{
  "status": 200,
  "response_time": "245 ms",
  "title": "Example Domain",
  "meta_description": "Example Description",
  "h1_count": 1,
  "missing_alt_images": 0,
  "word_count": 1256,
  "favicon": "https://example.com/favicon.ico",
  "https_status": true,
  "response_headers": {
    "content-type": "text/html; charset=UTF-8",
    "server": "ECS (dcb/7f83)"
  },
  "seo_score": {
    "total": 95,
    "grade": "Excellent"
  },
  "timestamp": "2026-07-24T14:00:00Z"
}
```

#### Error Response Payload Schema
```json
{
  "error": true,
  "status_code": 400,
  "message": "Invalid URL or Request Body",
  "detail": "Invalid URL structure. Ensure schema is http:// or https://"
}
```

---

## 🧪 Running Pytest Tests

```bash
cd backend
.\.venv\Scripts\pytest -v
```

---

## 🛡️ Error Handling Matrix

| Error Condition | HTTP Code | Handled Cause |
|---|---|---|
| Invalid URL Format | `400 Bad Request` | Pydantic URL regex validation |
| Non-HTML Media | `415 Unsupported` | Content-Type checking (`text/html`) |
| Network / SSL Failure | `502 Bad Gateway` | Host resolution failure, SSL certificate errors |
| Target Timeout | `504 Gateway Timeout` | HTTPX request timeout trigger (>10s) |
