import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useChatState } from '../../../context/ChatContext';
import ChatMessage from './ChatMessage';

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3" role="status" aria-label="AI is typing">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <span className="text-blue-600 text-sm" aria-hidden="true">🤖</span>
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
        <span className="text-3xl" aria-hidden="true">🤖</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        AI Strategic Assistant
      </h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        Ask me about strategic insights, regional performance, innovation portfolio, TCS partnership, or Q4 board presentations.
      </p>
    </div>
  );
}

function ChatMessages() {
  const { messages, isTyping } = useChatState();
  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    scrollToBottom('auto');
  }, [scrollToBottom]);

  if (!messages || messages.length === 0) {
    return (
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      <div className="py-3">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} aria-hidden="true" />
      </div>
    </div>
  );
}

ChatMessages.propTypes = {};

export default React.memo(ChatMessages);