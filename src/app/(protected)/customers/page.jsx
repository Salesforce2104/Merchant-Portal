"use client";

import { useState } from "react";
import { TableHeader, TableFilterBar } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { User, Plus, Loader2 } from "lucide-react";
// import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useCustomers } from "@/hooks/useUserData";
import { useMerchantCustomers } from "@/hooks/useAdminData";
import { useSearchParams } from "next/navigation";

export default function CustomersPage({ customFetch }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const merchantId = searchParams.get("merchantId");

  const isGodMode = !!merchantId;

  // Hooks
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

  // Derived State
  const isLoading = isGodMode ? isMerchantLoading : isUserLoading;
  const errorObj = isGodMode ? merchantError : userError;
  const data = isGodMode ? merchantCustomersData : userCustomersData;
  const customers = data?.customers || [];

  const error = errorObj ? "Failed to load customers" : null;

  // Client-side filtering with fallback fields
  const filteredCustomers = customers.filter((customer) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    // Check various name fields
    const name =
      customer.name ||
      `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
    // Check various email fields
    const email =
      customer.email || (customer.emails && customer.emails[0]) || "";
    // Check various ID/Ref fields
    const id = customer.id || customer.ref || "";

    return (
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      id.toString().toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 min-h-[600px]">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Conversations</h1>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-1">Select Customer</h2>
          <p className="text-sm text-gray-500 mb-4">
            Search for an existing customer or create a new one.
          </p>

          <div className="max-w-xl">
            <TableFilterBar
              placeholder="Name, Phone Number or Customer ID"
              onSearch={setSearchTerm}
            />
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => {
              // Determine display values with fallbacks
              const displayName =
                customer.name ||
                `${customer.firstName || ""} ${
                  customer.lastName || ""
                }`.trim() ||
                "Unknown Name";
              const displayEmail =
                customer.email ||
                (customer.emails && customer.emails[0]) ||
                "No Email";
              const displayId = customer.id || customer.ref || "No ID";

              return (
                <div
                  key={displayId}
                  className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors">
                    {/* Use Avatar if available, else Icon. Using img specifically for external URLs. */}
                    {customer.avatar ? (
                      <img
                        src={customer.avatar}
                        alt={displayName}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex items-center gap-2">
                      {displayEmail}
                      <span className="text-gray-500">({displayName})</span>
                      <span className="text-gray-400 font-normal ml-2">
                        {displayId}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              No customers found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
