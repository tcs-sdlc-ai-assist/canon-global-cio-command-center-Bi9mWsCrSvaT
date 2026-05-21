import React from 'react';
import PropTypes from 'prop-types';
import { STATUS_LEVELS, STATUS_LABELS, STATUS_BG_COLORS } from '../../data/tables';

function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || 'Unknown';
  const colorClass = STATUS_BG_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUS_LEVELS)).isRequired,
};

export default React.memo(StatusBadge);