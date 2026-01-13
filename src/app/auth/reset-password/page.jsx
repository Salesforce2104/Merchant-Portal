"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
    Lock,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Shield
} from "lucide-react";
import { AuthService } from "@/services/authService";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [storeUrl, setStoreUrl] = useState(null);
    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token. Please request a new password reset link.");
        }

        // Try to obtain storeUrl from localStorage (if user is logged in or cached)
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.storeUrl || user.url) {
                        setStoreUrl(user.storeUrl || user.url);
                    }
                } catch (e) {
                    console.error("Failed to parse user for storeUrl", e);
                }
            }
        }
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "" };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const levels = [
            { label: "Weak", color: "bg-red-500" },
            { label: "Fair", color: "bg-orange-500" },
            { label: "Good", color: "bg-yellow-500" },
            { label: "Strong", color: "bg-green-500" }
        ];
        return { strength, ...levels[Math.min(strength - 1, 3)] || levels[0] };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }
        if (!/^[A-Z]/.test(formData.newPassword)) {
            setError("First letter of password must be capital");
            return;
        }
        if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
            setError("Password must contain at least one special character");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const result = await AuthService.resetPassword({
                token,
                newPassword: formData.newPassword,
                storeUrl
            });

            if (result.success) {
                setIsSuccess(true);
            } else {
                setError(result.error || "Failed to reset password");
            }
        } catch (error) {
            setError(error.response?.data?.error || error.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    // No token state
    if (!token && !isSuccess) {
        return (
            <div className="text-center py-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Invalid Reset Link
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    This password reset link is invalid or has expired. Please request a new one.
                </p>
                <Link href="/auth/forgot-password">
                    <Button className="w-full bg-[#1F3C88] hover:bg-[#1F3C88]/90">
                        Request New Link
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            {!isSuccess ? (
                <>
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto h-14 w-14 rounded-full bg-[#1F3C88]/10 flex items-center justify-center mb-4">
                            <Lock className="h-7 w-7 text-[#1F3C88]" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Reset Your Password
                        </h1>
                        {email && (
                            <p className="mt-2 text-sm text-gray-600">
                                Resetting password for <span className="font-medium text-gray-900">{email}</span>
                            </p>
                        )}
                        {!email && (
                            <p className="mt-2 text-sm text-gray-600">
                                Create a new, strong password for your account.
                            </p>
                        )}
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700">
                            <p className="font-medium">Password Requirements</p>
                            <p className="mt-1 text-blue-600">At least 8 characters with uppercase, numbers, and symbols.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                                New Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPasswords.new ? "text" : "password"}
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    placeholder="Enter new password"
                                    required
                                    className="h-11 pr-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("new")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Password Strength */}
                            {formData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex gap-1 h-1.5">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                                    ? passwordStrength.color
                                                    : "bg-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`mt-1 text-xs font-medium ${passwordStrength.strength <= 1 ? "text-red-600" :
                                        passwordStrength.strength === 2 ? "text-orange-600" :
                                            passwordStrength.strength === 3 ? "text-yellow-600" :
                                                "text-green-600"
                                        }`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Re-enter new password"
                                    required
                                    className="h-11 pr-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("confirm")}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {/* Match Indicator */}
                            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs font-medium">Passwords match</span>
                                </div>
                            )}
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
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
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
                        Password Reset Complete
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Your password has been successfully reset. You can now log in with your new password.
                    </p>
                    <Link href="/auth/login">
                        <Button className="w-full bg-[#1F3C88] hover:bg-[#1F3C88]/90">
                            Continue to Login
                        </Button>
                    </Link>
                </div>
            )}
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 pt-32">
            <div className="w-full max-w-md">

                <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
                    <Suspense fallback={
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#1F3C88]" />
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
