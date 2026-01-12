"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableFilterBar,
  Pagination,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  MoreVertical,
  RefreshCw,
  Download,
  Loader2,
  DollarSign,
  CreditCard,
} from "lucide-react";
// import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useConversations } from "@/hooks/useUserData";
import { useMerchantConversations } from "@/hooks/useAdminData";
import { useSearchParams } from "next/navigation";
import { formatDisplayData } from "@/lib/utils";

export default function ConversationsPage({ customFetch }) {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId"); // For Admin God Mode
  const isGodMode = !!merchantId;

  // React Query Hooks
  const {
    data: userConversationsData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useConversations({ pageSize: 100 });

  const {
    data: merchantConversationsData,
    isLoading: isMerchantLoading,
    error: merchantError,
    refetch: refetchMerchant,
  } = useMerchantConversations(merchantId, { pageSize: 100 });

  // Consolidate data
  const isLoading = isGodMode ? isMerchantLoading : isUserLoading;
  const errorObj = isGodMode ? merchantError : userError;
  const data = isGodMode ? merchantConversationsData : userConversationsData;
  const conversations = data?.conversations || [];

  console.log(conversations, "Converstino>>");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const handleRefresh = () => {
    if (isGodMode) refetchMerchant();
    else refetchUser();
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
    // "Actions",
  ];

  const renderRow = (item, index) => (
    <tr key={index} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Badge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="font-medium text-gray-900">{item.created}</div>
        <div className="text-xs text-gray-400">
          {item.updated && item.updated !== "N/A"
            ? `(Updated: ${item.updated})`
            : ""}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-900 text-center">
        {formatDisplayData(item.address)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-center">
        {formatDisplayData(item.customerRef)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex gap-2 justify-center">
          <div
            className="h-7 w-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-sm border border-green-200"
            title="Payment"
          >
            <DollarSign className="h-4 w-4" />
          </div>
          <div
            className="h-7 w-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-sm border border-amber-200"
            title="Payment Method"
          >
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
        {formatDisplayData(item.expiration)}
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="h-4 w-4" />
        </button>
      </td> */}
    </tr>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Avenger Assemble</h1> */}
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
            onClick={handleRefresh}
            className="bg-green-500 text-white border-none hover:bg-green-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="outline"
            size="icon"
            className="bg-green-500 text-white border-none hover:bg-green-600"
          >
            <Download className="h-4 w-4" />
          </Button> */}
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
