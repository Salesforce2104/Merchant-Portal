"use client";

import { useState } from "react";
import {
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Edit3,
    Lock,
    Eye,
    EyeOff,
    Shield,
    CheckCircle2
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

/**
 * Shared Profile View Component
 * Used by both Admin and Merchant/Auth profile pages.
 * 
 * @param {object} user - The user data object to display.
 * @param {function} onSave - Callback function when profile is saved. Receives updated user object.
 * @param {function} onChangePassword - Callback function when password is changed. Receives { currentPassword, newPassword }.
 * @param {object} fallbackData - Default fallback values for display (name, email, etc.).
 * @param {boolean} showPhone - Whether to show phone number field (default: true).
 * @param {boolean} showSubscription - Whether to show subscription plan field (default: true).
 */
export default function ProfileView({
    user,
    onSave,
    onChangePassword,
    fallbackData = {},
    showPhone = true,
    showSubscription = true
}) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordError, setPasswordError] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Fallback data for display
    const displayUser = {
        name: user?.name || fallbackData.name || "N/A",
        email: user?.email || fallbackData.email || "N/A",
        avatar: user?.avatar,
        phone: user?.phone || fallbackData.phone || "N/A",
        location: user?.location || fallbackData.location || "N/A",
        subscription: user?.subscription || fallbackData.subscription || "N/A"
    };

    // Pre-fill form data when modal opens
    const handleOpenModal = () => {
        setFormData({
            name: displayUser.name,
            email: displayUser.email,
            phone: displayUser.phone,
            location: displayUser.location
        });
        setIsEditModalOpen(true);
    };

    const handleOpenPasswordModal = () => {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
        setIsPasswordModalOpen(true);
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        setPasswordError("");
    };

    const handleSaveChanges = () => {
        const updatedUser = { ...user, ...formData };
        if (onSave) {
            onSave(updatedUser);
        }
        setIsEditModalOpen(false);
    };

    const handleChangePassword = async () => {
        // Validation
        if (!passwordData.currentPassword) {
            setPasswordError("Current password is required");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters");
            return;
        }
        if (!/^[A-Z]/.test(passwordData.newPassword)) {
            setPasswordError("First letter of password must be capital");
            return;
        }
        if (!/[^A-Za-z0-9]/.test(passwordData.newPassword)) {
            setPasswordError("Password must contain at least one special character");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setIsChangingPassword(true);
        try {
            if (onChangePassword) {
                await onChangePassword({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                });
            }
            setIsPasswordModalOpen(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            setPasswordError(error.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
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
        return { strength, ...levels[Math.min(strength, 3)] };
    };

    const passwordStrength = getPasswordStrength(passwordData.newPassword);

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            {/* Header Cover */}
            <div className="relative h-64 w-full overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50/50 to-transparent" />
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-32">
                    {/* Profile Card */}
                    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5 transition-all hover:shadow-2xl">
                        <div className="p-6 sm:p-10">
                            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-8">
                                {/* Avatar Section */}
                                <div className="h-20 w-20 rounded-full ring-4 ring-white shadow-lg overflow-hidden flex items-center justify-center bg-[#1F3C88]">
                                    {displayUser.avatar ? (
                                        <img
                                            src={displayUser.avatar}
                                            alt={displayUser.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {getInitials(displayUser.name)}
                                        </span>
                                    )}
                                </div>

                                {/* Name & Email */}
                                <div className="mt-6 sm:mt-0 flex-1 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                                {displayUser.name}
                                            </h1>
                                            <div className="mt-1 flex items-center justify-center sm:justify-start space-x-2 text-sm text-gray-500">

                                            </div>
                                        </div>
                                        {/* Action Buttons */}
                                        <div className="mt-4 sm:mt-0 flex flex-wrap gap-3 justify-center sm:justify-end">
                                            <button
                                                onClick={handleOpenModal}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3C88] transition-colors"
                                            >
                                                <Edit3 className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </button>
                                            <button
                                                onClick={handleOpenPasswordModal}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3C88] transition-colors"
                                            >
                                                <Lock className="h-4 w-4 mr-2" />
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-2">
                                {/* Email */}
                                <div className="group flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-900 group-hover:bg-gray-200 transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900 break-all">
                                            {displayUser.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone - Conditional */}
                                {showPhone && (
                                    <div className="group flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                                                <Phone className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Phone Number</p>
                                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                                {displayUser.phone}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="group flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                                    <div className="flex-shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Location</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">
                                            {displayUser.location}
                                        </p>
                                    </div>
                                </div>

                                {/* Subscription Plan - Conditional */}
                                {showSubscription && (
                                    <div className="group flex items-start space-x-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                                        <div className="flex-shrink-0">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                                                <CreditCard className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Subscription Plan</p>
                                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                                {displayUser.subscription}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Profile"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveChanges} className="bg-[#1F3C88] hover:bg-[#1F3C88]/90">
                            Save Changes
                        </Button>
                    </div>
                }
            >
                <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                    {/* Full Name Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-sm text-gray-600 font-medium">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name || ""}
                            onChange={handleInputChange}
                            className="h-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20 transition-colors"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-sm text-gray-600 font-medium">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleInputChange}
                            className="h-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20 transition-colors"
                        />
                    </div>

                    {/* Phone Field - Conditional */}
                    {showPhone && (
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-sm text-gray-600 font-medium">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone || ""}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 000-0000"
                                className="h-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20 transition-colors"
                            />
                        </div>
                    )}

                    {/* Location Field */}
                    <div className="space-y-1.5">
                        <Label htmlFor="location" className="text-sm text-gray-600 font-medium">
                            Location
                        </Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location || ""}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                            className="h-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20 transition-colors"
                        />
                    </div>
                </div>
            </Modal>

            {/* Change Password Modal */}
            <Modal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                title="Change Password"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            className="bg-[#1F3C88] hover:bg-[#1F3C88]/90"
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword ? "Updating..." : "Update Password"}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-5">
                    {/* Security Notice */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700">
                            <p className="font-medium">Secure Password Update</p>
                            <p className="mt-1 text-blue-600">Choose a strong password with at least 8 characters, including uppercase, numbers, and symbols.</p>
                        </div>
                    </div>

                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="currentPassword" className="text-sm text-gray-600 font-medium">
                            Current Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Enter your current password"
                                className="h-10 pr-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("current")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                        <Label htmlFor="newPassword" className="text-sm text-gray-600 font-medium">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Enter new password"
                                className="h-10 pr-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        {passwordData.newPassword && (
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
                        <Label htmlFor="confirmPassword" className="text-sm text-gray-600 font-medium">
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordInputChange}
                                placeholder="Re-enter new password"
                                className="h-10 pr-10 rounded-lg border-gray-200 focus:border-[#1F3C88] focus:ring-1 focus:ring-[#1F3C88]/20 transition-colors"
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
                        {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-medium">Passwords match</span>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {passwordError && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 font-medium">
                            {passwordError}
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
