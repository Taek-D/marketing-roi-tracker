/**
 * Attribution Logic - Multi-Touch Models & Funnel Analysis
 */

/**
 * Calculate Multi-Touch Attribution and Funnel Metrics
 * Models: Last-Touch, First-Touch, Linear, Time-Decay, Position-Based
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [ss] - Spreadsheet instance (optional)
 */
function calculateAttribution(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
  const attrSheet = ss.getSheetByName(CONFIG.sheetNames.attribution);

  if (!rawSheet || !attrSheet) {
    log('Required sheets not found: Raw Data or Attribution');
    notifySlack('Attribution failed: Required sheets not found');
    return;
  }

  attrSheet.clearContents();

  const data = rawSheet.getDataRange().getValues();
  const rows = data.slice(1);

  if (rows.length === 0) {
    log('No data for attribution');
    return;
  }

  // --- Aggregate by Channel ---
  const channelStats = {};
  const totals = { spend: 0, revenue: 0, impressions: 0, clicks: 0, conversions: 0 };

  rows.forEach(function(row) {
    const channel = row[1];
    const cost = parseFloat(row[3]) || 0;
    const impressions = parseFloat(row[4]) || 0;
    const clicks = parseFloat(row[5]) || 0;
    const conversions = parseFloat(row[6]) || 0;
    const revenue = parseFloat(row[7]) || 0;

    if (!channelStats[channel]) {
      channelStats[channel] = { spend: 0, revenue: 0, impressions: 0, clicks: 0, conversions: 0 };
    }
    channelStats[channel].spend += cost;
    channelStats[channel].revenue += revenue;
    channelStats[channel].impressions += impressions;
    channelStats[channel].clicks += clicks;
    channelStats[channel].conversions += conversions;

    totals.spend += cost;
    totals.revenue += revenue;
    totals.impressions += impressions;
    totals.clicks += clicks;
    totals.conversions += conversions;
  });

  const channels = Object.keys(channelStats);
  const timeDecayWeights = calculateTimeDecayWeights(rows);
  const totalTdWeight = channels.reduce(function(sum, ch) {
    return sum + (timeDecayWeights[ch] || 0);
  }, 0);

  // === Section 1: Attribution Model Comparison ===
  const attrHeader = ['Channel', 'Spend', 'Revenue', 'ROAS',
    'Last-Touch', 'First-Touch', 'Linear', 'Time-Decay', 'Position-Based'];
  const attrRows = [attrHeader];

  channels.forEach(function(channel) {
    const s = channelStats[channel];
    const roas = s.spend > 0 ? Math.round((s.revenue / s.spend) * 100) / 100 : 0;

    // Last-Touch: 100% of channel's own revenue
    const lastTouch = Math.round(s.revenue * 100) / 100;

    // First-Touch: weighted by impression share (awareness proxy)
    const impShare = totals.impressions > 0 ? s.impressions / totals.impressions : 0;
    const firstTouch = Math.round(totals.revenue * impShare * 100) / 100;

    // Linear: equal weight to impression, click, conversion shares
    const clickShare = totals.clicks > 0 ? s.clicks / totals.clicks : 0;
    const convShare = totals.conversions > 0 ? s.conversions / totals.conversions : 0;
    const linearShare = (impShare + clickShare + convShare) / 3;
    const linear = Math.round(totals.revenue * linearShare * 100) / 100;

    // Time-Decay: exponential decay, half-life 7 days
    const tdWeight = timeDecayWeights[channel] || 0;
    const tdShare = totalTdWeight > 0 ? tdWeight / totalTdWeight : 0;
    const timeDecay = Math.round(totals.revenue * tdShare * 100) / 100;

    // Position-Based (U-Shape): 40% first-touch + 40% last-touch + 20% linear
    const positionBased = Math.round((firstTouch * 0.4 + lastTouch * 0.4 + linear * 0.2) * 100) / 100;

    attrRows.push([channel, s.spend, s.revenue, roas,
      lastTouch, firstTouch, linear, timeDecay, positionBased]);
  });

  attrSheet.getRange(1, 1, attrRows.length, attrRows[0].length).setValues(attrRows);
  attrSheet.getRange(1, 1, 1, attrRows[0].length)
    .setFontWeight('bold').setBackground('#34A853').setFontColor('#FFFFFF');

  // === Section 2: Funnel Analysis ===
  const funnelStartRow = attrRows.length + 2;
  attrSheet.getRange(funnelStartRow, 1)
    .setValue('Funnel Analysis').setFontWeight('bold').setFontSize(12);

  const funnelHeader = ['Channel', 'Impressions', 'Clicks', 'Conversions',
    'CTR (%)', 'CVR (%)', 'Conv Rate (%)', 'CPA ($)', 'CPM ($)'];
  const funnelRows = [funnelHeader];

  channels.forEach(function(channel) {
    const s = channelStats[channel];
    const ctr = s.impressions > 0 ? Math.round((s.clicks / s.impressions) * 10000) / 100 : 0;
    const cvr = s.clicks > 0 ? Math.round((s.conversions / s.clicks) * 10000) / 100 : 0;
    const overallRate = s.impressions > 0 ? Math.round((s.conversions / s.impressions) * 100000) / 1000 : 0;
    const cpa = s.conversions > 0 ? Math.round((s.spend / s.conversions) * 100) / 100 : 0;
    const cpm = s.impressions > 0 ? Math.round((s.spend / s.impressions * 1000) * 100) / 100 : 0;

    funnelRows.push([channel, s.impressions, s.clicks, s.conversions,
      ctr, cvr, overallRate, cpa, cpm]);
  });

  attrSheet.getRange(funnelStartRow + 1, 1, funnelRows.length, funnelRows[0].length).setValues(funnelRows);
  attrSheet.getRange(funnelStartRow + 1, 1, 1, funnelRows[0].length)
    .setFontWeight('bold').setBackground('#E8F0FE');

  log('Attribution complete: ' + channels.length + ' channels, 5 models + funnel');
}

/**
 * Calculate Time-Decay weights per channel (half-life = 7 days)
 * @param {Array} rows - Raw data rows (without header)
 * @returns {Object} Channel name -> weighted revenue value
 */
function calculateTimeDecayWeights(rows) {
  const weights = {};
  const dateSet = {};
  rows.forEach(function(r) { dateSet[String(r[0])] = true; });
  const uniqueDates = Object.keys(dateSet).sort();
  const totalDays = uniqueDates.length;

  rows.forEach(function(row) {
    const channel = row[1];
    const revenue = parseFloat(row[7]) || 0;
    const dateStr = String(row[0]);
    const dayIndex = uniqueDates.indexOf(dateStr);

    // Half-life of 7 days: recent data gets exponentially more weight
    const decayFactor = Math.pow(2, (dayIndex - totalDays) / 7);

    if (!weights[channel]) weights[channel] = 0;
    weights[channel] += revenue * decayFactor;
  });

  return weights;
}

/**
 * Update Dashboard Sheet
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [ss] - Spreadsheet instance (optional)
 */
function updateDashboard(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const dashSheet = ss.getSheetByName(CONFIG.sheetNames.dashboard);
  if (!dashSheet) {
    log('Dashboard sheet not found');
    return;
  }
  dashSheet.getRange('C2').setValue(Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'));
  log('Dashboard updated.');
}

/**
 * Delete Raw Data rows older than 90 days
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [ss] - Spreadsheet instance (optional)
 */
function pruneOldData(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
  if (!rawSheet || rawSheet.getLastRow() <= 1) return;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = Utilities.formatDate(cutoff, 'Asia/Seoul', 'yyyy-MM-dd');

  const data = rawSheet.getDataRange().getValues();
  const header = data[0];
  const keepRows = data.slice(1).filter(function(row) {
    return String(row[0]) >= cutoffStr;
  });

  const prunedCount = data.length - 1 - keepRows.length;
  if (prunedCount <= 0) return;

  // Batch rewrite: clear once + write once (instead of N deleteRow calls)
  rawSheet.clearContents();
  const output = [header].concat(keepRows);
  rawSheet.getRange(1, 1, output.length, header.length).setValues(output);

  log('Pruned ' + prunedCount + ' rows older than 90 days');
}
