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
import Modal from "@/components/ui/Modal";
import { Download, MoreVertical, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import api from "@/lib/axios";

export default function TransactionsPage({ customFetch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, [customFetch]); // Add customFetch to dep array

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (customFetch) {
        data = await customFetch({ limit: 100 });
      } else {
        const response = await api.get("/auth/transactions", {
          params: { limit: 100 },
        });
        data = response.data;
      }

      if (data.success) {
        setTransactions(data.transactions || []); // Guard against undefined
      } else {
        setError(data.error || "Failed to load transactions");
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Failed to load transactions. The merchant may not have Authvia credentials configured.";
      setError(errorMessage);
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
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
    "Created",
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
      ["Date", transaction.created],
      ["Description", transaction.description],
      ["Amount", transaction.amount],
      ["Status", transaction.status],
      ["Payment Method", transaction.paymentMethod],
      ["Type", transaction.type],
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
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {item.created}
      </td>
      <td className="px-6 py-4 text-gray-900 font-medium">
        {item.description}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {item.customerRef}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
        {item.amount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {item.paymentMethod}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
        {item.externalReference}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge status={item.type} />
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
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Unable to Load Transactions
          </h3>
          <p className="text-gray-500 max-w-md">
            {typeof error === "string"
              ? error
              : "The merchant may not have Authvia credentials configured, or there was a connection issue."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={fetchTransactions}
          >
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
                {selectedTransaction.amount}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge status={selectedTransaction.status} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{selectedTransaction.created}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Ref</p>
                <p className="font-medium">{selectedTransaction.customerRef}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">
                  {selectedTransaction.paymentMethod}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
