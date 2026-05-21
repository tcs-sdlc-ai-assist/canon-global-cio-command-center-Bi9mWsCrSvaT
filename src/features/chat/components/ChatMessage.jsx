import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function formatRelativeTime(timestamp) {
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp)) {
    return '';
  }

  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 0) {
    return 'Just now';
  }

  if (diff < MINUTE_MS) {
    return 'Just now';
  }

  if (diff < 2 * MINUTE_MS) {
    return '1 min ago';
  }

  if (diff < HOUR_MS) {
    const minutes = Math.floor(diff / MINUTE_MS);
    return `${minutes} min ago`;
  }

  if (diff < 2 * HOUR_MS) {
    return '1 hour ago';
  }

  if (diff < DAY_MS) {
    const hours = Math.floor(diff / HOUR_MS);
    return `${hours} hours ago`;
  }

  if (diff < 2 * DAY_MS) {
    return 'Yesterday';
  }

  const days = Math.floor(diff / DAY_MS);
  if (days < 30) {
    return `${days} days ago`;
  }

  const date = new Date(timestamp);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();

  if (year === currentYear) {
    return `${month} ${day}`;
  }

  return `${month} ${day}, ${year}`;
}

function MessageContent({ text }) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return null;
  }

  const paragraphs = text.split('\n').filter((line) => line.trim().length > 0);

  if (paragraphs.length === 0) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>;
  }

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            index > 0 ? 'mt-2' : ''
          }`}
        >
          {paragraph}
        </p>
      ))}
    </>
  );
}

MessageContent.propTypes = {
  text: PropTypes.string.isRequired,
};

function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  const relativeTime = useMemo(
    () => formatRelativeTime(message.timestamp),
    [message.timestamp]
  );

  const containerClasses = useMemo(
    () =>
      isUser
        ? 'flex items-start gap-3 px-4 py-3 justify-end'
        : 'flex items-start gap-3 px-4 py-3',
    [isUser]
  );

  const bubbleClasses = useMemo(
    () =>
      isUser
        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]'
        : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-md px-4 py-3 max-w-[80%]',
    [isUser]
  );

  const timeClasses = useMemo(
    () =>
      isUser
        ? 'text-right text-xs text-blue-200 mt-1.5'
        : 'text-left text-xs text-gray-400 mt-1.5',
    [isUser]
  );

  const ariaLabel = isUser ? 'User message' : 'Assistant message';

  return (
    <div
      className={containerClasses}
      role="article"
      aria-label={ariaLabel}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <span className="text-blue-600 text-sm">🤖</span>
        </div>
      )}

      <div className="flex flex-col min-w-0">
        <div className={bubbleClasses}>
          <MessageContent text={message.text} />
        </div>

        {relativeTime && (
          <span className={timeClasses} aria-label={`Sent ${relativeTime}`}>
            {relativeTime}
          </span>
        )}
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0"
          aria-hidden="true"
        >
          MW
        </div>
      )}
    </div>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    category: PropTypes.string,
  }).isRequired,
};

export default React.memo(ChatMessage);