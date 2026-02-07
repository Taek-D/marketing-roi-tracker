# 네이버 검색광고 API 연동 가이드

네이버 검색광고 계정이 있다면, 이 가이드를 따라 실제 데이터를 자동 수집할 수 있습니다.

## 사전 조건

- 네이버 검색광고 계정 보유 (https://searchad.naver.com)
- 광고 캠페인이 1개 이상 실행 중

## 1단계: API 키 발급

1. [네이버 검색광고 센터](https://searchad.naver.com) 로그인
2. **도구 > API 관리** 메뉴 이동
3. **API 라이선스 생성** 클릭
4. 다음 3개 값을 메모:
   - **Customer ID** (광고주 ID)
   - **API Key** (Access License)
   - **Secret Key** (비밀키)

> API 키는 생성 후 즉시 사용 가능합니다. 별도 승인 과정이 없습니다.

## 2단계: Script Properties 설정

Google Sheet에서 `Extensions > Apps Script > Project Settings > Script Properties`에 추가:

| Property | 값 | 예시 |
|----------|---|------|
| `NAVER_ADS_CUSTOMER_ID` | 광고주 ID | `1234567` |
| `NAVER_ADS_API_KEY` | API Key | `01000000005a3b...` |
| `NAVER_ADS_SECRET_KEY` | Secret Key | `AQAAAABaO2F...` |

## 3단계: 확인

1. Apps Script 에디터에서 **main** 함수 실행
2. `View > Logs`에서 "Fetching Naver Ads data" 메시지 확인
3. Raw Data 시트에 Naver Search Ads 데이터가 추가되었는지 확인

## API 스펙 참고

### 인증 방식

HMAC-SHA256 서명 기반. 요청마다 다음 헤더가 필요합니다:

| Header | 값 |
|--------|---|
| `X-Timestamp` | Unix timestamp (ms) |
| `X-API-KEY` | API Key |
| `X-Customer` | Customer ID |
| `X-Signature` | HMAC-SHA256(timestamp.method.path, secretKey) |

이 프로젝트에서는 `generateNaverSignature()` 함수가 자동으로 서명을 생성합니다.

### 통계 조회 엔드포인트

```
GET https://api.searchad.naver.com/ncc/stats
```

| 파라미터 | 설명 |
|----------|------|
| `id` | Customer ID |
| `fields` | 조회할 필드 (impCnt, clkCnt, salesAmt, ccnt, crto) |
| `timeRange` | 조회 기간 (since, until) |

### 필드 매핑

| Naver API 필드 | Raw Data 컬럼 | 설명 |
|---------------|--------------|------|
| `impCnt` | impressions | 노출수 |
| `clkCnt` | clicks | 클릭수 |
| `salesAmt` | cost | 광고비 |
| `ccnt` | conversions | 전환수 |
| `crto` | revenue | 전환 매출 |

### Rate Limit

- 초당 100건
- 일 100,000건
- Google/Facebook보다 여유로움

## 참고 문서

- [네이버 검색광고 API 공식 문서](https://naver.github.io/searchad-apidoc/)
- [GitHub - naver/searchad-apidoc](https://github.com/naver/searchad-apidoc)

## 트러블슈팅

### "Invalid signature" 에러
- X-Timestamp가 현재 시각과 크게 차이나면 발생
- 서버 시간이 정확한지 확인 (Apps Script는 Google 서버이므로 보통 정확함)

### "Unauthorized" 에러
- API Key / Secret Key가 정확한지 확인
- Customer ID가 광고주 본인 계정인지 확인

### 데이터가 비어있는 경우
- 조회 기간에 광고가 실행되었는지 확인
- 어제 날짜 기준으로 조회하므로, 어제 광고가 없으면 빈 결과
