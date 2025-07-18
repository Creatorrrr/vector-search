import pytest
import asyncio
from typing import Generator, AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from httpx import AsyncClient
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.embeddings import embedder
import os
from unittest.mock import MagicMock, AsyncMock

# Test database URL
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

@pytest.fixture(scope="function")
def test_engine():
    """Create test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
    return engine

@pytest.fixture(scope="function")
async def test_db(test_engine):
    """Create test database session."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    TestSessionLocal = sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    
    session = TestSessionLocal()
    try:
        yield session
    finally:
        await session.close()
        await test_engine.dispose()

@pytest.fixture
async def client(test_db):
    """Create test client with overridden database dependency."""
    async def override_get_db():
        yield test_db
    
    app.dependency_overrides[get_db] = override_get_db
    
    try:
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac
    finally:
        app.dependency_overrides.clear()

@pytest.fixture
def mock_embedder(monkeypatch):
    """Mock embedder to avoid loading the actual model during tests."""
    mock = MagicMock()
    # Return a 768-dimensional zero vector
    mock.embed_text.return_value = [0.0] * 768
    mock.embed_batch.return_value = [[0.0] * 768]
    
    # Monkey patch the embedder in various modules
    monkeypatch.setattr("app.embeddings.embedder", mock)
    monkeypatch.setattr("app.crud.embedder", mock)
    
    return mock

@pytest.fixture
def sample_consultation_data():
    """Sample consultation data for testing."""
    return {
        "text": "오늘 민수가 친구들과 함께 블록놀이를 하며 협력하는 모습을 보였습니다."
    }

@pytest.fixture
def sample_consultation_list():
    """Sample list of consultations for testing."""
    return [
        {
            "text": "오늘 민수가 친구들과 함께 블록놀이를 하며 협력하는 모습을 보였습니다."
        },
        {
            "text": "수업 시간에 집중도가 많이 향상되었습니다."
        },
        {
            "text": "언어 발달 면에서 많은 성장을 보이고 있습니다."
        }
    ]
