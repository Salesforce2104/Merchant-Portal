"use client";

import { useState, useEffect, useRef } from "react";
import { User, Settings, Sun, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY, ADMIN_AUTH_TOKEN_KEY } from "@/lib/constants";
import Link from "next/link";

export default function ProfileMenu({ user, onLogout, profileLink }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  // Get Initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(user.name || user.email || "User");
  const role = user.role || "Merchant"; // Default role

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-[#1F3C88] text-white font-bold text-sm tracking-wider hover:bg-[#1F3C88]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F3C88]"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-gray-100 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#1F3C88] text-white flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {user.name || "User"}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>

          <div className="py-2">
            <Link
              href={profileLink || "/admin/profile"} // Fallback just in case
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors gap-3"
            >
              <User className="h-5 w-5 text-gray-400" />
              <div className="text-left">
                <p className="font-medium text-gray-900">My Profile</p>
                <p className="text-xs text-gray-500">View your details</p>
              </div>
            </Link>
          </div>

          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
