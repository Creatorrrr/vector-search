"""Test Pydantic schemas"""
import pytest
from pydantic import ValidationError
from app.schemas import (
    ConsultationCreate,
    ConsultationUpdate,
    ConsultationResponse,
    ConsultationSearchRequest,
    ConsultationSearchResult,
    ConsultationSearchResponse
)
from datetime import datetime


class TestConsultationSchemas:
    """Test consultation schemas validation."""
    
    def test_consultation_create_valid(self):
        """Test valid consultation creation schema."""
        data = ConsultationCreate(text="유효한 상담 내용입니다.")
        assert data.text == "유효한 상담 내용입니다."
    
    def test_consultation_create_empty_text(self):
        """Test consultation creation with empty text."""
        with pytest.raises(ValidationError):
            ConsultationCreate(text="")
    
    def test_consultation_create_missing_text(self):
        """Test consultation creation without text field."""
        with pytest.raises(ValidationError):
            ConsultationCreate()
    
    def test_consultation_update_valid(self):
        """Test valid consultation update schema."""
        data = ConsultationUpdate(text="수정된 상담 내용입니다.")
        assert data.text == "수정된 상담 내용입니다."
    
    def test_consultation_response_valid(self):
        """Test valid consultation response schema."""
        now = datetime.now()
        data = ConsultationResponse(
            id=1,
            text="상담 내용",
            created_at=now,
            updated_at=now
        )
        assert data.id == 1
        assert data.text == "상담 내용"
        assert data.created_at == now
        assert data.updated_at == now
    
    def test_consultation_search_request_valid(self):
        """Test valid consultation search request."""
        data = ConsultationSearchRequest(query="검색어", limit=20)
        assert data.query == "검색어"
        assert data.limit == 20
    
    def test_consultation_search_request_default_limit(self):
        """Test consultation search request with default limit."""
        data = ConsultationSearchRequest(query="검색어")
        assert data.query == "검색어"
        assert data.limit == 10  # default value
    
    def test_consultation_search_result_valid(self):
        """Test valid consultation search result."""
        now = datetime.now()
        data = ConsultationSearchResult(
            id=1,
            text="상담 내용",
            created_at=now,
            updated_at=now,
            similarity=0.95
        )
        assert data.id == 1
        assert data.text == "상담 내용"
        assert data.created_at == now
        assert data.updated_at == now
        assert data.similarity == 0.95
    
    def test_consultation_search_response_valid(self):
        """Test valid consultation search response."""
        now = datetime.now()
        results = [
            ConsultationSearchResult(
                id=1,
                text="상담 내용 1",
                created_at=now,
                updated_at=now,
                similarity=0.95
            ),
            ConsultationSearchResult(
                id=2,
                text="상담 내용 2",
                created_at=now,
                updated_at=now,
                similarity=0.85
            )
        ]
        
        response = ConsultationSearchResponse(
            results=results,
            total=2,
            page=1,
            limit=10,
            total_pages=1,
            has_next=False,
            has_prev=False
        )
        
        assert len(response.results) == 2
        assert response.total == 2
        assert response.page == 1
        assert response.limit == 10
        assert response.total_pages == 1
        assert response.has_next == False
        assert response.has_prev == False
        assert response.results[0].similarity > response.results[1].similarity
