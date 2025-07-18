-- pgvector 확장 생성
CREATE EXTENSION IF NOT EXISTS vector;

-- consultations 테이블 생성
CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    embedding vector(1024),  -- BGE-M3 모델은 1024차원
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 업데이트 시간 자동 갱신을 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- IVFFlat 인덱스 생성 (검색 성능 향상)
-- 참고: 데이터가 있어야 인덱스 생성 가능
-- CREATE INDEX ON consultations USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
