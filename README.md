# 텍스트 벡터 검색 시스템

교사-학부모 정기상담 내용을 벡터 검색으로 관리하는 시스템입니다.

## 🏗️ 시스템 아키텍처

### 기술 스택

**Backend**
- FastAPI 0.111.0 + Python 3.11
- PostgreSQL 16 + pgvector 0.2.5
- BGE-M3 임베딩 모델 (1024차원)
- SQLAlchemy 2.0.30 (비동기 ORM)

**Frontend**
- React 19.1.0 + TypeScript
- Vite 7.0.5 (빌드 도구)
- TanStack Query 5.83.0 (서버 상태 관리)
- Tailwind CSS 4.1.11 (스타일링)
- React Hook Form 7.54.2 (폼 관리)

**Development & Testing**
- Docker Compose (컨테이너 오케스트레이션)
- pytest 8.3.2 (백엔드 테스트)
- Vitest 2.1.8 (프론트엔드 테스트)

### 프로젝트 구조

```
vector-search/
├── docker-compose.yml          # 도커 개발환경 설정
├── docker-compose.test.yml     # 도커 테스트환경 설정
├── backend/
│   ├── app/
│   │   ├── core/              # 설정 중앙화
│   │   │   └── config.py
│   │   ├── db/                # 데이터베이스 관리
│   │   │   ├── base.py
│   │   │   ├── session.py
│   │   │   └── init_db.py
│   │   ├── api/               # API 계층
│   │   │   ├── deps.py
│   │   │   └── v1/
│   │   │       ├── api.py
│   │   │       └── endpoints/
│   │   │           ├── health.py
│   │   │           └── consultations.py
│   │   ├── services/          # 비즈니스 로직
│   │   │   ├── embedding_service.py
│   │   │   └── consultation_service.py
│   │   ├── embeddings/        # 임베딩 모델
│   │   │   ├── __init__.py
│   │   │   └── bge_embedder.py
│   │   ├── models.py          # 데이터베이스 모델
│   │   ├── schemas.py         # Pydantic 스키마
│   │   ├── crud.py            # 데이터 접근 계층
│   │   └── main.py            # FastAPI 애플리케이션
│   ├── tests/                 # 테스트 코드
│   │   ├── unit/              # 단위 테스트
│   │   ├── integration/       # 통합 테스트
│   │   └── e2e/               # E2E 테스트
│   ├── scripts/               # 유틸리티 스크립트
│   ├── requirements.txt       # Python 의존성
│   └── Dockerfile            # 백엔드 컨테이너 설정
├── frontend/
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   ├── hooks/            # 커스텀 훅
│   │   ├── services/         # API 클라이언트
│   │   └── types/            # TypeScript 타입 정의
│   ├── package.json          # Node.js 의존성
│   └── Dockerfile           # 프론트엔드 컨테이너 설정
├── db/
│   └── init/
│       └── 01-init.sql      # 데이터베이스 초기화 스크립트
└── docs/                    # 문서
    ├── arch/               # 아키텍처 문서
    ├── history/            # 개발 히스토리
    └── caution/            # 주의사항
```

## 🚀 실행 방법

### 도커 실행 (권장)

**1. 환경 설정**

```bash
# 저장소 클론
git clone <repository-url>
cd vector-search

# 환경변수 파일 생성 (선택사항)
cp .env.example .env  # 필요시 환경변수 수정
```

**2. 개발 환경 실행**

```bash
# 전체 시스템 실행 (데이터베이스 + 백엔드 + 프론트엔드)
docker-compose up -d

# 서비스별 로그 확인
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# 전체 로그 확인
docker-compose logs -f
```

**3. 서비스 접속**

- **프론트엔드**: http://localhost:13000
- **백엔드 API**: http://localhost:18000
- **API 문서**: http://localhost:18000/docs (Swagger UI)
- **데이터베이스**: localhost:25432 (외부 접속용)

**4. 시스템 종료**

```bash
# 컨테이너 중지
docker-compose down

# 볼륨까지 삭제 (데이터베이스 데이터 포함)
docker-compose down -v
```

### 로컬 실행

**1. 데이터베이스 설정**

```bash
# PostgreSQL 설치 (macOS - Homebrew)
brew install postgresql@16
brew install pgvector

# PostgreSQL 시작
brew services start postgresql@16

# 데이터베이스 생성
createdb consultation_db

# pgvector 확장 설치
psql consultation_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

**2. 백엔드 실행**

```bash
cd backend

# Python 가상환경 생성 및 활성화
python3.11 -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는 venv\Scripts\activate  # Windows

# 의존성 설치
pip install -r requirements.txt

# 환경변수 설정
export DATABASE_URL="postgresql://admin:admin123@localhost:5432/consultation_db"
export HF_HOME="./model_cache"

# 서버 실행
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**3. 프론트엔드 실행**

```bash
cd frontend

# Node.js 의존성 설치
npm install

# 환경변수 설정 (.env 파일 생성)
echo "VITE_API_URL=http://localhost:8000" > .env

# 개발 서버 실행
npm run dev
```

**4. 로컬 서비스 접속**

- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 📊 샘플 데이터 생성

시스템 테스트나 데모를 위해 샘플 상담 데이터를 생성할 수 있습니다.

### 도커 환경에서 샘플 데이터 생성

```bash
# 백엔드 컨테이너에서 스크립트 실행
docker-compose exec backend python scripts/generate_sample_data.py

# 또는 일회성 컨테이너로 실행
docker-compose run --rm backend python scripts/generate_sample_data.py
```

### 로컬 환경에서 샘플 데이터 생성

```bash
cd backend

# 가상환경 활성화
source venv/bin/activate  # macOS/Linux
# 또는 venv\Scripts\activate  # Windows

# 환경변수 설정
export DATABASE_URL="postgresql://admin:admin123@localhost:5432/consultation_db"
export HF_HOME="./model_cache"

# 스크립트 실행
python scripts/generate_sample_data.py
```

### 샘플 데이터 내용

- **데이터 소스**: `backend/data/consultation_samples.json`
- **카테고리**: 학습활동, 놀이활동, 사회성발달, 정서발달, 신체발달, 언어발달, 창의성발달, 생활습관
- **임베딩**: BGE-M3 모델을 사용하여 1024차원 벡터로 변환
- **처리**: 배치 단위(10개씩)로 효율적 처리

### 주의사항

- 기존 데이터베이스의 모든 상담 데이터가 삭제됩니다
- 임베딩 생성에 시간이 소요될 수 있습니다 (모델 다운로드 포함)
- 네트워크 연결이 필요합니다 (모델 다운로드 시)

## 🧪 테스트 실행

### 도커 테스트

```bash
# 백엔드 단위 테스트
docker-compose -f docker-compose.test.yml run --rm backend-test pytest tests/unit/ -v

# 백엔드 통합 테스트
docker-compose -f docker-compose.test.yml run --rm backend-test pytest tests/integration/ -v

# 백엔드 전체 테스트 + 커버리지
docker-compose -f docker-compose.test.yml run --rm backend-test pytest --cov=app tests/

# 프론트엔드 테스트
cd frontend
npm run test

# 프론트엔드 커버리지 테스트
npm run test:coverage
```

### 로컬 테스트

```bash
# 백엔드 테스트
cd backend
source venv/bin/activate
export TESTING=true
pytest tests/ -v

# 프론트엔드 테스트
cd frontend
npm run test
```

## 📊 API 문서

### 기본 정보

- **Base URL**: `http://localhost:18000` (도커) / `http://localhost:8000` (로컬)
- **API Version**: `v1`
- **Documentation**: `/docs` (Swagger UI)
- **OpenAPI Schema**: `/openapi.json`

### 주요 엔드포인트

#### 헬스체크
```http
GET /api/v1/health
```

#### 상담 관리
```http
# 상담 목록 조회
GET /api/v1/consultations?skip=0&limit=100

# 상담 생성
POST /api/v1/consultations
Content-Type: application/json
{
    "text": "오늘 민수가 친구들과 함께 블록놀이를 하며 협력하는 모습을 보였습니다."
}

# 상담 상세 조회
GET /api/v1/consultations/{id}

# 상담 수정
PUT /api/v1/consultations/{id}
Content-Type: application/json
{
    "text": "수정된 상담 내용"
}

# 상담 삭제
DELETE /api/v1/consultations/{id}
```

#### 벡터 검색
```http
# 유사도 검색
POST /api/v1/consultations/search
Content-Type: application/json
{
    "query": "협력 놀이",
    "limit": 10,
    "min_similarity": 0.7
}
```

## 🛠️ 주요 기능

### 1. 벡터 임베딩
- **모델**: BGE-M3 (BAAI/bge-m3)
- **차원**: 1024
- **정규화**: 코사인 유사도 최적화
- **배치 처리**: 대용량 데이터 효율적 처리

### 2. 벡터 검색
- **유사도 계산**: 코사인 유사도 기반
- **인덱스**: pgvector IVFFlat 인덱스 최적화
- **필터링**: 최소 유사도 임계값 설정 가능

### 3. 웹 인터페이스
- **반응형 디자인**: Tailwind CSS 기반
- **실시간 검색**: 타이핑 시 즉시 검색 결과 표시
- **상태 관리**: TanStack Query로 서버 상태 최적화
- **폼 관리**: React Hook Form으로 사용자 입력 처리

## 🔧 개발 가이드

### 환경 변수

**Backend (.env 또는 환경변수)**
```bash
DATABASE_URL=postgresql://admin:admin123@localhost:5432/consultation_db
HF_HOME=./model_cache
TESTING=false  # 테스트 환경에서는 true
```

**Frontend (.env)**
```bash
VITE_API_URL=http://localhost:18000  # 도커 환경
# VITE_API_URL=http://localhost:8000  # 로컬 환경
```

### 코드 스타일

**Python (Backend)**
- Black (코드 포매팅)
- isort (import 정렬)
- flake8 (린팅)

**TypeScript (Frontend)**
- ESLint (린팅)
- Prettier (코드 포매팅)

### 성능 최적화

**데이터베이스**
- 비동기 SQLAlchemy 사용
- 벡터 검색 인덱스 최적화
- 연결 풀 관리

**임베딩**
- 모델 지연 로딩 (Lazy Loading)
- 모델 캐싱으로 재다운로드 방지
- 배치 처리로 메모리 효율성 향상

**프론트엔드**
- TanStack Query로 서버 상태 캐싱
- React 19의 최신 기능 활용
- 번들 크기 최적화

## 🐛 문제 해결

### 일반적인 문제

**1. Docker 컨테이너 실행 실패**
```bash
# 포트 확인
lsof -i :13000,18000,25432

# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs backend
```

**2. 임베딩 모델 다운로드 실패**
```bash
# 캐시 디렉토리 확인
ls -la backend/model_cache/

# 디스크 공간 확인
df -h

# 모델 수동 다운로드
cd backend
python -c "from app.embeddings.bge_embedder import embedder; embedder._load_model()"
```

**3. 데이터베이스 연결 실패**
```bash
# PostgreSQL 상태 확인
docker-compose exec db pg_isready -U admin -d consultation_db

# 직접 연결 테스트
docker-compose exec db psql -U admin -d consultation_db -c "SELECT version();"
```

**4. 프론트엔드 빌드 실패**
```bash
# 의존성 재설치
cd frontend
rm -rf node_modules package-lock.json
npm install

# 타입 체크
npm run type-check
```

### 로그 확인

```bash
# 도커 환경
docker-compose logs -f [service-name]

# 로컬 환경
# 백엔드: uvicorn 실행 중인 터미널 확인
# 프론트엔드: npm run dev 실행 중인 터미널 확인
```

## 📚 문서

### 상세 문서
- [시스템 아키텍처](docs/arch/)
- [개발 히스토리](docs/history/)
- [주의사항](docs/caution/)

### API 문서
- Swagger UI: `/docs`
- ReDoc: `/redoc`
- OpenAPI Schema: `/openapi.json`

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 연락처

문의사항이 있으시면 이슈를 통해 연락주세요.
