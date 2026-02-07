/**
 * Attribution Logic
 */

/**
 * Calculate ROAS and Attribution
 * Triggered after data collection
 */
function calculateAttribution() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
  const attrSheet = ss.getSheetByName(CONFIG.sheetNames.attribution);

  if (!rawSheet || !attrSheet) {
    log('Required sheets not found: Raw Data or Attribution');
    notifySlack('Attribution failed: Required sheets not found');
    return;
  }

  // Clear old data
  attrSheet.clearContents();
  attrSheet.appendRow(['Channel', 'Spend', 'Revenue', 'ROAS', 'Attribution Model']);
  
  const data = rawSheet.getDataRange().getValues();
  // Assume Row 1 is header
  const rows = data.slice(1);
  
  // Aggregate by Channel
  const stats = {};
  
  rows.forEach(row => {
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
  
  // Write result (Simple Last Touch as per MVP)
  for (const channel in stats) {
    const s = stats[channel];
    const roas = s.spend > 0 ? (s.revenue / s.spend).toFixed(2) : 0;
    
    attrSheet.appendRow([
      channel,
      s.spend,
      s.revenue,
      roas,
      'Last Touch (MVP)'
    ]);
  }
  
  log('Attribution calculation complete.');
}

/**
 * Update Dashboard Sheet
 */
function updateDashboard() {
  const dashSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.sheetNames.dashboard);
  if (!dashSheet) {
    log('Dashboard sheet not found');
    return;
  }
  // In a real scenario, this might update specific cells or refresh pivot tables
  dashSheet.getRange('C2').setValue(new Date()); // Last Updated
  log('Dashboard updated.');
}
