import React from 'react';
import PropTypes from 'prop-types';

function MetricGroup({ title, subtitle, children, columns }) {
  const gridCols = columns || Math.min(children ? React.Children.count(children) : 1, 3);

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[gridCols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section
      className="mb-8"
      role="region"
      aria-label={title || 'Metric group'}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      <div className={`grid ${gridClass} gap-4 md:gap-6`}>
        {children}
      </div>
    </section>
  );
}

MetricGroup.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  columns: PropTypes.oneOf([1, 2, 3]),
};

MetricGroup.defaultProps = {
  title: '',
  subtitle: '',
  columns: undefined,
};

export default MetricGroup;