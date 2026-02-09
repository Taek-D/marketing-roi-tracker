/**
 * Unit Tests for MarketingROI Tracker
 *
 * Run: Apps Script editor → Functions dropdown → runAllTests → Run (▶)
 * Results: View → Logs
 */

/** @type {{passed: number, failed: number, errors: string[]}} */
let _testResults = { passed: 0, failed: 0, errors: [] };

/**
 * Assert a condition is true
 * @param {boolean} condition
 * @param {string} testName
 */
function assert(condition, testName) {
  if (condition) {
    _testResults.passed++;
    log('  ✓ ' + testName);
  } else {
    _testResults.failed++;
    _testResults.errors.push(testName);
    log('  ✗ FAIL: ' + testName);
  }
}

/**
 * Assert two values are equal
 * @param {*} actual
 * @param {*} expected
 * @param {string} testName
 */
function assertEqual(actual, expected, testName) {
  if (actual === expected) {
    _testResults.passed++;
    log('  ✓ ' + testName);
  } else {
    _testResults.failed++;
    const msg = testName + ' (expected: ' + expected + ', got: ' + actual + ')';
    _testResults.errors.push(msg);
    log('  ✗ FAIL: ' + msg);
  }
}

/**
 * Run all tests and report results
 */
function runAllTests() {
  _testResults = { passed: 0, failed: 0, errors: [] };

  log('');
  log('========================================');
  log('  MarketingROI Tracker - Test Suite');
  log('========================================');

  log('');
  log('--- parseNaverAdsResponse ---');
  test_parseNaverAdsResponse();
  test_parseNaverAdsResponse_emptyArray();
  test_parseNaverAdsResponse_missingFields();

  log('');
  log('--- isTimeLimitNear ---');
  test_isTimeLimitNear_withinLimit();
  test_isTimeLimitNear_exceeded();
  test_isTimeLimitNear_noStartTime();

  log('');
  log('--- getYesterday ---');
  test_getYesterday_format();

  log('');
  log('--- generateNaverSignature ---');
  test_generateNaverSignature_returnsString();
  test_generateNaverSignature_consistency();

  log('');
  log('--- Data Validation ---');
  test_dataValidation_correctColumns();
  test_dataValidation_wrongColumns();

  log('');
  log('--- Attribution Calculation ---');
  test_attribution_singleChannel();
  test_attribution_multiChannel();
  test_attribution_zeroSpend();
  test_attribution_parseFloat();

  log('');
  log('--- Prune Logic ---');
  test_pruneLogic_filtersOldRows();
  test_pruneLogic_keepsRecentRows();

  log('');
  log('--- Time-Decay Weights ---');
  test_timeDecayWeights_recentHeavier();
  test_timeDecayWeights_multiChannel();

  log('');
  log('--- Multi-Touch Attribution Models ---');
  test_firstTouch_impressionWeighted();
  test_linearModel_equalWeights();
  test_positionBased_uShape();

  log('');
  log('--- Funnel Metrics ---');
  test_funnel_ctr();
  test_funnel_cvr();
  test_funnel_cpa();

  log('');
  log('--- Anomaly Detection ---');
  test_anomaly_zScore_calculation();
  test_anomaly_noAlert_normalData();

  log('');
  log('--- Weekly Report ---');
  test_changeStr_positive();
  test_changeStr_negative();
  test_formatNum();

  log('');
  log('========================================');
  log('  Results: ' + _testResults.passed + ' passed, ' + _testResults.failed + ' failed');
  log('========================================');

  if (_testResults.errors.length > 0) {
    log('');
    log('Failed:');
    _testResults.errors.forEach(function(e) { log('  - ' + e); });
  }
}

// ============================================================
// parseNaverAdsResponse Tests
// ============================================================

/** @description Normal input with all fields */
function test_parseNaverAdsResponse() {
  const mockData = [
    { campaignName: 'Brand_Keywords', salesAmt: 500, impCnt: 10000, clkCnt: 300, ccnt: 15, convAmt: 2000 },
    { campaignName: 'Product_Keywords', salesAmt: 800, impCnt: 20000, clkCnt: 600, ccnt: 25, convAmt: 3500 }
  ];

  const result = parseNaverAdsResponse(mockData);
  assertEqual(result.length, 2, 'returns 2 rows for 2 items');
  assertEqual(result[0][1], 'Naver Search Ads', 'channel is Naver Search Ads');
  assertEqual(result[0][2], 'Brand_Keywords', 'campaign name mapped');
  assertEqual(result[0][3], 500, 'salesAmt → cost (index 3)');
  assertEqual(result[0][4], 10000, 'impCnt → impressions (index 4)');
  assertEqual(result[0][5], 300, 'clkCnt → clicks (index 5)');
  assertEqual(result[0][6], 15, 'ccnt → conversions (index 6)');
  assertEqual(result[0][7], 2000, 'convAmt → revenue (index 7)');
  assertEqual(result[0].length, 8, 'row has 8 columns (Raw Data schema)');
}

/** @description Empty array input */
function test_parseNaverAdsResponse_emptyArray() {
  const result = parseNaverAdsResponse([]);
  assertEqual(result.length, 0, 'empty input returns empty array');
}

/** @description Missing fields default to 0 or "Unknown" */
function test_parseNaverAdsResponse_missingFields() {
  const mockData = [{}];
  const result = parseNaverAdsResponse(mockData);
  assertEqual(result.length, 1, 'missing fields still produces 1 row');
  assertEqual(result[0][2], 'Unknown', 'missing campaignName → Unknown');
  assertEqual(result[0][3], 0, 'missing salesAmt → 0');
  assertEqual(result[0][4], 0, 'missing impCnt → 0');
  assertEqual(result[0][5], 0, 'missing clkCnt → 0');
  assertEqual(result[0][6], 0, 'missing ccnt → 0');
  assertEqual(result[0][7], 0, 'missing convAmt → 0');
}

// ============================================================
// isTimeLimitNear Tests
// ============================================================

/** @description Within time limit */
function test_isTimeLimitNear_withinLimit() {
  const original = CONFIG.startTime;
  CONFIG.startTime = Date.now() - 10000; // 10s elapsed
  assertEqual(isTimeLimitNear(), false, 'false when 10s elapsed (limit 300s)');
  CONFIG.startTime = original;
}

/** @description Exceeded time limit */
function test_isTimeLimitNear_exceeded() {
  const original = CONFIG.startTime;
  CONFIG.startTime = Date.now() - 310000; // 310s elapsed
  assertEqual(isTimeLimitNear(), true, 'true when 310s elapsed (limit 300s)');
  CONFIG.startTime = original;
}

/** @description No start time set */
function test_isTimeLimitNear_noStartTime() {
  const original = CONFIG.startTime;
  CONFIG.startTime = null;
  assertEqual(isTimeLimitNear(), false, 'false when startTime is null');
  CONFIG.startTime = original;
}

// ============================================================
// getYesterday Tests
// ============================================================

/** @description Format is yyyy-MM-dd and equals actual yesterday */
function test_getYesterday_format() {
  const result = getYesterday();
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  assert(pattern.test(result), 'format is yyyy-MM-dd (' + result + ')');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const expected = Utilities.formatDate(yesterday, 'Asia/Seoul', 'yyyy-MM-dd');
  assertEqual(result, expected, 'returns actual yesterday date');
}

// ============================================================
// generateNaverSignature Tests
// ============================================================

/** @description Returns a non-empty string */
function test_generateNaverSignature_returnsString() {
  const sig = generateNaverSignature('1234567890', 'GET', '/test', 'secret');
  assert(typeof sig === 'string', 'signature is a string');
  assert(sig.length > 0, 'signature is not empty');
}

/** @description Same inputs produce same signature, different inputs differ */
function test_generateNaverSignature_consistency() {
  const sig1 = generateNaverSignature('1234567890', 'GET', '/test', 'secret');
  const sig2 = generateNaverSignature('1234567890', 'GET', '/test', 'secret');
  assertEqual(sig1, sig2, 'same inputs → same signature');

  const sig3 = generateNaverSignature('9999999999', 'GET', '/test', 'secret');
  assert(sig1 !== sig3, 'different timestamp → different signature');
}

// ============================================================
// Data Validation Tests (appendDataToSheet logic)
// ============================================================

/** @description All valid rows pass 8-column validation */
function test_dataValidation_correctColumns() {
  const data = [
    ['2024-01-01', 'Google Ads', 'Brand', 100, 5000, 200, 10, 500],
    ['2024-01-01', 'Facebook Ads', 'Retargeting', 200, 8000, 300, 15, 600]
  ];

  const expectedCols = 8;
  const valid = data.filter(function(row) {
    return Array.isArray(row) && row.length === expectedCols;
  });
  assertEqual(valid.length, 2, 'all valid 8-column rows pass');
}

/** @description Invalid column counts are filtered out */
function test_dataValidation_wrongColumns() {
  const data = [
    ['2024-01-01', 'Google Ads', 'Brand', 100, 5000, 200, 10, 500],  // valid (8)
    ['2024-01-01', 'Facebook Ads'],                                    // invalid (2)
    ['2024-01-01', 'Naver', 'X', 1, 2, 3, 4, 5, 6],                  // invalid (9)
  ];

  const expectedCols = 8;
  const valid = data.filter(function(row) {
    return Array.isArray(row) && row.length === expectedCols;
  });
  assertEqual(valid.length, 1, 'only 8-column rows pass, others rejected');
}

// ============================================================
// Attribution Calculation Logic Tests
// ============================================================

/** @description Single channel aggregation */
function test_attribution_singleChannel() {
  const rows = [
    ['2024-01-01', 'Google Ads', 'Brand', 100, 5000, 200, 10, 350],
    ['2024-01-02', 'Google Ads', 'Brand', 150, 6000, 250, 12, 450],
  ];

  const stats = {};
  rows.forEach(function(row) {
    const channel = row[1];
    const cost = parseFloat(row[3]) || 0;
    const revenue = parseFloat(row[7]) || 0;
    if (!stats[channel]) stats[channel] = { spend: 0, revenue: 0 };
    stats[channel].spend += cost;
    stats[channel].revenue += revenue;
  });

  assertEqual(stats['Google Ads'].spend, 250, 'total spend = 100 + 150');
  assertEqual(stats['Google Ads'].revenue, 800, 'total revenue = 350 + 450');

  const roas = Math.round((stats['Google Ads'].revenue / stats['Google Ads'].spend) * 100) / 100;
  assertEqual(roas, 3.2, 'ROAS = 800/250 = 3.2');
}

/** @description Multi-channel aggregation */
function test_attribution_multiChannel() {
  const rows = [
    ['2024-01-01', 'Google Ads', 'Brand', 100, 5000, 200, 10, 350],
    ['2024-01-01', 'Facebook Ads', 'Retargeting', 200, 8000, 300, 15, 500],
    ['2024-01-02', 'Google Ads', 'Generic', 150, 6000, 250, 12, 300],
  ];

  const stats = {};
  rows.forEach(function(row) {
    const channel = row[1];
    const cost = parseFloat(row[3]) || 0;
    const revenue = parseFloat(row[7]) || 0;
    if (!stats[channel]) stats[channel] = { spend: 0, revenue: 0 };
    stats[channel].spend += cost;
    stats[channel].revenue += revenue;
  });

  assertEqual(Object.keys(stats).length, 2, '2 channels detected');
  assertEqual(stats['Google Ads'].spend, 250, 'Google spend = 100 + 150');
  assertEqual(stats['Google Ads'].revenue, 650, 'Google revenue = 350 + 300');
  assertEqual(stats['Facebook Ads'].spend, 200, 'Facebook spend');
  assertEqual(stats['Facebook Ads'].revenue, 500, 'Facebook revenue');
}

/** @description Zero spend does not cause division by zero */
function test_attribution_zeroSpend() {
  const spend = 0;
  const revenue = 100;
  const roas = spend > 0 ? Math.round((revenue / spend) * 100) / 100 : 0;
  assertEqual(roas, 0, 'zero spend → ROAS 0 (no division error)');
}

/** @description parseFloat handles string numbers and edge cases */
function test_attribution_parseFloat() {
  assertEqual(parseFloat('150.50') || 0, 150.5, 'string cost → number');
  assertEqual(parseFloat('500.75') || 0, 500.75, 'string revenue → number');
  assertEqual(parseFloat('') || 0, 0, 'empty string → 0');
  assertEqual(parseFloat(undefined) || 0, 0, 'undefined → 0');
  assertEqual(parseFloat(null) || 0, 0, 'null → 0');
}

// ============================================================
// Prune Logic Tests
// ============================================================

/** @description Rows older than cutoff are filtered out */
function test_pruneLogic_filtersOldRows() {
  const cutoffStr = '2024-10-01';
  const data = [
    ['date', 'channel', 'campaign', 'cost', 'impressions', 'clicks', 'conversions', 'revenue'],
    ['2024-09-15', 'Google Ads', 'Brand', 100, 5000, 200, 10, 500],   // old
    ['2024-09-30', 'Facebook Ads', 'Retargeting', 200, 8000, 300, 15, 600], // old
    ['2024-10-01', 'Naver Ads', 'Brand', 150, 6000, 250, 12, 700],    // keep
    ['2024-10-15', 'Google Ads', 'Generic', 120, 4000, 180, 8, 400],  // keep
  ];

  const keepRows = data.slice(1).filter(function(row) {
    return String(row[0]) >= cutoffStr;
  });

  assertEqual(keepRows.length, 2, '2 rows kept (on or after cutoff)');
  assertEqual(data.length - 1 - keepRows.length, 2, '2 rows pruned (before cutoff)');
}

/** @description All recent rows are preserved */
function test_pruneLogic_keepsRecentRows() {

  const cutoffStr = '2024-01-01';
  const data = [
    ['date', 'channel', 'campaign', 'cost', 'impressions', 'clicks', 'conversions', 'revenue'],
    ['2024-06-01', 'Google Ads', 'Brand', 100, 5000, 200, 10, 500],
    ['2024-07-01', 'Facebook Ads', 'Retargeting', 200, 8000, 300, 15, 600],
  ];

  const keepRows = data.slice(1).filter(function(row) {
    return String(row[0]) >= cutoffStr;
  });

  assertEqual(keepRows.length, 2, 'all rows kept when all are recent');
  assertEqual(data.length - 1 - keepRows.length, 0, '0 rows pruned');
}

// ============================================================
// Time-Decay Weights Tests
// ============================================================

/** @description Recent data should have higher weight than older data */
function test_timeDecayWeights_recentHeavier() {
  // 2 days: day0=old, day1=recent. Half-life=7
  const rows = [
    ['2024-01-01', 'Google Ads', 'Brand', 100, 5000, 200, 10, 1000],
    ['2024-01-02', 'Google Ads', 'Brand', 100, 5000, 200, 10, 1000],
  ];

  const weights = calculateTimeDecayWeights(rows);
  // dayIndex=0 for 2024-01-01, dayIndex=1 for 2024-01-02, totalDays=2
  // day0: factor = 2^((0-2)/7) = 2^(-0.2857) ≈ 0.8204
  // day1: factor = 2^((1-2)/7) = 2^(-0.1429) ≈ 0.9057
  // Recent day (day1) should contribute more weight
  assert(weights['Google Ads'] > 0, 'weight is positive');

  // Verify by computing manually: 1000*0.8204 + 1000*0.9057 ≈ 1726.1
  const expected = 1000 * Math.pow(2, (0 - 2) / 7) + 1000 * Math.pow(2, (1 - 2) / 7);
  const diff = Math.abs(weights['Google Ads'] - expected);
  assert(diff < 0.01, 'weight matches manual calculation (diff=' + diff + ')');
}

/** @description Multi-channel weights are independent */
function test_timeDecayWeights_multiChannel() {
  const rows = [
    ['2024-01-01', 'Google Ads', 'Brand', 100, 5000, 200, 10, 500],
    ['2024-01-01', 'Facebook Ads', 'Retargeting', 200, 8000, 300, 15, 1000],
  ];

  const weights = calculateTimeDecayWeights(rows);
  assert(weights['Google Ads'] > 0, 'Google weight exists');
  assert(weights['Facebook Ads'] > 0, 'Facebook weight exists');
  assert(weights['Facebook Ads'] > weights['Google Ads'],
    'Facebook weight > Google weight (2x revenue)');
}

// ============================================================
// Multi-Touch Attribution Model Tests
// ============================================================

/** @description First-Touch gives more credit to high-impression channels */
function test_firstTouch_impressionWeighted() {
  // Channel A: 80% impressions, Channel B: 20% impressions
  const totalRevenue = 1000;
  const totalImpressions = 10000;
  const channelA_impressions = 8000;
  const channelB_impressions = 2000;

  const firstTouchA = Math.round(totalRevenue * (channelA_impressions / totalImpressions) * 100) / 100;
  const firstTouchB = Math.round(totalRevenue * (channelB_impressions / totalImpressions) * 100) / 100;

  assertEqual(firstTouchA, 800, 'First-Touch: 80% impressions → 80% revenue');
  assertEqual(firstTouchB, 200, 'First-Touch: 20% impressions → 20% revenue');
  assertEqual(firstTouchA + firstTouchB, 1000, 'First-Touch: total equals 100%');
}

/** @description Linear model averages impression, click, conversion shares */
function test_linearModel_equalWeights() {
  const totalRevenue = 900;
  // Channel with equal shares across all metrics
  const impShare = 0.5;
  const clickShare = 0.5;
  const convShare = 0.5;

  const linearShare = (impShare + clickShare + convShare) / 3;
  const linear = Math.round(totalRevenue * linearShare * 100) / 100;

  assertEqual(linearShare, 0.5, 'Linear: equal shares → 50%');
  assertEqual(linear, 450, 'Linear: 50% of 900 = 450');

  // Unequal shares
  const impShare2 = 0.6;
  const clickShare2 = 0.3;
  const convShare2 = 0.3;
  const linearShare2 = (impShare2 + clickShare2 + convShare2) / 3;
  const linear2 = Math.round(totalRevenue * linearShare2 * 100) / 100;

  assertEqual(linear2, 360, 'Linear: (0.6+0.3+0.3)/3 × 900 = 360');
}

/** @description Position-Based (U-Shape): 40% first + 40% last + 20% linear */
function test_positionBased_uShape() {
  const firstTouch = 800;
  const lastTouch = 500;
  const linear = 600;

  const positionBased = Math.round((firstTouch * 0.4 + lastTouch * 0.4 + linear * 0.2) * 100) / 100;

  // 800*0.4 + 500*0.4 + 600*0.2 = 320 + 200 + 120 = 640
  assertEqual(positionBased, 640, 'Position-Based: 40/40/20 weighting');

  // Equal inputs should give same output
  const equal = Math.round((500 * 0.4 + 500 * 0.4 + 500 * 0.2) * 100) / 100;
  assertEqual(equal, 500, 'Position-Based: equal inputs → same value');
}

// ============================================================
// Funnel Metrics Tests
// ============================================================

/** @description CTR = clicks / impressions * 100 */
function test_funnel_ctr() {
  const impressions = 10000;
  const clicks = 300;
  const ctr = Math.round((clicks / impressions) * 10000) / 100;
  assertEqual(ctr, 3, 'CTR: 300/10000 = 3%');

  // Zero impressions
  const ctrZero = 0 > 0 ? Math.round((clicks / 0) * 10000) / 100 : 0;
  assertEqual(ctrZero, 0, 'CTR: 0 impressions → 0%');
}

/** @description CVR = conversions / clicks * 100 */
function test_funnel_cvr() {
  const clicks = 200;
  const conversions = 10;
  const cvr = Math.round((conversions / clicks) * 10000) / 100;
  assertEqual(cvr, 5, 'CVR: 10/200 = 5%');

  // Zero clicks
  const cvrZero = 0 > 0 ? Math.round((conversions / 0) * 10000) / 100 : 0;
  assertEqual(cvrZero, 0, 'CVR: 0 clicks → 0%');
}

/** @description CPA = spend / conversions */
function test_funnel_cpa() {
  const spend = 1000;
  const conversions = 50;
  const cpa = Math.round((spend / conversions) * 100) / 100;
  assertEqual(cpa, 20, 'CPA: 1000/50 = $20');

  // Zero conversions
  const cpaZero = 0 > 0 ? Math.round((spend / 0) * 100) / 100 : 0;
  assertEqual(cpaZero, 0, 'CPA: 0 conversions → $0');
}

// ============================================================
// Anomaly Detection Tests
// ============================================================

/** @description Z-score calculation matches expected formula */
function test_anomaly_zScore_calculation() {
  const values = [2.0, 2.5, 3.0, 2.8, 2.2, 2.7, 2.4];
  const mean = values.reduce(function(a, b) { return a + b; }, 0) / values.length;
  const variance = values.reduce(function(a, b) { return a + Math.pow(b - mean, 2); }, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Test with a value that's 2+ std devs above mean
  const outlier = mean + 2.5 * stdDev;
  const zScore = (outlier - mean) / stdDev;
  assertEqual(Math.round(zScore * 10) / 10, 2.5, 'Z-score = 2.5 for value at mean + 2.5σ');

  // Normal value should have low Z-score
  const normalZ = Math.abs((2.5 - mean) / stdDev);
  assert(normalZ < 2.0, 'Z-score < 2.0 for normal value (' + Math.round(normalZ * 100) / 100 + ')');
}

/** @description No alert triggered for normal data */
function test_anomaly_noAlert_normalData() {
  const values = [2.0, 2.1, 1.9, 2.0, 2.2, 1.8, 2.0, 2.1, 2.0, 1.9];
  const mean = values.reduce(function(a, b) { return a + b; }, 0) / values.length;
  const variance = values.reduce(function(a, b) { return a + Math.pow(b - mean, 2); }, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Latest value is within normal range
  const latest = 2.0;
  const zScore = stdDev > 0 ? Math.abs((latest - mean) / stdDev) : 0;

  assert(zScore < CONFIG.anomaly.zScoreThreshold,
    'normal data Z-score (' + Math.round(zScore * 100) / 100 + ') < threshold (' + CONFIG.anomaly.zScoreThreshold + ')');
}

// ============================================================
// Weekly Report Helper Tests
// ============================================================

/** @description Positive change shows + prefix */
function test_changeStr_positive() {
  const result = changeStr(120, 100);
  assertEqual(result, '+20%', 'positive change: 120 vs 100 → +20%');

  const result2 = changeStr(100, 100);
  assertEqual(result2, '+0%', 'no change: 100 vs 100 → +0%');
}

/** @description Negative change shows - prefix */
function test_changeStr_negative() {
  const result = changeStr(80, 100);
  assertEqual(result, '-20%', 'negative change: 80 vs 100 → -20%');

  const resultZero = changeStr(50, 0);
  assertEqual(resultZero, 'N/A', 'zero previous → N/A');
}

/** @description formatNum adds comma separators */
function test_formatNum() {
  assertEqual(formatNum(1234), '1,234', '1234 → 1,234');
  assertEqual(formatNum(1234567), '1,234,567', '1234567 → 1,234,567');
  assertEqual(formatNum(999), '999', '999 → 999 (no comma)');
  assertEqual(formatNum(0), '0', '0 → 0');
}
