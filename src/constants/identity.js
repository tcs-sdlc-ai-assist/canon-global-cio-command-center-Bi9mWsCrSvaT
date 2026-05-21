import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from './piiConstants';

export const BRAND_NAME = 'Canon';

export const BRAND_SUBTITLE = 'global cio command center';

export const USER_NAME = 'Martin de Weerdt';

export const USER_ROLE = 'Global Chief Information Officer';

export const USER_AVATAR_INITIALS = 'MW';

export const DEFAULT_NOTIFICATION_COUNT = 3;

export const USER_IDENTITY = Object.freeze({
  name: USER_NAME,
  role: USER_ROLE,
  avatarInitials: USER_AVATAR_INITIALS,
});

export const BRAND_CONFIG = Object.freeze({
  name: BRAND_NAME,
  subtitle: BRAND_SUBTITLE,
});

export const NOTIFICATION_CONFIG = Object.freeze({
  defaultCount: DEFAULT_NOTIFICATION_COUNT,
  maxDisplay: 99,
  maxDisplaySuffix: '99+',
});