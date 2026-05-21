import { getRelativeMonths, getRelativeYears, REFERENCE_DATE } from './utils/dates';

const months = getRelativeMonths(REFERENCE_DATE, 12);
const monthLabels = months.map(m => m.label);

export const strategicTrends = Object.freeze(
  months.map((month, index) => {
    const baseBusinessImpact = 78 + index * 1.2;
    const baseOperationalExcellence = 82 + index * 0.9;
    const baseInnovationIndex = 65 + index * 1.5;

    const seasonalBusiness = index >= 9 ? 2.5 : index >= 6 ? 1.8 : 0;
    const seasonalOps = index >= 8 ? 1.5 : 0;
    const seasonalInnovation = index >= 7 ? 3.0 : index >= 4 ? 1.5 : 0;

    return Object.freeze({
      month: month.label,
      shortMonth: month.shortLabel,
      businessImpact: Math.round((baseBusinessImpact + seasonalBusiness) * 10) / 10,
      operationalExcellence: Math.round((baseOperationalExcellence + seasonalOps) * 10) / 10,
      innovationIndex: Math.round((baseInnovationIndex + seasonalInnovation) * 10) / 10,
    });
  })
);

export const regionalRadar = Object.freeze([
  {
    dimension: 'Service Excellence',
    emea: 94,
    apac: 96,
    americas: 91,
    fullMark: 100,
  },
  {
    dimension: 'Innovation',
    emea: 78,
    apac: 82,
    americas: 75,
    fullMark: 100,
  },
  {
    dimension: 'Compliance',
    emea: 97,
    apac: 94,
    americas: 95,
    fullMark: 100,
  },
  {
    dimension: 'Cost Efficiency',
    emea: 88,
    apac: 91,
    americas: 84,
    fullMark: 100,
  },
  {
    dimension: 'Digital Maturity',
    emea: 80,
    apac: 85,
    americas: 77,
    fullMark: 100,
  },
]);

export const businessImpactBar = Object.freeze([
  {
    category: 'Digital Channels',
    currentYear: 816,
    previousYear: 680,
    growth: 20,
  },
  {
    category: 'Cloud Services',
    currentYear: 624,
    previousYear: 520,
    growth: 20,
  },
  {
    category: 'Automation',
    currentYear: 432,
    previousYear: 310,
    growth: 39.4,
  },
  {
    category: 'AI/ML Solutions',
    currentYear: 336,
    previousYear: 210,
    growth: 60,
  },
  {
    category: 'Consulting',
    currentYear: 192,
    previousYear: 180,
    growth: 6.7,
  },
]);

export const incidentTrends = Object.freeze(
  months.map((month, index) => {
    const baseIncidents = 1400 - index * 18;
    const baseMTTR = 4.2 - index * 0.18;

    const spikeIncidents = index === 3 ? 80 : index === 8 ? 40 : 0;
    const spikeMTTR = index === 3 ? 0.4 : index === 8 ? 0.2 : 0;

    return Object.freeze({
      month: month.label,
      shortMonth: month.shortLabel,
      incidents: Math.round(baseIncidents + spikeIncidents),
      mttr: Math.round((baseMTTR + spikeMTTR) * 10) / 10,
    });
  })
);

export const innovationDoughnut = Object.freeze([
  { name: 'AI & Machine Learning', value: 35, color: '#3B82F6' },
  { name: 'Cloud Native Platforms', value: 25, color: '#8B5CF6' },
  { name: 'IoT & Edge Computing', value: 18, color: '#10B981' },
  { name: 'Cybersecurity', value: 14, color: '#F59E0B' },
  { name: 'Quantum & Advanced Computing', value: 8, color: '#EF4444' },
]);

const years = getRelativeYears(REFERENCE_DATE, 6);

export const partnershipTimeline = Object.freeze(
  years.map((year, index) => {
    const isProjected = year.year > 2025;
    const baseInvestment = 120 + index * 25;
    const baseValue = 180 + index * 40;

    const investment = isProjected
      ? Math.round((baseInvestment + (index - 5) * 10) * 10) / 10
      : Math.round(baseInvestment * 10) / 10;

    const valueDelivered = isProjected
      ? Math.round((baseValue + (index - 5) * 15) * 10) / 10
      : Math.round(baseValue * 10) / 10;

    return Object.freeze({
      year: year.label,
      investment,
      valueDelivered,
      isProjected,
    });
  })
);