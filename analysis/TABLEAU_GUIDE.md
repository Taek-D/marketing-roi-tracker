# Tableau Public 대시보드 가이드

마케팅 ROI 분석을 인터랙티브하게 탐색할 수 있는 Tableau Public 대시보드 제작 가이드입니다.

## 배포 로드맵

> **Tableau Public URL**: `https://public.tableau.com/views/MarketingROI/Dashboard1`
> *(게시 후 실제 URL로 교체)*

### Step 1: 환경 준비 (~10분)
- [ ] Tableau Public Desktop 설치 ([다운로드](https://www.tableau.com/products/public/download))
- [ ] Tableau Public 계정 생성 + 이메일 인증
- [ ] 프로필 정보 입력 (포트폴리오 노출용)
> *스크린샷*: `docs/screenshots/tableau_01_setup.png`

### Step 2: 데이터 로드 + 전처리 (~15분)
- [ ] `analysis/data/tableau_summary.csv` 로드 → 채널 집계 시트
- [ ] `analysis/data/tableau_daily.csv` 로드 → 일별 트렌드 시트
- [ ] `analysis/data/tableau_campaign.csv` 로드 → 캠페인 상세 시트
- [ ] 날짜 컬럼 타입 확인 (Date로 자동 인식 여부)
- [ ] Extract 생성 (성능 최적화)
> *스크린샷*: `docs/screenshots/tableau_02_data_load.png`

### Step 3: 대시보드 제작 (~30분)
- [ ] 워크시트 1: 채널별 ROAS 비교 (Bar Chart)
- [ ] 워크시트 2: 일별 ROAS 추이 (Line Chart + 7일 이동평균)
- [ ] 워크시트 3: 캠페인 성과 매트릭스 (Bubble Chart)
- [ ] KPI 카드 (Total Spend, Revenue, ROAS, CTR)
- [ ] 필터 추가 (Channel, Date Range)
- [ ] 채널 색상 고정 (Google=#4285F4, Facebook=#1877F2, Naver=#03C75A)
> *스크린샷*: `docs/screenshots/tableau_03_dashboard.png`

### Step 4: 게시 (~5분)
- [ ] File → Save to Tableau Public → 로그인
- [ ] 제목: "Marketing ROI Analysis Dashboard"
- [ ] 설명 추가: 분석 목적, 데이터 기간, 핵심 인사이트
- [ ] 게시 완료 → URL 복사
> *스크린샷*: `docs/screenshots/tableau_04_publish.png`

### Step 5: README + 포트폴리오 연동 (~5분)
- [ ] `README.md` Interactive Dashboard 섹션에 Tableau Public URL 추가
- [ ] GitHub 저장소 About에 Tableau 링크 추가
- [ ] LinkedIn/포트폴리오 사이트에 임베드 또는 링크 추가

**총 예상 소요시간: 약 65분**

---

## 준비 사항

### 1. Tableau Public Desktop 설치
- **다운로드**: https://www.tableau.com/products/public/download
- **플랫폼**: Windows / macOS
- **비용**: 무료

### 2. 계정 생성
- https://public.tableau.com/app/discover 에서 무료 계정 생성
- 이메일 인증 완료

## 데이터 불러오기

### 사용 가능한 CSV 파일 (3개)

`analysis/data/` 폴더에 3개의 Tableau 최적화 CSV 파일이 있습니다:

| 파일 | 용도 | 행 수 | 컬럼 |
|------|------|-------|------|
| `tableau_summary.csv` | 채널별 집계 | 3 | channel, cost, impressions, clicks, conversions, revenue, ROAS, CTR, CVR |
| `tableau_daily.csv` | 일별 트렌드 | 270 | date, channel, cost, revenue, ROAS |
| `tableau_campaign.csv` | 캠페인 상세 | 9 | channel, campaign, cost, impressions, clicks, conversions, revenue, ROAS, CTR, CVR |

### 불러오기 방법

1. Tableau Public Desktop 실행
2. **"Connect to Data"** → **"Text file"** 선택
3. `tableau_summary.csv` 파일 선택
4. 데이터 미리보기 확인 후 **"Go to Worksheet"**

## 추천 대시보드 구성

### 대시보드 1: 채널 성과 Overview

**사용 데이터**: `tableau_summary.csv`

**차트 구성**:
1. **채널별 ROAS 비교** (Horizontal Bar Chart)
   - Rows: Channel
   - Columns: ROAS
   - Color: ROAS (Red-Yellow-Green 그라데이션)
   - Label: ROAS 값 표시

2. **채널별 Cost vs Revenue** (Grouped Bar Chart)
   - Rows: Channel
   - Columns: Measure Values (Cost, Revenue)
   - Color: Measure Names

3. **KPI Cards** (Text Table)
   - 총 광고비 (SUM(Cost))
   - 총 매출 (SUM(Revenue))
   - 평균 ROAS (AVG(ROAS))
   - 평균 CTR (AVG(CTR))

### 대시보드 2: 일별 트렌드 분석

**사용 데이터**: `tableau_daily.csv`

**차트 구성**:
1. **일별 ROAS 추이** (Line Chart)
   - Columns: Date
   - Rows: ROAS
   - Color: Channel
   - Filter: 이동평균 7일 적용 (옵션)

2. **누적 매출 추이** (Area Chart)
   - Columns: Date
   - Rows: RUNNING_SUM(Revenue)
   - Color: Channel

### 대시보드 3: 캠페인 상세 분석

**사용 데이터**: `tableau_campaign.csv`

**차트 구성**:
1. **캠페인 성과 매트릭스** (Bubble Chart)
   - Columns: Cost
   - Rows: Revenue
   - Size: Conversions
   - Color: ROAS
   - Label: Campaign

2. **캠페인별 Funnel** (Stacked Bar)
   - Rows: Campaign
   - Columns: Impressions → Clicks → Conversions (정규화)

## 상호작용 기능

### 필터 추가
- **Channel 필터**: 특정 채널만 보기
- **Date Range 필터**: 기간 선택 (daily 데이터만)
- **Campaign 필터**: 특정 캠페인 포커스

### 계산 필드 만들기

**한계 ROAS** (Marginal ROAS):
```
(ZN([Revenue]) - ZN(LOOKUP([Revenue], -1))) / 
(ZN([Cost]) - ZN(LOOKUP([Cost], -1)))
```

**ROAS 그룹화**:
```
IF [ROAS] >= 3 THEN "Excellent"
ELSEIF [ROAS] >= 2 THEN "Good"
ELSE "Needs Improvement"
END
```

## Tableau Public 게시

### 게시 방법
1. **File** → **Save to Tableau Public**
2. 계정 로그인
3. 대시보드 제목 입력 (예: "Marketing ROI Analysis Dashboard")
4. **Save** 클릭

### 공유
- 게시 후 자동으로 공개 URL 생성
- URL을 README.md에 추가
- 예: `https://public.tableau.com/views/MarketingROI/Dashboard1`

## 팁 & 베스트 프랙티스

### 디자인 팁
- **색상 일관성**: 채널별 고정 색상 사용
  - Google Ads: 파란색
  - Facebook Ads: 보라색
  - Naver Ads: 초록색
- **폰트**: Tableau Medium (기본) 또는 맑은 고딕
- **크기**: 대시보드 크기 "Desktop" (1024x768)

### 성능 최적화
- **Extract 사용**: CSV 대신 Extract (.hyper) 생성
- **필터 최적화**: Context Filter 활용
- **LOD 최소화**: 계산 필드 단순화

### 스토리텔링
대시보드에 인사이트를 추가하세요:
1. **Text 객체**로 핵심 발견 요약
2. **Annotation**으로 이벤트 표시 (블랙프라이데이, A/B 테스트 등)
3. **Dashboard Actions**로 drill-down 가능하게

## 문제 해결

### 한글 깨짐
- CSV 인코딩이 UTF-8-BOM인지 확인
- Tableau에서 불러올 때 자동 인식

### 날짜 형식 오류
- `tableau_daily.csv`의 date 컬럼이 yyyy-MM-dd 형식인지 확인
- Tableau에서 자동으로 Date 타입으로 인식하지 않으면 수동 변경

### ROAS 계산 오류
- Cost가 0인 행이 있는지 확인
- ZN() 함수로 NULL 처리

---

## 예제 대시보드 구성

완성된 대시보드 예시:

```
┌─────────────────────────────────────────────┐
│  Marketing ROI Analysis Dashboard           │
├─────────────────────────────────────────────┤
│ [KPI 카드]  Cost  Revenue  ROAS  CTR        │
├─────────────────────────────────────────────┤
│ [채널별 ROAS]                [일별 ROAS 추이] │
│ Naver ████████ 3.28          ╱╲            │
│ Google ██████ 2.77          ╱  ╲╱╲         │
│ Facebook ████ 2.05         ╱      ╲        │
├─────────────────────────────────────────────┤
│ [캠페인 성과 매트릭스] (Bubble Chart)         │
└─────────────────────────────────────────────┘
```

## 다음 단계

1. Tableau Public에 게시
2. README.md에 링크 추가
3. LinkedIn/포트폴리오에 공유

---

**참고 자료**:
- Tableau Public 튜토리얼: https://public.tableau.com/app/learn/how-to-videos
- Tableau 커뮤니티: https://community.tableau.com/
