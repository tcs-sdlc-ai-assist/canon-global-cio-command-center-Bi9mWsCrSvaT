import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePulseAnimation } from '../usePulseAnimation';
import { PULSE_INTERVAL_MS } from '../../constants/pulse';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

describe('usePulseAnimation', () => {
  let matchMediaMock;
  let requestAnimationFrameSpy;
  let cancelAnimationFrameSpy;
  let rafCallbacks;

  beforeEach(() => {
    vi.useFakeTimers();

    rafCallbacks = [];
    requestAnimationFrameSpy = vi
      .fn((cb) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      })
      .mockName('requestAnimationFrame');

    cancelAnimationFrameSpy = vi.fn().mockName('cancelAnimationFrame');

    vi.stubGlobal('requestAnimationFrame', requestAnimationFrameSpy);
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameSpy);

    matchMediaMock = vi.fn((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    vi.stubGlobal('matchMedia', matchMediaMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function flushRafCallbacks() {
    while (rafCallbacks.length > 0) {
      const callbacks = [...rafCallbacks];
      rafCallbacks = [];
      callbacks.forEach((cb) => cb());
    }
  }

  describe('initialization', () => {
    it('returns false initially before any RAF callbacks fire', () => {
      const { result } = renderHook(() => usePulseAnimation());

      expect(result.current).toBe(false);
    });

    it('returns true after the double-RAF pattern completes on mount', () => {
      const { result } = renderHook(() => usePulseAnimation());

      flushRafCallbacks();

      expect(result.current).toBe(true);
    });

    it('calls requestAnimationFrame twice on mount for the double-RAF pattern', () => {
      renderHook(() => usePulseAnimation());

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('pulse toggling', () => {
    it('sets pulseActive to false then true via double-RAF on each interval tick', () => {
      const { result } = renderHook(() => usePulseAnimation());

      flushRafCallbacks();
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(PULSE_INTERVAL_MS);
      });

      expect(result.current).toBe(false);

      flushRafCallbacks();

      expect(result.current).toBe(true);
    });

    it('cycles through multiple interval ticks correctly', () => {
      const { result } = renderHook(() => usePulseAnimation());

      flushRafCallbacks();
      expect(result.current).toBe(true);

      for (let i = 0; i < 3; i++) {
        act(() => {
          vi.advanceTimersByTime(PULSE_INTERVAL_MS);
        });

        expect(result.current).toBe(false);

        flushRafCallbacks();

        expect(result.current).toBe(true);
      }
    });

    it('uses PULSE_INTERVAL_MS as the default interval duration', () => {
      renderHook(() => usePulseAnimation());

      act(() => {
        vi.advanceTimersByTime(PULSE_INTERVAL_MS - 1);
      });

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(4);
    });

    it('accepts a custom interval duration', () => {
      const customInterval = 10000;

      renderHook(() => usePulseAnimation(customInterval));

      act(() => {
        vi.advanceTimersByTime(customInterval - 1);
      });

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(4);
    });
  });

  describe('cleanup on unmount', () => {
    it('clears the interval when the component unmounts', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      const { unmount } = renderHook(() => usePulseAnimation());

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

      clearIntervalSpy.mockRestore();
    });

    it('cancels pending requestAnimationFrame on unmount', () => {
      const { unmount } = renderHook(() => usePulseAnimation());

      unmount();

      expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    });

    it('does not trigger state updates after unmount', () => {
      const { result, unmount } = renderHook(() => usePulseAnimation());

      flushRafCallbacks();
      expect(result.current).toBe(true);

      unmount();

      act(() => {
        vi.advanceTimersByTime(PULSE_INTERVAL_MS);
      });

      expect(result.current).toBe(true);
    });
  });

  describe('prefers-reduced-motion', () => {
    it('returns false and never activates when prefers-reduced-motion is reduce', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query === REDUCED_MOTION_QUERY,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => usePulseAnimation());

      flushRafCallbacks();

      expect(result.current).toBe(false);

      act(() => {
        vi.advanceTimersByTime(PULSE_INTERVAL_MS);
      });

      flushRafCallbacks();

      expect(result.current).toBe(false);
    });

    it('does not call requestAnimationFrame when reduced motion is preferred', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: query === REDUCED_MOTION_QUERY,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderHook(() => usePulseAnimation());

      expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
    });

    it('does not set an interval when reduced motion is preferred', () => {
      const setIntervalSpy = vi.spyOn(global, 'setInterval');

      matchMediaMock.mockImplementation((query) => ({
        matches: query === REDUCED_MOTION_QUERY,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      renderHook(() => usePulseAnimation());

      expect(setIntervalSpy).not.toHaveBeenCalled();

      setIntervalSpy.mockRestore();
    });

    it('activates normally when prefers-reduced-motion is no-preference', () => {
      matchMediaMock.mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => usePulseAnimation());

      flushRafCallbacks();

      expect(result.current).toBe(true);
    });
  });

  describe('double-RAF pattern', () => {
    it('sets pulseActive to false synchronously before scheduling RAFs', () => {
      const { result } = renderHook(() => usePulseAnimation());

      flushRafCallbacks();
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(PULSE_INTERVAL_MS);
      });

      expect(result.current).toBe(false);
    });

    it('schedules exactly two RAF callbacks per pulse cycle', () => {
      renderHook(() => usePulseAnimation());

      const initialRafCount = requestAnimationFrameSpy.mock.calls.length;

      act(() => {
        vi.advanceTimersByTime(PULSE_INTERVAL_MS);
      });

      const afterIntervalRafCount = requestAnimationFrameSpy.mock.calls.length;

      expect(afterIntervalRafCount - initialRafCount).toBe(2);
    });

    it('re-triggers animation reliably across multiple cycles', () => {
      const { result } = renderHook(() => usePulseAnimation());

      for (let cycle = 0; cycle < 5; cycle++) {
        flushRafCallbacks();
        expect(result.current).toBe(true);

        act(() => {
          vi.advanceTimersByTime(PULSE_INTERVAL_MS);
        });

        expect(result.current).toBe(false);
      }
    });
  });

  describe('edge cases', () => {
    it('handles zero interval duration gracefully', () => {
      const { result } = renderHook(() => usePulseAnimation(0));

      flushRafCallbacks();
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current).toBe(false);
    });

    it('handles very large interval duration', () => {
      const largeInterval = 3600000;

      const { result } = renderHook(() => usePulseAnimation(largeInterval));

      flushRafCallbacks();
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(largeInterval - 1);
      });

      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current).toBe(false);
    });

    it('handles negative interval duration by firing immediately', () => {
      const { result } = renderHook(() => usePulseAnimation(-1000));

      flushRafCallbacks();
      expect(result.current).toBe(true);

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(result.current).toBe(false);
    });

    it('does not throw when window.matchMedia is unavailable', () => {
      vi.stubGlobal('matchMedia', undefined);

      expect(() => {
        renderHook(() => usePulseAnimation());
      }).not.toThrow();
    });

    it('does not throw when window is undefined (SSR-like environment)', () => {
      const originalWindow = global.window;
      delete global.window;

      expect(() => {
        renderHook(() => usePulseAnimation());
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('cleans up interval ref on unmount even if interval was never set', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      matchMediaMock.mockImplementation((query) => ({
        matches: query === REDUCED_MOTION_QUERY,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { unmount } = renderHook(() => usePulseAnimation());

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

      clearIntervalSpy.mockRestore();
    });
  });

  describe('return value type', () => {
    it('always returns a boolean', () => {
      const { result } = renderHook(() => usePulseAnimation());

      expect(typeof result.current).toBe('boolean');

      flushRafCallbacks();

      expect(typeof result.current).toBe('boolean');
    });
  });
});