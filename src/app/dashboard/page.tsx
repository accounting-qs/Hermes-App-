"use client";

import React from "react";
import {
    Users,
    Video,
    BarChart3,
    PhoneCall,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Clock,
    AlertCircle
} from "lucide-react";
import { useBrandStore } from "@/store/useBrandStore";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { cn, formatPercentage } from "@/lib/utils";
import Link from "next/link";

export default function DashboardPage() {
    const { brands } = useBrandStore();
    const { user } = useAuthStore();

    const stats = [
        { title: "Active Brands", value: brands.length, trend: "+2", isUp: true, icon: Users },
        { title: "Webinars (Mo)", value: "12", trend: "+15%", isUp: true, icon: Video },
        { title: "Avg. Show Rate", value: "42.5%", trend: "-2.4%", isUp: false, icon: BarChart3 },
        { title: "Calls Booked", value: "84", trend: "+12", isUp: true, icon: PhoneCall },
    ];

    const attentionRequired = brands.filter(b => b.progress.overall < 100).slice(0, 3);

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold outfit-font">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-muted-foreground mt-1">Here's what's happening across your brands today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 border-border/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                                    stat.isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{stat.title}</div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Attention Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            Requiring Attention
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {attentionRequired.map((brand) => (
                            <div key={brand.id} className="glass-card p-4 hover:border-primary/50 transition-all cursor-pointer group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold">
                                            {brand.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{brand.name}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Phase: {brand.phase}</div>
                                        </div>
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider flex-wrap">
                                        <span>Progress</span>
                                        <span>{brand.progress.overall}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${brand.progress.overall}%` }}
                                            className="h-full premium-gradient"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Tasks */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-4 border-b border-border/50 bg-secondary/30">
                            <h2 className="text-sm font-bold uppercase tracking-widest">Ongoing Tasks</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {[
                                { task: "Review Nexus Research", time: "2h left", priority: "high" },
                                { task: "Approve QS Offer Script", time: "Today", priority: "medium" },
                                { task: "Setup GHL for New Client", time: "Tomorrow", priority: "low" },
                            ].map((task, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                                        )} />
                                        <span className="text-sm font-medium">{task.task}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-bold">{task.time}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/tasks" className="block text-center py-3 text-xs font-bold text-primary hover:bg-primary/5 transition-all">
                            View All Tasks
                        </Link>
                    </div>
                </div>

                {/* Brands Grid Section */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Active Brands</h2>
                        <Link href="/brands" className="text-sm text-primary font-bold hover:underline">View All Brands</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {brands.map((brand, idx) => (
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="glass-card overflow-hidden border-border/50 hover:border-primary/30 group"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                                                {brand.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{brand.name}</h3>
                                                <p className="text-xs text-muted-foreground">{brand.industry}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest",
                                            brand.status === 'active' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                                        )}>
                                            {brand.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="space-y-1">
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Phase</div>
                                            <div className="text-sm font-bold capitalize">{brand.phase}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Health</div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <div key={s} className={cn("w-1.5 h-3 rounded-sm", s <= 4 ? "bg-primary" : "bg-primary/20")} />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-primary">Stable</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                            <span>Launch Progress</span>
                                            <span>{brand.progress.overall}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full premium-gradient transition-all duration-1000"
                                                style={{ width: `${brand.progress.overall}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-secondary/20 border-t border-border/50 flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        {[1, 2].map(i => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-[10px] font-bold">
                                                {i === 1 ? 'CW' : 'AS'}
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/brands/${brand.id}`}
                                        className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"
                                    >
                                        View Details <ArrowUpRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
