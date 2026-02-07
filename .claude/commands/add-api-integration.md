# Add API Integration

새로운 광고 플랫폼 API를 연동합니다.

## Usage
`/add-api-integration [platform_name]`

## Steps

1. **API 조사**: $ARGUMENTS 플랫폼의 API 문서를 조사 (엔드포인트, 인증 방식, 필요 필드, Rate Limit)
2. **함수 생성**: Code.gs에 `fetch{Platform}Data()` 함수 추가 (기존 fetchGoogleAdsData 패턴 준수)
3. **Config 업데이트**: Config.gs의 CONFIG.api 객체에 새 플랫폼 설정 추가
4. **main() 수정**: main() 함수에 새 플랫폼 데이터 수집 단계 추가
5. **문서 업데이트**: claude.md에 새 API 정보 추가
6. **검증**: /validate-code 실행
