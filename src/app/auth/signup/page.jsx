"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Loader2, AlertCircle, ShieldOff, Eye, EyeOff } from "lucide-react";

// Wrapper component to handle Suspense for useSearchParams
export default function SignupPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <SignupPage />
    </Suspense>
  );
}

function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Token validation state
  const [isValidToken, setIsValidToken] = useState(null); // null = loading, true = valid, false = invalid
  const [tokenError, setTokenError] = useState("");

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    storeUrl: "",
    password: "",
    confirmPassword: "",
  });

  // Verify invite token on mount
  useEffect(() => {
    if (!token) {
      // No token in URL, deny access
      setIsValidToken(false);
      setTokenError(
        "Access denied. Please use the link from your invitation email."
      );
      return;
    }

    // Verify token with backend
    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify-invite/${token}`);
        if (response.data.success) {
          setIsValidToken(true);
          // Optionally prefill email if returned by API
          if (response.data.email) {
            setFormData((prev) => ({ ...prev, email: response.data.email }));
          }
        } else {
          setIsValidToken(false);
          setTokenError(
            response.data.error || "Invalid or expired invitation link."
          );
        }
      } catch (err) {
        console.error("Token verification error:", err);
        setIsValidToken(false);
        setTokenError(
          err.response?.data?.error ||
          "Could not verify invitation. Please try again."
        );
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic Client-side Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare payload (exclude confirmPassword, include inviteToken)
      const { confirmPassword, ...rest } = formData;
      const payload = {
        ...rest,
        inviteToken: token, // Include the invite token
      };

      const response = await api.post("/auth/signup", payload);

      if (response.data.success) {
        // Auto-login logic if token is returned
        if (response.data.token) {
          if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
            if (response.data.user) {
              localStorage.setItem("user", JSON.stringify(response.data.user));
            }
          }
          // Redirect to dashboard/home
          window.location.href = "/";
        } else {
          // If no token, redirect to login
          router.push("/auth/login");
        }
      } else {
        setError(response.data.error || "Registration failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.error ||
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render States ---

  // Loading state while verifying token
  if (isValidToken === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-[#1F3C88]">
        <div className="text-center">
          <div className="mx-auto mb-6">
            <img
              src="https://res.cloudinary.com/dx0yk0asl/image/upload/v1738736297/metadologie-logo_hbzfml.webp"
              alt="Metadologie"
              className="h-12 mx-auto brightness-0 invert"
            />
          </div>
          <Loader2 className="h-10 w-10 animate-spin text-white mx-auto" />
          <p className="mt-4 text-white/80">Verifying your invitation...</p>
        </div>
      </div>
    );
  }

  // Invalid/No token state
  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-[#1F3C88] px-4">
        <div className="w-full max-w-md text-center rounded-2xl bg-white p-10 shadow-2xl">
          <div className="mx-auto mb-6">
            <img
              src="https://res.cloudinary.com/dx0yk0asl/image/upload/v1738736297/metadologie-logo_hbzfml.webp"
              alt="Metadologie"
              className="h-12 mx-auto"
            />
          </div>
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-6">
            <ShieldOff className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-500 mb-6">{tokenError}</p>
          <Link href="/">
            <Button variant="outline">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Valid token - render signup form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-[#1F3C88] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          {/* Metadologie Logo - Big */}
          <div className="mx-auto mb-6">
            <img
              src="https://res.cloudinary.com/dx0yk0asl/image/upload/v1738736297/metadologie-logo_hbzfml.webp"
              alt="Metadologie"
              className="h-14 mx-auto"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Create your account
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[#1F3C88] hover:text-[#1F3C88]/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              // Optional: disable if email was prefilled from invite
              // disabled={!!formData.email && token}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="storeUrl">Store URL</Label>
              <Input
                id="storeUrl"
                name="storeUrl"
                type="text"
                required
                placeholder="https://your-store.com"
                value={formData.storeUrl}
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
                  autoComplete="new-password"
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

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pr-10"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
}
