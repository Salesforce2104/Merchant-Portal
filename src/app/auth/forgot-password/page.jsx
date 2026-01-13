"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { AuthService } from "@/services/authService";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await AuthService.forgotPassword(email);
            if (result.success) {
                setIsSuccess(true);
            }
        } catch (error) {
            // We still show success to prevent email enumeration
            // But log the error for debugging
            console.error("Forgot password error:", error);
            setIsSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Back to Login */}
                <Link
                    href="/auth/login"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Login
                </Link>

                <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
                    {!isSuccess ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="mx-auto h-14 w-14 rounded-full bg-[#1F3C88]/10 flex items-center justify-center mb-4">
                                    <Mail className="h-7 w-7 text-[#1F3C88]" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Forgot Password?
                                </h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    No worries! Enter your email and we'll send you a reset link.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
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
                                If an account exists with <span className="font-medium text-gray-900">{email}</span>,
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
                                <Link href="/auth/login">
                                    <Button className="w-full bg-[#1F3C88] hover:bg-[#1F3C88]/90">
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="font-medium text-[#1F3C88] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
