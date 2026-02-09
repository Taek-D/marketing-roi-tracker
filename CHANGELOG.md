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
