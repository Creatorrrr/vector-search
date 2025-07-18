"""Test API endpoints"""
import pytest
from httpx import AsyncClient


class TestHealthEndpoint:
    """Test health check endpoint."""
    
    @pytest.mark.asyncio
    async def test_health_check(self, client):
        """Test health check endpoint returns healthy status."""
        response = await client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestConsultationEndpoints:
    """Test consultation API endpoints."""
    
    @pytest.mark.asyncio
    async def test_create_consultation(self, client, mock_embedder):
        """Test creating a consultation via API."""
        # Given
        consultation_data = {
            "text": "오늘 민수가 친구들과 협력하는 모습을 보였습니다."
        }
        
        # When
        response = await client.post(
            "/api/consultations",
            json=consultation_data
        )
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert data["id"] is not None
        assert data["text"] == consultation_data["text"]
        assert "created_at" in data
        assert "updated_at" in data
    
    @pytest.mark.asyncio
    async def test_create_consultation_invalid_data(self, client):
        """Test creating consultation with invalid data."""
        # Given
        invalid_data = {"text": ""}  # Empty text
        
        # When
        response = await client.post(
            "/api/consultations",
            json=invalid_data
        )
        
        # Then
        assert response.status_code == 422  # Validation error
    
    @pytest.mark.asyncio
    async def test_get_consultations(self, client, mock_embedder):
        """Test getting list of consultations."""
        # Given - Create some consultations first
        for i in range(3):
            await client.post(
                "/api/consultations",
                json={"text": f"상담 내용 {i+1}"}
            )
        
        # When
        response = await client.get("/api/consultations")
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 3
        # Check order (should be newest first)
        assert data[0]["text"] == "상담 내용 3"
        assert data[1]["text"] == "상담 내용 2"
        assert data[2]["text"] == "상담 내용 1"
    
    @pytest.mark.asyncio
    async def test_get_consultations_with_pagination(self, client, mock_embedder):
        """Test getting consultations with pagination."""
        # Given - Create 5 consultations
        for i in range(5):
            await client.post(
                "/api/consultations",
                json={"text": f"상담 {i+1}"}
            )
        
        # When
        response = await client.get("/api/consultations?skip=1&limit=2")
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["text"] == "상담 4"
        assert data[1]["text"] == "상담 3"
    
    @pytest.mark.asyncio
    async def test_get_consultation_by_id(self, client, mock_embedder):
        """Test getting a specific consultation by ID."""
        # Given
        create_response = await client.post(
            "/api/consultations",
            json={"text": "특정 상담 내용"}
        )
        consultation_id = create_response.json()["id"]
        
        # When
        response = await client.get(f"/api/consultations/{consultation_id}")
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == consultation_id
        assert data["text"] == "특정 상담 내용"
    
    @pytest.mark.asyncio
    async def test_get_consultation_not_found(self, client):
        """Test getting non-existent consultation."""
        # When
        response = await client.get("/api/consultations/99999")
        
        # Then
        assert response.status_code == 404
        assert response.json()["detail"] == "상담 내용을 찾을 수 없습니다"
    
    @pytest.mark.asyncio
    async def test_update_consultation(self, client, mock_embedder):
        """Test updating a consultation."""
        # Given
        create_response = await client.post(
            "/api/consultations",
            json={"text": "원본 상담 내용"}
        )
        consultation_id = create_response.json()["id"]
        
        # When
        update_data = {"text": "수정된 상담 내용"}
        response = await client.put(
            f"/api/consultations/{consultation_id}",
            json=update_data
        )
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == consultation_id
        assert data["text"] == "수정된 상담 내용"
    
    @pytest.mark.asyncio
    async def test_update_consultation_not_found(self, client):
        """Test updating non-existent consultation."""
        # When
        response = await client.put(
            "/api/consultations/99999",
            json={"text": "수정된 내용"}
        )
        
        # Then
        assert response.status_code == 404
        assert response.json()["detail"] == "상담 내용을 찾을 수 없습니다"
    
    @pytest.mark.asyncio
    async def test_delete_consultation(self, client, mock_embedder):
        """Test deleting a consultation."""
        # Given
        create_response = await client.post(
            "/api/consultations",
            json={"text": "삭제될 상담 내용"}
        )
        consultation_id = create_response.json()["id"]
        
        # When
        response = await client.delete(f"/api/consultations/{consultation_id}")
        
        # Then
        assert response.status_code == 200
        assert response.json()["message"] == "상담 내용이 삭제되었습니다"
        
        # Verify it's actually deleted
        get_response = await client.get(f"/api/consultations/{consultation_id}")
        assert get_response.status_code == 404
    
    @pytest.mark.asyncio
    async def test_delete_consultation_not_found(self, client):
        """Test deleting non-existent consultation."""
        # When
        response = await client.delete("/api/consultations/99999")
        
        # Then
        assert response.status_code == 404
        assert response.json()["detail"] == "상담 내용을 찾을 수 없습니다"
    
    @pytest.mark.asyncio
    async def test_search_consultations(self, client, mock_embedder):
        """Test searching consultations."""
        # Given - Create some consultations
        consultations = [
            {"text": "민수가 친구들과 협력하는 모습을 보였습니다."},
            {"text": "수업 시간에 집중도가 향상되었습니다."},
            {"text": "언어 발달 면에서 많은 성장을 보였습니다."}
        ]
        for consultation in consultations:
            await client.post("/api/consultations", json=consultation)
        
        # When
        search_data = {"query": "협력", "limit": 2}
        response = await client.post(
            "/api/consultations/search",
            json=search_data
        )
        
        # Then
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert "total" in data
        # Mock embedder is used, so we can't test actual similarity
        # But we can verify the structure
        if data["results"]:
            result = data["results"][0]
            assert "id" in result
            assert "text" in result
            assert "created_at" in result
            assert "similarity" in result
