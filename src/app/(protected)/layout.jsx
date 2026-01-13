"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import Loader from "@/components/ui/Loader";
import PasswordResetNotification from "@/components/PasswordResetNotification";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check for auth token
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(AUTH_TOKEN_KEY)
        : null;

    if (!token) {
      router.push("/auth/login");
    } else {
      setAuthorized(true);
      // Try to get user data for notification
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error("Layout: Failed to parse user data", e);
      }
    }
  }, [router]);

  // Show loader while checking or strict null if not authorized yet
  if (!authorized) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 relative">
      <PasswordResetNotification user={currentUser} />
      {children}
    </div>
  );
}
