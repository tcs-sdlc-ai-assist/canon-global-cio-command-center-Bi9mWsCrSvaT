import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { useDashboard } from '../../hooks/useDashboard';
import { TAB_IDS } from '../../constants/tabs';

const StrategicCommand = lazy(() => import('../panels/StrategicCommand'));
const ExecutiveSummary = lazy(() => import('../panels/ExecutiveSummary'));
const BusinessImpact = lazy(() => import('../panels/BusinessImpact'));
const Operations = lazy(() => import('../panels/Operations'));
const RiskGovernance = lazy(() => import('../panels/RiskGovernance'));
const Innovation = lazy(() => import('../panels/Innovation'));
const Partnerships = lazy(() => import('../panels/Partnerships'));

const TAB_PANEL_MAP = Object.freeze({
  [TAB_IDS.STRATEGIC_COMMAND]: StrategicCommand,
  [TAB_IDS.EXECUTIVE_SUMMARY]: ExecutiveSummary,
  [TAB_IDS.BUSINESS_IMPACT]: BusinessImpact,
  [TAB_IDS.OPERATIONS]: Operations,
  [TAB_IDS.RISK_GOVERNANCE]: RiskGovernance,
  [TAB_IDS.INNOVATION]: Innovation,
  [TAB_IDS.PARTNERSHIPS]: Partnerships,
});

function TabContentSkeleton() {
  return (
    <div
      className="p-4 md:p-6 lg:p-8 animate-fade-in"
      role="status"
      aria-label="Loading tab content"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="glass-card p-6 animate-pulse"
          >
            <div className="skeleton h-4 w-24 mb-4" />
            <div className="skeleton h-8 w-32 mb-3" />
            <div className="skeleton h-3 w-full mb-2" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function TabContent() {
  const { activeTab } = useDashboard();

  const PanelComponent = TAB_PANEL_MAP[activeTab];

  if (!PanelComponent) {
    console.warn(`[TabContent] No panel component found for tab: "${activeTab}"`);
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${activeTab}`}
      aria-label={`${activeTab.replace(/_/g, ' ')} panel`}
      className="focus:outline-none"
    >
      <Suspense fallback={<TabContentSkeleton />}>
        <PanelComponent key={activeTab} />
      </Suspense>
    </div>
  );
}

TabContent.propTypes = {};

export default TabContent;