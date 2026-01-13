"use client";

import { useEffect, useState } from "react";
import ProfileView from "@/components/ProfileView";
import Loader from "@/components/ui/Loader";
import toast from "react-hot-toast";
import { AuthService } from "@/services/authService";

export default function UserProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Strictly fetch USER/MERCHANT data
        const userData = localStorage.getItem("user");

        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
        setLoading(false);
    }, []);

    const handleSave = async (updatedUser) => {
        try {
            const payload = {
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                location: updatedUser.location,
            };

            const response = await AuthService.updateProfile(payload);

            if (response.success || response.user) {
                const newUser = response.user || { ...user, ...payload };
                setUser(newUser);
                localStorage.setItem("user", JSON.stringify(newUser));
                window.dispatchEvent(new Event("profile-updated"));

                if (response.message) {
                    toast.success(response.message);
                } else {
                    toast.success("Profile updated successfully");
                }
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error(error.response?.data?.error || "Failed to update profile");
        }
    };

    const handleChangePassword = async ({ currentPassword, newPassword }) => {
        try {
            const result = await AuthService.changePassword({ currentPassword, newPassword });
            if (result.success) {
                toast.success(result.message || "Password changed successfully!");
            } else {
                throw new Error(result.error || "Failed to change password");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || "Failed to change password";
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <ProfileView
            user={user}
            onSave={handleSave}
            onChangePassword={handleChangePassword}
            showPhone={true}
            showSubscription={true}
            fallbackData={{
                name: "Merchant User",
                email: "merchant@example.com",
                subscription: "Basic Plan"
            }}
        />
    );
}
