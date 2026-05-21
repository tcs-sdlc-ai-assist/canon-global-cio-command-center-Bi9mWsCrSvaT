import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../constants/piiConstants';

export const AI_INSIGHTS_CONFIG = Object.freeze({
  confidenceLevel: 94.7,
  confidenceLabel: 'High Confidence',
  confidenceDescription: 'AI analysis based on real-time data across all regions and business units',
  lastUpdated: '2025-01-13T08:30:00Z',
});

export const STRATEGIC_PRIORITIES = Object.freeze({
  title: 'Strategic Priorities',
  items: Object.freeze([
    {
      id: 'sp-accelerate-ai',
      label: 'Accelerate AI/ML deployment to 60 models by Q2',
      category: 'innovation',
      impact: 'high',
    },
    {
      id: 'sp-cloud-migration',
      label: 'Complete cloud migration to 85% by Q3',
      category: 'operations',
      impact: 'high',
    },
    {
      id: 'sp-tcs-expansion',
      label: 'Expand TCS partnership into IoT and edge computing',
      category: 'partnership',
      impact: 'medium',
    },
    {
      id: 'sp-americas-digital',
      label: 'Launch digital transformation acceleration in Americas',
      category: 'regional',
      impact: 'medium',
    },
    {
      id: 'sp-sustainability-tech',
      label: 'Establish dedicated sustainability technology practice',
      category: 'innovation',
      impact: 'medium',
    },
    {
      id: 'sp-zero-trust',
      label: 'Implement zero-trust architecture for all cloud workloads',
      category: 'risk',
      impact: 'high',
    },
  ]),
});

export const EXECUTIVE_ACTIONS = Object.freeze({
  title: 'Executive Actions',
  items: Object.freeze([
    {
      id: 'ea-board-approval',
      label: 'Approve additional €50M investment in AI/ML pipeline',
      category: 'innovation',
      urgency: 'immediate',
    },
    {
      id: 'ea-cloud-endorsement',
      label: 'Endorse cloud migration acceleration to 85% by Q2',
      category: 'operations',
      urgency: 'immediate',
    },
    {
      id: 'ea-tcs-expansion',
      label: 'Support TCS partnership expansion into quantum computing',
      category: 'partnership',
      urgency: 'this-quarter',
    },
    {
      id: 'ea-americas-program',
      label: 'Authorize digital transformation program in Americas region',
      category: 'regional',
      urgency: 'this-quarter',
    },
    {
      id: 'ea-post-quantum',
      label: 'Begin post-quantum cryptography migration planning',
      category: 'risk',
      urgency: 'this-quarter',
    },
    {
      id: 'ea-innovation-office',
      label: 'Establish Chief Innovation Office for cross-regional coordination',
      category: 'innovation',
      urgency: 'next-quarter',
    },
  ]),
});

export const AI_INSIGHT_NARRATIVES = Object.freeze([
  {
    id: 'narrative-performance',
    title: 'Performance Excellence',
    content: 'Canon\'s IT organization is operating at peak efficiency with 94.2% Global IT Health score. APAC leads at 96.1%, driven by digital-first culture and mature partner ecosystem. The innovation portfolio of €47.3M is delivering 310% ROI, with AI/ML models in production growing from 33 to 47 this year. Security posture improved to 96.2% following successful SOC 2 Type II recertification and GDPR audit with zero findings.',
    chips: Object.freeze([
      'Regional performance comparison',
      'Innovation pipeline overview',
      'Security posture assessment',
    ]),
  },
  {
    id: 'narrative-expansion',
    title: 'Expansion Opportunity',
    content: 'Significant growth opportunities exist across all regions. Americas region shows the most room for improvement with 91.2% efficiency and 75.2% innovation scores — the 14 active innovation initiatives represent €22M in potential value. Europe\'s compliance leadership (97.2%) creates competitive advantage for regulated industry solutions worth an estimated €80M. India CoE\'s innovation model should be scaled globally to capture €30M in incremental value.',
    chips: Object.freeze([
      'Regional performance comparison',
      'Business value impact summary',
      'Digital transformation progress',
    ]),
  },
]);

export const AI_INSIGHT_SECTIONS = Object.freeze({
  confidence: AI_INSIGHTS_CONFIG,
  priorities: STRATEGIC_PRIORITIES,
  actions: EXECUTIVE_ACTIONS,
  narratives: AI_INSIGHT_NARRATIVES,
});

export function getStrategicPriorityById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }
  return STRATEGIC_PRIORITIES.items.find(item => item.id === id) || null;
}

export function getExecutiveActionById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }
  return EXECUTIVE_ACTIONS.items.find(item => item.id === id) || null;
}

export function getNarrativeById(id) {
  if (typeof id !== 'string' || id.length === 0) {
    return null;
  }
  return AI_INSIGHT_NARRATIVES.find(item => item.id === id) || null;
}

export function getPrioritiesByCategory(category) {
  if (typeof category !== 'string' || category.length === 0) {
    return [];
  }
  return STRATEGIC_PRIORITIES.items.filter(item => item.category === category);
}

export function getActionsByUrgency(urgency) {
  if (typeof urgency !== 'string' || urgency.length === 0) {
    return [];
  }
  return EXECUTIVE_ACTIONS.items.filter(item => item.urgency === urgency);
}

export function getHighImpactPriorities() {
  return STRATEGIC_PRIORITIES.items.filter(item => item.impact === 'high');
}

export function getImmediateActions() {
  return EXECUTIVE_ACTIONS.items.filter(item => item.urgency === 'immediate');
}

export function getAllChipLabels() {
  const labels = [];

  for (const item of STRATEGIC_PRIORITIES.items) {
    labels.push(item.label);
  }

  for (const item of EXECUTIVE_ACTIONS.items) {
    labels.push(item.label);
  }

  for (const narrative of AI_INSIGHT_NARRATIVES) {
    for (const chip of narrative.chips) {
      labels.push(chip);
    }
  }

  return Object.freeze([...new Set(labels)]);
}