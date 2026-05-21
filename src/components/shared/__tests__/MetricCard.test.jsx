import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MetricCard from '../MetricCard';

vi.mock('../../hooks/usePulseAnimation', () => ({
  usePulseAnimation: vi.fn(() => true),
}));

import { usePulseAnimation } from '../../hooks/usePulseAnimation';

const BASE_METRIC_DATA = {
  title: 'Revenue Attribution',
  value: '€2.4B',
  trend: 'up',
  trendValue: '+12.3%',
  trendLabel: 'vs last year',
  aiInsight: 'IT-enabled revenue growth exceeds target by 3.2 percentage points.',
  category: 'business',
};

function renderMetricCard(props = {}) {
  const data = { ...BASE_METRIC_DATA, ...props };
  return render(<MetricCard data={data} showPulse={props.showPulse ?? false} />);
}

describe('MetricCard', () => {
  beforeEach(() => {
    usePulseAnimation.mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the metric title', () => {
      renderMetricCard();
      expect(screen.getByText('Revenue Attribution')).toBeInTheDocument();
    });

    it('renders the metric value', () => {
      renderMetricCard();
      expect(screen.getByText('€2.4B')).toBeInTheDocument();
    });

    it('renders the trend indicator with correct value', () => {
      renderMetricCard();
      expect(screen.getByText('+12.3%')).toBeInTheDocument();
    });

    it('renders the trend label when provided', () => {
      renderMetricCard();
      expect(screen.getByText('vs last year')).toBeInTheDocument();
    });

    it('renders the AI insight text', () => {
      renderMetricCard();
      expect(
        screen.getByText(/IT-enabled revenue growth exceeds target/)
      ).toBeInTheDocument();
    });

    it('renders the AI insight label', () => {
      renderMetricCard();
      expect(screen.getByText('💡 AI Analysis:')).toBeInTheDocument();
    });

    it('renders without trend label when not provided', () => {
      renderMetricCard({ trendLabel: '' });
      expect(screen.queryByText('vs last year')).not.toBeInTheDocument();
    });

    it('renders without AI insight when not provided', () => {
      renderMetricCard({ aiInsight: '' });
      expect(screen.queryByText('💡 AI Analysis:')).not.toBeInTheDocument();
    });

    it('has correct region role and aria-label', () => {
      renderMetricCard();
      const region = screen.getByRole('region', {
        name: 'Revenue Attribution: €2.4B',
      });
      expect(region).toBeInTheDocument();
    });
  });

  describe('trend directions', () => {
    it('renders up trend with green color class', () => {
      renderMetricCard({ trend: 'up' });
      const trendValue = screen.getByText('+12.3%');
      expect(trendValue.className).toContain('text-green-600');
    });

    it('renders down trend with red color class', () => {
      renderMetricCard({ trend: 'down', trendValue: '-5.0%' });
      const trendValue = screen.getByText('-5.0%');
      expect(trendValue.className).toContain('text-red-600');
    });

    it('renders neutral trend with gray color class', () => {
      renderMetricCard({ trend: 'neutral', trendValue: '0%' });
      const trendValue = screen.getByText('0%');
      expect(trendValue.className).toContain('text-gray-400');
    });

    it('renders up arrow icon for up trend', () => {
      renderMetricCard({ trend: 'up' });
      const arrow = screen.getByText('↑');
      expect(arrow).toBeInTheDocument();
      expect(arrow).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders down arrow icon for down trend', () => {
      renderMetricCard({ trend: 'down', trendValue: '-5.0%' });
      const arrow = screen.getByText('↓');
      expect(arrow).toBeInTheDocument();
    });

    it('renders neutral arrow icon for neutral trend', () => {
      renderMetricCard({ trend: 'neutral', trendValue: '0%' });
      const arrow = screen.getByText('→');
      expect(arrow).toBeInTheDocument();
    });
  });

  describe('category border styling', () => {
    it('applies blue left border for business category', () => {
      renderMetricCard({ category: 'business' });
      const region = screen.getByRole('region');
      expect(region.className).toContain('border-l-blue-500');
    });

    it('applies emerald left border for operations category', () => {
      renderMetricCard({ category: 'operations' });
      const region = screen.getByRole('region');
      expect(region.className).toContain('border-l-emerald-500');
    });

    it('applies amber left border for risk category', () => {
      renderMetricCard({ category: 'risk' });
      const region = screen.getByRole('region');
      expect(region.className).toContain('border-l-amber-500');
    });

    it('applies purple left border for innovation category', () => {
      renderMetricCard({ category: 'innovation' });
      const region = screen.getByRole('region');
      expect(region.className).toContain('border-l-purple-500');
    });

    it('applies cyan left border for partnership category', () => {
      renderMetricCard({ category: 'partnership' });
      const region = screen.getByRole('region');
      expect(region.className).toContain('border-l-cyan-500');
    });

    it('applies gray left border for default/unknown category', () => {
      renderMetricCard({ category: 'default' });
      const region = screen.getByRole('region');
      expect(region.className).toContain('border-l-gray-300');
    });
  });

  describe('pulse indicator', () => {
    it('renders pulse dot when showPulse is true', () => {
      render(<MetricCard data={BASE_METRIC_DATA} showPulse={true} />);
      const pulseDot = screen.getByRole('status', { name: 'AI analysis active' });
      expect(pulseDot).toBeInTheDocument();
    });

    it('does not render pulse dot when showPulse is false', () => {
      render(<MetricCard data={BASE_METRIC_DATA} showPulse={false} />);
      const pulseDot = screen.queryByRole('status', { name: 'AI analysis active' });
      expect(pulseDot).not.toBeInTheDocument();
    });

    it('does not render pulse dot when showPulse is not provided', () => {
      render(<MetricCard data={BASE_METRIC_DATA} />);
      const pulseDot = screen.queryByRole('status', { name: 'AI analysis active' });
      expect(pulseDot).not.toBeInTheDocument();
    });

    it('applies pulse-glow animation class when pulseActive is true', () => {
      usePulseAnimation.mockReturnValue(true);
      render(<MetricCard data={BASE_METRIC_DATA} showPulse={true} />);
      const pulseDot = screen.getByRole('status', { name: 'AI analysis active' });
      expect(pulseDot.className).toContain('animate-pulse-glow');
    });

    it('does not apply pulse-glow animation class when pulseActive is false', () => {
      usePulseAnimation.mockReturnValue(false);
      render(<MetricCard data={BASE_METRIC_DATA} showPulse={true} />);
      const pulseDot = screen.getByRole('status', { name: 'AI analysis active' });
      expect(pulseDot.className).not.toContain('animate-pulse-glow');
    });

    it('applies correct pulse color class based on category', () => {
      render(
        <MetricCard
          data={{ ...BASE_METRIC_DATA, category: 'innovation' }}
          showPulse={true}
        />
      );
      const pulseDot = screen.getByRole('status', { name: 'AI analysis active' });
      expect(pulseDot.className).toContain('bg-purple-400');
    });

    it('applies default pulse color for unknown category', () => {
      render(
        <MetricCard
          data={{ ...BASE_METRIC_DATA, category: 'default' }}
          showPulse={true}
        />
      );
      const pulseDot = screen.getByRole('status', { name: 'AI analysis active' });
      expect(pulseDot.className).toContain('bg-blue-400');
    });
  });

  describe('hover and transition classes', () => {
    it('applies hover shadow class', () => {
      renderMetricCard();
      const region = screen.getByRole('region');
      expect(region.className).toContain('hover:shadow-lg');
    });

    it('applies hover scale class', () => {
      renderMetricCard();
      const region = screen.getByRole('region');
      expect(region.className).toContain('hover:scale-[1.02]');
    });

    it('applies transition classes', () => {
      renderMetricCard();
      const region = screen.getByRole('region');
      expect(region.className).toContain('transition-all');
      expect(region.className).toContain('duration-200');
    });
  });

  describe('React.memo behavior', () => {
    it('prevents re-render when data reference is unchanged', () => {
      const { rerender } = render(
        <MetricCard data={BASE_METRIC_DATA} showPulse={false} />
      );

      const firstRender = screen.getByText('€2.4B').textContent;

      rerender(<MetricCard data={BASE_METRIC_DATA} showPulse={false} />);

      const secondRender = screen.getByText('€2.4B').textContent;
      expect(secondRender).toBe(firstRender);
    });

    it('re-renders when data value changes', () => {
      const { rerender } = render(
        <MetricCard data={BASE_METRIC_DATA} showPulse={false} />
      );

      expect(screen.getByText('€2.4B')).toBeInTheDocument();

      const updatedData = { ...BASE_METRIC_DATA, value: '€3.0B' };
      rerender(<MetricCard data={updatedData} showPulse={false} />);

      expect(screen.getByText('€3.0B')).toBeInTheDocument();
    });

    it('re-renders when showPulse changes', () => {
      const { rerender } = render(
        <MetricCard data={BASE_METRIC_DATA} showPulse={false} />
      );

      expect(
        screen.queryByRole('status', { name: 'AI analysis active' })
      ).not.toBeInTheDocument();

      rerender(<MetricCard data={BASE_METRIC_DATA} showPulse={true} />);

      expect(
        screen.getByRole('status', { name: 'AI analysis active' })
      ).toBeInTheDocument();
    });

    it('re-renders when trend value changes', () => {
      const { rerender } = render(
        <MetricCard data={BASE_METRIC_DATA} showPulse={false} />
      );

      expect(screen.getByText('+12.3%')).toBeInTheDocument();

      const updatedData = { ...BASE_METRIC_DATA, trendValue: '+15.0%' };
      rerender(<MetricCard data={updatedData} showPulse={false} />);

      expect(screen.getByText('+15.0%')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders with very long title text', () => {
      const longTitle =
        'This is an extremely long metric card title that should still render correctly without breaking the layout';
      renderMetricCard({ title: longTitle });
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('renders with very long value text', () => {
      renderMetricCard({ value: '€1,234,567,890.99' });
      expect(screen.getByText('€1,234,567,890.99')).toBeInTheDocument();
    });

    it('renders with very long AI insight text', () => {
      const longInsight =
        'This is a very long AI insight that provides detailed analysis of the metric performance across multiple dimensions including revenue growth, cost optimization, and operational efficiency improvements.';
      renderMetricCard({ aiInsight: longInsight });
      expect(screen.getByText(longInsight)).toBeInTheDocument();
    });

    it('renders with empty trend label gracefully', () => {
      renderMetricCard({ trendLabel: '' });
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
    });

    it('renders with empty AI insight gracefully', () => {
      renderMetricCard({ aiInsight: '' });
      const region = screen.getByRole('region');
      expect(region).toBeInTheDocument();
      expect(screen.queryByText('💡 AI Analysis:')).not.toBeInTheDocument();
    });

    it('renders with all categories correctly', () => {
      const categories = ['business', 'operations', 'risk', 'innovation', 'partnership'];

      categories.forEach((category) => {
        const { unmount } = render(
          <MetricCard
            data={{ ...BASE_METRIC_DATA, category }}
            showPulse={false}
          />
        );
        expect(screen.getByRole('region')).toBeInTheDocument();
        unmount();
      });
    });
  });
});