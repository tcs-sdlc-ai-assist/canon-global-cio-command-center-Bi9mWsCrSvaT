import { describe, it, expect } from 'vitest';
import { maskPII, maskObject } from '../piiMasker';
import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../../constants/piiConstants';

describe('maskPII', () => {
  describe('known PII values', () => {
    it('replaces "Martin de Weerdt" with [USER_NAME] placeholder', () => {
      const result = maskPII('Martin de Weerdt');
      expect(result).toBe('[USER_NAME]');
    });

    it('replaces "Global Chief Information Officer" with [USER_ROLE] placeholder', () => {
      const result = maskPII('Global Chief Information Officer');
      expect(result).toBe('[USER_ROLE]');
    });

    it('replaces "MW" with [USER_AVATAR] placeholder', () => {
      const result = maskPII('MW');
      expect(result).toBe('[USER_AVATAR]');
    });
  });

  describe('case sensitivity', () => {
    it('masks PII values regardless of case', () => {
      expect(maskPII('martin de weerdt')).toBe('[USER_NAME]');
      expect(maskPII('MARTIN DE WEERDT')).toBe('[USER_NAME]');
      expect(maskPII('global chief information officer')).toBe('[USER_ROLE]');
      expect(maskPII('mw')).toBe('[USER_AVATAR]');
    });

    it('masks PII values with mixed case', () => {
      expect(maskPII('Martin De Weerdt')).toBe('[USER_NAME]');
      expect(maskPII('Global Chief Information Officer')).toBe('[USER_ROLE]');
    });
  });

  describe('partial matches', () => {
    it('masks strings that contain PII values as substrings', () => {
      expect(maskPII('Hello Martin de Weerdt here')).toBe('[USER_NAME]');
      expect(maskPII('Role: Global Chief Information Officer at Canon')).toBe('[USER_ROLE]');
    });
  });

  describe('non-PII values', () => {
    it('returns non-PII strings unchanged', () => {
      expect(maskPII('strategic_command')).toBe('strategic_command');
      expect(maskPII('Q4 board presentation ready')).toBe('Q4 board presentation ready');
      expect(maskPII('quick-actions')).toBe('quick-actions');
      expect(maskPII('line')).toBe('line');
      expect(maskPII('hover')).toBe('hover');
    });

    it('returns common dashboard values unchanged', () => {
      expect(maskPII('navigation.tab.switch')).toBe('navigation.tab.switch');
      expect(maskPII('interaction.chip.click')).toBe('interaction.chip.click');
      expect(maskPII('chart.interaction')).toBe('chart.interaction');
      expect(maskPII('chat.event')).toBe('chat.event');
      expect(maskPII('export.action')).toBe('export.action');
    });
  });

  describe('edge cases', () => {
    it('returns empty string unchanged', () => {
      expect(maskPII('')).toBe('');
    });

    it('returns non-string values unchanged', () => {
      expect(maskPII(null)).toBe(null);
      expect(maskPII(undefined)).toBe(undefined);
      expect(maskPII(42)).toBe(42);
      expect(maskPII(0)).toBe(0);
      expect(maskPII(true)).toBe(true);
      expect(maskPII(false)).toBe(false);
      expect(maskPII(3.14)).toBe(3.14);
    });

    it('returns whitespace-only strings unchanged (no PII match)', () => {
      expect(maskPII('   ')).toBe('   ');
    });

    it('handles strings with special characters', () => {
      expect(maskPII('test@email.com')).toBe('test@email.com');
      expect(maskPII('https://example.com')).toBe('https://example.com');
    });
  });
});

describe('maskObject', () => {
  describe('known PII field names', () => {
    it('replaces user_name field value with placeholder regardless of content', () => {
      const input = { user_name: 'Martin de Weerdt' };
      const result = maskObject(input);
      expect(result.user_name).toBe('[USER_NAME]');
    });

    it('replaces user_role field value with placeholder regardless of content', () => {
      const input = { user_role: 'Global Chief Information Officer' };
      const result = maskObject(input);
      expect(result.user_role).toBe('[USER_ROLE]');
    });

    it('replaces user_avatar_initials field value with placeholder regardless of content', () => {
      const input = { user_avatar_initials: 'MW' };
      const result = maskObject(input);
      expect(result.user_avatar_initials).toBe('[USER_AVATAR]');
    });

    it('replaces PII field values even when the value is not the known PII literal', () => {
      const input = { user_name: 'Some Other Name' };
      const result = maskObject(input);
      expect(result.user_name).toBe('[USER_NAME]');
    });
  });

  describe('safe fields whitelist', () => {
    it('passes safe field values through unchanged when they do not contain PII', () => {
      const input = {
        tabId: 'strategic_command',
        eventType: 'navigation.tab.switch',
        label: 'Q4 board presentation ready',
        section: 'quick-actions',
        chartType: 'line',
        interaction: 'hover',
        category: 'q4_board',
        responseType: 'strategic',
        source: 'csv-export',
      };

      const result = maskObject(input);

      expect(result.tabId).toBe('strategic_command');
      expect(result.eventType).toBe('navigation.tab.switch');
      expect(result.label).toBe('Q4 board presentation ready');
      expect(result.section).toBe('quick-actions');
      expect(result.chartType).toBe('line');
      expect(result.interaction).toBe('hover');
      expect(result.category).toBe('q4_board');
      expect(result.responseType).toBe('strategic');
      expect(result.source).toBe('csv-export');
    });

    it('still masks PII values within safe fields', () => {
      const input = {
        label: 'Martin de Weerdt',
        section: 'Global Chief Information Officer',
      };

      const result = maskObject(input);

      expect(result.label).toBe('[USER_NAME]');
      expect(result.section).toBe('[USER_ROLE]');
    });
  });

  describe('unknown fields with string values', () => {
    it('masks PII values in unknown fields', () => {
      const input = {
        customField: 'Martin de Weerdt',
        anotherField: 'Global Chief Information Officer',
        initials: 'MW',
      };

      const result = maskObject(input);

      expect(result.customField).toBe('[USER_NAME]');
      expect(result.anotherField).toBe('[USER_ROLE]');
      expect(result.initials).toBe('[USER_AVATAR]');
    });

    it('passes non-PII values in unknown fields through unchanged', () => {
      const input = {
        customField: 'safe value',
        anotherField: 'another safe value',
      };

      const result = maskObject(input);

      expect(result.customField).toBe('safe value');
      expect(result.anotherField).toBe('another safe value');
    });
  });

  describe('nested objects', () => {
    it('recursively masks PII in nested objects', () => {
      const input = {
        meta: {
          user_name: 'Martin de Weerdt',
          safeField: 'hello',
        },
      };

      const result = maskObject(input);

      expect(result.meta.user_name).toBe('[USER_NAME]');
      expect(result.meta.safeField).toBe('hello');
    });

    it('handles deeply nested objects', () => {
      const input = {
        level1: {
          level2: {
            level3: {
              user_name: 'Martin de Weerdt',
              user_role: 'Global Chief Information Officer',
            },
          },
        },
      };

      const result = maskObject(input);

      expect(result.level1.level2.level3.user_name).toBe('[USER_NAME]');
      expect(result.level1.level2.level3.user_role).toBe('[USER_ROLE]');
    });

    it('masks PII values in nested objects even without known field names', () => {
      const input = {
        meta: {
          author: 'Martin de Weerdt',
          position: 'Global Chief Information Officer',
        },
      };

      const result = maskObject(input);

      expect(result.meta.author).toBe('[USER_NAME]');
      expect(result.meta.position).toBe('[USER_ROLE]');
    });
  });

  describe('arrays', () => {
    it('masks PII values within arrays', () => {
      const input = {
        items: ['Martin de Weerdt', 'safe-value', 'MW'],
      };

      const result = maskObject(input);

      expect(result.items[0]).toBe('[USER_NAME]');
      expect(result.items[1]).toBe('safe-value');
      expect(result.items[2]).toBe('[USER_AVATAR]');
    });

    it('handles arrays of objects', () => {
      const input = {
        users: [
          { user_name: 'Martin de Weerdt', role: 'admin' },
          { user_name: 'Another Person', role: 'user' },
        ],
      };

      const result = maskObject(input);

      expect(result.users[0].user_name).toBe('[USER_NAME]');
      expect(result.users[0].role).toBe('admin');
      expect(result.users[1].user_name).toBe('[USER_NAME]');
      expect(result.users[1].role).toBe('user');
    });

    it('returns array input as array output', () => {
      const input = [{ user_name: 'Martin de Weerdt' }, { tabId: 'test' }];
      const result = maskObject(input);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0].user_name).toBe('[USER_NAME]');
      expect(result[1].tabId).toBe('test');
    });
  });

  describe('non-object inputs', () => {
    it('returns null unchanged', () => {
      expect(maskObject(null)).toBe(null);
    });

    it('returns undefined unchanged', () => {
      expect(maskObject(undefined)).toBe(undefined);
    });

    it('returns numbers unchanged', () => {
      expect(maskObject(42)).toBe(42);
    });

    it('returns strings unchanged', () => {
      expect(maskObject('test')).toBe('test');
    });

    it('returns booleans unchanged', () => {
      expect(maskObject(true)).toBe(true);
      expect(maskObject(false)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('does not mutate the original object', () => {
      const input = {
        user_name: 'Martin de Weerdt',
        tabId: 'strategic_command',
        meta: { nested: 'value' },
      };

      const originalInput = JSON.parse(JSON.stringify(input));
      maskObject(input);

      expect(input).toEqual(originalInput);
    });

    it('returns a new object reference', () => {
      const input = { tabId: 'test' };
      const result = maskObject(input);

      expect(result).not.toBe(input);
    });
  });

  describe('all three PII fields simultaneously', () => {
    it('masks all three PII fields in a single object', () => {
      const input = {
        user_name: 'Martin de Weerdt',
        user_role: 'Global Chief Information Officer',
        user_avatar_initials: 'MW',
        safeField: 'untouched',
      };

      const result = maskObject(input);

      expect(result.user_name).toBe('[USER_NAME]');
      expect(result.user_role).toBe('[USER_ROLE]');
      expect(result.user_avatar_initials).toBe('[USER_AVATAR]');
      expect(result.safeField).toBe('untouched');
    });
  });

  describe('non-string primitive values', () => {
    it('passes numbers through unchanged', () => {
      const input = { count: 42, ratio: 3.14, zero: 0 };
      const result = maskObject(input);

      expect(result.count).toBe(42);
      expect(result.ratio).toBe(3.14);
      expect(result.zero).toBe(0);
    });

    it('passes booleans through unchanged', () => {
      const input = { active: true, disabled: false };
      const result = maskObject(input);

      expect(result.active).toBe(true);
      expect(result.disabled).toBe(false);
    });

    it('passes null values through unchanged', () => {
      const input = { value: null, other: 'safe' };
      const result = maskObject(input);

      expect(result.value).toBe(null);
      expect(result.other).toBe('safe');
    });
  });

  describe('empty objects', () => {
    it('returns an empty object for empty input', () => {
      const result = maskObject({});
      expect(result).toEqual({});
    });

    it('returns an empty array for empty array input', () => {
      const result = maskObject([]);
      expect(result).toEqual([]);
    });
  });
});