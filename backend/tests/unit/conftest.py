"""단위 테스트용 간단한 설정"""
import pytest
import os

# 테스트 환경 설정
os.environ['TESTING'] = 'true'

@pytest.fixture
def mock_embedding():
    """Mock 임베딩 벡터"""
    return [0.0] * 1024

@pytest.fixture
def sample_text():
    """샘플 텍스트"""
    return "오늘 민수가 친구들과 협력하는 모습을 보였습니다."
