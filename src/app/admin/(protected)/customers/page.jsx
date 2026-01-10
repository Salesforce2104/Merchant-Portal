"use client";

import CustomersPage from "@/app/(protected)/customers/page";

export default function AdminCustomersPage() {
  return (
    <>
      <div className="bg-blue-50 border-b border-blue-100 p-2 text-center text-xs text-blue-700 font-medium">
        Admin View
      </div>
      <CustomersPage />
    </>
  );
}
