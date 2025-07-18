"""Embedding service for text vectorization."""
import numpy as np
from typing import List, Union
from app.embeddings import embedder
from app.core.config import settings


class EmbeddingService:
    """Service for handling text embeddings."""
    
    def __init__(self):
        self.dimension = settings.EMBEDDING_DIMENSION
        self.batch_size = settings.BATCH_SIZE
    
    def embed_text(self, text: str) -> List[float]:
        """Convert text to embedding vector."""
        embedding = embedder.embed_text(text)
        return self._normalize_embedding(embedding)
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Convert multiple texts to embedding vectors."""
        embeddings = embedder.embed_batch(texts, batch_size=self.batch_size)
        return [self._normalize_embedding(emb) for emb in embeddings]
    
    def _normalize_embedding(self, embedding: Union[np.ndarray, List[float]]) -> List[float]:
        """Normalize embedding to list format."""
        if hasattr(embedding, 'tolist'):
            return embedding.tolist()
        return embedding
    
    def validate_embedding_dimension(self, embedding: List[float]) -> bool:
        """Validate embedding dimension."""
        return len(embedding) == self.dimension


# 전역 서비스 인스턴스
embedding_service = EmbeddingService()
