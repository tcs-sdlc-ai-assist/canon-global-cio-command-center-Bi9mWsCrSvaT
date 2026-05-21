import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTabPersistence } from '../useTabPersistence';
import { TAB_IDS, VALID_TAB_IDS } from '../../constants/tabs';

const STORAGE_KEY = 'cio_dashboard_active_tab';

describe('useTabPersistence', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = {
      store: {},
      getItem: vi.fn(function (key) {
        if (key in this.store) {
          return this.store[key];
        }
        return null;
      }),
      setItem: vi.fn(function (key, value) {
        this.store[key] = String(value);
      }),
      removeItem: vi.fn(function (key) {
        delete this.store[key];
      }),
      clear: vi.fn(function () {
        this.store = {};
      }),
    };

    vi.stubGlobal('localStorage', mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('initialization', () => {
    it('returns the default tab when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      expect(result.current[0]).toBe(TAB_IDS.STRATEGIC_COMMAND);
    });

    it('returns the persisted tab from localStorage when valid', () => {
      mockStorage.store[STORAGE_KEY] = TAB_IDS.OPERATIONS;

      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      expect(result.current[0]).toBe(TAB_IDS.OPERATIONS);
    });

    it('returns the default tab when localStorage value is not a valid tab ID', () => {
      mockStorage.store[STORAGE_KEY] = 'invalid_tab_id';

      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      expect(result.current[0]).toBe(TAB_IDS.STRATEGIC_COMMAND);
    });

    it('removes invalid tab ID from localStorage and returns default', () => {
      mockStorage.store[STORAGE_KEY] = 'not_a_real_tab';

      renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.EXECUTIVE_SUMMARY)
      );

      expect(mockStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('returns the default tab when localStorage.getItem throws', () => {
      mockStorage.getItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.BUSINESS_IMPACT)
      );

      expect(result.current[0]).toBe(TAB_IDS.BUSINESS_IMPACT);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('returns the default tab when localStorage is completely unavailable', () => {
      vi.stubGlobal('localStorage', undefined);

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.INNOVATION)
      );

      expect(result.current[0]).toBe(TAB_IDS.INNOVATION);

      consoleWarnSpy.mockRestore();
    });

    it('uses the provided default tab when no second argument is given', () => {
      const { result } = renderHook(() => useTabPersistence());

      expect(result.current[0]).toBe(TAB_IDS.STRATEGIC_COMMAND);
    });
  });

  describe('persistTab', () => {
    it('writes the tab ID to localStorage when called with a valid tab', () => {
      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      act(() => {
        result.current[1](TAB_IDS.PARTNERSHIPS);
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        TAB_IDS.PARTNERSHIPS
      );
      expect(result.current[0]).toBe(TAB_IDS.PARTNERSHIPS);
    });

    it('updates the returned persisted tab value after writing', () => {
      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      act(() => {
        result.current[1](TAB_IDS.RISK_GOVERNANCE);
      });

      expect(result.current[0]).toBe(TAB_IDS.RISK_GOVERNANCE);
    });

    it('does not write to localStorage when called with an invalid tab ID', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      act(() => {
        result.current[1]('invalid_tab');
      });

      expect(mockStorage.setItem).not.toHaveBeenCalled();
      expect(result.current[0]).toBe(TAB_IDS.STRATEGIC_COMMAND);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('does not write to localStorage when called with an empty string', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      act(() => {
        result.current[1]('');
      });

      expect(mockStorage.setItem).not.toHaveBeenCalled();
      expect(result.current[0]).toBe(TAB_IDS.STRATEGIC_COMMAND);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('handles localStorage.setItem throwing an error gracefully', () => {
      mockStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      act(() => {
        result.current[1](TAB_IDS.INNOVATION);
      });

      expect(result.current[0]).toBe(TAB_IDS.INNOVATION);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('can be called multiple times with different valid tabs', () => {
      const { result } = renderHook(() =>
        useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
      );

      act(() => {
        result.current[1](TAB_IDS.OPERATIONS);
      });

      expect(result.current[0]).toBe(TAB_IDS.OPERATIONS);

      act(() => {
        result.current[1](TAB_IDS.BUSINESS_IMPACT);
      });

      expect(result.current[0]).toBe(TAB_IDS.BUSINESS_IMPACT);
      expect(mockStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('all valid tab IDs', () => {
    VALID_TAB_IDS.forEach((tabId) => {
      it(`accepts and persists tab ID: ${tabId}`, () => {
        const { result } = renderHook(() =>
          useTabPersistence(STORAGE_KEY, TAB_IDS.STRATEGIC_COMMAND)
        );

        act(() => {
          result.current[1](tabId);
        });

        expect(result.current[0]).toBe(tabId);
        expect(mockStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, tabId);
      });
    });
  });

  describe('storage key customization', () => {
    it('uses the provided storage key for reading and writing', () => {
      const customKey = 'custom_tab_key';
      mockStorage.store[customKey] = TAB_IDS.INNOVATION;

      const { result } = renderHook(() =>
        useTabPersistence(customKey, TAB_IDS.STRATEGIC_COMMAND)
      );

      expect(result.current[0]).toBe(TAB_IDS.INNOVATION);

      act(() => {
        result.current[1](TAB_IDS.PARTNERSHIPS);
      });

      expect(mockStorage.setItem).toHaveBeenCalledWith(
        customKey,
        TAB_IDS.PARTNERSHIPS
      );
    });
  });
});