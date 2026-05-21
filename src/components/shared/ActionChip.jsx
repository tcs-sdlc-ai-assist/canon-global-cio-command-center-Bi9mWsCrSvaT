import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const VARIANT_CLASSES = Object.freeze({
  default:
    'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300',
  primary:
    'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-400',
  outline:
    'bg-transparent text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600',
});

function ActionChip({ label, section, variant, onClick, className }) {
  const handleClick = useCallback(
    (event) => {
      if (typeof onClick === 'function') {
        onClick(event);
      }
    },
    [onClick]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(event);
      }
    },
    [handleClick]
  );

  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default;

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        action-chip ai-action-chip
        inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium
        border transition-colors duration-150 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
        ${variantClass}
        ${className || ''}
      `.trim()}
      aria-label={`Ask AI: ${label}`}
      role="button"
      tabIndex={0}
      data-section={section}
    >
      {label}
    </button>
  );
}

ActionChip.propTypes = {
  label: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'outline']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

ActionChip.defaultProps = {
  variant: 'default',
  onClick: undefined,
  className: '',
};

export default React.memo(ActionChip);