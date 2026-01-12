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
import Modal from "@/components/ui/Modal";
import { Download, MoreVertical, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
// import api from "@/lib/axios"; // API logic moved to hooks
import { useTransactions } from "@/hooks/useUserData";
import { useMerchantTransactions } from "@/hooks/useAdminData";
import { useSearchParams } from "next/navigation";

export default function TransactionsPage({ customFetch }) {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId"); // For Admin God Mode

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const itemsPerPage = 10;

  // Determine which hook to use
  // If merchantId is present (Admin View), use Admin hook.
  // Otherwise (User View), use User hook.

  // Note: customFetch prop was the previous pattern, we can now rely on merchantId or valid auth context
  // But to be safe and cleaner, let's just use the merchantId check since that governs the "God Mode"

  const isGodMode = !!merchantId;

  const {
    data: userTransactionsData,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useTransactions({ limit: 100 });

  const {
    data: merchantTransactionsData,
    isLoading: isMerchantLoading,
    error: merchantError,
    refetch: refetchMerchant,
  } = useMerchantTransactions(merchantId, { limit: 100 });

  // Consolidate data based on mode
  const isLoading = isGodMode ? isMerchantLoading : isUserLoading;
  const errorObj = isGodMode ? merchantError : userError;
  const data = isGodMode ? merchantTransactionsData : userTransactionsData;
  const transactions = data?.transactions || [];

  console.log(transactions, "transactionsss");
  const errorMessage =
    errorObj?.response?.data?.error ||
    errorObj?.response?.data?.details ||
    (typeof errorObj === "string" ? errorObj : null);

  const handleRetry = () => {
    if (isGodMode) refetchMerchant();
    else refetchUser();
  };

  // Filter Data Client-Side
  const filteredData = transactions.filter(
    (item) =>
      (item.description &&
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.customerRef && item.customerRef.includes(searchTerm)) ||
      (item.amount && item.amount.includes(searchTerm))
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const headers = [
    "Status",
    "Description",
    "Customer Ref",
    "Amount",
    "Payment Method",
    "External Reference",
    "Type",
    "Action",
  ];

  const handleDownloadPDF = (transaction) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Transaction Receipt", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add Company Info
    doc.text("Metadologie", 14, 30);
    doc.text("123 Business Rd", 14, 35);
    doc.text("Tech City, TC 90210", 14, 40);

    // Transaction Details Table
    const tableData = [
      ["Date", transaction.created === "N/A" ? " " : transaction.created],
      ["Description", transaction.description],
      [
        "Amount",
        typeof transaction.amount === "object"
          ? transaction.amount?.value || transaction.amount?.amount || 0
          : transaction.amount,
      ],
      [
        "Status",
        typeof transaction.status === "object"
          ? transaction.status?.label || transaction.status?.name || "Unknown"
          : transaction.status,
      ],
      [
        "Payment Method",
        typeof transaction.paymentMethod === "object"
          ? transaction.paymentMethod?.id ||
            transaction.paymentMethod?.type ||
            "N/A"
          : transaction.paymentMethod,
      ],
      [
        "Type",
        typeof transaction.type === "object"
          ? transaction.type?.label || transaction.type?.name || "Unknown"
          : transaction.type,
      ],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Field", "Value"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [0, 86, 210] }, // Primary Blue
    });

    doc.save(`receipt-${transaction.customerRef}.pdf`);
    toast.success("Receipt downloaded successfully");
  };

  const openDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const renderRow = (item, index) => (
    <tr
      key={index}
      className="hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => openDetails(item)}
    >
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Badge
          status={
            typeof item.status === "object"
              ? item.status?.label || item.status?.name || "Unknown"
              : item.status
          }
        />
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {item.created}
      </td> */}
      <td className="px-6 py-4 text-gray-900 font-medium text-center">
        {item.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
        {item.customerRef}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium text-center">
        {typeof item.amount === "object"
          ? item.amount?.value || item.amount?.amount || 0
          : item.amount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
        {/* Handle if paymentMethod is an object */}
        {typeof item.paymentMethod === "object"
          ? item.paymentMethod?.id || item.paymentMethod?.type || "N/A"
          : item.paymentMethod}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-center">
        {item.externalReference}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Badge
          status={
            typeof item.type === "object"
              ? item.type?.label || item.type?.name || "Unknown"
              : item.type
          }
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
            Transactions
          </h2>
        </div>
      </div>

      <TableFilterBar
        placeholder="Filter..."
        onSearch={setSearchTerm}
        showDateRange={true}
        onFilter={() => {}}
      />

      {/* <div className="flex justify-end mb-4">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div> */}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unable to Load Transactions
          </h3>
          <p className="text-gray-500 max-w-md">
            {errorMessage ||
              "The merchant may not have Authvia credentials configured, or there was a connection issue."}
          </p>
          <Button variant="outline" className="mt-4" onClick={handleRetry}>
            Try Again
          </Button>
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

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
        footer={
          <Button
            onClick={() => handleDownloadPDF(selectedTransaction)}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Download Receipt
          </Button>
        }
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold text-xl">
                {typeof selectedTransaction.amount === "object"
                  ? selectedTransaction.amount?.value ||
                    selectedTransaction.amount?.amount ||
                    0
                  : selectedTransaction.amount}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  status={
                    typeof selectedTransaction.status === "object"
                      ? selectedTransaction.status?.label ||
                        selectedTransaction.status?.name ||
                        "Unknown"
                      : selectedTransaction.status
                  }
                />
              </div>
              {/* <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{selectedTransaction.created}</p>
              </div> */}
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Ref</p>
                <p className="font-medium">{selectedTransaction.customerRef}</p>
              </div>
              <div className="col-span-4">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">
                  {typeof selectedTransaction.paymentMethod === "object"
                    ? selectedTransaction.paymentMethod?.id ||
                      selectedTransaction.paymentMethod?.type ||
                      "N/A"
                    : selectedTransaction.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
