# Validate Code

모든 .gs 파일의 코드 품질을 검증합니다.

## Checklist

1. **구문 검사**: 모든 .gs 파일에서 JavaScript 구문 오류 확인
2. **JSDoc 검사**: 모든 public 함수에 JSDoc 주석이 있는지 확인
3. **보안 검사**: API 키/토큰이 하드코딩되지 않고 `getProperty()`를 통해서만 접근하는지 확인
4. **제약 사항 검사**: 6분 실행 제한을 초과할 수 있는 루프가 없는지, API Rate Limit을 고려한 호출 패턴인지 확인
5. **데이터 스키마 일관성**: Raw Data 컬럼 순서(date, channel, campaign, cost, impressions, clicks, conversions, revenue)가 코드와 일치하는지 확인
6. **에러 핸들링**: 모든 API 호출에 try-catch + notifySlack() 알림이 있는지 확인

## Output
검증 결과를 항목별로 요약하여 보고합니다.
