import React from 'react';
import MetricGroup from '../../../components/shared/MetricGroup';
import MetricCard from '../../../components/shared/MetricCard';
import DoughnutChartWrapper from '../../../components/charts/DoughnutChartWrapper';
import { innovationMetrics } from '../../../data/metrics';
import { innovationDoughnut } from '../../../data/charts';

function Innovation() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <MetricGroup
        title="Innovation Portfolio"
        subtitle="AI/ML models, pipeline value, and intellectual property across global R&D"
        columns={3}
      >
        {innovationMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            data={metric}
            showPulse={metric.showPulse}
          />
        ))}
      </MetricGroup>

      <DoughnutChartWrapper data={innovationDoughnut} />
    </div>
  );
}

export default Innovation;