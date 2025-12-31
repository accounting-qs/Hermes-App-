"use client";

import React from "react";
import {
    BarChart3,
    Search,
    Target,
    Video,
    BookOpen,
    Truck,
    Settings2,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    Circle,
    MoreHorizontal
} from "lucide-react";
import { useBrandStore } from "@/store/useBrandStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function BrandOverviewPage() {
    const { id } = useParams();
    const { brands } = useBrandStore();
    const brand = brands.find(b => b.id === id);

    if (!brand) return <div>Brand not found</div>;

    const modules = [
        { id: 'resources', title: "Resources", icon: BookOpen, progress: 100, status: 'Complete' },
        { id: 'research', title: "Research", icon: Search, progress: brand.progress.research, status: brand.progress.research === 100 ? 'Complete' : 'In Progress' },
        { id: 'offers', title: "Offers", icon: Target, progress: brand.progress.offers, status: brand.progress.offers === 100 ? 'Complete' : 'In Progress' },
        { id: 'webinar', title: "Webinar", icon: Video, progress: brand.progress.webinar, status: brand.progress.webinar === 100 ? 'Complete' : 'In Progress' },
        { id: 'workbook', title: "Workbook", icon: BookOpen, progress: 0, status: 'Not Started' },
        { id: 'delivery', title: "Delivery", icon: Truck, progress: brand.progress.delivery, status: 'In Progress' },
    ];

    const phases = ['Foundation', 'Messaging', 'Webinar Dev', 'Launch Prep', 'Running', 'Scaling'];
    const currentPhaseIndex = phases.indexOf(brand.phase.charAt(0).toUpperCase() + brand.phase.slice(1));

    return (
        <div className="space-y-8 pb-12">
            {/* Brand Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl premium-gradient flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-primary/30">
                        {brand.name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold outfit-font">{brand.name}</h1>
                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                                {brand.status}
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-1">{brand.companyName} • {brand.industry}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-xl text-sm font-bold transition-all">
                        Edit Brand
                    </button>
                    <button className="px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                        Schedule Call
                    </button>
                </div>
            </div>

            {/* Hero Stats & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold">Program Progress</h2>
                        <div className="text-sm font-bold text-primary">{brand.progress.overall}% Overall Completion</div>
                    </div>

                    {/* Phase Stepper */}
                    <div className="relative mb-12">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 z-0" />
                        <div
                            className="absolute top-1/2 left-0 h-1 premium-gradient -translate-y-1/2 z-0 transition-all duration-1000"
                            style={{ width: `${(currentPhaseIndex / (phases.length - 1)) * 100}%` }}
                        />

                        <div className="relative z-10 flex justify-between">
                            {phases.map((phase, idx) => {
                                const isActive = idx <= currentPhaseIndex;
                                const isCurrent = idx === currentPhaseIndex;

                                return (
                                    <div key={phase} className="flex flex-col items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                            isActive ? "premium-gradient text-white shadow-lg shadow-primary/30" : "bg-card border-2 border-border text-muted-foreground",
                                            isCurrent && "ring-4 ring-primary/20 scale-110"
                                        )}>
                                            {isActive ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground" />}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest",
                                            isActive ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {phase}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {modules.map((mod) => (
                            <Link
                                href={`/brands/${id}/${mod.id}`}
                                key={mod.id}
                                className="p-4 bg-secondary/20 border border-border/50 rounded-2xl hover:border-primary/50 hover:bg-secondary/40 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <mod.icon className="w-5 h-5" />
                                    </div>
                                    <div className={cn(
                                        "text-[8px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border",
                                        mod.status === 'Complete' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                            mod.status === 'In Progress' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                "bg-secondary text-muted-foreground border-border"
                                    )}>
                                        {mod.status}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-sm font-bold">{mod.title}</div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full premium-gradient" style={{ width: `${mod.progress}%` }} />
                                        </div>
                                        <span className="text-[10px] font-bold">{mod.progress}%</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Brand Summary Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Team Assignment</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">CW</div>
                                <div>
                                    <div className="text-sm font-bold">Chris Welker</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Lead Coach</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-bold italic">?</div>
                                <div>
                                    <div className="text-sm font-bold text-muted-foreground">None Assigned</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Executive</div>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-lg text-xs font-bold transition-all mt-2">
                                Manage Team
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {[
                                { action: "Offer Script updated", time: "2 hours ago", icon: Target },
                                { action: "Research summary generated", time: "5 hours ago", icon: Search },
                                { action: "Meeting notes uploaded", time: "Yesterday", icon: BookOpen },
                            ].map((act, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i !== 2 && <div className="absolute top-8 left-4 w-px h-6 bg-border" />}
                                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                        <act.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium">{act.action}</div>
                                        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {act.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
