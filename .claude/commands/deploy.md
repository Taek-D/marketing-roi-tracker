# Deploy to Google Apps Script

Google Apps Script에 코드를 배포합니다.

## Steps

1. automation/ 내 모든 .gs 파일의 구문 오류 확인
2. CONFIG 객체의 설정값이 올바른지 검증
3. getProperty() 호출에 사용되는 키 이름이 일관적인지 확인
4. `clasp push`로 Apps Script에 업로드
5. 배포 결과 확인

## Post-deploy
- `clasp open`으로 Apps Script 에디터에서 확인
- main() 함수가 정상적으로 실행되는지 테스트
