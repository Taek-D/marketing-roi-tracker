/**
 * Attribution Logic
 */

/**
 * Calculate ROAS and Attribution
 * Triggered after data collection
 */
/**
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

  // clearContents() preserves formatting; use clear() if full reset is needed
  attrSheet.clearContents();

  const data = rawSheet.getDataRange().getValues();
  const rows = data.slice(1); // Row 1 is header

  // Aggregate by Channel
  const stats = {};

  rows.forEach(function(row) {
    // Schema: Date, Channel, Campaign, Cost, Impressions, Clicks, Conversions, Revenue
    const channel = row[1];
    const cost = parseFloat(row[3]) || 0;
    const revenue = parseFloat(row[7]) || 0;

    if (!stats[channel]) {
      stats[channel] = { spend: 0, revenue: 0 };
    }
    stats[channel].spend += cost;
    stats[channel].revenue += revenue;
  });

  // Batch write: header + all channel rows at once
  const resultRows = [['Channel', 'Spend', 'Revenue', 'ROAS', 'Attribution Model']];
  Object.keys(stats).forEach(function(channel) {
    const s = stats[channel];
    const roas = s.spend > 0 ? Math.round((s.revenue / s.spend) * 100) / 100 : 0;
    resultRows.push([channel, s.spend, s.revenue, roas, 'Last Touch (MVP)']);
  });
  attrSheet.getRange(1, 1, resultRows.length, 5).setValues(resultRows);

  log('Attribution calculation complete.');
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
  const rowsToDelete = [];
  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) < cutoffStr) {
      rowsToDelete.push(i + 1); // 1-indexed sheet row
    }
  }

  // Delete from bottom to top to preserve row indices
  rowsToDelete.forEach(function(row) {
    rawSheet.deleteRow(row);
  });

  if (rowsToDelete.length > 0) {
    log('Pruned ' + rowsToDelete.length + ' rows older than 90 days');
  }
}
