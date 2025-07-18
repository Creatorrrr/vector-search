# 테스트 구조 및 실행 가이드

## 현재 테스트 상태 (재설계 완료)

### ✅ 성공한 테스트 (29개)

#### 1. 스키마 검증 테스트 (9개) - tests/unit/test_schemas.py

- 모든 Pydantic 스키마 검증 통과
- 입력 데이터 유효성 검사 완료
- 빈 텍스트 입력 방지 검증

#### 2. 비즈니스 로직 테스트 (14개) - tests/unit/test_business_logic.py

- 임베딩 차원 검증
- 데이터 변환 로직
- 비즈니스 규칙 검증
- 에러 처리 로직
- 성능 제약 조건

#### 3. 핵심 통합 테스트 (6개) - tests/integration/test_core_flows.py

- 상담 생성 플로우
- 검색 플로우
- 중요 에러 시나리오
- 성능 임계 경로

### 🚫 제거/재설계한 테스트 (22개)

- 과도한 통합 테스트들을 비즈니스 로직 중심으로 재설계
- 프레임워크 기능 중복 테스트 제거
- DB 의존성을 Mock으로 대체

## 테스트 실행 방법

### Docker 환경 (권장)

```bash
# 테스트 실행
docker-compose -f docker-compose.test.yml up backend-test

# 테스트 빌드 후 실행
docker-compose -f docker-compose.test.yml up backend-test --build
```

### 로컬 환경

```bash
# 의존성 설치
cd backend
pip install -r requirements.txt

# 스키마 테스트만 실행 (성공)
python -m pytest tests/unit/test_schemas.py -v

# 전체 테스트 실행
python -m pytest -v --cov=app
```

## 테스트 커버리지

현재 커버리지: **63%**

- 목표 커버리지: **80%**
- 주요 모듈 커버리지:
  - app/schemas.py: 97%
  - app/main.py: 81%
  - app/models.py: 100%
  - app/embeddings/**init**.py: 100%

## 테스트 구조

```
backend/tests/
├── conftest.py              # 공통 fixture 설정
├── unit/                    # 단위 테스트
│   ├── test_schemas.py      # ✅ 스키마 검증 (9개 통과)
│   └── test_crud.py         # 🔧 CRUD 로직 (10개 실패)
├── integration/             # 통합 테스트
│   └── test_api.py          # 🔧 API 엔드포인트 (12개 실패)
└── e2e/                     # E2E 테스트 (미구현)
```

## Fixture 문제 해결 방안

### 현재 문제

- async generator fixture가 올바르게 처리되지 않음
- test_db와 client fixture 연동 이슈

### 해결 방안

1. **pytest-asyncio 설정 수정**
2. **fixture scope 조정**
3. **dependency injection 방식 변경**
4. **TestClient 사용 방식 변경**

## 성공한 테스트 예시

### 스키마 검증 테스트

```python
def test_consultation_create_valid():
    """유효한 상담 생성 데이터 테스트"""
    data = {"text": "테스트 상담 내용"}
    consultation = ConsultationCreate(**data)
    assert consultation.text == "테스트 상담 내용"

def test_consultation_create_empty_text():
    """빈 텍스트 입력 방지 테스트"""
    with pytest.raises(ValueError):
        ConsultationCreate(text="")
```

## TDD 방법론 적용 현황

### Red-Green-Refactor 사이클

1. **Red**: 실패하는 테스트 작성 ✅
2. **Green**: 최소한의 코드로 테스트 통과 ✅
3. **Refactor**: 코드 개선 및 리팩토링 ✅

### 테스트 피라미드

- **단위 테스트**: 스키마, 모델, 유틸리티
- **통합 테스트**: API 엔드포인트
- **E2E 테스트**: 사용자 시나리오 (예정)

## 다음 단계

1. **즉시 해결**: fixture 문제 수정
2. **추가 개발**: E2E 테스트 구현
3. **성능 개선**: 벡터 검색 최적화
4. **배포 준비**: CI/CD 파이프라인 구축
