---
name: marketing-roi-attribution
description: 마케팅 애트리뷰션 모델과 ROAS 계산. Use when working with attribution, ROAS, ROI, or marketing metrics.
---

# Attribution & Marketing Metrics

## 구현 완료: Multi-Touch Attribution (5모델)

Attribution.gs에 5가지 모델이 모두 구현되어 있음.

| 모델 | 함수/로직 | 설명 |
|------|-----------|------|
| Last-Touch | `calculateAttribution()` 기본 | 마지막 접점에 100% 크레딧 |
| First-Touch | `calculateAttribution()` | 첫 접점에 100% 크레딧 |
| Linear | `calculateAttribution()` | 모든 접점에 균등 배분 |
| Time-Decay | `calculateTimeDecayWeights()` | 지수 감쇠 (half-life 7일) |
| Position-Based | `calculateAttribution()` | 첫/끝 40%, 중간 20% |

```javascript
// Attribution.gs - calculateAttribution()
// 5가지 모델 결과를 Attribution 시트에 기록
// calculateTimeDecayWeights(): 지수 감쇠 가중치 계산
stats[channel].spend += cost;    // row[3]
stats[channel].revenue += revenue; // row[7]
roas = revenue / spend;
```

## 퍼널 분석 (구현 완료)

Attribution.gs에 퍼널 메트릭도 포함:
- Impressions → Clicks → Conversions → Revenue
- CTR, CVR, CPA 자동 계산
- Dashboard 시트에 요약 반영

## 핵심 지표

| 지표 | 공식 | 용도 |
|------|------|------|
| ROAS | revenue / cost | 광고비 대비 매출 |
| ROI | (revenue - cost) / cost | 순이익률 |
| CPA | cost / conversions | 전환 1건 비용 |
| CPM | (cost / impressions) * 1000 | 1000 노출당 비용 |
| CTR | (clicks / impressions) * 100 | 클릭률 |

## Raw Data 스키마 컬럼 매핑

| Index | 컬럼 | 타입 |
|:-----:|-------|------|
| 0 | date | string (yyyy-MM-dd) |
| 1 | channel | string |
| 2 | campaign | string |
| 3 | cost | number |
| 4 | impressions | number |
| 5 | clicks | number |
| 6 | conversions | number |
| 7 | revenue | number |

## 주의사항
- spend가 0일 때 ROAS 나누기 방지: `s.spend > 0 ? ... : 0`
- parseFloat 실패 대비: `parseFloat(row[3]) || 0`
- Attribution 시트는 매번 clearContents() 후 재계산
- 통화 단위: KRW (원화) 통일
