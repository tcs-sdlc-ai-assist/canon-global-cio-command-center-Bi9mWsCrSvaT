import { useState, useCallback } from 'react';
import { STORAGE_KEYS, DEFAULT_TAB, VALID_TAB_IDS } from '../constants/tabs';

function readPersistedTab(storageKey, defaultTab) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) {
      return defaultTab;
    }

    if (VALID_TAB_IDS.includes(raw)) {
      return raw;
    }

    localStorage.removeItem(storageKey);
    return defaultTab;
  } catch (error) {
    console.warn('[useTabPersistence] localStorage unavailable, using default tab:', error.message);
    return defaultTab;
  }
}

function writePersistedTab(storageKey, tabId) {
  try {
    localStorage.setItem(storageKey, tabId);
  } catch (error) {
    console.warn('[useTabPersistence] Failed to persist tab preference:', error.message);
  }
}

/**
 * Custom hook that manages localStorage persistence for the active dashboard tab.
 * Reads the persisted tab on mount, validates it against VALID_TAB_IDS,
 * and falls back to the default tab if the stored value is invalid or unavailable.
 *
 * @param {string} [storageKey=STORAGE_KEYS.ACTIVE_TAB] - localStorage key for tab persistence
 * @param {string} [defaultTab=DEFAULT_TAB] - Fallback tab ID if no valid persisted value exists
 * @returns {[string, (tabId: string) => void]} Tuple of [persistedTabId, persistTab]
 *
 * @example
 *   const [activeTab, persistTab] = useTabPersistence();
 *   // activeTab is the restored or default tab ID
 *   // persistTab('operations') writes to localStorage
 */
export function useTabPersistence(storageKey = STORAGE_KEYS.ACTIVE_TAB, defaultTab = DEFAULT_TAB) {
  const [persistedTabId, setPersistedTabId] = useState(() =>
    readPersistedTab(storageKey, defaultTab)
  );

  const persistTab = useCallback(
    (tabId) => {
      if (typeof tabId !== 'string' || !VALID_TAB_IDS.includes(tabId)) {
        console.warn('[useTabPersistence] Invalid tab ID, ignoring:', tabId);
        return;
      }

      setPersistedTabId(tabId);
      writePersistedTab(storageKey, tabId);
    },
    [storageKey]
  );

  return [persistedTabId, persistTab];
}