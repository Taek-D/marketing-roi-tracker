/**
 * MarketingROI Tracker - Core Logic
 */

/**
 * Creates custom menu when spreadsheet opens
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('MarketingROI Tracker')
      .addItem('Refresh Data', 'main')
      .addToUi();
}

/**
 * Main execution function triggered daily
 */
function main() {
  try {
    const rawDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetNames.rawData);
    if (!rawDataSheet) {
      throw new Error('Raw Data sheet not found');
    }

    // 1. Fetch Google Ads Data
    const googleAdsData = fetchGoogleAdsData();
    if (googleAdsData && googleAdsData.length > 0) {
      appendDataToSheet(rawDataSheet, googleAdsData);
    }

    // 2. Fetch Facebook Ads Data
    const fbAdsData = fetchFacebookAdsData();
    if (fbAdsData && fbAdsData.length > 0) {
      appendDataToSheet(rawDataSheet, fbAdsData);
    }

    // 3. Fetch Naver Search Ads Data
    const naverAdsData = fetchNaverSearchAdsData();
    if (naverAdsData && naverAdsData.length > 0) {
      appendDataToSheet(rawDataSheet, naverAdsData);
    }

    // 4. Run Attribution Logic
    calculateAttribution();

    // 5. Update Dashboard
    updateDashboard();

  } catch (e) {
    log('Error in main: ' + e.message);
    notifySlack('Error in MarketingROI Tracker: ' + e.message);
  }
}

/**
 * Fetch Data from Google Ads API
 * (Placeholder logic for demonstration)
 * @returns {Array} Array of row data matching Raw Data schema
 */
function fetchGoogleAdsData() {
  const customerId = getProperty('GOOGLE_ADS_CUSTOMER_ID');
  if (!customerId) {
    log('Missing Google Ads Customer ID');
    return [];
  }

  for (let attempt = 1; attempt <= CONFIG.api.googleAds.maxRetries; attempt++) {
    try {
      // Real implementation would use UrlFetchApp with OAuth token
      // GAQL Query: SELECT segments.date, metrics.cost_micros, metrics.impressions ...

      log('Fetching Google Ads data for customer: ' + customerId);
      return []; // Return empty for now as we don't have real creds
    } catch (e) {
      log('Google Ads fetch attempt ' + attempt + ' failed: ' + e.message);
      if (attempt === CONFIG.api.googleAds.maxRetries) {
        notifySlack('Google Ads fetch failed after ' + attempt + ' retries: ' + e.message);
        return [];
      }
      Utilities.sleep(1000 * attempt);
    }
  }
  return [];
}

/**
 * Fetch Data from Facebook Marketing API
 * @returns {Array} Array of row data matching Raw Data schema
 */
function fetchFacebookAdsData() {
  const accountId = getProperty('FB_AD_ACCOUNT_ID');
  const accessToken = getProperty('FB_ACCESS_TOKEN');

  if (!accountId || !accessToken) {
    log('Missing FB credentials');
    return [];
  }

  for (let attempt = 1; attempt <= CONFIG.api.facebook.maxRetries; attempt++) {
    try {
      // Real implementation would use UrlFetchApp
      // Graph API: /act_{id}/insights?fields=...

      log('Fetching FB Ads data for account: ' + accountId);
      return [];
    } catch (e) {
      log('FB Ads fetch attempt ' + attempt + ' failed: ' + e.message);
      if (attempt === CONFIG.api.facebook.maxRetries) {
        notifySlack('FB Ads fetch failed after ' + attempt + ' retries: ' + e.message);
        return [];
      }
      Utilities.sleep(1000 * attempt);
    }
  }
  return [];
}

/**
 * Fetch Data from Naver Search Ads API
 * API Docs: https://naver.github.io/searchad-apidoc/
 * Setup Guide: ./naver_setup_guide.md
 * @returns {Array} Array of row data matching Raw Data schema
 */
function fetchNaverSearchAdsData() {
  const customerId = getProperty('NAVER_ADS_CUSTOMER_ID');
  const apiKey = getProperty('NAVER_ADS_API_KEY');
  const secretKey = getProperty('NAVER_ADS_SECRET_KEY');

  if (!customerId || !apiKey || !secretKey) {
    log('Naver Search Ads: credentials not set (skip)');
    return [];
  }

  for (let attempt = 1; attempt <= CONFIG.api.naverAds.maxRetries; attempt++) {
    try {
      // Generate HMAC-SHA256 signature for Naver API auth
      const timestamp = String(new Date().getTime());
      const method = 'GET';
      const path = '/ncc/stats';
      const signature = generateNaverSignature(timestamp, method, path, secretKey);

      const fields = encodeURIComponent('["impCnt","clkCnt","salesAmt","ccnt","convAmt"]');
      const timeRange = encodeURIComponent('{"since":"' + getYesterday() + '","until":"' + getYesterday() + '"}');
      const url = CONFIG.api.naverAds.baseUrl + path +
        '?id=' + customerId +
        '&fields=' + fields +
        '&timeRange=' + timeRange;

      const response = UrlFetchApp.fetch(url, {
        method: method,
        headers: {
          'X-Timestamp': timestamp,
          'X-API-KEY': apiKey,
          'X-Customer': customerId,
          'X-Signature': signature
        },
        muteHttpExceptions: true
      });

      const code = response.getResponseCode();
      if (code !== 200) {
        throw new Error('Naver API returned ' + code + ': ' + response.getContentText());
      }

      const data = JSON.parse(response.getContentText());
      log('Fetching Naver Ads data: ' + data.length + ' rows');
      return parseNaverAdsResponse(data);
    } catch (e) {
      log('Naver Ads fetch attempt ' + attempt + ' failed: ' + e.message);
      if (attempt === CONFIG.api.naverAds.maxRetries) {
        notifySlack('Naver Ads fetch failed after ' + attempt + ' retries: ' + e.message);
        return [];
      }
      Utilities.sleep(1000 * attempt);
    }
  }
  return [];
}

/**
 * Generate HMAC-SHA256 signature for Naver Ads API
 * @param {string} timestamp - Unix timestamp in milliseconds
 * @param {string} method - HTTP method
 * @param {string} path - API path
 * @param {string} secretKey - API secret key
 * @returns {string} Base64-encoded signature
 */
function generateNaverSignature(timestamp, method, path, secretKey) {
  const message = timestamp + '.' + method + '.' + path;
  const signature = Utilities.computeHmacSha256Signature(message, secretKey);
  return Utilities.base64Encode(signature);
}

/**
 * Parse Naver Search Ads API response to Raw Data schema
 * @param {Array} data - Naver API response
 * @returns {Array} Rows matching [date, channel, campaign, cost, impressions, clicks, conversions, revenue]
 */
function parseNaverAdsResponse(data) {
  const rows = [];
  const dateStr = getYesterday();

  data.forEach(function(item) {
    rows.push([
      dateStr,
      'Naver Search Ads',
      item.campaignName || 'Unknown',
      item.salesAmt || 0,
      item.impCnt || 0,
      item.clkCnt || 0,
      item.ccnt || 0,
      item.convAmt || 0
    ]);
  });

  return rows;
}

/**
 * Get yesterday's date string (yyyy-MM-dd)
 * @returns {string} Yesterday in yyyy-MM-dd format
 */
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return Utilities.formatDate(d, 'Asia/Seoul', 'yyyy-MM-dd');
}

/**
 * Append rows to sheet
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Target sheet
 * @param {Array<Array>} data - 2D array matching Raw Data schema
 */
function appendDataToSheet(sheet, data) {
  if (!data || data.length === 0) return;
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
  log('Appended ' + data.length + ' rows');
}

/**
 * Send notification to Slack
 * @param {string} message - The message to send
 */
function notifySlack(message) {
  const webhookUrl = CONFIG.slack.webhookUrl;
  if (!webhookUrl) return;

  try {
    const payload = {
      text: message
    };

    UrlFetchApp.fetch(webhookUrl, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload)
    });
  } catch (e) {
    log('Slack notification failed: ' + e.message);
  }
}
