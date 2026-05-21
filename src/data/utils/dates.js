import { PII_FIELDS, PII_VALUES, SAFE_FIELDS } from '../../constants/piiConstants';

export const REFERENCE_DATE = new Date(2025, 0, 13);

const MONTH_NAMES = Object.freeze([
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]);

const FULL_MONTH_NAMES = Object.freeze([
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]);

export function getRelativeMonths(refDate = REFERENCE_DATE, count = 12) {
  if (!(refDate instanceof Date) || isNaN(refDate.getTime())) {
    throw new TypeError('refDate must be a valid Date object');
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count must be a positive integer');
  }

  const months = [];
  const current = new Date(refDate);

  for (let i = count - 1; i >= 0; i--) {
    const monthDate = new Date(current.getFullYear(), current.getMonth() - i, 1);
    months.push({
      label: `${MONTH_NAMES[monthDate.getMonth()]} ${monthDate.getFullYear()}`,
      shortLabel: MONTH_NAMES[monthDate.getMonth()],
      fullLabel: `${FULL_MONTH_NAMES[monthDate.getMonth()]} ${monthDate.getFullYear()}`,
      month: monthDate.getMonth(),
      year: monthDate.getFullYear(),
      date: monthDate,
    });
  }

  return Object.freeze(months);
}

export function getRelativeYears(refDate = REFERENCE_DATE, count = 5) {
  if (!(refDate instanceof Date) || isNaN(refDate.getTime())) {
    throw new TypeError('refDate must be a valid Date object');
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count must be a positive integer');
  }

  const years = [];
  const currentYear = refDate.getFullYear();

  for (let i = count - 1; i >= 0; i--) {
    const year = currentYear - i;
    years.push({
      label: String(year),
      year,
      date: new Date(year, 0, 1),
    });
  }

  return Object.freeze(years);
}

export function getRelativeQuarters(refDate = REFERENCE_DATE, count = 8) {
  if (!(refDate instanceof Date) || isNaN(refDate.getTime())) {
    throw new TypeError('refDate must be a valid Date object');
  }

  if (!Number.isInteger(count) || count < 1) {
    throw new RangeError('count must be a positive integer');
  }

  const quarters = [];
  const current = new Date(refDate);
  const currentQuarter = Math.floor(current.getMonth() / 3);
  const startQuarterOffset = count - 1;

  for (let i = startQuarterOffset; i >= 0; i--) {
    const totalQuarters = currentQuarter + current.getFullYear() * 4 - i;
    const year = Math.floor(totalQuarters / 4);
    const quarter = totalQuarters % 4;
    const quarterDate = new Date(year, quarter * 3, 1);

    quarters.push({
      label: `Q${quarter + 1} ${year}`,
      shortLabel: `Q${quarter + 1}`,
      quarter: quarter + 1,
      year,
      date: quarterDate,
    });
  }

  return Object.freeze(quarters);
}

export function formatMonth(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError('date must be a valid Date object');
  }

  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatYear(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError('date must be a valid Date object');
  }

  return String(date.getFullYear());
}

export function formatQuarter(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new TypeError('date must be a valid Date object');
  }

  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `Q${quarter} ${date.getFullYear()}`;
}

export function getMonthDiff(date1, date2) {
  if (!(date1 instanceof Date) || isNaN(date1.getTime())) {
    throw new TypeError('date1 must be a valid Date object');
  }

  if (!(date2 instanceof Date) || isNaN(date2.getTime())) {
    throw new TypeError('date2 must be a valid Date object');
  }

  const years = date2.getFullYear() - date1.getFullYear();
  const months = date2.getMonth() - date1.getMonth();

  return years * 12 + months;
}

export function isDateInRange(date, startDate, endDate) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }

  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    return false;
  }

  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    return false;
  }

  return date >= startDate && date <= endDate;
}

export function getDateRangeLabel(startDate, endDate) {
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new TypeError('startDate must be a valid Date object');
  }

  if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
    throw new TypeError('endDate must be a valid Date object');
  }

  if (startDate > endDate) {
    throw new RangeError('startDate must be before or equal to endDate');
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameMonth) {
    return `${MONTH_NAMES[startDate.getMonth()]} ${startDate.getFullYear()}`;
  }

  if (sameYear) {
    return `${MONTH_NAMES[startDate.getMonth()]} – ${MONTH_NAMES[endDate.getMonth()]} ${startDate.getFullYear()}`;
  }

  return `${MONTH_NAMES[startDate.getMonth()]} ${startDate.getFullYear()} – ${MONTH_NAMES[endDate.getMonth()]} ${endDate.getFullYear()}`;
}