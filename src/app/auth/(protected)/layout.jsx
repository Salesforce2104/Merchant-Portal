"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import Loader from "@/components/ui/Loader";

export default function AuthProtectedLayout({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check for user token
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem(AUTH_TOKEN_KEY)
                : null;

        if (!token) {
            router.push("/auth/login");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
}
