# MarketingROI Tracker

> 중소 이커머스를 위한 무료 멀티채널 마케팅 ROI 대시보드
> Google Ads & Facebook Ads 데이터를 자동 수집하여 Google Sheets에서 ROAS를 시각화

## Features

- **자동 데이터 수집**: Google Ads / Facebook Ads에서 매일 오전 9시(KST) 자동 수집
- **ROAS 대시보드**: 채널별 Spend, Revenue, ROAS를 한눈에 비교
- **Last-Touch 애트리뷰션**: 채널별 기여 매출 자동 계산
- **Slack 알림**: API 에러 발생 시 즉시 알림
- **CI/CD**: `.gs` 파일 변경 시 자동 구문 검사 + 시크릿 스캔

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
- 30일치 테스트 데이터 삽입
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
| `SLACK_WEBHOOK_URL` | Slack 에러 알림용 Webhook URL | No |

> 상세 인증 가이드: [auth_setup_instructions.md](./auth_setup_instructions.md)

## Project Structure

```
marketing-roi-tracker/
├── Code.gs                 # 메인 로직 (API 호출, 데이터 수집, Slack 알림)
├── Config.gs               # 전역 설정 (CONFIG 객체, getProperty, log)
├── Attribution.gs          # ROAS 계산, 대시보드 업데이트
├── Setup.gs                # 초기 설정 (시트 생성, 테스트 데이터, 트리거)
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
├── PRD.md                  # 제품 요구사항 문서
├── claude.md               # 프로젝트 블루프린트 (API 스펙)
└── auth_setup_instructions.md  # OAuth/토큰 설정 가이드
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
[Google Ads API] ──┐
                   ├──→ Code.gs: main() ──→ Raw Data ──→ Attribution.gs ──→ Dashboard
[Facebook Ads API]─┘         │
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

## 제약 사항

| 항목 | 제한 | 대응 |
|------|------|------|
| Google Ads API | 일 15,000 쿼리 | 배치 처리 |
| Facebook Ads API | 시간당 200 호출 | Rate Limit 대기 |
| Apps Script 실행 | 최대 6분 | CONFIG.timeLimit = 300초 |
| Google Sheets | 10K행 이상 느려짐 | 90일치만 보존 |

## CI/CD

`.gs` 파일 변경 시 GitHub Actions가 자동 실행:

- **구문 검사**: 모든 `.gs` 파일의 JavaScript 문법 검증
- **시크릿 스캔**: API 키/토큰 하드코딩 여부 검사

수동 실행: [Actions 탭](https://github.com/Taek-D/marketing-roi-tracker/actions) → "Run workflow"

## Tech Stack

- **Google Apps Script** (JavaScript ES6)
- **Google Ads API** v15
- **Facebook Marketing API** v18
- **Google Sheets** (Dashboard)
- **Slack Webhook** (알림)
- **clasp** (로컬 개발/배포)
- **GitHub Actions** (CI)

## License

MIT License.
