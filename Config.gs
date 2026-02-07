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
      baseUrl: 'https://googleads.googleapis.com/v18/customers',
      maxRetries: 3
    },
    facebook: {
      baseUrl: 'https://graph.facebook.com/v21.0',
      maxRetries: 3
    },
    naverAds: {
      baseUrl: 'https://api.searchad.naver.com',
      maxRetries: 3
    }
  },
  
  slack: {
    get webhookUrl() {
      return getProperty('SLACK_WEBHOOK_URL');
    }
  },

  // Daily processing limit to avoid timeouts
  // Google Apps Script limit is 6 minutes
  timeLimit: 300, // 5 minutes (seconds)

  /** @type {number|null} Execution start time (set by main) */
  startTime: null
};

/**
 * Get Script Property by key
 * @param {string} key - Property key name
 * @returns {string|null} Property value or null if not found
 */
function getProperty(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

/**
 * Log message to Logger
 * @param {string} message - Message to log
 */
function log(message) {
  Logger.log(new Date().toISOString() + ': ' + message);
}

/**
 * Check if execution is approaching the time limit
 * @returns {boolean} true if time limit is near
 */
function isTimeLimitNear() {
  if (!CONFIG.startTime) return false;
  return (Date.now() - CONFIG.startTime) > CONFIG.timeLimit * 1000;
}
