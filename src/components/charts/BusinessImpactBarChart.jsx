import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { trackChartInteraction } from '../../utils/eventTracking';

const CHART_CONFIG = Object.freeze({
  bars: [
    {
      dataKey: 'currentYear',
      name: 'Current Year',
      fill: '#3B82F6',
      radius: [4, 4, 0, 0],
      maxBarSize: 48,
    },
  ],
  margin: { top: 5, right: 20, left: 10, bottom: 5 },
  xAxisDataKey: 'category',
  height: 340,
  domain: [0, 900],
  tickCount: 5,
});

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]?.payload;
  const growth = data?.growth;

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
            €{entry.value}M
          </span>
        </div>
      ))}
      {typeof growth === 'number' && (
        <div className="mt-1.5 pt-1.5 border-t border-gray-100">
          <span className="text-xs text-gray-500">YoY Growth:</span>{' '}
          <span className="text-xs font-semibold text-green-600">
            +{growth}%
          </span>
        </div>
      )}
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
        category: PropTypes.string,
        currentYear: PropTypes.number,
        previousYear: PropTypes.number,
        growth: PropTypes.number,
      }),
    })
  ),
  label: PropTypes.string,
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: '',
};

function BusinessImpactBarChart({ data }) {
  const { activeTab } = useDashboard();

  const handleMouseEnter = useCallback(() => {
    trackChartInteraction('bar', 'hover');
  }, []);

  const chartContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div
          className="flex items-center justify-center h-80 text-gray-400 text-sm"
          role="status"
          aria-label="No business impact data available"
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
            <p>No business impact data available</p>
          </div>
        </div>
      );
    }

    return (
      <div onMouseEnter={handleMouseEnter}>
        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
          <BarChart
            data={data}
            margin={CHART_CONFIG.margin}
            key={`bar-${activeTab}`}
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
              tick={{ fontSize: 12, fill: '#6B7280' }}
              dy={8}
              interval={0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={CHART_CONFIG.domain}
              tickCount={CHART_CONFIG.tickCount}
              tickFormatter={(value) => `€${value}M`}
              dx={-4}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: '#F3F4F6', radius: 4 }}
            />
            {CHART_CONFIG.bars.map((bar) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.fill}
                radius={bar.radius}
                maxBarSize={bar.maxBarSize}
                animationDuration={400}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }, [data, activeTab, handleMouseEnter]);

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="IT Business Value Creation"
      data-section="business-impact-bar-chart"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          IT Business Value Creation
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Revenue attribution by business category (€M)
        </p>
      </div>

      {chartContent}
    </section>
  );
}

BusinessImpactBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      category: PropTypes.string.isRequired,
      currentYear: PropTypes.number.isRequired,
      previousYear: PropTypes.number.isRequired,
      growth: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default React.memo(BusinessImpactBarChart);