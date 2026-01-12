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
    <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
      {showDateRange && (
        <div className="flex items-center gap-2">
          <Input type="date" className="w-auto" />
          <span className="text-gray-400">-</span>
          <Input type="date" className="w-auto" />
        </div>
      )}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>
      {onFilter && (
        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-6 py-4 whitespace-nowrap">
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
                  className="px-6 py-16 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <Search className="h-6 w-6 text-gray-300" />
                    </div>
                    <span className="font-medium">No results found</span>
                    <span className="text-sm">
                      Try adjusting your search or filters
                    </span>
                  </div>
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
    <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-700">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-gray-700">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="font-semibold text-gray-700">{totalItems}</span>{" "}
        results
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border rounded-md">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
