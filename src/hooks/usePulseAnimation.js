import { useState, useEffect, useRef, useCallback } from 'react';
import { PULSE_INTERVAL_MS } from '../constants/pulse';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function _checkReducedMotion() {
  try {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return false;
    }
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

/**
 * Custom hook that manages the AI indicator pulse animation cycle.
 *
 * Toggles a `pulseActive` boolean approximately every `intervalMs` milliseconds
 * using a double requestAnimationFrame pattern to reliably re-trigger CSS animations.
 * Respects the user's `prefers-reduced-motion` media query — if the user prefers
 * reduced motion, the pulse will never activate and `pulseActive` remains `false`.
 *
 * The interval is cleaned up automatically on component unmount.
 *
 * @param {number} [intervalMs=PULSE_INTERVAL_MS] - Pulse refresh interval in milliseconds (default 45s)
 * @returns {boolean} `true` when the pulse animation should be active, `false` otherwise
 *
 * @example
 *   const pulseActive = usePulseAnimation();
 *   return <span className={`ai-indicator ${pulseActive ? 'pulse-active' : 'pulse-resting'}`} />;
 *
 * @example
 *   const pulseActive = usePulseAnimation(30000); // 30-second interval
 */
export function usePulseAnimation(intervalMs = PULSE_INTERVAL_MS) {
  const prefersReducedMotion = _checkReducedMotion();

  const [pulseActive, setPulseActive] = useState(false);
  const intervalRef = useRef(null);
  const rafIdRef = useRef(null);

  const triggerPulse = useCallback(() => {
    if (prefersReducedMotion) {
      return;
    }

    setPulseActive(false);

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = requestAnimationFrame(() => {
        setPulseActive(true);
      });
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPulseActive(false);
      return undefined;
    }

    triggerPulse();

    intervalRef.current = setInterval(triggerPulse, intervalMs);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [triggerPulse, intervalMs, prefersReducedMotion]);

  return pulseActive;
}