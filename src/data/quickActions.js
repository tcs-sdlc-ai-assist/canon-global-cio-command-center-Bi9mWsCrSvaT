import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../constants/piiConstants';

export const QUICK_ACTIONS = Object.freeze([
  {
    id: 'qa-q4-board',
    label: 'Q4 board presentation ready',
  },
  {
    id: 'qa-tcs-contract',
    label: 'TCS contract expansion analysis',
  },
  {
    id: 'qa-business-value',
    label: 'Business value impact summary',
  },
  {
    id: 'qa-regional-performance',
    label: 'Regional performance comparison',
  },
  {
    id: 'qa-innovation-pipeline',
    label: 'Innovation pipeline overview',
  },
  {
    id: 'qa-security-posture',
    label: 'Security posture assessment',
  },
  {
    id: 'qa-cost-avoidance',
    label: 'Cost avoidance breakdown',
  },
  {
    id: 'qa-digital-transformation',
    label: 'Digital transformation progress',
  },
]);

export const QUICK_ACTION_SECTION = 'quick-actions';

export function getQuickActionById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }
  return QUICK_ACTIONS.find(action => action.id === id) || null;
}

export function getQuickActionByLabel(label) {
  if (typeof label !== 'string' || label.length === 0) {
    return null;
  }
  return QUICK_ACTIONS.find(action => action.label === label) || null;
}

export function getAllQuickActionLabels() {
  return Object.freeze(QUICK_ACTIONS.map(action => action.label));
}