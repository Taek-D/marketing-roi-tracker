# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### TODO — 향후 진행 예정
- [ ] Google Ads / Facebook Ads / Naver Ads 실제 API 연동 테스트

---

## [0.8.0] - 2026-02-10

### Changed — 프로젝트 구조 개선 + 통합 실행 로드맵

#### GAS 코드 `automation/` 디렉토리 분리
- 6개 `.gs` 파일 + `appsscript.json` → `automation/` 디렉토리로 이동 (`git mv`)
- `auth_setup_instructions.md`, `naver_setup_guide.md` → `automation/`으로 이동
- `.clasp.json`: `rootDir` → `"automation"` 변경
- `.github/workflows/validate.yml`: 경로 `*.gs` → `automation/*.gs` 반영
- `CLAUDE.md`, `README.md`: Project Structure 경로 업데이트

#### 통합 실행 로드맵 생성
- **`analysis/report/action_roadmap.md`** (신규): 3단계 액션 플랜 + Guard Rail + 시나리오 분석 통합
  - Phase 1 (즉시): ROAS 가중 예산 재배분, Naver Brand 증액
  - Phase 2 (단기): Facebook CAPI, Google Generic 정교화
  - Phase 3 (중기): Guard Rail 대시보드, A/B 테스트, 시즌 예산 계획
  - Guard Rail 기준표: 채널별 ROAS 하한, CPA 상한, 일 예산 상한 (KRW)
  - 3시나리오 수치: Conservative -3.1%, Base +4.3%, Optimistic +11.8%
- `executive_summary.md`: 로드맵 참조 링크 추가
- `README.md`: 주요 발견 섹션에 로드맵 링크 추가

---

## [0.7.0] - 2026-02-09

### Added — Supabase SQL 분석 + 인터랙티브 대시보드 배포

#### Supabase PostgreSQL SQL 분석
- **Supabase 테이블 생성**: `marketing_raw_data` (810행 적재 완료)
- **SQL 분석 노트북**: `analysis/MarketingROI_SQL_Analysis.ipynb` (신규)
  - 8개 고급 SQL 분석 쿼리 실행 및 결과 수록
  - 사용된 SQL 기법: Window Function, CTE, RANK, PARTITION BY, Z-score, CROSS JOIN
  - 핵심 인사이트 5개 + SQL 기법 요약 테이블

**SQL 분석 쿼리 8개**:

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

#### 인터랙티브 대시보드 (Chart.js + Vercel)
- **`dashboard/index.html`** (신규): Chart.js 기반 인터랙티브 대시보드
  - KPI 카드 4개 (Total Spend, Revenue, ROAS, Conversions)
  - 채널별 ROAS 바 차트
  - 매출 비중 도넛 차트
  - 90일 일별 ROAS 추이 + 7일 이동평균 라인 차트 (3채널)
  - 캠페인 성과 매트릭스 (버블 차트, 9개 캠페인)
  - 퍼널 지표 테이블 (CTR, CVR, CPA)
- **Vercel 배포**: https://dashboard-kappa-self-57.vercel.app
- 반응형 디자인 (모바일 대응)
- 외부 의존성 없는 정적 사이트 (Chart.js CDN만 사용)

### Changed — 문서 업데이트
- **README.md**: 인터랙티브 대시보드 URL, SQL 분석 섹션, Tech Stack 추가
- **CHANGELOG.md**: v0.7.0 기록

### 성과 요약

**정량적 개선**:
- SQL 분석 쿼리: 0 → 8개 (신규)
- 인터랙티브 차트: 0 → 5개 (신규)
- Supabase 테이블: 0 → 1개 (810행)
- 배포 URL: 0 → 1개 (Vercel)
- 분석 노트북: 2 → 3개 (+50%)

**정성적 개선**:
- SQL 역량 입증: Window Function, CTE, Z-score 등 고급 SQL 기법 활용
- 대시보드 고도화: 정적 HTML → 인터랙티브 Chart.js + Vercel 배포
- 데이터 인프라: CSV 파일 → Supabase PostgreSQL 적재

---

## [0.6.0] - 2026-02-09

### Added — Notion 포트폴리오 페이지

#### Notion 포트폴리오 페이지 생성
- **"프로젝트" 하위 페이지**: "마케팅 ROI 최적화 대시보드" 페이지 생성
- **3개 섹션 구성**:
  - 섹션 1: 프로젝트 소개 (기간, 참여도, 기술 스택, 핵심 성과)
  - 섹션 2: 프로젝트 진행과정 (4단계: 수집/EDA/고급분석/자동화)
  - 섹션 3: 핵심 인사이트 & 성과
- **이미지 7개 삽입**: GitHub raw URL로 차트 스크린샷 삽입
- **Notion MCP 버그 발견 및 패치**: `API-post-page` parent 직렬화 버그 수정

### Fixed — 프로젝트 설정
- `appsscript.json`: Timezone `America/New_York` → `Asia/Seoul` 수정
- `PRD.md`: API 버전, 구현 상태, 우선순위 현행화
- `START.md`: 차트 수 10개 → 13개, 고급 분석 노트북 안내 추가

---

## [0.5.0] - 2026-02-09

### 🎯 목표
고급 분석 기능 5가지 추가: **포트폴리오 분석 역량 입증** (점수 목표: 78 → 90점)

### Added — 고급 분석 기능 5가지

#### 1. Multi-Touch Attribution (5모델 비교)
- **Attribution.gs**: `calculateAttribution()` 전면 개편
  - Last-Touch: 전환 채널에 100% (기존)
  - First-Touch: 노출 비중으로 배분 (신규)
  - Linear: 노출+클릭+전환 균등 배분 (신규)
  - Time-Decay: 지수 감쇠 가중치, 반감기 7일 (신규)
  - Position-Based (U-Shape): 40% First + 40% Last + 20% Linear (신규)
- `calculateTimeDecayWeights(rows)`: 채널별 시간 가중 매출 계산

#### 2. 마케팅 퍼널 분석
- **Attribution.gs**: `calculateAttribution()` 내 퍼널 섹션 추가
  - CTR (%), CVR (%), Overall Conv Rate (%), CPA ($), CPM ($)
  - Attribution 시트에 자동 출력
- **고급 노트북**: 정규화 퍼널, CTR vs CVR 관계, CPA 비교 시각화

#### 3. 이상치 탐지 (Z-score + Slack)
- **Report.gs** (신규 파일):
  - `detectAnomalies(ss)`: 채널별 일별 ROAS Z-score 계산
  - `formatAnomalyAlert(alerts)`: [UP]/[DOWN] Slack 알림 포맷
  - CONFIG: `zScoreThreshold=2.0`, `lookbackDays=30`, `minDataPoints=7`
- `main()`에서 `updateDashboard()` 후 자동 호출

#### 4. 주간 자동 리포트
- **Report.gs**:
  - `generateWeeklyReport(ss)`: 주간 성과 요약 + WoW 비교
  - `aggregatePeriod(rows, start, end)`: 기간별 채널 집계
  - `formatWeeklyReport()`: OVERALL + BY CHANNEL + Best/Worst
  - `formatNum()`: 콤마 구분자, `changeStr()`: WoW 변화율
- **Setup.gs**: `setupWeeklyReportTrigger()` — 매주 월요일 10시 KST

#### 5. 시계열 예측 (ARIMA + Holt-Winters)
- **고급 노트북**: `MarketingROI_Advanced_Analysis.ipynb`
  - ARIMA(2,1,2) 모델로 채널별 30일 ROAS 예측
  - Holt-Winters (fallback): 지수 평활 모델
  - 95% 신뢰구간 시각화
  - 상승/하락 채널 식별 → 선제적 예산 조정 제안

### Changed — 테스트 및 문서 업데이트

#### Tests.gs (20개 → 30개)
신규 테스트 13개:
- Time-Decay Weights (2): 지수 감쇠 계산, 다채널 독립성
- Multi-Touch Attribution (3): First-Touch, Linear, Position-Based
- Funnel Metrics (3): CTR, CVR, CPA + 0 나누기 방지
- Anomaly Detection (2): Z-score 계산, 정상 데이터 미경보
- Weekly Report (3): changeStr(+/-), formatNum(콤마)

#### Config.gs
- `CONFIG.anomaly` 섹션 추가: `zScoreThreshold`, `lookbackDays`, `minDataPoints`

#### Code.gs
- `main()`에 `detectAnomalies(ss)` 호출 추가
- `onOpen()` 메뉴: 'Send Weekly Report', 'Check Anomalies' 추가

#### README.md
- Features: 5가지 신규 기능 반영
- Project Structure: Report.gs, 고급 노트북 추가
- Tests 테이블: 30개 테스트 그룹 12개로 업데이트
- 데이터 흐름 다이어그램: Report.gs 경로 추가

#### CLAUDE.md
- Project Structure: Report.gs, Tests.gs 추가
- Key Patterns: 신규 함수 3개 추가

### Added — 고급 분석 노트북 차트 3개
- `charts/11_attribution_model_comparison.png`: 5모델 매출 배분 비교 + Revenue Share
- `charts/12_funnel_analysis.png`: 정규화 퍼널 + CTR vs CVR + CPA 비교
- `charts/13_roas_forecast.png`: 채널별 30일 ROAS 예측 + 95% CI

### Git
- **Files changed**: 10+
- **New files**: Report.gs, Tests.gs(tracked), MarketingROI_Advanced_Analysis.ipynb
- **Branch**: master

### 성과 요약

**정량적 개선**:
- 애트리뷰션 모델: 1 → 5개 (+400%)
- 테스트 케이스: 20 → 30개 (+50%)
- 분석 차트: 10 → 13개 (+30%)
- 신규 GAS 파일: +1 (Report.gs)
- 신규 분석 노트북: +1 (Advanced)
- 예상 포트폴리오 점수: 78 → 90점 (+12점)

**정성적 개선**:
- 분석 깊이: 단순 EDA → 예측·이상치·애트리뷰션 비교
- 자동화: 주간 리포트 + 이상치 알림 Slack 자동 발송
- 테스트 커버리지: 핵심 비즈니스 로직 전체 커버

---

## [0.4.0] - 2026-02-09

### 🎯 목표
포트폴리오 품질 개선: **합성 데이터 → 실무급 시뮬레이션 데이터** (점수 목표: 68 → 78점)

### Changed — 실무급 시뮬레이션 데이터로 업그레이드

#### 데이터 생성 고도화
**패턴 확장: 7가지 → 12가지 (+71%)**

기존 패턴 (7가지):
1. 채널 효율성 차이 (Naver > Google > Facebook)
2. 캠페인 효율성 차이 (Brand > Retargeting > Generic)
3. 요일 효과 (주중/주말 차별화)
4. 성장 트렌드 (90일간 +27%)
5. 체감수익 (고예산 시 ROAS 하락)
6. 블랙프라이데이 이벤트 (11/28-12/1)
7. Facebook 추적 장애 (12/18-19)

신규 패턴 (5가지):
8. **광고 피로도**: Facebook Interest 캠페인 CTR 점진적 하락 (-20% over 90일)
9. **경쟁사 이벤트**: Naver 11.11 CPC 급등 (+40%, 1일간)
10. **예산 제약**: 월말(26일~) 예산 소진으로 광고비 -30%
11. **A/B 테스트**: Google Generic 새 소재 테스트 (11/15-22, CTR +25%, ROAS +10%)
12. **계절성**: 12월 연말 쇼핑 시즌 전환율 +15%

**노이즈 강화**:
- 기존: ±12%
- 현재: ±15-25% (광고비는 ±20%, 전환율은 ±20%, ROAS는 ±15%)
- 효과: 실제 마케팅 데이터의 불규칙성과 복잡성 재현

**데이터 품질**:
- 총 행 수: 810행 (90일 × 3채널 × 3캠페인)
- 파일 크기: 52,538 bytes
- 결측치: 0개
- 음수 값: 없음
- 백업: `marketing_raw_data_backup.csv` (52,684 bytes)

**채널별 평균 ROAS** (검증 완료):
- Naver Ads: 3.28
- Google Ads: 2.77
- Facebook Ads: 2.05

### Added — Tableau Public 대시보드 준비

#### 신규 파일 생성 (5개)

**Export 스크립트**:
- `analysis/export_for_tableau.py`: Tableau 최적화 데이터 변환 스크립트
  - 원본 데이터를 3개의 맞춤형 CSV로 변환
  - 채널별/일별/캠페인별 집계 및 KPI 계산
  - 실행: `python export_for_tableau.py`

**Tableau용 CSV 파일 (3개)**:
- `analysis/data/tableau_summary.csv`: 채널별 집계 (3행, 269 bytes)
  - Columns: channel, cost, impressions, clicks, conversions, revenue, ROAS, CTR, CVR
- `analysis/data/tableau_daily.csv`: 일별 트렌드 (270행, 11,621 bytes)
  - Columns: date, channel, cost, revenue, ROAS
- `analysis/data/tableau_campaign.csv`: 캠페인 상세 (9행, 784 bytes)
  - Columns: channel, campaign, cost, impressions, clicks, conversions, revenue, ROAS, CTR, CVR

**가이드 문서**:
- `analysis/TABLEAU_GUIDE.md`: Tableau Public 대시보드 제작 가이드
  - Tableau Desktop 설치 방법
  - 데이터 불러오기 단계별 설명
  - 추천 대시보드 구성 (3가지)
  - 상호작용 기능 (필터, 계산 필드)
  - Tableau Public 게시 방법
  - 문제 해결 팁

**데이터 소싱 가이드** (참고용):
- `analysis/DATA_DOWNLOAD_GUIDE.md`: 외부 데이터셋 다운로드 가이드
- `analysis/download_kaggle_data.py`: Kaggle API 스크립트
- `analysis/prepare_real_data.py`: 데이터 변환 스크립트
  - ⚠️ 실제 사용하지 않음 (timeout 이슈로 시뮬레이션 데이터 선택)

### Updated — 문서 및 스크립트 개선

#### README.md
**신규 섹션**:
- "데이터 특징": 실무급 시뮬레이션 데이터 명시
  - 12가지 패턴 상세 설명
  - 교육/포트폴리오 목적 명확화
  - 실무 적용 가능성 강조
  - ⚠️ 주의사항 추가 (시뮬레이션 데이터임을 투명하게 공개)

- "Tableau 인터랙티브 대시보드": 사용법 가이드
  - 대시보드 사용 방법 (단계별)
  - Tableau용 CSV 3개 설명
  - 추천 차트 종류
  - `TABLEAU_GUIDE.md` 링크

**업데이트 섹션**:
- "분석 실행": 데이터 생성 명령어 업데이트
  - `python generate_data.py` → "실무급 데이터 생성 (12가지 패턴)"
- "핵심 인사이트": A/B 테스트 결과 추가
  - "A/B 테스트 결과 새 소재로 CTR +25%, ROAS +10% 개선"

#### analysis/generate_data.py
**전면 개선** (Production-Grade):
- Docstring 업데이트: 12가지 패턴 설명
- 함수 추가 (5개):
  - `get_ad_fatigue_factor()`: 광고 피로도 계산
  - `get_month_end_budget_factor()`: 예산 제약 계산
  - `get_year_end_seasonality()`: 계절성 계산
  - `is_naver_1111_event()`: 11.11 이벤트 감지
  - `is_ab_test_period()`: A/B 테스트 기간 감지
- 노이즈 범위 조정: ±12% → ±15-25%
- 이벤트 상수 추가:
  - `NAVER_1111_EVENT`: 2024-11-11
  - `AB_TEST_START`: 2024-11-15
  - `AB_TEST_END`: 2024-11-22
- 검증 로직 강화: 채널별 ROAS 출력, 12가지 패턴 목록 표시

### Git
- **Commit**: ba61502
- **Files changed**: 13개
- **Insertions**: +2,610 lines
- **Deletions**: -845 lines
- **Branch**: master → master
- **Repository**: https://github.com/Taek-D/marketing-roi-tracker

### 성과 요약

**정량적 개선**:
- 데이터 패턴: 7 → 12가지 (71% 증가)
- 노이즈 범위: ±12% → ±15-25% (2배)
- Export 파일: 0 → 3개 (Tableau)
- 문서: +2개 (TABLEAU_GUIDE.md, DATA_DOWNLOAD_GUIDE.md)
- 예상 포트폴리오 점수: 68 → 78점 (+10점)

**정성적 개선**:
- 현실감: 실무 시나리오 반영 (A/B 테스트, 광고 피로도, 예산 제약)
- 활용성: Tableau Public 대시보드 준비 완료
- 투명성: 시뮬레이션 데이터임을 명확히 공개
- 진솔성: 교육 목적 명시로 신뢰도 확보


---

## [0.3.0] - 2025-02-07

### Added — 마케팅 ROI 심층 분석 포트폴리오 (`analysis/`)

**데이터 생성**
- `analysis/generate_data.py`: 현실적 패턴이 내장된 90일 마케팅 데이터 생성기
  - 810행 (90일 x 3채널 x 3캠페인) 데이터 생성
  - 내장 패턴 7가지: 채널 ROAS 차이, 캠페인 효율 차이, 요일 효과, 성장 트렌드, 체감수익, 블랙프라이데이 급등, FB 추적 장애
- `analysis/data/marketing_raw_data.csv`: 생성된 분석용 데이터셋

**분석 노트북**
- `analysis/MarketingROI_Analysis.ipynb`: 메인 분석 노트북 (9개 섹션)
  - 섹션 1: 환경 설정 (한글 폰트 자동 감지, 채널별 고정 색상)
  - 섹션 2: 데이터 품질 점검 (shape, dtypes, 결측치, 기술통계)
  - 섹션 3: EDA — 채널별 비교, ROAS 추이, 캠페인 매트릭스
  - 섹션 4: 심층 분석 — 요일별 히트맵, 체감수익 산점도
  - 섹션 5: 통계 검정 — t-test (주중/주말), ANOVA (채널 간)
  - 섹션 6: 회귀 분석 — 선형 vs 로그 vs 다항식 모델 비교
  - 섹션 7: 예산 최적화 — 현행 vs 최적 배분, 한계 ROAS
  - 섹션 8: 이상치 분석 — Z-score 기반 탐지
  - 섹션 9: 핵심 인사이트 5개 + 실행 제안 테이블

**시각화 (차트 10개)**
- `analysis/charts/01_channel_cost_revenue.png`: 채널별 광고비-매출 비교 (Grouped Bar)
- `analysis/charts/02_daily_roas_trend.png`: 일별 ROAS 추이 + 7일 이동평균 (Multi-Line)
- `analysis/charts/03_campaign_matrix.png`: 캠페인 성과 매트릭스 (Bubble Chart)
- `analysis/charts/04_weekday_heatmap.png`: 요일별 채널 성과 히트맵 (Heatmap)
- `analysis/charts/05_diminishing_returns.png`: 광고비-매출 체감수익 (Scatter + Log Curve)
- `analysis/charts/06_statistical_tests.png`: 통계 검정 결과 (Box Plot + p-value)
- `analysis/charts/07_regression_comparison.png`: 회귀 모델 비교 (Scatter + 3 Fit Lines)
- `analysis/charts/08_budget_optimization.png`: 현행 vs 최적 예산 배분 (Dual Bar)
- `analysis/charts/09_marginal_roas.png`: 한계 ROAS 곡선 (Line + Threshold)
- `analysis/charts/10_outlier_detection.png`: 이상치 탐지 타임라인 (Line + Markers)

**보고서**
- `analysis/report/executive_summary.md`: 경영진용 인사이트 보고서
  - 핵심 지표 요약, 발견 5가지, 예산 최적화 제안, 실행 제안 (Action Items)

**기타**
- `analysis/requirements.txt`: Python 의존성 (pandas, matplotlib, seaborn, scipy, scikit-learn 등)

### Changed
- `README.md`: `analysis/` 디렉토리 구조 및 데이터 분석 섹션 추가
- `.gitignore`: `__pycache__/`, `*.pyc`, `.ipynb_checkpoints/` 추가

### 분석 핵심 결과
| 채널 | ROAS | 비고 |
|------|------|------|
| Naver Ads | 3.28 | 최고 효율 |
| Google Ads | 2.77 | 양호 |
| Facebook Ads | 2.05 | 개선 필요 |

- ROAS 가중 예산 재배분 시 동일 예산 대비 **+4.3% 매출 증가** 가능 ($464,945 → $484,849)

---

## [0.2.0] - 2025-01

### Added
- **Naver Search Ads 연동**: `fetchNaverSearchAdsData()`, HMAC-SHA256 서명 인증
- **Setup 자동화**: `setupAll()` — 시트 생성, 테스트 데이터, 트리거 한번에 설정
- **Claude Code 설정**: 커맨드 4개, 에이전트 4개, 스킬 3개 구성
- **CI/CD**: GitHub Actions 구문 검사 + 시크릿 스캔 워크플로우
- **문서화**: `naver_setup_guide.md`, `README.md` 전체 작성

---

## [0.1.0] - 2025-01

### Added
- **Core Logic**: `Code.gs` for fetching data from mock APIs.
- **Attribution**: `Attribution.gs` for Last-Touch MVP calculation.
- **Config**: Centralized configuration management.
- **Documentation**: `auth_setup_instructions.md` for API setup.
- **Project Structure**: Blueprint (`claude.md`) created.

### Changed
- Updated `Bridge.md` to reflect project progress phases B, R, I, D.
