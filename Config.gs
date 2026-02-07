/**
 * Configuration for MarketingROI Tracker
 */

const CONFIG = {
  sheetNames: {
    rawData: 'Raw Data',
    attribution: 'Attribution',
    dashboard: 'Dashboard',
    config: 'Config'
  },
  
  api: {
    googleAds: {
      baseUrl: 'https://googleads.googleapis.com/v15/customers',
      maxRetries: 3
    },
    facebook: {
      baseUrl: 'https://graph.facebook.com/v18.0',
      maxRetries: 3
    },
    naverAds: {
      baseUrl: 'https://api.searchad.naver.com',
      maxRetries: 3
    }
  },
  
  slack: {
    webhookUrl: PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL')
  },

  // Daily processing limit to avoid timeouts
  // Google Apps Script limit is 6 minutes
  timeLimit: 300 // 5 minutes
};

/**
 * Get Script Property by key
 */
function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

/**
 * Log message to Logger and Config Sheet (optional)
 */
function log(message) {
  Logger.log(new Date().toISOString() + ': ' + message);
  // Optional: append to Log sheet
}
