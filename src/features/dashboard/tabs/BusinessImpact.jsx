import React from 'react';
import MetricGroup from '../../../components/shared/MetricGroup';
import MetricCard from '../../../components/shared/MetricCard';
import BusinessImpactBarChart from '../../../components/charts/BusinessImpactBarChart';
import { businessImpactMetrics } from '../../../data/metrics';
import { businessImpactBar } from '../../../data/charts';

function BusinessImpact() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <MetricGroup
        title="Business Value Creation"
        subtitle="IT-enabled revenue attribution and cost optimization across all business units"
        columns={3}
      >
        {businessImpactMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            data={metric}
            showPulse={metric.showPulse}
          />
        ))}
      </MetricGroup>

      <BusinessImpactBarChart data={businessImpactBar} />
    </div>
  );
}

export default BusinessImpact;