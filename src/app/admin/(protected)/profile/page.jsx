"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileView from "@/components/ProfileView";
import Loader from "@/components/ui/Loader";
import { useUpdateAdminProfile } from "@/hooks/useAdminData";
import { AdminService } from "@/services/adminService";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mutation hook for updating admin's own profile
    const updateProfileMutation = useUpdateAdminProfile();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                // First, try to get cached data for immediate display
                const cachedData = localStorage.getItem("admin_user");
                if (cachedData) {
                    try {
                        setUser(JSON.parse(cachedData));
                    } catch (e) {
                        console.error("Failed to parse cached admin data", e);
                    }
                }

                // Then fetch fresh data from backend
                const response = await AdminService.getAdminProfile();
                if (response.success && response.admin) {
                    setUser(response.admin);
                    // Update localStorage with fresh data
                    localStorage.setItem("admin_user", JSON.stringify(response.admin));
                    // Dispatch event to notify Navbar
                    window.dispatchEvent(new Event("profile-updated"));
                }
            } catch (error) {
                console.error("Failed to fetch admin profile", error);
                // Fall back to localStorage if API fails
                const adminData = localStorage.getItem("admin_user");
                if (adminData) {
                    try {
                        setUser(JSON.parse(adminData));
                    } catch (e) {
                        console.error("Failed to parse admin data", e);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, []);

    const handleSave = (updatedUser) => {
        // Sanitize payload: Only send fields that constitute an update
        const payload = {
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            location: updatedUser.location,
        };

        console.log("[Profile Update] Payload:", payload);

        // Call API - No ID needed! Backend uses token to identify admin
        updateProfileMutation.mutate(payload, {
            onSuccess: (data) => {
                // Check if email verification is pending
                if (data.message && data.message.toLowerCase().includes("verification")) {
                    // Email change requires verification
                    toast.success(data.message, { duration: 5000 });
                    // Don't update the email in local state since it's pending
                    const updatedAdmin = { ...user, name: payload.name, location: payload.location };
                    setUser(updatedAdmin);
                    localStorage.setItem("admin_user", JSON.stringify(updatedAdmin));
                    // Dispatch event to notify Navbar
                    window.dispatchEvent(new Event("profile-updated"));
                } else {
                    // Normal update
                    const returnedAdmin = data.admin || { ...user, ...payload };
                    setUser(returnedAdmin);
                    localStorage.setItem("admin_user", JSON.stringify(returnedAdmin));
                    // Dispatch event to notify Navbar
                    window.dispatchEvent(new Event("profile-updated"));
                    toast.success("Profile updated successfully");
                }
            },
            onError: (error) => {
                console.error("Profile update failed", error);
                toast.error(error.response?.data?.error || "Failed to update profile");
            }
        });
    };
    const handleChangePassword = async ({ currentPassword, newPassword }) => {
        try {
            const result = await AdminService.changeAdminPassword({ currentPassword, newPassword });
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
            showPhone={false}
            showSubscription={false}
            fallbackData={{
                name: "Admin User",
                email: "admin@example.com"
            }}
        />
    );
}
