import React from 'react';
import MetricGroup from '../../../components/shared/MetricGroup';
import MetricCard from '../../../components/shared/MetricCard';
import { riskMetrics } from '../../../data/metrics';

function RiskGovernance() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <MetricGroup
        title="Risk & Governance"
        subtitle="Compliance, cybersecurity maturity, and data governance across global operations"
        columns={3}
      >
        {riskMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            data={metric}
            showPulse={metric.showPulse}
          />
        ))}
      </MetricGroup>
    </div>
  );
}

export default RiskGovernance;