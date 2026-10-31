import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TalentLoop AI"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "talentloop-super-secret-jwt-key-2026-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Defaults to SQLite for instant local zero-config, handles Supabase/PostgreSQL seamlessly)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./talentloop.db")
    
    # File Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads"))
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".txt"]
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Fix Render / Supabase "postgres://" to "postgresql://" for SQLAlchemy 2.0
if settings.DATABASE_URL.startswith("postgres://"):
    settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://", 1)
