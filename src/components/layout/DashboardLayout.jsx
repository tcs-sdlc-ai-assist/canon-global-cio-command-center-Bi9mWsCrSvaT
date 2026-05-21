import React from 'react';
import PropTypes from 'prop-types';
import { useActionChipBridge } from '../../hooks/useActionChipBridge';

function DashboardLayout({ children }) {
  const handleChipClick = useActionChipBridge();

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      onClick={handleChipClick}
    >
      {children}
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;