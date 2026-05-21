import React from 'react';
import PropTypes from 'prop-types';
import ActionChip from './ActionChip';

const CONFIDENCE_BADGE_CLASSES = Object.freeze({
  container: 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200',
  dot: 'w-2 h-2 rounded-full bg-green-500',
  label: 'text-xs font-semibold text-green-700',
  checkmark: 'text-green-600',
});

function ConfidenceBadge({ confidenceLevel, confidenceLabel }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className={CONFIDENCE_BADGE_CLASSES.container}
        role="status"
        aria-label={`AI confidence: ${confidenceLabel} at ${confidenceLevel}%`}
      >
        <span className={CONFIDENCE_BADGE_CLASSES.dot} aria-hidden="true" />
        <span className={CONFIDENCE_BADGE_CLASSES.checkmark} aria-hidden="true">
          ✓
        </span>
        <span className={CONFIDENCE_BADGE_CLASSES.label}>
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

function SectionHeader({ title }) {
  return (
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
      {title}
    </h3>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

function ChipList({ items, section }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <ActionChip
          key={item.id}
          label={item.label}
          section={section}
          variant={item.variant || 'default'}
        />
      ))}
    </div>
  );
}

ChipList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['default', 'primary', 'outline']),
    })
  ).isRequired,
  section: PropTypes.string.isRequired,
};

function AIInsightsPanel({ config, sections }) {
  const { confidenceLevel, confidenceLabel } = config;

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="AI Intelligence Summary"
      data-section="ai-insights"
    >
      <ConfidenceBadge
        confidenceLevel={confidenceLevel}
        confidenceLabel={confidenceLabel}
      />

      {sections.map((sectionData) => (
        <div key={sectionData.id} className="mb-5 last:mb-0">
          <SectionHeader title={sectionData.title} />
          <ChipList
            items={sectionData.items}
            section={sectionData.section || 'ai-insights'}
          />
        </div>
      ))}
    </section>
  );
}

AIInsightsPanel.propTypes = {
  config: PropTypes.shape({
    confidenceLevel: PropTypes.number.isRequired,
    confidenceLabel: PropTypes.string.isRequired,
  }).isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      section: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          variant: PropTypes.oneOf(['default', 'primary', 'outline']),
        })
      ).isRequired,
    })
  ).isRequired,
};

export default React.memo(AIInsightsPanel);