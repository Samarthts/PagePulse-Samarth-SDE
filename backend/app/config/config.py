import os

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Page Pulse API")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
    # Request & Scraping Configs
    HTTP_TIMEOUT_SECONDS: float = float(os.getenv("HTTP_TIMEOUT_SECONDS", "10.0"))
    MAX_REDIRECTS: int = int(os.getenv("MAX_REDIRECTS", "5"))
    USER_AGENT: str = os.getenv(
        "USER_AGENT", 
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 PagePulse/1.0"
    )
    
    # CORS Configs
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://*.vercel.app",
        "*"
    ]

settings = Settings()
