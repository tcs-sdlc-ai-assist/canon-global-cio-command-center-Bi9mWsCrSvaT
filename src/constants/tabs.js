import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from './piiConstants';

export const TAB_IDS = Object.freeze({
  STRATEGIC_COMMAND: 'strategic_command',
  EXECUTIVE_SUMMARY: 'executive_summary',
  BUSINESS_IMPACT: 'business_impact',
  OPERATIONS: 'operations',
  RISK_GOVERNANCE: 'risk_governance',
  INNOVATION: 'innovation',
  PARTNERSHIPS: 'partnerships',
});

export const VALID_TAB_IDS = Object.freeze(Object.values(TAB_IDS));

export function isValidTabId(tabId) {
  if (typeof tabId !== 'string' || tabId.length === 0) {
    return false;
  }
  return VALID_TAB_IDS.includes(tabId);
}

export const TAB_CONFIG = Object.freeze([
  {
    id: TAB_IDS.STRATEGIC_COMMAND,
    label: 'Strategic Command',
    order: 0,
  },
  {
    id: TAB_IDS.EXECUTIVE_SUMMARY,
    label: 'Executive Summary',
    order: 1,
  },
  {
    id: TAB_IDS.BUSINESS_IMPACT,
    label: 'Business Impact',
    order: 2,
  },
  {
    id: TAB_IDS.OPERATIONS,
    label: 'Operations',
    order: 3,
  },
  {
    id: TAB_IDS.RISK_GOVERNANCE,
    label: 'Risk & Governance',
    order: 4,
  },
  {
    id: TAB_IDS.INNOVATION,
    label: 'Innovation',
    order: 5,
  },
  {
    id: TAB_IDS.PARTNERSHIPS,
    label: 'Partnerships',
    order: 6,
  },
]);

export const STORAGE_KEYS = Object.freeze({
  ACTIVE_TAB: 'cio_dashboard_active_tab',
});

export const DEFAULT_TAB = TAB_IDS.STRATEGIC_COMMAND;

export const USER_IDENTITY = Object.freeze({
  name: 'Martin de Weerdt',
  role: 'Global Chief Information Officer',
  avatarInitials: 'MW',
});

export const DEFAULT_NOTIFICATION_COUNT = 3;