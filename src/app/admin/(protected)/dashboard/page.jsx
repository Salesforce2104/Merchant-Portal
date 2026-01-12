"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_AUTH_TOKEN_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

// import { AdminService } from "@/services/adminService";
import { useStores } from "@/hooks/useAdminData";
import AdminDashboardCharts from "@/components/AdminDashboardCharts";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  // React Query Hook
  // We need many users for valid stats, so we request a higher limit
  const { data: usersData, isLoading, error } = useStores({ limit: 1000 });
  const users = usersData?.users || [];

  useEffect(() => {
    // Basic auth check
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const storedAdmin = localStorage.getItem("admin_user");
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
    }
  }, [router]);

  if (error) {
    toast.error("Failed to load dashboard statistics");
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {admin.name || admin.email}
          </p>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-[1600px] py-6 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <AdminDashboardCharts users={users} />
          )}
        </div>
      </main>
    </div>
  );
}
