import { useChatState, useChatDispatch } from '../context/ChatContext';

/**
 * Convenience hook that combines chat state and dispatch into a single interface.
 *
 * Provides a unified API for components that need both to read chat state
 * and dispatch chat actions. Components that only need state or only need
 * dispatch should use useChatState() or useChatDispatch() directly to avoid
 * unnecessary re-renders.
 *
 * Must be called within a <ChatProvider> component tree.
 *
 * @returns {{
 *   isOpen: boolean,
 *   messages: Array<{ id: string, role: 'user' | 'assistant', text: string, timestamp: number, category: string | null }>,
 *   inputValue: string,
 *   isTyping: boolean,
 *   sendMessage: (text: string) => void,
 *   setInputValue: (value: string) => void,
 *   toggleChat: () => void,
 *   openChat: () => void,
 *   closeChat: () => void,
 *   openWithPrompt: (prompt: string) => void,
 *   clearHistory: () => void,
 *   inputRef: React.RefObject<HTMLInputElement>,
 * }}
 * @throws {Error} If called outside of a <ChatProvider>
 *
 * @example
 *   const { isOpen, messages, sendMessage, toggleChat } = useChat();
 *   // Read chat state and dispatch actions from a single hook
 *
 * @example
 *   const { openWithPrompt } = useChat();
 *   // Open chat with a pre-filled prompt from an action chip
 */
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