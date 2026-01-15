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
    AlertCircle,
    ChevronRight,
    Sparkles,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { createClient } from "@/lib/supabase-ssr/client";

export default function DashboardPage() {
    const [brands, setBrands] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { user } = useAuth();
    const supabase = createClient();

    const fetchBrands = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data) setBrands(data);
        } catch (error) {
            console.error("Dashboard: Error fetching brands:", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchBrands();
    }, []);


    const stats = React.useMemo(() => [
        { title: "Active Brands", value: brands.length, trend: "+2", isUp: true, icon: Users, color: "bg-emerald-500/10 text-emerald-500" },
        { title: "Webinars (Mo)", value: "12", trend: "+15%", isUp: true, icon: Video, color: "bg-blue-500/10 text-blue-500" },
        { title: "Avg. Show Rate", value: "42.5%", trend: "-2.4%", isUp: false, icon: BarChart3, color: "bg-purple-500/10 text-purple-500" },
        { title: "Calls Booked", value: "84", trend: "+12", isUp: true, icon: PhoneCall, color: "bg-orange-500/10 text-orange-500" },
    ], [brands.length]);

    const attentionRequired = React.useMemo(() =>
        brands.filter(b => (b.progress?.overall ?? 0) < 100).slice(0, 2),
        [brands]);

    return (
        <div className="space-y-10 pb-20 p-6 md:p-10 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight leading-none mb-2">
                        Welcome back, <span className="text-primary">{user?.name?.split(' ')[0] || "Hermes"}</span>!
                    </h1>
                    <p className="text-muted-foreground font-medium">Here's what's happening across your brands today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:bg-secondary/50 rounded-xl transition-all text-sm font-bold shadow-sm">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <span>View Analytics</span>
                    </button>
                </div>
            </div>

            {/* Hero Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-card border border-border/50 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all cursor-default"
                        >
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className={cn("p-4 rounded-2xl", stat.color)}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-xs font-black",
                                    stat.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                )}>
                                    {stat.trend}
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="text-5xl font-black mb-1">{stat.value}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-black opacity-60 font-sans">{stat.title}</div>
                            </div>

                            {/* Decorative element from image */}
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-10">
                {/* Left Column: Requiring Attention & Tasks */}
                <div className="space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                                Requiring Attention
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest opacity-60">Scanning Brands...</span>
                                </div>
                            ) : attentionRequired.length === 0 ? (
                                <div className="p-12 text-center glass-card border-dashed">
                                    <p className="text-muted-foreground text-sm">All systems normal. No brands requiring immediate attention.</p>
                                </div>
                            ) : attentionRequired.map((brand) => (
                                <div key={brand.id} className="bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer shadow-sm group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-black text-primary-foreground text-xl shadow-lg shadow-primary/20">
                                                {brand.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-base group-hover:text-primary transition-colors">{brand.name}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-70">PHASE: {brand.phase || 'N/A'}</div>
                                            </div>
                                        </div>
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                                            <span>Progress</span>
                                            <span>{brand.progress?.overall ?? 0}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${brand.progress?.overall ?? 0}%` }}
                                                className="h-full bg-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Tasks */}
                    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border/50">
                            <h2 className="text-sm font-black uppercase tracking-widest opacity-60">Ongoing Tasks</h2>
                        </div>
                        <div className="divide-y divide-border/50">
                            {[
                                { task: "Review Nexus Research", time: "2h left", priority: "high" },
                                { task: "Approve QS Offer Script", time: "Today", priority: "medium" },
                                { task: "Setup GHL for New Client", time: "Tomorrow", priority: "low" },
                            ].map((task, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-secondary/20 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                                            task.priority === "high" ? "bg-rose-500" : task.priority === "medium" ? "bg-orange-500" : "bg-emerald-500"
                                        )} />
                                        <span className="text-sm font-bold">{task.task}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-black uppercase opacity-60">{task.time}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/tasks" className="block text-center py-4 text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/5 transition-all">
                            View All Tasks
                        </Link>
                    </div>
                </div>

                {/* Right Column: Active Brands Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black tracking-tight">Active Brands</h2>
                        <Link href="/brands" className="text-sm text-primary font-black uppercase tracking-widest hover:opacity-80 transition-opacity">View All Brands</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="bg-card border border-border/50 rounded-3xl p-8 animate-pulse">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-secondary" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-secondary rounded" />
                                            <div className="h-3 w-20 bg-secondary rounded" />
                                        </div>
                                    </div>
                                    <div className="h-2.5 w-full bg-secondary rounded-full" />
                                </div>
                            ))
                        ) : brands.length === 0 ? (
                            <div className="col-span-full py-20 text-center glass-card">
                                <p className="text-muted-foreground">No active brands found. Start by creating your first brand.</p>
                                <Link href="/brands" className="inline-block mt-4 text-primary font-black uppercase tracking-widest text-xs">Go to Brands</Link>
                            </div>
                        ) : brands.map((brand, idx) => (
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:border-primary/30 group transition-all shadow-sm"
                            >
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                {brand.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-xl leading-none mb-1 group-hover:text-primary transition-colors">{brand.name}</h3>
                                                <p className="text-xs text-muted-foreground font-medium">{brand.industry}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                            brand.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {brand.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Phase</div>
                                            <div className="text-base font-black capitalize leading-none">{brand.phase || 'N/A'}</div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Health</div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <div key={s} className={cn("w-2 h-4 rounded-[1px]", s <= 4 ? "bg-emerald-500" : "bg-emerald-500/20")} />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-black text-emerald-500 ml-1">Stable</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest opacity-60">
                                            <span>Launch Progress</span>
                                            <span>{brand.progress?.overall ?? 0}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                                                style={{ width: `${brand.progress?.overall ?? 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-8 py-5 bg-secondary/10 border-t border-border/50 flex items-center justify-between group-hover:bg-secondary/20 transition-colors">
                                    <div className="flex -space-x-3">
                                        {[1, 2].map(i => (
                                            <div key={i} className="w-9 h-9 rounded-full border-4 border-card bg-secondary overflow-hidden ring-1 ring-border shadow-sm">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i === 1 ? 'Chris' : 'Alex'}`} alt="avatar" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/brands/${brand.id}`}
                                        className="text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 flex items-center gap-2 group-hover:translate-x-1 transition-all"
                                    >
                                        View Details <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Credits from Image */}
            <div className="pt-10 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 opacity-50">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">© 2024 HERMES AI • Powered by Quantum Scale</p>
                <div className="flex items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
