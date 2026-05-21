import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useChat } from '../../../hooks/useChat';

function ChatToggle() {
  const { isOpen, toggleChat } = useChat();

  const handleClick = useCallback(() => {
    toggleChat();
  }, [toggleChat]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleChat();
      }
    },
    [toggleChat]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        fixed bottom-6 right-6 z-40
        w-14 h-14 rounded-full
        bg-blue-600 text-white
        shadow-lg hover:shadow-xl hover:bg-blue-700
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        transition-all duration-200 ease-out
        flex items-center justify-center
        text-2xl
      `.trim()}
      aria-label={isOpen ? 'Close AI Chat Assistant' : 'Open AI Chat Assistant'}
      aria-expanded={isOpen}
      data-testid="chat-toggle"
    >
      <span
        className="transition-transform duration-200 ease-out"
        aria-hidden="true"
      >
        {isOpen ? '×' : '🤖'}
      </span>
    </button>
  );
}

ChatToggle.propTypes = {};

export default React.memo(ChatToggle);