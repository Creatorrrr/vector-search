from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.models import Consultation
from app.schemas import ConsultationCreate, ConsultationUpdate
from app.services.embedding_service import embedding_service
import numpy as np
from typing import List, Optional

async def create_consultation(db: AsyncSession, consultation: ConsultationCreate):
    # 텍스트를 벡터로 변환
    embedding = embedding_service.embed_text(consultation.text)
    
    db_consultation = Consultation(
        text=consultation.text,
        embedding=embedding
    )
    
    db.add(db_consultation)
    await db.commit()
    await db.refresh(db_consultation)
    return db_consultation

async def get_consultation(db: AsyncSession, consultation_id: int):
    result = await db.execute(
        select(Consultation).where(Consultation.id == consultation_id)
    )
    return result.scalar_one_or_none()

async def get_consultations(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(Consultation).offset(skip).limit(limit).order_by(Consultation.created_at.desc())
    )
    return result.scalars().all()

async def update_consultation(db: AsyncSession, consultation_id: int, consultation: ConsultationUpdate):
    # 기존 상담 찾기
    result = await db.execute(
        select(Consultation).where(Consultation.id == consultation_id)
    )
    db_consultation = result.scalar_one_or_none()
    
    if db_consultation:
        # 텍스트 업데이트 및 임베딩 재생성
        db_consultation.text = consultation.text
        embedding = embedding_service.embed_text(consultation.text)
        db_consultation.embedding = embedding
        
        await db.commit()
        await db.refresh(db_consultation)
    
    return db_consultation

async def delete_consultation(db: AsyncSession, consultation_id: int):
    result = await db.execute(
        select(Consultation).where(Consultation.id == consultation_id)
    )
    db_consultation = result.scalar_one_or_none()
    
    if db_consultation:
        await db.delete(db_consultation)
        await db.commit()
    
    return db_consultation

async def search_consultations(db: AsyncSession, query: str, limit: int = 10, skip: int = 0, similarity_threshold: float = 0.3):
    # 검색 쿼리를 벡터로 변환
    query_embedding = embedding_service.embed_text(query)
    query_embedding_array = np.array(query_embedding)
    
    # 모든 상담 내용을 가져와서 유사도 계산
    result = await db.execute(select(Consultation))
    all_consultations = result.scalars().all()
    
    # 유사도 계산 및 필터링
    consultations_with_similarity = []
    
    for consultation in all_consultations:
        if consultation.embedding is not None and len(consultation.embedding) > 0:
            # 임베딩을 numpy array로 변환
            consultation_embedding = np.array(consultation.embedding)
            
            # 코사인 유사도 계산
            similarity = np.dot(query_embedding_array, consultation_embedding) / (
                np.linalg.norm(query_embedding_array) * np.linalg.norm(consultation_embedding)
            )
            
            # 유사도 임계값 필터링 - 연관성 있는 정보만 포함
            if similarity >= similarity_threshold:
                consultations_with_similarity.append((consultation, float(similarity)))
    
    # 유사도로 정렬 (높은 순)
    consultations_with_similarity.sort(key=lambda x: x[1], reverse=True)
    
    # 전체 결과 개수 (필터링 후)
    total_count = len(consultations_with_similarity)
    
    # 페이징 적용
    paginated_results = consultations_with_similarity[skip:skip + limit]
    
    # 결과와 전체 개수를 함께 반환
    return paginated_results, total_count
