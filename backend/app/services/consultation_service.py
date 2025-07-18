"""Consultation service for business logic."""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Consultation
from app.schemas import ConsultationCreate, ConsultationUpdate
from app.services.embedding_service import embedding_service
from app import crud


class ConsultationService:
    """Service for consultation business logic."""
    
    def __init__(self):
        self.embedding_service = embedding_service
    
    async def create_consultation(
        self, 
        db: AsyncSession, 
        consultation_data: ConsultationCreate
    ) -> Consultation:
        """Create a new consultation with embedding."""
        # 데이터베이스에 저장 (임베딩은 crud에서 처리)
        return await crud.create_consultation(db=db, consultation=consultation_data)
    
    async def update_consultation(
        self, 
        db: AsyncSession, 
        consultation_id: int,
        consultation_data: ConsultationUpdate
    ) -> Optional[Consultation]:
        """Update consultation with new embedding."""
        # 데이터베이스 업데이트 (임베딩은 crud에서 처리)
        return await crud.update_consultation(
            db=db, 
            consultation_id=consultation_id, 
            consultation=consultation_data
        )
    
    async def get_consultation(
        self, 
        db: AsyncSession, 
        consultation_id: int
    ) -> Optional[Consultation]:
        """Get consultation by ID."""
        return await crud.get_consultation(db=db, consultation_id=consultation_id)
    
    async def get_consultations(
        self, 
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Consultation]:
        """Get list of consultations."""
        return await crud.get_consultations(db=db, skip=skip, limit=limit)
    
    async def delete_consultation(
        self, 
        db: AsyncSession, 
        consultation_id: int
    ) -> Optional[Consultation]:
        """Delete consultation."""
        return await crud.delete_consultation(db=db, consultation_id=consultation_id)
    
    async def search_consultations(
        self, 
        db: AsyncSession, 
        query: str, 
        limit: int = 10,
        skip: int = 0,
        similarity_threshold: float = 0.3
    ) -> tuple[List[Consultation], int]:
        """Search consultations using vector similarity with relevance filtering."""
        # 벡터 검색 실행 (임베딩은 crud에서 처리)
        return await crud.search_consultations(
            db=db, 
            query=query, 
            limit=limit, 
            skip=skip,
            similarity_threshold=similarity_threshold
        )


# 전역 서비스 인스턴스
consultation_service = ConsultationService()
