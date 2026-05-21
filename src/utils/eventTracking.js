import { maskObject } from './piiMasker';
import {
  LOG_PREFIX,
  LOG_LEVELS,
  EVENT_TYPES,
  TRACKING_CONFIG,
  isValidEventType,
} from '../constants/trackingConfig';

function _validateEventType(eventType) {
  if (!isValidEventType(eventType)) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | Invalid eventType received: "${eventType}" (expected one of: ${Object.values(EVENT_TYPES).join(', ')})`
      );
    }
    return false;
  }
  return true;
}

function _validatePayload(payload) {
  if (typeof payload !== 'object' || payload === null) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | payload must be an object, got: ${typeof payload}`
      );
    }
    return {};
  }
  return payload;
}

function _sanitizeAndLog(eventType, payload = {}) {
  if (!TRACKING_CONFIG.enabled) {
    return;
  }

  if (!_validateEventType(eventType)) {
    return;
  }

  const validPayload = _validatePayload(payload);
  const sanitized = maskObject(validPayload);

  if (TRACKING_CONFIG.includeTimestamp) {
    sanitized.timestamp = new Date().toISOString();
  }

  const logLevel = TRACKING_CONFIG.defaultLogLevel || LOG_LEVELS.INFO;

  if (logLevel === LOG_LEVELS.ERROR) {
    console.error(`${LOG_PREFIX} ${eventType} | ${JSON.stringify(sanitized)}`);
  } else if (logLevel === LOG_LEVELS.WARN) {
    console.warn(`${LOG_PREFIX} ${eventType} | ${JSON.stringify(sanitized)}`);
  } else {
    console.log(`${LOG_PREFIX} ${eventType} | ${JSON.stringify(sanitized)}`);
  }
}

/**
 * Core tracking function. All domain-specific trackers delegate to this.
 * Applies PII masking automatically before logging.
 *
 * @param {string} eventType - Dot-notation event category (e.g., 'navigation.tab.switch')
 * @param {Object} [payload={}] - Flat key-value object with event details
 * @returns {void}
 */
export function track(eventType, payload = {}) {
  _sanitizeAndLog(eventType, payload);
}

/**
 * Track a tab switch event.
 *
 * @param {string} tabId - The tab identifier (e.g., 'strategic_command')
 * @returns {void}
 */
export function trackTabSwitch(tabId) {
  if (typeof tabId !== 'string' || tabId.trim().length === 0) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | trackTabSwitch called with invalid tabId: "${tabId}"`
      );
    }
  }
  track(EVENT_TYPES.NAVIGATION_TAB_SWITCH, { tabId });
}

/**
 * Track an action chip click.
 *
 * @param {string} label - The chip's text label
 * @param {string} section - Originating section (e.g., 'strategic-priorities', 'executive-actions')
 * @returns {void}
 */
export function trackChipClick(label, section) {
  if (typeof label !== 'string' || label.trim().length === 0) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | trackChipClick called with empty label`
      );
    }
  }
  if (typeof section !== 'string' || section.trim().length === 0) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | trackChipClick called with empty section`
      );
    }
  }
  track(EVENT_TYPES.INTERACTION_CHIP_CLICK, { label, section });
}

/**
 * Track a chart interaction (hover, legend toggle, render, etc.).
 *
 * @param {string} chartType - Chart type (e.g., 'line', 'bar', 'radar', 'doughnut', 'composed')
 * @param {string} interaction - Interaction type (e.g., 'hover', 'legend-toggle', 'render')
 * @returns {void}
 */
export function trackChartInteraction(chartType, interaction) {
  if (typeof chartType !== 'string' || chartType.trim().length === 0) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | trackChartInteraction called with empty chartType`
      );
    }
  }
  if (typeof interaction !== 'string' || interaction.trim().length === 0) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | trackChartInteraction called with empty interaction`
      );
    }
  }
  track(EVENT_TYPES.CHART_INTERACTION, { chartType, interaction });
}

/**
 * Track an AI chat event.
 *
 * @param {string} eventType - 'open', 'close', 'question', 'response'
 * @param {Object} [metadata={}] - Additional details (e.g., { category: 'q4_board', responseType: 'strategic' })
 * @returns {void}
 */
export function trackChatEvent(eventType, metadata = {}) {
  if (typeof eventType !== 'string' || eventType.trim().length === 0) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | trackChatEvent called with empty eventType`
      );
    }
  }
  const payload = typeof metadata === 'object' && metadata !== null
    ? { eventType, ...metadata }
    : { eventType };
  track(EVENT_TYPES.CHAT_EVENT, payload);
}

/**
 * Track an export or predictive analysis action.
 *
 * @param {string} source - Source identifier (e.g., 'csv-export', 'predictive-analysis')
 * @returns {void}
 */
export function trackExport(source) {
  if (typeof source !== 'string' || source.trim().length === 0) {
    if (TRACKING_CONFIG.enabled) {
      console.warn(
        `${LOG_PREFIX} ${LOG_LEVELS.WARN} | trackExport called with empty source`
      );
    }
  }
  track(EVENT_TYPES.EXPORT_ACTION, { source });
}