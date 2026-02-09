# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### TODO — 향후 진행 예정
- [x] GitHub에서 노트북 렌더링 정상 확인
- [ ] Google Ads / Facebook Ads / Naver Ads 실제 API 연동 테스트
- [x] clasp push를 통한 Apps Script 배포 및 실행 검증
- [ ] 실 데이터 기반 분석 노트북 2차 버전 작성
- [x] Tableau Public 대시보드 준비

---

## [0.4.0] - 2026-02-09

### Changed — 실무급 시뮬레이션 데이터로 업그레이드
- **데이터 생성 고도화**: 7가지 → 12가지 실무 패턴 반영
  - 기존: 채널 효율성, 캠페인 차이, 요일 효과, 성장 트렌드, 체감수익, 블랙프라이데이, FB 추적장애
  - 신규: 광고 피로도, 경쟁사 이벤트 (Naver 11.11), 예산 제약, A/B 테스트, 계절성
- **노이즈 증가**: ±12% → ±15-25%로 현실감 강화
- **백업**: 기존 데이터 → `marketing_raw_data_backup.csv`

### Added — Tableau Public 대시보드 준비
- `analysis/export_for_tableau.py`: Tableau용 데이터 Export 스크립트
  - `tableau_summary.csv`: 채널별 집계 (3행)
  - `tableau_daily.csv`: 일별 트렌드 (270행)
  - `tableau_campaign.csv`: 캠페인 상세 (9행)
- `analysis/DATA_DOWNLOAD_GUIDE.md`: 데이터 다운로드 가이드 (Kaggle/Maven Analytics)
- `analysis/download_kaggle_data.py`: Kaggle API 다운로드 스크립트

### Updated
- `README.md`: "실무급 시뮬레이션 데이터" 섹션 추가
  - 12가지 패턴 설명
  - Tableau 대시보드 사용법
  - A/B 테스트 인사이트 추가
- `analysis/generate_data.py`: Production-Grade 버전으로 전면 개선


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
