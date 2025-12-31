"use client";

import React from "react";
import {
    Search,
    Plus,
    ChevronDown,
    LogOut,
    User as UserIcon,
    Sparkles,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBrandStore } from "@/store/useBrandStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";

export function Header({ setIsSidebarOpen }: { setIsSidebarOpen: (val: boolean) => void }) {
    const { brands, selectedBrandId, selectBrand } = useBrandStore();
    const { user, logout } = useAuthStore();

    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    return (
        <header className="h-20 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
                {/* Brand Selector */}
                <div className="relative group">
                    <button
                        className="flex items-center gap-3 px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl hover:bg-secondary transition-all"
                    >
                        <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                            <span className="text-primary text-[10px] font-bold">
                                {selectedBrand ? selectedBrand.name[0] : "QS"}
                            </span>
                        </div>
                        <span className="text-sm font-semibold max-w-[150px] truncate">
                            {selectedBrand ? selectedBrand.name : "Select Brand"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {/* Mock Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                        <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Your Brands</div>
                        {brands.map(brand => (
                            <button
                                key={brand.id}
                                onClick={() => selectBrand(brand.id)}
                                className={cn(
                                    "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-all",
                                    selectedBrandId === brand.id && "bg-primary/10 text-primary"
                                )}
                            >
                                <span>{brand.name}</span>
                                {selectedBrandId === brand.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </button>
                        ))}
                        <div className="h-px bg-border my-2" />
                        <button
                            onClick={() => selectBrand(null)}
                            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Clear Selection</span>
                        </button>
                    </div>
                </div>

                {/* Global Search Bar */}
                <div className="hidden md:flex items-center relative flex-1 max-w-md">
                    <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search brands, tasks, or resources..."
                        className="w-full bg-secondary/50 border border-border/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Quick Action */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 premium-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Brand</span>
                </motion.button>

                {/* Copilot Trigger */}
                <button className="relative w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all group">
                    <Sparkles className="w-5 h-5 text-primary group-hover:animate-pulse" />
                    <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold">{user?.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{user?.subType} @ {user?.role === 'qs_team' ? 'QS Team' : 'Client'}</div>
                    </div>
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/50 cursor-pointer">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-secondary flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-all">
                                <UserIcon className="w-4 h-4" />
                                <span>My Profile</span>
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-all">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </button>
                            <div className="h-px bg-border my-2" />
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
