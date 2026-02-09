# 데이터 다운로드 가이드

## 선정된 데이터셋: Maven Analytics - Marketing Campaign Results

### 데이터셋 정보
- **출처**: Maven Analytics
- **이름**: Marketing Campaign Results
- **크기**: 2,240 고객 데이터
- **포함 내용**:
  - 고객 프로필
  - 제품 선호도
  - 채널 성과
  - 캠페인 성공률
- **라이선스**: 무료 사용 가능
- **특징**: 회원가입 불필요

### 다운로드 방법

#### 옵션 1: 직접 다운로드 (권장)
1. https://mavenanalytics.io/data-playground 방문
2. "Marketing Campaign Results" 검색
3. "Download" 버튼 클릭
4. 다운로드한 파일을 `analysis/data/` 폴더에 저장

#### 옵션 2: Kaggle 사용 (API 키 필요)
1. https://www.kaggle.com/settings 접속
2. API 섹션에서 "Create New Token" 클릭
3. kaggle.json을 `%USERPROFILE%\.kaggle\` 폴더에 저장
4. 다음 명령 실행:
   ```bash
   python analysis/download_kaggle_data.py
   ```

### 다음 단계
1. 데이터 다운로드 후 `prepare_real_data.py` 실행
2. 노트북에서 분석 재실행
3. GitHub에 push

## 파일 위치
- 원본 데이터: `analysis/data/marketing_campaign.csv`
- 변환 데이터: `analysis/data/marketing_raw_data.csv` (기존 스키마 호환)
