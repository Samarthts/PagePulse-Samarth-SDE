from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from http import HTTPStatus
from app.config.config import settings
from app.routes.audit import router as audit_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Production-grade SaaS backend service for auditing website performance, metadata, HTML structure, and SEO.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(audit_router)

# Custom Exception Handlers for uniform error JSON payloads
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0]["msg"] if errors else "Invalid request payload format."
    clean_msg = first_msg.replace("Value error, ", "").strip()
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": True,
            "status_code": 400,
            "message": "Invalid URL or Request Body",
            "detail": clean_msg
        }
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    try:
        phrase = HTTPStatus(exc.status_code).phrase
    except ValueError:
        phrase = "HTTP Error"

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "message": phrase,
            "detail": str(exc.detail)
        }
    )

@app.get("/", include_in_schema=False)
async def root():
    return {
        "message": "Welcome to Page Pulse API",
        "docs": "/docs",
        "health": "/api/v1/health"
    }
