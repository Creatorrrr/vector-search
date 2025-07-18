"""Consultation API endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.api.deps import get_db
from app.schemas import (
    ConsultationCreate,
    ConsultationUpdate,
    ConsultationResponse,
    ConsultationSearchRequest,
    ConsultationSearchResult,
    ConsultationSearchResponse
)
from app.services.consultation_service import consultation_service

router = APIRouter()

@router.post("/consultations", response_model=ConsultationResponse)
async def create_consultation(
    consultation: ConsultationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new consultation."""
    return await consultation_service.create_consultation(db=db, consultation_data=consultation)

@router.get("/consultations", response_model=List[ConsultationResponse])
async def read_consultations(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get list of consultations."""
    consultations = await consultation_service.get_consultations(db, skip=skip, limit=limit)
    return consultations

@router.get("/consultations/{consultation_id}", response_model=ConsultationResponse)
async def read_consultation(
    consultation_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get consultation by ID."""
    db_consultation = await consultation_service.get_consultation(db, consultation_id=consultation_id)
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="상담 내용을 찾을 수 없습니다")
    return db_consultation

@router.put("/consultations/{consultation_id}", response_model=ConsultationResponse)
async def update_consultation(
    consultation_id: int,
    consultation: ConsultationUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update consultation."""
    db_consultation = await consultation_service.update_consultation(
        db, 
        consultation_id=consultation_id, 
        consultation_data=consultation
    )
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="상담 내용을 찾을 수 없습니다")
    return db_consultation

@router.delete("/consultations/{consultation_id}")
async def delete_consultation(
    consultation_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete consultation."""
    db_consultation = await consultation_service.delete_consultation(db, consultation_id=consultation_id)
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="상담 내용을 찾을 수 없습니다")
    return {"message": "상담 내용이 삭제되었습니다"}

@router.post("/consultations/search", response_model=ConsultationSearchResponse)
async def search_consultations(
    search_request: ConsultationSearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """Search consultations using vector similarity."""
    # skip 값을 계산 (page가 주어진 경우)
    skip = search_request.skip or ((search_request.page - 1) * search_request.limit)
    
    # 검색 결과 가져오기 (pagination 포함)
    results, total_count = await consultation_service.search_consultations(
        db, 
        query=search_request.query, 
        limit=search_request.limit,
        skip=skip,
        similarity_threshold=search_request.similarity_threshold
    )
    
    search_results = [
        ConsultationSearchResult(
            id=consultation.id,
            text=consultation.text,
            created_at=consultation.created_at,
            updated_at=consultation.updated_at,
            similarity=similarity
        )
        for consultation, similarity in results
    ]
    
    # 페이징 정보 계산
    total_pages = (total_count + search_request.limit - 1) // search_request.limit
    current_page = search_request.page
    has_next = current_page < total_pages
    has_prev = current_page > 1
    
    return ConsultationSearchResponse(
        results=search_results,
        total=total_count,
        page=current_page,
        limit=search_request.limit,
        total_pages=total_pages,
        has_next=has_next,
        has_prev=has_prev
    )
