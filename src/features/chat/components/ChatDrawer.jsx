import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useChatState, useChatDispatch } from '../../../context/ChatContext';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

function ChatDrawer() {
  const { isOpen } = useChatState();
  const { closeChat } = useChatDispatch();
  const drawerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;

      requestAnimationFrame(() => {
        if (drawerRef.current) {
          drawerRef.current.focus();
        }
      });
    } else if (previousFocusRef.current) {
      if (typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeChat();
      }
    },
    [closeChat]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
        aria-hidden="true"
        onClick={closeChat}
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-label="AI Chat Assistant"
        aria-modal="true"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`
          fixed z-40
          flex flex-col
          bg-white/95 backdrop-blur-md
          border border-gray-200
          shadow-2xl
          transition-all duration-300 ease-out
          ${
            isOpen
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0 pointer-events-none'
          }
          bottom-0 left-0 right-0
          w-full h-[calc(100vh-64px)]
          rounded-t-2xl
          md:bottom-20 md:right-6 md:left-auto
          md:w-[380px] md:h-[520px]
          md:rounded-2xl
        `.trim()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              🤖
            </span>
            <h2 className="text-sm font-semibold text-gray-900">
              AI Strategic Assistant
            </h2>
          </div>

          <button
            type="button"
            onClick={closeChat}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close chat"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <ChatMessages />

        <ChatInput />
      </div>
    </>
  );
}

ChatDrawer.propTypes = {};

export default React.memo(ChatDrawer);