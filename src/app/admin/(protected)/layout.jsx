"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_AUTH_TOKEN_KEY } from "@/lib/constants";
import Loader from "@/components/ui/Loader";

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check for admin token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(ADMIN_AUTH_TOKEN_KEY)
        : null;

    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
