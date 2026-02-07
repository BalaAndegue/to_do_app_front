"use client";

import Sidebar from "./Sidebar";
import { AuthProvider, useAuth } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function AppContent({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = pathname === "/login" || pathname === "/register";

    useEffect(() => {
        if (!loading && !isAuthenticated && !isAuthPage) {
            router.push("/login");
        }
    }, [isAuthenticated, isAuthPage, router, loading]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f4f4f4]">
                <div className="text-[#0f62fe] font-medium animate-pulse">Initializing IBM Workspace...</div>
            </div>
        );
    }

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-[#f4f4f4]">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AppContent>{children}</AppContent>
        </AuthProvider>
    );
}
