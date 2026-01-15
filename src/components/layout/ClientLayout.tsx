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
import { createClient } from "@/lib/supabase-ssr/client";
import { ToastProvider } from "@/components/ui/ToastContext";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const { isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const supabase = createClient();
    const { setBrands } = useBrandStore();

    useEffect(() => {
        console.log('ClientLayout: Mounted');
        setMounted(true);

        const fetchGlobalBrands = async () => {
            const { data } = await supabase.from('brands').select('*').order('name');
            if (data) setBrands(data);
        };

        if (isAuthenticated) {
            fetchGlobalBrands();
        }
    }, [isAuthenticated]);

    // Only allow public routes (/login, /unauthorized, /auth/callback) to render without authentication
    const isPublicRoute = pathname === '/login' || pathname === '/unauthorized' || pathname.startsWith('/auth/callback');

    if (isPublicRoute) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }

    // Loader logic: if not mounted OR if the auth context is still figuring out if we are logged in/whitelisted
    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
                {/* Premium Background Effects */}
                <div className="absolute inset-0 premium-gradient opacity-5" />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]"
                />

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent animate-spin rounded-full shadow-lg shadow-primary/20" />
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
                        Authenticating System
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // The auth context or middleware will handle the push
    }




    return (
        <ToastProvider>
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
        </ToastProvider>
    );
}
