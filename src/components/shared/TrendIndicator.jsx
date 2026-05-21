import React from 'react';
import PropTypes from 'prop-types';

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

export default React.memo(TrendIndicator);