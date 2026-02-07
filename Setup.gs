/**
 * Setup & Initialization for MarketingROI Tracker
 * Run setupAll() once to initialize the spreadsheet.
 * After setup is complete, this file can be removed.
 */

/**
 * One-click full setup: sheets + headers + dashboard + test data + trigger
 */
function setupAll() {
  createRequiredSheets();
  insertTestData();
  calculateAttribution();
  updateDashboard();
  setupDailyTrigger();
  log('Setup complete! All sheets created, test data inserted, trigger set.');
  SpreadsheetApp.getUi().alert(
    'Setup Complete!\n\n' +
    '- 4 sheets created (Raw Data, Attribution, Dashboard, Config)\n' +
    '- 30 days of test data inserted (3 channels x 3 campaigns)\n' +
    '- Attribution calculated\n' +
    '- Daily 9AM trigger set\n\n' +
    'Open the Dashboard sheet to see results.'
  );
}

/**
 * Create required sheets with headers
 */
function createRequiredSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Raw Data
  let rawSheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
  if (!rawSheet) {
    rawSheet = ss.insertSheet(CONFIG.sheetNames.rawData);
  }
  rawSheet.clearContents();
  rawSheet.appendRow(['date', 'channel', 'campaign', 'cost', 'impressions', 'clicks', 'conversions', 'revenue']);
  rawSheet.getRange('1:1').setFontWeight('bold').setBackground('#4285F4').setFontColor('#FFFFFF');
  rawSheet.setFrozenRows(1);
  rawSheet.setColumnWidths(1, 8, 120);

  // Attribution
  let attrSheet = ss.getSheetByName(CONFIG.sheetNames.attribution);
  if (!attrSheet) {
    attrSheet = ss.insertSheet(CONFIG.sheetNames.attribution);
  }
  attrSheet.clearContents();
  attrSheet.appendRow(['Channel', 'Spend', 'Revenue', 'ROAS', 'Attribution Model']);
  attrSheet.getRange('1:1').setFontWeight('bold').setBackground('#34A853').setFontColor('#FFFFFF');
  attrSheet.setFrozenRows(1);

  // Dashboard
  let dashSheet = ss.getSheetByName(CONFIG.sheetNames.dashboard);
  if (!dashSheet) {
    dashSheet = ss.insertSheet(CONFIG.sheetNames.dashboard);
  }
  dashSheet.clearContents();
  setupDashboardLayout(dashSheet);

  // Config
  let configSheet = ss.getSheetByName(CONFIG.sheetNames.config);
  if (!configSheet) {
    configSheet = ss.insertSheet(CONFIG.sheetNames.config);
  }
  configSheet.clearContents();
  setupConfigSheet(configSheet);

  // Remove default Sheet1 if exists
  const defaultSheet = ss.getSheetByName('Sheet1') || ss.getSheetByName('시트1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  log('Required sheets created successfully.');
}

/**
 * Setup Dashboard layout with summary cards
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function setupDashboardLayout(sheet) {
  // Title
  sheet.getRange('A1').setValue('MarketingROI Tracker Dashboard').setFontSize(18).setFontWeight('bold');
  sheet.getRange('A2').setValue('Last Updated:').setFontWeight('bold');
  sheet.getRange('C2').setValue(new Date());

  // Summary Cards Row
  sheet.getRange('A4').setValue('Total Spend').setFontWeight('bold').setBackground('#E8F0FE');
  sheet.getRange('B4').setValue('Total Revenue').setFontWeight('bold').setBackground('#E8F0FE');
  sheet.getRange('C4').setValue('Avg ROAS').setFontWeight('bold').setBackground('#E8F0FE');
  sheet.getRange('D4').setValue('Total Conversions').setFontWeight('bold').setBackground('#E8F0FE');

  // Formulas pulling from Attribution sheet
  const attrName = CONFIG.sheetNames.attribution;
  sheet.getRange('A5').setFormula("=IFERROR(SUM('" + attrName + "'!B2:B), 0)").setNumberFormat('$#,##0');
  sheet.getRange('B5').setFormula("=IFERROR(SUM('" + attrName + "'!C2:C), 0)").setNumberFormat('$#,##0');
  sheet.getRange('C5').setFormula("=IFERROR(B5/A5, 0)").setNumberFormat('0.00');
  sheet.getRange('D5').setFormula("=IFERROR(SUM('" + CONFIG.sheetNames.rawData + "'!G2:G), 0)").setNumberFormat('#,##0');

  // Summary card styling
  sheet.getRange('A5:D5').setFontSize(14).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.getRange('A4:D4').setHorizontalAlignment('center');

  // Channel Breakdown Header
  sheet.getRange('A7').setValue('Channel Breakdown').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A8').setValue('Channel').setFontWeight('bold').setBackground('#FBBC04');
  sheet.getRange('B8').setValue('Spend').setFontWeight('bold').setBackground('#FBBC04');
  sheet.getRange('C8').setValue('Revenue').setFontWeight('bold').setBackground('#FBBC04');
  sheet.getRange('D8').setValue('ROAS').setFontWeight('bold').setBackground('#FBBC04');

  // Channel breakdown: hardcoded for 3 channels. Update formulas if adding more channels.
  sheet.getRange('A9').setFormula("=IFERROR('" + attrName + "'!A2, \"\")");
  sheet.getRange('B9').setFormula("=IFERROR('" + attrName + "'!B2, \"\")").setNumberFormat('$#,##0');
  sheet.getRange('C9').setFormula("=IFERROR('" + attrName + "'!C2, \"\")").setNumberFormat('$#,##0');
  sheet.getRange('D9').setFormula("=IFERROR('" + attrName + "'!D2, \"\")").setNumberFormat('0.00');

  sheet.getRange('A10').setFormula("=IFERROR('" + attrName + "'!A3, \"\")");
  sheet.getRange('B10').setFormula("=IFERROR('" + attrName + "'!B3, \"\")").setNumberFormat('$#,##0');
  sheet.getRange('C10').setFormula("=IFERROR('" + attrName + "'!C3, \"\")").setNumberFormat('$#,##0');
  sheet.getRange('D10').setFormula("=IFERROR('" + attrName + "'!D3, \"\")").setNumberFormat('0.00');

  sheet.getRange('A11').setFormula("=IFERROR('" + attrName + "'!A4, \"\")");
  sheet.getRange('B11').setFormula("=IFERROR('" + attrName + "'!B4, \"\")").setNumberFormat('$#,##0');
  sheet.getRange('C11').setFormula("=IFERROR('" + attrName + "'!C4, \"\")").setNumberFormat('$#,##0');
  sheet.getRange('D11').setFormula("=IFERROR('" + attrName + "'!D4, \"\")").setNumberFormat('0.00');

  // Column widths
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 140);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 140);
}

/**
 * Setup Config sheet with property descriptions
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet
 */
function setupConfigSheet(sheet) {
  sheet.getRange('A1').setValue('MarketingROI Tracker - Configuration').setFontSize(14).setFontWeight('bold');
  sheet.getRange('A2').setValue('Set Script Properties via: Extensions > Apps Script > Project Settings > Script Properties');
  sheet.getRange('A2').setFontColor('#666666');

  sheet.getRange('A4').setValue('Property Name').setFontWeight('bold').setBackground('#EA4335').setFontColor('#FFFFFF');
  sheet.getRange('B4').setValue('Description').setFontWeight('bold').setBackground('#EA4335').setFontColor('#FFFFFF');
  sheet.getRange('C4').setValue('Required').setFontWeight('bold').setBackground('#EA4335').setFontColor('#FFFFFF');

  const props = [
    ['GOOGLE_ADS_CUSTOMER_ID', 'Google Ads Customer ID (e.g. 123-456-7890)', 'Yes'],
    ['GOOGLE_ADS_DEVELOPER_TOKEN', 'Google Ads API Developer Token', 'Yes'],
    ['GOOGLE_ADS_REFRESH_TOKEN', 'OAuth2 Refresh Token for Google Ads', 'Yes'],
    ['FB_AD_ACCOUNT_ID', 'Facebook Ad Account ID (e.g. act_123456)', 'Yes'],
    ['FB_ACCESS_TOKEN', 'Facebook Long-lived Access Token (60-day or System User)', 'Yes'],
    ['NAVER_ADS_CUSTOMER_ID', 'Naver Search Ads Customer ID (see naver_setup_guide.md)', 'No'],
    ['NAVER_ADS_API_KEY', 'Naver Search Ads API Key (Tools > API Manager)', 'No'],
    ['NAVER_ADS_SECRET_KEY', 'Naver Search Ads API Secret Key', 'No'],
    ['SLACK_WEBHOOK_URL', 'Slack Incoming Webhook URL for error alerts', 'No'],
  ];

  for (let i = 0; i < props.length; i++) {
    sheet.getRange(5 + i, 1).setValue(props[i][0]).setFontFamily('Courier New');
    sheet.getRange(5 + i, 2).setValue(props[i][1]);
    sheet.getRange(5 + i, 3).setValue(props[i][2]).setHorizontalAlignment('center');
  }

  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 420);
  sheet.setColumnWidth(3, 80);
  sheet.setFrozenRows(4);
}

/**
 * Insert 30 days of realistic test data into Raw Data sheet
 */
function insertTestData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
  if (!rawSheet) {
    log('Raw Data sheet not found');
    return;
  }

  const campaigns = {
    'Google Ads': ['Brand_Search', 'Generic_Search', 'Display_Retargeting'],
    'Facebook Ads': ['Lookalike_Audience', 'Retargeting', 'Interest_Targeting'],
    'Naver Search Ads': ['Brand_Keywords', 'Product_Keywords', 'Competitor_Keywords']
  };

  const rows = [];
  const today = new Date();

  for (let d = 29; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dateStr = Utilities.formatDate(date, 'Asia/Seoul', 'yyyy-MM-dd');

    for (const channel in campaigns) {
      campaigns[channel].forEach(function(campaign) {
        // All test data uses normalized USD values for cross-channel comparison
        const cost = Math.round((Math.random() * 450 + 50) * 100) / 100;
        const impressions = Math.floor(Math.random() * 49000 + 1000);
        const ctr = Math.random() * 0.04 + 0.01;
        const clicks = Math.floor(impressions * ctr);
        const convRate = Math.random() * 0.06 + 0.02;
        const conversions = Math.floor(clicks * convRate);
        const avgOrderValue = Math.random() * 150 + 50;
        const revenue = Math.round(conversions * avgOrderValue * 100) / 100;

        rows.push([dateStr, channel, campaign, cost, impressions, clicks, conversions, revenue]);
      });
    }
  }

  if (rows.length > 0) {
    rawSheet.getRange(2, 1, rows.length, 8).setValues(rows);
  }

  log('Inserted ' + rows.length + ' rows of test data.');
}

/**
 * Setup daily trigger to run main() at 9 AM KST
 */
function setupDailyTrigger() {
  // Remove existing triggers for main to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'main') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('main')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .inTimezone('Asia/Seoul')
    .create();

  log('Daily trigger set: main() at 9:00 AM KST');
}
