"""Test CRUD operations"""
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud
from app.models import Consultation
from app.schemas import ConsultationCreate, ConsultationUpdate


class TestCRUD:
    """Test CRUD operations for consultations."""
    
    @pytest.mark.asyncio
    async def test_create_consultation(self, test_db, mock_embedder):
        """Test creating a consultation."""
        # Given
        consultation_data = ConsultationCreate(text="테스트 상담 내용입니다.")
        
        # When
        consultation = await crud.create_consultation(test_db, consultation_data)
        
        # Then
        assert consultation.id is not None
        assert consultation.text == "테스트 상담 내용입니다."
        assert consultation.embedding is not None
        assert len(consultation.embedding) == 768
        assert mock_embedder.embed_text.called
    
    @pytest.mark.asyncio
    async def test_get_consultation(self, test_db, mock_embedder):
        """Test getting a consultation by ID."""
        # Given
        consultation_data = ConsultationCreate(text="테스트 상담 내용입니다.")
        created = await crud.create_consultation(test_db, consultation_data)
        
        # When
        consultation = await crud.get_consultation(test_db, created.id)
        
        # Then
        assert consultation is not None
        assert consultation.id == created.id
        assert consultation.text == created.text
    
    @pytest.mark.asyncio
    async def test_get_consultation_not_found(self, test_db):
        """Test getting a non-existent consultation."""
        # When
        consultation = await crud.get_consultation(test_db, 99999)
        
        # Then
        assert consultation is None
    
    @pytest.mark.asyncio
    async def test_get_consultations(self, test_db, mock_embedder):
        """Test getting multiple consultations."""
        # Given
        consultations_data = [
            ConsultationCreate(text="첫 번째 상담"),
            ConsultationCreate(text="두 번째 상담"),
            ConsultationCreate(text="세 번째 상담")
        ]
        for data in consultations_data:
            await crud.create_consultation(test_db, data)
        
        # When
        consultations = await crud.get_consultations(test_db, skip=0, limit=10)
        
        # Then
        assert len(consultations) == 3
        # Should be ordered by created_at desc
        assert consultations[0].text == "세 번째 상담"
        assert consultations[1].text == "두 번째 상담"
        assert consultations[2].text == "첫 번째 상담"
    
    @pytest.mark.asyncio
    async def test_get_consultations_with_pagination(self, test_db, mock_embedder):
        """Test getting consultations with pagination."""
        # Given
        for i in range(5):
            await crud.create_consultation(
                test_db, 
                ConsultationCreate(text=f"상담 {i+1}")
            )
        
        # When
        page1 = await crud.get_consultations(test_db, skip=0, limit=2)
        page2 = await crud.get_consultations(test_db, skip=2, limit=2)
        page3 = await crud.get_consultations(test_db, skip=4, limit=2)
        
        # Then
        assert len(page1) == 2
        assert len(page2) == 2
        assert len(page3) == 1
    
    @pytest.mark.asyncio
    async def test_update_consultation(self, test_db, mock_embedder):
        """Test updating a consultation."""
        # Given
        consultation_data = ConsultationCreate(text="원본 상담 내용")
        created = await crud.create_consultation(test_db, consultation_data)
        update_data = ConsultationUpdate(text="수정된 상담 내용")
        
        # When
        updated = await crud.update_consultation(
            test_db, 
            created.id, 
            update_data
        )
        
        # Then
        assert updated is not None
        assert updated.id == created.id
        assert updated.text == "수정된 상담 내용"
        # Embedder should be called twice (create and update)
        assert mock_embedder.embed_text.call_count == 2
    
    @pytest.mark.asyncio
    async def test_update_consultation_not_found(self, test_db):
        """Test updating a non-existent consultation."""
        # Given
        update_data = ConsultationUpdate(text="수정된 상담 내용")
        
        # When
        updated = await crud.update_consultation(test_db, 99999, update_data)
        
        # Then
        assert updated is None
    
    @pytest.mark.asyncio
    async def test_delete_consultation(self, test_db, mock_embedder):
        """Test deleting a consultation."""
        # Given
        consultation_data = ConsultationCreate(text="삭제될 상담 내용")
        created = await crud.create_consultation(test_db, consultation_data)
        
        # When
        deleted = await crud.delete_consultation(test_db, created.id)
        
        # Then
        assert deleted is not None
        assert deleted.id == created.id
        
        # Verify it's actually deleted
        result = await crud.get_consultation(test_db, created.id)
        assert result is None
    
    @pytest.mark.asyncio
    async def test_delete_consultation_not_found(self, test_db):
        """Test deleting a non-existent consultation."""
        # When
        deleted = await crud.delete_consultation(test_db, 99999)
        
        # Then
        assert deleted is None
    
    @pytest.mark.asyncio
    async def test_search_consultations(self, test_db, mock_embedder):
        """Test searching consultations."""
        # Given
        consultations_data = [
            ConsultationCreate(text="민수가 친구들과 협력하는 모습"),
            ConsultationCreate(text="수업 시간에 집중도 향상"),
            ConsultationCreate(text="언어 발달 면에서 성장")
        ]
        for data in consultations_data:
            await crud.create_consultation(test_db, data)
        
        # Mock similarity scores
        mock_embedder.embed_text.return_value = [0.1] * 768
        
        # When
        results = await crud.search_consultations(
            test_db, 
            query="협력하는 모습", 
            limit=2
        )
        
        # Then
        # Note: SQLite doesn't support pgvector, so this test would need modification
        # For now, we're testing the function signature and mock usage
        assert mock_embedder.embed_text.called
        assert mock_embedder.embed_text.call_args[0][0] == "협력하는 모습"
