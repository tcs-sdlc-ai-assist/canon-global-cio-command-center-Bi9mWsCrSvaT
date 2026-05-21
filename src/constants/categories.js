import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from './piiConstants';

export const CHAT_CATEGORIES = Object.freeze({
  Q4_BOARD: 'q4_board',
  TCS_PARTNERSHIP: 'tcs_partnership',
  BUSINESS_VALUE: 'business_value',
  REGIONAL: 'regional',
  INNOVATION: 'innovation',
  SECURITY_RISK: 'security_risk',
});

export const CHAT_CATEGORY_LABELS = Object.freeze({
  [CHAT_CATEGORIES.Q4_BOARD]: 'Q4 Board Presentation',
  [CHAT_CATEGORIES.TCS_PARTNERSHIP]: 'TCS Partnership',
  [CHAT_CATEGORIES.BUSINESS_VALUE]: 'Business Value',
  [CHAT_CATEGORIES.REGIONAL]: 'Regional Performance',
  [CHAT_CATEGORIES.INNOVATION]: 'Innovation',
  [CHAT_CATEGORIES.SECURITY_RISK]: 'Security & Risk',
});

export const RESPONSE_TYPES = Object.freeze({
  STRATEGIC: 'strategic',
  OPERATIONAL: 'operational',
  FINANCIAL: 'financial',
  TECHNICAL: 'technical',
  REGIONAL: 'regional',
  INNOVATION: 'innovation',
  SECURITY: 'security',
  GENERAL: 'general',
});

export const RESPONSE_TYPE_LABELS = Object.freeze({
  [RESPONSE_TYPES.STRATEGIC]: 'Strategic',
  [RESPONSE_TYPES.OPERATIONAL]: 'Operational',
  [RESPONSE_TYPES.FINANCIAL]: 'Financial',
  [RESPONSE_TYPES.TECHNICAL]: 'Technical',
  [RESPONSE_TYPES.REGIONAL]: 'Regional',
  [RESPONSE_TYPES.INNOVATION]: 'Innovation',
  [RESPONSE_TYPES.SECURITY]: 'Security',
  [RESPONSE_TYPES.GENERAL]: 'General',
});

export const CATEGORY_RESPONSE_MAP = Object.freeze({
  [CHAT_CATEGORIES.Q4_BOARD]: RESPONSE_TYPES.STRATEGIC,
  [CHAT_CATEGORIES.TCS_PARTNERSHIP]: RESPONSE_TYPES.STRATEGIC,
  [CHAT_CATEGORIES.BUSINESS_VALUE]: RESPONSE_TYPES.FINANCIAL,
  [CHAT_CATEGORIES.REGIONAL]: RESPONSE_TYPES.REGIONAL,
  [CHAT_CATEGORIES.INNOVATION]: RESPONSE_TYPES.INNOVATION,
  [CHAT_CATEGORIES.SECURITY_RISK]: RESPONSE_TYPES.SECURITY,
});

export const CATEGORY_KEYWORDS = Object.freeze({
  [CHAT_CATEGORIES.Q4_BOARD]: [
    'q4 board',
    'board presentation',
    'board meeting',
    'executive summary',
    'quarterly review',
    'board deck',
    'board materials',
  ],
  [CHAT_CATEGORIES.TCS_PARTNERSHIP]: [
    'tcs',
    'tata consultancy',
    'tcs partnership',
    'strategic partner',
    'partner ecosystem',
    'system integrator',
  ],
  [CHAT_CATEGORIES.BUSINESS_VALUE]: [
    'business value',
    'roi',
    'return on investment',
    'cost savings',
    'revenue growth',
    'profitability',
    'bottom line',
    'financial impact',
  ],
  [CHAT_CATEGORIES.REGIONAL]: [
    'regional',
    'emea',
    'apac',
    'americas',
    'north america',
    'europe',
    'asia pacific',
    'latin america',
    'regional performance',
    'regional breakdown',
  ],
  [CHAT_CATEGORIES.INNOVATION]: [
    'innovation',
    'emerging tech',
    'ai',
    'artificial intelligence',
    'machine learning',
    'automation',
    'digital transformation',
    'r&d',
    'research',
    'future technology',
  ],
  [CHAT_CATEGORIES.SECURITY_RISK]: [
    'security',
    'risk',
    'cyber',
    'compliance',
    'vulnerability',
    'threat',
    'data protection',
    'gdpr',
    'breach',
    'incident response',
    'risk assessment',
  ],
});

export const ALL_CATEGORIES = Object.freeze(Object.values(CHAT_CATEGORIES));

export const ALL_RESPONSE_TYPES = Object.freeze(Object.values(RESPONSE_TYPES));