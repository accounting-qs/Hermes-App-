"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { useBrandStore } from "@/store/useBrandStore";
import { usePathname, useRouter } from "next/navigation";
import { QuantumCopilot } from "@/components/copilot/Copilot";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    const { selectedBrandId } = useBrandStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Handle default redirect to dashboard if authenticated
    useEffect(() => {
        if (isAuthenticated && pathname === "/") {
            router.push("/dashboard");
        }
    }, [isAuthenticated, pathname, router]);

    if (!isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <Header setIsSidebarOpen={setIsSidebarOpen} />

                <main className="flex-1 overflow-y-auto px-6 py-8">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
                <QuantumCopilot />

                <footer className="p-4 bg-background/50 border-t border-border/50 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} HERMES AI • Powered by Quantum Scale
                </footer>
            </div>
        </div>
    );
}
