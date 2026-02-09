"""
Kaggle 마케팅 데이터셋 다운로드 스크립트

이 스크립트는 Kaggle API를 사용하여 마케팅 캠페인 데이터셋을 다운로드합니다.

사전 요구사항:
1. Kaggle 계정 생성
2. https://www.kaggle.com/settings -> API -> Create New Token
3. kaggle.json 파일을 %USERPROFILE%\.kaggle\ 폴더에 저장
"""

import os
import zipfile
from pathlib import Path

def download_dataset():
    """Kaggle 데이터셋 다운로드"""
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        
        print("Kaggle API 인증 중...")
        api = KaggleApi()
        api.authenticate()
        
        print("마케팅 캠페인 데이터셋 다운로드 중...")
        dataset_name = "manishabhatt22/marketing-campaign-dataset"
        download_path = Path(__file__).parent / "data"
        download_path.mkdir(exist_ok=True)
        
        # 데이터셋 다운로드
        api.dataset_download_files(
            dataset_name,
            path=download_path,
            unzip=True
        )
        
        print(f"✅ 다운로드 완료: {download_path}")
        
        # 다운로드된 파일 목록
        csv_files = list(download_path.glob("*.csv"))
        print(f"\n다운로드된 파일:")
        for file in csv_files:
            print(f"  - {file.name} ({file.stat().st_size:,} bytes)")
        
        return True
        
    except OSError as e:
        if "Could not find kaggle.json" in str(e):
            print("\n❌ Kaggle API 키가 설정되지 않았습니다.")
            print("\n설정 방법:")
            print("1. https://www.kaggle.com/settings 접속")
            print("2. 'API' 섹션에서 'Create New Token' 클릭")
            print("3. 다운로드된 kaggle.json을 다음 경로에 저장:")
            print(f"   {Path.home() / '.kaggle' / 'kaggle.json'}")
            return False
        else:
            print(f"❌ 오류 발생: {e}")
            return False
    
    except Exception as e:
        print(f"❌ 다운로드 실패: {e}")
        return False

def main():
    """메인 실행"""
    print("=" * 60)
    print("Kaggle 마케팅 데이터셋 다운로드")
    print("=" * 60)
    print()
    
    success = download_dataset()
    
    if not success:
        print("\n대안: 수동 다운로드")
        print("1. https://www.kaggle.com/datasets/manishabhatt22/marketing-campaign-dataset 방문")
        print("2. 'Download' 버튼 클릭")
        print("3. ZIP 파일을 analysis/data/ 폴더에 압축 해제")

if __name__ == "__main__":
    main()
