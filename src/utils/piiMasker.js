import { PII_REPLACEMENT_MAP, PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../constants/piiConstants';

function _isPIIValue(value) {
  if (typeof value !== 'string') return false;

  const lowerValue = value.toLowerCase();

  for (const piiValue of PII_VALUES) {
    if (lowerValue.includes(piiValue.toLowerCase())) {
      return true;
    }
  }

  return false;
}

function _getPlaceholderForValue(value) {
  if (typeof value !== 'string') return null;

  const lowerValue = value.toLowerCase();

  for (const [field, placeholder] of Object.entries(PII_REPLACEMENT_MAP)) {
    if (lowerValue.includes(field.toLowerCase())) {
      return placeholder;
    }
  }

  return null;
}

function _getPlaceholderForField(fieldName) {
  if (typeof fieldName !== 'string') return null;

  if (PII_FIELDS.hasOwnProperty(fieldName)) {
    return PII_FIELDS[fieldName];
  }

  return null;
}

export function maskPII(value) {
  if (typeof value !== 'string') return value;

  if (_isPIIValue(value)) {
    const placeholder = _getPlaceholderForValue(value);
    if (placeholder) {
      return placeholder;
    }
    return '[REDACTED]';
  }

  return value;
}

export function maskObject(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => maskObject(item));
  }

  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const fieldPlaceholder = _getPlaceholderForField(key);

    if (fieldPlaceholder) {
      result[key] = fieldPlaceholder;
    } else if (SAFE_FIELDS.includes(key)) {
      if (typeof value === 'string') {
        result[key] = maskPII(value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = maskObject(value);
      } else {
        result[key] = value;
      }
    } else if (typeof value === 'object' && value !== null) {
      result[key] = maskObject(value);
    } else if (typeof value === 'string') {
      result[key] = maskPII(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}