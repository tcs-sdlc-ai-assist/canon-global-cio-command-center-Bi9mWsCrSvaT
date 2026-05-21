import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../constants/piiConstants';

export const STATUS_LEVELS = Object.freeze({
  EXCELLENT: 'excellent',
  GOOD: 'good',
  WARNING: 'warning',
  CRITICAL: 'critical',
});

export const STATUS_LABELS = Object.freeze({
  [STATUS_LEVELS.EXCELLENT]: 'Excellent',
  [STATUS_LEVELS.GOOD]: 'Good',
  [STATUS_LEVELS.WARNING]: 'Warning',
  [STATUS_LEVELS.CRITICAL]: 'Critical',
});

export const STATUS_COLORS = Object.freeze({
  [STATUS_LEVELS.EXCELLENT]: '#16A34A',
  [STATUS_LEVELS.GOOD]: '#2563EB',
  [STATUS_LEVELS.WARNING]: '#D97706',
  [STATUS_LEVELS.CRITICAL]: '#DC2626',
});

export const STATUS_BG_COLORS = Object.freeze({
  [STATUS_LEVELS.EXCELLENT]: 'bg-green-100 text-green-800',
  [STATUS_LEVELS.GOOD]: 'bg-blue-100 text-blue-800',
  [STATUS_LEVELS.WARNING]: 'bg-amber-100 text-amber-800',
  [STATUS_LEVELS.CRITICAL]: 'bg-red-100 text-red-800',
});

export const REGIONS = Object.freeze({
  EUROPE: 'europe',
  AMERICAS: 'americas',
  APAC: 'apac',
  INDIA_COE: 'india_coe',
});

export const REGION_LABELS = Object.freeze({
  [REGIONS.EUROPE]: 'Europe (EMEA)',
  [REGIONS.AMERICAS]: 'Americas',
  [REGIONS.APAC]: 'Asia Pacific',
  [REGIONS.INDIA_COE]: 'India CoE',
});

export const TABLE_COLUMNS = Object.freeze([
  {
    key: 'region',
    label: 'Region',
    sortable: true,
    width: 'min-w-[160px]',
  },
  {
    key: 'efficiency',
    label: 'Efficiency',
    sortable: true,
    width: 'min-w-[120px]',
    format: 'percentage',
  },
  {
    key: 'adoption',
    label: 'Adoption',
    sortable: true,
    width: 'min-w-[120px]',
    format: 'percentage',
  },
  {
    key: 'security',
    label: 'Security',
    sortable: true,
    width: 'min-w-[120px]',
    format: 'percentage',
  },
  {
    key: 'innovation',
    label: 'Innovation',
    sortable: true,
    width: 'min-w-[120px]',
    format: 'percentage',
  },
  {
    key: 'satisfaction',
    label: 'Satisfaction',
    sortable: true,
    width: 'min-w-[120px]',
    format: 'percentage',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: 'min-w-[100px]',
    format: 'badge',
  },
]);

function getStatusForScore(score) {
  if (score >= 95) return STATUS_LEVELS.EXCELLENT;
  if (score >= 85) return STATUS_LEVELS.GOOD;
  if (score >= 70) return STATUS_LEVELS.WARNING;
  return STATUS_LEVELS.CRITICAL;
}

function getOverallStatus(scores) {
  const values = Object.values(scores).filter(v => typeof v === 'number');
  if (values.length === 0) return STATUS_LEVELS.WARNING;

  const average = values.reduce((sum, v) => sum + v, 0) / values.length;
  return getStatusForScore(average);
}

export const regionalPerformance = Object.freeze([
  {
    id: 'region-europe',
    region: REGIONS.EUROPE,
    regionLabel: REGION_LABELS[REGIONS.EUROPE],
    efficiency: 93.8,
    adoption: 88.4,
    security: 97.2,
    innovation: 78.6,
    satisfaction: 91.3,
    status: getOverallStatus({
      efficiency: 93.8,
      adoption: 88.4,
      security: 97.2,
      innovation: 78.6,
      satisfaction: 91.3,
    }),
    highlights: [
      'GDPR compliance at 99.1%',
      'Cloud migration 76% complete',
      'Digital workplace adoption +14% YoY',
    ],
    aiInsight: 'Europe leads in security compliance with 97.2% score. Innovation index at 78.6% presents growth opportunity — AI/ML adoption in manufacturing vertical could add €120M in attributed revenue.',
  },
  {
    id: 'region-americas',
    region: REGIONS.AMERICAS,
    regionLabel: REGION_LABELS[REGIONS.AMERICAS],
    efficiency: 91.2,
    adoption: 85.7,
    security: 94.5,
    innovation: 75.2,
    satisfaction: 88.9,
    status: getOverallStatus({
      efficiency: 91.2,
      adoption: 85.7,
      security: 94.5,
      innovation: 75.2,
      satisfaction: 88.9,
    }),
    highlights: [
      'SOC 2 Type II certified',
      'Infrastructure modernization at 68%',
      'Service desk satisfaction +8% QoQ',
    ],
    aiInsight: 'Americas region shows solid operational performance. Security posture improved 3.4pp following SOC 2 recertification. Innovation pipeline in North America has 14 active initiatives valued at €22M.',
  },
  {
    id: 'region-apac',
    region: REGIONS.APAC,
    regionLabel: REGION_LABELS[REGIONS.APAC],
    efficiency: 96.1,
    adoption: 92.3,
    security: 94.8,
    innovation: 82.4,
    satisfaction: 94.7,
    status: getOverallStatus({
      efficiency: 96.1,
      adoption: 92.3,
      security: 94.8,
      innovation: 82.4,
      satisfaction: 94.7,
    }),
    highlights: [
      'Highest operational efficiency globally',
      'AI/ML adoption leader at 82.4%',
      'Digital channel revenue +18% YoY',
    ],
    aiInsight: 'APAC is the top-performing region with 96.1% efficiency and 94.7% satisfaction. Innovation index at 82.4% is the highest globally. Japan and Australia markets driving digital transformation acceleration.',
  },
  {
    id: 'region-india-coe',
    region: REGIONS.INDIA_COE,
    regionLabel: REGION_LABELS[REGIONS.INDIA_COE],
    efficiency: 94.5,
    adoption: 90.8,
    security: 95.6,
    innovation: 85.1,
    satisfaction: 92.2,
    status: getOverallStatus({
      efficiency: 94.5,
      adoption: 90.8,
      security: 95.6,
      innovation: 85.1,
      satisfaction: 92.2,
    }),
    highlights: [
      'Innovation leader at 85.1%',
      'TCS partnership delivery center',
      'Patent applications +12 YoY',
    ],
    aiInsight: 'India CoE excels in innovation with 85.1% score — the highest across all regions. TCS strategic partnership delivery center achieving 98.7% SLA compliance. Joint IP development in AI and cloud-native platforms accelerating.',
  },
]);

export const ALL_REGIONS = Object.freeze(Object.values(REGIONS));

export function getRegionById(regionId) {
  if (typeof regionId !== 'string' || regionId.length === 0) {
    return null;
  }
  return regionalPerformance.find(r => r.region === regionId) || null;
}

export function getRegionByLabel(label) {
  if (typeof label !== 'string' || label.length === 0) {
    return null;
  }
  return regionalPerformance.find(r => r.regionLabel === label) || null;
}

export function getRegionsByStatus(status) {
  if (!Object.values(STATUS_LEVELS).includes(status)) {
    return [];
  }
  return regionalPerformance.filter(r => r.status === status);
}

export function getTopPerformingRegion() {
  const scored = regionalPerformance.map(region => {
    const avg = (
      region.efficiency +
      region.adoption +
      region.security +
      region.innovation +
      region.satisfaction
    ) / 5;
    return { region, avg };
  });

  scored.sort((a, b) => b.avg - a.avg);
  return scored[0]?.region || null;
}

export function getRegionalAverages() {
  const count = regionalPerformance.length;
  if (count === 0) return null;

  const totals = regionalPerformance.reduce(
    (acc, region) => ({
      efficiency: acc.efficiency + region.efficiency,
      adoption: acc.adoption + region.adoption,
      security: acc.security + region.security,
      innovation: acc.innovation + region.innovation,
      satisfaction: acc.satisfaction + region.satisfaction,
    }),
    { efficiency: 0, adoption: 0, security: 0, innovation: 0, satisfaction: 0 }
  );

  return Object.freeze({
    efficiency: Math.round((totals.efficiency / count) * 10) / 10,
    adoption: Math.round((totals.adoption / count) * 10) / 10,
    security: Math.round((totals.security / count) * 10) / 10,
    innovation: Math.round((totals.innovation / count) * 10) / 10,
    satisfaction: Math.round((totals.satisfaction / count) * 10) / 10,
  });
}

export const TABLE_SORT_ORDERS = Object.freeze({
  ASC: 'asc',
  DESC: 'desc',
});

export function sortRegionalData(data, columnKey, order = TABLE_SORT_ORDERS.ASC) {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  if (!columnKey || typeof columnKey !== 'string') {
    return [...data];
  }

  const validColumns = TABLE_COLUMNS.map(col => col.key);
  if (!validColumns.includes(columnKey)) {
    return [...data];
  }

  const sorted = [...data].sort((a, b) => {
    let aVal = a[columnKey];
    let bVal = b[columnKey];

    if (columnKey === 'region') {
      aVal = a.regionLabel || '';
      bVal = b.regionLabel || '';
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal;
    }

    return 0;
  });

  if (order === TABLE_SORT_ORDERS.DESC) {
    sorted.reverse();
  }

  return Object.freeze(sorted);
}