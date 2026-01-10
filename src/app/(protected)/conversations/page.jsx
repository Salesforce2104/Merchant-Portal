"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableFilterBar,
  Pagination,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { MoreVertical, RefreshCw, Download, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/auth/conversations", {
        params: { pageSize: 100 }, // Fetch larger batch to support client-side pagination
      });
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = conversations.filter(
    (item) =>
      (item.address &&
        item.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.customerRef && item.customerRef.includes(searchTerm))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const headers = [
    "Status",
    "Created",
    "Address(s)",
    "Customer Ref",
    "Type",
    "Expiration",
    "Actions",
  ];

  const renderRow = (item, index) => (
    <tr key={index} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{item.created}</div>
        <div className="text-xs text-gray-400">
          {item.updated && item.updated !== "N/A"
            ? `(Updated: ${item.updated})`
            : ""}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900">{item.address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
        {item.customerRef}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-1">
          <div className="h-6 w-6 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs font-bold">
            $
          </div>
          <div className="h-6 w-6 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs">
            ref
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {item.expiration}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avenger Assemble</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-1">
            Conversations
          </h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex-1 w-full max-w-2xl">
          <TableFilterBar
            placeholder="Address(s) or Customers"
            onSearch={setSearchTerm}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-white border rounded-md px-3 py-2 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={fetchConversations}
            className="bg-green-500 text-white border-none hover:bg-green-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-green-500 text-white border-none hover:bg-green-600"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Table headers={headers} data={currentItems} renderRow={renderRow} />

          <Pagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
