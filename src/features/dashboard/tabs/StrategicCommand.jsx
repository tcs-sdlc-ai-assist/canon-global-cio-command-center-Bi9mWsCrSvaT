import React from 'react';
import MetricGroup from '../../components/shared/MetricGroup';
import MetricCard from '../../components/shared/MetricCard';
import ActionChip from '../../components/shared/ActionChip';
import AIInsightsPanel from '../../components/shared/AIInsightsPanel';
import TrendChart from '../../components/charts/TrendChart';
import { strategicMetrics } from '../../data/metrics';
import { strategicTrends } from '../../data/charts';
import { QUICK_ACTIONS, QUICK_ACTION_SECTION } from '../../data/quickActions';
import { AI_INSIGHTS_CONFIG, STRATEGIC_PRIORITIES, EXECUTIVE_ACTIONS } from '../../data/insights';

function QuickActions() {
  return (
    <section
      className="mb-8"
      role="region"
      aria-label="Quick Actions"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          One-click AI-powered analysis and recommendations
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_ACTIONS.map((action) => (
          <ActionChip
            key={action.id}
            label={action.label}
            section={QUICK_ACTION_SECTION}
            variant="default"
          />
        ))}
      </div>
    </section>
  );
}

function StrategicCommand() {
  const aiInsightSections = [
    {
      id: 'strategic-priorities',
      title: STRATEGIC_PRIORITIES.title,
      section: 'strategic-priorities',
      items: STRATEGIC_PRIORITIES.items.map((item) => ({
        id: item.id,
        label: item.label,
        variant: item.impact === 'high' ? 'primary' : 'default',
      })),
    },
    {
      id: 'executive-actions',
      title: EXECUTIVE_ACTIONS.title,
      section: 'executive-actions',
      items: EXECUTIVE_ACTIONS.items.map((item) => ({
        id: item.id,
        label: item.label,
        variant: item.urgency === 'immediate' ? 'primary' : 'default',
      })),
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <QuickActions />

      <MetricGroup
        title="Business Impact & Value Creation"
        subtitle="Key metrics demonstrating IT's contribution to Canon's bottom line"
        columns={3}
      >
        {strategicMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            data={metric}
            showPulse={metric.showPulse}
          />
        ))}
      </MetricGroup>

      <AIInsightsPanel
        config={AI_INSIGHTS_CONFIG}
        sections={aiInsightSections}
      />

      <TrendChart data={strategicTrends} />
    </div>
  );
}

export default StrategicCommand;