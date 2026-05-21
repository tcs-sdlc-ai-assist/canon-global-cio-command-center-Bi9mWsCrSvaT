import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../constants/piiConstants';

export const strategicMetrics = Object.freeze([
  {
    id: 'revenue-attribution',
    title: 'Revenue Attribution',
    value: '€2.4B',
    trend: 'up',
    trendValue: '+12.3%',
    trendLabel: 'vs last year',
    aiInsight: 'IT-enabled revenue growth exceeds target by 3.2 percentage points, driven by digital channel expansion in EMEA.',
    category: 'business',
    showPulse: true,
  },
  {
    id: 'cost-avoidance',
    title: 'Cost Avoidance',
    value: '€487M',
    trend: 'up',
    trendValue: '+8.7%',
    trendLabel: 'vs last year',
    aiInsight: 'Cloud migration and vendor consolidation contributed 62% of total cost avoidance. Additional €120M projected through Q2 automation initiatives.',
    category: 'business',
    showPulse: true,
  },
  {
    id: 'innovation-roi',
    title: 'Innovation ROI',
    value: '310%',
    trend: 'up',
    trendValue: '+45pp',
    trendLabel: 'vs last year',
    aiInsight: 'AI/ML portfolio delivering 3.1x return. Top performer: predictive maintenance solution with 480% ROI in manufacturing vertical.',
    category: 'innovation',
    showPulse: true,
  },
]);

export const executiveMetrics = Object.freeze([
  {
    id: 'global-it-health',
    title: 'Global IT Health',
    value: '94.2%',
    trend: 'up',
    trendValue: '+2.1pp',
    trendLabel: 'vs last quarter',
    aiInsight: 'Overall health score improved across all regions. APAC leads at 96.1%, EMEA at 93.8%, Americas at 92.7%. Infrastructure modernization driving gains.',
    category: 'operations',
    showPulse: true,
  },
  {
    id: 'system-availability',
    title: 'System Availability',
    value: '99.97%',
    trend: 'up',
    trendValue: '+0.02pp',
    trendLabel: 'vs last quarter',
    aiInsight: 'Five-nines availability maintained for core ERP and CRM platforms. Only 2.6 hours of unplanned downtime across all critical systems this quarter.',
    category: 'operations',
    showPulse: false,
  },
  {
    id: 'security-posture',
    title: 'Security Posture',
    value: '96.2%',
    trend: 'up',
    trendValue: '+3.4pp',
    trendLabel: 'vs last quarter',
    aiInsight: 'Compliance score improved following successful SOC 2 Type II recertification. Zero critical vulnerabilities past 30-day remediation window.',
    category: 'risk',
    showPulse: true,
  },
  {
    id: 'digital-transformation',
    title: 'Digital Transformation',
    value: '78%',
    trend: 'up',
    trendValue: '+11pp',
    trendLabel: 'vs last year',
    aiInsight: 'Digital maturity index at 78% against 2025 target of 85%. Cloud migration at 73% complete. AI adoption accelerated across 14 business units.',
    category: 'innovation',
    showPulse: true,
  },
]);

export const businessImpactMetrics = Object.freeze([
  {
    id: 'revenue-attribution-impact',
    title: 'Revenue Attribution',
    value: '€2.4B',
    trend: 'up',
    trendValue: '+12.3%',
    trendLabel: 'vs last year',
    aiInsight: 'Digital channels now represent 34% of total attributed revenue. EMEA region contributes 42% of IT-enabled revenue growth.',
    category: 'business',
    showPulse: true,
  },
  {
    id: 'cost-avoidance-impact',
    title: 'Cost Avoidance',
    value: '€487M',
    trend: 'up',
    trendValue: '+8.7%',
    trendLabel: 'vs last year',
    aiInsight: 'Infrastructure optimization saved €210M. Application rationalization contributed €155M. Vendor renegotiation added €122M.',
    category: 'business',
    showPulse: false,
  },
  {
    id: 'innovation-roi-impact',
    title: 'Innovation ROI',
    value: '310%',
    trend: 'up',
    trendValue: '+45pp',
    trendLabel: 'vs last year',
    aiInsight: 'Active innovation portfolio of €47.3M across 28 initiatives. Expected incremental revenue of €180M from current pipeline.',
    category: 'innovation',
    showPulse: true,
  },
]);

export const operationsMetrics = Object.freeze([
  {
    id: 'total-incidents',
    title: 'Total Incidents',
    value: '1,247',
    trend: 'down',
    trendValue: '-18.3%',
    trendLabel: 'vs last quarter',
    aiInsight: 'Incident volume decreased across all severity levels. P1 incidents reduced by 42% following automated remediation deployment.',
    category: 'operations',
    showPulse: true,
  },
  {
    id: 'mttr',
    title: 'Mean Time to Resolve',
    value: '2.3h',
    trend: 'down',
    trendValue: '-31%',
    trendLabel: 'vs last quarter',
    aiInsight: 'MTTR improvement driven by AIOps implementation. Automated incident classification and routing reduced initial response time by 67%.',
    category: 'operations',
    showPulse: false,
  },
  {
    id: 'infrastructure-efficiency',
    title: 'Infrastructure Efficiency',
    value: '87.4%',
    trend: 'up',
    trendValue: '+5.2pp',
    trendLabel: 'vs last quarter',
    aiInsight: 'Server utilization improved through workload consolidation. Cloud resource optimization saved €34M in annualized costs.',
    category: 'operations',
    showPulse: true,
  },
]);

export const riskMetrics = Object.freeze([
  {
    id: 'compliance-score',
    title: 'Compliance Score',
    value: '96.2%',
    trend: 'up',
    trendValue: '+3.4pp',
    trendLabel: 'vs last quarter',
    aiInsight: 'All regions above 94% compliance threshold. GDPR audit completed with zero findings. ISO 27001 surveillance audit passed.',
    category: 'risk',
    showPulse: true,
  },
  {
    id: 'cybersecurity-maturity',
    title: 'Cybersecurity Maturity',
    value: '4.2/5',
    trend: 'up',
    trendValue: '+0.3',
    trendLabel: 'vs last year',
    aiInsight: 'NIST CSF maturity assessment shows improvement across all five functions. Detect and Respond capabilities now at level 4.5.',
    category: 'risk',
    showPulse: false,
  },
  {
    id: 'data-governance',
    title: 'Data Governance',
    value: '91.8%',
    trend: 'up',
    trendValue: '+6.1pp',
    trendLabel: 'vs last year',
    aiInsight: 'Data classification coverage reached 94%. Privacy impact assessments completed for all new initiatives. Data retention compliance at 98%.',
    category: 'risk',
    showPulse: true,
  },
]);

export const innovationMetrics = Object.freeze([
  {
    id: 'ai-ml-models',
    title: 'AI/ML Models in Production',
    value: '47',
    trend: 'up',
    trendValue: '+14',
    trendLabel: 'vs last year',
    aiInsight: 'Model deployment velocity accelerating. 12 models deployed this quarter alone. MLOps pipeline maturity at level 3.',
    category: 'innovation',
    showPulse: true,
  },
  {
    id: 'pipeline-value',
    title: 'Innovation Pipeline Value',
    value: '€47.3M',
    trend: 'up',
    trendValue: '+22%',
    trendLabel: 'vs last year',
    aiInsight: 'Active portfolio of 28 initiatives. Top 5 projects represent 60% of total pipeline value. Expected commercialization within 18 months.',
    category: 'innovation',
    showPulse: false,
  },
  {
    id: 'patent-applications',
    title: 'Patent Applications',
    value: '38',
    trend: 'up',
    trendValue: '+9',
    trendLabel: 'vs last year',
    aiInsight: 'Patent portfolio growth focused on AI/ML and imaging technologies. 15 patents granted this year. IP protection strategy aligned with business priorities.',
    category: 'innovation',
    showPulse: true,
  },
]);

export const partnershipMetrics = Object.freeze([
  {
    id: 'service-excellence',
    title: 'Service Excellence',
    value: '98.7%',
    trend: 'up',
    trendValue: '+1.2pp',
    trendLabel: 'vs last quarter',
    aiInsight: 'SLA achievement across all TCS service lines. Application support at 99.1%, infrastructure at 98.4%, service desk at 98.6%.',
    category: 'partnership',
    showPulse: true,
  },
  {
    id: 'partnership-roi',
    title: 'Partnership ROI',
    value: '170%',
    trend: 'up',
    trendValue: '+15pp',
    trendLabel: 'vs last year',
    aiInsight: 'TCS strategic partnership delivering 1.7x return. Joint innovation initiatives contributed €85M in incremental value.',
    category: 'partnership',
    showPulse: false,
  },
  {
    id: 'innovation-velocity',
    title: 'Innovation Velocity',
    value: '12',
    trend: 'up',
    trendValue: '+4',
    trendLabel: 'vs last year',
    aiInsight: 'Co-innovation projects with TCS increased from 8 to 12. Joint IP developed in AI, IoT, and cloud-native platforms.',
    category: 'partnership',
    showPulse: true,
  },
  {
    id: 'global-delivery',
    title: 'Global Delivery Excellence',
    value: '96.4%',
    trend: 'up',
    trendValue: '+2.8pp',
    trendLabel: 'vs last quarter',
    aiInsight: 'Delivery centers across India, Philippines, and Eastern Europe performing above benchmark. Attrition rate reduced to 12.3%.',
    category: 'partnership',
    showPulse: false,
  },
]);

export const ALL_METRICS = Object.freeze({
  strategic: strategicMetrics,
  executive: executiveMetrics,
  businessImpact: businessImpactMetrics,
  operations: operationsMetrics,
  risk: riskMetrics,
  innovation: innovationMetrics,
  partnership: partnershipMetrics,
});

export function getMetricsByTab(tabId) {
  const tabMetricMap = {
    strategic_command: strategicMetrics,
    executive_summary: executiveMetrics,
    business_impact: businessImpactMetrics,
    operations: operationsMetrics,
    risk_governance: riskMetrics,
    innovation: innovationMetrics,
    partnerships: partnershipMetrics,
  };

  return Object.freeze(tabMetricMap[tabId] || []);
}

export function getMetricById(metricId) {
  for (const metrics of Object.values(ALL_METRICS)) {
    const found = metrics.find(m => m.id === metricId);
    if (found) return found;
  }
  return null;
}