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
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrandStore } from "@/store/useBrandStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();
    const { selectedBrandId, brands } = useBrandStore();
    const { user } = useAuthStore();

    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    const globalNav = [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Brands", href: "/brands", icon: Briefcase },
        { title: "Users", href: "/users", icon: Users },
        { title: "Analytics", href: "/analytics", icon: BarChart3 },
    ];

    const brandNav = selectedBrandId ? [
        { title: "Overview", href: `/brands/${selectedBrandId}`, icon: Search },
        { title: "Resources", href: `/brands/${selectedBrandId}/resources`, icon: FileText },
        { title: "Research", href: `/brands/${selectedBrandId}/research`, icon: Search },
        { title: "Offers", href: `/brands/${selectedBrandId}/offers`, icon: Target },
        { title: "Webinar", href: `/brands/${selectedBrandId}/webinar`, icon: Video },
        { title: "Workbook", href: `/brands/${selectedBrandId}/workbook`, icon: BookOpen },
        { title: "Delivery", href: `/brands/${selectedBrandId}/delivery`, icon: Truck },
        { title: "Tech Setup", href: `/brands/${selectedBrandId}/tech-setup`, icon: Settings2 },
        { title: "Analytics", href: `/brands/${selectedBrandId}/analytics`, icon: PieChart },
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
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                )}
            >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-medium"
                    >
                        {item.title}
                    </motion.span>
                )}
                {!isOpen && isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                )}
            </Link>
        );
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isOpen ? 260 : 80 }}
            className="relative flex flex-col h-screen bg-card border-r border-border/50 z-30 transition-all duration-300"
        >
            {/* Logo Section */}
            <div className="flex items-center gap-3 px-6 h-20 border-b border-border/50">
                <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">H</span>
                </div>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        <span className="font-bold text-lg tracking-tight leading-none outfit-font">HERMES AI</span>
                        <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Quantum Scale</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation Scroll Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 scrollbar-hide">
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
                            className="space-y-3"
                        >
                            {isOpen && (
                                <div className="px-3 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {selectedBrand?.name || "Selected Brand"}
                                    </span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
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
            <div className="p-4 border-t border-border/50 space-y-1">
                {footerNav.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 w-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all"
                >
                    {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    {isOpen && <span className="text-sm font-medium">Collapse Sidebar</span>}
                </button>
            </div>
        </motion.div>
    );
}
