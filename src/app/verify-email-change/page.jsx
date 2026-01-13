"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
    Loader2,
    Mail,
    AlertCircle
} from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing verification token.");
            return;
        }

        // Redirect to backend endpoint which will verify and redirect back to login
        // This avoids CORS issues since it's a direct navigation, not an API call
        const backendUrl = `${API_BASE_URL}/admin/auth/verify-email-change?token=${encodeURIComponent(token)}`;

        // Redirect to backend
        window.location.href = backendUrl;
    }, [token]);

    if (error) {
        return (
            <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
                <div className="text-center py-8">
                    <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                        Invalid Link
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        {error}
                    </p>
                    <Link href="/admin/login">
                        <Button className="w-full bg-[#1F3C88] hover:bg-[#1F3C88]/90">
                            Go to Login
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
            <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Verifying Your Email
                </h2>
                <p className="text-sm text-gray-600">
                    Please wait while we verify your new email address...
                </p>
            </div>
        </div>
    );
}

export default function VerifyEmailChangePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto h-14 w-14 rounded-full bg-[#1F3C88] flex items-center justify-center mb-4">
                        <Mail className="h-7 w-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        Email Verification
                    </h1>
                </div>

                <Suspense fallback={
                    <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#1F3C88]" />
                        </div>
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
