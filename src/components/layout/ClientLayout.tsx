"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { useBrandStore } from "@/store/useBrandStore";
import { usePathname, useRouter } from "next/navigation";
import { QuantumCopilot } from "@/components/copilot/Copilot";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && isAuthenticated && pathname === "/") {
            router.push("/dashboard");
        }
    }, [isAuthenticated, pathname, router, mounted]);

    if (!mounted) {
        return <div className="min-h-screen bg-black" />;
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
