"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  RotateCcw,
} from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

export const TableHeader = ({ title, actions, children }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
      {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
      <div className="flex items-center gap-2">
        {children}
        {actions}
      </div>
    </div>
  );
};

export const TableFilterBar = ({
  onSearch,
  placeholder = "Search...",
  onFilter,
  showDateRange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-2 rounded-lg border border-gray-100">
      {showDateRange && (
        <div className="flex items-center gap-2">
          <Input type="date" className="w-auto" />
          <span className="text-gray-400">-</span>
          <Input type="date" className="w-auto" />
        </div>
      )}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder={placeholder}
          className="pl-9"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      {onFilter && (
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-3 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Pagination = ({
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{" "}
        to{" "}
        <span className="font-medium">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
