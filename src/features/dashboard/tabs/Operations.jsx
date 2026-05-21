import React from 'react';
import MetricGroup from '../../../components/shared/MetricGroup';
import MetricCard from '../../../components/shared/MetricCard';
import DualAxisChart from '../../../components/charts/DualAxisChart';
import { operationsMetrics } from '../../../data/metrics';
import { incidentTrends } from '../../../data/charts';

function Operations() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <MetricGroup
        title="IT Operations Performance"
        subtitle="Incident management, resolution efficiency, and infrastructure optimization"
        columns={3}
      >
        {operationsMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            data={metric}
            showPulse={metric.showPulse}
          />
        ))}
      </MetricGroup>

      <DualAxisChart data={incidentTrends} />
    </div>
  );
}

export default Operations;