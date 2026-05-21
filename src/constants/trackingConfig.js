import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from './piiConstants';

export const LOG_PREFIX = '[CIO-Track]';

export const LOG_LEVELS = Object.freeze({
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
});

export const EVENT_TYPES = Object.freeze({
  NAVIGATION_TAB_SWITCH: 'navigation.tab.switch',
  INTERACTION_CHIP_CLICK: 'interaction.chip.click',
  CHART_INTERACTION: 'chart.interaction',
  CHAT_EVENT: 'chat.event',
  EXPORT_ACTION: 'export.action',
});

export const EVENT_CATEGORIES = Object.freeze({
  NAVIGATION: 'navigation',
  INTERACTION: 'interaction',
  CHART: 'chart',
  CHAT: 'chat',
  EXPORT: 'export',
});

export const TRACKING_CONFIG = Object.freeze({
  enabled: true,
  logPrefix: LOG_PREFIX,
  defaultLogLevel: LOG_LEVELS.INFO,
  includeTimestamp: true,
  maskPII: true,
  validateEventTypes: true,
});

export const EVENT_FORMAT_TEMPLATE = Object.freeze({
  prefix: LOG_PREFIX,
  separator: ' | ',
  timestampField: 'timestamp',
  timestampFormat: 'iso8601',
});

export const VALID_EVENT_TYPES = Object.freeze(Object.values(EVENT_TYPES));

export function isValidEventType(eventType) {
  if (typeof eventType !== 'string' || eventType.trim().length === 0) {
    return false;
  }
  return VALID_EVENT_TYPES.includes(eventType);
}

export function getEventCategory(eventType) {
  if (!isValidEventType(eventType)) {
    return null;
  }
  const category = eventType.split('.')[0];
  return Object.values(EVENT_CATEGORIES).includes(category) ? category : null;
}