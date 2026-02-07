---
name: marketing-roi-architecture
description: 프로젝트 전체 아키텍처 및 데이터 흐름. Use when working with project structure, data flow, or system design.
---

# MarketingROI Tracker Architecture

## 시스템 아키텍처

```
[Google Ads API] ──┐
                   ├──→ [Code.gs: main()] ──→ [Raw Data Sheet] ──→ [Attribution.gs] ──→ [Dashboard Sheet]
[Facebook Ads API]─┘          │
                              └──→ [Slack Webhook: 에러 알림]
```

## 파일별 책임

| 파일 | 역할 | 의존성 |
|------|------|--------|
| Code.gs | 엔트리포인트, API 호출, Slack 알림 | Config.gs |
| Config.gs | 전역 설정(CONFIG), 유틸리티(getProperty, log) | 없음 |
| Attribution.gs | ROAS 계산, 대시보드 갱신 | Config.gs |
| Setup.gs | 초기 설정 (1회 실행용) | Config.gs, Attribution.gs |

## 실행 흐름 (main)

1. Raw Data 시트 참조
2. fetchGoogleAdsData() → appendDataToSheet()
3. fetchFacebookAdsData() → appendDataToSheet()
4. calculateAttribution() → Attribution 시트 갱신
5. updateDashboard() → Dashboard 시트 타임스탬프 갱신
6. 에러 발생 시 → notifySlack()

## Sheet 구조

| Sheet | 용도 | 갱신 주기 |
|-------|------|----------|
| Raw Data | API 원본 데이터 (append only) | 매일 9시 |
| Attribution | 채널별 Spend/Revenue/ROAS | 매일 9시 |
| Dashboard | 사용자용 요약 | 매일 9시 |
| Config | 설정 안내 | 변경 없음 |
