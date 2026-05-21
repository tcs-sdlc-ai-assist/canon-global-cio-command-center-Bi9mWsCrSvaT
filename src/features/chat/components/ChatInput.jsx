import React, { useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useChatState, useChatDispatch } from '../../../context/ChatContext';

const MAX_INPUT_LENGTH = 2000;

function ChatInput() {
  const { inputValue, isTyping } = useChatState();
  const { sendMessage, setInputValue, inputRef } = useChatDispatch();
  const localRef = useRef(null);

  const textareaRef = inputRef || localRef;

  useEffect(() => {
    if (textareaRef.current && !isTyping) {
      textareaRef.current.focus();
    }
  }, [isTyping, textareaRef]);

  const handleChange = useCallback(
    (event) => {
      const value = event.target.value;
      if (value.length <= MAX_INPUT_LENGTH) {
        setInputValue(value);
      }
    },
    [setInputValue]
  );

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length === 0 || isTyping) {
      return;
    }
    sendMessage(trimmed);
  }, [inputValue, isTyping, sendMessage]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const characterCount = inputValue.length;
  const isNearLimit = characterCount > MAX_INPUT_LENGTH * 0.85;
  const isAtLimit = characterCount >= MAX_INPUT_LENGTH;

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? 'AI is responding...' : 'Ask about strategic insights, regional performance, or Q4 board presentations...'}
            disabled={isTyping}
            rows={2}
            maxLength={MAX_INPUT_LENGTH}
            className={`
              w-full resize-none rounded-xl border px-4 py-2.5 pr-12
              text-sm leading-relaxed
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
              transition-colors duration-150
              ${isAtLimit ? 'border-amber-300 bg-amber-50' : 'border-gray-300 bg-white'}
            `.trim()}
            aria-label="Chat message input"
            aria-describedby="chat-input-hint"
            role="textbox"
          />

          {characterCount > 0 && (
            <span
              className={`
                absolute bottom-2 right-3 text-xs
                ${isNearLimit ? 'text-amber-600 font-semibold' : 'text-gray-400'}
              `.trim()}
              aria-live="polite"
              aria-atomic="true"
            >
              {isNearLimit && (
                <span>
                  {characterCount}/{MAX_INPUT_LENGTH}
                </span>
              )}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isTyping || inputValue.trim().length === 0}
          className={`
            flex-shrink-0 w-10 h-10 rounded-xl
            flex items-center justify-center
            transition-all duration-150
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1
            ${
              isTyping || inputValue.trim().length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm'
            }
          `.trim()}
          aria-label="Send message"
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>

      <div
        id="chat-input-hint"
        className="mt-2 flex items-center justify-between text-xs text-gray-400"
      >
        <span>
          <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-semibold border border-gray-200">
            Enter
          </kbd>
          {' '}to send ·{' '}
          <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-semibold border border-gray-200">
            Shift
          </kbd>
          {' + '}
          <kbd className="inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-semibold border border-gray-200">
            Enter
          </kbd>
          {' '}for new line
        </span>

        {characterCount > 0 && (
          <span className={isNearLimit ? 'text-amber-600 font-medium' : ''}>
            {characterCount}/{MAX_INPUT_LENGTH}
          </span>
        )}
      </div>
    </div>
  );
}

ChatInput.propTypes = {};

export default React.memo(ChatInput);