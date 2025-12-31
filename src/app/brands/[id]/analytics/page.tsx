"use client";

import React from "react";
import {
    TrendingUp,
    Users,
    MousePointer2,
    Target,
    ArrowUpRight,
    Filter,
    Calendar,
    Layers,
    Zap,
    Layout
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Funnel,
    FunnelChart,
    LabelList
} from "recharts";
import { useParams } from "next/navigation";
import { useBrandStore } from "@/store/useBrandStore";

const funnelData = [
    { value: 10000, name: 'Impressions', fill: '#6366f1' },
    { value: 2500, name: 'Clicks', fill: '#818cf8' },
    { value: 800, name: 'Opt-ins', fill: '#a5b4fc' },
    { value: 150, name: 'Booked Calls', fill: '#c7d2fe' },
    { value: 30, name: 'Sales', fill: '#e0e7ff' },
];

const trafficData = [
    { name: '01/10', youtube: 4000, facebook: 2400, google: 2400 },
    { name: '02/10', youtube: 3000, facebook: 1398, google: 2210 },
    { name: '03/10', youtube: 2000, facebook: 9800, google: 2290 },
    { name: '04/10', youtube: 2780, facebook: 3908, google: 2000 },
    { name: '05/10', youtube: 1890, facebook: 4800, google: 2181 },
    { name: '06/10', youtube: 2390, facebook: 3800, google: 2500 },
    { name: '07/10', youtube: 3490, facebook: 4300, google: 2100 },
];

export default function BrandAnalyticsPage() {
    const { id } = useParams();
    const { brands } = useBrandStore();
    const brand = brands.find(b => b.id === id);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Layout className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">{brand?.name} - Performance</h1>
                    </div>
                    <p className="text-muted-foreground">Detailed acquisition and conversion metrics for the current brand.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-sm font-semibold hover:bg-secondary transition-all">
                        <Calendar className="w-4 h-4" />
                        Custom Range
                    </button>
                    <button className="p-2 bg-secondary/50 border border-border/50 rounded-xl text-muted-foreground hover:text-foreground transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Campaign Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Ad Spend", value: "$4,250", sub: "+$500 vs last week", icon: Target, color: "text-blue-500" },
                    { label: "ROAS", value: "3.42x", sub: "Goal: 3.0x", icon: TrendingUp, color: "text-green-500" },
                    { label: "Cost Per Lead", value: "$12.40", sub: "-$2.10 vs last week", icon: Users, color: "text-purple-500" },
                ].map((item, idx) => (
                    <div key={idx} className="glass-card p-6 flex items-start gap-4">
                        <div className={`p-3 rounded-2xl bg-secondary/50 ${item.color}`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold mb-1">{item.value}</div>
                            <div className="text-sm font-bold text-muted-foreground">{item.label}</div>
                            <div className="text-[10px] text-muted-foreground/60 mt-2 font-medium">{item.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversion Funnel */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-2 mb-8">
                        <Layers className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Sales Funnel</h3>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <FunnelChart>
                                <Tooltip contentStyle={{ backgroundColor: '#111114', border: '1px solid #27272a', borderRadius: '12px' }} />
                                <Funnel
                                    dataKey="value"
                                    data={funnelData}
                                    isAnimationActive
                                >
                                    <LabelList position="right" fill="#94a3b8" stroke="none" dataKey="name" />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2">
                            <Zap className="w-3 h-3" />
                            AI Optimization Tip
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your drop-off between "Opt-ins" and "Booked Calls" is higher than the industry average of 15%. Consider adding an SMS reminder sequence.
                        </p>
                    </div>
                </div>

                {/* Traffic Source Area Chart */}
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg">Traffic Channels</h3>
                        <div className="flex gap-4 text-[10px] font-bold uppercase">
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6366f1]" /> YouTube</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#a855f7]" /> Facebook</div>
                            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ec4899]" /> Google</div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#111114', border: '1px solid #27272a', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="youtube" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="facebook" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="google" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
