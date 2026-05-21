import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatProvider } from '../../context/ChatContext';
import { useActionChipBridge } from '../../hooks/useActionChipBridge';
import { trackChipClick } from '../../utils/eventTracking';

vi.mock('../../utils/eventTracking', () => ({
  trackChipClick: vi.fn(),
}));

function TestContainer({ children }) {
  const handleChipClick = useActionChipBridge();

  return (
    <div onClick={handleChipClick} data-testid="chip-container">
      {children}
    </div>
  );
}

function renderWithProviders(ui) {
  return render(
    <ChatProvider>
      <TestContainer>
        {ui}
      </TestContainer>
    </ChatProvider>
  );
}

function getChatDrawer() {
  return screen.queryByRole('dialog', { name: /ai chat assistant/i });
}

function getChatInput() {
  const drawer = getChatDrawer();
  if (!drawer) return null;
  return drawer.querySelector('textarea');
}

describe('ActionChipBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('action-chip clicks', () => {
    it('opens the chat drawer when an .action-chip is clicked', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="quick-actions"
        >
          Q4 board presentation ready
        </button>
      );

      expect(getChatDrawer()).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Q4 board presentation ready'));

      expect(getChatDrawer()).toBeInTheDocument();
    });

    it('opens the chat drawer when an .ai-action-chip is clicked', () => {
      renderWithProviders(
        <button
          type="button"
          className="ai-action-chip"
          data-section="ai-insights"
        >
          Regional performance comparison
        </button>
      );

      expect(getChatDrawer()).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Regional performance comparison'));

      expect(getChatDrawer()).toBeInTheDocument();
    });

    it('prefills the chat input with the chip label text', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="quick-actions"
        >
          Q4 board presentation ready
        </button>
      );

      fireEvent.click(screen.getByText('Q4 board presentation ready'));

      const input = getChatInput();
      expect(input).toBeInTheDocument();
      expect(input.value).toBe('Q4 board presentation ready');
    });

    it('calls trackChipClick with the correct label and section for .action-chip', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="quick-actions"
        >
          Q4 board presentation ready
        </button>
      );

      fireEvent.click(screen.getByText('Q4 board presentation ready'));

      expect(trackChipClick).toHaveBeenCalledTimes(1);
      expect(trackChipClick).toHaveBeenCalledWith(
        'Q4 board presentation ready',
        'quick-actions'
      );
    });

    it('calls trackChipClick with the correct label and section for .ai-action-chip', () => {
      renderWithProviders(
        <button
          type="button"
          className="ai-action-chip"
          data-section="ai-insights"
        >
          Regional performance comparison
        </button>
      );

      fireEvent.click(screen.getByText('Regional performance comparison'));

      expect(trackChipClick).toHaveBeenCalledTimes(1);
      expect(trackChipClick).toHaveBeenCalledWith(
        'Regional performance comparison',
        'ai-insights'
      );
    });

    it('inherits data-section from a parent element when the chip itself has no data-section', () => {
      renderWithProviders(
        <div data-section="strategic-priorities">
          <button type="button" className="action-chip">
            Accelerate AI/ML deployment
          </button>
        </div>
      );

      fireEvent.click(screen.getByText('Accelerate AI/ML deployment'));

      expect(trackChipClick).toHaveBeenCalledWith(
        'Accelerate AI/ML deployment',
        'strategic-priorities'
      );
    });

    it('uses "unknown" as section when neither chip nor parent has data-section', () => {
      renderWithProviders(
        <button type="button" className="action-chip">
          Some action
        </button>
      );

      fireEvent.click(screen.getByText('Some action'));

      expect(trackChipClick).toHaveBeenCalledWith('Some action', 'unknown');
    });

    it('truncates chip label longer than 500 characters', () => {
      const longLabel = 'A'.repeat(600);

      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="test-section"
        >
          {longLabel}
        </button>
      );

      fireEvent.click(screen.getByText(longLabel));

      expect(trackChipClick).toHaveBeenCalledTimes(1);
      const calledLabel = trackChipClick.mock.calls[0][0];
      expect(calledLabel.length).toBeLessThanOrEqual(500);
    });
  });

  describe('non-chip clicks', () => {
    it('does not open the chat drawer when a non-chip element is clicked', () => {
      renderWithProviders(
        <div>
          <button type="button" className="action-chip" data-section="test">
            Valid chip
          </button>
          <button type="button" data-testid="regular-button">
            Regular button
          </button>
        </div>
      );

      fireEvent.click(screen.getByTestId('regular-button'));

      expect(getChatDrawer()).not.toBeInTheDocument();
    });

    it('does not call trackChipClick when a non-chip element is clicked', () => {
      renderWithProviders(
        <div>
          <button type="button" className="action-chip" data-section="test">
            Valid chip
          </button>
          <span data-testid="plain-text">Plain text</span>
        </div>
      );

      fireEvent.click(screen.getByTestId('plain-text'));

      expect(trackChipClick).not.toHaveBeenCalled();
    });

    it('does not open chat when clicking the container background (not on a chip)', () => {
      renderWithProviders(
        <div>
          <button type="button" className="action-chip" data-section="test">
            Valid chip
          </button>
          <div data-testid="empty-area" style={{ width: 100, height: 100 }} />
        </div>
      );

      fireEvent.click(screen.getByTestId('empty-area'));

      expect(getChatDrawer()).not.toBeInTheDocument();
    });

    it('does not call trackChipClick when clicking the container background', () => {
      renderWithProviders(
        <div>
          <button type="button" className="action-chip" data-section="test">
            Valid chip
          </button>
          <div data-testid="empty-area" style={{ width: 100, height: 100 }} />
        </div>
      );

      fireEvent.click(screen.getByTestId('empty-area'));

      expect(trackChipClick).not.toHaveBeenCalled();
    });
  });

  describe('multiple chips', () => {
    it('handles multiple chips with different labels and sections', () => {
      renderWithProviders(
        <div>
          <button
            type="button"
            className="action-chip"
            data-section="quick-actions"
          >
            Q4 board presentation ready
          </button>
          <button
            type="button"
            className="ai-action-chip"
            data-section="ai-insights"
          >
            Regional performance comparison
          </button>
          <button
            type="button"
            className="action-chip"
            data-section="executive-actions"
          >
            Approve additional investment
          </button>
        </div>
      );

      fireEvent.click(screen.getByText('Q4 board presentation ready'));
      expect(trackChipClick).toHaveBeenCalledWith(
        'Q4 board presentation ready',
        'quick-actions'
      );

      fireEvent.click(screen.getByText('Regional performance comparison'));
      expect(trackChipClick).toHaveBeenCalledWith(
        'Regional performance comparison',
        'ai-insights'
      );

      fireEvent.click(screen.getByText('Approve additional investment'));
      expect(trackChipClick).toHaveBeenCalledWith(
        'Approve additional investment',
        'executive-actions'
      );

      expect(trackChipClick).toHaveBeenCalledTimes(3);
    });

    it('updates chat input with the most recently clicked chip label', () => {
      renderWithProviders(
        <div>
          <button
            type="button"
            className="action-chip"
            data-section="quick-actions"
          >
            First chip
          </button>
          <button
            type="button"
            className="action-chip"
            data-section="ai-insights"
          >
            Second chip
          </button>
        </div>
      );

      fireEvent.click(screen.getByText('First chip'));
      expect(getChatInput().value).toBe('First chip');

      fireEvent.click(screen.getByText('Second chip'));
      expect(getChatInput().value).toBe('Second chip');
    });
  });

  describe('edge cases', () => {
    it('handles chips with empty text content gracefully', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="test-section"
          data-testid="empty-chip"
        >
          {' '}
        </button>
      );

      fireEvent.click(screen.getByTestId('empty-chip'));

      expect(getChatDrawer()).not.toBeInTheDocument();
      expect(trackChipClick).not.toHaveBeenCalled();
    });

    it('handles chips with only whitespace text content', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="test-section"
          data-testid="whitespace-chip"
        >
          {'   '}
        </button>
      );

      fireEvent.click(screen.getByTestId('whitespace-chip'));

      expect(getChatDrawer()).not.toBeInTheDocument();
      expect(trackChipClick).not.toHaveBeenCalled();
    });

    it('handles deeply nested chip elements', () => {
      renderWithProviders(
        <div data-section="parent-section">
          <div>
            <div>
              <button type="button" className="action-chip">
                <span>Deeply nested chip</span>
              </button>
            </div>
          </div>
        </div>
      );

      fireEvent.click(screen.getByText('Deeply nested chip'));

      expect(getChatDrawer()).toBeInTheDocument();
      expect(trackChipClick).toHaveBeenCalledWith(
        'Deeply nested chip',
        'parent-section'
      );
    });

    it('handles chips with mixed class names containing action-chip', () => {
      renderWithProviders(
        <button
          type="button"
          className="inline-flex items-center action-chip px-3 py-1.5 rounded-full"
          data-section="mixed-section"
        >
          Mixed class chip
        </button>
      );

      fireEvent.click(screen.getByText('Mixed class chip'));

      expect(getChatDrawer()).toBeInTheDocument();
      expect(trackChipClick).toHaveBeenCalledWith(
        'Mixed class chip',
        'mixed-section'
      );
    });

    it('handles chips with mixed class names containing ai-action-chip', () => {
      renderWithProviders(
        <button
          type="button"
          className="ai-action-chip custom-extra-class"
          data-section="ai-section"
        >
          AI chip with extra classes
        </button>
      );

      fireEvent.click(screen.getByText('AI chip with extra classes'));

      expect(getChatDrawer()).toBeInTheDocument();
      expect(trackChipClick).toHaveBeenCalledWith(
        'AI chip with extra classes',
        'ai-section'
      );
    });

    it('handles rapid consecutive chip clicks', () => {
      renderWithProviders(
        <div>
          <button
            type="button"
            className="action-chip"
            data-section="section-a"
          >
            Chip A
          </button>
          <button
            type="button"
            className="action-chip"
            data-section="section-b"
          >
            Chip B
          </button>
          <button
            type="button"
            className="action-chip"
            data-section="section-c"
          >
            Chip C
          </button>
        </div>
      );

      fireEvent.click(screen.getByText('Chip A'));
      fireEvent.click(screen.getByText('Chip B'));
      fireEvent.click(screen.getByText('Chip C'));

      expect(trackChipClick).toHaveBeenCalledTimes(3);
      expect(trackChipClick).toHaveBeenNthCalledWith(1, 'Chip A', 'section-a');
      expect(trackChipClick).toHaveBeenNthCalledWith(2, 'Chip B', 'section-b');
      expect(trackChipClick).toHaveBeenNthCalledWith(3, 'Chip C', 'section-c');
    });

    it('does not crash when event target is null', () => {
      const { container } = renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="test-section"
        >
          Test chip
        </button>
      );

      const syntheticEvent = { target: null };

      expect(() => {
        fireEvent.click(container.firstChild, syntheticEvent);
      }).not.toThrow();
    });

    it('handles chips with special characters in label', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="special-section"
        >
          Build business case for TCS expansion (€50M)
        </button>
      );

      fireEvent.click(
        screen.getByText('Build business case for TCS expansion (€50M)')
      );

      expect(trackChipClick).toHaveBeenCalledWith(
        'Build business case for TCS expansion (€50M)',
        'special-section'
      );
    });

    it('handles chips with newlines and extra whitespace in label', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="whitespace-section"
        >
          {'  Prepare board\napproval presentation  '}
        </button>
      );

      fireEvent.click(
        screen.getByText('  Prepare board\napproval presentation  ')
      );

      expect(trackChipClick).toHaveBeenCalledTimes(1);
      const calledLabel = trackChipClick.mock.calls[0][0];
      expect(calledLabel).toBe('Prepare board\napproval presentation');
    });
  });

  describe('integration with chat context', () => {
    it('opens chat only once when multiple chips are clicked', () => {
      renderWithProviders(
        <div>
          <button
            type="button"
            className="action-chip"
            data-section="section-a"
          >
            Chip A
          </button>
          <button
            type="button"
            className="action-chip"
            data-section="section-b"
          >
            Chip B
          </button>
        </div>
      );

      fireEvent.click(screen.getByText('Chip A'));

      const drawer = getChatDrawer();
      expect(drawer).toBeInTheDocument();

      fireEvent.click(screen.getByText('Chip B'));

      expect(getChatDrawer()).toBeInTheDocument();
    });

    it('does not close an already-open chat when a chip is clicked', () => {
      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="test-section"
        >
          Test chip
        </button>
      );

      fireEvent.click(screen.getByText('Test chip'));
      expect(getChatDrawer()).toBeInTheDocument();

      fireEvent.click(screen.getByText('Test chip'));
      expect(getChatDrawer()).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('works with keyboard-activated chips (Enter key)', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="keyboard-section"
        >
          Keyboard chip
        </button>
      );

      const chip = screen.getByText('Keyboard chip');
      chip.focus();

      await user.keyboard('{Enter}');

      expect(getChatDrawer()).toBeInTheDocument();
      expect(trackChipClick).toHaveBeenCalledWith(
        'Keyboard chip',
        'keyboard-section'
      );
    });

    it('works with keyboard-activated chips (Space key)', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <button
          type="button"
          className="action-chip"
          data-section="keyboard-section"
        >
          Space chip
        </button>
      );

      const chip = screen.getByText('Space chip');
      chip.focus();

      await user.keyboard(' ');

      expect(getChatDrawer()).toBeInTheDocument();
      expect(trackChipClick).toHaveBeenCalledWith(
        'Space chip',
        'keyboard-section'
      );
    });
  });
});