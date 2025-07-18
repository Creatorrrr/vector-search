"""Database session management."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
import asyncpg

from app.core.config import settings

# 비동기 엔진 생성
async_engine = create_async_engine(settings.async_database_url, echo=True)

# 동기 엔진 (마이그레이션용)
sync_engine = create_engine(settings.DATABASE_URL)

# 세션 생성
AsyncSessionLocal = sessionmaker(
    async_engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    """Database dependency for FastAPI."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
