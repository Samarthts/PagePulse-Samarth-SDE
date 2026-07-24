from fastapi import APIRouter, HTTPException, status
from app.schemas.audit import AuditRequest, AuditResponse, ErrorResponse
from app.services.analyzer import analyzer_service

router = APIRouter(tags=["Website Audit"])

@router.post(
    "/analyze",
    response_model=AuditResponse,
    status_code=status.HTTP_200_OK,
    summary="Audit Website URL",
    description="Fetches target URL, measures response time, parses HTML structure, and returns comprehensive audit report.",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid URL structure"},
        415: {"model": ErrorResponse, "description": "Unsupported Non-HTML response type"},
        502: {"model": ErrorResponse, "description": "Connection or SSL failure"},
        504: {"model": ErrorResponse, "description": "Target server timeout"},
    }
)
async def analyze_url_endpoint(payload: AuditRequest) -> AuditResponse:
    try:
        return await analyzer_service.analyze_url(payload.url)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during URL analysis: {str(exc)}"
        )

# Alias for versioned route /api/v1/analyze
@router.post(
    "/api/v1/analyze",
    response_model=AuditResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def analyze_url_versioned(payload: AuditRequest) -> AuditResponse:
    return await analyze_url_endpoint(payload)


@router.get(
    "/api/v1/health",
    summary="API Health Status",
    description="Returns backend operational status."
)
async def health_check():
    return {
        "status": "healthy",
        "service": "Page Pulse API",
        "version": "1.0.0"
    }
