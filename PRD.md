# 📋 마케팅 ROI 최적화 프로젝트 - PRD (Product Requirement Document)

## 📌 프로젝트 개요

### 프로젝트명
**MarketingROI Tracker** (가칭)

### 한 줄 정의
> 중소 이커머스를 위한 무료 멀티채널 마케팅 ROI 대시보드: Google Sheets 기반으로 광고 플랫폼 데이터를 자동 수집하고 채널별 기여도를 시각화

### 목표 (Goals)
1. **마케터의 시간 절약**: 일일 수동 집계 30분 → 0분
2. **데이터 기반 의사결정**: 채널별 ROAS 비교로 예산 재배치 근거 확보
3. **접근성**: 무료 + 30초 셋업으로 스타트업도 쉽게 사용

### 비목표 (Non-Goals)
- 엔터프라이즈급 대규모 데이터 처리 (10만 행 이상)
- 실시간 알림/자동화 (일 1회 배치 업데이트만)
- 고급 ML 기반 예측 모델 (단순 통계만)

---

## 🎯 타겟 사용자 (User Personas)

### 페르소나 1: 스타트업 마케팅 매니저
- **배경**: 직원 10~50명 규모, 월 광고비 $5K~$30K
- **기술 수준**: SQL/Python 모름, 엑셀 중급
- **목표**: 주간 리뷰 미팅에서 채널별 성과 빠르게 공유
- **페인 포인트**: Rockerbox는 비싸고, 수동 집계는 시간 낭김

### 페르소나 2: 1인 커머스 운영자
- **배경**: 스마트스토어/쿠팡 입점, 월 광고비 $3K~$10K
- **기술 수준**: 엑셀 기초만
- **목표**: "감" 아닌 데이터로 예산 배분
- **페인 포인트**: 시간 없음, 컨설턴트 고용 예산 없음

---

## 🛠️ 핵심 기능 (Core Features)

### ✅ Feature 1: 멀티채널 데이터 자동 수집
**우선순위**: P0 (필수)

#### 상세 기능
- **지원 플랫폼** (MVP):
  - Google Ads API
  - Facebook Ads API
  - (향후) 네이버 GFA, 카카오모먼트
- **수집 데이터**:
  - 일별 집계: 날짜, 광고비(cost), 노출수(impressions), 클릭수(clicks), 전환수(conversions), 매출(revenue)
  - 캠페인명, 광고소재ID (선택적)
- **자동화 방식**:
  - Google Apps Script Time-driven Trigger (매일 오전 9시 KST)
  - API 호출 → 파싱 → 원본 시트에 append
- **에러 처리**:
  - API 실패 시 Slack Webhook으로 알림
  - 3회 재시도 후 로그 기록

#### 데이터 스키마 (Raw Data Sheet)
| date | channel | campaign | cost | impressions | clicks | conversions | revenue |
|------|---------|----------|------|-------------|--------|-------------|---------|
| 2026-02-05 | Google Ads | Brand_Campaign | 1200 | 50000 | 800 | 25 | 5000 |
| 2026-02-05 | Facebook Ads | Retargeting | 800 | 30000 | 600 | 15 | 3000 |

#### 기술 스택
- **언어**: Google Apps Script (JavaScript 기반)
- **API 라이브러리**:
  - Google Ads API v15
  - Facebook Marketing API v18
- **인증**: OAuth 2.0 (Refresh Token 자동 갱신)

---

### ✅ Feature 2: 멀티터치 애트리뷰션 계산
**우선순위**: P0 (필수, MVP는 Last-Touch만)

#### 상세 기능
- **지원 모델** (v1.0):
  - **Last-Touch**: 마지막 터치포인트에 100% 크레딧
  - (v2.0에서 추가) First-Touch, Linear, Time-Decay
- **데이터 소스**:
  - GA4 → BigQuery Export → User Journey 테이블
  - 또는 UTM 파라미터 기반 (간소화 버전)
- **계산 로직**:
  ```javascript
  // Last-Touch 예시
  for each user_id:
    last_channel = get_last_touchpoint(user_id)
    attributed_revenue[last_channel] += user_revenue
  ```
- **출력**:
  - 채널별 Attributed Revenue (기여 매출)
  - 채널별 Attributed Conversions (기여 전환)

#### 데이터 스키마 (Attribution Sheet)
| channel | attributed_conversions | attributed_revenue | attribution_model |
|---------|------------------------|---------------------|-------------------|
| Google Ads | 80 | $16,000 | Last-Touch |
| Facebook Ads | 45 | $9,000 | Last-Touch |

---

### ✅ Feature 3: ROI & ROAS 대시보드
**우선순위**: P0 (필수)

#### 상세 기능
- **핵심 지표**:
  - **ROAS** (Return on Ad Spend) = revenue / cost
  - **ROI** = (revenue - cost - COGS) / cost
  - **CPA** (Cost Per Acquisition) = cost / conversions
  - **CPM** = (cost / impressions) × 1000
  - **CTR** = (clicks / impressions) × 100
- **필터**:
  - 기간 선택 (최근 7일, 30일, 90일, 커스텀)
  - 채널 선택 (전체, Google Ads, Facebook Ads)
- **시각화**:
  1. **파이 차트**: 채널별 매출 비중
  2. **막대 차트**: 채널별 ROAS 비교
  3. **라인 차트**: 주간 ROAS 트렌드
  4. **히트맵**: 채널×주차별 ROAS

#### 대시보드 레이아웃 (Google Sheets)
```
┌─────────────────────────────────────────────────────┐
│   📊 MarketingROI Tracker - Dashboard               │
├─────────────────────────────────────────────────────┤
│  기간: [최근 30일 ▼]   채널: [전체 ▼]             │
├──────────────┬──────────────┬──────────────┬────────┤
│ 총 광고비     │ 총 매출       │ 평균 ROAS    │ 전환수 │
│ $25,000      │ $87,500      │ 3.5          │ 350    │
├──────────────┴──────────────┴──────────────┴────────┤
│  📈 채널별 ROAS 비교 (막대 차트)                    │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ Google Ads (4.2)                   │
│  ▓▓▓▓▓▓▓ Facebook Ads (2.1)                        │
│                                                     │
│  🥧 매출 비중 (파이 차트)                           │
│  [Google 65%] [Facebook 35%]                       │
│                                                     │
│  📊 주간 ROAS 트렌드 (라인 차트)                    │
│  Week1: 3.2 → Week2: 3.8 → Week3: 3.5              │
└─────────────────────────────────────────────────────┘
```

#### 기술 스택
- **시각화**: Google Sheets 기본 차트
- **계산**: ARRAYFORMULA, QUERY, SUMIF, VLOOKUP

---

### ✅ Feature 4 (Optional): 예산 시뮬레이터
**우선순위**: P1 (Nice-to-have)

#### 상세 기능
- **입력**:
  - 채널별 현재 예산
  - 조정 비율 (예: Facebook -20%, Google +20%)
- **계산**:
  - 과거 3개월 평균 ROAS 사용
  - `예상 매출 = (조정된 예산) × (평균 ROAS)`
- **출력**:
  - 조정 후 예상 총 매출
  - 매출 증감분 ($, %)
  - 추천 문구 (예: "Google Ads 예산 20% 증액 시 +$5,200 증가 예상")

#### UI (Simple Input Form)
```
┌─────────────────────────────────────────┐
│  💡 예산 시뮬레이터                      │
├─────────────────────────────────────────┤
│  Facebook Ads 예산: $10,000             │
│  조정 비율: [-20%] ◀▶                   │
│  → 조정 후: $8,000                      │
│                                         │
│  Google Ads 예산: $15,000               │
│  조정 비율: [+20%] ◀▶                   │
│  → 조정 후: $18,000                     │
│                                         │
│  [시뮬레이션 실행]                       │
│                                         │
│  📊 결과:                                │
│  • 예상 총 매출: $92,700 (+$5,200)      │
│  • 평균 ROAS: 3.7 (+0.2)                │
└─────────────────────────────────────────┘
```

---

## 🗂️ 화면 구성 (Sheet Structure)

### Sheet 1: **Config** (설정)
- API 키 입력란 (Google Ads, Facebook Ads)
- 업데이트 주기 설정 (기본: 매일 오전 9시)
- Slack Webhook URL (알림용)
- 목표 ROAS 설정 (예: 3.0)

### Sheet 2: **Raw Data** (원본 데이터)
- 광고 플랫폼에서 수집한 원본 데이터 저장
- 자동 업데이트 (Apps Script)
- 히스토리 보존 (90일분)

### Sheet 3: **Attribution** (애트리뷰션)
- GA4 User Journey 데이터
- 채널별 기여 매출/전환 계산 결과

### Sheet 4: **Dashboard** (대시보드)
- 사용자가 보는 메인 화면
- 차트, 주요 지표 카드

### Sheet 5: **Simulator** (시뮬레이터, Optional)
- 예산 조정 입력란
- 시뮬레이션 결과

---

## 🔄 데이터 흐름 (Data Flow)

```
┌──────────────┐
│ Google Ads   │─┐
│ Facebook Ads │─┤
│ (외부 API)   │ │
└──────────────┘ │
                 │
                 ▼
       ┌─────────────────┐
       │ Apps Script     │  (매일 오전 9시 자동 실행)
       │ - API 호출      │
       │ - 데이터 파싱   │
       └─────────────────┘
                 │
                 ▼
       ┌─────────────────┐
       │ Raw Data Sheet  │  (원본 데이터 append)
       └─────────────────┘
                 │
                 ▼
       ┌─────────────────┐
       │ Calculation     │  (ARRAYFORMULA, QUERY)
       │ - ROAS 계산     │
       │ - Attribution   │
       └─────────────────┘
                 │
                 ▼
       ┌─────────────────┐
       │ Dashboard       │  (사용자 확인)
       │ - 차트 자동 업데이트 │
       └─────────────────┘
```

---

## 🛠️ 기술 스택 (Tech Stack)

### 프론트엔드 (사용자 인터페이스)
- **Google Sheets**: 대시보드, 데이터 입력/출력
- **Google Charts API**: 고급 차트 (선택적)

### 백엔드 (데이터 수집 & 처리)
- **Google Apps Script**: 
  - API 호출 (UrlFetchApp)
  - 데이터 파싱 (JSON)
  - 시트 업데이트 (SpreadsheetApp)
  - 스케줄링 (Time-driven Trigger)
- **Python** (Optional, 로컬 개발/테스트용):
  - `google-ads`, `facebook-business` 라이브러리
  - `pandas` (데이터 전처리)
  - `gspread` (Google Sheets API)

### 데이터 소스
- **Google Ads API v15**
- **Facebook Marketing API v18**
- **GA4 → BigQuery** (Optional, User Journey 데이터)

### 외부 서비스
- **Slack Webhook**: 에러 알림
- **GitHub**: 코드 오픈소스 공개

---

## 📊 주요 지표 (Success Metrics)

### 사용자 측면
- **셋업 시간**: 평균 30초 이하
- **대시보드 확인 빈도**: 주 3회 이상
- **수동 작업 시간 절감**: 일 30분 → 0분

### 기술 측면
- **API 성공률**: 95% 이상
- **데이터 정합성**: 광고 플랫폼 리포트 대비 ±2% 이내
- **시트 로딩 속도**: 5초 이내 (1만 행 기준)

### 비즈니스 임팩트 (포트폴리오용)
- **예산 재배치 의사결정**: 시뮬레이터 사용 횟수
- **ROAS 개선**: 사용 전후 비교 (케이스 스터디)

---

## 🗓️ 개발 일정 (Timeline)

### Week 1: MVP 개발
- **Day 1-2**: Google Ads API 연동 (Apps Script)
- **Day 3-4**: Facebook Ads API 연동
- **Day 5-7**: Raw Data 수집 자동화 + 기본 ROAS 계산

### Week 2: 대시보드 & 테스트
- **Day 1-3**: Dashboard 시트 구성 (차트, 주요 지표)
- **Day 4-5**: 실제 광고 계정으로 테스트 (더미 데이터 → 실제 데이터)
- **Day 6-7**: 버그 수정, 문서화

### Week 3: 고도화 (Optional)
- **Day 1-3**: 애트리뷰션 모델 추가 (First-Touch, Linear)
- **Day 4-5**: 예산 시뮬레이터 구현
- **Day 6-7**: 네이버 GFA API 연동

### Week 4: 배포 & 마케팅
- **Day 1-2**: GitHub 오픈소스 공개
- **Day 3-4**: Medium/블로그 포스트 작성 (케이스 스터디)
- **Day 5-7**: 커뮤니티 공유 (Reddit r/marketing, 슬랙 그룹)

---

## 🎯 우선순위 (Prioritization)

### P0 (Must-Have for MVP)
1. ✅ Google Ads + Facebook Ads 자동 수집
2. ✅ Last-Touch 애트리뷰션
3. ✅ ROAS 대시보드 (파이 차트 + 테이블)

### P1 (Nice-to-Have)
4. 🔸 예산 시뮬레이터
5. 🔸 네이버 GFA/카카오모먼트 연동
6. 🔸 주간 리포트 이메일 자동 발송

### P2 (Future Enhancements)
7. 🔹 First-Touch, Linear, Time-Decay 모델
8. 🔹 GA4 BigQuery 연동 (User Journey)
9. 🔹 Slack 봇 (대화형 조회)

---

## 📚 참고 레퍼런스

### 유사 제품/서비스
1. **Rockerbox** (https://www.rockerbox.com/)
   - 벤치마크: 멀티채널 통합, 애트리뷰션 모델
   - 차별점: 우리는 무료 + 스프레드시트 기반
2. **Supermetrics** (https://supermetrics.com/)
   - 벤치마크: API 자동 수집
   - 차별점: 우리는 애트리뷰션 계산 포함
3. **Google Sheets 템플릿 갤러리**
   - 벤치마크: UX (복사해서 바로 쓰는 느낌)
   - 차별점: 우리는 자동화 포함

### 기술 문서
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [Google Apps Script Best Practices](https://developers.google.com/apps-script/guides/support/best-practices)

---

## 🚧 제약사항 & 리스크

### 제약사항
1. **Google Sheets 행 제한**: 1만 행 이상에서 느려짐 → 90일치 데이터만 보존
2. **API 호출 제한**: 
   - Google Ads: 일 15,000 쿼리
   - Facebook Ads: 일 200 API 호출
   → 배치 요청으로 최적화 필요
3. **Apps Script 실행 시간**: 최대 6분 → 긴 작업은 분할 실행

### 리스크
1. **API 변경**: Facebook/Google API는 자주 변경 → 유지보수 부담
   - **대응**: 버전 명시, 변경 알림 구독
2. **사용자 지원**: 오픈소스는 1:1 지원 어려움
   - **대응**: FAQ 문서, 슬랙 커뮤니티
3. **확장성**: 대규모 데이터는 처리 불가
   - **대응**: "SMB 전용"으로 명확히 타겟팅

---

## 💼 포트폴리오 활용 전략

### GitHub README 구성
```markdown
# MarketingROI Tracker

> 중소 이커머스를 위한 무료 멀티채널 마케팅 ROI 대시보드

## 💡 프로젝트 배경
- 문제 정의: Rockerbox($50K/년)는 비싸고, 수동 집계는 비효율적
- 솔루션: Google Sheets 기반 무료 자동화 대시보드

## 🚀 주요 기능
- Google Ads/Facebook Ads 자동 수집 (매일)
- 멀티터치 애트리뷰션 (Last-Touch, Linear, Time-Decay)
- ROAS/ROI 실시간 대시보드
- 예산 시뮬레이터

## 📊 비즈니스 임팩트
- 마케터 일일 작업 시간 30분 → 0분
- 데이터 기반 예산 재배치로 ROAS 15% 개선 (케이스 스터디)

## 🛠️ 기술 스택
- Google Apps Script, Google Ads API, Facebook API
- BigQuery (GA4 연동)

## 📸 스크린샷
[대시보드 이미지]

## 🎥 데모 영상
[YouTube 링크]

## 📄 블로그 포스트
- [Medium: 중소 이커머스를 위한 무료 마케팅 ROI 대시보드 만들기]
```

### 면접 어필 포인트
1. **문제 해결 능력**: 실제 페인 포인트 정의 → 솔루션 설계
2. **기술 스택 다양성**: Apps Script (JS) + Python + API 연동
3. **비즈니스 임팩트**: "30분 절약", "ROAS 15% 개선" 같은 정량적 지표
4. **제품 사고**: MVP 정의, 우선순위, 사용자 페르소나

---

## ✅ 다음 단계 (Next Steps)

1. **개발 착수**: Week 1 일정에 따라 Google Ads API 연동부터 시작
2. **케이스 스터디 준비**: 실제 광고 계정 or 더미 데이터로 시연
3. **문서화**: README, 사용 가이드, 기술 블로그 포스트
4. **커뮤니티 공유**: GitHub, Medium, LinkedIn 게시

---

**문서 작성일**: 2026-02-06  
**버전**: v1.0  
**작성자**: 데이터 분석가 포트폴리오 프로젝트
