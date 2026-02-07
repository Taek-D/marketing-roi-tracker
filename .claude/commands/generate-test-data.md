# Generate Test Data

테스트용 더미 광고 데이터를 생성합니다.

## Steps

1. **데이터 생성**: Raw Data 스키마에 맞는 테스트 데이터 생성
   - date: 최근 30일
   - channel: "Google Ads", "Facebook Ads"
   - campaign: 채널별 2-3개 캠페인명
   - cost: $50~$500 랜덤
   - impressions: 1,000~50,000
   - clicks: impressions의 1~5% (현실적 CTR)
   - conversions: clicks의 2~8%
   - revenue: conversions * $50~$200

2. **Apps Script 코드 출력**: 생성된 데이터를 시트에 삽입하는 GAS 함수 `insertTestData()` 작성

3. **검증**: 데이터가 스키마와 일치하는지 확인
