import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ChatProvider,
  ChatStateContext,
  ChatDispatchContext,
  useChatState,
  useChatDispatch,
} from '../ChatContext';
import { matchKeyword } from '../../utils/keywordMatch';

vi.mock('../../utils/keywordMatch', () => ({
  matchKeyword: vi.fn(),
}));

const STORAGE_KEY = 'cio_dashboard_chat_history';

function TestConsumer() {
  const state = useChatState();
  const dispatch = useChatDispatch();

  return (
    <div>
      <div data-testid="is-open">{String(state.isOpen)}</div>
      <div data-testid="is-typing">{String(state.isTyping)}</div>
      <div data-testid="message-count">{state.messages.length}</div>
      <div data-testid="input-value">{state.inputValue}</div>
      <ul data-testid="messages">
        {state.messages.map((msg) => (
          <li key={msg.id} data-role={msg.role} data-category={msg.category || 'none'}>
            {msg.text}
          </li>
        ))}
      </ul>
      <button
        data-testid="toggle-chat"
        onClick={dispatch.toggleChat}
      >
        Toggle
      </button>
      <button
        data-testid="open-chat"
        onClick={dispatch.openChat}
      >
        Open
      </button>
      <button
        data-testid="close-chat"
        onClick={dispatch.closeChat}
      >
        Close
      </button>
      <button
        data-testid="send-message"
        onClick={() => dispatch.sendMessage('Hello from test')}
      >
        Send
      </button>
      <button
        data-testid="set-input"
        onClick={() => dispatch.setInputValue('test input')}
      >
        Set Input
      </button>
      <button
        data-testid="open-with-prompt"
        onClick={() => dispatch.openWithPrompt('Analyze Q4 board presentation')}
      >
        Open With Prompt
      </button>
      <button
        data-testid="clear-history"
        onClick={dispatch.clearHistory}
      >
        Clear
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <ChatProvider>
      <TestConsumer />
    </ChatProvider>
  );
}

describe('ChatContext', () => {
  let mockStorage;

  beforeEach(() => {
    vi.useFakeTimers();

    mockStorage = {
      store: {},
      getItem: vi.fn(function (key) {
        if (key in this.store) {
          return this.store[key];
        }
        return null;
      }),
      setItem: vi.fn(function (key, value) {
        this.store[key] = String(value);
      }),
      removeItem: vi.fn(function (key) {
        delete this.store[key];
      }),
      clear: vi.fn(function () {
        this.store = {};
      }),
    };

    vi.stubGlobal('localStorage', mockStorage);

    matchKeyword.mockReturnValue({
      response: 'Here is your Q4 board analysis.',
      category: 'q4_board',
      delay: 1000,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with chat closed', () => {
      renderWithProvider();
      expect(screen.getByTestId('is-open').textContent).toBe('false');
    });

    it('starts with empty messages', () => {
      renderWithProvider();
      expect(screen.getByTestId('message-count').textContent).toBe('0');
    });

    it('starts with empty input value', () => {
      renderWithProvider();
      expect(screen.getByTestId('input-value').textContent).toBe('');
    });

    it('starts with isTyping false', () => {
      renderWithProvider();
      expect(screen.getByTestId('is-typing').textContent).toBe('false');
    });
  });

  describe('toggleChat', () => {
    it('opens chat when closed', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('toggle-chat'));
      expect(screen.getByTestId('is-open').textContent).toBe('true');
    });

    it('closes chat when open', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('toggle-chat'));
      userEvent.click(screen.getByTestId('toggle-chat'));
      expect(screen.getByTestId('is-open').textContent).toBe('false');
    });
  });

  describe('openChat / closeChat', () => {
    it('openChat opens the chat', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('open-chat'));
      expect(screen.getByTestId('is-open').textContent).toBe('true');
    });

    it('openChat is idempotent when already open', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('open-chat'));
      userEvent.click(screen.getByTestId('open-chat'));
      expect(screen.getByTestId('is-open').textContent).toBe('true');
    });

    it('closeChat closes the chat', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('open-chat'));
      userEvent.click(screen.getByTestId('close-chat'));
      expect(screen.getByTestId('is-open').textContent).toBe('false');
    });

    it('closeChat is idempotent when already closed', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('close-chat'));
      expect(screen.getByTestId('is-open').textContent).toBe('false');
    });
  });

  describe('sendMessage', () => {
    it('adds a user message to the messages array', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      expect(screen.getByTestId('message-count').textContent).toBe('1');

      const messages = screen.getByTestId('messages').children;
      expect(messages[0].getAttribute('data-role')).toBe('user');
      expect(messages[0].textContent).toBe('Hello from test');
    });

    it('sets isTyping to true after sending', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));
      expect(screen.getByTestId('is-typing').textContent).toBe('true');
    });

    it('clears input value after sending', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('set-input'));
      expect(screen.getByTestId('input-value').textContent).toBe('test input');
      userEvent.click(screen.getByTestId('send-message'));
      expect(screen.getByTestId('input-value').textContent).toBe('');
    });

    it('adds an assistant response after the simulated delay', async () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      expect(screen.getByTestId('message-count').textContent).toBe('1');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-count').textContent).toBe('2');
      });

      const messages = screen.getByTestId('messages').children;
      expect(messages[1].getAttribute('data-role')).toBe('assistant');
      expect(messages[1].textContent).toBe('Here is your Q4 board analysis.');
      expect(messages[1].getAttribute('data-category')).toBe('q4_board');
    });

    it('sets isTyping to false after assistant response', async () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      expect(screen.getByTestId('is-typing').textContent).toBe('true');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('is-typing').textContent).toBe('false');
      });
    });

    it('calls matchKeyword with the user message text', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      expect(matchKeyword).toHaveBeenCalledWith('Hello from test');
    });

    it('does not send empty messages', () => {
      const { rerender } = renderWithProvider();

      const dispatch = {
        sendMessage: vi.fn(),
        setInputValue: vi.fn(),
        toggleChat: vi.fn(),
        openChat: vi.fn(),
        closeChat: vi.fn(),
        openWithPrompt: vi.fn(),
        clearHistory: vi.fn(),
        inputRef: { current: null },
      };

      act(() => {
        dispatch.sendMessage('');
      });

      expect(dispatch.sendMessage).toHaveBeenCalledWith('');
    });

    it('truncates messages longer than 2000 characters', () => {
      renderWithProvider();

      const longText = 'A'.repeat(2500);

      const dispatch = {
        sendMessage: vi.fn(),
        setInputValue: vi.fn(),
        toggleChat: vi.fn(),
        openChat: vi.fn(),
        closeChat: vi.fn(),
        openWithPrompt: vi.fn(),
        clearHistory: vi.fn(),
        inputRef: { current: null },
      };

      act(() => {
        dispatch.sendMessage(longText);
      });

      expect(dispatch.sendMessage).toHaveBeenCalled();
    });

    it('cancels pending assistant response when a new message is sent', async () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      expect(screen.getByTestId('message-count').textContent).toBe('1');

      act(() => {
        vi.advanceTimersByTime(500);
      });

      userEvent.click(screen.getByTestId('send-message'));

      expect(screen.getByTestId('message-count').textContent).toBe('2');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-count').textContent).toBe('3');
      });

      const messages = screen.getByTestId('messages').children;
      expect(messages[0].getAttribute('data-role')).toBe('user');
      expect(messages[1].getAttribute('data-role')).toBe('user');
      expect(messages[2].getAttribute('data-role')).toBe('assistant');
    });
  });

  describe('setInputValue', () => {
    it('updates the input value', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('set-input'));
      expect(screen.getByTestId('input-value').textContent).toBe('test input');
    });

    it('truncates input value longer than 2000 characters', () => {
      renderWithProvider();

      const longValue = 'B'.repeat(2500);

      const dispatch = {
        sendMessage: vi.fn(),
        setInputValue: vi.fn(),
        toggleChat: vi.fn(),
        openChat: vi.fn(),
        closeChat: vi.fn(),
        openWithPrompt: vi.fn(),
        clearHistory: vi.fn(),
        inputRef: { current: null },
      };

      act(() => {
        dispatch.setInputValue(longValue);
      });

      expect(dispatch.setInputValue).toHaveBeenCalled();
    });
  });

  describe('openWithPrompt', () => {
    it('opens the chat if it is closed', () => {
      renderWithProvider();
      expect(screen.getByTestId('is-open').textContent).toBe('false');
      userEvent.click(screen.getByTestId('open-with-prompt'));
      expect(screen.getByTestId('is-open').textContent).toBe('true');
    });

    it('sets the input value to the prompt text', () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('open-with-prompt'));
      expect(screen.getByTestId('input-value').textContent).toBe('Analyze Q4 board presentation');
    });

    it('does nothing when prompt is empty', () => {
      renderWithProvider();

      const dispatch = {
        sendMessage: vi.fn(),
        setInputValue: vi.fn(),
        toggleChat: vi.fn(),
        openChat: vi.fn(),
        closeChat: vi.fn(),
        openWithPrompt: vi.fn(),
        clearHistory: vi.fn(),
        inputRef: { current: null },
      };

      act(() => {
        dispatch.openWithPrompt('');
      });

      expect(dispatch.openWithPrompt).toHaveBeenCalledWith('');
    });

    it('truncates prompt longer than 500 characters', () => {
      renderWithProvider();

      const longPrompt = 'C'.repeat(600);

      const dispatch = {
        sendMessage: vi.fn(),
        setInputValue: vi.fn(),
        toggleChat: vi.fn(),
        openChat: vi.fn(),
        closeChat: vi.fn(),
        openWithPrompt: vi.fn(),
        clearHistory: vi.fn(),
        inputRef: { current: null },
      };

      act(() => {
        dispatch.openWithPrompt(longPrompt);
      });

      expect(dispatch.openWithPrompt).toHaveBeenCalled();
    });
  });

  describe('clearHistory', () => {
    it('removes all messages', async () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-count').textContent).toBe('2');
      });

      userEvent.click(screen.getByTestId('clear-history'));

      expect(screen.getByTestId('message-count').textContent).toBe('0');
    });

    it('removes chat history from localStorage', async () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-count').textContent).toBe('2');
      });

      userEvent.click(screen.getByTestId('clear-history'));

      expect(mockStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });
  });

  describe('localStorage persistence', () => {
    it('persists messages to localStorage after sending', async () => {
      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-count').textContent).toBe('2');
      });

      expect(mockStorage.setItem).toHaveBeenCalled();

      const setItemCalls = mockStorage.setItem.mock.calls.filter(
        (call) => call[0] === STORAGE_KEY
      );

      expect(setItemCalls.length).toBeGreaterThan(0);

      const lastCall = setItemCalls[setItemCalls.length - 1];
      const stored = JSON.parse(lastCall[1]);
      expect(stored.version).toBe(1);
      expect(stored.messages).toHaveLength(2);
      expect(stored.messages[0].role).toBe('user');
      expect(stored.messages[1].role).toBe('assistant');
    });

    it('restores messages from localStorage on mount', () => {
      const storedMessages = [
        {
          id: 'existing-1',
          role: 'user',
          text: 'Previous question',
          timestamp: Date.now() - 10000,
          category: null,
        },
        {
          id: 'existing-2',
          role: 'assistant',
          text: 'Previous answer',
          timestamp: Date.now() - 9000,
          category: 'q4_board',
        },
      ];

      mockStorage.store[STORAGE_KEY] = JSON.stringify({
        version: 1,
        messages: storedMessages,
      });

      renderWithProvider();

      expect(screen.getByTestId('message-count').textContent).toBe('2');

      const messages = screen.getByTestId('messages').children;
      expect(messages[0].textContent).toBe('Previous question');
      expect(messages[1].textContent).toBe('Previous answer');
    });

    it('restores from legacy array format (no version wrapper)', () => {
      const storedMessages = [
        {
          id: 'legacy-1',
          role: 'user',
          text: 'Legacy question',
          timestamp: Date.now() - 20000,
          category: null,
        },
      ];

      mockStorage.store[STORAGE_KEY] = JSON.stringify(storedMessages);

      renderWithProvider();

      expect(screen.getByTestId('message-count').textContent).toBe('1');
      expect(screen.getByTestId('messages').children[0].textContent).toBe(
        'Legacy question'
      );
    });

    it('handles corrupted localStorage data gracefully', () => {
      mockStorage.store[STORAGE_KEY] = 'not-valid-json{{{';

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      renderWithProvider();

      expect(screen.getByTestId('message-count').textContent).toBe('0');

      consoleWarnSpy.mockRestore();
    });

    it('handles localStorage.getItem throwing an error', () => {
      mockStorage.getItem = vi.fn(() => {
        throw new Error('Storage unavailable');
      });

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      renderWithProvider();

      expect(screen.getByTestId('message-count').textContent).toBe('0');

      consoleWarnSpy.mockRestore();
    });

    it('handles localStorage.setItem throwing QuotaExceededError', async () => {
      mockStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      renderWithProvider();
      userEvent.click(screen.getByTestId('send-message'));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(screen.getByTestId('message-count').textContent).toBe('2');
      });

      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('filters out expired messages on restore', () => {
      const oldTimestamp = Date.now() - 31 * 24 * 60 * 60 * 1000;
      const recentTimestamp = Date.now() - 1000;

      const storedMessages = [
        {
          id: 'old-1',
          role: 'user',
          text: 'Old question',
          timestamp: oldTimestamp,
          category: null,
        },
        {
          id: 'recent-1',
          role: 'user',
          text: 'Recent question',
          timestamp: recentTimestamp,
          category: null,
        },
      ];

      mockStorage.store[STORAGE_KEY] = JSON.stringify({
        version: 1,
        messages: storedMessages,
      });

      renderWithProvider();

      expect(screen.getByTestId('message-count').textContent).toBe('1');
      expect(screen.getByTestId('messages').children[0].textContent).toBe(
        'Recent question'
      );
    });

    it('filters out messages with invalid structure on restore', () => {
      const storedMessages = [
        {
          id: 'valid-1',
          role: 'user',
          text: 'Valid message',
          timestamp: Date.now(),
          category: null,
        },
        {
          id: 'invalid-1',
          role: 'invalid-role',
          text: '',
          timestamp: 'not-a-number',
        },
        null,
        'not-an-object',
      ];

      mockStorage.store[STORAGE_KEY] = JSON.stringify({
        version: 1,
        messages: storedMessages,
      });

      renderWithProvider();

      expect(screen.getByTestId('message-count').textContent).toBe('1');
      expect(screen.getByTestId('messages').children[0].textContent).toBe(
        'Valid message'
      );
    });

    it('trims history when exceeding MAX_HISTORY_SIZE', async () => {
      const manyMessages = [];
      for (let i = 0; i < 250; i++) {
        manyMessages.push({
          id: `msg-${i}`,
          role: i % 2 === 0 ? 'user' : 'assistant',
          text: `Message ${i}`,
          timestamp: Date.now() - (250 - i) * 1000,
          category: null,
        });
      }

      mockStorage.store[STORAGE_KEY] = JSON.stringify({
        version: 1,
        messages: manyMessages,
      });

      renderWithProvider();

      const messageCount = parseInt(
        screen.getByTestId('message-count').textContent,
        10
      );
      expect(messageCount).toBeLessThanOrEqual(200);
    });
  });

  describe('context error boundaries', () => {
    it('throws when useChatState is used outside ChatProvider', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      function BadComponent() {
        useChatState();
        return null;
      }

      expect(() => render(<BadComponent />)).toThrow(
        'useChatState must be used within a <ChatProvider>'
      );

      consoleErrorSpy.mockRestore();
    });

    it('throws when useChatDispatch is used outside ChatProvider', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      function BadComponent() {
        useChatDispatch();
        return null;
      }

      expect(() => render(<BadComponent />)).toThrow(
        'useChatDispatch must be used within a <ChatProvider>'
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('message rate limiting', () => {
    it('prevents sending messages faster than MIN_SEND_INTERVAL_MS', () => {
      renderWithProvider();

      userEvent.click(screen.getByTestId('send-message'));
      expect(screen.getByTestId('message-count').textContent).toBe('1');

      userEvent.click(screen.getByTestId('send-message'));
      expect(screen.getByTestId('message-count').textContent).toBe('1');
    });
  });

  describe('cleanup', () => {
    it('clears pending timeout on unmount', () => {
      const { unmount } = renderWithProvider();

      userEvent.click(screen.getByTestId('send-message'));

      unmount();

      act(() => {
        vi.advanceTimersByTime(2000);
      });
    });
  });
});