import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useDashboard } from '../../hooks/useDashboard';
import { useChatDispatch } from '../../context/ChatContext';
import { exportChartData } from '../../utils/csvExport';
import { trackChartInteraction } from '../../utils/eventTracking';

const CHART_CONFIG = Object.freeze({
  lines: [
    {
      dataKey: 'businessImpact',
      name: 'Business Impact',
      stroke: '#3B82F6',
      strokeWidth: 2,
      dot: { r: 3, fill: '#3B82F6', strokeWidth: 0 },
      activeDot: { r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 },
    },
    {
      dataKey: 'operationalExcellence',
      name: 'Operational Excellence',
      stroke: '#10B981',
      strokeWidth: 2,
      dot: { r: 3, fill: '#10B981', strokeWidth: 0 },
      activeDot: { r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 },
    },
    {
      dataKey: 'innovationIndex',
      name: 'Innovation Index',
      stroke: '#8B5CF6',
      strokeWidth: 2,
      dot: { r: 3, fill: '#8B5CF6', strokeWidth: 0 },
      activeDot: { r: 5, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 },
    },
  ],
  margin: { top: 5, right: 20, left: 10, bottom: 5 },
  xAxisDataKey: 'shortMonth',
  height: 320,
});

const CSV_COLUMNS = Object.freeze(['month', 'businessImpact', 'operationalExcellence', 'innovationIndex']);
const CSV_HEADERS = Object.freeze(['Month', 'Business Impact', 'Operational Excellence', 'Innovation Index']);
const CSV_FILENAME = 'strategic-performance-trends';

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
    })
  ),
  label: PropTypes.string,
};

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: '',
};

function TrendChart({ data }) {
  const { activeTab } = useDashboard();
  const { openWithPrompt } = useChatDispatch();

  const handleExportClick = useCallback(() => {
    if (!data || data.length === 0) {
      return;
    }

    exportChartData(data, CSV_COLUMNS, CSV_FILENAME, {
      headers: CSV_HEADERS,
    });
  }, [data]);

  const handlePredictiveClick = useCallback(() => {
    openWithPrompt('Analyze strategic performance trends and provide forward-looking projections');
  }, [openWithPrompt]);

  const handleLegendClick = useCallback(
    (event) => {
      if (event && event.dataKey) {
        trackChartInteraction('line', `legend-toggle:${event.dataKey}`);
      }
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    trackChartInteraction('line', 'hover');
  }, []);

  const chartContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div
          className="flex items-center justify-center h-80 text-gray-400 text-sm"
          role="status"
          aria-label="No trend data available"
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <p>No trend data available</p>
          </div>
        </div>
      );
    }

    return (
      <div onMouseEnter={handleMouseEnter}>
        <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
          <LineChart
            data={data}
            margin={CHART_CONFIG.margin}
            key={`trend-${activeTab}`}
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
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[60, 100]}
              tickCount={5}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#D1D5DB', strokeDasharray: '4 4' }} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
              onClick={handleLegendClick}
            />
            {CHART_CONFIG.lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                dot={line.dot}
                activeDot={line.activeDot}
                animationDuration={400}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }, [data, activeTab, handleMouseEnter, handleLegendClick]);

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="Strategic Performance Trends"
      data-section="trend-chart"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Strategic Performance Trends
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            12-month rolling performance across key strategic dimensions
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handlePredictiveClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Ask AI for predictive analysis of strategic trends"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
              />
            </svg>
            Predictive Analysis
          </button>

          <button
            type="button"
            onClick={handleExportClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Export trend data as CSV"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Data
          </button>
        </div>
      </div>

      {chartContent}
    </section>
  );
}

TrendChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      shortMonth: PropTypes.string.isRequired,
      businessImpact: PropTypes.number.isRequired,
      operationalExcellence: PropTypes.number.isRequired,
      innovationIndex: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default React.memo(TrendChart);