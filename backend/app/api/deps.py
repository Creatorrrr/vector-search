"""Common API dependencies."""
from app.db.session import get_db

# 공통 의존성들을 여기서 재export
__all__ = ["get_db"]
