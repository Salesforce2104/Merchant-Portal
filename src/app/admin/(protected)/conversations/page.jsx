"use client";

import { useSearchParams } from "next/navigation";
import ConversationsPage from "@/app/(protected)/conversations/page";
import { AdminService } from "@/services/adminService";
import { AlertCircle } from "lucide-react";

export default function AdminConversationsPage() {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  const fetcher = merchantId
    ? (params) => AdminService.getMerchantConversations(merchantId, params)
    : null;

  if (!merchantId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <AlertCircle className="h-10 w-10 mb-4 text-gray-300" />
        <h2 className="text-lg font-medium">No Store Selected</h2>
        <p>Please select a store from the Stores tab to view conversations.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-blue-50 border-b border-blue-100 p-2 text-center text-xs text-blue-700 font-medium">
        Viewing conversations for Merchant ID: {merchantId}
      </div>
      <ConversationsPage customFetch={fetcher} />
    </>
  );
}
