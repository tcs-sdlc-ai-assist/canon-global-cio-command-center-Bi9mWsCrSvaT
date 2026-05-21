import React from 'react';
import MetricGroup from '../../../components/shared/MetricGroup';
import MetricCard from '../../../components/shared/MetricCard';
import TimelineChart from '../../../components/charts/TimelineChart';
import StrategicIntelligencePanel from '../../../components/panels/StrategicIntelligencePanel';
import { partnershipMetrics } from '../../../data/metrics';
import { partnershipTimeline } from '../../../data/charts';

function Partnerships() {
  return (
    <div className="p-4 md:p-6 lg:p-8 animate-fade-in">
      <MetricGroup
        title="TCS Strategic Partnership"
        subtitle="Service excellence, ROI, innovation velocity, and global delivery performance"
        columns={4}
      >
        {partnershipMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            data={metric}
            showPulse={metric.showPulse}
          />
        ))}
      </MetricGroup>

      <TimelineChart data={partnershipTimeline} />

      <StrategicIntelligencePanel />
    </div>
  );
}

export default Partnerships;