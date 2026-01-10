"use client";

import ConversationsPage from "@/app/(protected)/conversations/page";

export default function AdminConversationsPage() {
  return (
    <>
      <div className="bg-blue-50 border-b border-blue-100 p-2 text-center text-xs text-blue-700 font-medium">
        Admin View
      </div>
      <ConversationsPage />
    </>
  );
}
