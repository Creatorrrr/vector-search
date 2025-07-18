"""API v1 router integration."""
from fastapi import APIRouter
from app.api.v1.endpoints import health, consultations

api_router = APIRouter()

# 모든 엔드포인트를 통합
api_router.include_router(health.router, tags=["health"])
api_router.include_router(consultations.router, tags=["consultations"])
