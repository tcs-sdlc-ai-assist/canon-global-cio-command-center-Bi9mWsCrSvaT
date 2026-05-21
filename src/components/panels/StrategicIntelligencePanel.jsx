import React from 'react';
import PropTypes from 'prop-types';
import ActionChip from '../shared/ActionChip';
import TrendIndicator from '../shared/TrendIndicator';
import {
  PARTNERSHIP_INTELLIGENCE_CONFIG,
  PERFORMANCE_EXCELLENCE_NARRATIVE,
  EXPANSION_OPPORTUNITY_NARRATIVE,
  PARTNERSHIP_ACTION_CHIPS,
} from '../../data/partnerships';

function ConfidenceBadge({ confidenceLevel, confidenceLabel }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200"
        role="status"
        aria-label={`AI confidence: ${confidenceLabel} at ${confidenceLevel}%`}
      >
        <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
        <span className="text-green-600" aria-hidden="true">
          ✓
        </span>
        <span className="text-xs font-semibold text-green-700">
          {confidenceLabel} ({confidenceLevel}%)
        </span>
      </div>
    </div>
  );
}

ConfidenceBadge.propTypes = {
  confidenceLevel: PropTypes.number.isRequired,
  confidenceLabel: PropTypes.string.isRequired,
};

function NarrativeSection({ narrative }) {
  const { title, content, metrics, chips } = narrative;

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
        {title}
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        {content}
      </p>

      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-100"
            >
              <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
              <p className="text-lg font-bold text-gray-900">{metric.value}</p>
              <TrendIndicator
                trend={metric.trend}
                trendValue={metric.trendValue}
                trendLabel={metric.trendLabel}
              />
            </div>
          ))}
        </div>
      )}

      {chips && chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chipLabel, index) => (
            <ActionChip
              key={`${narrative.id}-chip-${index}`}
              label={chipLabel}
              section="partnership-intel"
              variant="default"
              className="ai-action-chip"
            />
          ))}
        </div>
      )}
    </div>
  );
}

NarrativeSection.propTypes = {
  narrative: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    metrics: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        trend: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
        trendValue: PropTypes.string.isRequired,
        trendLabel: PropTypes.string,
      })
    ),
    chips: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

function StrategicIntelligencePanel() {
  const { confidenceLevel, confidenceLabel } = PARTNERSHIP_INTELLIGENCE_CONFIG;

  const actionChips = PARTNERSHIP_ACTION_CHIPS.filter(
    (chip) =>
      chip.id === 'pac-business-case' ||
      chip.id === 'pac-contract-strategy' ||
      chip.id === 'pac-board-approval'
  );

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="Partnership Strategic Intelligence"
      data-section="partnership-intel"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Partnership Strategic Intelligence
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          AI-powered insights and recommendations for the TCS strategic
          partnership
        </p>
      </div>

      <ConfidenceBadge
        confidenceLevel={confidenceLevel}
        confidenceLabel={confidenceLabel}
      />

      <NarrativeSection narrative={PERFORMANCE_EXCELLENCE_NARRATIVE} />

      <NarrativeSection narrative={EXPANSION_OPPORTUNITY_NARRATIVE} />

      <div className="mt-6 pt-5 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Recommended Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          {actionChips.map((chip) => (
            <ActionChip
              key={chip.id}
              label={chip.label}
              section={chip.section}
              variant={chip.variant}
              className="ai-action-chip"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

StrategicIntelligencePanel.propTypes = {};

export default React.memo(StrategicIntelligencePanel);