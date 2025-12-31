"use client";

import React, { useState } from "react";
import {
    Target,
    Plus,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Zap,
    Clock,
    ShieldCheck,
    Gem,
    Layout,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function OffersPage() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<'current' | 'generate' | 'history'>('current');

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="w-5 h-5 text-primary" />
                        <h1 className="text-3xl font-bold outfit-font">Offer Architect</h1>
                    </div>
                    <p className="text-muted-foreground">Engineering compelling high-ticket offers that convert attendees into clients.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        <Sparkles className="w-4 h-4" />
                        Generate New Variations
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Editor Section */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 p-1 bg-secondary/30 border border-border/50 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab('current')}
                            className={cn("px-6 py-2.5 rounded-xl text-xs font-bold transition-all", activeTab === 'current' ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground")}
                        >
                            Active Offer
                        </button>
                        <button
                            onClick={() => setActiveTab('generate')}
                            className={cn("px-6 py-2.5 rounded-xl text-xs font-bold transition-all", activeTab === 'generate' ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground")}
                        >
                            Idea Lab
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={cn("px-6 py-2.5 rounded-xl text-xs font-bold transition-all", activeTab === 'history' ? "bg-card text-primary shadow-lg" : "text-muted-foreground hover:text-foreground")}
                        >
                            Version History
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'current' && (
                            <motion.div
                                key="current"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <div className="glass-card p-8 border-border/50">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                                        <div>
                                            <h2 className="text-xl font-bold">The Infinity Scaling Program</h2>
                                            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Status: Approved • v2.4</div>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-[10px] font-bold">CW</div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Tagline */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary">The Core Promise</label>
                                            <input
                                                className="w-full bg-secondary/20 border border-border/50 rounded-xl py-3 px-4 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                defaultValue="Scale your agency to $100k/mo with zero manual outreach."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Price Point</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                                                    <input
                                                        className="w-full bg-secondary/20 border border-border/50 rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                        defaultValue="5,000"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Guarantee</label>
                                                <input
                                                    className="w-full bg-secondary/20 border border-border/50 rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                                                    defaultValue="10 High-Ticket Calls in 30 Days"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4">
                                            <h3 className="text-sm font-bold uppercase tracking-widest">Deliverables Inventory</h3>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { title: "Quantum Webinar CMS", val: "$2,997 Value", icon: Layout },
                                                    { title: "AI Outreach Engine Setup", val: "$1,497 Value", icon: Zap },
                                                    { title: "1:1 Strategic Roadmap", val: "$997 Value", icon: Target },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border/30 hover:border-primary/30 transition-all cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-card rounded-lg text-primary">
                                                                <item.icon className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm font-medium">{item.title}</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-green-500">{item.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 flex justify-end gap-3 pt-8 border-t border-border/50">
                                        <button className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-bold transition-all">
                                            Save as Draft
                                        </button>
                                        <button className="px-8 py-2.5 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                                            Finalize Offer
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 border-primary/20 bg-primary/5">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Offer Score
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-center py-6">
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary/50" />
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364" strokeDashoffset="40" className="text-primary" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold">89</span>
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Strong</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: "Specific Promise", score: 100 },
                                    { label: "Risk Reversal", score: 90 },
                                    { label: "Pricing / Value Gap", score: 75 },
                                ].map((s, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span>{s.label}</span>
                                            <span>{s.score}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${s.score}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Gem className="w-5 h-5 text-amber-500" />
                            Bonus Builder
                        </h2>
                        <div className="space-y-4">
                            <p className="text-xs text-muted-foreground leading-relaxed">Bonuses increase urgency and perceived value. We recommend adding at least 2 bonuses.</p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl border border-border/50">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                    <div className="text-[11px] font-medium leading-relaxed">Custom VSL Script Template ($497 Value)</div>
                                </div>
                                <button className="w-full py-2.5 border-2 border-dashed border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all">
                                    Generate Bonus Idea
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
