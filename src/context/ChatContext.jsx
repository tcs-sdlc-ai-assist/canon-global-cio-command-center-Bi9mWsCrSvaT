import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { matchKeyword } from '../utils/keywordMatch';
import { trackChatEvent } from '../utils/eventTracking';

export const ChatStateContext = createContext(null);
export const ChatDispatchContext = createContext(null);

const STORAGE_KEY = 'cio_dashboard_chat_history';
const MAX_HISTORY_SIZE = 200;
const HISTORY_TTL_DAYS = 30;
const MIN_SEND_INTERVAL_MS = 300;

const ACTION_TYPES = Object.freeze({
  TOGGLE_CHAT: 'TOGGLE_CHAT',
  OPEN_CHAT: 'OPEN_CHAT',
  CLOSE_CHAT: 'CLOSE_CHAT',
  ADD_USER_MESSAGE: 'ADD_USER_MESSAGE',
  ADD_ASSISTANT_MESSAGE: 'ADD_ASSISTANT_MESSAGE',
  SET_INPUT_VALUE: 'SET_INPUT_VALUE',
  SET_TYPING: 'SET_TYPING',
  RESTORE_HISTORY: 'RESTORE_HISTORY',
  CLEAR_INPUT: 'CLEAR_INPUT',
});

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function createMessage(role, text, category = null) {
  return {
    id: generateId(),
    role,
    text,
    timestamp: Date.now(),
    category,
  };
}

function pruneExpiredMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [];
  }

  const cutoff = Date.now() - HISTORY_TTL_DAYS * 24 * 60 * 60 * 1000;

  return messages.filter(msg => {
    if (!msg || typeof msg !== 'object') return false;
    if (!msg.id || !msg.role || !msg.text || !msg.timestamp) return false;
    if (msg.role !== 'user' && msg.role !== 'assistant') return false;
    if (msg.timestamp < cutoff) return false;
    return true;
  });
}

function trimHistory(messages) {
  if (messages.length <= MAX_HISTORY_SIZE) {
    return messages;
  }

  const excess = messages.length - MAX_HISTORY_SIZE;
  return messages.slice(excess);
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    let messages;
    if (Array.isArray(parsed)) {
      messages = parsed;
    } else if (parsed && Array.isArray(parsed.messages)) {
      messages = parsed.messages;
    } else {
      return [];
    }

    const valid = pruneExpiredMessages(messages);
    const trimmed = trimHistory(valid);

    if (trimmed.length !== messages.length) {
      persistHistory(trimmed);
    }

    return trimmed;
  } catch (error) {
    console.warn('[ChatContext] Failed to load chat history, starting fresh:', error.message);
    return [];
  }
}

function persistHistory(messages) {
  try {
    const toStore = JSON.stringify({ version: 1, messages });
    localStorage.setItem(STORAGE_KEY, toStore);
  } catch (error) {
    console.warn('[ChatContext] Failed to persist chat history:', error.message);

    if (error.name === 'QuotaExceededError') {
      try {
        const halfLength = Math.floor(messages.length / 2);
        const trimmed = messages.slice(halfLength);
        const toStore = JSON.stringify({ version: 1, messages: trimmed });
        localStorage.setItem(STORAGE_KEY, toStore);
      } catch (retryError) {
        console.warn('[ChatContext] Failed to persist trimmed history, resetting:', retryError.message);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, messages: [] }));
        } catch {
          // localStorage completely unavailable
        }
      }
    }
  }
}

const initialState = {
  isOpen: false,
  messages: [],
  inputValue: '',
  isTyping: false,
};

function chatReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_CHAT:
      return { ...state, isOpen: !state.isOpen };

    case ACTION_TYPES.OPEN_CHAT:
      return { ...state, isOpen: true };

    case ACTION_TYPES.CLOSE_CHAT:
      return { ...state, isOpen: false };

    case ACTION_TYPES.ADD_USER_MESSAGE: {
      const newMessages = [...state.messages, action.payload.message];
      return {
        ...state,
        messages: trimHistory(newMessages),
        inputValue: '',
      };
    }

    case ACTION_TYPES.ADD_ASSISTANT_MESSAGE: {
      const newMessages = [...state.messages, action.payload.message];
      return {
        ...state,
        messages: trimHistory(newMessages),
        isTyping: false,
      };
    }

    case ACTION_TYPES.SET_INPUT_VALUE:
      return { ...state, inputValue: action.payload.value };

    case ACTION_TYPES.SET_TYPING:
      return { ...state, isTyping: action.payload.isTyping };

    case ACTION_TYPES.RESTORE_HISTORY:
      return { ...state, messages: action.payload.messages };

    case ACTION_TYPES.CLEAR_INPUT:
      return { ...state, inputValue: '' };

    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const pendingTimeoutRef = useRef(null);
  const lastSendTimeRef = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const history = loadHistory();
    if (history.length > 0) {
      dispatch({ type: ACTION_TYPES.RESTORE_HISTORY, payload: { messages: history } });
    }
  }, []);

  useEffect(() => {
    if (state.messages.length > 0) {
      persistHistory(state.messages);
    }
  }, [state.messages]);

  useEffect(() => {
    return () => {
      if (pendingTimeoutRef.current) {
        clearTimeout(pendingTimeoutRef.current);
        pendingTimeoutRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback((text) => {
    if (typeof text !== 'string' || text.trim().length === 0) {
      return;
    }

    const now = Date.now();
    if (now - lastSendTimeRef.current < MIN_SEND_INTERVAL_MS) {
      console.warn('[ChatContext] Message rate limited. Please wait before sending another message.');
      return;
    }
    lastSendTimeRef.current = now;

    const trimmed = text.trim().substring(0, 2000);

    const userMessage = createMessage('user', trimmed);
    dispatch({ type: ACTION_TYPES.ADD_USER_MESSAGE, payload: { message: userMessage } });
    dispatch({ type: ACTION_TYPES.SET_TYPING, payload: { isTyping: true } });

    trackChatEvent('question', { category: null });

    if (pendingTimeoutRef.current) {
      clearTimeout(pendingTimeoutRef.current);
    }

    const { response, category, delay } = matchKeyword(trimmed);

    pendingTimeoutRef.current = setTimeout(() => {
      const assistantMessage = createMessage('assistant', response, category);
      dispatch({ type: ACTION_TYPES.ADD_ASSISTANT_MESSAGE, payload: { message: assistantMessage } });
      trackChatEvent('response', { category: category || 'fallback' });
      pendingTimeoutRef.current = null;
    }, delay);
  }, []);

  const setInputValue = useCallback((value) => {
    const sanitized = typeof value === 'string' ? value.substring(0, 2000) : '';
    dispatch({ type: ACTION_TYPES.SET_INPUT_VALUE, payload: { value: sanitized } });
  }, []);

  const toggleChat = useCallback(() => {
    dispatch({ type: ACTION_TYPES.TOGGLE_CHAT });
    const nextOpen = !state.isOpen;
    trackChatEvent(nextOpen ? 'open' : 'close');
  }, [state.isOpen]);

  const openChat = useCallback(() => {
    if (!state.isOpen) {
      dispatch({ type: ACTION_TYPES.OPEN_CHAT });
      trackChatEvent('open');
    }
  }, [state.isOpen]);

  const closeChat = useCallback(() => {
    if (state.isOpen) {
      dispatch({ type: ACTION_TYPES.CLOSE_CHAT });
      trackChatEvent('close');
    }
  }, [state.isOpen]);

  const openWithPrompt = useCallback((prompt) => {
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return;
    }

    const trimmed = prompt.trim().substring(0, 500);

    if (!state.isOpen) {
      dispatch({ type: ACTION_TYPES.OPEN_CHAT });
      trackChatEvent('open');
    }

    dispatch({ type: ACTION_TYPES.SET_INPUT_VALUE, payload: { value: trimmed } });

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    });
  }, [state.isOpen]);

  const clearHistory = useCallback(() => {
    dispatch({ type: ACTION_TYPES.RESTORE_HISTORY, payload: { messages: [] } });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const stateValue = useMemo(
    () => ({
      isOpen: state.isOpen,
      messages: state.messages,
      inputValue: state.inputValue,
      isTyping: state.isTyping,
    }),
    [state.isOpen, state.messages, state.inputValue, state.isTyping]
  );

  const dispatchValue = useMemo(
    () => ({
      sendMessage,
      setInputValue,
      toggleChat,
      openChat,
      closeChat,
      openWithPrompt,
      clearHistory,
      inputRef,
    }),
    [sendMessage, setInputValue, toggleChat, openChat, closeChat, openWithPrompt, clearHistory]
  );

  return (
    <ChatStateContext.Provider value={stateValue}>
      <ChatDispatchContext.Provider value={dispatchValue}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatStateContext.Provider>
  );
}

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useChatState() {
  const context = useContext(ChatStateContext);
  if (context === null) {
    throw new Error(
      'useChatState must be used within a <ChatProvider>. ' +
      'Ensure your component is wrapped in the ChatProvider tree.'
    );
  }
  return context;
}

export function useChatDispatch() {
  const context = useContext(ChatDispatchContext);
  if (context === null) {
    throw new Error(
      'useChatDispatch must be used within a <ChatProvider>. ' +
      'Ensure your component is wrapped in the ChatProvider tree.'
    );
  }
  return context;
}

export function useChat() {
  const state = useChatState();
  const dispatch = useChatDispatch();

  return {
    isOpen: state.isOpen,
    messages: state.messages,
    inputValue: state.inputValue,
    isTyping: state.isTyping,
    sendMessage: dispatch.sendMessage,
    setInputValue: dispatch.setInputValue,
    toggleChat: dispatch.toggleChat,
    openChat: dispatch.openChat,
    closeChat: dispatch.closeChat,
    openWithPrompt: dispatch.openWithPrompt,
    clearHistory: dispatch.clearHistory,
    inputRef: dispatch.inputRef,
  };
}