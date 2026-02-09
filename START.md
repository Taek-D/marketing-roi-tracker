# 🚀 시작 가이드 (START.md)

마케팅 ROI 분석 프로젝트를 **처음부터 직접 실행**하는 방법을 단계별로 안내합니다.

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [사전 준비](#사전-준비)
3. [Step 1: 프로젝트 클론](#step-1-프로젝트-클론)
4. [Step 2: Python 환경 설정](#step-2-python-환경-설정)
5. [Step 3: 데이터 생성](#step-3-데이터-생성)
6. [Step 4: 분석 실행](#step-4-분석-실행)
7. [Step 5: 결과 확인](#step-5-결과-확인)
8. [Step 6: Tableau 대시보드 (선택)](#step-6-tableau-대시보드-선택)
9. [Google Apps Script 연동 (고급)](#google-apps-script-연동-고급)
10. [문제 해결](#문제-해결)

---

## 프로젝트 개요

이 프로젝트는 **마케팅 ROI 분석 자동화 시스템**입니다:

- **Apps Script**: Google Ads / Facebook Ads / Naver Ads 데이터 수집 자동화
- **Python 분석**: 90일간의 마케팅 데이터를 분석하여 ROI 최적화
- **Tableau**: 인터랙티브 대시보드로 시각화

### 학습 목표
- 실무급 데이터 분석 파이프라인 이해
- 통계 검정 및 회귀 분석 실습
- 예산 최적화 알고리즘 적용
- Tableau Public 대시보드 제작

---

## 사전 준비

### 필수 도구

| 도구 | 버전 | 다운로드 |
|------|------|----------|
| **Python** | 3.8 이상 | https://www.python.org/downloads/ |
| **Git** | 최신 | https://git-scm.com/downloads |
| **Jupyter** | - | Python 설치 시 포함 |

### 선택 도구 (나중에 필요시)

| 도구 | 용도 | 다운로드 |
|------|------|----------|
| **Node.js** | Apps Script 배포 (clasp) | https://nodejs.org/ |
| **Tableau Public** | 대시보드 제작 | https://www.tableau.com/products/public/download |

---

## Step 1: 프로젝트 클론

### 1-1. Git 저장소 클론

```bash
# 터미널 또는 명령 프롬프트 열기
cd ~  # 또는 원하는 경로로 이동

# 프로젝트 클론
git clone https://github.com/Taek-D/marketing-roi-tracker.git

# 프로젝트 디렉토리로 이동
cd marketing-roi-tracker
```

### 1-2. 프로젝트 구조 확인

```bash
# Windows (PowerShell)
ls

# macOS/Linux
ls -la
```

**주요 디렉토리**:
- `analysis/` - Python 분석 코드 및 노트북
- `*.gs` - Google Apps Script 파일 (나중에 사용)
- `README.md` - 프로젝트 설명서
- `CHANGELOG.md` - 변경 이력

---

## Step 2: Python 환경 설정

### 2-1. Python 버전 확인

```bash
python --version
# 또는
python3 --version
```

**예상 출력**: `Python 3.8.x` 이상

### 2-2. 가상환경 생성 (권장)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

**활성화 확인**: 프롬프트 앞에 `(venv)` 표시

### 2-3. 필수 패키지 설치

```bash
cd analysis
pip install -r requirements.txt
```

**설치되는 패키지**:
- `pandas` - 데이터 처리
- `numpy` - 수치 계산
- `matplotlib` - 차트 생성
- `seaborn` - 고급 시각화
- `scipy` - 통계 검정
- `scikit-learn` - 회귀 분석

**설치 확인**:
```bash
pip list | grep pandas
# 또는 Windows
pip list | findstr pandas
```

---

## Step 3: 데이터 생성

### 3-1. 실무급 데이터 생성 실행

```bash
# analysis 디렉토리에서 실행
python generate_data.py
```

**실행 결과 (예시)**:
```
======================================================================
마케팅 ROI 분석용 실무급 시뮬레이션 데이터 생성
======================================================================

총 행 수: 810 (기대: 810)
컬럼: ['date', 'channel', 'campaign', 'cost', 'impressions', 'clicks', 'conversions', 'revenue']
날짜 범위: 2024-10-01 ~ 2024-12-29

=== 채널별 평균 ROAS ===
  Google Ads: 2.77
  Facebook Ads: 2.05
  Naver Ads: 3.28

✅ 데이터 검증 완료!

실무급 패턴 12가지 적용:
  1. 채널 효율성 차이
  2. 캠페인 효율성 차이
  ... (12가지)

CSV 저장 완료: E:\프로젝트\마케팅 ROI 최적화\analysis\data\marketing_raw_data.csv
파일 크기: 52,538 bytes
```

### 3-2. 데이터 확인

```bash
# CSV 파일 생성 확인
ls data/

# 예상 출력:
# marketing_raw_data.csv (52KB)
```

**데이터 샘플 보기** (옵션):
```bash
# Windows
type data\marketing_raw_data.csv | more

# macOS/Linux
head -20 data/marketing_raw_data.csv
```

---

## Step 4: 분석 실행

### 4-1. Jupyter Notebook 실행

```bash
# analysis 디렉토리에서
jupyter notebook
```

**자동으로 브라우저가 열립니다** (http://localhost:8888)

### 4-2. 노트북 열기

**기본 분석 노트북**:
1. 브라우저에서 `MarketingROI_Analysis.ipynb` 클릭
2. 상단 메뉴: `Kernel` → `Restart & Run All` 선택
3. 모든 셀이 순차적으로 실행됩니다 (약 1-2분 소요)

**고급 분석 노트북** (애트리뷰션, 퍼널, 예측):
1. `MarketingROI_Advanced_Analysis.ipynb` 클릭
2. 동일하게 `Kernel` → `Restart & Run All` 실행

### 4-3. 실행 중 확인사항

**섹션별 실행 순서**:
1. ✅ 환경 설정 (한글 폰트 설정)
2. ✅ 데이터 로드 및 품질 점검
3. ✅ EDA - 채널별 비교
4. ✅ 심층 분석 - 요일 패턴
5. ✅ 통계 검정 (t-test, ANOVA)
6. ✅ 회귀 분석 (3가지 모델)
7. ✅ 예산 최적화
8. ✅ 이상치 탐지
9. ✅ 핵심 인사이트 요약

**문제 발생 시**: [문제 해결](#문제-해결) 섹션 참조

---

## Step 5: 결과 확인

### 5-1. 생성된 차트 확인

```bash
# analysis/charts 디렉토리로 이동
cd charts
ls

# 13개의 PNG 파일 확인:
# 01_channel_cost_revenue.png
# 02_daily_roas_trend.png
# ... (총 13개)
```

**차트 목록**:
1. 채널별 광고비-매출 비교
2. 일별 ROAS 추이
3. 캠페인 성과 매트릭스
4. 요일별 히트맵
5. 체감수익 분석
6. 통계 검정 결과
7. 회귀 모델 비교
8. 예산 최적화
9. 한계 ROAS 곡선
10. 이상치 탐지
11. Multi-Touch 애트리뷰션 모델 비교 (고급)
12. 마케팅 퍼널 분석 (고급)
13. ROAS 시계열 예측 (고급)

### 5-2. Executive Summary 확인

```bash
# 보고서 확인
cd ../report
cat executive_summary.md

# 또는 텍스트 편집기로 열기
```

**핵심 발견**:
- Naver Ads ROAS 3.28 (최고 효율)
- 예산 재배분 시 +4.3% 매출 증가 가능
- A/B 테스트 결과: CTR +25%, ROAS +10%

### 5-3. GitHub에서 노트북 확인 (온라인)

브라우저에서 접속:
```
https://github.com/Taek-D/marketing-roi-tracker/blob/master/analysis/MarketingROI_Analysis.ipynb
```

GitHub가 자동으로 노트북을 렌더링합니다.

---

## Step 6: Tableau 대시보드 (선택)

### 6-1. Tableau용 데이터 Export

```bash
cd analysis
python export_for_tableau.py
```

**생성되는 파일** (3개):
- `data/tableau_summary.csv` (3행)
- `data/tableau_daily.csv` (270행)
- `data/tableau_campaign.csv` (9행)

### 6-2. Tableau Public 설치

1. https://www.tableau.com/products/public/download 접속
2. 이메일 입력 후 다운로드
3. 설치 및 무료 계정 생성

### 6-3. 대시보드 제작

상세 가이드: `analysis/TABLEAU_GUIDE.md` 참조

**간단 버전**:
1. Tableau Public Desktop 실행
2. "Connect to Data" → "Text file"
3. `tableau_summary.csv` 선택
4. "Go to Worksheet"
5. 차트 생성:
   - Rows: Channel
   - Columns: ROAS
   - Color: ROAS

---

## Google Apps Script 연동 (고급)

실제API 데이터 수집을 원한다면:

### 사전 준비
1. Google 계정 필요
2. Google Ads / Facebook Ads / Naver Ads 계정 필요
3. Node.js 설치 필요

### 단계별 가이드
자세한 내용: `auth_setup_instructions.md` 및 `naver_setup_guide.md` 참조

**요약**:
```bash
# 1. clasp 설치
npm install -g @google/clasp

# 2. Google 로그인
clasp login

# 3. Apps Script 배포
clasp push
```

⚠️ **주의**: 이 단계는 **선택사항**입니다. 데이터 분석만 해보려면 Step 3-5만으로 충분합니다.

---

## 문제 해결

### Q1: `python` 명령어를 찾을 수 없습니다

**원인**: Python이 설치되지 않았거나 PATH 설정이 안 됨

**해결**:
1. Python 공식 사이트에서 설치: https://www.python.org/
2. 설치 시 "Add Python to PATH" 체크박스 선택
3. 재설치 후 터미널 재시작

### Q2: `pip install` 시 권한 오류

**해결**:
```bash
# Windows
pip install --user -r requirements.txt

# macOS/Linux
sudo pip3 install -r requirements.txt
```

### Q3: Jupyter Notebook이 실행되지 않습니다

**해결**:
```bash
# Jupyter 재설치
pip install --upgrade jupyter

# 또는 직접 실행
python -m notebook
```

### Q4: 한글 폰트가 깨집니다

**자동 해결**: 노트북 첫 번째 셀이 자동으로 폰트 설정

**수동 해결**:
```python
# Windows
plt.rcParams['font.family'] = 'Malgun Gothic'

# macOS
plt.rcParams['font.family'] = 'AppleGothic'

# Linux
# 시스템에 한글 폰트 설치 필요
```

### Q5: `marketing_raw_data.csv`를 찾을 수 없습니다

**원인**: Step 3을 건너뛰었거나 파일 경로 오류

**해결**:
```bash
cd analysis
python generate_data.py
```

### Q6: 차트가 생성되지 않습니다

**확인 사항**:
1. `analysis/charts/` 디렉토리 존재 여부
2. 노트북 전체 실행 (Restart & Run All)
3. 에러 메시지 확인

**해결**:
```bash
# charts 디렉토리 수동 생성
mkdir -p analysis/charts
```

---

## 🎓 학습 포인트

### 데이터 분석 측면
- **EDA (탐색적 데이터 분석)**: 채널별/캠페인별 성과 비교
- **통계 검정**: t-test, ANOVA로 유의성 검증
- **회귀 분석**: 광고비-매출 관계 모델링
- **최적화**: ROAS 기반 예산 재배분

### 비즈니스 측면
- **ROI 최적화**: 동일 예산으로 매출 4.3% 증가 방법
- **실무 패턴**: A/B 테스트, 광고 피로도, 계절성 반영
- **의사결정 지원**: 데이터 기반 예산 배분 전략

### 기술 스택
- **Python**: pandas, numpy, matplotlib, seaborn
- **Jupyter**: 인터랙티브 분석 환경
- **Tableau**: 비즈니스 인텔리전스 대시보드
- **Git/GitHub**: 버전 관리 및 협업

---

## 📚 추가 자료

### 프로젝트 문서
- [`README.md`](./README.md) - 프로젝트 전체 개요
- [`CHANGELOG.md`](./CHANGELOG.md) - 버전별 변경 사항
- [`analysis/TABLEAU_GUIDE.md`](./analysis/TABLEAU_GUIDE.md) - Tableau 대시보드 가이드

### 외부 자료
- [Pandas 공식 문서](https://pandas.pydata.org/docs/)
- [Matplotlib 튜토리얼](https://matplotlib.org/stable/tutorials/index.html)
- [Tableau Public 학습](https://public.tableau.com/app/learn/how-to-videos)

---

## ✅ 체크리스트

완료했다면 체크하세요:

- [ ] Python 3.8 이상 설치 완료
- [ ] 프로젝트 클론 완료
- [ ] 가상환경 생성 및 활성화
- [ ] 필수 패키지 설치 (`requirements.txt`)
- [ ] 데이터 생성 실행 (`generate_data.py`)
- [ ] 데이터 파일 확인 (`marketing_raw_data.csv`, 52KB)
- [ ] Jupyter Notebook 실행
- [ ] 노트북 전체 실행 (`Restart & Run All`)
- [ ] 차트 13개 생성 확인 (`analysis/charts/`)
- [ ] Executive Summary 확인
- [ ] (선택) Tableau 데이터 Export
- [ ] (선택) Tableau 대시보드 제작

---

## 🎉 축하합니다!

모든 단계를 완료하셨다면, 이제 **실무급 마케팅 ROI 분석**을 직접 실행해보셨습니다!

### 다음 단계 제안
1. **노트북 코드 수정**: 분석 로직 직접 변경해보기
2. **데이터 파라미터 조정**: `generate_data.py`에서 채널/캠페인 수정
3. **Tableau 대시보드 공개**: Tableau Public에 게시
4. **포트폴리오 활용**: GitHub 저장소를 이력서에 추가

**질문이나 문제가 있다면**:
- GitHub Issues: https://github.com/Taek-D/marketing-roi-tracker/issues
- 또는 프로젝트 문서를 확인하세요!

---

**마지막 업데이트**: 2026-02-09  
**버전**: 1.0.0  
**작성자**: Marketing ROI Tracker Team
