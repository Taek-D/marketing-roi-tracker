---
name: marketing-roi-gas-patterns
description: Google Apps Script 코딩 패턴과 제약 사항. Use when writing or modifying .gs files.
---

# Google Apps Script Patterns

## GAS 환경 제약

| 제약 | 값 | 대응 |
|------|---|------|
| 실행 시간 | 최대 6분 | CONFIG.timeLimit = 300초, 대량 작업 분할 |
| 시트 행 수 | 10K+ 시 느려짐 | 90일치만 보존 |
| UrlFetchApp | 동기 호출만 | 순차 처리 |
| console.log | 사용 불가 | log() 함수 사용 |

## 필수 패턴

### API 호출 (재시도 포함)
```javascript
for (let attempt = 1; attempt <= CONFIG.api.{platform}.maxRetries; attempt++) {
  try {
    // UrlFetchApp.fetch(...)
    return result;
  } catch (e) {
    log('{Platform} fetch attempt ' + attempt + ' failed: ' + e.message);
    if (attempt === CONFIG.api.{platform}.maxRetries) {
      notifySlack('{Platform} fetch failed after ' + attempt + ' retries: ' + e.message);
      return [];
    }
    Utilities.sleep(1000 * attempt);
  }
}
```

### Script Properties 접근
```javascript
const value = getProperty('KEY_NAME');  // 항상 래퍼 사용
// 애플리케이션 코드에서 직접 호출 금지 (getProperty() 래퍼 내부에서만 허용)
```

### 시트 null 체크
```javascript
const sheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
if (!sheet) {
  log('Sheet not found');
  notifySlack('Required sheet missing');
  return;
}
```

## 날짜 처리
```javascript
// KST 기준 포맷
Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
```

## 비용 변환
```javascript
// Google Ads cost_micros → 실제 금액
const cost = costMicros / 1000000;
```
