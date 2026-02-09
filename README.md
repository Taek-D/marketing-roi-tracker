# MarketingROI Tracker

> Google Ads, Facebook Ads, 네이버 검색광고 데이터를 자동 수집하여 ROAS를 분석하고 예산 최적화를 제안하는 멀티채널 마케팅 ROI 대시보드

## Dashboard Preview

![Dashboard Preview](docs/screenshots/dashboard_preview.png)

## Interactive Dashboard

| 대시보드 | 기술 | 링크 |
|----------|------|------|
| **Chart.js 대시보드** | Chart.js + Vercel 배포 | [Live Demo](https://dashboard-kappa-self-57.vercel.app) |
| **Tableau Public** | Tableau Public 배포 | [Dashboard](https://public.tableau.com/views/MarketingROI/Dashboard1) |

- KPI 카드 4개 (Total Spend, Revenue, ROAS, Conversions)
- 채널별 ROAS 바 차트 + 매출 비중 도넛 차트
- 90일 일별 ROAS 추이 + 7일 이동평균 라인 차트
- 캠페인 성과 매트릭스 (버블 차트)
- 퍼널 지표 테이블 (CTR, CVR, CPA)

## Key Insights

| # | 발견 | 수치 | 비즈니스 액션 |
|---|------|------|---------------|
| 1 | Naver Ads가 최고 효율 채널 | ROAS 3.28 (vs Google 2.77, Facebook 2.05) | 예산 30.9% → 40.4% 증액 |
| 2 | 체감수익 구조 확인 | 로그 R² > 선형 R² | 다채널 분산 투자 유리 |
| 3 | 예산 재배분 효과 | 동일 예산 대비 **+4.3% 매출 증가** | ROAS 가중 월별 리밸런싱 |
| 4 | Brand 캠페인 최고 효율 | ROAS 3.5~4.0 (전 채널 1위) | Brand 키워드 방어 예산 우선 확보 |
| 5 | 애트리뷰션 모델별 최대 30% 차이 | 5모델 비교 | 복수 모델 교차 검증 도입 |

> 상세 분석: [`analysis/report/executive_summary.md`](./analysis/report/executive_summary.md)

## Features

- **자동 데이터 수집**: Google Ads / Facebook Ads / 네이버 검색광고에서 매일 오전 9시(KST) 자동 수집
- **ROAS 대시보드**: 채널별 Spend, Revenue, ROAS를 한눈에 비교
- **Multi-Touch 애트리뷰션**: 5가지 모델 비교 (Last-Touch, First-Touch, Linear, Time-Decay, Position-Based)
- **마케팅 퍼널 분석**: CTR, CVR, CPA, CPM 등 퍼널 단계별 핵심 지표 자동 산출
- **이상치 탐지**: Z-score 기반 ROAS 이상치 실시간 감지 + Slack 알림
- **주간 자동 리포트**: 주간 성과 요약 + 전주 대비 변화율 Slack 발송
- **시계열 예측**: ARIMA / Holt-Winters 모델로 30일 ROAS 예측 (Python 노트북)
- **SQL 분석**: Supabase PostgreSQL에서 Window Function, CTE, Z-score 등 고급 SQL 분석
- **인터랙티브 대시보드**: Chart.js 기반 (Vercel 배포) + Tableau Public
- **CI/CD**: `.gs` 파일 변경 시 자동 구문 검사 + 시크릿 스캔
- **Unit Tests**: 핵심 비즈니스 로직 단위 테스트 (30개 테스트 케이스)

## Tech Stack

| 영역 | 기술 |
|------|------|
| 자동화 | Google Apps Script (ES6), clasp |
| API | Google Ads API v18, Facebook Marketing API v21, Naver Search Ads API |
| 데이터 분석 | Python (pandas, scipy, scikit-learn, statsmodels) |
| SQL | Supabase PostgreSQL (Window Function, CTE, Z-score) |
| 시각화 | matplotlib, seaborn, Chart.js, Tableau Public |
| 대시보드 | Google Sheets, Chart.js (Vercel 배포) |
| 알림 | Slack Webhook |
| CI/CD | GitHub Actions |

## Project Structure

```
marketing-roi-tracker/
├── Code.gs                     # 메인 로직 (API 호출, 데이터 수집, Slack 알림)
├── Config.gs                   # 전역 설정 (CONFIG 객체, getProperty, log)
├── Attribution.gs              # Multi-Touch 애트리뷰션 (5모델) + 퍼널 분석
├── Report.gs                   # 이상치 탐지 (Z-score) + 주간 자동 리포트
├── Setup.gs                    # 초기 설정 (시트 생성, 테스트 데이터, 트리거)
├── Tests.gs                    # 단위 테스트 (30개 테스트 케이스)
├── appsscript.json             # Apps Script 매니페스트
│
├── analysis/                   # 마케팅 ROI 심층 분석
│   ├── MarketingROI_Analysis.ipynb           # 기본 분석 (EDA, 통계검정, 회귀, 최적화)
│   ├── MarketingROI_Advanced_Analysis.ipynb  # 고급 분석 (애트리뷰션, 퍼널, 예측)
│   ├── MarketingROI_SQL_Analysis.ipynb       # SQL 분석 (8개 쿼리, Supabase)
│   ├── generate_data.py                      # 실무급 시뮬레이션 데이터 생성기
│   ├── export_for_tableau.py                 # Tableau용 CSV Export
│   ├── requirements.txt                      # Python 의존성
│   ├── TABLEAU_GUIDE.md                      # Tableau Public 배포 로드맵 + 가이드
│   ├── data/
│   │   ├── marketing_raw_data.csv            # 90일 x 3채널 x 3캠페인 (810행)
│   │   ├── tableau_summary.csv               # 채널별 집계
│   │   ├── tableau_daily.csv                 # 일별 트렌드
│   │   └── tableau_campaign.csv              # 캠페인 상세
│   ├── charts/                               # 분석 차트 (PNG 13개)
│   └── report/
│       └── executive_summary.md              # 경영진 보고서
│
├── dashboard/                  # 인터랙티브 대시보드
│   └── index.html              # Chart.js 기반 (Vercel 배포)
│
├── docs/
│   └── screenshots/
│       └── dashboard_preview.png
│
├── .github/workflows/
│   └── validate.yml            # CI: 구문 검사 + 시크릿 스캔
│
├── README.md
├── CLAUDE.md                   # 개발 규칙
├── PRD.md                      # 제품 요구사항 문서
├── CHANGELOG.md                # 버전 히스토리
├── auth_setup_instructions.md  # Google/Facebook 인증 가이드
└── naver_setup_guide.md        # 네이버 검색광고 API 연동 가이드
```

## Quick Start

### 1. 저장소 클론

```bash
git clone https://github.com/Taek-D/marketing-roi-tracker.git
cd marketing-roi-tracker
```

### 2. clasp 설치 및 로그인

```bash
npm install -g @google/clasp
clasp login
```

> Apps Script API를 먼저 활성화하세요: https://script.google.com/home/usersettings

### 3. Google Sheet + Apps Script 생성

```bash
clasp create --title "MarketingROI Tracker" --type sheets
clasp push
```

### 4. 초기 설정 실행

1. Apps Script 에디터 열기: `clasp open`
2. 함수 드롭다운에서 **setupAll** 선택
3. **실행 (▶)** 클릭
4. 권한 승인: 계정 선택 → "고급" → "프로젝트로 이동" → "허용"

이렇게 하면 한 번에:
- 시트 4개 생성 (Raw Data, Attribution, Dashboard, Config)
- 30일치 테스트 데이터 삽입 (3채널 x 3캠페인)
- 애트리뷰션 계산 + 대시보드 반영
- 매일 오전 9시 자동 실행 트리거 설정

### 5. 실제 API 연결 (선택)

`Extensions > Apps Script > Project Settings > Script Properties`에서 입력:

| Property | 설명 | 필수 |
|----------|------|:----:|
| `GOOGLE_ADS_CUSTOMER_ID` | Google Ads 고객 ID (예: 123-456-7890) | Yes |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads API 개발자 토큰 | Yes |
| `GOOGLE_ADS_REFRESH_TOKEN` | OAuth2 Refresh Token | Yes |
| `FB_AD_ACCOUNT_ID` | Facebook 광고 계정 ID (예: act_123456) | Yes |
| `FB_ACCESS_TOKEN` | Facebook 장기 액세스 토큰 (60일 또는 System User) | Yes |
| `NAVER_ADS_CUSTOMER_ID` | 네이버 검색광고 광고주 ID | No |
| `NAVER_ADS_API_KEY` | 네이버 검색광고 API Key | No |
| `NAVER_ADS_SECRET_KEY` | 네이버 검색광고 Secret Key | No |
| `SLACK_WEBHOOK_URL` | Slack 에러 알림용 Webhook URL | No |

> 상세 인증 가이드: [auth_setup_instructions.md](./auth_setup_instructions.md) | 네이버 연동 가이드: [naver_setup_guide.md](./naver_setup_guide.md)

## Data Analysis

### 데이터 특징

**실무급 시뮬레이션 데이터** — 12가지 실무 패턴(채널 효율성, 요일 효과, 광고 피로도, A/B 테스트, 계절성 등)과 비즈니스 이벤트(블랙프라이데이, Facebook 추적 장애)를 반영한 810행 데이터셋입니다.

### 분석 실행

```bash
cd analysis
pip install -r requirements.txt
python generate_data.py
jupyter notebook
```

### 분석 노트북 (3개)

**기본 분석** — `MarketingROI_Analysis.ipynb` (30셀, 차트 10개)

| 섹션 | 분석 | 주요 기법 |
|------|------|----------|
| EDA | 채널별 성과, ROAS 추이, 캠페인 매트릭스 | Grouped Bar, Multi-Line, Bubble |
| 심층 분석 | 요일별 패턴, 체감수익 분석 | Heatmap, Scatter + Log Curve |
| 통계 검정 | t-test (주중/주말), ANOVA (채널 간) | Box Plot + p-value |
| 회귀 분석 | 선형 vs 로그 vs 다항식 모델 비교 | R² 비교, Multi-fit Scatter |
| 예산 최적화 | ROAS 기반 최적 배분, 한계 ROAS | Dual Bar, Line + Threshold |
| 이상치 탐지 | Z-score 기반 이상치 식별 | Timeline + Markers |

**고급 분석** — `MarketingROI_Advanced_Analysis.ipynb` (12셀, 차트 3개)

| 섹션 | 분석 | 주요 기법 |
|------|------|----------|
| Multi-Touch 애트리뷰션 | 5모델 비교 (Last/First/Linear/Decay/Position) | Grouped Bar, Revenue Share |
| 마케팅 퍼널 | CTR→CVR 병목 식별, CPA 비교 | Funnel Chart, Scatter |
| 시계열 예측 | ARIMA(2,1,2) + Holt-Winters 30일 예측 | Line + 95% CI Band |

**SQL 분석** — `MarketingROI_SQL_Analysis.ipynb` (27셀, 8개 쿼리)

| # | 분석 | SQL 기법 |
|---|------|----------|
| 1 | 채널별 KPI 요약 | GROUP BY + 집계 함수 |
| 2 | 일별 ROAS + 7일 이동평균 | AVG() OVER (ROWS BETWEEN) |
| 3 | 캠페인별 랭킹 | RANK() OVER (PARTITION BY) |
| 4 | 주중 vs 주말 비교 | CASE WHEN + EXTRACT(DOW) |
| 5 | 월별 성과 트렌드 | DATE_TRUNC + GROUP BY |
| 6 | 채널별 누적 매출 | SUM() OVER (ORDER BY) |
| 7 | 이상치 탐지 | CTE + Z-score (STDDEV OVER) |
| 8 | 예산 최적화 시뮬레이션 | 다단계 CTE + CROSS JOIN |

### Tableau 대시보드

Tableau Public으로 핵심 지표를 인터랙티브하게 시각화합니다. `analysis/data/` 폴더의 Tableau용 CSV 파일 3개를 사용합니다.

> 배포 로드맵 + 상세 가이드: [`analysis/TABLEAU_GUIDE.md`](./analysis/TABLEAU_GUIDE.md)

## Google Sheet 구조

| Sheet | 용도 | 갱신 주기 |
|-------|------|:---------:|
| **Raw Data** | API에서 수집한 원본 광고 데이터 (append only) | 매일 9시 |
| **Attribution** | 채널별 Spend / Revenue / ROAS 계산 결과 | 매일 9시 |
| **Dashboard** | Total Spend, Revenue, Avg ROAS, 채널 비교 | 매일 9시 |
| **Config** | Script Properties 설정 안내 | - |

## 데이터 흐름

```
[Google Ads API] ────┐
[Facebook Ads API] ──┤                                              ┌──→ Dashboard
[Naver Search Ads] ──┘──→ Code.gs: main() ──→ Raw Data ──→ Attribution.gs
                                │                               │   └──→ Funnel Analysis
                                │                               │
                                │                          Report.gs ──→ Anomaly Detection ──→ Slack
                                │                               └──→ Weekly Report ──→ Slack
                                └──→ Slack (에러 알림)
```

## Tests

`Tests.gs`에 핵심 비즈니스 로직에 대한 단위 테스트 **30개**가 포함되어 있습니다.

**실행**: Apps Script 에디터 → 함수 드롭다운 → `runAllTests` → 실행 (▶) → View → Logs

| 테스트 그룹 | 테스트 수 | 검증 내용 |
|-------------|:---------:|-----------|
| parseNaverAdsResponse | 3 | Naver API 응답 → Raw Data 스키마 변환 |
| isTimeLimitNear | 3 | 6분 실행 제한 체크 로직 |
| getYesterday | 1 | 날짜 포맷 (yyyy-MM-dd) |
| generateNaverSignature | 2 | HMAC-SHA256 서명 생성 |
| Data Validation | 2 | 8컬럼 스키마 검증 |
| Attribution Calculation | 4 | ROAS 계산, 0 나누기 방지, 다채널 집계 |
| Prune Logic | 2 | 90일 초과 데이터 필터링 |
| Time-Decay Weights | 2 | 지수 감쇠 가중치, 다채널 독립 계산 |
| Multi-Touch Attribution | 3 | First-Touch, Linear, Position-Based |
| Funnel Metrics | 3 | CTR, CVR, CPA 계산 및 0 나누기 방지 |
| Anomaly Detection | 2 | Z-score 계산, 정상 데이터 미경보 |
| Weekly Report | 3 | changeStr (+/- 표시), formatNum (콤마 포맷) |

## CI/CD

`.gs` 파일 변경 시 GitHub Actions가 자동 실행:

- **구문 검사**: 모든 `.gs` 파일의 JavaScript 문법 검증
- **시크릿 스캔**: API 키/토큰 하드코딩 여부 검사

수동 실행: [Actions 탭](https://github.com/Taek-D/marketing-roi-tracker/actions) → "Run workflow"

## 제약 사항

| 항목 | 제한 | 대응 |
|------|------|------|
| Google Ads API | 일 15,000 쿼리 | 배치 처리 |
| Facebook Ads API | 시간당 200 호출 | Rate Limit 대기 |
| Naver Search Ads API | 초당 100건, 일 100,000건 | 여유로움 |
| Apps Script 실행 | 최대 6분 | CONFIG.timeLimit = 300초 |
| Google Sheets | 10K행 이상 느려짐 | 90일치만 보존 |

## License

MIT License.
