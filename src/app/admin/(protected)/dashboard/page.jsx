"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_AUTH_TOKEN_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  if (!admin) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Welcome, {admin.email} (Role: {admin.role})
            </h2>
            <p>This is the protected Admin area.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
