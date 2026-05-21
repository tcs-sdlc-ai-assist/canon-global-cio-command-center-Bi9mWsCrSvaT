import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { trackChartInteraction } from '../../utils/eventTracking';

const CHART_CONFIG = Object.freeze({
  bar: {
    dataKey: 'incidents',
    name: 'Incidents',
    fill: '#3B82F6',
    barSize: 20,
    radius: [4, 4, 0, 0],
    yAxisId: 'left',
  },
  line: {
    dataKey: 'mttr',
    name: 'MTTR (Hours)',
    stroke: '#EF4444',
    strokeWidth: 2,
    dot: { r: 3, fill: '#EF4444', strokeWidth: 0 },
    activeDot: { r: 5, fill: '#EF4444', stroke: '#fff', strokeWidth: 2 },
    yAxisId: 'right',
  },
  margin: { top: 5, right: 20, left: 10, bottom: 5 },
  xAxisDataKey: 'shortMonth',
  height: 320,
  leftYAxisDomain: [0, 1800],
  rightYAxisDomain: [0, 6],
  leftTickCount: 6,
  rightTickCount: 5,
});

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">
            {entry.dataKey === 'mttr' ? `${entry.value}h` : entry.value}
          </span>
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
    })
  ),
  label: PropTypes.string,
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: '',
};

function DualAxisChart({ data }) {
  const { activeTab } = useDashboard();

  const handleLegendClick = useCallback(
    (event) => {
      if (event && event.dataKey) {
        trackChartInteraction('dual-axis', `legend-toggle:${event.dataKey}`);
      }
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    trackChartInteraction('dual-axis', 'hover');
  }, []);

  const chartContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div
          className="flex items-center justify-center h-80 text-gray-400 text-sm"
          role="status"
          aria-label="No incident trend data available"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p>No incident trend data available</p>
          </div>
        </div>
      );
    }

    return (
      <div onMouseEnter={handleMouseEnter}>
        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
          <ComposedChart
            data={data}
            margin={CHART_CONFIG.margin}
            key={`dual-axis-${activeTab}`}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey={CHART_CONFIG.xAxisDataKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              dy={8}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={CHART_CONFIG.leftYAxisDomain}
              tickCount={CHART_CONFIG.leftTickCount}
              dx={-4}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={CHART_CONFIG.rightYAxisDomain}
              tickCount={CHART_CONFIG.rightTickCount}
              tickFormatter={(value) => `${value}h`}
              dx={4}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F3F4F6', radius: 4 }} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
              onClick={handleLegendClick}
            />
            <Bar
              dataKey={CHART_CONFIG.bar.dataKey}
              name={CHART_CONFIG.bar.name}
              fill={CHART_CONFIG.bar.fill}
              barSize={CHART_CONFIG.bar.barSize}
              radius={CHART_CONFIG.bar.radius}
              yAxisId={CHART_CONFIG.bar.yAxisId}
              animationDuration={400}
            />
            <Line
              type="monotone"
              dataKey={CHART_CONFIG.line.dataKey}
              name={CHART_CONFIG.line.name}
              stroke={CHART_CONFIG.line.stroke}
              strokeWidth={CHART_CONFIG.line.strokeWidth}
              dot={CHART_CONFIG.line.dot}
              activeDot={CHART_CONFIG.line.activeDot}
              yAxisId={CHART_CONFIG.line.yAxisId}
              animationDuration={400}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }, [data, activeTab, handleMouseEnter, handleLegendClick]);

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="Incident Trends & MTTR"
      data-section="dual-axis-chart"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Incident Trends & MTTR
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Monthly incident volume and mean time to resolve
        </p>
      </div>

      {chartContent}
    </section>
  );
}

DualAxisChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      shortMonth: PropTypes.string.isRequired,
      incidents: PropTypes.number.isRequired,
      mttr: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default React.memo(DualAxisChart);