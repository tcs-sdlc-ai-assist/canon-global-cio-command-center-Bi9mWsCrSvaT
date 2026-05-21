import { useContext } from 'react';
import { DashboardStateContext, DashboardDispatchContext } from '../context/DashboardContext';

/**
 * Custom hook that consumes both DashboardStateContext and DashboardDispatchContext.
 *
 * Provides a single convenience interface for components that need to read
 * dashboard state and/or dispatch actions. Components that only need to read
 * state or only need to dispatch can still use the individual contexts directly
 * to avoid unnecessary re-renders.
 *
 * Must be called within a <DashboardProvider> component tree.
 *
 * @returns {{
 *   activeTab: string,
 *   setActiveTab: (tabId: string) => void,
 *   userIdentity: { name: string, role: string, avatarInitials: string },
 *   notificationCount: number,
 *   setNotificationCount: (count: number) => void,
 *   tabs: Array<{ id: string, label: string, order: number }>,
 * }}
 * @throws {Error} If called outside of a <DashboardProvider>
 *
 * @example
 *   const { activeTab, setActiveTab, userIdentity } = useDashboard();
 *   // Read current tab and user info, switch tabs
 *
 * @example
 *   const { notificationCount } = useDashboard();
 *   // Only read notification count (but still subscribes to all state changes)
 */
export function useDashboard() {
  const state = useContext(DashboardStateContext);
  const dispatch = useContext(DashboardDispatchContext);

  if (state === null || dispatch === null) {
    throw new Error(
      'useDashboard must be used within a <DashboardProvider>. ' +
      'Ensure your component is wrapped in the provider tree.'
    );
  }

  return {
    activeTab: state.activeTab,
    setActiveTab: dispatch.setActiveTab,
    userIdentity: state.userIdentity,
    notificationCount: state.notificationCount,
    setNotificationCount: dispatch.setNotificationCount,
    tabs: state.tabs,
  };
}