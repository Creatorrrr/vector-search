from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, List

class ConsultationBase(BaseModel):
    text: str = Field(..., min_length=1, description="상담 내용")
    
    @field_validator('text')
    @classmethod
    def text_must_not_be_empty(cls, v):
        if not v or v.strip() == '':
            raise ValueError('상담 내용은 비어있을 수 없습니다')
        return v.strip()

class ConsultationCreate(ConsultationBase):
    pass

class ConsultationUpdate(ConsultationBase):
    pass

class ConsultationResponse(ConsultationBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ConsultationSearchRequest(BaseModel):
    query: str
    limit: Optional[int] = 10
    skip: Optional[int] = 0
    page: Optional[int] = 1
    similarity_threshold: Optional[float] = Field(default=0.3, ge=0.0, le=1.0, description="유사도 임계값 (0.0-1.0)")
    
    @field_validator('similarity_threshold')
    @classmethod
    def validate_similarity_threshold(cls, v):
        if v < 0.0 or v > 1.0:
            raise ValueError('유사도 임계값은 0.0에서 1.0 사이여야 합니다')
        return v

class ConsultationSearchResult(BaseModel):
    id: int
    text: str
    created_at: datetime
    updated_at: datetime
    similarity: float
    
    class Config:
        from_attributes = True

class ConsultationSearchResponse(BaseModel):
    results: List[ConsultationSearchResult]
    total: int
    page: int
    limit: int
    total_pages: int
    has_next: bool
    has_prev: bool
