import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  track,
  trackTabSwitch,
  trackChipClick,
  trackChartInteraction,
  trackChatEvent,
  trackExport,
} from '../eventTracking';
import { EVENT_TYPES } from '../../constants/trackingConfig';

const LOG_PREFIX = '[CIO-Track]';

describe('eventTracking', () => {
  let consoleLogSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  function getLoggedPayload() {
    if (consoleLogSpy.mock.calls.length === 0) {
      return null;
    }

    const callArgs = consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1];
    const logMessage = callArgs[0];

    if (typeof logMessage !== 'string') {
      return null;
    }

    const pipeIndex = logMessage.indexOf(' | ');
    if (pipeIndex === -1) {
      return null;
    }

    const jsonString = logMessage.substring(pipeIndex + 3);
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  }

  function getLastLogMessage() {
    if (consoleLogSpy.mock.calls.length === 0) {
      return null;
    }
    return consoleLogSpy.mock.calls[consoleLogSpy.mock.calls.length - 1][0];
  }

  describe('track', () => {
    it('logs a message with the correct prefix and event type', () => {
      track('test.event', { key: 'value' });

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const message = getLastLogMessage();
      expect(message).toContain(LOG_PREFIX);
      expect(message).toContain('test.event');
    });

    it('includes a timestamp in the logged payload', () => {
      track('test.event', { key: 'value' });

      const payload = getLoggedPayload();
      expect(payload).toBeDefined();
      expect(payload.timestamp).toBeDefined();
      expect(typeof payload.timestamp).toBe('string');
      expect(() => new Date(payload.timestamp)).not.toThrow();
    });

    it('includes all original payload keys in the logged output', () => {
      track('test.event', { key1: 'value1', key2: 'value2' });

      const payload = getLoggedPayload();
      expect(payload.key1).toBe('value1');
      expect(payload.key2).toBe('value2');
    });

    it('masks PII values in the payload before logging', () => {
      track('test.event', {
        user_name: 'Martin de Weerdt',
        tabId: 'strategic_command',
      });

      const payload = getLoggedPayload();
      expect(payload.user_name).toBe('[USER_NAME]');
      expect(payload.tabId).toBe('strategic_command');
    });

    it('masks user_role PII value', () => {
      track('test.event', {
        user_role: 'Global Chief Information Officer',
      });

      const payload = getLoggedPayload();
      expect(payload.user_role).toBe('[USER_ROLE]');
    });

    it('masks user_avatar_initials PII value', () => {
      track('test.event', {
        user_avatar_initials: 'MW',
      });

      const payload = getLoggedPayload();
      expect(payload.user_avatar_initials).toBe('[USER_AVATAR]');
    });

    it('masks PII values even when field names are not recognized', () => {
      track('test.event', {
        customField: 'Martin de Weerdt',
      });

      const payload = getLoggedPayload();
      expect(payload.customField).toBe('[USER_NAME]');
    });

    it('passes non-PII string values through unchanged', () => {
      track('test.event', {
        label: 'Q4 board presentation ready',
        section: 'quick-actions',
        chartType: 'line',
      });

      const payload = getLoggedPayload();
      expect(payload.label).toBe('Q4 board presentation ready');
      expect(payload.section).toBe('quick-actions');
      expect(payload.chartType).toBe('line');
    });

    it('handles empty payload by defaulting to an empty object', () => {
      track('test.event');

      const payload = getLoggedPayload();
      expect(payload).toBeDefined();
      expect(payload.timestamp).toBeDefined();
    });

    it('handles null payload by defaulting to an empty object', () => {
      track('test.event', null);

      expect(consoleWarnSpy).toHaveBeenCalled();
      const payload = getLoggedPayload();
      expect(payload).toBeDefined();
      expect(payload.timestamp).toBeDefined();
    });

    it('handles non-object payload by defaulting to an empty object', () => {
      track('test.event', 'invalid');

      expect(consoleWarnSpy).toHaveBeenCalled();
      const payload = getLoggedPayload();
      expect(payload).toBeDefined();
      expect(payload.timestamp).toBeDefined();
    });

    it('warns and does not log when eventType is an empty string', () => {
      track('', { key: 'value' });

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('warns and does not log when eventType is only whitespace', () => {
      track('   ', { key: 'value' });

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('handles payload with nested objects by masking PII recursively', () => {
      track('test.event', {
        meta: {
          user_name: 'Martin de Weerdt',
          safeField: 'hello',
        },
      });

      const payload = getLoggedPayload();
      expect(payload.meta.user_name).toBe('[USER_NAME]');
      expect(payload.meta.safeField).toBe('hello');
    });

    it('handles payload with arrays', () => {
      track('test.event', {
        items: ['Martin de Weerdt', 'safe-value'],
      });

      const payload = getLoggedPayload();
      expect(payload.items[0]).toBe('[USER_NAME]');
      expect(payload.items[1]).toBe('safe-value');
    });

    it('handles numeric and boolean payload values unchanged', () => {
      track('test.event', {
        count: 42,
        active: true,
        ratio: 3.14,
      });

      const payload = getLoggedPayload();
      expect(payload.count).toBe(42);
      expect(payload.active).toBe(true);
      expect(payload.ratio).toBe(3.14);
    });
  });

  describe('trackTabSwitch', () => {
    it('logs a navigation.tab.switch event with the tabId', () => {
      trackTabSwitch('strategic_command');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const message = getLastLogMessage();
      expect(message).toContain(EVENT_TYPES.NAVIGATION_TAB_SWITCH);

      const payload = getLoggedPayload();
      expect(payload.tabId).toBe('strategic_command');
    });

    it('still logs when tabId is an empty string with a warning', () => {
      trackTabSwitch('');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('includes a timestamp in the logged payload', () => {
      trackTabSwitch('executive_summary');

      const payload = getLoggedPayload();
      expect(payload.timestamp).toBeDefined();
    });
  });

  describe('trackChipClick', () => {
    it('logs an interaction.chip.click event with label and section', () => {
      trackChipClick('Q4 board presentation ready', 'quick-actions');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const message = getLastLogMessage();
      expect(message).toContain(EVENT_TYPES.INTERACTION_CHIP_CLICK);

      const payload = getLoggedPayload();
      expect(payload.label).toBe('Q4 board presentation ready');
      expect(payload.section).toBe('quick-actions');
    });

    it('warns when label is empty', () => {
      trackChipClick('', 'quick-actions');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('warns when section is empty', () => {
      trackChipClick('test label', '');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('includes a timestamp in the logged payload', () => {
      trackChipClick('test', 'test-section');

      const payload = getLoggedPayload();
      expect(payload.timestamp).toBeDefined();
    });
  });

  describe('trackChartInteraction', () => {
    it('logs a chart.interaction event with chartType and interaction', () => {
      trackChartInteraction('line', 'hover');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const message = getLastLogMessage();
      expect(message).toContain(EVENT_TYPES.CHART_INTERACTION);

      const payload = getLoggedPayload();
      expect(payload.chartType).toBe('line');
      expect(payload.interaction).toBe('hover');
    });

    it('warns when chartType is empty', () => {
      trackChartInteraction('', 'hover');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('warns when interaction is empty', () => {
      trackChartInteraction('bar', '');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('handles legend-toggle interaction', () => {
      trackChartInteraction('doughnut', 'legend-toggle:emea');

      const payload = getLoggedPayload();
      expect(payload.chartType).toBe('doughnut');
      expect(payload.interaction).toBe('legend-toggle:emea');
    });

    it('includes a timestamp in the logged payload', () => {
      trackChartInteraction('radar', 'hover');

      const payload = getLoggedPayload();
      expect(payload.timestamp).toBeDefined();
    });
  });

  describe('trackChatEvent', () => {
    it('logs a chat.event with the eventType', () => {
      trackChatEvent('open');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const message = getLastLogMessage();
      expect(message).toContain(EVENT_TYPES.CHAT_EVENT);

      const payload = getLoggedPayload();
      expect(payload.eventType).toBe('open');
    });

    it('includes metadata in the payload when provided', () => {
      trackChatEvent('response', { category: 'q4_board', responseType: 'strategic' });

      const payload = getLoggedPayload();
      expect(payload.eventType).toBe('response');
      expect(payload.category).toBe('q4_board');
      expect(payload.responseType).toBe('strategic');
    });

    it('handles empty metadata object', () => {
      trackChatEvent('close', {});

      const payload = getLoggedPayload();
      expect(payload.eventType).toBe('close');
    });

    it('handles null metadata by defaulting to empty object', () => {
      trackChatEvent('question', null);

      const payload = getLoggedPayload();
      expect(payload.eventType).toBe('question');
    });

    it('warns when eventType is empty', () => {
      trackChatEvent('');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('includes a timestamp in the logged payload', () => {
      trackChatEvent('open');

      const payload = getLoggedPayload();
      expect(payload.timestamp).toBeDefined();
    });
  });

  describe('trackExport', () => {
    it('logs an export.action event with the source', () => {
      trackExport('csv-export');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      const message = getLastLogMessage();
      expect(message).toContain(EVENT_TYPES.EXPORT_ACTION);

      const payload = getLoggedPayload();
      expect(payload.source).toBe('csv-export');
    });

    it('handles predictive-analysis source', () => {
      trackExport('predictive-analysis');

      const payload = getLoggedPayload();
      expect(payload.source).toBe('predictive-analysis');
    });

    it('warns when source is empty', () => {
      trackExport('');

      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('includes a timestamp in the logged payload', () => {
      trackExport('csv-export:strategic-performance-trends');

      const payload = getLoggedPayload();
      expect(payload.timestamp).toBeDefined();
    });
  });

  describe('PII masking across all trackers', () => {
    it('masks user_name in trackTabSwitch payload', () => {
      trackTabSwitch('strategic_command');

      const payload = getLoggedPayload();
      expect(payload.user_name).toBeUndefined();
    });

    it('masks PII in trackChipClick when label contains PII', () => {
      trackChipClick('Martin de Weerdt', 'test-section');

      const payload = getLoggedPayload();
      expect(payload.label).toBe('[USER_NAME]');
    });

    it('masks PII in trackChatEvent metadata', () => {
      trackChatEvent('question', {
        category: 'q4_board',
        user_name: 'Martin de Weerdt',
      });

      const payload = getLoggedPayload();
      expect(payload.user_name).toBe('[USER_NAME]');
      expect(payload.category).toBe('q4_board');
    });

    it('masks all three PII fields simultaneously', () => {
      track('test.event', {
        user_name: 'Martin de Weerdt',
        user_role: 'Global Chief Information Officer',
        user_avatar_initials: 'MW',
        safeField: 'untouched',
      });

      const payload = getLoggedPayload();
      expect(payload.user_name).toBe('[USER_NAME]');
      expect(payload.user_role).toBe('[USER_ROLE]');
      expect(payload.user_avatar_initials).toBe('[USER_AVATAR]');
      expect(payload.safeField).toBe('untouched');
    });
  });

  describe('console unavailability', () => {
    it('does not throw when console.log is unavailable', () => {
      const originalLog = console.log;
      console.log = undefined;

      expect(() => {
        track('test.event', { key: 'value' });
      }).not.toThrow();

      console.log = originalLog;
    });

    it('does not throw when console.warn is unavailable', () => {
      const originalWarn = console.warn;
      console.warn = undefined;

      expect(() => {
        track('', { key: 'value' });
      }).not.toThrow();

      console.warn = originalWarn;
    });
  });

  describe('log message format', () => {
    it('produces a log message starting with the correct prefix', () => {
      track('test.event', { key: 'value' });

      const message = getLastLogMessage();
      expect(message.startsWith(LOG_PREFIX)).toBe(true);
    });

    it('separates event type and payload with a pipe', () => {
      track('test.event', { key: 'value' });

      const message = getLastLogMessage();
      expect(message).toContain(' | ');
    });

    it('produces valid JSON after the pipe separator', () => {
      track('test.event', { key: 'value' });

      const message = getLastLogMessage();
      const pipeIndex = message.indexOf(' | ');
      const jsonString = message.substring(pipeIndex + 3);

      expect(() => JSON.parse(jsonString)).not.toThrow();
    });

    it('includes the event type between prefix and pipe', () => {
      track('custom.event.type', { key: 'value' });

      const message = getLastLogMessage();
      expect(message).toContain(`${LOG_PREFIX} custom.event.type |`);
    });
  });
});