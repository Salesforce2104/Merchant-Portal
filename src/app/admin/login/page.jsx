"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { ADMIN_AUTH_TOKEN_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // If already logged in, redirect to admin home
    if (
      typeof window !== "undefined" &&
      localStorage.getItem(ADMIN_AUTH_TOKEN_KEY)
    ) {
      router.push("/admin/dashboard");
    }

    // Check for remembered email (specific to admin)
    if (typeof window !== "undefined") {
      const rememberedEmail = localStorage.getItem("adminRememberedEmail");
      if (rememberedEmail) {
        setFormData((prev) => ({ ...prev, email: rememberedEmail }));
        setRememberMe(true);
      }
    }

    // Check for verified query param
    if (verified === "true") {
      setSuccessMessage("Email verified successfully! You can now log in.");
      toast.success("Email verified successfully!");
      // Clean up the URL
      window.history.replaceState({}, "", "/admin/login");
    }
  }, [router, verified]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/auth/login", formData);

      if (response.data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem(ADMIN_AUTH_TOKEN_KEY, response.data.token);
          localStorage.setItem(
            "admin_user",
            JSON.stringify(response.data.admin)
          );

          // Handle Remember Me (specific to admin)
          if (rememberMe) {
            localStorage.setItem("adminRememberedEmail", formData.email);
          } else {
            localStorage.removeItem("adminRememberedEmail");
          }
        }

        router.push("/admin/dashboard");
      } else {
        setError(response.data.error || "Login failed");
      }
    } catch (err) {
      console.error("Admin Login error:", err);
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-[#1F3C88] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          {/* Metadologie Logo - Big */}
          <div className="mx-auto mb-8">
            <img
              src="https://res.cloudinary.com/dx0yk0asl/image/upload/v1738736297/metadologie-logo_hbzfml.webp"
              alt="Metadologie"
              className="h-16 mx-auto"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@metadologie.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me-admin"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me-admin"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/admin/auth/forgot-password"
                className="text-sm font-medium text-[#1F3C88] hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign in as Admin
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F3C88]" />
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
