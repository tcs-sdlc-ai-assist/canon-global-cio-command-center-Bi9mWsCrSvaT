import { useCallback } from 'react';
import { useChatDispatch } from '../context/ChatContext';
import { trackChipClick } from '../utils/eventTracking';

const ACTION_CHIP_SELECTOR = '.action-chip, .ai-action-chip';

function extractChipLabel(element) {
  if (!element) return null;

  const text = element.textContent;
  if (typeof text !== 'string' || text.trim().length === 0) {
    return null;
  }

  return text.trim().substring(0, 500);
}

function extractChipSection(element) {
  if (!element) return 'unknown';

  const section = element.getAttribute('data-section');
  if (typeof section === 'string' && section.trim().length > 0) {
    return section.trim();
  }

  const parentSection = element.closest('[data-section]');
  if (parentSection) {
    const parentValue = parentSection.getAttribute('data-section');
    if (typeof parentValue === 'string' && parentValue.trim().length > 0) {
      return parentValue.trim();
    }
  }

  return 'unknown';
}

/**
 * Custom hook that returns a delegated click handler for action chips.
 *
 * Designed to be attached to a parent container that encompasses all tab content.
 * When a click event bubbles up from an element matching `.action-chip` or
 * `.ai-action-chip`, the handler:
 *   1. Extracts the chip's text content as the prompt label
 *   2. Extracts the `data-section` attribute (or inherits from a parent with `data-section`)
 *   3. Calls `openWithPrompt(label)` from the ChatContext to open the chat and auto-send
 *   4. Calls `trackChipClick(label, section)` from the event tracking utility
 *
 * Non-chip clicks are silently ignored.
 *
 * Must be called within a `<ChatProvider>` component tree.
 *
 * @returns {(event: Event) => void} Delegated click handler function
 *
 * @example
 *   const handleChipClick = useActionChipBridge();
 *   return <div onClick={handleChipClick}>{children}</div>;
 *
 * @example
 *   // Chip markup expected:
 *   // <button className="action-chip" data-section="quick-actions">Q4 board presentation ready</button>
 *   // <button className="ai-action-chip" data-section="ai-insights">Regional performance comparison</button>
 */
export function useActionChipBridge() {
  const { openWithPrompt } = useChatDispatch();

  const handleChipClick = useCallback(
    (event) => {
      if (!event || !event.target) {
        return;
      }

      const chipElement = event.target.closest(ACTION_CHIP_SELECTOR);

      if (!chipElement) {
        return;
      }

      const label = extractChipLabel(chipElement);
      if (label === null) {
        return;
      }

      const section = extractChipSection(chipElement);

      openWithPrompt(label);
      trackChipClick(label, section);
    },
    [openWithPrompt]
  );

  return handleChipClick;
}