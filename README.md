# MarketingROI Tracker

> 중소 이커머스를 위한 무료 멀티채널 마케팅 ROI 대시보드
> Google Ads, Facebook Ads, 네이버 검색광고 데이터를 자동 수집하여 Google Sheets에서 ROAS를 시각화

## Dashboard Preview

![Dashboard Preview](docs/screenshots/dashboard_preview.png)

> `generate_data.py`로 생성한 90일치 시뮬레이션 데이터 기반 대시보드. 12가지 실무 마케팅 패턴이 반영되어 있습니다.

## Interactive Dashboard

**[Live Demo](https://dashboard-kappa-self-57.vercel.app)** - Chart.js 기반 인터랙티브 대시보드 (Vercel 배포)

- KPI 카드 4개 (Total Spend, Revenue, ROAS, Conversions)
- 채널별 ROAS 바 차트 + 매출 비중 도넛 차트
- 90일 일별 ROAS 추이 + 7일 이동평균 라인 차트
- 캠페인 성과 매트릭스 (버블 차트)
- 퍼널 지표 테이블 (CTR, CVR, CPA)

## Features

- **자동 데이터 수집**: Google Ads / Facebook Ads / 네이버 검색광고에서 매일 오전 9시(KST) 자동 수집
- **ROAS 대시보드**: 채널별 Spend, Revenue, ROAS를 한눈에 비교
- **Multi-Touch 애트리뷰션**: 5가지 모델 비교 (Last-Touch, First-Touch, Linear, Time-Decay, Position-Based)
- **마케팅 퍼널 분석**: CTR, CVR, CPA, CPM 등 퍼널 단계별 핵심 지표 자동 산출
- **이상치 탐지**: Z-score 기반 ROAS 이상치 실시간 감지 + Slack 알림
- **주간 자동 리포트**: 주간 성과 요약 + 전주 대비 변화율 Slack 발송
- **시계열 예측**: ARIMA / Holt-Winters 모델로 30일 ROAS 예측 (Python 노트북)
- **SQL 분석**: Supabase PostgreSQL에서 Window Function, CTE, Z-score 등 고급 SQL 분석
- **인터랙티브 대시보드**: Chart.js 기반 인터랙티브 대시보드 (Vercel 배포)
- **Slack 알림**: API 에러, 이상치 감지, 주간 리포트 자동 발송
- **CI/CD**: `.gs` 파일 변경 시 자동 구문 검사 + 시크릿 스캔
- **Unit Tests**: 핵심 비즈니스 로직 단위 테스트 (30개 테스트 케이스)

## Quick Start (5분)

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

> 상세 인증 가이드: [auth_setup_instructions.md](./auth_setup_instructions.md)
> 네이버 연동 가이드: [naver_setup_guide.md](./naver_setup_guide.md)

## Project Structure

```
marketing-roi-tracker/
├── Code.gs                 # 메인 로직 (API 호출, 데이터 수집, Slack 알림)
├── Config.gs               # 전역 설정 (CONFIG 객체, getProperty, log)
├── Attribution.gs          # Multi-Touch 애트리뷰션 (5모델) + 퍼널 분석
├── Report.gs               # 이상치 탐지 (Z-score) + 주간 자동 리포트
├── Setup.gs                # 초기 설정 (시트 생성, 테스트 데이터, 트리거)
├── Tests.gs                # 단위 테스트 (30개 테스트 케이스)
├── CLAUDE.md               # Claude Code 개발 규칙
├── .claude/
│   ├── settings.local.json # 권한, Hooks 설정
│   ├── commands/           # Claude Code 커맨드 (4개)
│   │   ├── deploy.md               # clasp push 배포
│   │   ├── validate-code.md        # 코드 품질 검증
│   │   ├── add-api-integration.md  # 새 광고 플랫폼 연동
│   │   └── generate-test-data.md   # 테스트 데이터 생성
│   ├── agents/             # Claude Code 에이전트 (4개)
│   │   ├── code-reviewer.md        # 코드 리뷰 (보안/성능/표준)
│   │   ├── api-integrator.md       # API 연동 전문가
│   │   ├── attribution-analyst.md  # 애트리뷰션 모델 분석
│   │   └── gas-debugger.md         # GAS 디버깅 전문가
│   └── skills/             # Claude Code 스킬 (3개)
│       ├── marketing-roi-architecture.md  # 시스템 아키텍처
│       ├── marketing-roi-gas-patterns.md  # GAS 코딩 패턴
│       └── marketing-roi-attribution.md   # 애트리뷰션/지표 계산
├── .github/workflows/
│   └── validate.yml        # CI: 구문 검사 + 시크릿 스캔
├── .mcp.json               # MCP 서버 설정
├── docs/
│   ├── dashboard_mockup.html      # 대시보드 미리보기 (HTML)
│   └── screenshots/
│       └── dashboard_preview.png  # 대시보드 스크린샷
├── analysis/                   # 마케팅 ROI 심층 분석
│   ├── generate_data.py            # 현실적 패턴 내장 데이터 생성기
│   ├── MarketingROI_Analysis.ipynb          # 메인 분석 노트북 (9섹션, 10차트)
│   ├── MarketingROI_Advanced_Analysis.ipynb # 고급 분석 (애트리뷰션 비교, 퍼널, 예측)
│   ├── MarketingROI_SQL_Analysis.ipynb      # SQL 분석 (8개 쿼리, Supabase PostgreSQL)
│   ├── requirements.txt            # Python 의존성
│   ├── data/
│   │   └── marketing_raw_data.csv  # 90일 x 3채널 x 3캠페인 (810행)
│   ├── charts/                     # 고해상도 분석 차트 (PNG 13개)
│   └── report/
│       └── executive_summary.md    # 경영진용 인사이트 보고서
├── dashboard/                  # 인터랙티브 대시보드 (Vercel 배포)
│   └── index.html                  # Chart.js 기반 인터랙티브 대시보드
├── PRD.md                  # 제품 요구사항 문서
├── blueprint.md            # 프로젝트 블루프린트 (API 스펙)
├── auth_setup_instructions.md  # Google/Facebook 인증 가이드
└── naver_setup_guide.md    # 네이버 검색광고 API 연동 가이드
```

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

## 개발 가이드

### 로컬 개발 워크플로우

```bash
# 코드 수정 후 배포
clasp push

# Apps Script에서 코드 가져오기
clasp pull

# 브라우저에서 에디터 열기
clasp open
```

### Claude Code 활용

이 프로젝트는 Claude Code 설정이 완비되어 있습니다. Claude Code에서 다음 커맨드를 사용할 수 있습니다:

| 커맨드 | 용도 | 사용법 |
|--------|------|--------|
| `/deploy` | Apps Script에 코드 배포 | Claude Code에서 `/deploy` 입력 |
| `/validate-code` | 코드 품질 검증 (보안, 성능, 스키마) | Claude Code에서 `/validate-code` 입력 |
| `/add-api-integration` | 새 광고 플랫폼 연동 | `/add-api-integration 네이버 GFA` |
| `/generate-test-data` | 테스트 더미 데이터 생성 | Claude Code에서 `/generate-test-data` 입력 |

### 코딩 컨벤션

- `const` / `let` 사용 (`var` 금지)
- 모든 함수에 JSDoc 주석 필수
- `Logger.log()` 대신 `log()` 함수 사용
- API 호출 시 try-catch + `notifySlack()` 필수
- 민감 정보는 `getProperty()` 로만 접근 (하드코딩 금지)

### 새 광고 플랫폼 추가하기

1. `Code.gs`에 `fetch{Platform}Data()` 함수 추가 (기존 패턴 참고)
2. `Config.gs`의 `CONFIG.api`에 새 플랫폼 설정 추가
3. `main()`에 호출 추가
4. `clasp push`로 배포

### Raw Data 스키마

| Column | Index | Type | 설명 |
|--------|:-----:|------|------|
| date | 0 | string | yyyy-MM-dd |
| channel | 1 | string | 광고 채널명 |
| campaign | 2 | string | 캠페인명 |
| cost | 3 | number | 광고비 ($) |
| impressions | 4 | number | 노출수 |
| clicks | 5 | number | 클릭수 |
| conversions | 6 | number | 전환수 |
| revenue | 7 | number | 매출 ($) |

## Tests

`Tests.gs`에 핵심 비즈니스 로직에 대한 단위 테스트가 포함되어 있습니다.

**실행 방법**: Apps Script 에디터 → 함수 드롭다운 → `runAllTests` → 실행 (▶) → View → Logs

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
| Multi-Touch Attribution | 3 | First-Touch (노출 가중), Linear (균등), Position-Based (U-Shape) |
| Funnel Metrics | 3 | CTR, CVR, CPA 계산 및 0 나누기 방지 |
| Anomaly Detection | 2 | Z-score 계산, 정상 데이터 미경보 |
| Weekly Report | 3 | changeStr (+/- 표시), formatNum (콤마 포맷) |
| **합계** | **30** | |

## 제약 사항

| 항목 | 제한 | 대응 |
|------|------|------|
| Google Ads API | 일 15,000 쿼리 | 배치 처리 |
| Facebook Ads API | 시간당 200 호출 | Rate Limit 대기 |
| Naver Search Ads API | 초당 100건, 일 100,000건 | 여유로움 |
| Apps Script 실행 | 최대 6분 | CONFIG.timeLimit = 300초 |
| Google Sheets | 10K행 이상 느려짐 | 90일치만 보존 |

## CI/CD

`.gs` 파일 변경 시 GitHub Actions가 자동 실행:

- **구문 검사**: 모든 `.gs` 파일의 JavaScript 문법 검증
- **시크릿 스캔**: API 키/토큰 하드코딩 여부 검사

수동 실행: [Actions 탭](https://github.com/Taek-D/marketing-roi-tracker/actions) → "Run workflow"

## 데이터 분석 (analysis/)

Apps Script 자동화 시스템에서 수집하는 데이터를 기반으로 한 **마케팅 ROI 심층 분석** 포트폴리오입니다.

### 데이터 특징

**실무급 시뮬레이션 데이터** (Production-Grade Simulation)
- **12가지 실무 패턴 반영**: 채널 효율성, 요일 효과, 광고 피로도, 예산 제약, A/B 테스트, 계절성 등
- **현 실적 노이즈**: ±15-25% 불규칙성으로 실제 마케팅 데이터의 복잡성 재현
- **비즈니스 이벤트**: 블랙프라이데이, 11.11 세일, Facebook 추적 장애 등
- **분석 방법론**: 실무에서 즉시 적용 가능한 통계 검정, 회귀 분석, 예산 최적화 기법

> ⚠️ **주의**: 이 데이터는 교육 및 포트폴리오 목적의 **시뮬레이션 데이터**입니다. 
> 하지만 실제 마케팅 캠페인의 패턴과 복잡성을 충실히 반영하여, 
> 분석 방법론과 인사이트 도출 역량을 입증하는 데 적합합니다.

### 분석 실행

```bash
cd analysis
pip install -r requirements.txt
python generate_data.py          # 실무급 데이터 생성 (12가지 패턴)
jupyter notebook MarketingROI_Analysis.ipynb          # 기본 분석 노트북
jupyter notebook MarketingROI_Advanced_Analysis.ipynb  # 고급 분석 (애트리뷰션, 퍼널, 예측)
```

### 분석 내용

| 섹션 | 분석 | 주요 차트 |
|------|------|--------------|
| EDA | 채널별 성과, ROAS 추이, 캠페인 매트릭스 | Grouped Bar, Multi-Line, Bubble |
| 심층 분석 | 요일별 패턴, 체감수익 분석 | Heatmap, Scatter + Log Curve |
| 통계 검정 | t-test (주중/주말), ANOVA (채널 간) | Box Plot + p-value |
| 회귀 분석 | 선형 vs 로그 vs 다항식 모델 비교 | Multi-fit Scatter |
| 예산 최적화 | ROAS 기반 최적 배분, 한계 ROAS | Dual Bar, Line + Threshold |
| 이상치 탐지 | Z-score 기반 이상치 식별 | Timeline + Markers |

**고급 분석 노트북** (`MarketingROI_Advanced_Analysis.ipynb`):

| 섹션 | 분석 | 주요 차트 |
|------|------|-----------|
| Multi-Touch 애트리뷰션 | 5모델 비교 (Last/First/Linear/Decay/Position) | Grouped Bar, Revenue Share Pie |
| 마케팅 퍼널 | 정규화 퍼널, CTR vs CVR 관계, CPA 비교 | Funnel Chart, Scatter, Bar |
| 시계열 예측 | ARIMA(2,1,2) + Holt-Winters 30일 예측 | Line + 95% CI Band |

**SQL 분석 노트북** (`MarketingROI_SQL_Analysis.ipynb`):

Supabase PostgreSQL에 적재된 데이터를 대상으로 고급 SQL 분석을 수행합니다.

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

### Tableau 인터랙티브 대시보드

Tableau Public으로 핵심 지표를 시각화했습니다.

**대시보드 사용 방법**:
1. Tableau Public Desktop 설치 (무료)
2. `analysis/data/` 폴더의 Tableau용 CSV 파일 로드:
   - `tableau_summary.csv` - 채널별 집계
   - `tableau_daily.csv` - 일별 트렌드
   - `tableau_campaign.csv` - 캠페인 상세

**추천 차트**:
- 채널별 ROAS 비교 (Bar Chart)
- 일별 ROAS 추이 (Line Chart)
- 캠페인 성과 매트릭스 (Bubble Chart)

자세한 가이드: [`analysis/TABLEAU_GUIDE.md`](./analysis/TABLEAU_GUIDE.md)

### 핵심 인사이트

- Naver Ads ROAS(3.28)가 Google(2.77), Facebook(2.05) 대비 최고 효율
- ROAS 가중 예산 재배분으로 동일 예산 대비 **+4.3% 매출 증가** 가능
- A/B 테스트 결과 새 소재로 CTR +25%, ROAS +10% 개선
- 상세 내용: [`analysis/report/executive_summary.md`](./analysis/report/executive_summary.md)

## Tech Stack

- **Google Apps Script** (JavaScript ES6)
- **Google Ads API** v18
- **Facebook Marketing API** v21
- **Naver Search Ads API**
- **Google Sheets** (Dashboard)
- **Supabase PostgreSQL** (SQL 분석)
- **Chart.js** (인터랙티브 대시보드)
- **Vercel** (대시보드 배포)
- **Slack Webhook** (알림)
- **clasp** (로컬 개발/배포)
- **GitHub Actions** (CI)

## License

MIT License.
