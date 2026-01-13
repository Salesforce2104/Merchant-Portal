"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { AdminService } from "@/services/adminService";

export default function AdminForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await AdminService.forgotPassword(email);
            if (result.success) {
                setIsSuccess(true);
            }
        } catch (error) {
            // We still show success to prevent email enumeration
            console.error("Admin forgot password error:", error);
            setIsSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Back to Login */}
                <Link
                    href="/admin/login"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Admin Login
                </Link>

                <div className="rounded-2xl bg-white p-8 shadow-2xl">
                    {!isSuccess ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="mx-auto h-14 w-14 rounded-full bg-[#1F3C88] flex items-center justify-center mb-4">
                                    <Shield className="h-7 w-7 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Admin Password Reset
                                </h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Enter your admin email to receive a secure reset link.
                                </p>
                            </div>

                            {/* Security Notice */}
                            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100 mb-6">
                                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-amber-700">
                                    <p className="font-medium">Admin Account Security</p>
                                    <p className="mt-1 text-amber-600">Reset links are sent only to verified admin emails.</p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Admin Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@metadologie.com"
                                        required
                                        className="h-11 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20"
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#1F3C88] hover:bg-[#1F3C88]/90 text-white font-medium rounded-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <div className="text-center py-6">
                            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Check Your Email
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                If an admin account exists with <span className="font-medium text-gray-900">{email}</span>,
                                you'll receive a password reset link shortly.
                            </p>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => {
                                        setIsSuccess(false);
                                        setEmail("");
                                    }}
                                    variant="outline"
                                    className="w-full"
                                >
                                    Try Another Email
                                </Button>
                                <Link href="/admin/login">
                                    <Button className="w-full bg-[#1F3C88] hover:bg-[#1F3C88]/90">
                                        Back to Admin Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-400">
                    Remember your password?{" "}
                    <Link href="/admin/login" className="font-medium text-white hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
