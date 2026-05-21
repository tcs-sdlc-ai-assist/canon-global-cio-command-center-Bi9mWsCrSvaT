import React from 'react';

function TypingIndicator() {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3"
      role="status"
      aria-label="Assistant is typing"
    >
      <div
        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
        aria-hidden="true"
      >
        <span className="text-blue-600 text-sm">🤖</span>
      </div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(TypingIndicator);