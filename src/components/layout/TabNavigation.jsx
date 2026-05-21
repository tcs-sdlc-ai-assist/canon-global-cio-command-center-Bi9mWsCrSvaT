import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDashboard } from '../../hooks/useDashboard';
import { TAB_CONFIG, isValidTabId } from '../../constants/tabs';
import { trackTabSwitch } from '../../utils/eventTracking';

function TabNavigation() {
  const { activeTab, setActiveTab } = useDashboard();
  const [focusedIndex, setFocusedIndex] = useState(() => {
    const activeIndex = TAB_CONFIG.findIndex(tab => tab.id === activeTab);
    return activeIndex !== -1 ? activeIndex : 0;
  });
  const tabRefs = useRef([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const activeIndex = TAB_CONFIG.findIndex(tab => tab.id === activeTab);
    if (activeIndex !== -1) {
      setFocusedIndex(activeIndex);
    }
  }, [activeTab]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeElement = tabRefs.current[focusedIndex];

    if (container && activeElement) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();

      const isFullyVisible =
        elementRect.left >= containerRect.left &&
        elementRect.right <= containerRect.right;

      if (!isFullyVisible) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [focusedIndex]);

  const handleTabClick = useCallback(
    (tabId) => {
      if (tabId === activeTab) {
        return;
      }

      if (!isValidTabId(tabId)) {
        console.warn('[TabNavigation] Invalid tab ID, ignoring click:', tabId);
        return;
      }

      setActiveTab(tabId);
      trackTabSwitch(tabId);

      const newIndex = TAB_CONFIG.findIndex(tab => tab.id === tabId);
      if (newIndex !== -1) {
        setFocusedIndex(newIndex);
        if (tabRefs.current[newIndex]) {
          tabRefs.current[newIndex].focus();
        }
      }
    },
    [activeTab, setActiveTab]
  );

  const handleKeyDown = useCallback(
    (event) => {
      const tabCount = TAB_CONFIG.length;

      let newIndex = focusedIndex;
      let shouldActivate = false;

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          newIndex = (focusedIndex + 1) % tabCount;
          break;

        case 'ArrowLeft':
          event.preventDefault();
          newIndex = (focusedIndex - 1 + tabCount) % tabCount;
          break;

        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;

        case 'End':
          event.preventDefault();
          newIndex = tabCount - 1;
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          shouldActivate = true;
          break;

        default:
          return;
      }

      if (shouldActivate) {
        const tabId = TAB_CONFIG[focusedIndex].id;
        handleTabClick(tabId);
        return;
      }

      if (newIndex !== focusedIndex) {
        setFocusedIndex(newIndex);
        if (tabRefs.current[newIndex]) {
          tabRefs.current[newIndex].focus();
        }
      }
    },
    [focusedIndex, handleTabClick]
  );

  const setTabRef = useCallback((index) => (element) => {
    tabRefs.current[index] = element;
  }, []);

  return (
    <nav
      className="border-b border-gray-200 bg-white"
      role="tablist"
      aria-label="Dashboard sections"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={scrollContainerRef}
        className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 flex overflow-x-auto scrollbar-hide"
      >
        {TAB_CONFIG.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const isFocused = index === focusedIndex;

          return (
            <button
              key={tab.id}
              ref={setTabRef(index)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset
                ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

TabNavigation.propTypes = {};

export default TabNavigation;