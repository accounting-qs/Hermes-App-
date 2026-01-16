"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Brain,
    Compass,
    History,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    Save,
    Sparkles,
    Moon,
    Sun,
    Building2,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

import { ResearchPhase } from '@/types/research';

interface ResearchLayoutProps {
    children: React.ReactNode;
    currentSection: number;
    totalSections: number;
    title: string;
    subtitle: string;
    activePhase: ResearchPhase;
    onPhaseChange: (phase: ResearchPhase) => void;
    onNext?: () => void;
    onBack?: () => void;
    onSave?: () => void;
    canNext?: boolean;
    canBack?: boolean;
    isSaving?: boolean;
}

export const ResearchLayout: React.FC<ResearchLayoutProps> = ({
    children,
    currentSection,
    totalSections,
    title,
    subtitle,
    activePhase,
    onPhaseChange,
    onNext,
    onBack,
    onSave,
    canNext = true,
    canBack = true,
    isSaving = false
}) => {
    // Local state for dark mode if needed, but ideally it uses the system/global one
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const sidebarItems: { id: ResearchPhase | 'extra', label: string, icon: any }[] = [
        { id: 'market', label: 'Market Research', icon: LayoutDashboard },
        { id: 'avatar', label: 'Avatar Research', icon: Users },
        { id: 'pains', label: 'Pains & Desires', icon: Brain },
        { id: 'extra', label: 'Extra Research', icon: Compass },
    ];

    const secondaryItems = [
        { id: 'history', label: 'Research History', icon: History },
        { id: 'new', label: 'New Research', icon: PlusCircle },
    ];

    return (
        <div className="flex h-full min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* STICKY SIDEBAR */}
            <aside className="w-80 border-r border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10 overflow-hidden">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] outfit-font truncate">Quantum Research</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hermes AI Powered</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Main Modules</p>
                        {sidebarItems.map((item) => {
                            const isActive = activePhase === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => item.id !== 'extra' && onPhaseChange(item.id as ResearchPhase)}
                                    className={cn(
                                        "w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                                        isActive
                                            ? "bg-primary text-white shadow-xl shadow-primary/20 translate-x-1"
                                            : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-white" : "text-slate-400 group-hover:text-primary"
                                    )} />
                                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="mt-12 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Quick Actions</p>
                        {secondaryItems.map((item) => (
                            <button
                                key={item.id}
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 dark:text-zinc-400 group"
                            >
                                <item.icon className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto p-8 border-t border-slate-100 dark:border-zinc-800 space-y-4">
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center justify-between px-5 py-4 bg-slate-100 dark:bg-zinc-800/50 rounded-2xl hover:bg-slate-200 dark:hover:bg-zinc-800 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-primary" />}
                            <span className="text-xs font-bold uppercase tracking-widest">Contrast Mode</span>
                        </div>
                        <div className={cn(
                            "w-8 h-4 rounded-full relative transition-colors duration-300",
                            isDarkMode ? "bg-primary" : "bg-slate-300"
                        )}>
                            <div className={cn(
                                "absolute top-1 w-2 h-2 rounded-full bg-white transition-all duration-300",
                                isDarkMode ? "right-1" : "left-1"
                            )} />
                        </div>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* DYNAMIC HEADER */}
                <header className="px-12 py-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between z-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                            <span className="text-xl font-black">{currentSection}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md">Step {currentSection} of {totalSections}</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phase: Deep Intelligence</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight outfit-font">{title}</h1>
                            <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">{subtitle}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 mr-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-200" />
                                ))}
                            </div>
                            <span>Quantum Guard Active</span>
                        </div>
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
                        >
                            {isSaving ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                            {isSaving ? "Changes Saved" : "Save Draft"}
                        </button>
                    </div>
                </header>

                {/* SCROLLABLE FORM AREA */}
                <div className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar">
                    <div className="max-w-5xl mx-auto pb-32">
                        {children}
                    </div>
                </div>

                {/* STICKY FOOTER */}
                <footer className="px-12 py-6 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                    <button
                        onClick={onBack}
                        disabled={!canBack}
                        className={cn(
                            "flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
                            canBack
                                ? "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 active:scale-95"
                                : "opacity-30 cursor-not-allowed"
                        )}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous Section
                    </button>

                    <div className="flex gap-4">
                        <button
                            onClick={onNext}
                            disabled={!canNext}
                            className={cn(
                                "flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95",
                                !canNext && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {currentSection === totalSections ? "Finalize Research" : "Proceed to Next"}
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    );
};
