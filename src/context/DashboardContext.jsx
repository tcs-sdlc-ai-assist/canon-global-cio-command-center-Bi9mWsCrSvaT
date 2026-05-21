import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTabPersistence } from '../hooks/useTabPersistence';
import { TAB_CONFIG, DEFAULT_TAB, STORAGE_KEYS } from '../constants/tabs';
import { USER_IDENTITY, DEFAULT_NOTIFICATION_COUNT } from '../constants/identity';

export const DashboardStateContext = createContext(null);
export const DashboardDispatchContext = createContext(null);

export function DashboardProvider({ children }) {
  const [persistedTab, persistTab] = useTabPersistence(
    STORAGE_KEYS.ACTIVE_TAB,
    DEFAULT_TAB
  );

  const [activeTab, setActiveTabState] = useState(persistedTab);
  const [notificationCount, setNotificationCountState] = useState(
    DEFAULT_NOTIFICATION_COUNT
  );

  useEffect(() => {
    if (activeTab !== persistedTab) {
      setActiveTabState(persistedTab);
    }
  }, [persistedTab]);

  const setActiveTab = useCallback(
    (tabId) => {
      if (typeof tabId !== 'string' || tabId.length === 0) {
        console.warn('[DashboardContext] Invalid tab ID, ignoring:', tabId);
        return;
      }

      if (tabId === activeTab) {
        return;
      }

      setActiveTabState(tabId);
      persistTab(tabId);
    },
    [activeTab, persistTab]
  );

  const setNotificationCount = useCallback((count) => {
    const num = Number(count);
    if (!Number.isInteger(num) || num < 0) {
      console.warn(
        '[DashboardContext] Invalid notification count, ignoring:',
        count
      );
      return;
    }
    setNotificationCountState(num);
  }, []);

  const stateValue = useMemo(
    () => ({
      activeTab,
      userIdentity: USER_IDENTITY,
      notificationCount,
      tabs: TAB_CONFIG,
    }),
    [activeTab, notificationCount]
  );

  const dispatchValue = useMemo(
    () => ({
      setActiveTab,
      setNotificationCount,
    }),
    [setActiveTab, setNotificationCount]
  );

  return (
    <DashboardStateContext.Provider value={stateValue}>
      <DashboardDispatchContext.Provider value={dispatchValue}>
        {children}
      </DashboardDispatchContext.Provider>
    </DashboardStateContext.Provider>
  );
}

DashboardProvider.propTypes = {
  children: PropTypes.node.isRequired,
};