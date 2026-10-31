import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.services.seed_data import seed_database
from app.api.v1 import auth, individual, company, stats

# Create all tables and seed on initialization
Base.metadata.create_all(bind=engine)
_seed_db = SessionLocal()
try:
    seed_database(_seed_db)
finally:
    _seed_db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safety ensure tables and seeds exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="TalentLoop AI - Intelligent Resume Matching, Skill Gap Analysis & Automated Recruitment Platform",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(individual.router, prefix=settings.API_V1_STR)
app.include_router(company.router, prefix=settings.API_V1_STR)
app.include_router(stats.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    """Service health and readiness check."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "connected"
    }

# Single-origin static file serving for React frontend production build
frontend_dist_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "frontend",
    "dist"
)

if os.path.exists(frontend_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_react_app(full_path: str):
        file_path = os.path.join(frontend_dist_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist_path, "index.html"))
