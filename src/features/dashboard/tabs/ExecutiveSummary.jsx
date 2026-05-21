import React from 'react';
import MetricGroup from '../../../components/shared/MetricGroup';
import MetricCard from '../../../components/shared/MetricCard';
import RadarChartWrapper from '../../../components/charts/RadarChartWrapper';
import PerformanceTable from '../../../components/tables/PerformanceTable';
import { executiveMetrics } from '../../../data/metrics';
import { regionalRadar } from '../../../data/charts';
import { regionalPerformance } from '../../../data/tables';

function ExecutiveSummary() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <MetricGroup
        title="Operational Excellence Overview"
        subtitle="Key performance indicators across global IT operations"
        columns={4}
      >
        {executiveMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            data={metric}
            showPulse={metric.showPulse}
          />
        ))}
      </MetricGroup>

      <RadarChartWrapper data={regionalRadar} />

      <PerformanceTable data={regionalPerformance} />
    </div>
  );
}

export default ExecutiveSummary;