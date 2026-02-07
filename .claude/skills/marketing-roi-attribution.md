---
name: marketing-roi-attribution
description: 마케팅 애트리뷰션 모델과 ROAS 계산. Use when working with attribution, ROAS, ROI, or marketing metrics.
---

# Attribution & Marketing Metrics

## 현재 구현: Last-Touch

모든 전환 크레딧을 마지막 접점 채널에 부여.

```javascript
// Attribution.gs - calculateAttribution()
stats[channel].spend += cost;    // row[3]
stats[channel].revenue += revenue; // row[7]
roas = revenue / spend;
```

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

## 향후 확장 가능 모델

| 모델 | 설명 | 복잡도 |
|------|------|:------:|
| First-Touch | 첫 접점에 100% 크레딧 | 낮음 |
| Linear | 모든 접점에 균등 배분 | 중간 |
| Time-Decay | 최근 접점에 가중치 | 중간 |
| Position-Based | 첫/끝 40%, 중간 20% | 높음 |

## 주의사항
- spend가 0일 때 ROAS 나누기 방지: `s.spend > 0 ? ... : 0`
- parseFloat 실패 대비: `parseFloat(row[3]) || 0`
- Attribution 시트는 매번 clearContents() 후 재계산
