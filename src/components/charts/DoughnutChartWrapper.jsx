import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { trackChartInteraction } from '../../utils/eventTracking';

const CHART_CONFIG = Object.freeze({
  innerRadius: 60,
  outerRadius: 100,
  height: 380,
  margin: { top: 5, right: 20, left: 10, bottom: 5 },
});

function CustomTooltip({ active, payload }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const data = payload[0]?.payload;
  const total = data?.payload?.total;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-xs font-semibold text-gray-500 mb-2">{data?.name}</p>
      <div className="flex items-center gap-2 text-sm">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: data?.color }}
          aria-hidden="true"
        />
        <span className="text-gray-600">Share:</span>
        <span className="font-semibold text-gray-900">{data?.value}%</span>
      </div>
      {typeof total === 'number' && (
        <div className="mt-1.5 pt-1.5 border-t border-gray-100">
          <span className="text-xs text-gray-500">Portfolio Value:</span>{' '}
          <span className="text-xs font-semibold text-gray-900">€{total}M</span>
        </div>
      )}
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
      payload: PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.number,
        color: PropTypes.string,
        total: PropTypes.number,
      }),
    })
  ),
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
};

function CenterLabel({ viewBox, total }) {
  if (!viewBox || typeof total !== 'number') {
    return null;
  }

  const { cx, cy } = viewBox;

  return (
    <>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs fill-gray-400"
        style={{ fontSize: '11px' }}
      >
        Total Portfolio
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-bold fill-gray-900"
        style={{ fontSize: '18px' }}
      >
        €{total}M
      </text>
    </>
  );
}

CenterLabel.propTypes = {
  viewBox: PropTypes.shape({
    cx: PropTypes.number,
    cy: PropTypes.number,
  }),
  total: PropTypes.number,
};

CenterLabel.defaultProps = {
  viewBox: null,
  total: 0,
};

function DoughnutChartWrapper({ data }) {
  const { activeTab } = useDashboard();

  const handleLegendClick = useCallback(
    (event) => {
      if (event && event.dataKey) {
        trackChartInteraction('doughnut', `legend-toggle:${event.dataKey}`);
      }
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    trackChartInteraction('doughnut', 'hover');
  }, []);

  const totalValue = useMemo(() => {
    if (!data || data.length === 0) {
      return 0;
    }
    return data.reduce((sum, entry) => sum + (entry.value || 0), 0);
  }, [data]);

  const enrichedData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return data.map((entry) => ({
      ...entry,
      total: totalValue,
    }));
  }, [data, totalValue]);

  const chartContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div
          className="flex items-center justify-center h-80 text-gray-400 text-sm"
          role="status"
          aria-label="No innovation portfolio data available"
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
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            <p>No innovation portfolio data available</p>
          </div>
        </div>
      );
    }

    return (
      <div onMouseEnter={handleMouseEnter}>
        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
          <PieChart
            margin={CHART_CONFIG.margin}
            key={`doughnut-${activeTab}`}
          >
            <Pie
              data={enrichedData}
              cx="50%"
              cy="50%"
              innerRadius={CHART_CONFIG.innerRadius}
              outerRadius={CHART_CONFIG.outerRadius}
              paddingAngle={2}
              dataKey="value"
              animationDuration={400}
            >
              {enrichedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{
                fontSize: '12px',
                color: '#6B7280',
                lineHeight: '24px',
              }}
              onClick={handleLegendClick}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }, [data, enrichedData, activeTab, handleMouseEnter, handleLegendClick]);

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="Innovation Portfolio Distribution"
      data-section="doughnut-chart"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Innovation Portfolio Distribution
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Investment allocation across technology domains (%)
        </p>
      </div>

      {chartContent}
    </section>
  );
}

DoughnutChartWrapper.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default React.memo(DoughnutChartWrapper);