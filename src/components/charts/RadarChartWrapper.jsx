import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { trackChartInteraction } from '../../utils/eventTracking';

const CHART_CONFIG = Object.freeze({
  radars: [
    {
      dataKey: 'emea',
      name: 'Europe (EMEA)',
      stroke: '#3B82F6',
      fill: '#3B82F6',
      fillOpacity: 0.15,
      strokeWidth: 2,
      dot: { r: 3, fill: '#3B82F6', strokeWidth: 0 },
      activeDot: { r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 },
    },
    {
      dataKey: 'americas',
      name: 'Americas',
      stroke: '#10B981',
      fill: '#10B981',
      fillOpacity: 0.15,
      strokeWidth: 2,
      dot: { r: 3, fill: '#10B981', strokeWidth: 0 },
      activeDot: { r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 },
    },
    {
      dataKey: 'apac',
      name: 'Asia Pacific',
      stroke: '#8B5CF6',
      fill: '#8B5CF6',
      fillOpacity: 0.15,
      strokeWidth: 2,
      dot: { r: 3, fill: '#8B5CF6', strokeWidth: 0 },
      activeDot: { r: 5, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 },
    },
  ],
  margin: { top: 20, right: 30, left: 30, bottom: 10 },
  height: 380,
  polarAngleAxisDataKey: 'dimension',
  domain: [0, 100],
  tickCount: 5,
});

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dimension = payload[0]?.payload?.dimension || '';

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">{dimension}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
      payload: PropTypes.shape({
        dimension: PropTypes.string,
      }),
    })
  ),
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
};

function RadarChartWrapper({ data }) {
  const { activeTab } = useDashboard();

  const handleLegendClick = useCallback(
    (event) => {
      if (event && event.dataKey) {
        trackChartInteraction('radar', `legend-toggle:${event.dataKey}`);
      }
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    trackChartInteraction('radar', 'hover');
  }, []);

  const chartContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div
          className="flex items-center justify-center h-80 text-gray-400 text-sm"
          role="status"
          aria-label="No radar data available"
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            </svg>
            <p>No radar data available</p>
          </div>
        </div>
      );
    }

    return (
      <div onMouseEnter={handleMouseEnter}>
        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
          <RadarChart
            data={data}
            margin={CHART_CONFIG.margin}
            key={`radar-${activeTab}`}
          >
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey={CHART_CONFIG.polarAngleAxisDataKey}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={30}
              domain={CHART_CONFIG.domain}
              tickCount={CHART_CONFIG.tickCount}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
              axisLine={false}
              tickLine={false}
            />
            {CHART_CONFIG.radars.map((radar) => (
              <Radar
                key={radar.dataKey}
                dataKey={radar.dataKey}
                name={radar.name}
                stroke={radar.stroke}
                fill={radar.fill}
                fillOpacity={radar.fillOpacity}
                strokeWidth={radar.strokeWidth}
                dot={radar.dot}
                activeDot={radar.activeDot}
                animationDuration={400}
              />
            ))}
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
              onClick={handleLegendClick}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }, [data, activeTab, handleMouseEnter, handleLegendClick]);

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="Regional Performance Radar"
      data-section="radar-chart"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Regional Performance Radar
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Multi-dimensional comparison across key regions
        </p>
      </div>

      {chartContent}
    </section>
  );
}

RadarChartWrapper.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      dimension: PropTypes.string.isRequired,
      emea: PropTypes.number.isRequired,
      americas: PropTypes.number.isRequired,
      apac: PropTypes.number.isRequired,
      fullMark: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default React.memo(RadarChartWrapper);