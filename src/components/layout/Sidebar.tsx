"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    BarChart3,
    Bell,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search,
    Target,
    Video,
    BookOpen,
    Truck,
    Settings2,
    PieChart,
    FileText,
    Moon,
    Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrandStore } from "@/store/useBrandStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const { selectedBrandId, brands } = useBrandStore();
    const { user } = useAuthStore();
    const { theme, setTheme } = useTheme();

    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    const globalNav = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ...(user?.role === 'qs_team' ? [
            { title: "Brands", href: "/brands", icon: Briefcase },
            { title: "Users", href: "/users", icon: Users },
            { title: "Analytics", href: "/analytics", icon: BarChart3 },
        ] : []),
    ];

    const brandNav = selectedBrandId ? [
        { title: "Overview", href: `/brands/${selectedBrandId}`, icon: Search },
        { title: "Resources", href: `/brands/${selectedBrandId}/resources`, icon: FileText },
        { title: "Research", href: `/brands/${selectedBrandId}/research`, icon: Search },
        ...(user?.role !== 'client_assistant' ? [
            { title: "Offers", href: `/brands/${selectedBrandId}/offers`, icon: Target },
        ] : []),
        { title: "Webinar", href: `/brands/${selectedBrandId}/webinar`, icon: Video },
        { title: "Workbook", href: `/brands/${selectedBrandId}/workbook`, icon: BookOpen },
    ] : [];


    const footerNav = [
        { title: "Notifications", href: "/notifications", icon: Bell },
        { title: "Settings", href: "/settings", icon: Settings },
    ];

    const NavItem = ({ item, isBrandContext = false }: { item: any; isBrandContext?: boolean }) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative",
                    isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                )}
            >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-medium whitespace-nowrap"
                    >
                        {item.title}
                    </motion.span>
                )}
                {!isOpen && isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />
                )}
            </Link>
        );
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isOpen ? "20%" : 80, minWidth: isOpen ? 240 : 80 }}
            className="relative flex flex-col h-screen bg-card border-r border-border/50 z-30 transition-all duration-300 shadow-xl"
        >
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-6 h-16 border-b border-border/50">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                    <span className="text-primary-foreground font-black text-xl">H</span>
                </div>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        <span className="font-bold text-base tracking-tight leading-none">HERMES AI</span>
                        <span className="text-[10px] text-primary font-bold tracking-widest uppercase opacity-80 mt-1">Quantum Scale</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation Scroll Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8 scrollbar-hide">
                {/* Global Nav */}
                <div className="space-y-1">
                    {globalNav.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </div>

                {/* Brand Context Nav */}
                <AnimatePresence mode="wait">
                    {selectedBrandId && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-4"
                        >
                            {isOpen && (
                                <div className="px-3">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">Core Management</p>
                                    <div className="h-px bg-border/50 w-full mb-4" />
                                </div>
                            )}
                            <div className="space-y-1">
                                {brandNav.map((item) => (
                                    <NavItem key={item.href} item={item} isBrandContext />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Nav */}
            <div className="p-4 border-t border-border/50 space-y-1 bg-card/50 backdrop-blur-sm">
                {footerNav.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-3 w-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all group"
                >
                    <div className="w-5 h-5 flex items-center justify-center relative">
                        <Sun className={cn("w-5 h-5 absolute transition-all", theme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0')} />
                        <Moon className={cn("w-5 h-5 absolute transition-all", theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 -rotate-90')} />
                    </div>
                    {isOpen && <span className="text-sm font-medium">Appearance</span>}
                </button>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all"
                >
                    {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    {isOpen && <span className="text-sm font-medium">Collapse</span>}
                </button>
            </div>
        </motion.div>
    );
}
