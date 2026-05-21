import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import ChatToggle from './components/ChatToggle';
import ChatDrawer from './components/ChatDrawer';

function AIChatAssistant() {
  const { isOpen } = useChatState();
  const { openWithPrompt, inputRef } = useChatDispatch();
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    } else if (previousFocusRef.current) {
      if (typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  const handleOpenWithPrompt = useCallback(
    (prompt) => {
      if (typeof prompt !== 'string' || prompt.trim().length === 0) {
        return;
      }

      openWithPrompt(prompt);

      requestAnimationFrame(() => {
        if (inputRef && inputRef.current) {
          inputRef.current.focus();
        }
      });
    },
    [openWithPrompt, inputRef]
  );

  return (
    <>
      <ChatToggle />

      {isOpen && <ChatDrawer />}
    </>
  );
}

AIChatAssistant.propTypes = {};

export default React.memo(AIChatAssistant);