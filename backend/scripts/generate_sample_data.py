import asyncio
import os
import sys
import json
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

# 프로젝트 루트 경로 설정 (로컬/Docker 환경 모두 대응)
current_dir = Path(__file__).parent
project_root = current_dir.parent
sys.path.append(str(project_root))

from app.embeddings.bge_embedder import BGEEmbedder
from app.models import Consultation
from app.db.session import async_engine, get_db

def load_consultation_data():
    """JSON 파일에서 상담 데이터를 로드합니다."""
    data_file = current_dir.parent / "data" / "consultation_samples.json"
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data['consultations']
    except FileNotFoundError:
        print(f"데이터 파일을 찾을 수 없습니다: {data_file}")
        raise
    except json.JSONDecodeError as e:
        print(f"JSON 파일 파싱 오류: {e}")
        raise

async def generate_sample_data():
    print("샘플 데이터 생성을 시작합니다...")
    
    # JSON 파일에서 상담 데이터 로드
    try:
        consultation_data = load_consultation_data()
        print(f"JSON 파일에서 {len(consultation_data)}개의 상담 데이터를 로드했습니다.")
    except Exception as e:
        print(f"데이터 로드 실패: {e}")
        return
    
    # 임베더 초기화
    try:
        embedder = BGEEmbedder()
        print("임베딩 모델이 로드되었습니다.")
    except Exception as e:
        print(f"임베딩 모델 로드 실패: {e}")
        return
    
    # SQLAlchemy async 세션 사용
    async with AsyncSession(async_engine) as session:
        try:
            # 기존 데이터 삭제
            await session.execute(delete(Consultation))
            await session.commit()
            print("기존 데이터를 삭제했습니다.")
            
            # 배치 크기 설정
            batch_size = 10
            
            # 텍스트만 추출 (변형 없이 원본 그대로 사용)
            all_texts = [item['text'] for item in consultation_data]
            print(f"총 생성될 텍스트 개수: {len(all_texts)}")
            
            # 배치 단위로 처리
            total_batches = (len(all_texts) + batch_size - 1) // batch_size
            for i in range(0, len(all_texts), batch_size):
                batch_texts = all_texts[i:i+batch_size]
                
                # 배치 임베딩 생성
                print(f"배치 {i//batch_size + 1}/{total_batches} 처리 중...")
                embeddings = embedder.embed_batch(batch_texts)
                
                # 데이터베이스에 삽입
                consultations = []
                for text, embedding in zip(batch_texts, embeddings):
                    consultation = Consultation(
                        text=text,
                        embedding=embedding.tolist()
                    )
                    consultations.append(consultation)
                
                session.add_all(consultations)
                await session.commit()
            
            # 결과 확인
            result = await session.execute(select(Consultation))
            all_consultations = result.scalars().all()
            count = len(all_consultations)
            print(f"총 {count}개의 상담 데이터가 생성되었습니다.")
            
            # 카테고리별 데이터 수 확인
            categories = {}
            for item in consultation_data:
                category = item['category']
                categories[category] = categories.get(category, 0) + 1
            
            print("\n기본 카테고리별 데이터 수:")
            for category, count in sorted(categories.items()):
                print(f"  {category}: {count}개")
            
        except Exception as e:
            print(f"오류 발생: {e}")
            import traceback
            traceback.print_exc()
            await session.rollback()
        
    print("데이터 생성 완료!")

if __name__ == "__main__":
    asyncio.run(generate_sample_data())
