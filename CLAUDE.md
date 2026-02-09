# MarketingROI Tracker - Development Rules

## Project Overview
Google Apps Script 기반 마케팅 ROI 자동화 대시보드.
Google Ads / Facebook Ads / Naver Search Ads 데이터를 수집하여 Google Sheets에서 ROAS를 시각화.

## Tech Stack
- **Language**: Google Apps Script (JavaScript ES6 기반)
- **Runtime**: Google Apps Script (clasp로 로컬 개발 가능)
- **APIs**: Google Ads API v18, Facebook Marketing API v21, Naver Search Ads API
- **Frontend**: Google Sheets (Dashboard)
- **Notifications**: Slack Webhook

## Project Structure
```
automation/              # GAS 자동화 코드
  Code.gs                # 메인 로직 (API 호출, 데이터 수집, main 엔트리)
  Config.gs              # 설정 상수 (CONFIG 객체) 및 유틸리티
  Attribution.gs         # Multi-Touch 애트리뷰션 (5모델) + 퍼널 분석, 대시보드 업데이트
  Report.gs              # 이상치 탐지 (Z-score) + 주간 자동 리포트
  Setup.gs               # 초기 설정 (시트 생성, 테스트 데이터, 트리거)
  Tests.gs               # 단위 테스트 (30개 테스트 케이스)
  appsscript.json        # Apps Script 매니페스트
  auth_setup_instructions.md  # Google/Facebook 인증 가이드
  naver_setup_guide.md   # 네이버 검색광고 API 연동 가이드
CLAUDE.md                # 프로젝트 개발 규칙 (이 파일)
PRD.md                   # 제품 요구사항 문서
```
> 전체 프로젝트 구조는 README.md 참조

## Coding Conventions

### Google Apps Script 규칙
- `var` 대신 `const` / `let` 사용
- 모든 함수에 JSDoc 주석 필수
- `Logger.log()` 대신 프로젝트 내 `log()` 함수 사용
- API 호출 시 반드시 에러 핸들링 포함 (try-catch + Slack 알림)
- `PropertiesService`로 민감한 키 관리 (코드에 하드코딩 금지)

### 데이터 스키마 (Raw Data Sheet)
| date | channel | campaign | cost | impressions | clicks | conversions | revenue |
|------|---------|----------|------|-------------|--------|-------------|---------|
Row index: 0=date, 1=channel, 2=campaign, 3=cost, 4=impressions, 5=clicks, 6=conversions, 7=revenue

### API 제약 사항
- Google Ads: 일 15,000 쿼리 제한
- Facebook Ads: 시간당 200 호출 제한
- Naver Search Ads: 초당 100건, 일 100,000건
- Google Apps Script: 실행 시간 최대 6분 → CONFIG.timeLimit = 300초
- Google Sheets: 10,000행 이상 성능 저하 → 90일치만 보존

## Sheet Names (CONFIG.sheetNames)
- `Raw Data` - 원본 광고 데이터
- `Attribution` - 애트리뷰션 계산 결과
- `Dashboard` - 사용자용 대시보드
- `Config` - 설정

## Key Patterns
- **CONFIG 객체** (Config.gs): 전역 설정 관리, sheetNames/api/slack 등
- **getProperty(key)**: Script Properties 접근 래퍼
- **notifySlack(message)**: 에러 발생 시 Slack Webhook 알림
- **appendDataToSheet(sheet, data)**: Raw Data 시트에 데이터 append
- **calculateAttribution()**: 5가지 Multi-Touch 모델 + 퍼널 메트릭 계산
- **calculateTimeDecayWeights()**: 지수 감쇠 가중치 (half-life 7일)
- **detectAnomalies()**: Z-score 기반 ROAS 이상치 탐지 + Slack 알림
- **generateWeeklyReport()**: 주간 성과 요약 + WoW 비교 Slack 발송
- **updateDashboard()**: Dashboard 시트 갱신 (마지막 업데이트 시간 기록)
- **onOpen()**: 스프레드시트 열 때 커스텀 메뉴 "MarketingROI Tracker" 생성
- **fetchNaverSearchAdsData()**: 네이버 검색광고 데이터 수집 (HMAC-SHA256 인증)
- **generateNaverSignature()**: 네이버 API 서명 생성
- **main()**: 전체 파이프라인 실행 (fetch 3채널 → append → attribute → dashboard → anomaly)

## 금지 사항
- API 키/토큰을 코드에 직접 작성 금지
- `console.log` 사용 금지 (GAS 환경에서 동작하지 않음)
- Raw Data 시트의 기존 데이터 삭제 금지 (append only)
- 6분 실행 제한을 초과하는 단일 함수 작성 금지
- PII(개인식별정보) 저장 금지, 집계 데이터만 처리

## Reference Documents
- `CLAUDE.md` - 프로젝트 개발 규칙 (이 파일)
- `PRD.md` - 상세 제품 요구사항 및 UI 레이아웃
- `automation/auth_setup_instructions.md` - OAuth/토큰 설정 가이드
- `README.md` - 팀 온보딩 가이드 및 전체 프로젝트 구조
- `automation/naver_setup_guide.md` - 네이버 검색광고 API 연동 가이드
