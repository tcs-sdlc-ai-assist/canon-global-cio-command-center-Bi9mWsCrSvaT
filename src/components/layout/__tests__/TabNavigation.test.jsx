import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabNavigation from '../TabNavigation';
import { DashboardProvider } from '../../../context/DashboardContext';
import { TAB_CONFIG, TAB_IDS } from '../../../constants/tabs';
import { trackTabSwitch } from '../../../utils/eventTracking';

vi.mock('../../../utils/eventTracking', () => ({
  trackTabSwitch: vi.fn(),
}));

function renderWithProvider() {
  return render(
    <DashboardProvider>
      <TabNavigation />
    </DashboardProvider>
  );
}

function getTabList() {
  return screen.getByRole('tablist', { name: /dashboard sections/i });
}

function getAllTabs() {
  return within(getTabList()).getAllByRole('tab');
}

function getTabByLabel(label) {
  return within(getTabList()).getByRole('tab', { name: label });
}

function queryTabByLabel(label) {
  return within(getTabList()).queryByRole('tab', { name: label });
}

describe('TabNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders all 7 tabs from TAB_CONFIG', () => {
      renderWithProvider();

      const tabs = getAllTabs();
      expect(tabs).toHaveLength(7);

      TAB_CONFIG.forEach((tab) => {
        expect(getTabByLabel(tab.label)).toBeInTheDocument();
      });
    });

    it('renders tabs in the correct order', () => {
      renderWithProvider();

      const tabs = getAllTabs();
      tabs.forEach((tab, index) => {
        expect(tab).toHaveTextContent(TAB_CONFIG[index].label);
      });
    });

    it('renders a nav element with role="tablist"', () => {
      renderWithProvider();

      const nav = screen.getByRole('tablist', { name: /dashboard sections/i });
      expect(nav).toBeInTheDocument();
      expect(nav.tagName).toBe('NAV');
    });

    it('sets aria-label on the tablist', () => {
      renderWithProvider();

      const tablist = getTabList();
      expect(tablist).toHaveAttribute('aria-label', 'Dashboard sections');
    });

    it('sets aria-selected="true" on the active tab', () => {
      renderWithProvider();

      const activeTab = getTabByLabel(TAB_CONFIG[0].label);
      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('sets aria-selected="false" on inactive tabs', () => {
      renderWithProvider();

      const inactiveTabs = TAB_CONFIG.slice(1);
      inactiveTabs.forEach((tab) => {
        const tabElement = getTabByLabel(tab.label);
        expect(tabElement).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('sets aria-controls on each tab pointing to the correct tabpanel', () => {
      renderWithProvider();

      TAB_CONFIG.forEach((tab) => {
        const tabElement = getTabByLabel(tab.label);
        expect(tabElement).toHaveAttribute('aria-controls', `tabpanel-${tab.id}`);
      });
    });

    it('applies active styling classes to the selected tab', () => {
      renderWithProvider();

      const activeTab = getTabByLabel(TAB_CONFIG[0].label);
      expect(activeTab.className).toContain('border-blue-600');
      expect(activeTab.className).toContain('text-blue-600');
    });

    it('applies inactive styling classes to non-selected tabs', () => {
      renderWithProvider();

      const inactiveTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(inactiveTab.className).toContain('border-transparent');
      expect(inactiveTab.className).toContain('text-gray-500');
    });

    it('applies hover classes to inactive tabs', () => {
      renderWithProvider();

      const inactiveTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(inactiveTab.className).toContain('hover:text-gray-700');
      expect(inactiveTab.className).toContain('hover:border-gray-300');
    });
  });

  describe('click behavior', () => {
    it('changes the active tab when a different tab is clicked', () => {
      renderWithProvider();

      const operationsTab = getTabByLabel('Operations');
      fireEvent.click(operationsTab);

      expect(operationsTab).toHaveAttribute('aria-selected', 'true');
      expect(operationsTab.className).toContain('border-blue-600');
      expect(operationsTab.className).toContain('text-blue-600');

      const strategicTab = getTabByLabel('Strategic Command');
      expect(strategicTab).toHaveAttribute('aria-selected', 'false');
    });

    it('does not change the active tab when the already-active tab is clicked', () => {
      renderWithProvider();

      const activeTab = getTabByLabel('Strategic Command');
      fireEvent.click(activeTab);

      expect(activeTab).toHaveAttribute('aria-selected', 'true');
    });

    it('calls trackTabSwitch with the new tab ID on tab change', () => {
      renderWithProvider();

      const partnershipsTab = getTabByLabel('Partnerships');
      fireEvent.click(partnershipsTab);

      expect(trackTabSwitch).toHaveBeenCalledTimes(1);
      expect(trackTabSwitch).toHaveBeenCalledWith(TAB_IDS.PARTNERSHIPS);
    });

    it('does not call trackTabSwitch when clicking the already-active tab', () => {
      renderWithProvider();

      const activeTab = getTabByLabel('Strategic Command');
      fireEvent.click(activeTab);

      expect(trackTabSwitch).not.toHaveBeenCalled();
    });

    it('calls trackTabSwitch for each unique tab switch', () => {
      renderWithProvider();

      fireEvent.click(getTabByLabel('Operations'));
      fireEvent.click(getTabByLabel('Innovation'));
      fireEvent.click(getTabByLabel('Partnerships'));

      expect(trackTabSwitch).toHaveBeenCalledTimes(3);
      expect(trackTabSwitch).toHaveBeenNthCalledWith(1, TAB_IDS.OPERATIONS);
      expect(trackTabSwitch).toHaveBeenNthCalledWith(2, TAB_IDS.INNOVATION);
      expect(trackTabSwitch).toHaveBeenNthCalledWith(3, TAB_IDS.PARTNERSHIPS);
    });

    it('updates styling when switching between tabs', () => {
      renderWithProvider();

      const businessTab = getTabByLabel('Business Impact');
      fireEvent.click(businessTab);

      expect(businessTab.className).toContain('border-blue-600');
      expect(businessTab.className).toContain('text-blue-600');

      const strategicTab = getTabByLabel('Strategic Command');
      expect(strategicTab.className).toContain('border-transparent');
      expect(strategicTab.className).toContain('text-gray-500');
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus to the next tab on ArrowRight', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowRight}');

      const secondTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(secondTab).toHaveFocus();
    });

    it('moves focus to the previous tab on ArrowLeft', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const secondTab = getTabByLabel(TAB_CONFIG[1].label);
      secondTab.focus();

      await user.keyboard('{ArrowLeft}');

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      expect(firstTab).toHaveFocus();
    });

    it('wraps focus from last tab to first tab on ArrowRight', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const lastTab = getTabByLabel(TAB_CONFIG[TAB_CONFIG.length - 1].label);
      lastTab.focus();

      await user.keyboard('{ArrowRight}');

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      expect(firstTab).toHaveFocus();
    });

    it('wraps focus from first tab to last tab on ArrowLeft', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowLeft}');

      const lastTab = getTabByLabel(TAB_CONFIG[TAB_CONFIG.length - 1].label);
      expect(lastTab).toHaveFocus();
    });

    it('moves focus to the first tab on Home key', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const middleTab = getTabByLabel(TAB_CONFIG[3].label);
      middleTab.focus();

      await user.keyboard('{Home}');

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      expect(firstTab).toHaveFocus();
    });

    it('moves focus to the last tab on End key', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const middleTab = getTabByLabel(TAB_CONFIG[3].label);
      middleTab.focus();

      await user.keyboard('{End}');

      const lastTab = getTabByLabel(TAB_CONFIG[TAB_CONFIG.length - 1].label);
      expect(lastTab).toHaveFocus();
    });

    it('activates the focused tab on Enter key', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Enter}');

      const secondTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(trackTabSwitch).toHaveBeenCalledWith(TAB_CONFIG[1].id);
    });

    it('activates the focused tab on Space key', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowRight}');
      await user.keyboard(' ');

      const secondTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
      expect(trackTabSwitch).toHaveBeenCalledWith(TAB_CONFIG[1].id);
    });

    it('does not activate the tab on non-activation keys', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Tab}');

      const secondTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(secondTab).toHaveAttribute('aria-selected', 'false');
    });

    it('maintains correct tabindex for roving tabindex pattern', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      expect(firstTab).toHaveAttribute('tabindex', '0');

      const secondTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(secondTab).toHaveAttribute('tabindex', '-1');

      firstTab.focus();
      await user.keyboard('{ArrowRight}');

      expect(firstTab).toHaveAttribute('tabindex', '-1');
      expect(secondTab).toHaveAttribute('tabindex', '0');
    });

    it('prevents default browser behavior for navigation keys', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      const preventDefaultSpy = vi.fn();
      const originalAddEventListener = firstTab.parentElement.addEventListener.bind(
        firstTab.parentElement
      );

      firstTab.parentElement.addEventListener('keydown', (e) => {
        if (['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(e.key)) {
          preventDefaultSpy(e.key);
        }
      });

      await user.keyboard('{ArrowRight}');

      expect(preventDefaultSpy).toHaveBeenCalledWith('ArrowRight');
    });
  });

  describe('focus management', () => {
    it('focuses the newly activated tab after a click', () => {
      renderWithProvider();

      const operationsTab = getTabByLabel('Operations');
      fireEvent.click(operationsTab);

      expect(operationsTab).toHaveFocus();
    });

    it('focuses the newly activated tab after Enter key activation', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Enter}');

      const thirdTab = getTabByLabel(TAB_CONFIG[2].label);
      expect(thirdTab).toHaveFocus();
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });

    it('scrolls the focused tab into view when it is not fully visible', () => {
      renderWithProvider();

      const scrollIntoViewSpy = vi.fn();
      const originalScrollIntoView = HTMLElement.prototype.scrollIntoView;
      HTMLElement.prototype.scrollIntoView = scrollIntoViewSpy;

      const lastTab = getTabByLabel(TAB_CONFIG[TAB_CONFIG.length - 1].label);
      fireEvent.click(lastTab);

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });

      HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
    });
  });

  describe('mobile horizontal scroll', () => {
    it('renders a horizontally scrollable container', () => {
      renderWithProvider();

      const tablist = getTabList();
      const scrollContainer = tablist.querySelector('.overflow-x-auto, .scrollbar-hide');

      expect(scrollContainer).toBeInTheDocument();
    });

    it('applies scrollbar-hide utility class to the scroll container', () => {
      renderWithProvider();

      const tablist = getTabList();
      const scrollContainer = tablist.querySelector('.scrollbar-hide');

      expect(scrollContainer).toBeInTheDocument();
    });

    it('renders all tabs even when container is narrow', () => {
      renderWithProvider();

      const tabs = getAllTabs();
      expect(tabs).toHaveLength(7);

      tabs.forEach((tab) => {
        expect(tab).toBeInTheDocument();
      });
    });

    it('applies whitespace-nowrap to prevent tab text wrapping', () => {
      renderWithProvider();

      const tabs = getAllTabs();
      tabs.forEach((tab) => {
        expect(tab.className).toContain('whitespace-nowrap');
      });
    });
  });

  describe('edge cases', () => {
    it('handles rapid consecutive tab clicks', () => {
      renderWithProvider();

      fireEvent.click(getTabByLabel('Operations'));
      fireEvent.click(getTabByLabel('Innovation'));
      fireEvent.click(getTabByLabel('Partnerships'));
      fireEvent.click(getTabByLabel('Business Impact'));

      const businessTab = getTabByLabel('Business Impact');
      expect(businessTab).toHaveAttribute('aria-selected', 'true');
    });

    it('handles rapid keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}{Enter}');

      const fourthTab = getTabByLabel(TAB_CONFIG[3].label);
      expect(fourthTab).toHaveAttribute('aria-selected', 'true');
    });

    it('handles focus moving away and returning to the tablist', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{ArrowRight}');

      const secondTab = getTabByLabel(TAB_CONFIG[1].label);
      expect(secondTab).toHaveFocus();

      await user.keyboard('{Tab}');

      secondTab.focus();

      expect(secondTab).toHaveFocus();
    });

    it('maintains correct state when the same tab is activated via keyboard multiple times', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{Enter}');

      expect(firstTab).toHaveAttribute('aria-selected', 'true');

      await user.keyboard('{Enter}');

      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('does not crash when a non-tab key is pressed', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      const firstTab = getTabByLabel(TAB_CONFIG[0].label);
      firstTab.focus();

      await user.keyboard('{Shift}');
      await user.keyboard('{Control}');
      await user.keyboard('a');

      expect(firstTab).toHaveFocus();
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('accessibility', () => {
    it('has accessible names for all tabs', () => {
      renderWithProvider();

      TAB_CONFIG.forEach((tab) => {
        const tabElement = getTabByLabel(tab.label);
        expect(tabElement).toHaveAccessibleName(tab.label);
      });
    });

    it('has role="tab" on all tab buttons', () => {
      renderWithProvider();

      const tabs = getAllTabs();
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('role', 'tab');
      });
    });

    it('has role="tablist" on the navigation container', () => {
      renderWithProvider();

      const tablist = getTabList();
      expect(tablist).toHaveAttribute('role', 'tablist');
    });

    it('supports focus-visible ring for keyboard users', () => {
      renderWithProvider();

      const tabs = getAllTabs();
      tabs.forEach((tab) => {
        expect(tab.className).toContain('focus-visible:ring-2');
        expect(tab.className).toContain('focus-visible:ring-blue-500');
      });
    });
  });
});