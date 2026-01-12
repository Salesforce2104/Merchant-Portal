"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AUTH_TOKEN_KEY, ADMIN_AUTH_TOKEN_KEY } from "@/lib/constants";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Hide Navbar on specific routes
  const hideNavbarRoutes = ["/auth/login", "/auth/signup", "/admin/login"];
  const shouldHideNavbar = hideNavbarRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    // Check for token to determine auth state (simple check)
    if (typeof window !== "undefined") {
      const userToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const adminToken = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);

      const hasToken = !!userToken || !!adminToken;
      setIsAuthenticated(hasToken);

      if (hasToken) {
        // Try to get user data from localStorage
        const userData = localStorage.getItem("user");
        const adminData = localStorage.getItem("admin_user");
        if (adminToken && adminData) {
          try {
            setUser(JSON.parse(adminData));
          } catch (e) {
            console.error("Failed to parse admin data", e);
          }
        } else if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error("Failed to parse user data", e);
          }
        }
      }
    }
  }, [pathname]); // Re-check on route change

  const handleLogout = () => {
    // Check if we are logging out an admin
    const isAdmin =
      user?.role?.includes("admin") ||
      user?.email?.includes("admin") ||
      localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);

    // Clear all tokens to be safe
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("user");
    localStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
    localStorage.removeItem("admin_user");

    setIsAuthenticated(false);
    setUser(null);

    // Smart redirect
    if (isAdmin) {
      router.push("/admin/login");
    } else {
      router.push("/auth/login");
    }
  };

  if (shouldHideNavbar) {
    return null;
  }

  // Determine where logo should link based on user role
  const isAdminUser =
    user?.role?.includes("admin") ||
    user?.email?.includes("admin") ||
    (typeof window !== "undefined" &&
      localStorage.getItem(ADMIN_AUTH_TOKEN_KEY) &&
      !localStorage.getItem(AUTH_TOKEN_KEY));

  const logoHref = isAdminUser ? "/admin/dashboard" : "/";

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href={logoHref} className="flex items-center gap-2">
                <img
                  src="https://res.cloudinary.com/dx0yk0asl/image/upload/v1738736297/metadologie-logo_hbzfml.webp"
                  alt="Metadologie"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            {/* Mobile menu button could go here */}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                {/* Logic to determine if Admin or User links should be shown */}
                {user?.role?.includes("admin") ||
                user?.email?.includes("admin") ? ( // Simple check for now, can be cleaner
                  <>
                    <Link
                      href="/admin/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/admin/dashboard"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/stores"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname?.startsWith("/admin/stores")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Stores
                    </Link>
                    {/* <Link
                      href="/admin/customers"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname?.startsWith("/admin/customers")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Customers
                    </Link> */}
                    {/* <Link
                      href="/admin/transactions"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname?.startsWith("/admin/transactions")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Transactions
                    </Link> */}
                    {/* <Link
                      href="/admin/conversations"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname?.startsWith("/admin/conversations")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Conversations
                    </Link> */}
                  </>
                ) : (
                  <>
                    <Link
                      href="/customers"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname?.startsWith("/customers")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Customers
                    </Link>
                    <Link
                      href="/transactions"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname?.startsWith("/transactions")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Transactions
                    </Link>
                    <Link
                      href="/conversations"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname?.startsWith("/conversations")
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Conversations
                    </Link>
                  </>
                )}

                <div className="ml-4 border-l pl-4 border-gray-200">
                  <ProfileMenu user={user} onLogout={handleLogout} />
                </div>
              </>
            ) : (
              // No "Sign Up" button as requested - only Login visible online
              <Link href="/auth/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
