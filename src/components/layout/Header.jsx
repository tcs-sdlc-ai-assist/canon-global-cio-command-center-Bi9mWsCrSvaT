import React from 'react';
import PropTypes from 'prop-types';
import { useDashboard } from '../../hooks/useDashboard';

function BellIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

BellIcon.propTypes = {
  className: PropTypes.string,
};

BellIcon.defaultProps = {
  className: 'w-5 h-5',
};

function Header() {
  const { userIdentity, notificationCount } = useDashboard();

  const displayCount =
    notificationCount > 99 ? '99+' : String(notificationCount);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
      role="banner"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xl font-bold tracking-tight text-gray-900 whitespace-nowrap">
            Canon
          </span>
          <span className="hidden md:inline text-xs uppercase tracking-widest text-gray-400 whitespace-nowrap">
            global cio command center
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <button
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`${displayCount} notifications`}
            data-testid="notification-badge"
            type="button"
          >
            <BellIcon className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {displayCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0"
              aria-hidden="true"
            >
              {userIdentity.avatarInitials}
            </div>
            <div className="hidden md:block text-right min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userIdentity.name}
              </p>
              <p className="text-xs text-gray-500 lowercase truncate">
                {userIdentity.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;