import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../constants/piiConstants';

export const PARTNERSHIP_INTELLIGENCE_CONFIG = Object.freeze({
  lastUpdated: '2025-01-13T09:15:00Z',
  dataSource: 'TCS Quarterly Business Review',
  confidenceLevel: 96.4,
  confidenceLabel: 'High Confidence',
});

export const PERFORMANCE_EXCELLENCE_NARRATIVE = Object.freeze({
  id: 'partnership-performance-excellence',
  title: 'Performance Excellence',
  content: `The TCS strategic partnership continues to deliver exceptional value across all dimensions. Partnership ROI has reached 170%, exceeding the 150% target by 20 percentage points. Service excellence stands at 98.7% SLA achievement across all service lines — application support at 99.1%, infrastructure management at 98.4%, and service desk operations at 98.6%. Annual investment of €120M generates €204M in value, with joint innovation initiatives contributing €85M in incremental value. The global delivery network spans India, Philippines, and Eastern Europe, achieving 96.4% delivery excellence with attrition reduced to 12.3% — well below the 15% industry benchmark.`,
  metrics: Object.freeze([
    {
      id: 'perf-roi',
      label: 'Partnership ROI',
      value: '170%',
      trend: 'up',
      trendValue: '+15pp',
      trendLabel: 'vs last year',
    },
    {
      id: 'perf-sla',
      label: 'SLA Achievement',
      value: '98.7%',
      trend: 'up',
      trendValue: '+1.2pp',
      trendLabel: 'vs last quarter',
    },
    {
      id: 'perf-investment',
      label: 'Annual Investment',
      value: '€120M',
      trend: 'up',
      trendValue: '+8.3%',
      trendLabel: 'vs last year',
    },
    {
      id: 'perf-value',
      label: 'Value Delivered',
      value: '€204M',
      trend: 'up',
      trendValue: '+12.1%',
      trendLabel: 'vs last year',
    },
    {
      id: 'perf-footprint',
      label: 'Global Delivery Excellence',
      value: '96.4%',
      trend: 'up',
      trendValue: '+2.8pp',
      trendLabel: 'vs last quarter',
    },
  ]),
  chips: Object.freeze([
    'TCS contract expansion analysis',
    'Partnership performance deep-dive',
    'Service line breakdown by region',
  ]),
});

export const EXPANSION_OPPORTUNITY_NARRATIVE = Object.freeze({
  id: 'partnership-expansion-opportunity',
  title: 'Expansion Opportunity',
  content: `Significant growth opportunities exist to expand the TCS partnership into new domains. The co-innovation pipeline has grown from 8 to 12 active projects, with joint IP development in AI/ML, IoT, and cloud-native platforms. Expanding into quantum computing research and edge computing solutions could add an estimated €45M in incremental value over the next 18 months. The partnership's SOC 2 Type II certification and ISO 27001 compliance provide a strong foundation for regulated industry solutions. Automation-driven efficiency improvements have already reduced MTTR by 31%, and further AIOps collaboration could unlock an additional €30M in annual cost savings. The current contract term provides a natural inflection point to negotiate expanded scope with enhanced innovation incentives.`,
  metrics: Object.freeze([
    {
      id: 'exp-ai-ml',
      label: 'AI/ML Co-Innovation Projects',
      value: '12',
      trend: 'up',
      trendValue: '+4',
      trendLabel: 'vs last year',
    },
    {
      id: 'exp-soc',
      label: 'SOC 2 Type II',
      value: 'Certified',
      trend: 'neutral',
      trendValue: 'Maintained',
      trendLabel: 'annual recertification',
    },
    {
      id: 'exp-automation',
      label: 'Automation Efficiency',
      value: '31%',
      trend: 'up',
      trendValue: '+8pp',
      trendLabel: 'MTTR reduction',
    },
    {
      id: 'exp-contract',
      label: 'Contract Term',
      value: 'Q3 2026',
      trend: 'neutral',
      trendValue: 'Renewal window',
      trendLabel: 'opens Q1 2026',
    },
    {
      id: 'exp-expected-value',
      label: 'Expected Incremental Value',
      value: '€45M',
      trend: 'up',
      trendValue: 'Projected',
      trendLabel: 'next 18 months',
    },
  ]),
  chips: Object.freeze([
    'TCS partnership expansion strategy',
    'Co-innovation pipeline overview',
    'Quantum computing research proposal',
  ]),
});

export const PARTNERSHIP_ACTION_CHIPS = Object.freeze([
  {
    id: 'pac-business-case',
    label: 'Build business case for TCS expansion',
    section: 'partnership-intel',
    variant: 'primary',
  },
  {
    id: 'pac-contract-strategy',
    label: 'Develop contract negotiation strategy',
    section: 'partnership-intel',
    variant: 'default',
  },
  {
    id: 'pac-board-approval',
    label: 'Prepare board approval presentation',
    section: 'partnership-intel',
    variant: 'default',
  },
  {
    id: 'pac-co-innovation',
    label: 'Review co-innovation portfolio performance',
    section: 'partnership-intel',
    variant: 'default',
  },
  {
    id: 'pac-quantum-research',
    label: 'Evaluate quantum computing partnership scope',
    section: 'partnership-intel',
    variant: 'outline',
  },
  {
    id: 'pac-sla-review',
    label: 'Analyze SLA trends across service lines',
    section: 'partnership-intel',
    variant: 'outline',
  },
]);

export const PARTNERSHIP_INTELLIGENCE_SECTIONS = Object.freeze({
  config: PARTNERSHIP_INTELLIGENCE_CONFIG,
  performanceExcellence: PERFORMANCE_EXCELLENCE_NARRATIVE,
  expansionOpportunity: EXPANSION_OPPORTUNITY_NARRATIVE,
  actionChips: PARTNERSHIP_ACTION_CHIPS,
});

export function getPartnershipNarrativeById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }

  if (id === PERFORMANCE_EXCELLENCE_NARRATIVE.id) {
    return PERFORMANCE_EXCELLENCE_NARRATIVE;
  }

  if (id === EXPANSION_OPPORTUNITY_NARRATIVE.id) {
    return EXPANSION_OPPORTUNITY_NARRATIVE;
  }

  return null;
}

export function getPartnershipActionChipById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }

  return PARTNERSHIP_ACTION_CHIPS.find(chip => chip.id === id) || null;
}

export function getPartnershipActionChipsBySection(section) {
  if (typeof section !== 'string' || section.length === 0) {
    return [];
  }

  return Object.freeze(
    PARTNERSHIP_ACTION_CHIPS.filter(chip => chip.section === section)
  );
}

export function getPartnershipActionChipsByVariant(variant) {
  if (typeof variant !== 'string' || variant.length === 0) {
    return [];
  }

  return Object.freeze(
    PARTNERSHIP_ACTION_CHIPS.filter(chip => chip.variant === variant)
  );
}

export function getAllPartnershipChipLabels() {
  return Object.freeze(
    PARTNERSHIP_ACTION_CHIPS.map(chip => chip.label)
  );
}

export function getAllPartnershipNarrativeChipLabels() {
  const labels = [];

  for (const chip of PERFORMANCE_EXCELLENCE_NARRATIVE.chips) {
    labels.push(chip);
  }

  for (const chip of EXPANSION_OPPORTUNITY_NARRATIVE.chips) {
    labels.push(chip);
  }

  return Object.freeze([...new Set(labels)]);
}

export function getPartnershipMetricById(metricId) {
  if (typeof metricId !== 'string' || metricId.length === 0) {
    return null;
  }

  const allMetrics = [
    ...PERFORMANCE_EXCELLENCE_NARRATIVE.metrics,
    ...EXPANSION_OPPORTUNITY_NARRATIVE.metrics,
  ];

  return allMetrics.find(m => m.id === metricId) || null;
}

export function getPartnershipMetricsByNarrative(narrativeId) {
  if (typeof narrativeId !== 'string' || narrativeId.length === 0) {
    return [];
  }

  if (narrativeId === PERFORMANCE_EXCELLENCE_NARRATIVE.id) {
    return PERFORMANCE_EXCELLENCE_NARRATIVE.metrics;
  }

  if (narrativeId === EXPANSION_OPPORTUNITY_NARRATIVE.id) {
    return EXPANSION_OPPORTUNITY_NARRATIVE.metrics;
  }

  return [];
}