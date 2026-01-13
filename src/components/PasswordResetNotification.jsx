"use client";

import { useState, useEffect } from "react";
import { AuthService } from "@/services/authService";
import { Lock, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

export default function PasswordResetNotification({ user }) {
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem("dismissedResetNotification");
        if (dismissed) setIsVisible(false);
    }, []);

    if (!isVisible || !user?.requirePasswordReset) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem("dismissedResetNotification", "true");
    };

    const handleResetClick = async () => {
        setLoading(true);
        try {
            await AuthService.forgotPassword(user.email, user.storeUrl || user.url);
            toast.success("Reset link sent!");
            handleDismiss();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to send link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="absolute top-6 right-6 z-40 animate-in fade-in slide-in-from-right-8 duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`
                relative bg-white rounded-xl shadow-lg 
                border-2 border-dashed border-blue-200 
                p-4 w-72 transition-all duration-300
                ${isHovered ? 'scale-105 border-blue-400 shadow-xl' : 'scale-100'}
            `}>
                {/* Close Button (Always visible now) */}
                <button
                    onClick={handleDismiss}
                    className="absolute -top-2 -right-2 bg-white text-gray-400 hover:text-red-500 rounded-full p-1 shadow-sm border border-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <X className="h-3 w-3" />
                </button>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 text-[#1F3C88]">
                            <Lock className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 leading-tight">Security Check</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Action Recommended</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs text-gray-600 leading-relaxed">
                            System-generated password detected. Please reset for better security.
                        </p>
                        <Button
                            size="sm"
                            onClick={handleResetClick}
                            disabled={loading}
                            className="w-full h-8 text-xs bg-[#1F3C88] hover:bg-[#1F3C88]/90 text-white border-none shadow-sm"
                        >
                            {loading ? "Sending..." : "Reset Password"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
