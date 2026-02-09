/**
 * Automated Reporting & Anomaly Detection
 */

/**
 * Detect ROAS anomalies using Z-score and alert via Slack
 * Called after updateDashboard() in main()
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [ss] - Spreadsheet instance (optional)
 */
function detectAnomalies(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
  if (!rawSheet || rawSheet.getLastRow() <= 1) return;

  const data = rawSheet.getDataRange().getValues();
  const rows = data.slice(1);

  // Group daily ROAS by channel
  const dailyRoas = {};
  const dailyData = {};

  rows.forEach(function(row) {
    const dateStr = String(row[0]);
    const channel = row[1];
    const cost = parseFloat(row[3]) || 0;
    const revenue = parseFloat(row[7]) || 0;
    const key = dateStr + '|' + channel;

    if (!dailyData[key]) dailyData[key] = { cost: 0, revenue: 0 };
    dailyData[key].cost += cost;
    dailyData[key].revenue += revenue;
  });

  // Build per-channel ROAS time series
  const channelSeries = {};
  Object.keys(dailyData).forEach(function(key) {
    const parts = key.split('|');
    const channel = parts[1];
    const d = dailyData[key];
    const roas = d.cost > 0 ? d.revenue / d.cost : 0;

    if (!channelSeries[channel]) channelSeries[channel] = [];
    channelSeries[channel].push({ date: parts[0], roas: roas });
  });

  // Detect anomalies on the most recent day
  const alerts = [];
  const threshold = CONFIG.anomaly.zScoreThreshold;

  Object.keys(channelSeries).forEach(function(channel) {
    const series = channelSeries[channel].sort(function(a, b) {
      return a.date < b.date ? -1 : 1;
    });

    if (series.length < CONFIG.anomaly.minDataPoints) return;

    const latestDay = series[series.length - 1];
    const historicalWindow = series.slice(0, -1).slice(-CONFIG.anomaly.lookbackDays);

    if (historicalWindow.length < CONFIG.anomaly.minDataPoints) return;

    const values = historicalWindow.map(function(d) { return d.roas; });
    const mean = values.reduce(function(a, b) { return a + b; }, 0) / values.length;
    const variance = values.reduce(function(a, b) { return a + Math.pow(b - mean, 2); }, 0) / values.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return;

    const zScore = (latestDay.roas - mean) / stdDev;

    if (Math.abs(zScore) >= threshold) {
      const direction = zScore > 0 ? 'above' : 'below';
      const roundedZ = Math.round(zScore * 100) / 100;
      const roundedRoas = Math.round(latestDay.roas * 100) / 100;
      const roundedMean = Math.round(mean * 100) / 100;

      alerts.push({
        channel: channel,
        date: latestDay.date,
        roas: roundedRoas,
        mean: roundedMean,
        zScore: roundedZ,
        direction: direction
      });
    }
  });

  if (alerts.length > 0) {
    const message = formatAnomalyAlert(alerts);
    notifySlack(message);
    log('Anomaly detected: ' + alerts.length + ' alert(s) sent to Slack');
  } else {
    log('No anomalies detected');
  }
}

/**
 * Format anomaly alerts into a Slack message
 * @param {Array<Object>} alerts - Array of anomaly objects
 * @returns {string} Formatted message
 */
function formatAnomalyAlert(alerts) {
  let msg = '--- ANOMALY ALERT ---\n';

  alerts.forEach(function(a) {
    const icon = a.direction === 'above' ? '[UP]' : '[DOWN]';
    msg += icon + ' ' + a.channel + ': ROAS ' + a.roas +
      ' (avg ' + a.mean + ', Z=' + a.zScore + ') on ' + a.date + '\n';
  });

  msg += '\nAction: Review ' + (alerts.length === 1 ? 'this channel' : 'these channels') + ' for unusual activity.';
  return msg;
}

/**
 * Generate and send weekly performance report to Slack
 * Intended to be triggered weekly via time-driven trigger
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} [ss] - Spreadsheet instance (optional)
 */
function generateWeeklyReport(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(CONFIG.sheetNames.rawData);
  if (!rawSheet || rawSheet.getLastRow() <= 1) {
    log('No data for weekly report');
    return;
  }

  const data = rawSheet.getDataRange().getValues();
  const rows = data.slice(1);

  // Determine this week and last week date ranges
  const today = new Date();
  const thisWeekEnd = Utilities.formatDate(today, 'Asia/Seoul', 'yyyy-MM-dd');
  const thisWeekStart = Utilities.formatDate(
    new Date(today.getTime() - 6 * 86400000), 'Asia/Seoul', 'yyyy-MM-dd');
  const lastWeekEnd = Utilities.formatDate(
    new Date(today.getTime() - 7 * 86400000), 'Asia/Seoul', 'yyyy-MM-dd');
  const lastWeekStart = Utilities.formatDate(
    new Date(today.getTime() - 13 * 86400000), 'Asia/Seoul', 'yyyy-MM-dd');

  const thisWeek = aggregatePeriod(rows, thisWeekStart, thisWeekEnd);
  const lastWeek = aggregatePeriod(rows, lastWeekStart, lastWeekEnd);

  const report = formatWeeklyReport(thisWeek, lastWeek, thisWeekStart, thisWeekEnd);

  notifySlack(report);
  log('Weekly report sent to Slack');
}

/**
 * Aggregate metrics for a date range
 * @param {Array} rows - Raw data rows
 * @param {string} startDate - Start date (yyyy-MM-dd)
 * @param {string} endDate - End date (yyyy-MM-dd)
 * @returns {Object} Aggregated stats by channel and total
 */
function aggregatePeriod(rows, startDate, endDate) {
  const channels = {};
  const total = { spend: 0, revenue: 0, conversions: 0, impressions: 0, clicks: 0 };

  rows.forEach(function(row) {
    const dateStr = String(row[0]);
    if (dateStr < startDate || dateStr > endDate) return;

    const channel = row[1];
    const cost = parseFloat(row[3]) || 0;
    const impressions = parseFloat(row[4]) || 0;
    const clicks = parseFloat(row[5]) || 0;
    const conversions = parseFloat(row[6]) || 0;
    const revenue = parseFloat(row[7]) || 0;

    if (!channels[channel]) {
      channels[channel] = { spend: 0, revenue: 0, conversions: 0, impressions: 0, clicks: 0 };
    }
    channels[channel].spend += cost;
    channels[channel].revenue += revenue;
    channels[channel].conversions += conversions;
    channels[channel].impressions += impressions;
    channels[channel].clicks += clicks;

    total.spend += cost;
    total.revenue += revenue;
    total.conversions += conversions;
    total.impressions += impressions;
    total.clicks += clicks;
  });

  total.roas = total.spend > 0 ? Math.round((total.revenue / total.spend) * 100) / 100 : 0;

  Object.keys(channels).forEach(function(ch) {
    channels[ch].roas = channels[ch].spend > 0
      ? Math.round((channels[ch].revenue / channels[ch].spend) * 100) / 100 : 0;
  });

  return { channels: channels, total: total };
}

/**
 * Format weekly report as a readable Slack message
 * @param {Object} thisWeek - This week's aggregated data
 * @param {Object} lastWeek - Last week's aggregated data
 * @param {string} startDate - Report start date
 * @param {string} endDate - Report end date
 * @returns {string} Formatted report message
 */
function formatWeeklyReport(thisWeek, lastWeek, startDate, endDate) {
  const tw = thisWeek.total;
  const lw = lastWeek.total;

  let msg = '--- WEEKLY REPORT (' + startDate + ' ~ ' + endDate + ') ---\n\n';

  // Overall summary
  msg += 'OVERALL:\n';
  msg += '  Spend: $' + formatNum(tw.spend) + ' (' + changeStr(tw.spend, lw.spend) + ')\n';
  msg += '  Revenue: $' + formatNum(tw.revenue) + ' (' + changeStr(tw.revenue, lw.revenue) + ')\n';
  msg += '  ROAS: ' + tw.roas + ' (' + changeStr(tw.roas, lw.roas) + ')\n';
  msg += '  Conversions: ' + Math.round(tw.conversions) + ' (' + changeStr(tw.conversions, lw.conversions) + ')\n';
  msg += '\n';

  // Per-channel summary
  msg += 'BY CHANNEL:\n';
  const channelNames = Object.keys(thisWeek.channels).sort(function(a, b) {
    return (thisWeek.channels[b].roas || 0) - (thisWeek.channels[a].roas || 0);
  });

  channelNames.forEach(function(ch) {
    const c = thisWeek.channels[ch];
    const prev = lastWeek.channels[ch] || { spend: 0, revenue: 0, roas: 0 };
    msg += '  ' + ch + ': ROAS ' + c.roas + ' (' + changeStr(c.roas, prev.roas) + ')' +
      ' | $' + formatNum(c.spend) + ' spend | $' + formatNum(c.revenue) + ' rev\n';
  });

  // Best & worst
  if (channelNames.length > 0) {
    msg += '\n';
    msg += 'Best: ' + channelNames[0] + ' (ROAS ' + thisWeek.channels[channelNames[0]].roas + ')\n';
    const worst = channelNames[channelNames.length - 1];
    msg += 'Needs attention: ' + worst + ' (ROAS ' + thisWeek.channels[worst].roas + ')\n';
  }

  return msg;
}

/**
 * Format number with comma separator
 * @param {number} n
 * @returns {string}
 */
function formatNum(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Calculate and format week-over-week change
 * @param {number} current
 * @param {number} previous
 * @returns {string} Formatted change string like "+12.5%" or "-3.2%"
 */
function changeStr(current, previous) {
  if (!previous || previous === 0) return 'N/A';
  const pct = Math.round(((current - previous) / previous) * 1000) / 10;
  const sign = pct >= 0 ? '+' : '';
  return sign + pct + '%';
}
