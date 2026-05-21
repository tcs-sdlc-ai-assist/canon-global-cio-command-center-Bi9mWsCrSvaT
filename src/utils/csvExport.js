import { trackExport } from './eventTracking';

function escapeField(value) {
  const str = String(value ?? '');

  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export function generateCSV(data, columns, options = {}) {
  if (!Array.isArray(data)) {
    throw new TypeError('data must be an array');
  }

  if (!Array.isArray(columns) || columns.length === 0) {
    throw new TypeError('columns must be a non-empty array');
  }

  const headers = Array.isArray(options.headers) && options.headers.length === columns.length
    ? options.headers
    : columns;

  const headerRow = headers.map(escapeField).join(',');

  const dataRows = data.map(row =>
    columns.map(col => escapeField(row[col])).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
}

export function downloadCSV(csvString, filename) {
  if (typeof csvString !== 'string' || csvString.length === 0) {
    console.warn('[CSV Export] csvString is empty or invalid.');
    return;
  }

  if (typeof filename !== 'string' || filename.trim().length === 0) {
    console.warn('[CSV Export] filename is empty or invalid.');
    return;
  }

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportChartData(data, columns, filename, options = {}) {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('[CSV Export] No data to export.');
    return;
  }

  if (!Array.isArray(columns) || columns.length === 0) {
    console.warn('[CSV Export] No columns specified.');
    return;
  }

  if (typeof filename !== 'string' || filename.trim().length === 0) {
    console.warn('[CSV Export] No filename specified.');
    return;
  }

  try {
    const csv = generateCSV(data, columns, options);
    downloadCSV(csv, filename);
    trackExport(`csv-export:${filename}`);
  } catch (error) {
    console.error('[CSV Export] Failed:', error.message);
  }
}