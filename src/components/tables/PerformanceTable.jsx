import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import StatusBadge from '../shared/StatusBadge';
import { TABLE_COLUMNS, TABLE_SORT_ORDERS, sortRegionalData } from '../../data/tables';

function SortIcon({ columnKey, sortColumn, sortOrder }) {
  if (columnKey !== sortColumn) {
    return (
      <svg
        className="w-3.5 h-3.5 text-gray-300 ml-1 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }

  if (sortOrder === TABLE_SORT_ORDERS.ASC) {
    return (
      <svg
        className="w-3.5 h-3.5 text-blue-600 ml-1 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    );
  }

  return (
    <svg
      className="w-3.5 h-3.5 text-blue-600 ml-1 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

SortIcon.propTypes = {
  columnKey: PropTypes.string.isRequired,
  sortColumn: PropTypes.string,
  sortOrder: PropTypes.oneOf([TABLE_SORT_ORDERS.ASC, TABLE_SORT_ORDERS.DESC]),
};

SortIcon.defaultProps = {
  sortColumn: null,
  sortOrder: TABLE_SORT_ORDERS.ASC,
};

function TableHeader({ columns, sortColumn, sortOrder, onSort }) {
  const handleSort = useCallback(
    (columnKey) => {
      if (typeof onSort === 'function') {
        onSort(columnKey);
      }
    },
    [onSort]
  );

  const handleKeyDown = useCallback(
    (event, columnKey) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSort(columnKey);
      }
    },
    [handleSort]
  );

  return (
    <thead>
      <tr className="border-b border-gray-200">
        {columns.map((column) => {
          const isSortable = column.sortable === true;
          const isActive = column.key === sortColumn;

          return (
            <th
              key={column.key}
              className={`
                px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
                ${column.width || ''}
                ${isSortable ? 'cursor-pointer select-none hover:text-gray-700 hover:bg-gray-50 transition-colors' : ''}
              `.trim()}
              scope="col"
              aria-sort={
                isActive
                  ? sortOrder === TABLE_SORT_ORDERS.ASC
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
              onClick={isSortable ? () => handleSort(column.key) : undefined}
              onKeyDown={
                isSortable
                  ? (event) => handleKeyDown(event, column.key)
                  : undefined
              }
              tabIndex={isSortable ? 0 : undefined}
              role={isSortable ? 'columnheader button' : 'columnheader'}
            >
              <div className="flex items-center">
                <span>{column.label}</span>
                {isSortable && (
                  <SortIcon
                    columnKey={column.key}
                    sortColumn={sortColumn}
                    sortOrder={sortOrder}
                  />
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      width: PropTypes.string,
    })
  ).isRequired,
  sortColumn: PropTypes.string,
  sortOrder: PropTypes.oneOf([TABLE_SORT_ORDERS.ASC, TABLE_SORT_ORDERS.DESC]),
  onSort: PropTypes.func,
};

TableHeader.defaultProps = {
  sortColumn: null,
  sortOrder: TABLE_SORT_ORDERS.ASC,
  onSort: undefined,
};

function TableRow({ row, columns }) {
  const formatCellValue = useCallback((column, value) => {
    if (column.key === 'status') {
      return <StatusBadge status={value} />;
    }

    if (column.key === 'region') {
      return (
        <span className="font-medium text-gray-900">
          {row.regionLabel || value}
        </span>
      );
    }

    if (column.format === 'percentage') {
      return (
        <span className="text-gray-700">
          {typeof value === 'number' ? `${value}%` : value}
        </span>
      );
    }

    return <span className="text-gray-700">{value}</span>;
  }, [row.regionLabel]);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-4 py-3 text-sm ${column.width || ''}`}
        >
          {formatCellValue(column, row[column.key])}
        </td>
      ))}
    </tr>
  );
}

TableRow.propTypes = {
  row: PropTypes.shape({
    region: PropTypes.string.isRequired,
    regionLabel: PropTypes.string,
    efficiency: PropTypes.number.isRequired,
    adoption: PropTypes.number.isRequired,
    security: PropTypes.number.isRequired,
    innovation: PropTypes.number.isRequired,
    satisfaction: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      format: PropTypes.string,
      width: PropTypes.string,
    })
  ).isRequired,
};

function PerformanceTable({ data, columns }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState(TABLE_SORT_ORDERS.ASC);

  const handleSort = useCallback(
    (columnKey) => {
      setSortColumn((prevColumn) => {
        if (prevColumn === columnKey) {
          setSortOrder((prevOrder) =>
            prevOrder === TABLE_SORT_ORDERS.ASC
              ? TABLE_SORT_ORDERS.DESC
              : TABLE_SORT_ORDERS.ASC
          );
          return columnKey;
        }

        setSortOrder(TABLE_SORT_ORDERS.ASC);
        return columnKey;
      });
    },
    []
  );

  const sortedData = useMemo(() => {
    if (!sortColumn) {
      return data;
    }

    return sortRegionalData(data, sortColumn, sortOrder);
  }, [data, sortColumn, sortOrder]);

  const tableColumns = columns || TABLE_COLUMNS;

  if (!data || data.length === 0) {
    return (
      <section
        className="glass-card p-5 md:p-6"
        role="region"
        aria-label="Regional Performance Table"
        data-section="performance-table"
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Regional Performance
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Executive performance summary across all regions
          </p>
        </div>

        <div
          className="flex items-center justify-center h-40 text-gray-400 text-sm"
          role="status"
          aria-label="No regional performance data available"
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p>No regional performance data available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="glass-card p-5 md:p-6"
      role="region"
      aria-label="Regional Performance Table"
      data-section="performance-table"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Regional Performance
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Executive performance summary across all regions
        </p>
      </div>

      <div className="overflow-x-auto -mx-5 md:-mx-6">
        <div className="inline-block min-w-full align-middle px-5 md:px-6">
          <table className="min-w-full divide-y divide-gray-200">
            <TableHeader
              columns={tableColumns}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <tbody className="divide-y divide-gray-100">
              {sortedData.map((row) => (
                <TableRow
                  key={row.id || row.region}
                  row={row}
                  columns={tableColumns}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Showing {sortedData.length} region{sortedData.length !== 1 ? 's' : ''}
          {sortColumn && (
            <span>
              {' '}· Sorted by{' '}
              <span className="font-medium text-gray-500">
                {tableColumns.find((col) => col.key === sortColumn)?.label || sortColumn}
              </span>
              {' '}
              ({sortOrder === TABLE_SORT_ORDERS.ASC ? 'ascending' : 'descending'})
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

PerformanceTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      region: PropTypes.string.isRequired,
      regionLabel: PropTypes.string,
      efficiency: PropTypes.number.isRequired,
      adoption: PropTypes.number.isRequired,
      security: PropTypes.number.isRequired,
      innovation: PropTypes.number.isRequired,
      satisfaction: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      width: PropTypes.string,
      format: PropTypes.string,
    })
  ),
};

PerformanceTable.defaultProps = {
  columns: TABLE_COLUMNS,
};

export default React.memo(PerformanceTable);