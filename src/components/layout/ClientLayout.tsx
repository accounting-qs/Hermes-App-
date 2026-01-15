"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { useBrandStore } from "@/store/useBrandStore";
import { usePathname, useRouter } from "next/navigation";
import { QuantumCopilot } from "@/components/copilot/Copilot";
import { useAuth } from "@/components/AuthContext";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const { isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        console.log('ClientLayout: Mounted');
        setMounted(true);
    }, []);

    useEffect(() => {
        console.log('ClientLayout: AuthState Sync', { mounted, isLoading, isAuthenticated, pathname });
        if (mounted && !isLoading && isAuthenticated && pathname === "/") {
            console.log('ClientLayout: Redirecting from / to /dashboard');
            router.push("/dashboard");
        }
    }, [isAuthenticated, pathname, router, mounted, isLoading]);

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
            {/* Sidebar with dynamic width */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="relative flex flex-col flex-1 overflow-hidden">
                {/* Slim Header */}
                <Header setIsSidebarOpen={setIsSidebarOpen} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="min-h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Floating Copilot Button */}
                <QuantumCopilot />
            </div>
        </div>
    );
}
