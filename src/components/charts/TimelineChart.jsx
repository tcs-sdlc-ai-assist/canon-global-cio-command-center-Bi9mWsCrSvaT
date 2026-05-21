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
  Legend,
  Cell,
} from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { trackChartInteraction } from '../../utils/eventTracking';

const CHART_CONFIG = Object.freeze({
  bars: [
    {
      dataKey: 'investment',
      name: 'Investment',
      fill: '#3B82F6',
      radius: [4, 4, 0, 0],
      maxBarSize: 40,
    },
    {
      dataKey: 'valueDelivered',
      name: 'Value Delivered',
      fill: '#10B981',
      radius: [4, 4, 0, 0],
      maxBarSize: 40,
    },
  ],
  margin: { top: 5, right: 20, left: 10, bottom: 5 },
  xAxisDataKey: 'year',
  height: 340,
  domain: [0, 300],
  tickCount: 6,
  projectedOpacity: 0.5,
  projectedPattern: 'url(#projectedPattern)',
});

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const isProjected = payload[0]?.payload?.isProjected;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">
        {label}
        {isProjected && (
          <span className="ml-1.5 text-amber-600">(Projected)</span>
        )}
      </p>
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
        year: PropTypes.string,
        investment: PropTypes.number,
        valueDelivered: PropTypes.number,
        isProjected: PropTypes.bool,
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

function TimelineChart({ data }) {
  const { activeTab } = useDashboard();

  const handleLegendClick = useCallback(
    (event) => {
      if (event && event.dataKey) {
        trackChartInteraction('timeline', `legend-toggle:${event.dataKey}`);
      }
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    trackChartInteraction('timeline', 'hover');
  }, []);

  const chartContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div
          className="flex items-center justify-center h-80 text-gray-400 text-sm"
          role="status"
          aria-label="No partnership timeline data available"
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
            <p>No partnership timeline data available</p>
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
            key={`timeline-${activeTab}`}
          >
            <defs>
              <pattern
                id="projectedPattern"
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
                patternTransform="rotate(45)"
              >
                <rect
                  width="3"
                  height="6"
                  fill="rgba(255, 255, 255, 0.6)"
                />
              </pattern>
            </defs>
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
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
              onClick={handleLegendClick}
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
              >
                {data.map((entry, index) => {
                  if (entry.isProjected) {
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={bar.fill}
                        fillOpacity={CHART_CONFIG.projectedOpacity}
                        stroke={bar.fill}
                        strokeDasharray="4 3"
                      />
                    );
                  }
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={bar.fill}
                    />
                  );
                })}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }, [data, activeTab, handleMouseEnter, handleLegendClick]);

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="Partnership Investment & Value Timeline"
      data-section="timeline-chart"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Partnership Investment & Value Timeline
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Annual investment vs. value delivered (€M) — 2026 projected
        </p>
      </div>

      {chartContent}
    </section>
  );
}

TimelineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.string.isRequired,
      investment: PropTypes.number.isRequired,
      valueDelivered: PropTypes.number.isRequired,
      isProjected: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default React.memo(TimelineChart);