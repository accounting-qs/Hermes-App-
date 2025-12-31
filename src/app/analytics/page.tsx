"use client";

import React from "react";
import {
    BarChart3,
    TrendingUp,
    Users,
    PhoneCall,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Calendar
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const revenueData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
    { name: 'Jul', value: 72000 },
];

const callData = [
    { name: 'Mon', calls: 12, closed: 4 },
    { name: 'Tue', calls: 18, closed: 6 },
    { name: 'Wed', calls: 22, closed: 8 },
    { name: 'Thu', calls: 15, closed: 5 },
    { name: 'Fri', calls: 25, closed: 10 },
    { name: 'Sat', calls: 8, closed: 2 },
    { name: 'Sun', calls: 5, closed: 1 },
];

const brandMix = [
    { name: 'Quantum Scale', value: 45, color: '#6366f1' },
    { name: 'Nexus Tech', value: 25, color: '#a855f7' },
    { name: 'Growth Labs', value: 20, color: '#ec4899' },
    { name: 'Others', value: 10, color: '#94a3b8' },
];

export default function GlobalAnalyticsPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Global Analytics</h1>
                    </div>
                    <p className="text-muted-foreground">Aggregate performance metrics across all active portfolio brands.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-sm font-semibold hover:bg-secondary transition-all">
                        <Calendar className="w-4 h-4" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* High-Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Asset Value", value: "$1.2M", trend: "+12.5%", positive: true, icon: DollarSign },
                    { label: "Avg. Show Rate", value: "68.4%", trend: "+2.1%", positive: true, icon: Users },
                    { label: "Total Calls Booked", value: "482", trend: "-4.3%", positive: false, icon: PhoneCall },
                    { label: "Conversion rate", value: "18.2%", trend: "+0.8%", positive: true, icon: TrendingUp },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-bold",
                                stat.positive ? "text-green-500" : "text-red-500"
                            )}>
                                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="text-2xl font-bold mb-1">{stat.value}</div>
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg">Revenue Growth</h3>
                            <p className="text-xs text-muted-foreground">Monthly aggregate across all brands</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                ON TRACK
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111114', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Brand Mix Pie Chart */}
                <div className="glass-card p-6">
                    <h3 className="font-bold text-lg mb-1">Portfolio Distribution</h3>
                    <p className="text-xs text-muted-foreground mb-8">Revenue share by brand</p>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={brandMix}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {brandMix.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111114', border: '1px solid #27272a', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {brandMix.map((brand, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brand.color }} />
                                    <span className="text-sm font-medium">{brand.name}</span>
                                </div>
                                <span className="text-sm font-bold">{brand.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call Performance Bar Chart */}
            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="font-bold text-lg">Weekly Call Volume</h3>
                        <p className="text-xs text-muted-foreground">Booked vs Closed deals</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-primary" />
                            Booked
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-primary/40" />
                            Closed
                        </div>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={callData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111114', border: '1px solid #27272a', borderRadius: '12px' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                            <Bar dataKey="closed" fill="#6366f166" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
