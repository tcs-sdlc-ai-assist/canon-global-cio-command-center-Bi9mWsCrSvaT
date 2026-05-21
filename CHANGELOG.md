# Changelog

All notable changes to the Canon CIO Command Center project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-13

### Added

#### Dashboard & Navigation
- 7-tab executive dashboard with Strategic Command, Executive Summary, Business Impact, Operations, Risk & Governance, Innovation, and Partnerships panels
- Tab navigation with full keyboard accessibility (arrow keys, Home/End, Enter/Space activation) and roving tabindex pattern
- Responsive layout with mobile-first design, horizontal scroll for tabs on narrow viewports
- Glass-morphism card styling with backdrop blur and hover effects
- Skeleton loading states for lazy-loaded tab panels via React Suspense
- Active tab persistence to localStorage with validation and fallback

#### Data Visualization (Recharts)
- **TrendChart** — Multi-line chart for strategic performance trends (Business Impact, Operational Excellence, Innovation Index) with 12-month rolling data
- **BusinessImpactBarChart** — Bar chart for IT business value creation by category (Digital Channels, Cloud Services, Automation, AI/ML Solutions, Consulting) with YoY growth tooltips
- **DoughnutChartWrapper** — Doughnut chart for innovation portfolio distribution across 5 technology domains with center label showing total portfolio value
- **DualAxisChart** — Composed bar + line chart for incident trends and MTTR with dual Y-axes
- **RadarChartWrapper** — Radar chart for regional performance comparison across EMEA, Americas, and APAC on 5 dimensions
- **TimelineChart** — Bar chart for partnership investment vs. value delivered timeline with projected year differentiation (dashed/striped bars for 2026)
- All charts include: empty state handling, custom tooltips, legend interactions, hover tracking, and chart-specific aria-labels

#### AI Chat Assistant
- Rule-based keyword matching engine with inverted index for 6 categories: Q4 Board, TCS Partnership, Business Value, Regional, Innovation, Security & Risk
- Multi-response selection with randomized response rotation per category
- Fallback response with guided topic suggestions when no keywords match
- Chat drawer with slide-up animation on mobile, slide-in on desktop
- Typing indicator with animated bouncing dots
- Message history persistence to localStorage with 30-day TTL and 200-message cap
- Rate limiting (300ms minimum send interval) and input truncation (2000 chars)
- Keyboard shortcuts: Enter to send, Shift+Enter for newline, Escape to close
- Focus management: auto-focus input on open, restore previous focus on close

#### Action Chip Bridge
- Delegated click handler on dashboard container that detects clicks on `.action-chip` and `.ai-action-chip` elements
- Automatically opens chat drawer and pre-fills input with chip label text
- Inherits `data-section` from parent elements for tracking context
- Integrated with event tracking for chip click analytics

#### Data Tables
- **PerformanceTable** — Sortable regional performance table with column sorting (ascending/descending), status badges, and percentage formatting
- Sort icons with visual indicators for active sort column and direction
- Footer showing record count and active sort state

#### Shared Components
- **MetricCard** — KPI card with title, value, trend indicator (up/down/neutral with color coding), AI insight text, category-colored left border, and optional pulse animation dot
- **MetricGroup** — Responsive grid layout for metric cards with configurable columns (1-3)
- **ActionChip** — Pill-shaped button with 3 variants (default, primary, outline) and hover state transitions
- **StatusBadge** — Color-coded status pill (Excellent/Good/Warning/Critical)
- **TrendIndicator** — Arrow + value + optional label with color coding for trend direction
- **AIInsightsPanel** — Reusable AI insights section with confidence badge and categorized chip lists
- **StrategicIntelligencePanel** — Partnership-specific intelligence panel with narrative sections, metrics grid, and action chips

#### Event Tracking
- Console-based event tracking with structured JSON payloads
- PII masking: automatically redacts user name, role, and avatar initials before logging
- Event types: tab switches, chip clicks, chart interactions, chat events, export actions
- Configurable log levels (info/warn/error) and enable/disable toggle
- ISO 8601 timestamps on all tracked events

#### Data Export
- Client-side CSV export for trend chart data
- Proper CSV escaping for fields containing commas, quotes, and newlines
- Blob-based download with auto-generated filename
- Export action tracking

#### AI Pulse Animation
- Custom `usePulseAnimation` hook with double requestAnimationFrame pattern for reliable CSS animation re-triggering
- Configurable pulse interval (default 45 seconds)
- Respects `prefers-reduced-motion` media query — disables animation when user prefers reduced motion
- Cleanup on unmount (clears interval and cancels pending RAF)

#### Data Layer
- Static mock data for all charts, metrics, tables, and AI responses
- Relative date utilities for generating month/year labels from a reference date
- Comprehensive keyword-to-response mapping with 3+ responses per category
- Regional performance data with computed status levels
- Partnership intelligence narratives with embedded metrics and action chips

#### Infrastructure
- Vite 5 build tool with React plugin and path aliases (`@/` → `src/`)
- Code splitting: separate chunks for React vendor and Recharts library
- Tailwind CSS 3 with custom design tokens (colors, spacing, shadows, animations)
- Urbanist font family via @fontsource
- Vercel deployment configuration with SPA rewrites and security headers
- Vitest test runner with jsdom environment and React Testing Library

#### Accessibility
- Semantic HTML with ARIA roles, labels, and live regions throughout
- Full keyboard navigation for tabs, chat, and interactive elements
- Focus-visible ring styles for all interactive elements
- Screen reader announcements for loading states, status changes, and chat messages
- `prefers-reduced-motion` support disabling all animations

#### Testing
- Unit tests for ChatContext (state management, localStorage persistence, message lifecycle)
- Unit tests for TabNavigation (rendering, click behavior, keyboard navigation, accessibility)
- Unit tests for MetricCard (rendering, trend directions, category styling, pulse indicator, memo behavior)
- Unit tests for ActionChipBridge (chip clicks, non-chip clicks, multiple chips, edge cases, accessibility)
- Unit tests for usePulseAnimation (initialization, pulse toggling, cleanup, reduced motion, edge cases)
- Unit tests for useTabPersistence (initialization, persist, validation, error handling)
- Unit tests for eventTracking (all trackers, PII masking, log format, console unavailability)
- Unit tests for keywordMatch (category matching, fallback, delay range, case insensitivity, scoring)
- Unit tests for piiMasker (known values, case sensitivity, partial matches, nested objects, arrays)