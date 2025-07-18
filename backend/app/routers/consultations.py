from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
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
    return await consultation_service.create_consultation(db=db, consultation_data=consultation)

@router.get("/consultations", response_model=List[ConsultationResponse])
async def read_consultations(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    consultations = await consultation_service.get_consultations(db, skip=skip, limit=limit)
    return consultations

@router.get("/consultations/{consultation_id}", response_model=ConsultationResponse)
async def read_consultation(
    consultation_id: int,
    db: AsyncSession = Depends(get_db)
):
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
    db_consultation = await consultation_service.delete_consultation(db, consultation_id=consultation_id)
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="상담 내용을 찾을 수 없습니다")
    return {"message": "상담 내용이 삭제되었습니다"}

@router.post("/consultations/search", response_model=ConsultationSearchResponse)
async def search_consultations(
    search_request: ConsultationSearchRequest,
    db: AsyncSession = Depends(get_db)
):
    results = await consultation_service.search_consultations(
        db, 
        query=search_request.query, 
        limit=search_request.limit
    )
    
    search_results = [
        ConsultationSearchResult(
            id=row.id,
            text=row.text,
            created_at=row.created_at,
            similarity=0.0  # 기본값 설정 (실제로는 벡터 검색에서 계산됨)
        )
        for row in results
    ]
    
    return ConsultationSearchResponse(
        results=search_results,
        total=len(search_results)
    )
