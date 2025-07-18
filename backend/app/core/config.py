"""Core configuration settings."""
import os
from typing import List, Optional


class Settings:
    """Application settings."""
    
    # 프로젝트 정보
    PROJECT_NAME: str = "텍스트 벡터 검색 시스템"
    PROJECT_DESCRIPTION: str = "교사-학부모 정기상담 내용 벡터 검색 시스템"
    VERSION: str = "1.0.0"
    
    # API 설정
    API_V1_STR: str = "/api/v1"
    
    # 데이터베이스 설정
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://admin:admin123@localhost:25432/consultation_db")
    
    # 테스트 환경 설정
    TESTING: bool = os.getenv("TESTING", "false").lower() == "true"
    
    # CORS 설정
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000", 
        "http://localhost:5173",  # Vite 개발 서버
        "http://localhost:5174",  # Vite 개발 서버 (대체 포트)
        "http://localhost:13000"  # Docker 컨테이너 포트
    ]
    
    # 임베딩 설정
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-m3"
    EMBEDDING_DIMENSION: int = 1024
    HF_HOME: Optional[str] = os.getenv("HF_HOME")
    
    # 성능 설정
    MAX_SEARCH_RESULTS: int = 100
    BATCH_SIZE: int = 32

    @property
    def async_database_url(self) -> str:
        """Get async database URL."""
        return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")


# 전역 설정 인스턴스
settings = Settings()
