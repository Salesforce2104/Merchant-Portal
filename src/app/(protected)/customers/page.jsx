"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableFilterBar } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { User, Loader2, Mail, Phone, ChevronLeft, ChevronRight, Users, CreditCard, ShoppingBag, Calendar } from "lucide-react";
import { useCustomers, useTransactions } from "@/hooks/useUserData";
import { useMerchantCustomers, useMerchantTransactions } from "@/hooks/useAdminData";
import { useSearchParams } from "next/navigation";
import Modal from "@/components/ui/Modal";

export default function CustomersPage({ customFetch }) {
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [txPage, setTxPage] = useState(1);
    const itemsPerPage = 10;
    const txPerPage = 5;
    const merchantId = searchParams.get("merchantId");

    const isGodMode = !!merchantId;

    // Reset transaction page when customer changes
    useEffect(() => {
        setTxPage(1);
    }, [selectedCustomer]);

    // Hooks for Customers
    const {
        data: userCustomersData,
        isLoading: isUserLoading,
        error: userError,
    } = useCustomers();

    const {
        data: merchantCustomersData,
        isLoading: isMerchantLoading,
        error: merchantError,
    } = useMerchantCustomers(merchantId);

    // Hooks for Transactions
    const {
        data: userTransactionsData,
        isLoading: isUserTxLoading,
    } = useTransactions({ limit: 1000 });

    const {
        data: merchantTransactionsData,
        isLoading: isMerchantTxLoading,
    } = useMerchantTransactions(merchantId, { limit: 1000 });

    // Derived State
    const isLoading = isGodMode ? isMerchantLoading : isUserLoading;
    const errorObj = isGodMode ? merchantError : userError;
    const data = isGodMode ? merchantCustomersData : userCustomersData;
    const customers = data?.customers || [];

    const txData = isGodMode ? merchantTransactionsData : userTransactionsData;
    const allTransactions = Array.isArray(txData) ? txData : (txData?.transactions || []);

    const error = errorObj ? "Failed to load customers" : null;

    // Helper to find transactions for a specific customer
    const getCustomerTransactions = (customer) => {
        if (!customer || !allTransactions.length) return [];
        return allTransactions.filter(tx => {
            const idMatch = tx.customerId && (String(tx.customerId) === String(customer.id) || String(tx.customerId) === String(customer.ref));
            const emailMatch = tx.customerEmail && customer.email && tx.customerEmail.toLowerCase() === customer.email.toLowerCase();
            return idMatch || emailMatch;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    // Helper to calculate total spent
    const getCustomerTotal = (customer) => {
        const txs = getCustomerTransactions(customer);
        if (txs.length > 0) {
            return txs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0).toFixed(2);
        }
        const apiTotal = customer.totalSpent || customer.total_spent || "$0.00";
        return apiTotal.replace("$", "");
    };

    // Client-side filtering
    const filteredCustomers = customers.filter((customer) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();
        const name = customer.name || "";
        const email = customer.email || "";
        const id = customer.id || customer.ref || "";

        return (
            name.toLowerCase().includes(searchLower) ||
            email.toLowerCase().includes(searchLower) ||
            id.toString().toLowerCase().includes(searchLower)
        );
    });

    // Pagination for main table
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Use the requested headers
    const headers = ["Customer", "Contact Info", "Reference ID", "Platform"];

    const renderRow = (customer, index) => {
        const displayEmail = customer.email || "No Email";
        const displayId = String(customer.id || customer.ref || "No ID");
        const storeName = customer.name || "Unknown";
        const lastOrder = customer.lastOrder || "N/A";

        // Derive platform from the name field
        let platform = "Other";
        let platformColor = "bg-gray-100 text-gray-800";
        if (storeName.toLowerCase().includes("shopify")) {
            platform = "Shopify";
            platformColor = "bg-[#95BF47]/10 text-[#5E8E3E]";
        } else if (storeName.toLowerCase().includes("wc") || storeName.toLowerCase().includes("woocommerce")) {
            platform = "WooCommerce";
            platformColor = "bg-[#7F54B3]/10 text-[#7F54B3]";
        }

        return (
            <tr
                key={displayId || index}
                className="group hover:bg-gray-50/80 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-0"
                onClick={() => setSelectedCustomer(customer)}
            >
                <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 text-gray-500 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#1F3C88] group-hover:text-white transition-all duration-300 shadow-sm">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 group-hover:text-[#1F3C88] transition-colors">
                                {displayEmail}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono mt-0.5">
                                Last Order: {lastOrder}
                            </span>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-600">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 group-hover:text-gray-900 transition-colors">
                            <Mail className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#1F3C88]" />
                            <span className="font-medium">{displayEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total:</span>
                            <span className="text-xs font-bold text-green-600 font-mono tracking-tight">${getCustomerTotal(customer)}</span>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 font-mono">
                        {displayId.substring(0, 15)}{displayId.length > 15 ? "..." : ""}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${platformColor}`}>
                        {platform}
                    </span>
                </td>
            </tr>
        );
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">

                {/* Stacked Layout: Title "Customers" then Filter Bar below */}
                <TableHeader title="Customers" />

                <div className="mb-6">
                    <TableFilterBar
                        placeholder="Search by Name, Email, or ID..."
                        onSearch={(val) => {
                            setSearchTerm(val);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-[#1F3C88] mb-4" />
                        <p className="text-gray-500 font-medium">Loading customer data...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl border border-red-100">
                        <div className="flex justify-center mb-3">
                            <Users className="h-10 w-10 text-red-200" />
                        </div>
                        <h3 className="text-lg font-semibold">Error Loading Customers</h3>
                        <p className="text-sm opacity-80 mt-1">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden">
                            <Table
                                headers={headers}
                                data={paginatedCustomers}
                                renderRow={renderRow}
                            />
                        </div>

                        {/* Pagination */}
                        {totalPages > 0 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl mt-4">
                                <div className="text-sm text-gray-500">
                                    Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold text-gray-900">{totalItems}</span> results
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-9 w-9 p-0 rounded-lg hover:bg-white hover:border-gray-300 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <div className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        {currentPage} / {totalPages}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="h-9 w-9 p-0 rounded-lg hover:bg-white hover:border-gray-300 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Customer Details Modal */}
            <Modal
                isOpen={!!selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
                title="Customer Profile"
                maxWidth="max-w-4xl"
            >
                {selectedCustomer && (
                    <div className="space-y-8 p-2">
                        {/* Header Card */}
                        <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-[#1F3C88]/5 to-transparent rounded-2xl border border-[#1F3C88]/10">
                            <div className="h-16 w-16 rounded-full bg-white shadow-md flex items-center justify-center text-[#1F3C88] border border-gray-100">
                                <User className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedCustomer.email || 'Unknown Customer'}</h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
                                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                                        {selectedCustomer.email}
                                    </span>
                                    {selectedCustomer.phone && (
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
                                            <Phone className="h-3.5 w-3.5 text-gray-400" />
                                            {selectedCustomer.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="ml-auto text-right">
                                <span className="block text-sm text-gray-500 mb-1">Lifetime Value</span>
                                <span className="text-3xl font-bold text-green-600 tracking-tight">
                                    ${getCustomerTotal(selectedCustomer)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Contact/Platform Info */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <ShoppingBag className="h-4 w-4 text-[#1F3C88]" />
                                        Platform Details
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">Store Platform</span>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${selectedCustomer.name?.toLowerCase().includes('shopify') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
                                                {selectedCustomer.name?.toLowerCase().includes('shopify') ? 'Shopify' : 'WooCommerce'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">Reference ID</span>
                                            <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200 block truncate">
                                                {selectedCustomer.id || selectedCustomer.ref || 'N/A'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block mb-1">Last Order Date</span>
                                            <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                {selectedCustomer.lastOrder || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transactions Table */}
                            <div className="md:col-span-2">
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-[#1F3C88]" />
                                            Transaction History
                                        </h4>
                                        <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-sm text-gray-600">
                                            Most Recent
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        {(() => {
                                            const txs = getCustomerTransactions(selectedCustomer);
                                            const txTotalPages = Math.ceil(txs.length / txPerPage);
                                            const paginatedTxs = txs.slice(
                                                (txPage - 1) * txPerPage,
                                                txPage * txPerPage
                                            );

                                            return (
                                                <div className="flex flex-col h-full">
                                                    <div className="flex-1 overflow-auto">
                                                        <table className="w-full text-sm text-left">
                                                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                                                <tr>
                                                                    <th className="px-5 py-3 text-xs uppercase tracking-wider">Date</th>
                                                                    <th className="px-5 py-3 text-xs uppercase tracking-wider">ID</th>
                                                                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-right">Amount</th>
                                                                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-center">Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {paginatedTxs.length === 0 ? (
                                                                    <tr>
                                                                        <td colSpan="4" className="px-5 py-10 text-center text-gray-400">
                                                                            <div className="flex flex-col items-center gap-2">
                                                                                <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center">
                                                                                    <CreditCard className="h-5 w-5 text-gray-300" />
                                                                                </div>
                                                                                <p>No transactions found</p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ) : (
                                                                    paginatedTxs.map((tx, idx) => (
                                                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                                            <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                                            <td className="px-5 py-3.5 font-mono text-xs text-gray-500 whitespace-nowrap">{tx.id.substring(0, 8)}...</td>
                                                                            <td className="px-5 py-3.5 text-right font-medium text-gray-900">${Number(tx.amount).toFixed(2)}</td>
                                                                            <td className="px-5 py-3.5 text-center">
                                                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.status === 'succeeded' || tx.status === 'completed' || tx.status === 'paid'
                                                                                    ? 'bg-green-50 text-green-700 border border-green-100'
                                                                                    : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                                                    }`}>
                                                                                    {tx.status || 'Unknown'}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {txTotalPages > 1 && (
                                                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                                                            <span className="text-xs text-gray-500">Page {txPage} of {txTotalPages}</span>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setTxPage(txPage - 1)}
                                                                    disabled={txPage === 1}
                                                                    className="h-7 w-7 p-0"
                                                                >
                                                                    <ChevronLeft className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setTxPage(txPage + 1)}
                                                                    disabled={txPage === txTotalPages}
                                                                    className="h-7 w-7 p-0"
                                                                >
                                                                    <ChevronRight className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
