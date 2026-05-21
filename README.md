# Canon Global CIO Command Center

Executive dashboard for real-time business intelligence, strategic performance monitoring, and AI-powered insights across Canon's global IT operations.

## Tech Stack

- **Framework:** React 18.x with Vite 5
- **Styling:** Tailwind CSS 3 with custom design tokens
- **Charts:** Recharts 2.x
- **Testing:** Vitest with React Testing Library
- **Font:** Urbanist via @fontsource
- **Deployment:** Vercel static hosting

## Folder Structure

```
canon-cio-command-center/
├── public/                     # Static assets
├── src/
│   ├── components/             # Shared UI components
│   │   ├── charts/             # Recharts chart components
│   │   ├── layout/             # Dashboard layout, header, tabs
│   │   ├── panels/             # Tab panel components
│   │   ├── shared/             # MetricCard, ActionChip, StatusBadge, etc.
│   │   └── tables/             # PerformanceTable component
│   ├── constants/              # App constants (tabs, categories, tracking, etc.)
│   ├── context/                # React context providers (Dashboard, Chat)
│   ├── data/                   # Static mock data for charts, metrics, tables
│   │   └── utils/              # Date utilities for mock data generation
│   ├── features/               # Feature-specific components
│   │   ├── chat/               # AI Chat Assistant
│   │   └── dashboard/          # Dashboard tab panels
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions (event tracking, CSV export, etc.)
│   ├── App.jsx                 # Root application component
│   ├── index.css               # Global styles and Tailwind directives
│   └── main.jsx                # Application entry point
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── vercel.json                 # Vercel deployment configuration
└── vite.config.js              # Vite build configuration
```

## Setup

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd canon-cio-command-center

# Install dependencies
npm install

# Copy environment variables (optional — no variables required for MVP)
cp .env.example .env
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

### Testing

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Usage Guide

### Dashboard Tabs

The dashboard provides 7 executive panels accessible via the tab navigation bar:

| Tab | Description |
|-----|-------------|
| **Strategic Command** | KPI overview, AI insights panel, quick action chips, and strategic performance trend chart |
| **Executive Summary** | Operational excellence metrics, regional performance radar chart, and sortable regional performance table |
| **Business Impact** | IT business value creation metrics and bar chart showing revenue attribution by category |
| **Operations** | Incident management metrics and dual-axis chart (incident volume + MTTR) |
| **Risk & Governance** | Compliance, cybersecurity maturity, and data governance metrics |
| **Innovation** | AI/ML models, pipeline value, patent metrics, and innovation portfolio doughnut chart |
| **Partnerships** | TCS partnership metrics, investment vs. value timeline chart, and strategic intelligence panel |

### Charts

All charts are built with Recharts and include:

- **TrendChart** — Multi-line chart for strategic performance trends (12-month rolling)
- **BusinessImpactBarChart** — Bar chart for IT business value creation by category with YoY growth tooltips
- **DoughnutChartWrapper** — Doughnut chart for innovation portfolio distribution with center label
- **DualAxisChart** — Composed bar + line chart for incident trends and MTTR with dual Y-axes
- **RadarChartWrapper** — Radar chart for regional performance comparison across 5 dimensions
- **TimelineChart** — Bar chart for partnership investment vs. value delivered with projected year differentiation

Charts support empty state handling, custom tooltips, legend interactions, and keyboard accessibility.

### AI Chat Assistant

The AI Strategic Assistant provides rule-based responses across 6 categories:

- **Q4 Board** — Board presentation materials, executive summaries, quarterly reviews
- **TCS Partnership** — Partnership performance, SLA achievement, co-innovation projects
- **Business Value** — Revenue attribution, cost avoidance, ROI analysis
- **Regional** — Regional performance comparison, efficiency scores, adoption rates
- **Innovation** — AI/ML models, innovation pipeline, patent portfolio
- **Security & Risk** — Compliance certifications, cybersecurity maturity, vulnerability management

**Keyboard shortcuts:**
- `Enter` — Send message
- `Shift + Enter` — New line
- `Escape` — Close chat drawer

### Action Chips

Action chips are pill-shaped buttons throughout the dashboard that trigger AI-powered analysis. Clicking any action chip:

1. Opens the AI Chat Assistant
2. Pre-fills the input with the chip's label text
3. Tracks the interaction for analytics

Action chips appear in Quick Actions, AI Insights panels, and the Strategic Intelligence panel.

## Deployment

### Vercel

The project is configured for deployment on Vercel as a static site:

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

The `vercel.json` configuration includes:

- SPA rewrites (all routes serve `index.html`)
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`)
- Long-term caching for assets in `/assets/`

### Build Output

The production build outputs to the `dist/` directory with code splitting:

- **vendor** chunk — React and React DOM
- **charts** chunk — Recharts library
- **main** chunk — Application code

## Accessibility

The dashboard follows WCAG 2.1 AA guidelines:

- Semantic HTML with ARIA roles, labels, and live regions
- Full keyboard navigation for tabs (arrow keys, Home/End, Enter/Space)
- Focus-visible ring styles for all interactive elements
- Screen reader announcements for loading states and status changes
- `prefers-reduced-motion` support disabling all animations

## License

Private. All rights reserved.