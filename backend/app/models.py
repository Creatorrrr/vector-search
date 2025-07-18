from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.db.base import Base

class Consultation(Base):
    __tablename__ = "consultations"
    
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    embedding = Column(Vector(1024))  # Arctic 모델은 1024차원
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
