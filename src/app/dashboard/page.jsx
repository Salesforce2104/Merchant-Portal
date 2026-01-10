"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Customers as the default view
    router.push("/customers");
  }, [router]);

  return null;
}
