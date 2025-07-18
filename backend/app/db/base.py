"""Database base class and model imports."""
from sqlalchemy.ext.declarative import declarative_base

# SQLAlchemy Base 클래스
Base = declarative_base()

# 모든 모델을 여기에 import하여 Base.metadata에 등록
from app.models import *  # noqa
