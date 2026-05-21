import React from 'react';
import PropTypes from 'prop-types';
import { usePulseAnimation } from '../../hooks/usePulseAnimation';

const TREND_ICONS = Object.freeze({
  up: '↑',
  down: '↓',
  neutral: '→',
});

const TREND_COLORS = Object.freeze({
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-400',
});

const CATEGORY_BORDERS = Object.freeze({
  business: 'border-l-blue-500',
  operations: 'border-l-emerald-500',
  risk: 'border-l-amber-500',
  innovation: 'border-l-purple-500',
  partnership: 'border-l-cyan-500',
  default: 'border-l-gray-300',
});

const CATEGORY_PULSE_COLORS = Object.freeze({
  business: 'bg-blue-400',
  operations: 'bg-emerald-400',
  risk: 'bg-amber-400',
  innovation: 'bg-purple-400',
  partnership: 'bg-cyan-400',
  default: 'bg-blue-400',
});

function TrendIndicator({ trend, trendValue, trendLabel }) {
  const icon = TREND_ICONS[trend] || TREND_ICONS.neutral;
  const colorClass = TREND_COLORS[trend] || TREND_COLORS.neutral;

  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`text-sm font-bold ${colorClass}`} aria-hidden="true">
        {icon}
      </span>
      <span className={`text-sm font-semibold ${colorClass}`}>
        {trendValue}
      </span>
      {trendLabel && (
        <span className="text-xs text-gray-400 ml-0.5">{trendLabel}</span>
      )}
    </div>
  );
}

TrendIndicator.propTypes = {
  trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
  trendValue: PropTypes.string.isRequired,
  trendLabel: PropTypes.string,
};

TrendIndicator.defaultProps = {
  trendLabel: '',
};

function PulseDot({ category }) {
  const pulseActive = usePulseAnimation();
  const colorClass = CATEGORY_PULSE_COLORS[category] || CATEGORY_PULSE_COLORS.default;

  return (
    <span
      className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${colorClass} ${
        pulseActive ? 'animate-pulse-glow' : ''
      }`}
      role="status"
      aria-label="AI analysis active"
    />
  );
}

PulseDot.propTypes = {
  category: PropTypes.string,
};

PulseDot.defaultProps = {
  category: 'default',
};

function MetricCard({ data, showPulse }) {
  const {
    title,
    value,
    trend,
    trendValue,
    trendLabel,
    aiInsight,
    category = 'default',
  } = data;

  const borderClass = CATEGORY_BORDERS[category] || CATEGORY_BORDERS.default;

  return (
    <div
      className={`
        relative bg-white/80 backdrop-blur-sm rounded-xl p-5
        border border-gray-100 border-l-4
        ${borderClass}
        shadow-sm hover:shadow-lg hover:scale-[1.02]
        transition-all duration-200 ease-out
        w-full
      `}
      role="region"
      aria-label={`${title}: ${value}`}
    >
      {showPulse && <PulseDot category={category} />}

      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 pr-6">
        {title}
      </h3>

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>

      <TrendIndicator
        trend={trend}
        trendValue={trendValue}
        trendLabel={trendLabel}
      />

      {aiInsight && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-blue-600">💡 AI Analysis:</span>{' '}
            {aiInsight}
          </p>
        </div>
      )}
    </div>
  );
}

MetricCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
    trendValue: PropTypes.string.isRequired,
    trendLabel: PropTypes.string,
    aiInsight: PropTypes.string,
    category: PropTypes.oneOf([
      'business',
      'operations',
      'risk',
      'innovation',
      'partnership',
    ]),
  }).isRequired,
  showPulse: PropTypes.bool,
};

MetricCard.defaultProps = {
  showPulse: false,
};

function areEqual(prevProps, nextProps) {
  if (prevProps.showPulse !== nextProps.showPulse) {
    return false;
  }

  const prevData = prevProps.data;
  const nextData = nextProps.data;

  if (prevData === nextData) {
    return true;
  }

  return (
    prevData.title === nextData.title &&
    prevData.value === nextData.value &&
    prevData.trend === nextData.trend &&
    prevData.trendValue === nextData.trendValue &&
    prevData.trendLabel === nextData.trendLabel &&
    prevData.aiInsight === nextData.aiInsight &&
    prevData.category === nextData.category
  );
}

export default React.memo(MetricCard, areEqual);