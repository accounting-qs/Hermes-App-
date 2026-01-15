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
import { useAuth } from "@/components/AuthContext";

export function Header({ setIsSidebarOpen }: { setIsSidebarOpen: (val: boolean) => void }) {
    const { brands, selectedBrandId, selectBrand } = useBrandStore();
    const { user } = useAuthStore();
    const { signOut } = useAuth();

    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    return (
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
                {/* Global Search Bar */}
                <div className="hidden md:flex items-center relative flex-1 max-w-xl">
                    <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search brands, tasks, or resources..."
                        className="w-full bg-secondary/50 border border-border/50 rounded-xl py-2 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Quick Action */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Brand</span>
                </motion.button>

                {/* Copilot Trigger */}
                <button className="relative w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all group border border-border/50">
                    <Sparkles className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold leading-none mb-1">{user?.name}</div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight opacity-70">
                            {user?.subType} @ {user?.role === 'qs_team' ? 'QS Team' : 'Client'}
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-border/50 cursor-pointer hover:border-primary/50 transition-colors bg-secondary">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full right-0 mt-3 w-56 bg-card border border-border shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 transform origin-top-right group-hover:scale-100 scale-95">
                            <div className="px-3 py-2 mb-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account</p>
                            </div>
                            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-all text-foreground/80 hover:text-foreground">
                                <UserIcon className="w-4 h-4" />
                                <span>My Profile</span>
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-all text-foreground/80 hover:text-foreground">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </button>
                            <div className="h-px bg-border my-2 mx-1" />
                            <button
                                onClick={signOut}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all font-medium"
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
