from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Union, Optional
import os

class BGEEmbedder:
    def __init__(self):
        self.model: Optional[SentenceTransformer] = None
        
    def _load_model(self):
        """모델을 지연 로딩합니다."""
        if self.model is None:
            # 테스트 환경에서는 모델 로딩을 건너뜁니다
            if os.getenv("TESTING", "false").lower() == "true":
                return
            
            # 모델 캐시 디렉토리 설정 (로컬 환경에 맞게)
            cache_dir = os.getenv("HF_HOME", "./model_cache")
            
            # 캐시 디렉토리가 존재하지 않으면 생성
            os.makedirs(cache_dir, exist_ok=True)
            
            # BGE-M3 모델 로드
            self.model = SentenceTransformer(
                'BAAI/bge-m3',
                trust_remote_code=True,
                cache_folder=cache_dir
            )
        
    def embed_text(self, text: Union[str, List[str]]) -> np.ndarray:
        """텍스트를 임베딩 벡터로 변환"""
        # 테스트 환경에서는 더미 벡터 반환
        if os.getenv("TESTING", "false").lower() == "true":
            return np.array([0.0] * 1024)
        
        self._load_model()
        
        if isinstance(text, str):
            text = [text]
        
        embeddings = self.model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True  # 코사인 유사도를 위한 정규화
        )
        
        return embeddings[0] if len(text) == 1 else embeddings
    
    def embed_batch(self, texts: List[str], batch_size: int = 32) -> List[np.ndarray]:
        """대량의 텍스트를 배치로 처리"""
        # 테스트 환경에서는 더미 벡터 반환
        if os.getenv("TESTING", "false").lower() == "true":
            return [[0.0] * 1024 for _ in texts]
        
        self._load_model()
        
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=True
        )
        return embeddings

# 전역 임베더 인스턴스 (lazy loading)
embedder = BGEEmbedder()
